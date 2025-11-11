# i18n Footer Fixes - SPEC

**Feature:** Fix Footer Internationalization Issues
**Priority:** 🔴 CRITICAL
**Status:** ✅ Delivered (2025-11-10)
**Created:** 2025-11-10

---

## 🎯 Problem (PULSE)

**Critical Discovery:** Footer component has broken i18n implementation!

**Current Issues:**
1. ❌ Footer links hardcoded to `/en/*` (ignores current locale)
2. ❌ Footer content not translated (English on TR/PT pages)
3. ❌ Footer headings in English only
4. ❌ Copyright text not translated

**Example:**
- User on `/tr` (Turkish page)
- Footer shows "Services" instead of "Hizmetler"
- Footer links go to `/en/portfolio` instead of `/tr/portfolio`
- User clicks link → switched to English unintentionally!

**Impact:**
- **Severity:** HIGH
- **User Experience:** Confusing, inconsistent
- **i18n:** Major gap in multi-language support
- **Professional:** Looks incomplete/broken

---

## 📋 Requirements

### Functional Requirements

**FR-1: Locale-Aware Links**
- All Footer links must respect current locale
- Links format: `/${locale}/path`
- Example: On `/tr` page → links go to `/tr/*`

**FR-2: Translated Content**
- Footer headings use translation keys
- All text content translated
- Support EN, TR, PT-BR

**FR-3: Footer Sections**
```tsx
// Current (WRONG)
<Link href="/en/services">Services</Link>

// Should be (CORRECT)
<Link href={`/${locale}/services`}>{t('footer.services')}</Link>
```

### Translation Keys Required

```json
// messages/en.json
"footer": {
  "services": "Services",
  "company": "Company",
  "legal": "Legal",
  "description": "Professional WordPress & Web Development Services...",
  "copyright": "© {year} Dulundu.dev. All rights reserved.",
  "privacy": "Privacy Policy",
  "terms": "Terms of Service"
}

// messages/tr.json
"footer": {
  "services": "Hizmetler",
  "company": "Şirket",
  "legal": "Yasal",
  "description": "Profesyonel WordPress & Web Geliştirme Hizmetleri...",
  "copyright": "© {year} Dulundu.dev. Tüm hakları saklıdır.",
  "privacy": "Gizlilik Politikası",
  "terms": "Kullanım Koşulları"
}

// messages/pt-BR.json
"footer": {
  "services": "Serviços",
  "company": "Empresa",
  "legal": "Legal",
  "description": "Serviços Profissionais de WordPress e Desenvolvimento Web...",
  "copyright": "© {year} Dulundu.dev. Todos os direitos reservados.",
  "privacy": "Política de Privacidade",
  "terms": "Termos de Serviço"
}
```

---

## 🎨 Design Specifications

### Current Footer Code (BROKEN)

```tsx
// components/layout/Footer.tsx (current - BAD)
export default function Footer() {
  return (
    <footer>
      <div>
        <h4>Services</h4>  {/* ❌ Not translated */}
        <Link href="/en/services">WordPress Optimization</Link>  {/* ❌ Hardcoded locale */}
      </div>
      <div>
        <h4>Company</h4>  {/* ❌ Not translated */}
        <Link href="/en/portfolio">Portfolio</Link>  {/* ❌ Hardcoded locale */}
      </div>
      <p>© 2024 Dulundu.dev. All rights reserved.</p>  {/* ❌ Not translated */}
    </footer>
  );
}
```

### Fixed Footer Code (CORRECT)

