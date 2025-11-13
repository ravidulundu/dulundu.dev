<!-- SPECPULSE_METADATA
FEATURE_DIR: 018-csp-security-headers-implementation
FEATURE_ID: 018
SPEC_ID: 001
CREATED: 2025-11-13T13:44:36.282359
STATUS: draft
-->

<!-- SpecPulse Specification Template v1.0 -->
# Specification: 018-csp-security-headers-implementation

## Metadata
- **Feature ID**: 018
- **Spec ID**: 001
- **Created**: 2025-11-13
- **Version**: 1.0.0

## Executive Summary
Add Content Security Policy (CSP) headers to next.config.js to prevent XSS attacks. Configure CSP for inline scripts, styles, images, and third-party resources (Stripe, Vercel). Include script-src, style-src, img-src, connect-src, frame-src directives with proper nonces for inline content

## Problem Statement

Current application has NO Content Security Policy (CSP) headers configured in `next.config.js`, leaving the site vulnerable to:

1. **XSS Attacks**: No restrictions on inline scripts, allowing malicious script injection
2. **Data Exfiltration**: No restrictions on where data can be sent (connect-src)
3. **Clickjacking**: No frame-ancestors protection
4. **Resource Injection**: No restrictions on loaded resources (images, styles, fonts)

**Current State:**
- No CSP headers in `next.config.js`
- Inline scripts and styles used throughout the app
- Third-party integrations: Stripe, Vercel Analytics (need allowlisting)
- dangerouslySetInnerHTML used in blog posts (XSS risk)

**Impact:**
- **Security Risk**: High vulnerability to XSS attacks
- **Compliance**: Fails security audits (OWASP Top 10)
- **User Trust**: No protection against malicious content injection

**Reference:** CLAUDE.md Technical Debt Audit, Test Report line 153

## Functional Requirements

FR-001: Configure CSP Headers in next.config.js
  - Acceptance: CSP headers added with all required directives
  - Priority: MUST

FR-002: Script-Src Directive
  - Acceptance: Allow 'self', nonce for inline scripts, Stripe, Vercel
  - Priority: MUST

FR-003: Style-Src Directive
  - Acceptance: Allow 'self', 'unsafe-inline' for Tailwind, nonce for inline styles
  - Priority: MUST

FR-004: Image-Src Directive
  - Acceptance: Allow 'self', data:, https:, blob: for dynamic images
  - Priority: MUST

FR-005: Connect-Src Directive
  - Acceptance: Allow 'self', Stripe API, Vercel Analytics
  - Priority: MUST

FR-006: Frame-Src Directive
  - Acceptance: Allow Stripe checkout frames only
  - Priority: MUST

FR-007: Nonce Generation for Inline Scripts
  - Acceptance: Generate nonces in middleware, inject into script tags
  - Priority: SHOULD

## User Stories

**As a** website owner
**I want** CSP headers to protect against XSS attacks
**So that** user data and sessions are secure from malicious scripts

**Acceptance Criteria:**
- [ ] XSS attacks blocked by CSP
- [ ] Inline scripts only execute with valid nonce
- [ ] Third-party scripts limited to trusted domains (Stripe, Vercel)
- [ ] CSP violations logged for monitoring
- [ ] No legitimate functionality broken by CSP

**As a** security auditor
**I want** Content Security Policy implemented
**So that** the site meets OWASP security standards

**Acceptance Criteria:**
- [ ] CSP headers present on all pages
- [ ] All CSP directives properly configured
- [ ] No 'unsafe-eval' in script-src
- [ ] Frame-ancestors prevents clickjacking
- [ ] Report-uri configured for violation monitoring

## Technical Constraints

1. **Next.js Compatibility**: Must work with Next.js 14.2.0 App Router
2. **Inline Styles**: Tailwind CSS requires 'unsafe-inline' or nonces for styles
3. **Blog Content**: dangerouslySetInnerHTML in blog posts needs careful CSP config
4. **Stripe Integration**: Must allow Stripe.js and checkout frames
5. **Development Mode**: CSP should be configurable (strict in prod, relaxed in dev)

## Dependencies

**Code Files:**
- `next.config.js` (add headers configuration)
- `middleware.ts` (optional: add nonce generation)
- `app/layout.tsx` (add nonce to script tags if using nonces)

**External Dependencies:**
- Next.js 14.2.0 (existing)

**Third-Party Domains to Allowlist:**
- `js.stripe.com` (Stripe.js)
- `checkout.stripe.com` (Stripe Checkout)
- `*.vercel-analytics.com` (Vercel Analytics)
- `vitals.vercel-insights.com` (Vercel Speed Insights)

## Success Criteria

- [ ] CSP headers configured in next.config.js
- [ ] All required directives present: default-src, script-src, style-src, img-src, connect-src, frame-src, frame-ancestors
- [ ] Stripe checkout works without CSP violations
- [ ] Blog posts render correctly with dangerouslySetInnerHTML
- [ ] No console CSP violation errors on any page
- [ ] CSP tested with https://csp-evaluator.withgoogle.com
- [ ] Security audit passes (OWASP CSP check)
- [ ] Documentation updated in CLAUDE.md (remove from technical debt)

**Example CSP Configuration:**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://api.stripe.com https://*.vercel-analytics.com",
              "frame-src https://checkout.stripe.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};
```
