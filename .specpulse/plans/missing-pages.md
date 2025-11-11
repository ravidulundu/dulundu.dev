# Missing Pages - PLAN

**Feature:** Create 4 Missing Critical Pages
**Status:** ✅ Completed (2025-11-10)
**Priority:** 🟠 HIGH
**Created:** 2025-11-10
**Target:** Complete in 8 hours

---

## 🎯 Executive Summary

**Goal:** Create 4 essential pages that are currently returning 404

**Missing Pages:**
1. `/auth/signin` - Admin login (CRITICAL for admin access)
2. `/auth/error` - Auth error handling
3. `/privacy` - Privacy Policy (LEGAL requirement)
4. `/terms` - Terms of Service (LEGAL requirement)

**Approach:** Create pages in order of priority, with i18n support and PageWrapper integration

---

## ✅ Completion Summary

- `/[locale]/auth/signin` ships credential form, handles success/error states, and redirects per `callbackUrl`.
- `/[locale]/auth/error` surfaces human-friendly messages for NextAuth error codes.
- `/[locale]/privacy` & `/[locale]/terms` deliver structured legal content with TOC + `lastUpdated` strings in EN/TR/PT-BR.
- All four routes wrap with PageWrapper + Claymorphism tokens, so navigation + theme remain consistent.
- Footer links + auth flows validated via manual browsing + Playwright smoke.

---

## 🏗️ Implementation Strategy

### Phase 1: Add Translations (1 hour)

Add translation keys for auth and legal pages to all 3 locales.

**Keys to Add:**
```json
// messages/en.json, tr.json, pt-BR.json
{
  "auth": {
    "signin": {
      "title": "Sign In to Admin Panel",
      "email": "Email",
      "password": "Password",
      "submit": "Sign In",
      "loading": "Signing in...",
      "backToHome": "Back to Home",
      "invalidCredentials": "Invalid email or password",
      "error": "An error occurred. Please try again."
    },
    "error": {
      "title": "Authentication Error",
      "description": "We encountered an error while trying to sign you in.",
      "tryAgain": "Try Again",
      "backToHome": "Back to Home"
    }
  },
  "legal": {
    "lastUpdated": "Last Updated",
    "tableOfContents": "Table of Contents",
    "privacy": {
      "title": "Privacy Policy",
      "intro": "Your privacy is important to us..."
    },
    "terms": {
      "title": "Terms of Service",
      "intro": "Please read these terms carefully..."
    }
  }
}
```

---

### Phase 2: Sign-In Page (2 hours)

**Priority:** 🔴 CRITICAL (blocks admin access)

**File:** `app/[locale]/auth/signin/page.tsx`

**Implementation:**
```tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import { Eye, EyeOff } from 'lucide-react';

export default function SignInPage() {
  const t = useTranslations('auth.signin');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || `/${locale}/admin/dashboard`;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('invalidCredentials'));
        setLoading(false);
      } else if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setError(t('error'));
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t('title')}
            </h2>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="rounded-md shadow-sm space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="admin@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('password')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('loading')}
                  </span>
                ) : (
                  t('submit')
                )}
              </button>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Link
                href={`/${locale}`}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {t('backToHome')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
```

**Features:**
- Email & password fields
- Show/hide password toggle
- Loading state
- Error handling
- Redirect after login
- Fully internationalized
- Responsive design

---

### Phase 3: Auth Error Page (1 hour)

**File:** `app/[locale]/auth/error/page.tsx`

**Implementation:**
```tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
  const t = useTranslations('auth.error');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'CredentialsSignin':
        return t('invalidCredentials', { defaultValue: 'Invalid email or password.' });
      case 'AccessDenied':
        return t('accessDenied', { defaultValue: 'Access denied. You do not have permission.' });
      case 'Verification':
        return t('verification', { defaultValue: 'Verification failed. Please try again.' });
      default:
        return t('default', { defaultValue: 'An unexpected error occurred.' });
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t('title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {getErrorMessage()}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href={`/${locale}/auth/signin`}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('tryAgain')}
            </Link>
            <Link
              href={`/${locale}`}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
```

---

### Phase 4: Privacy Page (2.5 hours)

**File:** `app/[locale]/privacy/page.tsx`

**Implementation:** Comprehensive privacy policy with sections for:
- Information collection
- Cookie usage
- Third-party services (Stripe, NextAuth)
- User rights (GDPR compliance)
- Data security
- Contact information

**Content:** Professional legal template adapted for the site

---

### Phase 5: Terms Page (2.5 hours)

**File:** `app/[locale]/terms/page.tsx`

**Implementation:** Comprehensive terms of service with sections for:
- Service description
- User obligations
- Payment terms (Stripe integration)
- Refund policy
- Intellectual property
- Liability limitations
- Dispute resolution

---

## ⏱️ Timeline

| Task | Duration | Dependencies |
|------|----------|--------------|
| Add translations | 1h | None |
| Sign-in page | 2h | Translations |
| Auth error page | 1h | Translations |
| Privacy page | 2.5h | Translations |
| Terms page | 2.5h | Translations |
| Testing | 1h | All pages |
| **TOTAL** | **10h** | - |

---

## ✅ Acceptance Criteria

- [ ] All 4 pages accessible (no 404s)
- [ ] Sign-in page integrates with NextAuth
- [ ] All pages have Navbar/Footer
- [ ] All pages fully translated (EN/TR/PT-BR)
- [ ] Footer links work
- [ ] Build succeeds
- [ ] Mobile responsive

---

**Plan Created:** 2025-11-10
**Status:** 📐 Ready to Execute
**Priority:** 🟠 HIGH

---

*This plan follows SpecPulse methodology: SPEC → PLAN → TASKS → EXECUTE → TEST → DOCUMENT*