```tsx
// components/layout/Footer.tsx (fixed - GOOD)
'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              Dulundu.dev
            </h3>
            <p className="text-gray-400 max-w-md">
              {t('description')}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {t('services')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/services`}
                  className="hover:text-white transition-colors"
                >
                  {t('servicesLinks.wordpress')}
                </Link>
              </li>
              {/* More links... */}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {t('company')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/portfolio`}
                  className="hover:text-white transition-colors"
                >
                  {t('companyLinks.portfolio')}
                </Link>
              </li>
              {/* More links... */}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <p className="text-gray-400 text-sm text-center">
            {t('copyright', { year: currentYear })}
          </p>
          <div className="flex space-x-6 justify-center mt-4">
            <Link
              href={`/${locale}/privacy`}
              className="text-gray-400 hover:text-white text-sm"
            >
              {t('privacy')}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="text-gray-400 hover:text-white text-sm"
            >
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

---

## ✅ Acceptance Criteria

1. **AC-1:** Footer uses `useLocale()` hook
2. **AC-2:** Footer uses `useTranslations('footer')` hook
3. **AC-3:** All links use `/${locale}/path` format
4. **AC-4:** All headings use translation keys
5. **AC-5:** All text content translated
6. **AC-6:** Copyright year is dynamic
7. **AC-7:** On `/tr` page, footer shows Turkish text
8. **AC-8:** On `/tr` page, footer links go to `/tr/*`
9. **AC-9:** On `/pt-BR` page, footer shows Portuguese text
10. **AC-10:** On `/pt-BR` page, footer links go to `/pt-BR/*`
11. **AC-11:** No hardcoded `/en` links remain
12. **AC-12:** Playwright test confirms locale-aware links

---

## 🧪 Testing Plan

### Manual Test
1. Navigate to `/en` → Check footer is English
2. Navigate to `/tr` → Check footer is Turkish
3. Navigate to `/pt-BR` → Check footer is Portuguese
4. Click footer link on `/tr` → Confirm goes to `/tr/*`

### Automated Test (Playwright)
```typescript
test('Footer respects current locale', async ({ page }) => {
  // Test Turkish
  await page.goto('http://localhost:3000/tr');
  const footerTR = await page.locator('footer h4').first().textContent();
  expect(footerTR).toBe('Hizmetler'); // Not "Services"

  const linkTR = await page.locator('footer a[href*="portfolio"]').getAttribute('href');
  expect(linkTR).toContain('/tr/portfolio'); // Not /en/portfolio

  // Test Portuguese
  await page.goto('http://localhost:3000/pt-BR');
  const footerPT = await page.locator('footer h4').first().textContent();
  expect(footerPT).toBe('Serviços'); // Not "Services"

  const linkPT = await page.locator('footer a[href*="portfolio"]').getAttribute('href');
  expect(linkPT).toContain('/pt-BR/portfolio'); // Not /en/portfolio
});
```

---

## 📦 Deliverables

1. **Updated Footer.tsx** - With i18n hooks and locale-aware links
2. **Translation Updates** - Add missing footer keys to all language files
3. **Tests** - Playwright tests for footer i18n
4. **Documentation** - Update component docs

---

## ⏱️ Estimation

**Complexity:** Low-Medium

**Tasks:**
- Refactor Footer component: 1 hour
- Add translation keys: 30 min
- Test all locales: 30 min
- Fix any issues: 30 min

**Total:** ~2.5 hours

---

## 🔗 Dependencies

**Blocks:**
- Full i18n compliance
- User trust (consistent language)

**Depends On:**
- ✅ next-intl installed
- ✅ Translation files exist
- ✅ Locale routing working

---

## 📝 Notes

- Should be done AFTER navigation integration
- Related to Navbar i18n (which is already correct)
- Footer is currently WORSE than Navbar

---

## ✅ Delivery Notes

- `components/layout/Footer.tsx` now uses `useTranslations('footer')`, `useLocale()`, and exposes the Claymorphism palette tokens.
- Added translation blocks to `messages/en.json`, `messages/tr.json`, `messages/pt-BR.json` covering descriptions, categories, and link labels.
- Footer link targets are built via template literals (`/${locale}/path`), fixing forced `/en` routes.
- Verified via manual QA + Playwright locale switch test; screenshots stored in `PLAYWRIGHT-TEST-REPORT.md`.

---

**Spec Author:** Claude Code
**Reviewed By:** Playwright QA Run 2025-11-10
**Status:** ✅ Delivered
