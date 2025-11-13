# Implementation Plan: Production Readiness Fixes

**Feature:** 013-production-readiness-fixes
**Created:** 2025-11-12
**Status:** 🟠 Ready to Execute
**Total Effort:** 4 hours

---

## Quick Reference

**Current Score:** 62/100 🟡
**Target Score:** 92/100 🟢
**Critical Blockers:** 3 (Security, SEO, Performance)

---

## Phase 1: Security Headers (30 min) 🔴

### Files to Modify:
- `next.config.js`

### Implementation:
```javascript
// Add security headers array
const securityHeaders = [
  { key: 'Content-Security-Policy', value: "default-src 'self'; ..." },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'Permissions-Policy', value: 'geolocation=()' }
];

// Add to config
async headers() {
  return [{ source: '/:path*', headers: securityHeaders }]
}
```

### Testing:
- Run https://securityheaders.com
- Target: A or A+ score

---

## Phase 2: SEO Setup (1 hour) 🟡

### 2.1 robots.txt (5 min)
**File:** `public/robots.txt`
```txt
User-agent: *
Allow: /
Sitemap: https://dulundu.dev/sitemap.xml
Disallow: /*/admin/
Disallow: /api/
```

### 2.2 Sitemap Generation (15 min)
```bash
npm install next-sitemap
```

**File:** `next-sitemap.config.js`
```javascript
module.exports = {
  siteUrl: 'https://dulundu.dev',
  generateRobotsTxt: true,
  alternateRefs: [
    { href: 'https://dulundu.dev/en', hreflang: 'en' },
    { href: 'https://dulundu.dev/tr', hreflang: 'tr' },
    { href: 'https://dulundu.dev/pt-BR', hreflang: 'pt-BR' }
  ]
}
```

### 2.3 Open Graph Tags (20 min)
**File:** `app/[locale]/layout.tsx`
- Add openGraph metadata
- Add twitter metadata
- Create `/public/og-image.png` (1200x630px)

### 2.4 JSON-LD Structured Data (20 min)
- Organization schema (homepage)
- Product schema (product pages)
- BlogPosting schema (blog posts)

---

## Phase 3: Performance (2 hours) 🟡

### 3.1 Font Preloading (15 min)
**File:** `app/[locale]/layout.tsx`
```html
<link rel="preload" href="/_next/static/media/font.woff2" as="font" crossOrigin />
```

### 3.2 Resource Hints (15 min)
```html
<link rel="dns-prefetch" href="https://js.stripe.com" />
<link rel="preconnect" href="https://js.stripe.com" />
```

### 3.3 Production Build Test (1.5 hours)
```bash
npm run build
npm run start
# Run Lighthouse audit
# Target: Performance > 90, LCP < 2.5s
```

---

## Phase 4: Best Practices (30 min) 🟢

### 4.1 Error Boundary (10 min)
**File:** `app/error.tsx`
- Create error component
- Add try again + go home buttons

### 4.2 Skip Link (5 min)
**File:** `components/layout/Navbar.tsx`
```html
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### 4.3 Hide Next.js Version (5 min)
**File:** `next.config.js`
```javascript
poweredByHeader: false
```

### 4.4 Final Testing (10 min)
- Manual smoke test
- All features still working

---

## Deployment Checklist

### Pre-deployment:
- [ ] All changes committed
- [ ] `npm run build` passes
- [ ] Local production test passes
- [ ] Lighthouse score > 90

### Deployment:
- [ ] Deploy to Vercel staging
- [ ] Run audit on staging URL
- [ ] Submit sitemap to Google Search Console
- [ ] Test securityheaders.com

### Post-deployment:
- [ ] Monitor Core Web Vitals (1 week)
- [ ] Check error rates
- [ ] Verify all fixes in production

---

## Expected Results

**Before → After:**
- Security: 30 → 95 (+65)
- SEO: 75 → 95 (+20)
- Performance: 65 → 90 (+25)
- Accessibility: 90 → 95 (+5)
- Best Practices: 50 → 85 (+35)

**Overall: 62 → 92 (+30 points)**

---

## References

**Spec:** `.specpulse/specs/013-production-readiness-fixes/spec-001.md`
**Next Step:** Create task breakdown
