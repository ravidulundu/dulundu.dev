'use client';

import { signOut } from 'next-auth/react';
import { Bell, LogOut, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { IconBadge } from '@/components/common/IconBadge';

export default function AdminHeader() {
  const t = useTranslations('admin.header');
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">{t('title')}</h2>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />

          {/* Notifications */}
          <button className="relative" aria-label={t('notifications')}>
            <IconBadge icon={Bell} variant="neutral" className="mr-0" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground" aria-label={t('profile')}>
              <IconBadge icon={User} variant="primary" />
              <span className="text-sm font-medium">{t('profile')}</span>
            </button>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg"
              title={t('signOut')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
