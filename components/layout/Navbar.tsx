'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import CurrencySwitcher from './CurrencySwitcher';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('home'), href: `/${locale}` },
    { name: t('services'), href: `/${locale}/services` },
    { name: t('products'), href: `/${locale}/products` },
    { name: t('portfolio'), href: `/${locale}/portfolio` },
    { name: t('blog'), href: `/${locale}/blog` },
    { name: t('contact'), href: `/${locale}/contact` },
  ];

  return (
    <nav className="bg-card shadow border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${locale}`} className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-primary">
                Dulundu.dev
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-primary px-2 xl:px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-2 ml-2">
              <ThemeToggle />
              <CurrencySwitcher />
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-card">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-border pt-3 mt-3 px-3 pb-2">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <CurrencySwitcher />
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
