'use client';

import { signOut } from 'next-auth/react';
import { Bell, LogOut, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import ThemeToggle from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';

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
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            aria-label={t('notifications')}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              aria-label={t('profile')}
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{t('profile')}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="h-9 w-9 text-muted-foreground hover:text-destructive"
              title={t('signOut')}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
