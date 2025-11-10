'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface BuyButtonProps {
  productId: string;
  stripePriceId: string;
  locale: string;
}

export default function BuyButton({ productId, stripePriceId, locale }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('products');

  const handleBuyNow = async () => {
    if (!stripePriceId) {
      setError(t('notAvailable', { defaultMessage: 'This product is not available for purchase' }));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get customer email (you might want to add an email input or get from session)
      const customerEmail = prompt(
        t('enterEmail', { defaultMessage: 'Please enter your email address' })
      );

      if (!customerEmail) {
        setLoading(false);
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        setError(t('invalidEmail', { defaultMessage: 'Please enter a valid email address' }));
        setLoading(false);
        return;
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          customerEmail,
          locale,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Checkout failed');
      }

      const { url } = await res.json();

      if (!url) {
        throw new Error('No checkout URL received');
      }

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(
        err instanceof Error
          ? err.message
          : t('checkoutError', { defaultMessage: 'Failed to initiate checkout. Please try again.' })
      );
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleBuyNow}
        disabled={loading || !stripePriceId}
        className={`
          px-8 py-4 text-lg font-semibold rounded-lg
          transition-all duration-200
          ${
            loading || !stripePriceId
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
          }
        `}
      >
        {loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {t('processing', { defaultMessage: 'Processing...' })}
          </span>
        ) : (
          t('buyNow', { defaultMessage: 'Buy Now' })
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
