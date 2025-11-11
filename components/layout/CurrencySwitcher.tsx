'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { SUPPORTED_CURRENCIES, getCurrencySymbol } from '@/lib/currency';
import { useCurrency } from '@/components/providers/CurrencyProvider';

export default function CurrencySwitcher() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('nav');
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCurrency = event.target.value;
    setCurrency(nextCurrency);

    startTransition(async () => {
      await fetch('/api/preferences/currency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currency: nextCurrency })
      });
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="currency-switcher" className="text-muted-foreground text-xs sm:text-sm hidden sm:inline">
        {t('currency', { defaultMessage: 'Currency' })}
      </label>
      <select
        id="currency-switcher"
        value={currency}
        onChange={handleChange}
        disabled={isPending}
        className="bg-card border border-border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors hover:bg-muted"
        aria-label={t('currency', { defaultMessage: 'Currency' })}
      >
        {SUPPORTED_CURRENCIES.map((code) => (
          <option key={code} value={code}>
            {getCurrencySymbol(code)} {code}
          </option>
        ))}
      </select>
    </div>
  );
}
