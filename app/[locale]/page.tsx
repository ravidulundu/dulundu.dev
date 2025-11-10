import { getTranslations } from 'next-intl/server';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Zap, Shield, Globe } from 'lucide-react';

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
      <main className="flex min-h-[80vh] flex-col items-center justify-center p-8 md:p-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href={`/${locale}/services`}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {t('cta')}
            </Link>
            <Link
              href={`/${locale}/portfolio`}
              className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              {t('learnMore')}
            </Link>
          </div>
        </div>
      </main>

      {/* Services Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            {tServices('title')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* WordPress Optimization */}
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {tServices('wordpress.title')}
              </h3>
              <p className="text-gray-600">
                {tServices('wordpress.description')}
              </p>
            </div>

            {/* Consulting */}
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {tServices('consulting.title')}
              </h3>
              <p className="text-gray-600">
                {tServices('consulting.description')}
              </p>
            </div>

            {/* Digital Products */}
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {tServices('products.title')}
              </h3>
              <p className="text-gray-600">
                {tServices('products.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
