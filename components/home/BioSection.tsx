'use client';

import { useTranslations } from 'next-intl';

export function BioSection() {
  const t = useTranslations('bio');

  return (
    <section className="py-16 px-4 md:px-8 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed tracking-tight">
          {t('introduction')}
        </p>
        <p className="mt-4 text-base md:text-lg text-muted-foreground/80">
          {t('experience')}
        </p>
      </div>
    </section>
  );
}
