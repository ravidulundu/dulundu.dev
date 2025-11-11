# Claymorphism Theme Adoption - SPEC

**Feature:** Apply tweakcn Claymorphism design tokens repo-wide
**Priority:** 🟠 HIGH (brand consistency)
**Status:** ✅ Delivered (2025-11-10)
**Klasör:** Design System / Theme

---

## 🎯 Problem (PULSE)

- UI colors/fonts/shadows drifted away from the approved Claymorphism palette.
- Hex codes + gradients sprinkled across components produced mismatched visuals, especially on hero + logo.
- Tailwind tokens did not expose sidebar/chart/shadow variables from the source JSON, making future UI inconsistent.

**Impact:**
- Brand promise broken between design reference (`https://tweakcn.com/r/themes/claymorphism.json`) and actual site.
- Harder to maintain (each component manually styled).
- Accessibility risk due to ad-hoc color choices.

---

## 📋 Requirements

1. **Token Parity** – Copy every CSS custom property from the Claymorphism JSON into `:root`/`.dark` inside `app/globals.css`.
2. **Tailwind Bridge** – Map all semantic tokens (background, primary, sidebar, chart, etc.) inside `tailwind.config.js` so components can rely on `bg-card`, `text-primary`, etc.
3. **Font Stack** – Load Plus Jakarta Sans, Lora, Roboto Mono via `@fontsource` inside `app/[locale]/layout.tsx` and expose them via CSS variables (`--font-sans`, etc.).
4. **Component Audit** – Update shared UI (buttons, hero, cards, admin pages) to remove inline gradients/hex codes and use Tailwind semantic classes.
5. **Shadow System** – Provide `--shadow-*` vars for clay depth and reuse them in components that need emphasis.
6. **Verification** – Capture Playwright MCP snapshots across locales (EN/TR) to confirm palette alignment with the reference theme.

---

## 🏗️ Implementation Summary

- Ran `npx shadcn@latest add https://tweakcn.com/r/themes/claymorphism.json` to import the theme definition.
- `app/globals.css` now mirrors every token from the JSON, including fonts, radius, shadows, sidebar + chart colors (`:root` + `.dark`).
- `tailwind.config.js` references the CSS vars for colors, border radius, and font families so components can stay semantic.
- `app/[locale]/layout.tsx` imports the required fontsource packages and wraps the tree with `NextIntlClientProvider` so typography + i18n align.
- Components across `components/ui` and layout files no longer use gradients; they consume `bg-card`, `text-primary`, `shadow-[var(--shadow-sm)]`, etc.

---

## ✅ Delivery Notes

- Verified hero, logo, cards, and admin tables using Playwright MCP snapshots; no stray gradients remain.
- Locale switcher + footer respect the same palette, ensuring parity between marketing and dashboard surfaces.
- Future themes can reuse this spec by swapping the JSON + updating `app/globals.css`.

---

**Spec Author:** Claude Code
**Reviewed By:** Dulundu.dev Dev Team
**Status:** ✅ Delivered
