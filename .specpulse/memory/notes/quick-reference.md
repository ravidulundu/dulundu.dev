# Quick Reference Guide

> 🚀 Fast access to key information for development

---

## 📊 Current Project Status

| Category | Status | Progress |
|----------|--------|----------|
| Infrastructure | ✅ Complete | 100% |
| Authentication | ✅ Complete | 100% |
| Blog System | ✅ Complete | 100% |
| Product CRUD | ✅ Complete | 100% |
| Checkout Flow | ⏳ Pending | 0% (2h, 6 tasks) |
| Portfolio | ⏳ Pending | 0% (4-5h, 12 tasks) |
| **Overall** | **🟡 In Progress** | **~80%** |

---

## 🎯 Next Priority

**Checkout Flow** (2 hours, 6 tasks)
```bash
# View tasks
cat .specpulse/tasks/checkout-flow.md

# Backend already done!
# Just need frontend pages:
# - Product detail page
# - Buy button component
# - Success page
# - Cancel page
```

---

## 📁 Project Structure

```
dulundu.dev/
├── app/
│   ├── [locale]/              # Multi-language routes
│   │   ├── admin/             # Admin panel
│   │   │   ├── dashboard/
│   │   │   ├── blog/
│   │   │   ├── products/
│   │   │   └── portfolio/     # TODO
│   │   ├── blog/              # Public blog
│   │   ├── products/          # TODO (detail page)
│   │   └── checkout/          # TODO
│   └── api/
│       ├── auth/              # NextAuth
│       ├── admin/             # Protected APIs
│       ├── blog/              # Public APIs
│       ├── checkout/          # Stripe checkout
│       └── webhooks/          # Stripe webhooks
│
├── components/
│   ├── ui/                    # Reusable UI
│   ├── admin/                 # Admin components
│   ├── blog/                  # Blog components
│   └── checkout/              # TODO
│
├── lib/
│   ├── auth.ts                # Auth helpers
│   ├── db.ts                  # Prisma client
│   └── stripe.ts              # Stripe client
│
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
│
├── messages/                  # i18n translations
│   ├── en.json
│   ├── tr.json
│   └── pt-BR.json
│
└── .specpulse/                # SpecPulse docs
    ├── INDEX.md               # Master index
    ├── specs/                 # Requirements
    ├── plans/                 # Plans
    ├── tasks/                 # Task breakdowns
    ├── checkpoints/           # Milestones
    └── memory/                # Context & notes
```

---

## 🔑 Key Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `.specpulse/INDEX.md` | Master tracking | Start of session |
| `PROGRESS.md` | Project progress | Check status |
| `SESSION-RESUME.md` | Resume guide | After break |
| `.specpulse/tasks/*.md` | Task details | During implementation |
| `.specpulse/checkpoints/*.md` | Milestones | Review achievements |
| `lib/auth.ts` | Auth helpers | Protected routes |
| `lib/db.ts` | Database | Any DB query |
| `lib/stripe.ts` | Stripe | Payments |

---

## 🔐 Auth Helpers

```typescript
import { requireAuth, requireAdmin, isAdmin } from '@/lib/auth';

// In API routes
export async function GET(req: NextRequest) {
  await requireAdmin(); // Throws if not admin
  // ... protected code
}

// In pages/components
const session = await requireAuth(); // Throws if not logged in
const admin = await isAdmin(); // Returns boolean
```

---

## 🗄️ Database Queries

```typescript
import db from '@/lib/db';

// List with translations
const posts = await db.post.findMany({
  include: { translations: true },
  orderBy: { createdAt: 'desc' },
});

// Single with locale
const post = await db.post.findFirst({
  where: {
    slug,
    translations: { some: { locale } },
  },
  include: {
    translations: {
      where: { locale },
    },
  },
});

// Create with translations
const post = await db.post.create({
  data: {
    slug, status,
    translations: {
      create: translations.map(t => ({
        locale: t.locale,
        title: t.title,
        content: t.content,
      })),
    },
  },
  include: { translations: true },
});

// Update (delete old translations, create new)
await db.postTranslation.deleteMany({ where: { postId: id } });
const updated = await db.post.update({
  where: { id },
  data: {
    slug, status,
    translations: { create: [...] },
  },
  include: { translations: true },
});

// Delete
await db.post.delete({ where: { id } });
```

