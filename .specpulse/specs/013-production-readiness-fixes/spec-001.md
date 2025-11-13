# Feature Specification: Production Readiness Fixes

**Feature ID:** 013-production-readiness-fixes
**Created:** 2025-11-12
**Status:** 🟠 Planned
**Priority:** 🔴 CRITICAL
**Estimated Effort:** 4 hours

---

## 📋 Overview

Comprehensive Production Readiness Audit revealed critical issues that must be fixed before Google indexing. Current overall score: **62/100** 🟡

**Audit Date:** 2025-11-12
**Audit Method:** Chrome DevTools MCP + Manual Code Review
**Test URL:** https://hungry-olives-study.loca.lt/en

---

## 🎯 Goals

Transform production readiness score from **62 → 92** (+30 points) by addressing:
1. Security vulnerabilities (30 → 95)
2. SEO missing features (75 → 95)
3. Performance bottlenecks (65 → 90)
4. Best practices gaps (50 → 85)

---

## 📊 Audit Results Summary

| Category | Current | Target | Status |
|----------|---------|--------|--------|
| **Performance** | 65/100 | 90/100 | 🟡 Needs Work |
| **Security** | 30/100 | 95/100 | 🔴 CRITICAL |
| **SEO** | 75/100 | 95/100 | 🟡 Good |
| **Accessibility** | 90/100 | 95/100 | 🟢 Excellent |
| **Best Practices** | 50/100 | 85/100 | 🟡 Needs Work |
| **OVERALL** | **62/100** | **92/100** | 🟡 Not Ready |

---

## 🚨 Critical Blockers (Must Fix)

### 1. Security Headers Missing 🔴 (30/100)

**Current State:**
- ❌ No Content-Security-Policy (CSP)
- ❌ No X-Frame-Options
- ❌ No X-Content-Type-Options
- ❌ No Strict-Transport-Security (HSTS)
- ❌ No Permissions-Policy
- ⚠️ x-powered-by: Next.js exposed

**Risks:**
- XSS (Cross-Site Scripting) attacks
- Clickjacking attacks
- MIME sniffing attacks
- Man-in-the-middle attacks

**Impact:** CRITICAL - Google will penalize, browsers will warn users

**Solution:** Add security headers to `next.config.js`

**Estimated Time:** 30 minutes

---

### 2. SEO Missing Components 🟡 (75/100)

**Current State:**
- ❌ No `robots.txt`
- ❌ No `sitemap.xml`
- ❌ No Open Graph tags
- ❌ No JSON-LD structured data
- ✅ hreflang links present (good!)
- ✅ Title + meta description present

**Impact:** HIGH - Poor Google indexing, no social media previews

**Solution:**
- Create `public/robots.txt`
- Install `next-sitemap` for sitemap generation
- Add Open Graph tags to layout
- Add Organization schema JSON-LD

**Estimated Time:** 1 hour

---

### 3. Performance Issues 🟡 (65/100)

**Current Metrics:**
- LCP (Largest Contentful Paint): **4,033ms** 🔴 (target: < 2.5s)
- CLS (Cumulative Layout Shift): **0.00** 🟢 (perfect!)
- TTFB (Time to First Byte): **396ms** 🟢 (good)

**Root Causes:**
1. **HTTP/1.1 Protocol** (localtunnel issue)
   - Estimated savings: FCP -12,270ms | LCP -17,900ms
   - Fix: Production deployment (Vercel = HTTP/2 automatic)

2. **Render Blocking Resources**
   - Estimated savings: FCP -3,072ms | LCP -3,072ms
   - Fix: Font preloading + critical CSS inline

3. **Network Dependency Waterfall**
   - Resources load sequentially, not in parallel
   - Fix: Resource hints (preload, prefetch, dns-prefetch)

**Impact:** MEDIUM - Affects Core Web Vitals ranking

**Solution:** Font preloading, resource hints, production deployment test

**Estimated Time:** 2 hours

---

## 🔧 Detailed Requirements

### Phase 1: Security Hardening (30 min)

#### 1.1 Security Headers Implementation

**File:** `next.config.js`

**Requirements:**
- Add Content-Security-Policy header
  - Allow Stripe scripts/frames
  - Block unsafe inline scripts (except theme script)
  - Allow self + data URIs for images/fonts
- Add X-Frame-Options: DENY
- Add X-Content-Type-Options: nosniff
- Add Referrer-Policy: strict-origin-when-cross-origin
- Add Strict-Transport-Security with preload
- Add Permissions-Policy (disable geolocation, camera, microphone)
- Add X-DNS-Prefetch-Control: on
- Set poweredByHeader: false (hide Next.js version)

