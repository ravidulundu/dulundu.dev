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
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const t = useTranslations('products');

  const handleBuyNow = async () => {
    if (!stripePriceId) {
      setError(t('notAvailable', { defaultMessage: 'This product is not available for purchase' }));
      return;
    }

    // Show email form if email not provided
    if (!email) {
      setShowEmailForm(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError(t('invalidEmail', { defaultMessage: 'Please enter a valid email address' }));
        setLoading(false);
        return;
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          customerEmail: email,
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
    <div className="space-y-4">
      {showEmailForm && !email && (
        <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <label htmlFor="customer-email" className="block text-sm font-medium mb-2">
            {t('emailLabel', { defaultMessage: 'Email Address' })}
          </label>
          <div className="flex gap-2">
            <input
              id="customer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleBuyNow();
                }
              }}
              placeholder={t('emailPlaceholder', { defaultMessage: 'you@example.com' })}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              autoFocus
              required
            />
            <button
              onClick={handleBuyNow}
              disabled={!email}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {t('continue', { defaultMessage: 'Continue' })}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleBuyNow}
        disabled={loading || !stripePriceId}
        className={`
          w-full px-8 py-4 text-lg font-semibold rounded-lg
          transition-all duration-200
          ${
            loading || !stripePriceId
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
          }
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center">
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
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
