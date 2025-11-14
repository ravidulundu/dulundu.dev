'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Code, TestTube, Rocket } from 'lucide-react';

export function ProcessSection() {
  const t = useTranslations('process');

  const steps = [
    {
      icon: Lightbulb,
      title: t('discovery.title'),
      description: t('discovery.description'),
      duration: t('discovery.duration'),
    },
    {
      icon: Code,
      title: t('development.title'),
      description: t('development.description'),
      duration: t('development.duration'),
    },
    {
      icon: TestTube,
      title: t('testing.title'),
      description: t('testing.description'),
      duration: t('testing.duration'),
    },
    {
      icon: Rocket,
      title: t('launch.title'),
      description: t('launch.description'),
      duration: t('launch.duration'),
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <p className="text-xs font-semibold text-primary">
                    {step.duration}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-card rounded-lg border">
          <h3 className="font-bold text-lg mb-3">{t('deliverables.title')}</h3>
          <ul className="grid md:grid-cols-2 gap-3">
            {(t.raw('deliverables.items') as string[]).map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
