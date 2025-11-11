import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import CurrencyProvider from '@/components/providers/CurrencyProvider';
import ThemeProvider from '@/components/providers/ThemeProvider';
import { getPreferredCurrencyForRequest } from '@/lib/currency-preferences';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/lora/500.css';
import '@fontsource/roboto-mono/400.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages({ locale });
  const preferredCurrency = getPreferredCurrencyForRequest(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <CurrencyProvider initialCurrency={preferredCurrency}>
            <NextIntlClientProvider locale={locale} messages={messages}>
              {children}
              <Toaster />
            </NextIntlClientProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
