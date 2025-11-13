# Admin Panel Polish & Stability - TASKS

**Feature:** Admin UX cleanup + stability fixes
**Status:** 📋 Task List Draft
**Priority:** 🟠 HIGH
**Created:** 2025-11-10

---

## Phase 1 – Layout Separation (3/3)
- [x] APP-001: Build `AdminLayout` (sidebar + topbar) without public footer.
- [x] APP-002: Update every `/admin/*` route to use AdminLayout and remove PageWrapper/public nav.
- [x] APP-003: Replace public language/currency switchers with admin-scoped controls (optional hide).

## Phase 2 – Multi-Currency Visibility (3/3)
- [x] APP-010: Show TRY/BRL override columns/badges in `/admin/products` table (with fallback icons for missing overrides).
- [x] APP-011: Display order currency + symbol in `/admin/orders`, using `formatCurrencyAmount`.
- [x] APP-012: Add per-product currency summary drawer/modal for quick audit.

## Phase 3 – Product Form Enhancements (3/4)
- [x] APP-020: Auto-generate localized price suggestions using `generatePriceMap` preview when base price/currency changes.
- [x] APP-021: Prefill override inputs when editing an existing product (read from `product.prices`).
- [ ] APP-022: Add inline warnings when a currency lacks override or conversion.
- [x] APP-023: Show real-time formatted preview (symbol + amount) next to each override input.

## Phase 4 – Stripe Sync & Editor Stability (0/4)
- [ ] APP-030: Surface Stripe `productId` + `priceId` per currency on product edit page.
- [ ] APP-031: Implement “Refresh Stripe Prices” action + success toast/log entry.
- [ ] APP-032: Fix Tiptap configuration to prevent duplicate `link` extension warnings (single extension registration).
- [ ] APP-033: Resolve `_next/static/chunks` 404 spam if reproducible; otherwise document why safe.

## Phase 5 – Settings & Documentation (0/4)
- [ ] APP-040: Either implement minimal settings (profile/password) or hide nav entry + disabled quick actions.
- [ ] APP-041: Update Playwright admin suite to verify multi-currency columns + clean console.
- [ ] APP-042: Document admin workflows (pricing, Stripe resync) in `ADMIN_GUIDE.md`.
- [ ] APP-043: Update SpecPulse INDEX + tasks upon completion.

---

**Task Author:** Claude Code
**Status:** 📋 Draft
