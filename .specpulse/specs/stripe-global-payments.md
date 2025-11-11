# Stripe Global Payments & Currency Localization - SPEC

**Feature:** Multi-currency Stripe checkout + storefront localization
**Priority:** 🔴 CRITICAL (revenue-impacting)
**Status:** 📝 Specification Phase
**Created:** 2025-11-10

---

## 🎯 Problem (PULSE)

- Users reported inconsistent pricing symbols (`$6200.00` instead of `R$ 6200,00`) and disabled purchase CTAs.
- Checkout currently relies on manual email entry and does not always honor the visitor’s IP/locale currency preference.
- Admins need a reliable way to manage localized prices so conversions do not cause losses when Stripe charges in local currency.
- Stripe integration exists (products, prices, checkout, webhooks) but lacks a documented workflow for currency overrides, CLI usage, and QA.

**Impact:**
- Incorrect currency formats look unprofessional and can violate regional pricing laws.
- Without auto-detection/override, some locales see USD-only pricing, hurting conversion.
- Missing admin tooling forces developers to edit Prisma seed files for every price change.

---

## 📌 Current State Snapshot

| Area | Status | Notes |
|------|--------|-------|
| Stripe SDK helper | ✅ `lib/stripe.ts` lazy loader + product/price helpers |
| Checkout API | ✅ `app/api/checkout/route.ts` creates orders + sessions |
| Webhooks | ✅ `app/api/webhooks/stripe/route.ts` acknowledges events |
| Stripe CLI | ✅ Installed (`npm install -g stripe`), events logged in terminal |
| Pricing model | ✅ `productPrice` table stores per-currency amounts |
| Currency utilities | ✅ `lib/currency.ts` handles mapping, conversion, overrides |
| Locale detection | ✅ `middleware.ts` sets `NEXT_LOCALE` + `PREFERRED_CURRENCY` cookie based on IP |
| Admin UI | 🟡 Product form shows currency selector but overrides UX is rough |
| Storefront display | 🟡 Some cards still show `$` prefix even when currency is `BRL/TRY` |
| QA | 🔴 No documented Stripe CLI + Playwright workflow for currencies |

---

## 📋 Functional Requirements

1. **Currency Preference Pipeline**
   - Detect preferred currency via `request.geo`, locale, or user-selected override.
   - Persist preference in `PREFERRED_CURRENCY` cookie; expose hook/helper for React components.
   - Provide manual override UI (dropdown or account setting) without forcing page reload loops.

2. **Storefront Display**
   - Product list/detail, checkout summary, and success pages must show correct symbol + ISO code.
   - Respect locale-specific formatting (e.g., `R$ 6.200,00` vs `₺6.200,00`).
   - Fallback gracefully if a currency price is missing (hide CTA + show contact link).

3. **Admin Price Management**
   - Product form allows base currency + auto-converted suggestions, plus manual overrides per supported currency (USD/TRY/BRL initially).
   - Display warnings when override missing; prevent saving without at least one price.
   - Persist overrides via `normalizePriceOverrides()` in both create/update routes.

4. **Stripe Asset Sync**
   - `ensureStripeProduct` & `ensureStripePrice` should store Stripe IDs per currency price to avoid duplicates.
   - Introduce background job or admin action to refresh Stripe prices if conversion rules change.

5. **Checkout & Webhooks**
   - `/api/checkout` selects the best price for the preferred currency; if unavailable, gracefully degrade (UI prompt + disable button).
   - Webhook updates order status + currency amounts to prevent mismatches.

6. **Testing & Tooling**
   - Stripe CLI playbook (listen, trigger events, verify webhooks) documented in SpecPulse memory/docs.
   - Playwright scenario per locale to ensure CTA uses the right currency and checkout link is enabled when price exists.

---

## 🧱 Non-Functional Requirements

- **Accuracy:** FX conversions include margin (`PRICE_MARGIN = 1.04`) to avoid loss; margin configurable via env.
- **Performance:** Currency detection must not add more than a few ms; caching for geo lookups.
- **Security:** Keep Stripe keys server-side; never expose to client. CLI instructions must emphasize test keys.

---

## 🚧 Scope & Assumptions

- Supported currencies: `USD`, `TRY`, `BRL` (extendable via `SUPPORTED_CURRENCIES`).
- Geo detection uses Vercel headers; for local dev, fallback to locale path.
- Pricing conversions rely on static rates until a live FX provider is integrated.
- Admin panel already uses `PageWrapper`; design tokens from Claymorphism apply to new UI.

---

## 📦 Deliverables

1. Updated middleware + currency helpers (cookie + override API).
2. Admin product form enhancements (multi-currency inputs, validation, hints).
3. Storefront components (cards, detail, checkout success) using shared formatter utility.
4. Checkout API + webhook adjustments for multi-currency reliability.
5. Documentation: Stripe CLI usage guide + QA checklist + SpecPulse tasks.
6. Playwright coverage for EN/TR/PT-BR purchase buttons.

---

## 🔗 References

- `lib/currency.ts`, `app/api/checkout/route.ts`, `app/api/webhooks/stripe/route.ts`
- `components/products/ProductCard.tsx`, `components/products/BuyButton.tsx`
- Prisma: `productPrice`, `order`, `product` models
- User feedback logs: CLI output showing `product.created`, `price.created`, webhook 200 responses (2025-11-10)

---

**Spec Author:** Claude Code
**Status:** 📝 Draft / Ready for Planning
