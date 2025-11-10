import Stripe from 'stripe';

// Lazy initialization - only throw error when stripe is actually used
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
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

// Create or update product in Stripe
export async function syncProductToStripe(product: {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  stripeProductId?: string | null;
}) {
  try {
    let stripeProduct: Stripe.Product;

    if (product.stripeProductId) {
      // Update existing product
      stripeProduct = await stripe.products.update(product.stripeProductId, {
        name: product.title,
        description: product.description,
        active: true,
      });
    } else {
      // Create new product
      stripeProduct = await stripe.products.create({
        name: product.title,
        description: product.description,
        metadata: {
          productId: product.id,
        },
      });
    }

    // Create or update price
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(product.price * 100), // Convert to cents
      currency: product.currency.toLowerCase(),
    });

    return {
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
    };
  } catch (error) {
    console.error('Error syncing product to Stripe:', error);
    throw error;
  }
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