**Acceptance Criteria:**
- All 7 security headers present in response
- Test with https://securityheaders.com → Score A or A+
- No browser console warnings about CSP violations
- Stripe checkout still works (CSP allows Stripe domains)

---

#### 1.2 CSP Configuration Details

**Policy String:**
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https: blob:;
font-src 'self' data:;
connect-src 'self' https://api.stripe.com;
frame-src 'self' https://js.stripe.com;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

**Notes:**
- `unsafe-inline` needed for:
  - Theme switcher inline script
  - Tailwind inline styles
- `unsafe-eval` needed for Next.js development
- Remove `unsafe-eval` in production build

**Testing:**
- ✅ Homepage loads without CSP errors
- ✅ Stripe checkout opens correctly
- ✅ Theme switcher works
- ✅ All images display
- ✅ Fonts load correctly

---

### Phase 2: SEO Setup (1 hour)

#### 2.1 robots.txt Creation

**File:** `public/robots.txt`

**Requirements:**
```txt
User-agent: *
Allow: /
Sitemap: https://dulundu.dev/sitemap.xml

# Block admin routes
Disallow: /*/admin/
Disallow: /api/

# Block auth pages from indexing
Disallow: /*/auth/

# Allow public pages
Allow: /en/
Allow: /tr/
Allow: /pt-BR/
```

**Acceptance Criteria:**
- File accessible at `/robots.txt`
- Google Search Console recognizes it
- Admin routes blocked from crawling

---

#### 2.2 Sitemap Generation

**Package:** `next-sitemap`

**Installation:**
```bash
npm install next-sitemap
```

**Configuration File:** `next-sitemap.config.js`

**Requirements:**
```javascript
module.exports = {
  siteUrl: 'https://dulundu.dev',
  generateRobotsTxt: true, // Auto-generate robots.txt
  exclude: ['/*/admin/*', '/api/*', '/*/auth/*'],
  alternateRefs: [
    { href: 'https://dulundu.dev/en', hreflang: 'en' },
    { href: 'https://dulundu.dev/tr', hreflang: 'tr' },
    { href: 'https://dulundu.dev/pt-BR', hreflang: 'pt-BR' }
  ],
  transform: async (config, path) => {
    // Dynamic priority based on page importance
    let priority = 0.7;
    if (path === '/en' || path === '/tr' || path === '/pt-BR') priority = 1.0;
    if (path.includes('/products/') || path.includes('/services')) priority = 0.9;
    if (path.includes('/blog/')) priority = 0.8;

    return {
      loc: path,
      changefreq: 'daily',
      priority,
      lastmod: new Date().toISOString(),
    }
  }
}
```

**Post-build Script:**
```json
// package.json
"scripts": {
  "postbuild": "next-sitemap"
}
```

**Acceptance Criteria:**
- Sitemap generated at `/sitemap.xml`
- Sitemap includes all public pages (en/tr/pt-BR)
- Sitemap excludes admin/auth/API routes
- Hreflang alternates present for each URL
- Sitemap submitted to Google Search Console

---

#### 2.3 Open Graph Tags

**File:** `app/[locale]/layout.tsx`

**Requirements:**
```typescript
export async function generateMetadata({ params: { locale } }) {
  return {
    title: 'Dulundu.dev - Professional WordPress & Web Development',
    description: 'Expert WordPress optimization, consulting, and digital products.',
    openGraph: {
      title: 'Dulundu.dev - Professional WordPress & Web Development',
      description: 'Expert WordPress optimization, consulting, and digital products.',
      url: 'https://dulundu.dev',
      siteName: 'Dulundu.dev',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Dulundu.dev - Professional WordPress Services'
        }
      ],
      locale: locale === 'pt-BR' ? 'pt_BR' : locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Dulundu.dev - Professional WordPress & Web Development',
      description: 'Expert WordPress optimization, consulting, and digital products.',
      images: ['/og-image.png'],
      creator: '@dulundu',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  }
}
```

**Asset Requirements:**
- Create `/public/og-image.png` (1200x630px)
- Create `/public/og-image-square.png` (1:1 ratio for some platforms)

**Testing:**
- ✅ Test with Facebook Debugger: https://developers.facebook.com/tools/debug/
- ✅ Test with Twitter Card Validator: https://cards-dev.twitter.com/validator
- ✅ Test with LinkedIn Post Inspector

**Acceptance Criteria:**
- OG tags present in HTML `<head>`
- OG image displays correctly on Facebook/Twitter share
- Title + description render properly

---

#### 2.4 JSON-LD Structured Data

**File:** `app/[locale]/layout.tsx`

**Requirements:**

