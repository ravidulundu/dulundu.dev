import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Zap, Shield, Globe } from 'lucide-react';
import { IconBadge } from '@/components/common/IconBadge';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  const tServices = await getTranslations({ locale, namespace: 'services' });

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <main className="flex min-h-[80vh] flex-col items-center justify-center p-8 md:p-24 bg-gradient-to-b from-background to-card">
        <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href={`/${locale}/services`}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              {t('cta')}
            </Link>
            <Link
              href={`/${locale}/portfolio`}
              className="px-8 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-semibold"
            >
              {t('learnMore')}
            </Link>
          </div>
        </div>
      </main>

      {/* Services Section */}
      <section className="py-20 px-4 md:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {tServices('title')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: tServices('wordpress.title'),
                description: tServices('wordpress.description'),
                variant: 'primary' as const,
              },
              {
                icon: Shield,
                title: tServices('consulting.title'),
                description: tServices('consulting.description'),
                variant: 'secondary' as const,
              },
              {
                icon: Globe,
                title: tServices('products.title'),
                description: tServices('products.description'),
                variant: 'accent' as const,
              },
            ].map((card) => (
              <div
                key={card.title}
                className="p-8 border border-border rounded-2xl hover:shadow-xl transition-shadow"
              >
                <IconBadge
                  icon={card.icon}
                  variant={card.variant}
                  size="lg"
                  className="mb-4"
                />
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {card.title}
                </h3>
                <p className="text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
