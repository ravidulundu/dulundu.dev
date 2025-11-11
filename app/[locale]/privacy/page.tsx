import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import PageWrapper from '@/components/layout/PageWrapper';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('footer');

  return {
    title: t('privacy'),
    description: 'Privacy Policy - Dulundu.dev',
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('legal');

  return (
    <PageWrapper>
      <div className="min-h-screen bg-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card shadow rounded-lg p-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              {t('lastUpdated')}: November 10, 2025
            </p>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                We collect information that you provide directly to us, including when you create an account,
                make a purchase, or contact us for support.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect to provide, maintain, and improve our services,
                process transactions, and communicate with you.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">3. Cookies and Tracking</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to track activity on our service
                and hold certain information.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">4. Third-Party Services</h2>
              <p className="mb-4">
                We use third-party services such as Stripe for payment processing and NextAuth for authentication.
                These services have their own privacy policies.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information from
                unauthorized access, alteration, or destruction.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Rights</h2>
              <p className="mb-4">
                You have the right to access, update, or delete your personal information.
                You can exercise these rights by contacting us.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact Us</h2>
              <p className="mb-4">
                If you have questions about this Privacy Policy, please contact us at:
                <br />
                Email: contact@dulundu.dev
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
