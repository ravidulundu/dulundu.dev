# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## ⚠️ CRITICAL - READ FIRST BEFORE ANY NEW FEATURE

**ALWAYS USE SPECPULSE CLI FOR NEW FEATURES - NO EXCEPTIONS**

User explicitly stated: "bir suru para kaybettiyorsun bana" (you're costing me a lot of money)

### Correct Commands (AI-powered):
```bash
specpulse sp-pulse "Feature Name"     # Initialize feature (AI command)
specpulse sp-spec "Description"       # Create specification (AI command)
specpulse sp-plan                     # Create implementation plan (AI command)
specpulse sp-task                     # Break down into tasks (AI command)
```

### ❌ NEVER:
- Manual directory creation in `.specpulse/`
- Manual file creation with Write tool
- Editing feature counter manually
- Updating context.md manually

**Violation Cost**: Extra tokens, frustrated user, wasted money

Last violation: Feature 016 (2025-11-13)

---

## Project Overview

**dulundu.dev** is a professional multi-language portfolio and service selling platform built with Next.js 14 App Router. It supports Turkish (tr), English (en), and Portuguese-BR (pt-BR) with automatic IP-based locale detection and currency management.

**Core Tech Stack:**
- Next.js 14.2.0 (App Router with `[locale]` routing)
- TypeScript 5.4.0
- PostgreSQL + Prisma 6.19.0
- NextAuth.js v5.0.0-beta.30 (JWT sessions)
- Stripe 19.3.0 (payments)
- next-intl 4.5.0 (i18n)
- Tailwind CSS 3.4.18 with Claymorphism theme
- Playwright 1.56.1 (browser automation testing)

## Development Commands

### Core Commands
```bash
npm run dev              # Start dev server (default: localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database Commands
```bash
npm run db:generate      # Generate Prisma Client (required after schema changes)
npm run db:push          # Push schema to database (no migration files)
npm run db:studio        # Open Prisma Studio GUI (database browser)
npm run db:seed          # Seed database with admin user + sample data
```

**Important:** Always run `db:generate` after modifying `prisma/schema.prisma`, then `db:push` to sync changes.

### Seed Data
The seed script (`prisma/seed.ts`) creates:
- Admin user: `admin@dulundu.dev` / `admin123`
- 2 sample products (WordPress Optimization, Technical Consulting)
- 2 sample blog posts
- 2 sample portfolio projects
- Multi-currency prices (USD/TRY/BRL) for all products

## Architecture

### Multi-Language Routing

**Pattern:** All public pages live under `app/[locale]/...`

```
app/
├── [locale]/                    # Locale parameter (en|tr|pt-BR)
│   ├── page.tsx                # Homepage
│   ├── services/page.tsx       # Services page
│   ├── products/               # Product list + detail
│   ├── blog/                   # Blog list + detail
│   ├── portfolio/              # Portfolio list + detail
│   ├── contact/page.tsx        # Contact form
│   ├── checkout/               # Checkout flow (success/cancel)
│   ├── auth/                   # Auth pages (signin, error)
│   ├── privacy/page.tsx        # Privacy policy
│   ├── terms/page.tsx          # Terms of service
│   └── admin/                  # Admin panel (separate layout)
└── api/                        # API routes (NO locale prefix)
    ├── auth/[...nextauth]/     # NextAuth handler
    ├── admin/                  # Admin APIs (products, blog, portfolio)
    ├── checkout/               # Stripe checkout session
    └── webhooks/stripe/        # Stripe webhook handler
```

**Key Files:**
- `i18n/request.ts` - i18n config (supported locales: `['en', 'tr', 'pt-BR']`)
- `middleware.ts` - IP-based locale detection + currency cookie management
- `messages/*.json` - Translation files (en.json, tr.json, pt-BR.json)

### i18n System

**Locale Detection Priority:**
1. IP geolocation (via `request.geo?.country` or `x-vercel-ip-country` header)
2. Browser language preferences
3. Manual user selection via language switcher
4. Default: `en`

**Currency Mapping:**
- TR → TRY (Turkish Lira)
- BR/PT → BRL (Brazilian Real)
- US/GB/CA/AU → USD (US Dollar)
- Default: USD

**Creating Localized Pages:**
```typescript
// All pages receive locale param from route
export default function Page({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('namespace'); // Hook for translations

  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href={`/${locale}/path`}>{t('link')}</Link>
    </div>
  );
}
```

**Important:** All internal links MUST include locale prefix: `/${locale}/path`

### Database Models (Prisma)

**Translation Pattern:** Content models (Product, Post, Project) use separate translation tables with `locale` field.

**Core Models:**
- `User` - Authentication (role: admin/user)
- `Product` - Base product data (slug, type, status, prices)
- `ProductTranslation` - Localized content (title, description, features)
- `ProductPrice` - Multi-currency pricing (USD/TRY/BRL)
- `Post` - Blog posts
- `PostTranslation` - Localized blog content
- `Project` - Portfolio projects
- `ProjectTranslation` - Localized project content
- `Order` - Purchase records
- `OrderItem` - Line items

**Key Patterns:**
```typescript
// Fetch product with translations
const product = await db.product.findUnique({
  where: { slug },
  include: {
    translations: true,  // All locales
    prices: true         // All currencies
  }
});

// Get specific locale translation
const translation = product.translations.find(t => t.locale === locale);
```

### Authentication (NextAuth v5)

**Configuration:** `lib/auth.ts`

**Strategy:** JWT sessions with credentials provider (bcrypt password hashing)

**Session Data:**
```typescript
{
  user: {
    id: string,
    email: string,
    name: string,
    role: string  // "admin" | "user"
  }
}
```

**Protecting Admin Routes:**
```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/auth/signin');
  }
  // Admin content
}
```

**Admin Check Helper:** `lib/auth-helpers.ts` provides `requireAdmin()` utility

### Layout System

**Public Pages:** Use `PageWrapper` component for consistent navigation
```typescript
import PageWrapper from '@/components/layout/PageWrapper';

export default function Page() {
  return (
    <PageWrapper>
      {/* Page content */}
    </PageWrapper>
  );
}
```

**Admin Pages:** Use separate `AdminLayout` (no PageWrapper)
- Located at: `app/[locale]/admin/layout.tsx`
- Includes: AdminSidebar + AdminHeader (with theme toggle)
- All admin routes have locale-aware navigation

**Critical:** NEVER use PageWrapper inside admin routes (causes double nav/footer)

### Stripe Integration

**Multi-Currency Support:**
- Products have `ProductPrice` records for USD/TRY/BRL
- Checkout API (`app/api/checkout/route.ts`) selects price based on user's currency preference
- Currency preference stored in `NEXT_LOCALE_CURRENCY` cookie

**Creating Checkout Session:**
```typescript
// Currency comes from cookie or locale
const currency = getCurrencyFromRequest();
const price = await db.productPrice.findUnique({
  where: { productId_currency: { productId, currency } }
});

