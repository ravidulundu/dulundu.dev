import { getTranslations } from 'next-intl/server';
import PageWrapper from '@/components/layout/PageWrapper';
import { ServicePackages } from '@/components/services/ServicePackages';
import { ProcessSection } from '@/components/services/ProcessSection';
import { ProjectInquiryForm } from '@/components/services/ProjectInquiryForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: `${t('title')} - Services`,
    description: 'WordPress optimization, full-stack development, and consulting services. Fixed packages and custom project solutions.',
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'servicesPage' });

  return (
    <PageWrapper>
      {/* Hero Section */}
      <div className="py-20 px-4 md:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>

      {/* Service Packages */}
      <ServicePackages locale={locale} />

      {/* Process Section */}
      <ProcessSection />

      {/* Project Inquiry Form */}
      <ProjectInquiryForm />
    </PageWrapper>
  );
}
