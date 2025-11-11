'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Suspense } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import { AlertCircle } from 'lucide-react';

function AuthErrorContent() {
  const t = useTranslations('auth.error');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'CredentialsSignin':
        return t('invalidCredentials');
      case 'AccessDenied':
        return t('accessDenied');
      case 'Verification':
        return t('verification');
      default:
        return t('default');
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-muted py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-foreground">
              {t('title')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {getErrorMessage()}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href={`/${locale}/auth/signin`}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {t('tryAgain')}
            </Link>
            <Link
              href={`/${locale}`}
              className="w-full flex justify-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-muted-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
