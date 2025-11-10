# Specification: Product CRUD System

## Overview

**Feature:** Product CRUD System
**Created:** 2025-11-09
**Status:** Planned
**Priority:** High

---

## Purpose

Complete the product management system with full CRUD operations in the admin panel, including multi-language support and Stripe integration.

---

## Requirements

### Functional Requirements

- [x] Product list view (already exists)
- [ ] Create new product (with 3-language support)
- [ ] Edit existing product
- [ ] Delete product
- [ ] Multi-language form (TR, EN, PT-BR tabs)
- [ ] Stripe product sync
- [ ] Image upload for products
- [ ] Form validation
- [ ] Price management with currency support

### Non-Functional Requirements

- [ ] Performance: Form submission < 2s
- [ ] Security: Admin-only access
- [ ] Validation: Client-side + server-side
- [ ] UX: Loading states, error messages

---

## User Stories

### Story 1: Create Product

**As an** admin
**I want to** create a new product with multi-language content
**So that** I can sell it on the platform

**Acceptance Criteria:**
- [ ] Form has tabs for EN, TR, PT-BR
- [ ] Each language has: title, description fields
- [ ] Global fields: slug, type, price, currency, status
- [ ] Auto-slug generation from English title
- [ ] Form validation (required fields)
- [ ] Success redirect to product list
- [ ] Error handling with user-friendly messages

### Story 2: Edit Product

**As an** admin
**I want to** update existing product details
**So that** I can keep information current

**Acceptance Criteria:**
- [ ] Pre-populate form with existing data
- [ ] Maintain same validation as create
- [ ] Update translations separately
- [ ] Re-sync with Stripe if needed

### Story 3: Delete Product

**As an** admin
**I want to** remove products I no longer offer
**So that** customers don't see outdated items

**Acceptance Criteria:**
- [ ] Confirmation dialog before delete
- [ ] Soft delete (archive) vs hard delete
- [ ] Update Stripe product status

---

## Technical Details

### Data Models

```prisma
model Product {
  id              String   @id @default(cuid())
  slug            String   @unique
  type            String   // service, digital_product, consulting
  price           Decimal  @db.Decimal(10, 2)
  currency        String   @default("usd")
  status          String   @default("draft") // draft, published, archived
  stripeProductId String?
  stripePriceId   String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  translations ProductTranslation[]
  orderItems   OrderItem[]
}

model ProductTranslation {
  id          String  @id @default(cuid())
  productId   String
  locale      String  // en, tr, pt-BR
  title       String
  description String  @db.Text
  features    String? @db.Text // JSON array
  coverImage  String?

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

### API Endpoints

**Admin API:**
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/[id]` - Get single product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

### Components

**New Components:**
- `components/admin/ProductForm.tsx` - Multi-language product form
- `app/[locale]/admin/products/new/page.tsx` - Create page
- `app/[locale]/admin/products/[id]/page.tsx` - Edit page

---

## Dependencies

- TipTap or similar (for description rich text)
- react-hook-form (form management)
- zod (validation schema)
- Stripe API (product sync)

---

## Constraints

- Must maintain translation pattern (separate table)
- Stripe sync should be optional (manual trigger)
- Image upload can be URL-based initially (no file upload needed)

---

## Implementation Notes

- Reuse BlogForm pattern for multi-language tabs
- Use same form validation approach as blog
- Stripe sync button separate from save
- Consider feature list as JSON for now
