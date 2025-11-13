import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isValidLocale } from './i18n';
import { CURRENCY_COOKIE, DEFAULT_CURRENCY, getCurrencyForCountry, getCurrencyForLocale } from './lib/currency';

const countryLocaleMap: Record<string, string> = {
  'TR': 'tr',
  'BR': 'pt-BR',
  'PT': 'pt-BR',
  'US': 'en',
  'GB': 'en',
  'CA': 'en',
  'AU': 'en'
};

function getLocaleFromCountry(country: string | null): string | null {
  return country ? countryLocaleMap[country] || null : null;
}

function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  const localeCandidate = segments[0];
  return localeCandidate && isValidLocale(localeCandidate) ? localeCandidate : null;
}

export default function middleware(request: NextRequest) {
  // Check for IP-based locale detection BEFORE i18n routing
  const pathname = request.nextUrl.pathname;
  const hasLocaleInPath = locales.some(locale =>
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  const detectedCountry = request.geo?.country || request.headers.get('x-vercel-ip-country');
  const existingCurrency = request.cookies.get(CURRENCY_COOKIE)?.value;

  // Only auto-detect on first visit (when no locale is in path and no cookie)
  if (!hasLocaleInPath && !request.cookies.has('NEXT_LOCALE')) {
    const ipLocale = getLocaleFromCountry(detectedCountry);
    if (ipLocale && isValidLocale(ipLocale)) {
      // Create redirect response with cookie
      const url = request.nextUrl.clone();
      url.pathname = `/${ipLocale}${pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set('NEXT_LOCALE', ipLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
      const currency = detectedCountry
        ? getCurrencyForCountry(detectedCountry)
        : getCurrencyForLocale(ipLocale);
      if (!existingCurrency) {
        response.cookies.set(CURRENCY_COOKIE, currency || DEFAULT_CURRENCY, {
          maxAge: 60 * 60 * 24 * 365,
          path: '/',
        });
      }
      return response;
    }
  }

  // Handle i18n routing
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
    localeDetection: true,
    localePrefix: 'always' // Always show locale in URL
  });

  const response = handleI18nRouting(request);
  const localeFromPath = getLocaleFromPath(pathname);
  if (localeFromPath && !existingCurrency) {
    const currency = getCurrencyForLocale(localeFromPath) || DEFAULT_CURRENCY;
    response.cookies.set(CURRENCY_COOKIE, currency, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }
  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
