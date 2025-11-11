# Stripe Global Payments & Currency Localization - TASKS

**Feature:** Multi-currency Stripe checkout
**Status:** 📋 Task List Draft
**Priority:** 🔴 CRITICAL
**Created:** 2025-11-10

---

## Phase 1 – Baseline Audit (0/3)
- [ ] TASK-STRIPE-001: Confirm env vars (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXTAUTH_URL`) documented in `.env.example`.
- [ ] TASK-STRIPE-002: Record Stripe CLI workflow in `SPECPULSE-PRODUCTION-READINESS.md` (login, listen, trigger events).
- [ ] TASK-STRIPE-003: Snapshot current Prisma schema for `productPrice` + `order` in SpecPulse memory.

## Phase 2 – Currency Preference Pipeline (0/4)
- [x] TASK-STRIPE-010: Create `getPreferredCurrency(request)` helper shared between middleware + API routes.
- [x] TASK-STRIPE-011: Build currency switcher UI (client component) storing `PREFERRED_CURRENCY` cookie.
- [ ] TASK-STRIPE-012: Prevent middleware from overriding manual currency selection; add unit test.
- [x] TASK-STRIPE-013: Expose preferred currency via React context/hook for components (ProductCard, BuyButton).

## Phase 3 – Admin Pricing UX (0/5)
> Playwright admin run (2025-11-10) confirmed localized price inputs are empty/opaque; tasks below address those gaps.
- [ ] TASK-STRIPE-020: Update `ProductForm` to show auto-converted suggestions + inline validation per currency.
- [ ] TASK-STRIPE-021: Persist overrides via `normalizePriceOverrides` in create/update API routes with Prisma transaction.
- [ ] TASK-STRIPE-022: Surface warnings when override missing for supported currency.
- [ ] TASK-STRIPE-023: Add audit log or toast confirming Stripe price sync after save.
- [ ] TASK-STRIPE-024: Document workflow for editors inside `ADMIN_GUIDE.md` (new file or existing doc).
- [ ] TASK-STRIPE-025: Update admin tables (products, orders) to display multi-currency pricing columns and highlight overrides.
- [ ] TASK-STRIPE-026: Add “Refresh Stripe Prices” action per product to keep Stripe products/prices aligned with overrides.

## Phase 4 – Storefront & Checkout (0/5)
- [x] TASK-STRIPE-030: Implement `formatCurrency` utility (Intl.NumberFormat) reused across components.
- [x] TASK-STRIPE-031: Update product listing/detail pages to use formatter + show currency symbol from helper.
- [x] TASK-STRIPE-032: Enhance `BuyButton` to disable CTA when price missing and surface fallback text.
- [x] TASK-STRIPE-033: Adjust `/api/checkout` to log selected currency + gracefully error with localized message.
- [ ] TASK-STRIPE-034: Ensure checkout success/cancel pages reflect correct currency and amount.

## Phase 5 – Stripe Sync & QA (0/4)
- [ ] TASK-STRIPE-040: Add script/admin action to flush & recreate Stripe prices for a product when overrides change.
- [ ] TASK-STRIPE-041: Extend webhook handler to persist currency + FX metadata on orders.
- [ ] TASK-STRIPE-042: Create Playwright spec covering EN/TR/PT-BR purchase flows until Stripe redirect.
- [ ] TASK-STRIPE-043: Update `PLAYWRIGHT-TEST-REPORT.md` with Stripe test checklist + CLI commands.

---

**Task Author:** Claude Code
**Status:** 📋 Draft
