'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Zap, Shield, Code2, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ServicesOverviewProps {
  locale: string;
}

export function ServicesOverview({ locale }: ServicesOverviewProps) {
  const t = useTranslations('servicesOverview');

  const services = [
    {
      icon: Zap,
      title: t('wordpress.title'),
      description: t('wordpress.description'),
    },
    {
      icon: Shield,
      title: t('consulting.title'),
      description: t('consulting.description'),
    },
    {
      icon: Code2,
      title: t('fullstack.title'),
      description: t('fullstack.description'),
    },
    {
      icon: Activity,
      title: t('audit.title'),
      description: t('audit.description'),
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-3 inline-flex p-2.5 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href={`/${locale}/services`}>
              {t('viewAllServices')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
