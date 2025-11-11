'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { getCurrencySymbol } from '@/lib/currency';

interface BuyButtonProps {
  productId: string;
  locale: string;
  currency?: string;
  isAvailable: boolean;
}

export default function BuyButton({ productId, locale, currency, isAvailable }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const t = useTranslations('products');
  const { currency: contextCurrency } = useCurrency();
  const activeCurrency = currency || contextCurrency;
  const currencySymbol = getCurrencySymbol(activeCurrency);

  const handleBuyNow = async () => {
    if (!isAvailable) {
      setError(
        t('currencyUnavailable', {
          currency: `${currencySymbol} ${activeCurrency}`,
          defaultMessage: 'This product is not available for the selected currency.'
        })
      );
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
          currency: activeCurrency,
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
      {showEmailForm && isAvailable && (
        <div className="p-4 border border-border rounded-lg bg-card">
          <label htmlFor="customer-email" className="block text-sm font-medium text-muted-foreground mb-2">
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
              className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
              autoFocus
              required
            />
            <button
              onClick={handleBuyNow}
              disabled={!email}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition-colors"
            >
              {t('continue', { defaultMessage: 'Continue' })}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleBuyNow}
        disabled={loading || !isAvailable}
        className={`
          w-full px-8 py-4 text-lg font-semibold rounded-lg
          transition-all duration-200
          ${
            loading || !isAvailable
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl'
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
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {!isAvailable && (
        <p className="text-sm text-muted-foreground">
          {t('chooseAnotherCurrency', {
            currency: `${currencySymbol} ${activeCurrency}`,
            defaultMessage: 'Select another currency to enable checkout.'
          })}
        </p>
      )}
    </div>
  );
}
