import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Zap, Users, Package, Code, CheckCircle, ArrowRight } from 'lucide-react';

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

const serviceIcons = {
  wordpress: Zap,
  consulting: Users,
  products: Package,
  custom: Code,
};

const serviceColors = {
  wordpress: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    hover: 'hover:shadow-blue-200',
  },
  consulting: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    hover: 'hover:shadow-green-200',
  },
  products: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    hover: 'hover:shadow-purple-200',
  },
  custom: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    hover: 'hover:shadow-orange-200',
  },
};

export default async function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'services' });

  const services = ['wordpress', 'consulting', 'products', 'custom'] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            {t('subtitle')}
          </p>
          <Link
            href={`/${params.locale}/contact`}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
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
            const Icon = serviceIcons[service];
            const colors = serviceColors[service];
            const features = t.raw(`${service}.features`) as string[];

            return (
              <div
                key={service}
                className={`bg-white rounded-2xl shadow-lg ${colors.hover} transition-all duration-300 overflow-hidden`}
              >
                {/* Card Header */}
                <div className={`${colors.bg} p-8`}>
                  <div className={`inline-flex p-4 ${colors.bg} rounded-xl ${colors.icon} mb-4`}>
                    <Icon className="w-8 h-8" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {t(`${service}.title`)}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {t(`${service}.description`)}
                  </p>
                </div>

                {/* Features List */}
                <div className="p-8">
                  <ul className="space-y-4">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className={`w-5 h-5 ${colors.icon} mr-3 mt-0.5 flex-shrink-0`} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <Link
                      href={`/${params.locale}/contact`}
                      className={`inline-flex items-center text-sm font-semibold ${colors.icon} hover:underline`}
                    >
                      {t('learnMore')}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let&apos;s discuss how we can help your business grow
          </p>
          <Link
            href={`/${params.locale}/contact`}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t('cta')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
