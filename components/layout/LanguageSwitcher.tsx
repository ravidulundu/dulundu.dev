'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { locales } from '@/i18n';
import { getCurrencyForLocale } from '@/lib/currency';
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

const localeFlags: Record<string, string> = {
  'en': '🇺🇸',
  'tr': '🇹🇷',
  'pt-BR': '🇧🇷'
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

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

    startTransition(async () => {
      await fetch('/api/preferences/currency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currency: targetCurrency })
      });
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
          <span className="text-lg leading-none">{localeFlags[locale]}</span>
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
            <span className="text-lg">{localeFlags[loc]}</span>
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
