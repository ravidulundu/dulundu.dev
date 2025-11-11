import { cookies, headers } from 'next/headers'
import { NextRequest } from 'next/server'
import { CURRENCY_COOKIE, resolvePreferredCurrency } from './currency'

export function getPreferredCurrencyForRequest(locale?: string | null) {
  const cookieStore = cookies()
  const cookieCurrency = cookieStore.get(CURRENCY_COOKIE)?.value ?? null
  const countryHeader =
    headers().get('x-vercel-ip-country') || headers().get('cf-ipcountry') || null

  return resolvePreferredCurrency({
    locale: locale || undefined,
    country: countryHeader,
    cookieCurrency
  })
}

export function getPreferredCurrencyFromRequest(req: NextRequest, locale?: string | null) {
  const cookieCurrency = req.cookies.get(CURRENCY_COOKIE)?.value ?? null
  const countryHeader = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || null

  return resolvePreferredCurrency({
    locale: locale || undefined,
    country: countryHeader,
    cookieCurrency
  })
}
