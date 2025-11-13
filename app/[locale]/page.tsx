import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { BioSection } from '@/components/home/BioSection';
import { SkillsSection } from '@/components/home/SkillsSection';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ServicesOverview } from '@/components/home/ServicesOverview';

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

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <main className="flex min-h-[80vh] flex-col items-center justify-center p-8 md:p-24 bg-gradient-to-b from-background to-muted/20">
        <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            {t('name')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto tracking-tight">
            {t('tagline')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href={`/${locale}/portfolio`}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              {t('ctaPortfolio')}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="px-8 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-semibold"
            >
              {t('ctaServices')}
            </Link>
          </div>
        </div>
      </main>

      {/* Bio Section */}
      <BioSection />

      {/* Skills Section */}
      <SkillsSection />

      {/* Featured Projects Section */}
      <FeaturedProjects />

      {/* Services Overview Section */}
      <ServicesOverview locale={locale} />

      <Footer />
    </>
  );
}
