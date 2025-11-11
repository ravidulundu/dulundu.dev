# Missing Pages - SPEC

**Feature:** Create Missing Critical Pages
**Priority:** 🟠 HIGH
**Status:** ✅ Delivered (2025-11-10)
**Created:** 2025-11-10

---

## 🎯 Problem (PULSE)

**Critical Discovery:** 4 essential pages are missing (return 404)!

**Missing Pages:**
1. ❌ `/[locale]/auth/signin` - Admin login page
2. ❌ `/[locale]/auth/error` - Auth error page
3. ❌ `/[locale]/privacy` - Privacy Policy
4. ❌ `/[locale]/terms` - Terms of Service

**Current State:**
- NextAuth configured to use custom signin page → but page doesn't exist!
- Footer links to Privacy/Terms → both return 404
- Admin cannot log in via browser
- Site appears unprofessional/incomplete

**Impact:**
- **Admin Access:** BLOCKED (cannot log in)
- **Legal Compliance:** FAIL (e-commerce requires privacy/terms)
- **User Trust:** Broken links hurt credibility
- **SEO:** 404s hurt search ranking

---

## 📋 Requirements

### Page 1: Sign-In Page

**Path:** `app/[locale]/auth/signin/page.tsx`

**Requirements:**
- Email input field
- Password input field
- Submit button
- Error message display
- Link to homepage
- Proper i18n (EN/TR/PT-BR)
- NextAuth integration
- Responsive design
- Loading state

**Features:**
- Form validation
- Show/hide password toggle
- "Remember me" checkbox (optional)
- Redirect after successful login
- Display auth errors

---

### Page 2: Auth Error Page

**Path:** `app/[locale]/auth/error/page.tsx`

**Requirements:**
- Display error type
- User-friendly error message
- Link to try again
- Link to homepage
- Proper i18n
- Different errors handled:
  - Invalid credentials
  - Account locked
  - Session expired
  - Network error

---

### Page 3: Privacy Policy

**Path:** `app/[locale]/privacy/page.tsx`

**Requirements:**
- Last updated date
- Multi-language content
- Proper legal sections:
  - Data collection
  - Cookie usage
  - Third-party services
  - User rights
  - Contact information
- Table of contents
- Responsive design

**Content Structure:**
```markdown
# Privacy Policy
Last Updated: [Date]

## 1. Information We Collect
## 2. How We Use Your Information
## 3. Cookies and Tracking
## 4. Third-Party Services
## 5. Data Security
## 6. Your Rights
## 7. Contact Us
```

---

### Page 4: Terms of Service

**Path:** `app/[locale]/terms/page.tsx`

**Requirements:**
- Last updated date
- Multi-language content
- Proper legal sections:
  - Service description
  - User obligations
  - Payment terms
  - Refund policy
  - Liability limitations
  - Dispute resolution
- Table of contents
- Responsive design

**Content Structure:**
```markdown
# Terms of Service
Last Updated: [Date]

## 1. Acceptance of Terms
## 2. Services Provided
## 3. User Obligations
## 4. Payment and Billing
## 5. Refund Policy
## 6. Intellectual Property
## 7. Limitation of Liability
## 8. Governing Law
## 9. Contact Information
```

---

## 🎨 Design Specifications

### Sign-In Page Design

```tsx
// app/[locale]/auth/signin/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import PageWrapper from '@/components/layout/PageWrapper';

export default function SignInPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      window.location.href = '/en/admin/dashboard';
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-center">
              {t('signin.title')}
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email">{t('signin.email')}</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300"
              />
            </div>

            <div>
              <label htmlFor="password">{t('signin.password')}</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? t('signin.loading') : t('signin.submit')}
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              {t('signin.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
```

---

## ✅ Acceptance Criteria

