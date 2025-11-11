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
    title: t('terms'),
    description: 'Terms of Service - Dulundu.dev',
  };
}

export default async function TermsPage({
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
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              {t('lastUpdated')}: November 10, 2025
            </p>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using this website, you accept and agree to be bound by these Terms of Service.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">2. Services Provided</h2>
              <p className="mb-4">
                Dulundu.dev provides professional WordPress optimization, consulting services, and digital products.
                All services are subject to availability and our discretion.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">3. User Obligations</h2>
              <p className="mb-4">
                You agree to use our services only for lawful purposes and in accordance with these Terms.
                You are responsible for maintaining the security of your account.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">4. Payment and Billing</h2>
              <p className="mb-4">
                All payments are processed through Stripe. By making a purchase, you agree to provide accurate
                payment information and authorize us to charge the agreed amount.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">5. Refund Policy</h2>
              <p className="mb-4">
                Refunds are handled on a case-by-case basis. Digital products are generally non-refundable
                after delivery. Services may be eligible for refund if work has not yet commenced.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">6. Intellectual Property</h2>
              <p className="mb-4">
                All content on this website, including text, graphics, logos, and software, is the property
                of Dulundu.dev and protected by copyright laws.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">7. Limitation of Liability</h2>
              <p className="mb-4">
                Dulundu.dev shall not be liable for any indirect, incidental, special, or consequential damages
                arising from the use of our services.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">8. Governing Law</h2>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with applicable laws.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">9. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms, please contact us at:
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
