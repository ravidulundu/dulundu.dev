# Navigation Integration - SPEC

**Feature:** Navigation Integration for All Pages
**Priority:** 🔴 CRITICAL - BLOCKER
**Status:** ✅ Delivered (2025-11-10)
**Created:** 2025-11-10

---

## 🎯 Problem (PULSE)

**Critical Discovery:** 22 out of 23 pages are missing Navbar and Footer components!

**Current State:**
- ✅ Homepage has Navbar + Footer
- ❌ All other pages (22) have NO navigation
- ❌ Users get stuck after navigating away from homepage
- ❌ No way to navigate between pages
- ❌ Must use browser back button to return

**Impact:**
- **Severity:** CATASTROPHIC
- **User Experience:** Site is essentially single-page (unusable)
- **Production:** BLOCKER - Cannot deploy
- **Business:** Site appears broken/incomplete

---

## 📋 Requirements

### Functional Requirements

**FR-1: Universal Navigation**
- ALL pages must have Navbar component
- ALL pages must have Footer component
- Navigation must be consistent across all pages

**FR-2: Component Structure**
```tsx
<PageWrapper>
  <Navbar />
  {children}
  <Footer />
</PageWrapper>
```

**FR-3: Affected Pages (22 total)**

**Public Pages (10):**
1. `/[locale]/services/page.tsx`
2. `/[locale]/products/page.tsx`
3. `/[locale]/products/[slug]/page.tsx`
4. `/[locale]/blog/page.tsx`
5. `/[locale]/blog/[slug]/page.tsx`
6. `/[locale]/portfolio/page.tsx`
7. `/[locale]/portfolio/[slug]/page.tsx`
8. `/[locale]/contact/page.tsx`
9. `/[locale]/checkout/success/page.tsx`
10. `/[locale]/checkout/cancel/page.tsx`

**Admin Pages (12):**
11. `/[locale]/admin/dashboard/page.tsx`
12. `/[locale]/admin/blog/page.tsx`
13. `/[locale]/admin/blog/new/page.tsx`
14. `/[locale]/admin/blog/[id]/page.tsx`
15. `/[locale]/admin/products/page.tsx`
16. `/[locale]/admin/products/new/page.tsx`
17. `/[locale]/admin/products/[id]/page.tsx`
18. `/[locale]/admin/portfolio/page.tsx`
19. `/[locale]/admin/portfolio/new/page.tsx`
20. `/[locale]/admin/portfolio/[id]/page.tsx`
21. `/[locale]/admin/orders/page.tsx`
22. `/[locale]/admin/settings/page.tsx`

### Non-Functional Requirements

**NFR-1: Performance**
- No performance degradation from navigation components
- Navbar should be sticky
- Footer should be at bottom

**NFR-2: Consistency**
- Same Navbar/Footer across ALL pages
- Responsive on mobile/tablet/desktop

**NFR-3: Accessibility**
- Keyboard navigation works
- Screen reader compatible
- ARIA labels present

---

## 🎨 Design Specifications

### Approach A: PageWrapper Component (RECOMMENDED)

**Benefits:**
- ✅ Single source of truth
- ✅ Easy to maintain
- ✅ Consistent structure
- ✅ Less code duplication

**Implementation:**
```tsx
// components/layout/PageWrapper.tsx
'use client';

import Navbar from './Navbar';
import Footer from './Footer';

export default function PageWrapper({
  children,
  showFooter = true
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  return (
    <>
      <Navbar />
      {children}
      {showFooter && <Footer />}
    </>
  );
}
```

**Usage:**
```tsx
// app/[locale]/services/page.tsx
import PageWrapper from '@/components/layout/PageWrapper';

export default function ServicesPage() {
  return (
    <PageWrapper>
      <div className="container">
        {/* page content */}
      </div>
    </PageWrapper>
  );
}
```

### Approach B: Layout-Level Integration

**Benefits:**
- ✅ Automatic for all pages
- ✅ No per-page changes needed

**Drawback:**
- ⚠️ May affect admin pages differently
- ⚠️ Less flexible

**Not recommended** - Next.js app router works better with page-level components

---

## ✅ Acceptance Criteria

1. **AC-1:** All 22 pages have Navbar component
2. **AC-2:** All 22 pages have Footer component
3. **AC-3:** Navigation works on all pages
4. **AC-4:** Can navigate from any page to any other page
5. **AC-5:** Navbar is sticky on scroll
6. **AC-6:** Footer always at bottom
7. **AC-7:** Mobile menu works on all pages
8. **AC-8:** Language switcher works on all pages
9. **AC-9:** All links in Navbar work correctly
10. **AC-10:** All links in Footer work correctly
11. **AC-11:** Browser test confirms all pages have navigation
12. **AC-12:** Playwright test confirms navigation present

---

## 🧪 Testing Plan

### Unit Tests
- PageWrapper renders correctly
- Navbar prop is passed
- Footer prop is passed
- showFooter flag works

### Integration Tests
- Navigation between pages works
- All pages accessible from Navbar
- Footer links work

### E2E Tests (Playwright)
```typescript
test('All pages have navbar and footer', async ({ page }) => {
  const pages = [
    '/en',
    '/en/services',
    '/en/products',
    '/en/blog',
    '/en/portfolio',
    '/en/contact',
    // ... all 23 pages
  ];

  for (const path of pages) {
    await page.goto(`http://localhost:3000${path}`);

    // Check navbar exists
    const navbar = await page.locator('nav').count();
    expect(navbar).toBeGreaterThan(0);

    // Check footer exists
    const footer = await page.locator('footer').count();
    expect(footer).toBeGreaterThan(0);
  }
});
```

---

## 📦 Deliverables

1. **PageWrapper Component** - `components/layout/PageWrapper.tsx`
2. **Updated Pages (22)** - Add PageWrapper to all
3. **Tests** - Playwright navigation test
4. **Documentation** - Update README with PageWrapper usage

---

## ⏱️ Estimation

**Complexity:** Medium (repetitive but straightforward)

**Tasks:**
- Create PageWrapper: 30 min
- Update 22 pages: 2 hours (5 min each)
- Test all pages: 1 hour
- Fix any issues: 30 min

**Total:** ~4 hours

---

## 🔗 Dependencies

**Blocks:**
- ALL other features (site is unusable without navigation)
- Production deployment
- User testing

**Depends On:**
- ✅ Navbar component (already exists)
- ✅ Footer component (already exists)

---

## 🚨 Risks & Mitigation

**Risk 1:** Admin pages may need different layout
- **Mitigation:** Use `showFooter` flag or create AdminPageWrapper

**Risk 2:** Performance impact
- **Mitigation:** Navbar/Footer already client components, no extra overhead

**Risk 3:** Breaking existing functionality
- **Mitigation:** Test thoroughly, start with non-critical pages

---

## ✅ Delivery Notes

- `components/layout/PageWrapper.tsx` shipped with Navbar + Footer + `<main>` semantics and optional `showFooter` prop.
- 26 public/admin/auth/legal routes now wrap their content with PageWrapper (see `rg -l "PageWrapper" app/[locale]`).
- Playwright navigation smoke confirms locale persistence, sticky nav, and footer presence.
- Any future page only needs to wrap with PageWrapper to inherit nav/footer.

---

**Spec Author:** Claude Code
**Reviewed By:** Playwright QA Run 2025-11-10
**Approved By:** Dulundu.dev Dev Team
**Status:** ✅ Delivered