const session = await stripe.checkout.sessions.create({
  line_items: [{ price: price.stripePriceId, quantity: 1 }],
  mode: 'payment',
  success_url: `${origin}/${locale}/checkout/success`,
  cancel_url: `${origin}/${locale}/checkout/cancel`,
});
```

**Webhook Handler:** `app/api/webhooks/stripe/route.ts`
- Verifies signature
- Handles events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`
- Updates order status in database

**Stripe CLI Testing:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

### Theme System

**Claymorphism Theme:** Imported via shadcn/ui from tweakcn.com

**Configuration:**
- `tailwind.config.js` - Theme tokens
- `app/globals.css` - CSS custom properties
- `components/providers/ThemeProvider.tsx` - next-themes provider

**Fonts:**
- Sans: Plus Jakarta Sans (primary)
- Serif: Lora (headings)
- Mono: Roboto Mono (code)

**Dark Mode:**
- Toggle: `components/layout/ThemeToggle.tsx`
- Location: Navbar (desktop/mobile) + AdminHeader
- Persistence: localStorage

### Component Libraries

**shadcn/ui Components Installed:**
alert, avatar, badge, button, card, checkbox, command, dialog, dropdown-menu, form, input, label, popover, scroll-area, select, separator, skeleton, switch, table, tabs, textarea, toast, toaster, use-toast

