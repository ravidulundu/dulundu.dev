# Admin Panel Polish & Stability - SPEC

**Feature:** Admin UX cleanup + stability fixes
**Priority:** 🟠 HIGH
**Status:** 📝 Specification Phase
**Created:** 2025-11-10

---

## 🎯 Problem (PULSE)

Playwright smoke tests across all admin routes (`/admin/dashboard`, `/products`, `/blog`, `/portfolio`, `/orders`, `/settings`, multi-locale) exposed several UX and technical gaps:

1. **Layout contamination:** Every admin page renders the public navbar, language switcher, currency switcher, and footer. This causes duplicate navigation, clutters the UI, and couples admin state to public layout logic.
2. **Multi-currency visibility:** Product/Order tables display only `$… USD` values; localized overrides are invisible, so editors cannot verify TRY/BRL prices. Product form “Localized Prices” inputs are blank with no auto-suggested conversions or previously-saved overrides.
3. **Stripe management:** There is no way to view or refresh Stripe product/price IDs after editing prices. Admins cannot trigger resyncs or see when overrides differ from Stripe.
4. **Editor warnings:** Blog create/edit screens emit repeated Tiptap warnings about duplicate `link` extensions, indicating misconfiguration.
5. **Settings placeholder:** `/admin/settings` is a static “Coming soon” page with disabled quick-action buttons; menu misleads admins.
6. **Localization gaps:** Switching admin locale (EN ↔ TR ↔ PT-BR) only changes the public navbar footer strings; admin-specific copy remains in EN and currency switcher doesn’t update data tables.

**Impact:**
- Admin users cannot confidently configure localized prices or verify Stripe sync status.
- Console warnings degrade developer trust and may hide real issues.
- Settings navigation is dead weight, confusing editors.
- Duplicated public layout increases risk when marketing layout changes.

---

## 📋 Requirements

1. **Dedicated Admin Layout**
   - Replace public navbar/footer with admin-specific shell (sidebar + topbar) so marketing changes don’t affect admin.
   - Remove public currency switcher from admin header; expose admin-specific locale selector if needed.

2. **Multi-Currency Visibility**
   - Product table: show columns or badges for TRY/BRL overrides, highlight missing ones.
   - Orders table: display stored order currency (symbol + ISO) instead of hardcoded USD.

3. **Product Form Enhancements**
   - “Localized Prices” cards should show auto-converted suggestions using `generatePriceMap` preview.
   - When editing existing products, populate inputs with saved overrides.
   - Inline validation / warnings when a currency lacks override.

4. **Stripe Sync Controls**
   - Surface Stripe product/price IDs on edit screen.
   - Provide “Refresh Stripe Prices” action to recreate Stripe prices if overrides change.
   - Log/surface last sync timestamp + status.

5. **Editor Stability**
   - Fix Tiptap configuration to avoid duplicate `link` extensions + warnings.
   - Ensure console stays clean (no sticky scroll spam, or handle appropriately).

6. **Settings Experience**
   - Either implement core settings (profile/password) or hide the nav item until ready.
   - Quick actions (clear cache, backup) should be removed or wired up.

---

## 🏗️ Deliverables

1. Admin layout component (no public header/footer) applied to all `/admin/*` routes.
2. ProductList + OrdersList UI showing multi-currency info.
3. ProductForm UI rewrite for localized price suggestions + override previews.
4. Stripe sync widgets (ID display + resync button + toast/audit log entry).
5. Fixed Tiptap extension configuration (no duplicate warnings) + console sanity check.
6. Settings nav decision (implemented or removed).

---

**Spec Author:** Claude Code
**Status:** 📝 Draft / Ready for Planning
