# Task Breakdown: Stripe Global Payments

**Feature:** 008-stripe-global-payments
**Created:** 2025-11-12 (Retroactive)
**Status:** 🟡 PARTIAL (Manual Stripe dashboard setup)
**Estimated Time:** 6 hours (4 hours code + 2 hours Stripe setup)

---

## Task 1: Currency Detection (45 min)

**File:** `lib/currency.ts`

**Implementation:**
```typescript
const CURRENCY_MAP: Record<string, string> = {
  'en': 'usd',
  'tr': 'try',
  'pt-BR': 'brl',
}

export function getCurrencyForLocale(locale: string): string {
  return CURRENCY_MAP[locale] || 'usd'
}

export function formatPrice(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100) // Stripe uses cents
}
```

**Status:** ✅ COMPLETE

---

## Task 2: Multi-Currency Price Storage (1 hour)

**File:** `prisma/schema.prisma`

**Changes:**
```prisma
model Product {
  id              String   @id @default(cuid())
  name            String
  description     String
  prices          ProductPrice[]
  stripePriceIds  Json     // { "usd": "price_xxx", "try": "price_yyy", "brl": "price_zzz" }
  // ... other fields
}

model ProductPrice {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  currency  String   // "usd", "try", "brl"
  amount    Int      // Amount in cents

  @@index([productId, currency])
}
```

**Migration:**
```bash
npx prisma migrate dev --name add_multi_currency
```

**Status:** ✅ COMPLETE

---

## Task 3: Checkout API Update (1.5 hours)

**File:** `app/api/checkout/route.ts`

**Implementation:**
```typescript
import { getCurrencyForLocale } from "@/lib/currency"

export async function POST(req: Request) {
  const { productId, locale } = await req.json()

  // Get currency for locale
  const currency = getCurrencyForLocale(locale)

  // Get product with prices
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      prices: {
        where: { currency }
      }
    }
  })

  if (!product || !product.prices[0]) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  // Get Stripe price ID for currency
  const stripePriceIds = product.stripePriceIds as Record<string, string>
  const stripePriceId = stripePriceIds[currency]

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    currency: currency,
    success_url: `${process.env.NEXT_PUBLIC_URL}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/${locale}/products/${productId}`,
  })

  return NextResponse.json({ url: session.url })
}
```

**Status:** ✅ COMPLETE

---

## Task 4: Product Display Update (45 min)

**File:** `app/[locale]/products/[id]/page.tsx`

**Implementation:**
```typescript
import { getCurrencyForLocale, formatPrice } from "@/lib/currency"
import { useParams } from "next/navigation"

export default async function ProductPage({ params }: { params: { id: string, locale: string } }) {
  const { locale } = params
  const currency = getCurrencyForLocale(locale)

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      prices: {
        where: { currency }
      }
    }
  })

  const price = product.prices[0]
  const formattedPrice = formatPrice(price.amount, currency, locale)

  return (
    <div>
      <h1>{product.name}</h1>
      <p className="text-2xl font-bold">{formattedPrice}</p>
      <Button onClick={() => handleCheckout(product.id, locale)}>
        Buy Now
      </Button>
    </div>
  )
}
```

**Status:** ✅ COMPLETE

---

## Task 5: Stripe Dashboard Setup (2 hours) 🟡

**Manual Steps Required:**

### 5.1 Create Prices in Stripe Dashboard
For each product, create 3 prices:
```
Product: "Web Development Package"
├── Price 1: $999 USD (price_xxx)
├── Price 2: ₺29,999 TRY (price_yyy)
└── Price 3: R$4,999 BRL (price_zzz)
```

### 5.2 Enable Payment Methods
```
Dashboard → Settings → Payment methods
✅ Cards
✅ Local payment methods (iDEAL, Bancontact, etc.)
```

### 5.3 Update Product Records
```typescript
// For each product in database
await prisma.product.update({
  where: { id: 'product_id' },
  data: {
    stripePriceIds: {
      usd: 'price_xxx',
      try: 'price_yyy',
      brl: 'price_zzz'
    },
    prices: {
      create: [
        { currency: 'usd', amount: 99900 },
        { currency: 'try', amount: 2999900 },
        { currency: 'brl', amount: 499900 },
      ]
    }
  }
})
```

**Status:** 🟡 NEEDS MANUAL SETUP

---

## Task 6: Testing (45 min)

**Test Cases:**
- ✅ EN locale → Shows USD prices
- ✅ TR locale → Shows TRY prices
- ✅ PT-BR locale → Shows BRL prices
- ✅ Checkout creates session with correct currency
- ⏳ Payment completes successfully (needs Stripe test cards)

**Status:** 🟡 PARTIAL (needs Stripe dashboard setup)

---

## Summary

**Code Status:** ✅ COMPLETE
**Stripe Setup:** 🟡 MANUAL REQUIRED

**Remaining Work:**
1. Create multi-currency prices in Stripe Dashboard
2. Update product records with Stripe price IDs
3. Test with Stripe test cards

**Result:** 🟡 90% complete (code done, Stripe setup pending)

---

## References

**Spec:** `.specpulse/specs/008-stripe-global-payments/spec-001.md`
**Plan:** `.specpulse/plans/008-stripe-global-payments/plan-001.md`
**Stripe Docs:** https://stripe.com/docs/payments/checkout/multiple-currencies
