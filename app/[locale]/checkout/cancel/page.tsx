import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  return {
    title: 'Payment Cancelled',
    description: 'Your payment was cancelled',
  };
}

export default async function CheckoutCancelPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('checkout');

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Cancel Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mb-6">
          <svg
            className="w-12 h-12 text-yellow-600 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('paymentCancelled', { defaultMessage: 'Payment Cancelled' })}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {t('paymentCancelledDesc', {
            defaultMessage: 'Your payment was cancelled and no charges were made.',
          })}
        </p>
      </div>

      {/* Information Box */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('whatHappened', { defaultMessage: 'What Happened?' })}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('cancelledExplanation', {
            defaultMessage:
              'You cancelled the payment process before it was completed. No charges have been made to your account, and your order was not created.',
          })}
        </p>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            {t('nextSteps', { defaultMessage: 'What Can You Do Next?' })}
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span>
                {t('tryAgain', {
                  defaultMessage: 'Try purchasing again if you want to complete the order',
                })}
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span>
                {t('browseProducts', {
                  defaultMessage: 'Browse other products that might interest you',
                })}
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span>
                {t('contactSupport', {
                  defaultMessage: 'Contact us if you need help or have questions',
                })}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/${params.locale}`}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium text-center"
        >
          {t('backToHome', { defaultMessage: 'Back to Home' })}
        </Link>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          {t('tryAgainButton', { defaultMessage: 'Try Again' })}
        </button>
      </div>

      {/* Help Section */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {t('needHelp', { defaultMessage: 'Need help?' })}{' '}
          <Link
            href={`/${params.locale}/contact`}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            {t('contactUs', { defaultMessage: 'Contact us' })}
          </Link>
        </p>
      </div>
    </div>
  );
}
