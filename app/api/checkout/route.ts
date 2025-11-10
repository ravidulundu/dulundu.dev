import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { productId, customerEmail, locale } = await req.json();

    if (!productId || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get product
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        translations: true,
      },
    });

    if (!product || !product.stripePriceId) {
      return NextResponse.json(
        { error: 'Product not found or not configured' },
        { status: 404 }
      );
    }

    // Create order
    const order = await db.order.create({
      data: {
        customerEmail,
        total: product.price,
        currency: product.currency,
        status: 'pending',
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            price: product.price,
            currency: product.currency,
          },
        },
      },
    });

    // Create Stripe checkout session
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const session = await createCheckoutSession({
      priceId: product.stripePriceId,
      successUrl: `${baseUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/${locale}/checkout/cancel`,
      customerEmail,
      metadata: {
        orderId: order.id,
        productId: product.id,
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
