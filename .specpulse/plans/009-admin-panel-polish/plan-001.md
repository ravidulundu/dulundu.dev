# Admin Panel Polish & Stability - PLAN

**Feature:** Admin UX cleanup + stability fixes
**Status:** 📐 Planning In Progress
**Priority:** 🟠 HIGH
**Created:** 2025-11-10

---

## 🎯 Objectives

1. Give admin routes their own shell (no public nav/footer) and clean console output.
2. Make multi-currency data visible/manageable from lists + forms.
3. Provide Stripe sync visibility and controls.

Playwright admin run (2025-11-10) confirmed duplicate layout, missing localized price previews, USD-only tables, Tiptap warnings, and placeholder settings page. This plan addresses those gaps.

---

## 🗺️ Phase Breakdown

### Phase 1 – Layout Separation (1h)
1. Create `components/admin/AdminLayout` with sidebar/topbar.
2. Update all `/admin/*` routes to wrap with AdminLayout (remove PageWrapper/public nav).
3. Move language selector into topbar; drop public footer.

### Phase 2 – Multi-Currency Visibility (1.5h)
1. Product list: add columns showing TRY/BRL overrides + status badges.
2. ProductDetail (admin) modal shows per-currency breakdown.
3. Orders list: format totals using stored currency (Intl formatter).

### Phase 3 – Product Form Enhancements (2h)
1. Compute `generatePriceMap` preview whenever base price changes; show suggestions inside override cards.
2. Populate overrides when editing existing product (read from `product.prices`).
3. Inline warning if a supported currency lacks override + auto-conversion.

### Phase 4 – Stripe Sync & Editor Stability (2h)
1. Show Stripe product/price IDs + last synced timestamp on edit page.
2. Add “Refresh Stripe Prices” button (calls new API route or reuse admin products PUT) + success toast/log.
3. Fix Tiptap extension config to avoid duplicate `link` warnings.
4. Decide on settings nav: either implement basic profile form or hide entry until ready.

### Phase 5 – QA & Documentation (1h)
1. Update Playwright test plan to include admin multi-currency verification.
2. Document admin workflow in `ADMIN_GUIDE.md` (new) including Stripe resync steps.
3. Update SpecPulse tasks/status + PLAYWRIGHT-TEST-REPORT with clean console evidence.

---

## 📦 Deliverables Checklist

- [x] Dedicated admin layout applied to all admin routes.
- [x] Product/Order tables show per-currency info.
- [x] ProductForm previews auto-converted prices and loads overrides.
- [ ] Stripe IDs/resync controls visible.
- [ ] Tiptap/editor console clean.
- [ ] Settings nav reflects actual functionality.
- [ ] QA/docs updated.

---

## 🔎 Verification Snapshot (2025-11-11 02:51)

- Playwright MCP (`/tmp/playwright-mcp-output/1762828851852/page-2025-11-11T02-51-36-094Z.png`) shows the admin dashboard still embedding the public navbar/footer beneath the new sidebar. Layout separation tasks (APP-001..003) remain top priority.
- Console output during the run is clean; remaining warnings are purely UX (duplicate nav, missing Stripe context). Good baseline for regression checking once AdminLayout lands.

## ✅ Progress Update (2025-11-11 03:06)

- All `/admin/*` routes now render solely within `AdminLayout`; `PageWrapper` imports were removed and replaced with lightweight section spacing.
- Sidebar navigation builds locale-aware links (e.g., `/tr/admin/products`) so admins are never bounced to the default locale.
- Playwright MCP screenshot (`/tmp/playwright-mcp-output/1762828851852/page-2025-11-11T03-06-11-833Z.png`) confirms the duplicate public navbar/footer is gone and the layout matches the Claymorphism spec.

## 🔍 QA Notes (Playwright – 03:23 UTC)

- Locale switcher updates the path (`/tr/admin/...`) but admin copy remains English; i18n strings for admin views must be added before marking polish complete.
- Product table still only shows USD price column; TRY/BRL visibility tasks APP-010/APP-012 unstarted.
- Product form “Localized Prices” inputs are blank with no auto-converted hints, so APP-020 preview work is still required.
- Orders table lacks localized currency formatting, reinforcing APP-011 priority.

## ✅ Progress Update (2025-11-11 03:40)

- `/admin/products` artık USD/TRY/BRL sütunları, Base/Manual/Auto rozetleri ve Stripe price ID’sini gösteren bir popover içeriyor (APP-010 & APP-012 tamamlandı). Playwright ekran görüntüsü: `/tmp/playwright-mcp-output/1762828851852/page-2025-11-11T03-38-08-552Z.png`.
- `/admin/orders` tablosu `formatCurrencyAmount` ile toplamları biçimlendiriyor ve ürün isimlerini locale’e göre gösteriyor (APP-011).
- `ProductForm` gerçek zamanlı fiyat önizlemesi sağlıyor, override kartlarında öneriler + badges var ve düzenleme modunda mevcut `product.prices` verileri alanlara doluyor (APP-020/021/023). APP-022 (override uyarıları) halen açık.

---

**Plan Author:** Claude Code
**Status:** 📐 Draft

## 🧪 QA (2025-11-11 04:10)

- EN/TR ürün ve blog tabloları Playwright ile doğrulandı; i18n metinleri locale'e göre değişiyor.
- Kalan iş: Stripe senkronizasyon araçları + admin i18n için çeviri anahtarlarının PT-BR kullanımını yaygınlaştırmak.
