'use client';

import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import Image from 'next/image';
import { BlueSkyLogo, DribbleLogo, GithubLogo, XLogo } from '@/components/icons';
import { useLocale, useTranslations } from 'next-intl';

const footerLinks = [
  {
    title: 'about',
    href: '#about',
  },
  {
    title: 'experience',
    href: '#experience',
  },
  {
    title: 'projects',
    href: '#projects',
  },
];

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');

  return (
    <footer className="mt-20">
      <div className="max-w-screen-md mx-auto">
        <div className="py-12 flex flex-col justify-start items-center">
          {/* Logo */}
          <Image src="/icon.svg" alt="Dulundu.dev" width={64} height={64} className="rounded-lg" />

          <ul className="mt-6 flex items-center gap-4 flex-wrap">
            {footerLinks.map(({ title, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t(title)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <span className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Dulundu.dev. {t('rights')}
          </span>

          <div className="flex items-center gap-5 text-muted-foreground">
            <Link href="https://github.com/dulundu" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              <GithubLogo className="h-5 w-5" />
            </Link>
            <Link href="https://twitter.com/dulundu" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              <XLogo className="h-5 w-5" />
            </Link>
            <Link href="https://bsky.app/profile/dulundu.dev" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              <BlueSkyLogo className="h-5 w-5" />
            </Link>
            <Link href="https://dribbble.com/dulundu" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              <DribbleLogo className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
