import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
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
  // Check for IP-based locale detection BEFORE i18n routing
  const pathname = request.nextUrl.pathname;
  const hasLocaleInPath = locales.some(locale =>
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Only auto-detect on first visit (when no locale is in path and no cookie)
  if (!hasLocaleInPath && !request.cookies.has('NEXT_LOCALE')) {
    const ipLocale = getLocaleFromIP(request);
    if (ipLocale && locales.includes(ipLocale as any)) {
      // Create redirect response with cookie
      const url = request.nextUrl.clone();
      url.pathname = `/${ipLocale}${pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set('NEXT_LOCALE', ipLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
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

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
