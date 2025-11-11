import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from "next/navigation";
import PageWrapper from '@/components/layout/PageWrapper';

async function getOrderDetails(sessionId: string) {
  try {
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    if (!session) {
      return null;
    }

    // Get order from database
    const order = await db.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
    });

    return {
      session,
      order,
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  return {
    title: 'Order Successful',
    description: 'Your order has been completed successfully',
  };
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { session_id?: string };
}) {
  const t = await getTranslations('checkout');

  if (!searchParams.session_id) {
    notFound();
  }

  const result = await getOrderDetails(searchParams.session_id);

  if (!result) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            {t('sessionNotFound', { defaultMessage: 'Session Not Found' })}
          </h1>
          <p className="text-muted-foreground dark:text-muted-foreground/70 mb-6">
            {t('sessionNotFoundDesc', {
              defaultMessage: 'We could not find your order. Please contact support if you need assistance.',
            })}
          </p>
          <Link
            href={`/${params.locale}`}
            className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          >
            {t('backToHome', { defaultMessage: 'Back to Home' })}
          </Link>
        </div>
      </div>
      </PageWrapper>
    );
  }

  const { session, order } = result;

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full mb-6">
          <svg
            className="w-12 h-12 text-primary dark:text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-foreground dark:text-white mb-4">
          {t('thankYou', { defaultMessage: 'Thank You!' })}
        </h1>
        <p className="text-xl text-muted-foreground dark:text-muted-foreground/70">
          {t('orderConfirmed', {
            defaultMessage: 'Your order has been confirmed and is being processed.',
          })}
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-card dark:bg-card rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-semibold text-foreground dark:text-white mb-6">
          {t('orderDetails', { defaultMessage: 'Order Details' })}
        </h2>

        {order && (
          <div className="space-y-4 mb-6">
            <div className="flex justify-between border-b border-border dark:border-border pb-3">
              <span className="text-muted-foreground dark:text-muted-foreground">
                {t('orderNumber', { defaultMessage: 'Order Number' })}
              </span>
              <span className="font-mono text-foreground dark:text-white">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between border-b border-border dark:border-border pb-3">
              <span className="text-muted-foreground dark:text-muted-foreground">
                {t('email', { defaultMessage: 'Email' })}
              </span>
              <span className="text-foreground dark:text-white">{order.customerEmail}</span>
            </div>

            <div className="flex justify-between border-b border-border dark:border-border pb-3">
              <span className="text-muted-foreground dark:text-muted-foreground">
                {t('status', { defaultMessage: 'Status' })}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary">
                {order.status === 'completed'
                  ? t('completed', { defaultMessage: 'Completed' })
                  : order.status === 'pending'
                  ? t('pending', { defaultMessage: 'Pending' })
                  : order.status}
              </span>
            </div>

            {order.items.map((item) => {
              const translation = item.product.translations.find(
                (tr) => tr.locale === params.locale
              ) || item.product.translations[0];

              return (
                <div
                  key={item.id}
                  className="flex justify-between border-b border-border dark:border-border pb-3"
                >
                  <div>
                    <p className="font-medium text-foreground dark:text-white">
                      {translation?.title || 'Product'}
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                      {t('quantity', { defaultMessage: 'Quantity' })}: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-foreground dark:text-white">
                    {item.currency} {item.price.toString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between text-lg font-bold text-foreground dark:text-white pt-4 border-t-2 border-border dark:border-border">
          <span>{t('total', { defaultMessage: 'Total' })}</span>
          <span>
            {session.currency?.toUpperCase()} {(session.amount_total! / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Confirmation Email Notice */}
      <div className="bg-muted dark:bg-primary/20 border border-primary/30 dark:border-primary rounded-lg p-6 mb-6">
        <div className="flex items-start">
          <svg
            className="w-6 h-6 text-primary dark:text-primary mr-3 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-primary dark:text-primary mb-1">
              {t('emailSent', { defaultMessage: 'Confirmation Email Sent' })}
            </h3>
            <p className="text-primary dark:text-primary text-sm">
              {t('emailSentDesc', { email: session.customer_email || '' })}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Link
          href={`/${params.locale}`}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium"
        >
          {t('continueShopping', { defaultMessage: 'Continue Shopping' })}
        </Link>
      </div>
    </div>
    </PageWrapper>
  );
}