**Important:** Use shadcn/ui components for consistency. Avoid creating custom UI primitives.

**Example:**
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
```

### SpecPulse Workflow

**This project uses SpecPulse CLI for feature development.**

**Location:** `.specpulse/` directory

**Structure:**
```
.specpulse/
├── specs/       # Feature specifications (001-feature-name/)
├── plans/       # Implementation plans (001-feature-name/)
├── tasks/       # Task breakdowns (001-feature-name/)
└── memory/      # Project notes and audit reports
```

**Commands:**
```bash
specpulse feature init <name>    # Initialize new feature
specpulse list-specs             # List all specifications
specpulse doctor                 # Check project health
```

**Workflow:**
1. Create spec: `.specpulse/specs/###-feature-name/spec-001.md`
2. Create plan: `.specpulse/plans/###-feature-name/plan-001.md`
3. Create tasks: `.specpulse/tasks/###-feature-name/task-001.md`
4. Execute implementation
5. Update `.specpulse/INDEX.md` with completion status

**Important:** Always check `.specpulse/INDEX.md` for current project status and pending tasks.

## Critical Patterns

### Middleware Performance

**Current Issue:** Middleware runs on ALL routes (including static assets)

**Matcher Config:** Located in `middleware.ts`
```typescript
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
```

**Optimization Note:** Consider more restrictive patterns to reduce middleware overhead (50-70% improvement possible).

### Database Query Performance

**Known Issue:** Missing database indexes on frequently queried columns

**Critical Missing Indexes:**
- `Product`: status, featured, createdAt
- `Order`: customerEmail, status, createdAt
- `Post`: status, featured, publishedAt
- `Project`: status, featured, order

**Expected Impact:** Adding indexes provides 10-100x query performance improvement

**Implementation:** Add to `schema.prisma`:
```prisma
model Product {
  // ... fields
  @@index([status])
  @@index([featured])
  @@index([createdAt])
}
```

### Security Considerations

**Stripe Webhooks:**
- Always verify signature: `stripe.webhooks.constructEvent()`
- Current tolerance: 300s (consider reducing to 60s)
- No idempotency checks (potential duplicate processing)

**Content Security Policy:**
- Currently NO CSP headers (XSS vulnerability)
- Should add via `next.config.js` headers

**Admin Routes:**
- Always use `requireAdmin()` helper
- Never trust client-side role checks

### API Error Handling

**Current Pattern:** Basic try-catch with generic errors

**Improvement Needed:** Custom error classes for better debugging
```typescript
class InvalidCredentials extends Error { /* ... */ }
class UserNotFound extends Error { /* ... */ }
```

## Testing with Playwright MCP

**Browser Automation:** Playwright MCP tools available for testing

**Common Testing Patterns:**
```typescript
// Navigate and take snapshot
await browser_navigate({ url: 'http://localhost:3000/en' });
await browser_snapshot(); // Accessibility snapshot

// Test locale switching
await browser_click({ element: 'Language switcher', ref: '[uid]' });
await browser_snapshot();

// Test currency display
await browser_navigate({ url: 'http://localhost:3000/tr/products' });
// Verify TRY prices displayed
```

**Test Reports:** Located in `.specpulse/memory/notes/`

## Common Pitfalls

1. **Forgetting locale prefix in links** → Use `/${locale}/path` always
2. **Using PageWrapper in admin routes** → Causes double navigation
3. **Not generating Prisma client** → Run `npm run db:generate` after schema changes
4. **Hardcoded currency/locale** → Always get from context/cookies
5. **Missing translations** → Check all three `messages/*.json` files
6. **Skipping db:seed after reset** → Admin user won't exist

## Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Session encryption key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret

**Optional:**
- `IP_GEOLOCATION_API_KEY` - For enhanced locale detection
- `ADMIN_EMAIL` - Default admin email

**Example:** See `.env.example`

## Production Deployment

**Vercel (Recommended):**
1. Connect GitHub repository
2. Add environment variables in dashboard
3. Connect PostgreSQL database (Vercel Postgres or external)
4. Deploy automatically on push

**Database Migration:**
```bash
# Production
npx prisma migrate deploy  # Use migrations (safer)

# OR for prototyping
npx prisma db push         # Direct schema push (no migration files)
```

**Post-Deployment:**
1. Run seed script to create admin user
2. Configure Stripe webhook endpoint in dashboard
3. Test checkout flow with test mode
4. Verify all three locales (en/tr/pt-BR)

## Known Technical Debt

**From Tech Stack Audit (85/100 score):**

1. **NextAuth v5.0.0-beta.30** - Beta in production (consider migrating to stable when released)
2. **bcryptjs 3.0.3** - Unmaintained since 2020 (consider @node-rs/bcrypt)
3. **PostCSS 8.5.6** - Outdated from 2022 (update to 8.4.49+)
4. **Missing database indexes** - Query performance optimization needed
5. **Middleware performance** - Runs on all routes (optimize matcher)
6. **No CSP headers** - XSS vulnerability (add security headers)
7. **Webhook security** - Tolerance too lenient (reduce to 60s)

**Full audit report:** `.specpulse/memory/notes/full-stack-tech-audit-2025-11-11.md`

## SpecPulse Workflow (CRITICAL - UPDATED 2025-11-13)

**This project uses SpecPulse CLI for ALL feature development. NEVER use manual methods.**

### ✅ CORRECT Workflow (AI-Powered Commands):

```bash
# 1. Initialize feature (AI command - ALWAYS USE THIS!)
specpulse sp-pulse "Feature Name Here"
# Creates: specs/###-feature-name/, plans/###-feature-name/, tasks/###-feature-name/
# Auto-increments feature counter
# Updates context automatically

# 2. Create specification (AI command)
specpulse sp-spec "Feature description"
# AI generates: specs/###-feature-name/spec-001.md
# You can edit/refine afterwards

# 3. Create implementation plan (AI command)
specpulse sp-plan
# AI generates: plans/###-feature-name/plan-001.md
# You can edit/refine afterwards

# 4. Break down into tasks (AI command)
specpulse sp-task
# AI generates: tasks/###-feature-name/task-001.md
# You can edit/refine afterwards
```

### ❌ NEVER DO (USER EXPLICITLY FORBIDS - COSTS MONEY):
- ❌ `echo "016" > .specpulse/feature_counter.txt` - Manual counter editing
- ❌ `mkdir -p .specpulse/specs/016-...` - Manual directory creation
- ❌ Using Write tool to create spec/plan/task files manually
- ❌ Editing `.specpulse/memory/context.md` manually
- ❌ Creating `.specpulse/INDEX.md` (doesn't exist!)
- ❌ Any manual file operations in `.specpulse/`

### ✅ YOU CAN:
- ✅ Edit AI-generated content after CLI creates it
- ✅ Add notes: `memory/notes/*.md`
- ✅ Use `specpulse feature continue <id>` for existing features
- ✅ Use `specpulse doctor` and `specpulse list-specs`

### 🔍 Available Commands:
```bash
specpulse --help              # Show all commands
specpulse feature list        # List all features
specpulse doctor             # Health check
specpulse feature continue    # Continue existing feature
```

**Critical Reminder:** User stated this violation wastes money. Always use `specpulse sp-pulse` first!

---

## Contact

- Website: https://dulundu.dev
- Admin: admin@dulundu.dev
- Default Password: admin123 (⚠️ change in production!)
