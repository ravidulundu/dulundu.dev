import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">Dulundu.dev</h3>
            <p className="text-gray-400 max-w-md">
              Professional WordPress & Web Development Services.
              Optimize, enhance, and grow your digital presence.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('services')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/services`} className="hover:text-white transition-colors">
                  WordPress Optimization
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} className="hover:text-white transition-colors">
                  Consulting
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} className="hover:text-white transition-colors">
                  Digital Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('company')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/portfolio`} className="hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Dulundu.dev. {t('copyright')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-white text-sm transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-white text-sm transition-colors">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
