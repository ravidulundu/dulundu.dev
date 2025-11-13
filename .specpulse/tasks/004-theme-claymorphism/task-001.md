# Task Breakdown: Claymorphism Theme

**Feature:** 004-theme-claymorphism
**Created:** 2025-11-12 (Retroactive)
**Status:** ✅ COMPLETE
**Estimated Time:** 3 hours

---

## Task 1: Tailwind Config (30 min)

**File:** `tailwind.config.js`

**Implementation:**
```javascript
theme: {
  extend: {
    boxShadow: {
      'clay-sm': '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.5)',
      'clay-md': '10px 10px 20px rgba(0,0,0,0.1), -10px -10px 20px rgba(255,255,255,0.5)',
      'clay-lg': '15px 15px 30px rgba(0,0,0,0.1), -15px -15px 30px rgba(255,255,255,0.5)',
    },
    borderRadius: {
      'clay': '20px',
      'clay-lg': '30px',
    },
    backgroundImage: {
      'clay-gradient': 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }
  }
}
```

**Status:** ✅ COMPLETE

---

## Task 2: Global Styles (30 min)

**File:** `app/globals.css`

**Implementation:**
```css
@layer components {
  .clay-surface {
    @apply bg-gradient-to-br from-gray-50 to-gray-100 shadow-clay-md rounded-clay;
  }

  .clay-button {
    @apply shadow-clay-sm hover:shadow-clay-md transition-shadow duration-300;
  }

  .clay-card {
    @apply shadow-clay-md hover:shadow-clay-lg transition-shadow duration-300;
  }
}
```

**Status:** ✅ COMPLETE

---

## Task 3: Navbar Update (20 min)

**File:** `components/layout/Navbar.tsx`

**Changes:**
```typescript
<nav className="shadow-clay-md bg-gradient-to-r from-gray-50 to-gray-100 rounded-clay">
  {/* ... */}
</nav>
```

**Status:** ✅ COMPLETE

---

## Task 4: Footer Update (20 min)

**File:** `components/layout/Footer.tsx`

**Changes:**
```typescript
<footer className="shadow-clay-md bg-gradient-to-r from-gray-50 to-gray-100">
  {/* ... */}
</footer>
```

**Status:** ✅ COMPLETE

---

## Task 5: Button Component (20 min)

**File:** `components/ui/button.tsx`

**Added Variant:**
```typescript
variants: {
  variant: {
    // ... existing variants
    clay: "clay-button bg-white text-gray-900 hover:bg-gray-50",
  }
}
```

**Status:** ✅ COMPLETE

---

## Task 6: Card Component (20 min)

**File:** `components/ui/card.tsx`

**Changes:**
```typescript
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("clay-card bg-white text-card-foreground", className)}
      {...props}
    />
  )
)
```

**Status:** ✅ COMPLETE

---

## Task 7: Homepage Update (30 min)

**File:** `app/[locale]/page.tsx`

**Changes:**
- Applied clay styles to hero section
- Updated CTA buttons with clay variant
- Enhanced feature cards with clay effects

**Status:** ✅ COMPLETE

---

## Task 8: Testing (30 min)

**Test Cases:**
- ✅ All pages render with clay theme
- ✅ Shadows appear correctly (light/dark)
- ✅ Hover effects working smoothly
- ✅ Responsive design maintained
- ✅ Dark mode compatibility

**Status:** ✅ COMPLETE

---

## Summary

**Files Modified:** 7
- tailwind.config.js
- app/globals.css
- Navbar.tsx
- Footer.tsx
- button.tsx
- card.tsx
- page.tsx

**Result:** ✅ Claymorphism theme applied site-wide

---

## References

**Spec:** `.specpulse/specs/004-theme-claymorphism/spec-001.md`
**Plan:** `.specpulse/plans/004-theme-claymorphism/plan-001.md`
