'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Rocket } from 'lucide-react';

interface BlogCTAProps {
  locale: string;
}

export function BlogCTA({ locale }: BlogCTAProps) {
  const t = useTranslations('blog');

  return (
    <Card className="my-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
      <CardContent className="p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {t('ctaTitle')}
            </h3>
            <p className="text-muted-foreground">
              {t('ctaDescription')}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href={`/${locale}/services`}>
                {t('ctaServices')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href={`/${locale}/contact`}>
                {t('ctaContact')}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
