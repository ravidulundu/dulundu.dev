import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BioSection } from '@/components/home/BioSection';
import { SkillsProgress } from '@/components/home/SkillsProgress';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ServicesOverview } from '@/components/home/ServicesOverview';
import { AnimatedHero } from '@/components/home/AnimatedHero';

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

  // Structured Data - Person Schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ege Dulundu',
    jobTitle: 'WordPress Expert & Full-Stack Developer',
    description: 'WordPress optimization specialist and full-stack developer helping businesses improve website performance',
    url: 'https://dulundu.dev',
    sameAs: [
      'https://github.com/dulundu',
      'https://linkedin.com/in/egedulundu',
    ],
    knowsAbout: [
      'WordPress Development',
      'Performance Optimization',
      'Full-Stack Development',
      'Next.js',
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
    ],
  };

  // Structured Data - Service Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Web Development & Optimization',
    provider: {
      '@type': 'Person',
      name: 'Ege Dulundu',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Development Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'WordPress Optimization',
            description: 'Performance optimization, caching, and speed improvements for WordPress websites',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Full-Stack Development',
            description: 'Custom web application development with modern technologies',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Technical Consulting',
            description: 'WordPress and web development technical consulting services',
          },
        },
      ],
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <Navbar />

      {/* Animated Hero Section */}
      <AnimatedHero
        locale={locale}
        name={t('name')}
        tagline={t('tagline')}
        ctaPortfolio={t('ctaPortfolio')}
        ctaServices={t('ctaServices')}
        typewriterTexts={[
          t('typewriter1'),
          t('typewriter2'),
          t('typewriter3'),
        ]}
      />

      {/* Bio Section */}
      <BioSection />

      {/* Skills Section with Progress Bars */}
      <SkillsProgress />

      {/* Featured Projects Section */}
      <FeaturedProjects />

      {/* Services Overview Section */}
      <ServicesOverview locale={locale} />

      <Footer />
    </>
  );
}
