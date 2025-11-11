import Stripe from 'stripe';

// Lazy initialization - only throw error when stripe is actually used
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia' as Stripe.StripeConfig['apiVersion'],
      typescript: true,
    });
  }
  return stripeInstance;
}

export const stripe = new Proxy({} as Stripe, {
  get: (target, prop) => {
    const stripe = getStripe();
    const value = stripe[prop as keyof Stripe];
    return typeof value === 'function' ? value.bind(stripe) : value;
  }
});

export async function ensureStripeProduct({
  stripeProductId,
  name,
  description,
  metadata,
}: {
  stripeProductId?: string | null;
  name: string;
  description?: string | null;
  metadata?: Stripe.MetadataParam;
}) {
  if (stripeProductId) {
    await stripe.products.update(stripeProductId, {
      name,
      description: description ?? undefined,
      metadata,
      active: true,
    });
    return stripeProductId;
  }

  const product = await stripe.products.create({
    name,
    description: description ?? undefined,
    metadata,
  });

  return product.id;
}

export async function ensureStripePrice({
  stripeProductId,
  currency,
  amount,
  stripePriceId,
}: {
  stripeProductId: string;
  currency: string;
  amount: string | number;
  stripePriceId?: string | null;
}) {
  if (stripePriceId) {
    return stripePriceId;
  }

  const stripePrice = await stripe.prices.create({
    product: stripeProductId,
    unit_amount: Math.round(Number(amount) * 100),
    currency: currency.toLowerCase(),
  });

  return stripePrice.id;
}

// Create checkout session
export async function createCheckoutSession({
  priceId,
  successUrl,
  cancelUrl,
  customerEmail,
  metadata,
}: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Stripe.MetadataParam;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata,
  });

  return session;
}
