# Task Breakdown: shadcn/ui Migration

**Feature:** 005-shadcn-ui-migration
**Created:** 2025-11-12 (Retroactive)
**Status:** ✅ COMPLETE
**Estimated Time:** 4 hours

---

## Task 1: shadcn/ui Setup (30 min)

**Commands:**
```bash
npx shadcn-ui@latest init
```

**Configuration:**
```
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Would you like to use CSS variables for colors? › yes
```

**Files Created:**
- `components.json`
- `lib/utils.ts`

**Status:** ✅ COMPLETE

---

## Task 2: Install Core Components (30 min)

**Commands:**
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
```

**Files Created:**
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/label.tsx`
- `components/ui/textarea.tsx`
- `components/ui/select.tsx`

**Status:** ✅ COMPLETE

---

## Task 3: Install Advanced Components (30 min)

**Commands:**
```bash
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tabs
```

**Files Created:**
- `components/ui/dropdown-menu.tsx`
- `components/ui/dialog.tsx`
- `components/ui/toast.tsx`
- `components/ui/tabs.tsx`

**Status:** ✅ COMPLETE

---

## Task 4: Contact Form Migration (45 min)

**File:** `app/[locale]/contact/page.tsx`

**Before:**
```typescript
<input type="text" />
<textarea />
<button>Submit</button>
```

**After:**
```typescript
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

<div>
  <Label htmlFor="name">Name</Label>
  <Input id="name" name="name" />
</div>

<div>
  <Label htmlFor="message">Message</Label>
  <Textarea id="message" name="message" />
</div>

<Button type="submit">Submit</Button>
```

**Status:** ✅ COMPLETE

---

## Task 5: Admin Forms Migration (1 hour)

**Files:**
- `app/[locale]/admin/products/new/page.tsx`
- `app/[locale]/admin/blog/new/page.tsx`
- `app/[locale]/admin/portfolio/new/page.tsx`

**Changes:**
- Replaced all custom inputs with shadcn Input
- Replaced all custom textareas with shadcn Textarea
- Replaced all custom buttons with shadcn Button
- Added proper Label components

**Status:** ✅ COMPLETE

---

## Task 6: Product Cards Migration (30 min)

**File:** `app/[locale]/products/page.tsx`

**Before:**
```typescript
<div className="border rounded-lg p-4">
  <h3>Product Name</h3>
  <p>Description</p>
</div>
```

**After:**
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* ... */}
  </CardContent>
</Card>
```

**Status:** ✅ COMPLETE

---

## Task 7: Component Customization (30 min)

**File:** `components/ui/button.tsx`

**Added Clay Variant:**
```typescript
variants: {
  variant: {
    // ... existing variants
    clay: "shadow-clay-md hover:shadow-clay-lg bg-white transition-shadow",
  }
}
```

**File:** `components/ui/card.tsx`

**Added Clay Styles:**
```typescript
className={cn("shadow-clay-md rounded-clay bg-white", className)}
```

**Status:** ✅ COMPLETE

---

## Task 8: Testing (30 min)

**Test Cases:**
- ✅ Contact form working
- ✅ Admin forms working
- ✅ Product cards render correctly
- ✅ All buttons interactive
- ✅ Accessibility (ARIA) working
- ✅ Dark mode compatibility

**Status:** ✅ COMPLETE

---

## Summary

**Components Installed:** 10
**Forms Migrated:** 4 (contact + 3 admin forms)
**Cards Migrated:** 3 (products, blog, portfolio)

**Result:** ✅ Fully migrated to shadcn/ui

---

## References

**Spec:** `.specpulse/specs/005-shadcn-ui-migration/spec-001.md`
**Plan:** `.specpulse/plans/005-shadcn-ui-migration/plan-001.md`