### Sign-In Page
1. **AC-1:** Page renders at `/[locale]/auth/signin`
2. **AC-2:** Form has email and password fields
3. **AC-3:** Form submits to NextAuth
4. **AC-4:** Successful login redirects to dashboard
5. **AC-5:** Failed login shows error message
6. **AC-6:** Link to homepage works
7. **AC-7:** Fully translated (EN/TR/PT-BR)
8. **AC-8:** Responsive on mobile

### Auth Error Page
9. **AC-9:** Page renders at `/[locale]/auth/error`
10. **AC-10:** Displays error type
11. **AC-11:** "Try again" link works
12. **AC-12:** Fully translated

### Privacy Page
13. **AC-13:** Page renders at `/[locale]/privacy`
14. **AC-14:** Has proper legal content
15. **AC-15:** Shows last updated date
16. **AC-16:** Fully translated
17. **AC-17:** Has table of contents

### Terms Page
18. **AC-18:** Page renders at `/[locale]/terms`
19. **AC-19:** Has proper legal content
20. **AC-20:** Shows last updated date
21. **AC-21:** Fully translated
22. **AC-22:** Has table of contents

### All Pages
23. **AC-23:** All pages have Navbar/Footer
24. **AC-24:** No 404 errors
25. **AC-25:** Footer links work

---

## 🧪 Testing Plan

### Manual Tests
- Visit `/en/auth/signin` → page loads
- Try login with valid credentials → redirects to dashboard
- Try login with invalid credentials → shows error
- Click footer "Privacy Policy" → loads page (not 404)
- Click footer "Terms of Service" → loads page (not 404)

### Automated Tests
```typescript
test('Sign-in page exists and works', async ({ page }) => {
  await page.goto('http://localhost:3000/en/auth/signin');

  await expect(page).toHaveTitle(/Sign In/);
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test('Privacy and Terms pages exist', async ({ page }) => {
  await page.goto('http://localhost:3000/en/privacy');
  await expect(page.locator('h1')).toContainText('Privacy Policy');

  await page.goto('http://localhost:3000/en/terms');
  await expect(page.locator('h1')).toContainText('Terms of Service');
});
```

---

## 📦 Deliverables

1. **Sign-In Page** - `app/[locale]/auth/signin/page.tsx`
2. **Auth Error Page** - `app/[locale]/auth/error/page.tsx`
3. **Privacy Page** - `app/[locale]/privacy/page.tsx`
4. **Terms Page** - `app/[locale]/terms/page.tsx`
5. **Translations** - Auth, legal translations for EN/TR/PT-BR
6. **Tests** - Playwright tests for all pages

---

## ⏱️ Estimation

**Complexity:** Medium

**Tasks:**
- Sign-in page: 2 hours
- Auth error page: 1 hour
- Privacy page: 1.5 hours (including legal content)
- Terms page: 1.5 hours (including legal content)
- Translations: 1 hour
- Testing: 1 hour

**Total:** ~8 hours

---

## 🔗 Dependencies

**Blocks:**
- Admin access (signin required)
- Legal compliance (privacy/terms required)
- Professional image

**Depends On:**
- ✅ NextAuth configured
- ✅ PageWrapper created (from navigation integration)
- ⚠️ Legal content writing (may need lawyer review)

---

## 📝 Notes

- Privacy/Terms content should be reviewed by legal
- Can start with placeholder content and update later
- Sign-in page is CRITICAL for admin access
- Consider adding "Forgot Password" flow (future enhancement)

---

## ✅ Delivery Notes

- Auth pages live at `app/[locale]/auth/(signin|error)` with credential handling + localized strings.
- Privacy/Terms rendered via MDX-like data structures with TOC anchors and Claymorphism typography.
- Footer + auth flows now reference these pages; Playwright smoke ensures 200 responses.
- Legal copy will be revisited with legal counsel but placeholder text meets UX + routing requirements.

---

**Spec Author:** Claude Code
**Reviewed By:** Dulundu.dev Dev Team
**Status:** ✅ Delivered
