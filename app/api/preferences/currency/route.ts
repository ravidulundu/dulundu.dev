import { NextRequest, NextResponse } from 'next/server'
import { CURRENCY_COOKIE, normalizeCurrency } from '@/lib/currency'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const requestedCurrency = body?.currency

  const normalized = normalizeCurrency(requestedCurrency)
  const response = NextResponse.json({ currency: normalized })

  response.cookies.set(CURRENCY_COOKIE, normalized, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })

  return response
}

export async function GET(req: NextRequest) {
  const current = req.cookies.get(CURRENCY_COOKIE)?.value
  const normalized = normalizeCurrency(current)
  return NextResponse.json({ currency: normalized })
}
