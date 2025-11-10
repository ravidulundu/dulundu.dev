import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { getRequiredEnv } from '@/lib/env';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = getRequiredEnv('STRIPE_WEBHOOK_SECRET');
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Update order status
      if (session.metadata?.orderId) {
        await db.order.update({
          where: { id: session.metadata.orderId },
          data: {
            status: 'completed',
            stripePaymentIntent: session.payment_intent as string,
          },
        });
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata?.orderId) {
        await db.order.update({
          where: { id: session.metadata.orderId },
          data: { status: 'failed' },
        });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Find and update order
      const order = await db.order.findFirst({
        where: { stripePaymentIntent: paymentIntent.id },
      });

      if (order) {
        await db.order.update({
          where: { id: order.id },
          data: { status: 'failed' },
        });
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
