# Stripe Global Payments & Currency Localization - PLAN

**Feature:** Multi-currency Stripe checkout
**Status:** 📐 Planning In Progress
**Priority:** 🔴 CRITICAL
**Created:** 2025-11-10
**Target:** Complete in ~6 hours (engineering) + QA

---

## 🎯 Objectives

1. Guarantee users always see prices + checkout in their local currency (USD/TRY/BRL for now).
2. Give admins a UI to review/override per-currency pricing without editing seeds.
3. Document the Stripe CLI workflow so QA/business can validate the flow end-to-end.

---

## 🗺️ Phase Breakdown

> **2025-11-10 Playwright Admin Smoke:** Login → dashboard → products/new confirmed current UI gaps. “Localized Prices” inputs come up blank (no auto-suggestions) and Stripe metadata isn’t surfaced. 404s for chunk assets observed on every admin navigation.

### Phase 1 – Baseline Audit & Tooling (0.5h)
1. Verify `.env` contains `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXTAUTH_URL`.
2. Capture Stripe CLI commands (`stripe login`, `stripe listen --forward-to ...`) in SpecPulse memory.
3. Snapshot current database schema (productPrice, order) for reference.

### Phase 2 – Currency Preference Pipeline (1h)
1. Extract helper (`getPreferredCurrency(req)`) that reads cookie/IP/locale for use in API routes.
2. Add user-facing currency switcher (dropdown near language selector) that updates `PREFERRED_CURRENCY` cookie.
3. Ensure middleware only overrides cookie on first visit; otherwise respect manual override.

### Phase 3 – Admin Pricing UX (1.5h)
1. Extend `ProductForm` to show expandable cards per supported currency (base + overrides).
2. Show auto-converted suggestions using `generatePriceMap` + highlight manual overrides.
3. Update `app/api/admin/products/(route.ts)` to persist `prices` array + Stripe IDs safely (wrap in transaction).

### Phase 4 – Storefront & Checkout (1.5h)
1. Introduce `formatCurrency(amount, currency, locale)` utility for consistent formatting.
2. Update product list/detail/checkout success to use formatter + show fallback message when price missing.
3. Enhance `BuyButton` to disable CTA when no price exists for preferred currency and show admin-provided contact instructions.
4. Update `/api/checkout` + order creation to log the preferred currency used (for analytics).

### Phase 5 – Stripe Sync & QA (1.5h)
1. Add admin action (or script) to resync Stripe prices if overrides changed.
2. Write Playwright spec covering EN/TR/PT-BR purchases up to redirect.
3. Document Stripe CLI test flow (simulate `product.created`, `checkout.session.completed`).

---

## ✅ Progress Notes (2025-11-11 02:55)

- `CurrencyProvider`, `/api/preferences/currency`, and the Navbar currency switcher are live. Playwright run (`/tmp/playwright-mcp-output/1762828851852/page-2025-11-11T02-50-30-431Z.png`) shows instant USD↔TRY↔BRL swaps on `/en/products` with correct formatting.
- Middleware respects cookies and locale routes; language switcher keeps locale through navigation (see `/tmp/.../page-2025-11-11T02-49-26-766Z.png` and `/.../02-50-30-431Z.png`).
- Storefront CTA currently disables itself when `price` missing (verified earlier), but admin overrides + Stripe sync tooling still outstanding.
- Next action: start **Phase 3 – Admin Pricing UX** so editors can see/edit TRY/BRL overrides without seeds, then tackle Phase 4–5 for Stripe automation & documentation.

---

## 📦 Deliverables Checklist

- [ ] Currency preference helper + cookie override UX.
- [ ] Admin multi-currency pricing UI + validation.
- [ ] Storefront currency formatter + CTA guardrails.
- [ ] Checkout API + webhook updates with currency analytics.
- [ ] Stripe sync tooling + CLI playbook.
- [ ] Playwright coverage.

---

**Plan Author:** Claude Code
**Status:** 📐 Ready for Task Breakdown
