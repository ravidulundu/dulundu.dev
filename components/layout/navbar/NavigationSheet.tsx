'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Logo } from './Logo';
import { NavMenu } from './NavMenu';
import ThemeToggle from '../ThemeToggle';
import LanguageSwitcher from '../LanguageSwitcher';

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full shadow-none">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="pt-6 px-6">
        <Logo />
        <NavMenu orientation="vertical" className="mt-12" />
        <div className="mt-8 flex items-center gap-3 border-t border-border pt-4">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
};
