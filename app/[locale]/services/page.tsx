import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Zap, Users, Package, Code, CheckCircle, ArrowRight } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { IconBadge } from '@/components/common/IconBadge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'services' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

const serviceVariants = {
  wordpress: { icon: Zap, badge: 'primary' as const },
  consulting: { icon: Users, badge: 'secondary' as const },
  products: { icon: Package, badge: 'accent' as const },
  custom: { icon: Code, badge: 'neutral' as const },
};

export default async function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'services' });

  const services = ['wordpress', 'consulting', 'products', 'custom'] as const;

  return (
    <PageWrapper>
      <div className="min-h-screen bg-muted">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
            {t('subtitle')}
          </p>
          <Link
            href={`/${params.locale}/contact`}
            className="inline-flex items-center px-8 py-4 bg-card text-primary font-semibold rounded-lg hover:bg-muted transition-colors shadow-lg"
          >
            {t('cta')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = serviceVariants[service].icon;
            const badge = serviceVariants[service].badge;
            const features = t.raw(`${service}.features`) as string[];

            return (
              <Card
                key={service}
                className="shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardHeader className="bg-muted/40">
                  <IconBadge icon={Icon} variant={badge} size="lg" className="mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    {t(`${service}.title`)}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {t(`${service}.description`)}
                  </p>
                </CardHeader>

                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      href={`/${params.locale}/contact`}
                      className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                    >
                      {t('learnMore')}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-primary/80 mb-8">
            Let&apos;s discuss how we can help your business grow
          </p>
          <Link
            href={`/${params.locale}/contact`}
            className="inline-flex items-center px-8 py-4 bg-card text-primary font-semibold rounded-lg hover:bg-muted transition-colors shadow-lg"
          >
            {t('cta')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
    </PageWrapper>
  );
}