Add Organization schema:
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dulundu.dev',
  url: 'https://dulundu.dev',
  logo: 'https://dulundu.dev/logo.png',
  description: 'Professional WordPress optimization, consulting, and digital products',
  email: 'admin@dulundu.dev',
  sameAs: [
    'https://twitter.com/dulundu',
    'https://github.com/dulundu',
    'https://linkedin.com/company/dulundu'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    availableLanguage: ['English', 'Turkish', 'Portuguese'],
    email: 'admin@dulundu.dev'
  }
};

// In layout return:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

Add Product schema for product pages:
```typescript
// app/[locale]/products/[slug]/page.tsx
const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.title,
  description: product.description,
  image: product.coverImage,
  offers: {
    '@type': 'Offer',
    price: product.price,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock'
  }
};
```

**Testing:**
- ✅ Test with Google Rich Results Test: https://search.google.com/test/rich-results
- ✅ No errors or warnings
- ✅ Preview shows correct data

**Acceptance Criteria:**
- Organization schema on homepage
- Product schema on product pages
- BlogPosting schema on blog posts
- Valid JSON-LD syntax
- Google recognizes structured data

---

### Phase 3: Performance Optimization (2 hours)

#### 3.1 Font Preloading

**File:** `app/[locale]/layout.tsx`

**Requirements:**

Add font preload links:
```typescript
export default function Layout({ children, params: { locale } }) {
  return (
    <html lang={locale}>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/_next/static/media/plus-jakarta-sans-latin-600-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/_next/static/media/plus-jakarta-sans-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="preconnect" href="https://js.stripe.com" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Expected Impact:**
- 100-200ms faster font rendering
- Reduced FOUT (Flash of Unstyled Text)

**Acceptance Criteria:**
- Fonts load before first paint
- No FOUT visible on page load
- Lighthouse "Preload key requests" warning resolved

---

#### 3.2 Resource Hints

**File:** `next.config.js`

**Requirements:**

Add resource hints headers:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        ...securityHeaders,
        {
          key: 'Link',
          value: [
            '</fonts/plus-jakarta-sans.woff2>; rel=preload; as=font; crossorigin',
            '<https://js.stripe.com>; rel=preconnect',
          ].join(', ')
        }
      ]
    }
  ]
}
```

**Acceptance Criteria:**
- Link headers present in HTTP response
- Browser preloads critical resources
- Network waterfall shows parallel loading

---

#### 3.3 Production Build Test

**Requirements:**

Test production build performance:
```bash
# Build production
npm run build

# Start production server
npm run start

# Run performance audit
# Expected improvements:
# - Bundle size: 2.4 MB → 600-800 KB (70% reduction)
# - LCP: 4.0s → < 2.5s (HTTP/2 + minification)
```

**Production Deployment:**
- Deploy to Vercel (automatic HTTP/2)
- Run Lighthouse audit on production URL
- Target scores:
  - Performance: > 90
  - LCP: < 2.5s
  - FCP: < 1.8s
  - CLS: < 0.1

**Acceptance Criteria:**
- Production build completes without errors
- Bundle size < 1 MB
- Core Web Vitals pass (all green)
- Lighthouse Performance score > 90

---

### Phase 4: Best Practices (30 min)

#### 4.1 Error Boundary

**File:** `app/error.tsx`

**Requirements:**
```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log error to monitoring service
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
          >
            Try again
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 border border-border rounded-lg"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  )
}
```

**Acceptance Criteria:**
- Error boundary catches runtime errors
- User sees friendly error message (not stack trace)
- Try again button resets error state
- Go home button navigates to homepage

---

#### 4.2 Skip to Main Content Link

**File:** `components/layout/Navbar.tsx`

**Requirements:**
```typescript
export default function Navbar() {
  return (
    <>
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <nav>
        {/* Navbar content */}
      </nav>
    </>
  )
}

// Add id to main element
<main id="main-content">
  {children}
</main>
```

**Acceptance Criteria:**
- Skip link hidden by default
- Skip link appears on Tab key press
- Clicking skip link focuses main content
- Keyboard navigation works smoothly

---

## 📈 Success Metrics

### Before vs After

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Overall Score** | 62/100 | 92/100 | +30 points |
| **Performance** | 65/100 | 90/100 | +25 points |
| **Security** | 30/100 | 95/100 | +65 points |
| **SEO** | 75/100 | 95/100 | +20 points |
| **Accessibility** | 90/100 | 95/100 | +5 points |
| **Best Practices** | 50/100 | 85/100 | +35 points |

### Core Web Vitals

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| LCP | 4.0s | < 2.5s | 🔴 Needs Fix |
| FID | Not measured | < 100ms | 🟡 TBD |
| CLS | 0.00 | < 0.1 | 🟢 Good |
| TTFB | 396ms | < 800ms | 🟢 Good |

