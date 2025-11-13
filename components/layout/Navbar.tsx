'use client';

import { Button } from '@/components/ui/button';
import { GithubLogo, XLogo, LinkedInLogo } from '@/components/icons';
import { Logo } from './navbar/Logo';
import { NavMenu } from './navbar/NavMenu';
import { NavigationSheet } from './navbar/NavigationSheet';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  return (
    <nav className="fixed z-10 top-6 inset-x-4 h-14 bg-background border dark:border-slate-700/70 max-w-screen-md mx-auto rounded-full">
      <div className="h-full flex items-center justify-between mx-auto px-3">
        <Logo />
        <NavMenu className="hidden md:block" />
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <Button
            variant="outline"
            className="rounded-full shadow-none hidden sm:flex"
            size="icon"
            asChild
          >
            <a
              href="https://github.com/dulundu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GithubLogo className="h-5 w-5" />
            </a>
          </Button>
          <Button
            variant="outline"
            className="rounded-full shadow-none hidden sm:flex"
            size="icon"
            asChild
          >
            <a
              href="https://twitter.com/dulundu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
            >
              <XLogo className="h-5 w-5" />
            </a>
          </Button>
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
}
