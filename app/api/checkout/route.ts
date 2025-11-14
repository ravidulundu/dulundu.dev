import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createCheckoutSession, ensureStripePrice, ensureStripeProduct } from '@/lib/stripe';
import { normalizeCurrency } from '@/lib/currency';
import { getPreferredCurrencyFromRequest } from '@/lib/currency-preferences';
import { defaultLocale } from '@/i18n';
import { getTranslations } from 'next-intl/server';
import { validateEmail } from '@/lib/validation';
import { checkRateLimit, getClientIp, checkoutRateLimiter } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // BUG-NEW-001 FIX: Rate limiting protection for checkout
    const clientIp = getClientIp(req);
    const rateLimitResult = await checkRateLimit(
      `checkout:${clientIp}`,
      checkoutRateLimiter,
      2 // 2 requests per minute
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many checkout attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const { productId, customerEmail, locale: localeInput, currency } = await req.json();
    const locale = localeInput || defaultLocale;
    const t = await getTranslations({ locale, namespace: 'products' });

    if (!productId || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const validatedEmail = validateEmail(customerEmail);
    if (!validatedEmail) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get product
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        translations: true,
        prices: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const preferredCurrency = getPreferredCurrencyFromRequest(req, locale);
    const normalizedCurrency = normalizeCurrency(currency || preferredCurrency);
    const priceEntry =
      product.prices.find((price) => price.currency === normalizedCurrency) ||
      product.prices.find((price) => price.currency === product.currency) ||
      product.prices[0];

    if (!priceEntry) {
      console.warn('Checkout blocked: missing price for currency', {
        productId,
        normalizedCurrency,
        locale
      });
      return NextResponse.json(
        {
          error: t('currencyUnavailable', {
            currency: normalizedCurrency,
            defaultMessage: 'This product is not available in the selected currency.'
          })
        },
        { status: 400 }
      );
    }

    const translation =
      product.translations.find((t) => t.locale === locale) || product.translations[0];

    const stripeProductId = await ensureStripeProduct({
      stripeProductId: product.stripeProductId,
      name: translation?.title || product.slug,
      description: translation?.description || undefined,
      metadata: {
        productId: product.id,
        slug: product.slug,
      },
    });

    if (stripeProductId !== product.stripeProductId) {
      await db.product.update({
        where: { id: product.id },
        data: { stripeProductId },
      });
    }

    let stripePriceId = priceEntry.stripePriceId;

    if (!stripePriceId) {
      stripePriceId = await ensureStripePrice({
        stripeProductId,
        currency: priceEntry.currency,
        amount: priceEntry.amount.toString(),
        stripePriceId: priceEntry.stripePriceId,
      });

      await db.productPrice.update({
        where: { id: priceEntry.id },
        data: { stripePriceId },
      });
    }

    // Create order
    const order = await db.order.create({
      data: {
        customerEmail: validatedEmail,
        total: priceEntry.amount,
        currency: priceEntry.currency,
        status: 'pending',
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            price: priceEntry.amount,
            currency: priceEntry.currency,
          },
        },
      },
    });

    // Create Stripe checkout session
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const session = await createCheckoutSession({
      priceId: stripePriceId,
      successUrl: `${baseUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/${locale}/checkout/cancel`,
      customerEmail: validatedEmail,
      metadata: {
        orderId: order.id,
        productId: product.id,
        currency: priceEntry.currency,
      },
    });

    // Update order with session ID
    await db.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