---

## 💳 Stripe Integration

```typescript
import { stripe } from '@/lib/stripe';

// Create checkout session
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name, description, images },
      unit_amount: price * 100, // cents
    },
    quantity: 1,
  }],
  success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
});

// Webhook handling (already done)
// POST /api/webhooks/stripe
```

---

## 🌍 Multi-Language Pattern

```typescript
// In forms
const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
];

const [activeTab, setActiveTab] = useState('en');
const [translations, setTranslations] = useState<Record<string, Translation>>({
  en: { locale: 'en', title: '', description: '' },
  tr: { locale: 'tr', title: '', description: '' },
  'pt-BR': { locale: 'pt-BR', title: '', description: '' },
});

// Auto-slug from English
useEffect(() => {
  if (translations.en.title && !slug) {
    setSlug(translations.en.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  }
}, [translations.en.title]);
```

---

## 🎨 UI Components

```typescript
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';

// Button variants
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Link</Button>

// Input
<Input
  label="Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  required
  placeholder="Enter title"
/>

// Select
<Select
  label="Status"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  options={[
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
  ]}
/>
```

---

## 📦 Common npm Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run start            # Start production server

# Database
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations
npx prisma db seed       # Seed database
npx prisma studio        # Open Prisma Studio (DB GUI)

# Linting
npm run lint             # Run ESLint

# Dependencies
npm install <package>    # Add package
npm update               # Update packages
```

---

## 🔍 SpecPulse Commands

```bash
# Health check
specpulse doctor

# List features
specpulse list-specs

# View progress
cat .specpulse/INDEX.md
cat .specpulse/tasks/<feature>.md

# Create new feature (future)
specpulse sp-pulse "<feature-name>"
```

---

## ⚠️ Common Errors & Fixes

### Build Error: DATABASE_URL
```
Error: Environment variable DATABASE_URL not found
```
**Fix**: Set in `.env.local` (dev mode works without it)

### Type Error: Property doesn't exist
```
Property 'X' does not exist on type 'Y'
```
**Fix**: Check Prisma schema, regenerate client (`npx prisma generate`)

### Prisma Error: Relation not found
```
Unknown relation 'translations'
```
**Fix**: Add `include: { translations: true }` to query

### Next.js Error: Dynamic route
```
Page "/[locale]/..." cannot be statically generated
```
**Fix**: Add `export const dynamic = 'force-dynamic'`

---

## 🚀 Deployment Checklist

### Environment Variables
- [ ] DATABASE_URL (production)
- [ ] NEXTAUTH_SECRET (generate new)
- [ ] NEXTAUTH_URL (production URL)
- [ ] STRIPE_SECRET_KEY (production key)
- [ ] STRIPE_WEBHOOK_SECRET (production webhook)

### Database
- [ ] Run migrations
- [ ] Seed admin user
- [ ] Test connections

### Stripe
- [ ] Create production webhook endpoint
- [ ] Update webhook secret
- [ ] Test payments

### Security
- [ ] Change admin password
- [ ] Enable rate limiting
- [ ] Set up CORS properly
- [ ] Review API route protection

---

## 📞 Emergency Recovery

If stuck, check these in order:

1. **`.specpulse/INDEX.md`** - Where are we?
2. **`PROGRESS.md`** - What's done?
3. **`SESSION-RESUME.md`** - How to continue?
4. **`.specpulse/checkpoints/`** - Last known good state
5. **`.specpulse/memory/notes/`** - Session notes

---

**Last Updated**: 2025-11-09 (Session 2)
**Maintained by**: SpecPulse + Claude Code
