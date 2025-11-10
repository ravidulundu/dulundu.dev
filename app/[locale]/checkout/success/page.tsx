import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from "next/navigation";

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
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            {t('sessionNotFound', { defaultMessage: 'Session Not Found' })}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('sessionNotFoundDesc', {
              defaultMessage: 'We could not find your order. Please contact support if you need assistance.',
            })}
          </p>
          <Link
            href={`/${params.locale}`}
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {t('backToHome', { defaultMessage: 'Back to Home' })}
          </Link>
        </div>
      </div>
    );
  }

  const { session, order } = result;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
          <svg
            className="w-12 h-12 text-green-600 dark:text-green-400"
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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('thankYou', { defaultMessage: 'Thank You!' })}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {t('orderConfirmed', {
            defaultMessage: 'Your order has been confirmed and is being processed.',
          })}
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          {t('orderDetails', { defaultMessage: 'Order Details' })}
        </h2>

        {order && (
          <div className="space-y-4 mb-6">
            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
              <span className="text-gray-600 dark:text-gray-400">
                {t('orderNumber', { defaultMessage: 'Order Number' })}
              </span>
              <span className="font-mono text-gray-900 dark:text-white">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
              <span className="text-gray-600 dark:text-gray-400">
                {t('email', { defaultMessage: 'Email' })}
              </span>
              <span className="text-gray-900 dark:text-white">{order.customerEmail}</span>
            </div>

            <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
              <span className="text-gray-600 dark:text-gray-400">
                {t('status', { defaultMessage: 'Status' })}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
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
                  className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-3"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {translation?.title || 'Product'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('quantity', { defaultMessage: 'Quantity' })}: {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.currency} {item.price.toString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-4 border-t-2 border-gray-300 dark:border-gray-600">
          <span>{t('total', { defaultMessage: 'Total' })}</span>
          <span>
            {session.currency?.toUpperCase()} {(session.amount_total! / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Confirmation Email Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <div className="flex items-start">
          <svg
            className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5"
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
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
              {t('emailSent', { defaultMessage: 'Confirmation Email Sent' })}
            </h3>
            <p className="text-blue-700 dark:text-blue-400 text-sm">
              {t('emailSentDesc', { email: session.customer_email || '' })}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Link
          href={`/${params.locale}`}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          {t('continueShopping', { defaultMessage: 'Continue Shopping' })}
        </Link>
      </div>
    </div>
  );
}
