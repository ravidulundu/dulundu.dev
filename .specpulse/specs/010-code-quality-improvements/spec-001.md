# Spec: Code Quality Improvements (Context7 Audit)

**Feature ID:** `code-quality-improvements`
**Created:** 2025-11-11
**Status:** 🟠 Planned
**Priority:** 🔴 HIGH (Performance Critical)
**Source:** Context7 MCP Audit Report (2025-11-11)
**Overall Code Score:** 8/10 ⭐ (Excellent)

---

## 📋 Executive Summary

Context7 MCP audit revealed that the codebase is **production-ready** with **95% alignment** to official documentation. However, there are critical **performance optimizations** (missing database indexes) and recommended **code quality improvements** that should be implemented.

**Key Findings:**
- ✅ NextAuth v5: 8/10 (needs Zod validation)
- ✅ next-intl: 9/10 (minor optimizations)
- ⚠️ Prisma Schema: 7/10 (missing indexes - **HIGH PRIORITY**)

---

## 🎯 Goals

### Primary Goals
1. ⚡ **Improve Database Performance** - Add missing indexes for 10-100x query speed improvement
2. 🔒 **Data Integrity** - Add unique constraints to Stripe IDs to prevent duplicates
3. ✅ **Better Validation** - Implement Zod validation in NextAuth credentials
4. 🐛 **Improved Error Handling** - Create custom error classes for NextAuth

### Success Criteria
- [ ] All recommended indexes added to Prisma schema
- [ ] Stripe ID unique constraints implemented
- [ ] Migration generated and tested successfully
- [ ] Zod validation added to NextAuth authorize function
- [ ] Custom error classes created and implemented
- [ ] Build passes with zero errors
- [ ] Performance benchmarks show query speed improvements

---

## 📊 Current State Analysis

### What's Working Well ✅
- Modern stack (Next.js 14, NextAuth v5, next-intl, Prisma)
- Full TypeScript coverage
- Clean code organization
- Following official documentation closely
- All critical features working

### What Needs Improvement ⚠️

#### 1. Database Performance (HIGH Priority 🔴)
**Issue:** Missing performance indexes on frequently queried fields
**Impact:** Slow queries on production-scale data (10-100x slower than optimal)
**Affected Models:** Product, Order, Post, Project

#### 2. Data Integrity (HIGH Priority 🔴)
**Issue:** Stripe IDs are nullable but not unique
**Impact:** Risk of duplicate Stripe product/price records
**Affected Models:** Product, ProductPrice

#### 3. Validation (MEDIUM Priority 🟡)
**Issue:** Basic string checks instead of Zod validation
**Impact:** Less robust validation, weaker type safety
**Affected Files:** lib/auth.ts

#### 4. Error Handling (MEDIUM Priority 🟡)
**Issue:** Generic Error class instead of custom error types
**Impact:** Harder debugging, less specific error handling
**Affected Files:** lib/auth.ts

---

## 🏗️ Technical Design

### Phase 1: Prisma Performance Optimizations (HIGH 🔴)

#### 1.1 Add Performance Indexes

**File:** `prisma/schema.prisma`

**Changes Required:**

```prisma
model Product {
  // ... existing fields

  @@index([status])        // Filter by status
  @@index([featured])      // Fetch featured products
  @@index([createdAt])     // Sort by date
  @@map("products")
}

model Order {
  // ... existing fields

  @@index([customerEmail]) // Search orders by email
  @@index([status])        // Filter by status
  @@index([createdAt])     // Recent orders
  @@map("orders")
}

model Post {
  // ... existing fields

  @@index([status])        // Published posts
  @@index([featured])      // Featured blogs
  @@index([publishedAt])   // Sort by publish date
  @@map("posts")
}

model Project {
  // ... existing fields

  @@index([status])        // Published projects
  @@index([featured])      // Featured projects
  @@index([order])         // Sort order
  @@map("projects")
}
```

**Benefits:**
- 10-100x faster queries on filtered/sorted data
- Better database performance under load
- Improved user experience on listing pages
- Ready for production-scale data

#### 1.2 Add Stripe ID Unique Constraints

**File:** `prisma/schema.prisma`

**Changes Required:**

```prisma
model Product {
  // ... existing fields
  stripeProductId String? @unique
  stripePriceId   String? @unique
}

model ProductPrice {
  // ... existing fields
  stripePriceId String? @unique
}
```

**Benefits:**
- Prevents duplicate Stripe sync issues
- Ensures data integrity
- Easier debugging of Stripe webhooks
- Safer payment processing

#### 1.3 Migration Strategy

