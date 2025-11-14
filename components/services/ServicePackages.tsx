'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, Shield, Code2, Activity } from 'lucide-react';
import Link from 'next/link';

interface ServicePackagesProps {
  locale: string;
}

export function ServicePackages({ locale }: ServicePackagesProps) {
  const t = useTranslations('servicePackages');

  const packages = [
    {
      id: 'wordpress-optimization',
      icon: Zap,
      name: t('wordpress.name'),
      description: t('wordpress.description'),
      features: t.raw('wordpress.features') as string[],
      pricing: t('wordpress.pricing'),
      popular: true,
    },
    {
      id: 'consulting',
      icon: Shield,
      name: t('consulting.name'),
      description: t('consulting.description'),
      features: t.raw('consulting.features') as string[],
      pricing: t('consulting.pricing'),
      popular: false,
    },
    {
      id: 'fullstack',
      icon: Code2,
      name: t('fullstack.name'),
      description: t('fullstack.description'),
      features: t.raw('fullstack.features') as string[],
      pricing: t('fullstack.pricing'),
      popular: false,
    },
    {
      id: 'audit',
      icon: Activity,
      name: t('audit.name'),
      description: t('audit.description'),
      features: t.raw('audit.features') as string[],
      pricing: t('audit.pricing'),
      popular: false,
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:auto-rows-fr">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Card
                key={pkg.id}
                className={`relative h-full flex flex-col ${
                  pkg.popular ? 'border-primary shadow-lg' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <p className="text-2xl font-bold text-primary">{pkg.pricing}</p>
                  </div>

                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-auto">
                  <Button className="w-full" variant={pkg.popular ? 'default' : 'outline'} asChild>
                    <Link href={`/${locale}/contact`}>
                      {t('bookNow')}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
