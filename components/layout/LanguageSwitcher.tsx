'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { locales } from '@/i18n';
import { getCurrencyForLocale } from '@/lib/currency';
import { FlagIcon } from '@/components/common/FlagIcon';
import { useCurrency } from '@/components/providers/CurrencyProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const localeNames: Record<string, string> = {
  'en': 'English',
  'tr': 'Türkçe',
  'pt-BR': 'Português (BR)'
};

const localeToCountry: Record<string, string> = {
  'en': 'US',
  'tr': 'TR',
  'pt-BR': 'BR'
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { setCurrency } = useCurrency();

  const switchLocale = (newLocale: string) => {
    // Extract path without locale prefix
    // More robust: split by / and reconstruct without first locale segment
    const segments = pathname.split('/').filter(Boolean);

    // Remove current locale if it's the first segment
    if (segments[0] && locales.includes(segments[0] as any)) {
      segments.shift();
    }

    // Build new path with new locale
    const pathWithoutLocale = segments.length > 0 ? `/${segments.join('/')}` : '';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    const targetCurrency = getCurrencyForLocale(newLocale);

    setCurrency(targetCurrency);

    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border-border"
          aria-label="Switch language"
          disabled={isPending}
        >
          <FlagIcon code={localeToCountry[locale]} className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onSelect={(event) => {
              event.preventDefault();
              switchLocale(loc);
            }}
            className="flex items-center gap-3"
            disabled={isPending}
          >
            <FlagIcon code={localeToCountry[loc]} className="w-5 h-5" />
            <span className="text-sm font-medium">{localeNames[loc]}</span>
            {locale === loc && (
              <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
