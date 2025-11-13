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
    // Use stricter tolerance window (60s instead of default 300s)
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
      60 // tolerance in seconds
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Update order status with idempotency check
      if (session.metadata?.orderId) {
        // First, fetch the current order to check its status
        const order = await db.order.findUnique({
          where: { id: session.metadata.orderId },
          select: { status: true },
        });

        // Only update if order is still pending (idempotency)
        if (order && order.status === 'pending') {
          await db.order.update({
            where: { id: session.metadata.orderId },
            data: {
              status: 'completed',
              stripePaymentIntent: session.payment_intent as string,
            },
          });
        } else if (!order) {
          console.error(`Order not found for session ${session.id}:`, session.metadata.orderId);
        } else {
          console.log(`Order ${session.metadata.orderId} already processed with status: ${order.status}`);
        }
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata?.orderId) {
        // Only update if order is still pending
        const order = await db.order.findUnique({
          where: { id: session.metadata.orderId },
          select: { status: true },
        });

        if (order && order.status === 'pending') {
          await db.order.update({
            where: { id: session.metadata.orderId },
            data: { status: 'failed' },
          });
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Find and update order - only if still pending
      const order = await db.order.findFirst({
        where: { stripePaymentIntent: paymentIntent.id },
        select: { id: true, status: true },
      });

      if (order && order.status === 'pending') {
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
