export const SUPPORTED_CURRENCIES = ['USD', 'TRY', 'BRL'] as const
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

export const DEFAULT_CURRENCY: SupportedCurrency = 'USD'
export const CURRENCY_COOKIE = 'PREFERRED_CURRENCY'
const PRICE_MARGIN = 1.04 // 4% buffer to avoid FX loss

const localeCurrencyMap: Record<string, SupportedCurrency> = {
  en: 'USD',
  'pt-BR': 'BRL',
  tr: 'TRY'
}

const countryCurrencyMap: Record<string, SupportedCurrency> = {
  US: 'USD',
  CA: 'USD',
  AU: 'USD',
  GB: 'USD',
  TR: 'TRY',
  BR: 'BRL',
  PT: 'BRL' // fallback to Portuguese currency support
}

const currencySymbols: Record<SupportedCurrency, string> = {
  USD: '$',
  TRY: '₺',
  BRL: 'R$'
}

// Rates relative to USD. Update periodically or move to a dynamic source if needed.
const currencyRates: Record<SupportedCurrency, number> = {
  USD: 1,
  TRY: 33.5,
  BRL: 5.4
}

function resolveLocale(locale?: string | null) {
  if (!locale) return 'en-US'

  try {
    const supported = Intl.NumberFormat.supportedLocalesOf([locale])
    if (supported.length > 0) {
      return supported[0]
    }
  } catch (error) {
    console.warn('Locale resolution failed for currency formatting:', error)
  }

  return 'en-US'
}

export function getSupportedCurrencies() {
  return SUPPORTED_CURRENCIES
}

export function normalizeCurrency(code?: string | null): SupportedCurrency {
  if (!code) return DEFAULT_CURRENCY
  const upper = code.toUpperCase()
  return SUPPORTED_CURRENCIES.find((currency) => currency === upper) ?? DEFAULT_CURRENCY
}

export function getCurrencySymbol(code?: string | null) {
  const normalized = normalizeCurrency(code)
  return currencySymbols[normalized] ?? normalized
}

export function normalizePriceOverrides(
  overrides?: Record<string, string | number>
): Partial<Record<SupportedCurrency, string>> {
  if (!overrides) {
    return {}
  }

  const normalized: Partial<Record<SupportedCurrency, string>> = {}

  Object.entries(overrides).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    const amount = typeof value === 'number' ? value : parseFloat(value)
    if (Number.isNaN(amount) || amount <= 0) {
      return
    }

    const currency = normalizeCurrency(key)
    normalized[currency] = amount.toFixed(2)
  })

  return normalized
}

export function getCurrencyForLocale(locale?: string | null): SupportedCurrency {
  if (!locale) return DEFAULT_CURRENCY
  return localeCurrencyMap[locale] ?? DEFAULT_CURRENCY
}

export function getCurrencyForCountry(country?: string | null): SupportedCurrency {
  if (!country) return DEFAULT_CURRENCY
  return countryCurrencyMap[country] ?? DEFAULT_CURRENCY
}

export function resolvePreferredCurrency({
  locale,
  country
}: {
  locale?: string
  country?: string | null
}) {
  if (locale) {
    return getCurrencyForLocale(locale)
  }
  if (country) {
    return getCurrencyForCountry(country)
  }
  return DEFAULT_CURRENCY
}

function convertToUSD(amount: number, fromCurrency: SupportedCurrency) {
  const rate = currencyRates[fromCurrency]
  return amount / rate
}

function convertFromUSD(usdAmount: number, targetCurrency: SupportedCurrency) {
  const rate = currencyRates[targetCurrency]
  return usdAmount * rate * PRICE_MARGIN
}

export function convertAmount(
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency
) {
  if (fromCurrency === toCurrency) {
    return amount
  }

  const usdAmount = convertToUSD(amount, fromCurrency)
  return convertFromUSD(usdAmount, toCurrency)
}

export function generatePriceMap(
  baseAmountInput: string | number,
  baseCurrencyInput: string,
  overrides?: Partial<Record<SupportedCurrency, string>>
) {
  const baseCurrency = normalizeCurrency(baseCurrencyInput)
  const baseAmount =
    typeof baseAmountInput === 'string' ? parseFloat(baseAmountInput) : baseAmountInput

  const priceMap: Record<SupportedCurrency, string> = {} as Record<
    SupportedCurrency,
    string
  >

  for (const currency of SUPPORTED_CURRENCIES) {
    if (overrides?.[currency]) {
      priceMap[currency] = overrides[currency]!
      continue
    }

    if (currency === baseCurrency) {
      priceMap[currency] = baseAmount.toFixed(2)
      continue
    }

    const converted = convertAmount(baseAmount, baseCurrency, currency)
    priceMap[currency] = converted.toFixed(2)
  }

  return priceMap
}

export function formatCurrencyAmount({
  amount,
  currency,
  locale,
  minimumFractionDigits = 2
}: {
  amount: number | string
  currency?: string | null
  locale?: string | null
  minimumFractionDigits?: number
}) {
  if (amount === undefined || amount === null) {
    return ''
  }

  const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (!Number.isFinite(parsedAmount)) {
    return String(amount)
  }

  const normalizedCurrency = normalizeCurrency(currency)
  const resolvedLocale = resolveLocale(locale)

  try {
    return new Intl.NumberFormat(resolvedLocale, {
      style: 'currency',
      currency: normalizedCurrency,
      minimumFractionDigits,
      maximumFractionDigits: Math.max(2, minimumFractionDigits)
    }).format(parsedAmount)
  } catch (error) {
    console.warn('Currency formatting failed:', error)
    return `${getCurrencySymbol(normalizedCurrency)} ${parsedAmount.toFixed(2)}`
  }
}
