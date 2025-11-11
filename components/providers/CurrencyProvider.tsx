'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { DEFAULT_CURRENCY, normalizeCurrency } from '@/lib/currency';

interface CurrencyContextValue {
  currency: string;
  setCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {}
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

interface CurrencyProviderProps {
  initialCurrency?: string;
  children: React.ReactNode;
}

export default function CurrencyProvider({ initialCurrency, children }: CurrencyProviderProps) {
  const normalized = normalizeCurrency(initialCurrency);
  const [currency, setCurrency] = useState<string>(normalized);
  const value = useMemo(
    () => ({ currency, setCurrency }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}
