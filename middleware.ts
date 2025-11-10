import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n';

// IP-based locale detection function
function getLocaleFromIP(request: NextRequest): string | null {
  // Get client's country from headers (Vercel provides this automatically)
  const country = request.geo?.country || request.headers.get('x-vercel-ip-country');

  // Map countries to locales
  const countryLocaleMap: Record<string, string> = {
    'TR': 'tr',      // Turkey
    'BR': 'pt-BR',   // Brazil
    'PT': 'pt-BR',   // Portugal (using pt-BR as fallback)
    'US': 'en',      // United States
    'GB': 'en',      // United Kingdom
    'CA': 'en',      // Canada
    'AU': 'en',      // Australia
  };

  return country ? countryLocaleMap[country] || null : null;
}

export default function middleware(request: NextRequest) {
  // Get locale from IP if not already set
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
    localeDetection: true,
    localePrefix: 'always' // Always show locale in URL
  });

  const response = handleI18nRouting(request);

  // If user hasn't explicitly chosen a locale, try to detect from IP
  const pathname = request.nextUrl.pathname;
  const hasLocaleInPath = locales.some(locale =>
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Only auto-detect on first visit (when no locale is in path)
  if (!hasLocaleInPath && !request.cookies.has('NEXT_LOCALE')) {
    const ipLocale = getLocaleFromIP(request);
    if (ipLocale && locales.includes(ipLocale as any)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${ipLocale}${pathname}`;
      response.cookies.set('NEXT_LOCALE', ipLocale);
    }
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
