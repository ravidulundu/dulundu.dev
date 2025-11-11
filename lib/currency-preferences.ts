import { cookies, headers } from 'next/headers'
import { NextRequest } from 'next/server'
import { resolvePreferredCurrency } from './currency'

export function getPreferredCurrencyForRequest(locale?: string | null) {
  const cookieStore = cookies()
  const countryHeader =
    headers().get('x-vercel-ip-country') || headers().get('cf-ipcountry') || null

  return resolvePreferredCurrency({
    locale: locale || undefined,
    country: countryHeader
  })
}

export function getPreferredCurrencyFromRequest(req: NextRequest, locale?: string | null) {
  const countryHeader = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || null

  return resolvePreferredCurrency({
    locale: locale || undefined,
    country: countryHeader
  })
}
