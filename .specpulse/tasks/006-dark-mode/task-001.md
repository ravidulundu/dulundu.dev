# Task Breakdown: Dark Mode

**Feature:** 006-dark-mode
**Created:** 2025-11-12 (Retroactive)
**Status:** ✅ COMPLETE
**Estimated Time:** 2 hours

---

## Task 1: Install next-themes (10 min)

**Command:**
```bash
npm install next-themes
```

**Status:** ✅ COMPLETE

---

## Task 2: Theme Provider Component (20 min)

**File:** `components/theme-provider.tsx`

**Implementation:**
```typescript
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**Status:** ✅ COMPLETE

---

## Task 3: Layout Integration (15 min)

**File:** `app/[locale]/layout.tsx`

**Implementation:**
```typescript
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Status:** ✅ COMPLETE

---

## Task 4: Theme Toggle Component (30 min)

**File:** `components/theme-toggle.tsx`

**Implementation:**
```typescript
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

**Status:** ✅ COMPLETE

---

## Task 5: Dark Mode CSS Variables (20 min)

**File:** `app/globals.css`

**Implementation:**
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    /* ... more variables */
  }
}
```

**Status:** ✅ COMPLETE

---

## Task 6: Tailwind Dark Mode Config (10 min)

**File:** `tailwind.config.js`

**Implementation:**
```javascript
module.exports = {
  darkMode: ["class"],
  // ... rest of config
}
```

**Status:** ✅ COMPLETE

---

## Task 7: Navbar Integration (15 min)

**File:** `components/layout/Navbar.tsx`

**Changes:**
```typescript
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  return (
    <nav>
      {/* ... existing nav content */}
      <div className="flex items-center gap-4">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
    </nav>
  )
}
```

**Status:** ✅ COMPLETE

---

## Task 8: Testing (20 min)

**Test Cases:**
- ✅ Toggle button appears in navbar
- ✅ Click toggles light ↔ dark
- ✅ System preference detected on first load
- ✅ Theme persists after page refresh
- ✅ No flash of wrong theme (suppressHydrationWarning)
- ✅ All pages render correctly in dark mode
- ✅ Clay shadows visible in dark mode

**Status:** ✅ COMPLETE

---

## Summary

**Files Created:** 2
- theme-provider.tsx
- theme-toggle.tsx

**Files Modified:** 4
- layout.tsx
- globals.css
- tailwind.config.js
- Navbar.tsx

**Result:** ✅ Dark mode fully functional

---

## References

**Spec:** `.specpulse/specs/006-dark-mode/spec-001.md`
**Plan:** `.specpulse/plans/006-dark-mode/plan-001.md`