---

## 🧪 Testing Plan

### Unit Tests
- N/A (configuration changes, no logic)

### Integration Tests
- Test security headers present in response
- Test robots.txt accessible
- Test sitemap.xml generates correctly
- Test Open Graph tags render

### Manual Testing
1. **Security:**
   - Run https://securityheaders.com
   - Verify CSP doesn't block Stripe
   - Check browser console for CSP warnings

2. **SEO:**
   - Submit sitemap to Google Search Console
   - Test OG tags with Facebook Debugger
   - Test Twitter Card preview
   - Run Google Rich Results Test

3. **Performance:**
   - Run Lighthouse audit (production)
   - Test Core Web Vitals with PageSpeed Insights
   - Verify fonts load without FOUT
   - Check Network tab for resource hints

4. **Accessibility:**
   - Test skip link with Tab key
   - Test error boundary with intentional error
   - Run WAVE accessibility checker

---

## 🚀 Deployment Plan

### Pre-deployment
1. Create feature branch: `feature/013-production-readiness-fixes`
2. Implement all changes
3. Test locally
4. Run `npm run build` and verify no errors
5. Test production build locally

### Deployment
1. Merge to main branch
2. Deploy to Vercel staging
3. Run full audit on staging URL
4. If passing, promote to production
5. Verify production URL

### Post-deployment
1. Submit sitemap to Google Search Console
2. Run securityheaders.com audit
3. Run Lighthouse audit
4. Monitor Core Web Vitals in Search Console
5. Track error rates in Vercel Analytics

---

## 📝 Implementation Checklist

### Phase 1: Security (30 min)
- [ ] Update `next.config.js` with security headers
- [ ] Add `poweredByHeader: false`
- [ ] Test with securityheaders.com
- [ ] Verify Stripe still works
- [ ] Test in all browsers (Chrome, Firefox, Safari)

### Phase 2: SEO (1 hour)
- [ ] Create `public/robots.txt`
- [ ] Install `next-sitemap`
- [ ] Create `next-sitemap.config.js`
- [ ] Add postbuild script to `package.json`
- [ ] Add Open Graph tags to `layout.tsx`
- [ ] Create `/public/og-image.png`
- [ ] Add JSON-LD structured data
- [ ] Test sitemap generation
- [ ] Test OG tags with debuggers

### Phase 3: Performance (2 hours)
- [ ] Add font preload links to `layout.tsx`
- [ ] Add DNS prefetch/preconnect for Stripe
- [ ] Add resource hints to `next.config.js`
- [ ] Run production build
- [ ] Test bundle size (expect < 1 MB)
- [ ] Deploy to production
- [ ] Run Lighthouse on production URL
- [ ] Verify LCP < 2.5s

### Phase 4: Best Practices (30 min)
- [ ] Create `app/error.tsx`
- [ ] Test error boundary
- [ ] Add skip link to Navbar
- [ ] Test skip link with keyboard
- [ ] Final smoke test all features

### Post-Implementation
- [ ] Update `.specpulse/INDEX.md`
- [ ] Create verification report
- [ ] Submit sitemap to Google
- [ ] Monitor Core Web Vitals for 1 week

---

## 🔗 References

- [Google Core Web Vitals](https://web.dev/vitals/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [next-sitemap Documentation](https://github.com/iamvishnusankar/next-sitemap)
- [Open Graph Protocol](https://ogp.me/)
- [Schema.org Structured Data](https://schema.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 📊 Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| CSP breaks Stripe | Low | High | Test thoroughly, whitelist Stripe domains |
| sitemap too large | Low | Low | Exclude admin/auth routes |
| Font preload wrong URL | Medium | Medium | Test with production build paths |
| Error boundary too aggressive | Low | Medium | Test with various error types |

---

## 💡 Future Improvements

After core fixes are deployed:

1. **Performance:**
   - Implement route prefetching
   - Add service worker for offline support
   - Optimize images with next/image
   - Add Redis caching layer

2. **SEO:**
   - Create dynamic OG images per page
   - Add FAQ schema for blog posts
   - Implement breadcrumb navigation
   - Add review/rating schema

3. **Monitoring:**
   - Set up Sentry for error tracking
   - Add Google Analytics
   - Implement Real User Monitoring (RUM)
   - Set up Core Web Vitals alerts

4. **Security:**
   - Add rate limiting
   - Implement CSRF protection
   - Add webhook signature verification
   - Set up security.txt

---

**Status:** 🟠 Ready for Implementation
**Next Step:** Create implementation plan
**Estimated Total Time:** 4 hours
