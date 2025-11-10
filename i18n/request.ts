import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Supported locales
export const locales = ['en', 'tr', 'pt-BR'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  // Don't call notFound(), just use default locale if invalid
  const validLocale = locales.includes(locale as Locale) ? locale : defaultLocale;

  return {
    locale: validLocale as string,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});