```bash
# Generate migration
npx prisma migrate dev --name add_performance_indexes_and_unique_constraints

# Review generated SQL
# Apply to development database
# Test queries before/after

# Production deployment
npx prisma migrate deploy
```

---

### Phase 2: NextAuth Enhancements (MEDIUM 🟡)

#### 2.1 Add Zod Validation

**File:** `lib/auth.ts`

**Current Code:**
```typescript
if (!credentials?.email || !credentials?.password) {
  throw new Error("Invalid credentials");
}
```

**Recommended Code:**
```typescript
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// In authorize function
const parsedCredentials = credentialsSchema.safeParse(credentials)

if (!parsedCredentials.success) {
  throw new InvalidCredentialsError("Invalid email or password format")
}

const { email, password } = parsedCredentials.data
```

**Benefits:**
- Type-safe credential validation
- Better error messages
- Consistent with modern Next.js patterns
- More robust input sanitization

#### 2.2 Custom Error Classes

**File:** `lib/auth.ts`

**Current Code:**
```typescript
throw new Error("Invalid credentials")
throw new Error("User not found")
```

**Recommended Code:**
```typescript
import { CredentialsSignin } from "@auth/core/errors"

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials"
  message = "Invalid email or password"
}

class UserNotFoundError extends CredentialsSignin {
  code = "user_not_found"
  message = "No user found with this email"
}

class IncorrectPasswordError extends CredentialsSignin {
  code = "incorrect_password"
  message = "Incorrect password"
}

// Usage
throw new InvalidCredentialsError()
throw new UserNotFoundError()
throw new IncorrectPasswordError()
```

**Benefits:**
- Better error categorization
- Easier to handle specific error types in UI
- Improved debugging with error codes
- Consistent error handling patterns

---

### Phase 3: next-intl Cleanup (LOW 🟢)

#### 3.1 Simplify Cookie Management

**File:** `i18n/routing.ts`

**Add localeCookie config:**
```typescript
export const routing = defineRouting({
  locales: ['en', 'tr', 'pt-BR'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  }
});
```

**File:** `middleware.ts`

**Remove manual cookie management** (let next-intl handle it)

**Benefits:**
- Less code to maintain
- Framework handles cookie lifecycle
- Consistent with next-intl best practices
- Fewer potential bugs

#### 3.2 Update Matcher Pattern (if using tRPC)

**File:** `middleware.ts`

**Current:**
```typescript
matcher: '/((?!api|_next|_vercel|.*\\..*)*)'
```

**If using tRPC:**
```typescript
matcher: '/((?!api|trpc|_next|_vercel|.*\\..*)*)'
```

---

## 📋 Implementation Tasks

### HIGH Priority Tasks (Must Do) 🔴

**Estimated Time:** 2.25 hours

1. **Add Prisma Indexes** (1 hour)
   - [ ] Add @@index to Product model (status, featured, createdAt)
   - [ ] Add @@index to Order model (customerEmail, status, createdAt)
   - [ ] Add @@index to Post model (status, featured, publishedAt)
   - [ ] Add @@index to Project model (status, featured, order)

2. **Add Stripe Unique Constraints** (30 minutes)
   - [ ] Add @unique to Product.stripeProductId
   - [ ] Add @unique to Product.stripePriceId
   - [ ] Add @unique to ProductPrice.stripePriceId

3. **Generate and Test Migration** (45 minutes)
   - [ ] Run `npx prisma migrate dev --name add_performance_indexes`
   - [ ] Review generated SQL
   - [ ] Test with existing data
   - [ ] Verify indexes are created
   - [ ] Run build to ensure no TypeScript errors

### MEDIUM Priority Tasks (Should Do) 🟡

**Estimated Time:** 2 hours

4. **Add Zod Validation** (1 hour)
   - [ ] Import Zod in lib/auth.ts
   - [ ] Create credentialsSchema
   - [ ] Replace basic validation with Zod safeParse
   - [ ] Update error messages
   - [ ] Test with valid and invalid credentials

5. **Create Custom Error Classes** (30 minutes)
   - [ ] Create InvalidCredentialsError class
   - [ ] Create UserNotFoundError class
   - [ ] Create IncorrectPasswordError class
   - [ ] Import CredentialsSignin from @auth/core/errors

6. **Update Error Handling** (30 minutes)
   - [ ] Replace generic Error throws with custom classes
   - [ ] Test error handling in signin flow
   - [ ] Verify error messages display correctly

### LOW Priority Tasks (Nice to Have) 🟢

**Estimated Time:** 45 minutes

7. **Move localeCookie to Config** (30 minutes)
   - [ ] Add localeCookie config to i18n/routing.ts
   - [ ] Remove manual cookie setting from middleware.ts
   - [ ] Test locale persistence
   - [ ] Verify cookie behavior unchanged

