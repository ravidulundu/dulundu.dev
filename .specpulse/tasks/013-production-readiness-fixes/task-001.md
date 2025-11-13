# Task Breakdown: Production Readiness Fixes

**Feature:** 013-production-readiness-fixes
**Created:** 2025-11-12
**Status:** 🟠 Ready to Execute
**Estimated Time:** 4 hours

---

## Task 1: Security Headers (30 min) 🔴

### 1.1 Add Security Headers Array (15 min)
**File:** `next.config.js`

**Implementation:**
```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com;"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  // ... rest of config
}
```

**Status:** 🟠 TODO

---

### 1.2 Test Security Headers (15 min)
**Commands:**
```bash
npm run build
npm run start

# Visit https://securityheaders.com
# Enter: localhost:3000 (or production URL)
# Target: A or A+ score
```

**Status:** 🟠 TODO

---

## Task 2: SEO Setup (1 hour) 🟡

### 2.1 robots.txt (5 min)
**File:** `public/robots.txt`

**Content:**
```txt
User-agent: *
Allow: /
Sitemap: https://dulundu.dev/sitemap.xml

Disallow: /*/admin/
Disallow: /api/
Disallow: /auth/
```

**Status:** 🟠 TODO

---

### 2.2 Install next-sitemap (10 min)
```bash
npm install next-sitemap
```

**File:** `next-sitemap.config.js`

**Content:**
```javascript
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://dulundu.dev',
  generateRobotsTxt: true,
  exclude: ['/*/admin/*', '/api/*', '/auth/*'],
  alternateRefs: [
    {
      href: 'https://dulundu.dev/en',
      hreflang: 'en',
    },
    {
      href: 'https://dulundu.dev/tr',
      hreflang: 'tr',
    },
    {
      href: 'https://dulundu.dev/pt-BR',
      hreflang: 'pt-BR',
    },
  ],
}
```

**File:** `package.json`

**Add script:**
```json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

**Status:** 🟠 TODO

---

### 2.3 Open Graph Metadata (20 min)
**File:** `app/[locale]/layout.tsx`

**Add to metadata:**
```typescript
export const metadata: Metadata = {
  // ... existing metadata
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dulundu.dev',
    siteName: 'Dulundu.dev',
    title: 'Dulundu.dev - Professional Web Development',
    description: 'Expert web development services',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dulundu.dev',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dulundu.dev - Professional Web Development',
    description: 'Expert web development services',
    images: ['/og-image.png'],
  },
}
```

**Create:** `public/og-image.png` (1200x630px)

**Status:** 🟠 TODO

---

### 2.4 JSON-LD Structured Data (25 min)
**File:** `app/[locale]/layout.tsx`

**Add to body:**
```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Dulundu.dev',
      url: 'https://dulundu.dev',
      logo: 'https://dulundu.dev/logo.png',
      description: 'Professional web development services',
    }),
  }}
/>
```

**File:** `app/[locale]/products/[id]/page.tsx`

**Add Product schema:**
```typescript
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      offers: {
        '@type': 'Offer',
        price: product.prices[0].amount / 100,
        priceCurrency: currency.toUpperCase(),
      },
    }),
  }}
/>
```

**Status:** 🟠 TODO

---

## Task 3: Performance Optimization (2 hours) 🟡

### 3.1 Font Preloading (15 min)
**File:** `app/[locale]/layout.tsx`

**Add to head:**
```typescript
<link
  rel="preload"
  href="/_next/static/media/inter-font.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

**Status:** 🟠 TODO

---

### 3.2 Resource Hints (15 min)
**File:** `app/[locale]/layout.tsx`

**Add:**
```typescript
<link rel="dns-prefetch" href="https://js.stripe.com" />
<link rel="preconnect" href="https://js.stripe.com" crossOrigin="anonymous" />
<link rel="dns-prefetch" href="https://api.stripe.com" />
```

**Status:** 🟠 TODO

---

### 3.3 Production Build Test (1.5 hours)
```bash
# Clean build
rm -rf .next

# Build
npm run build

# Check build output
# Look for warnings, large bundles

# Start production server
npm run start

# Run Lighthouse audit
# Chrome DevTools → Lighthouse
# Target: Performance > 90

# Check LCP < 2.5s
# Check FCP < 1.8s
# Check CLS < 0.1
```

**Status:** 🟠 TODO

---

## Task 4: Best Practices (30 min) 🟢

### 4.1 Error Boundary (10 min)
**File:** `app/error.tsx`

**Content:**
```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Go home
        </Button>
      </div>
    </div>
  )
}
```

**Status:** 🟠 TODO

---

### 4.2 Skip Link (5 min)
**File:** `components/layout/Navbar.tsx`

**Add at top:**
```typescript
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
>
  Skip to main content
</a>
```

**File:** `components/layout/PageWrapper.tsx`

**Add id:**
```typescript
<main id="main-content">
  {children}
</main>
```

**Status:** 🟠 TODO

---

### 4.3 Hide Next.js Version (5 min)
**File:** `next.config.js`

**Add:**
```javascript
module.exports = {
  poweredByHeader: false,
  // ... rest of config
}
```

**Status:** 🟠 TODO

---

### 4.4 Final Testing (10 min)
```
✅ Homepage loads
✅ All navigation working
✅ Forms submitting
✅ Admin panel accessible
✅ No console errors
✅ No 404s
```

**Status:** 🟠 TODO

---

## Task 5: Deployment Verification (30 min)

### 5.1 Pre-deployment Checklist
```
□ npm run build passes
□ npm run start works
□ Lighthouse score > 90
□ Security headers present
□ Sitemap generated
```

### 5.2 Deploy to Vercel
```bash
vercel --prod
```

### 5.3 Post-deployment
```
□ Visit securityheaders.com → Test production URL
□ Submit sitemap to Google Search Console
□ Monitor Vercel logs for errors
□ Check Core Web Vitals dashboard
```

**Status:** 🟠 TODO

---

## Summary

**Total Tasks:** 19 subtasks across 5 phases
**Current Status:** 0/19 complete
**Expected Results:** Overall score 62 → 92 (+30 points)

**Next Step:** Start with Task 1.1 (Security Headers)

---

## References

**Spec:** `.specpulse/specs/013-production-readiness-fixes/spec-001.md`
**Plan:** `.specpulse/plans/013-production-readiness-fixes/plan-001.md`
