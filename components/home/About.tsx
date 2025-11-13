'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Download } from 'lucide-react';
import Image from 'next/image';
import { HTMLAttributes } from 'react';
import { GithubLogo } from '@/components/icons';
import { useTranslations } from 'next-intl';

const ProfileImage = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-10 w-48 h-48 md:w-64 md:h-64', className)} {...props}>
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-accent">
      <Image
        src="/images/profile.jpg"
        alt="Profile"
        className="object-cover"
        fill
        sizes="(max-width: 768px) 192px, 256px"
      />
    </div>
  </div>
);

export function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className="relative py-20 px-6">
      <div className="max-w-screen-md mx-auto">
        <div className="flex flex-col md:flex-row-reverse gap-12">
          <ProfileImage className="hidden md:block" />

          {/* Content */}
          <div className="flex-1 md:text-left">
            <Badge variant="secondary" className="mb-4">
              {t('badge')}
            </Badge>
            <ProfileImage className="mt-3 mb-8 block md:hidden" />
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              {t('title')}
            </h2>
            <p className="text-muted-foreground mb-6 text-justify">
              {t('description')}
            </p>
            <div className="flex flex-wrap gap-4 justify-start">
              <Button className="rounded-full" asChild>
                <a
                  href="https://github.com/dulundu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubLogo className="h-4 w-4 mr-2" />
                  {t('viewGithub')}
                </a>
              </Button>
              <Button variant="outline" className="rounded-full">
                <Download className="h-4 w-4 mr-2" />
                {t('downloadCV')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