8. **Update Matcher Pattern** (15 minutes)
   - [ ] Check if project uses tRPC
   - [ ] Update matcher if needed
   - [ ] Test middleware still works

---

## 🧪 Testing Strategy

### Database Performance Testing
1. Seed database with production-like data (1000+ records)
2. Run queries WITHOUT indexes and measure time
3. Apply indexes
4. Run same queries WITH indexes and measure time
5. Document performance improvements

### Validation Testing
1. Test Zod validation with invalid email format
2. Test with short password (< 6 chars)
3. Test with valid credentials
4. Verify error messages are user-friendly

### Error Handling Testing
1. Test signin with non-existent user
2. Test signin with wrong password
3. Test signin with invalid credentials format
4. Verify error codes and messages are correct

### Integration Testing
1. Run full build after all changes
2. Test signin flow end-to-end
3. Test product listing performance
4. Test admin order filtering
5. Verify no regressions

---

## 📦 Dependencies

### Existing Dependencies (Already Installed)
- ✅ `zod` - Already in package.json
- ✅ `@prisma/client` - Already installed
- ✅ `prisma` - Already in devDependencies
- ✅ `next-auth` - Already installed

### New Dependencies Required
- None! All recommended improvements use existing dependencies

---

## ⚠️ Risks & Mitigation

### Risk 1: Migration Fails on Existing Data
**Likelihood:** Low
**Impact:** High
**Mitigation:**
- Test migration on development database first
- Backup production database before applying
- Review generated SQL manually
- Have rollback plan ready

### Risk 2: Unique Constraints Conflict with Existing Data
**Likelihood:** Low
**Impact:** Medium
**Mitigation:**
- Check for duplicate Stripe IDs before migration
- Clean up duplicates if found
- Add constraints in separate migration if needed

### Risk 3: Breaking Changes in Auth Flow
**Likelihood:** Very Low
**Impact:** High
**Mitigation:**
- Comprehensive testing of signin flow
- Test all error scenarios
- Keep backup of working code
- Deploy during low-traffic window

---

## 📊 Success Metrics

### Performance Metrics
- **Query Speed:** 10-100x improvement on filtered queries
- **Database Load:** Reduced CPU usage on frequent queries
- **Response Time:** Faster page loads for listing pages

### Code Quality Metrics
- **Type Safety:** 100% type coverage maintained
- **Error Handling:** Custom error classes for all auth errors
- **Validation:** Zod validation for all credential inputs
- **Build Status:** Zero TypeScript errors

### Production Readiness
- **Score Before:** 8/10 (Excellent)
- **Score After:** 9.5/10 (Outstanding)
- **Documentation Alignment:** 95% → 98%

---

## 🔗 Related Documentation

### Context7 MCP Sources
- NextAuth.js (`/nextauthjs/next-auth`) - Trust Score: 9.3
- next-intl (`/amannn/next-intl`) - Trust Score: 10
- Prisma (`/prisma/docs`) - Trust Score: 10

### Project Files
- **Audit Report:** `.specpulse/memory/notes/code-quality-audit-context7-2025-11-11.md`
- **Auth Implementation:** `lib/auth.ts`
- **Prisma Schema:** `prisma/schema.prisma`
- **Middleware:** `middleware.ts`
- **i18n Config:** `i18n/routing.ts`

---

## 🎯 Definition of Done

- [ ] All HIGH priority tasks completed (indexes + unique constraints)
- [ ] Migration generated and applied successfully
- [ ] MEDIUM priority tasks completed (Zod + custom errors)
- [ ] All tests passing (signin flow, validation, errors)
- [ ] Build successful with zero TypeScript errors
- [ ] Performance benchmarks documented
- [ ] Code reviewed and approved
- [ ] Changes committed with descriptive message
- [ ] SpecPulse INDEX updated with completion status

---

## 📝 Notes

### Why This Matters
- **Performance:** Missing indexes can cause 10-100x slowdowns on production data
- **Data Integrity:** Unique constraints prevent hard-to-debug Stripe sync issues
- **Code Quality:** Zod validation and custom errors are Next.js 14 best practices
- **Maintainability:** Better error handling makes debugging easier

### Long-term Benefits
- Scales to production traffic
- Easier to debug payment issues
- More maintainable auth code
- Better developer experience
- Aligns with official documentation

---

**Last Updated:** 2025-11-11
**Audit Score:** 8/10 → 9.5/10 (Expected)
**Priority:** 🔴 HIGH (Performance Critical)
**Estimated Total Time:** 5 hours (2.25h HIGH + 2h MEDIUM + 45m LOW)
