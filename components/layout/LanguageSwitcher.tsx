'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n';

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

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
    // Navigate to new locale
    router.push(`/${newLocale}${pathnameWithoutLocale || '/'}`);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
        <span>{localeFlags[locale]}</span>
        <span className="font-medium">{localeNames[locale]}</span>
        <svg
          className="w-4 h-4 transition-transform group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg transition-colors ${
              locale === loc ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <span className="text-xl">{localeFlags[loc]}</span>
            <span className="font-medium">{localeNames[loc]}</span>
            {locale === loc && (
              <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
