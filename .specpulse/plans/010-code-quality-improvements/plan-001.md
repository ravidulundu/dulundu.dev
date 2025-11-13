# Plan: Code Quality Improvements

**Feature:** Code Quality Improvements (Context7 Audit)
**Created:** 2025-11-11
**Status:** 🟠 Ready to Execute
**Priority:** 🔴 HIGH

---

## 📋 Execution Plan

### Phase 1: HIGH Priority (Performance Critical) 🔴
**Must Complete:** 2.25 hours

#### Step 1: Add Prisma Indexes (1 hour)
```bash
# Edit prisma/schema.prisma
# Add indexes to Product, Order, Post, Project models
```

**Files to Modify:**
- `prisma/schema.prisma`

**Changes:**
1. Add `@@index([status])` to Product model
2. Add `@@index([featured])` to Product model
3. Add `@@index([createdAt])` to Product model
4. Add `@@index([customerEmail])` to Order model
5. Add `@@index([status])` to Order model
6. Add `@@index([createdAt])` to Order model
7. Add `@@index([status])` to Post model
8. Add `@@index([featured])` to Post model
9. Add `@@index([publishedAt])` to Post model
10. Add `@@index([status])` to Project model
11. Add `@@index([featured])` to Project model
12. Add `@@index([order])` to Project model

#### Step 2: Add Stripe Unique Constraints (30 minutes)
```bash
# Continue editing prisma/schema.prisma
# Add @unique to Stripe ID fields
```

**Changes:**
1. Add `@unique` to Product.stripeProductId
2. Add `@unique` to Product.stripePriceId
3. Add `@unique` to ProductPrice.stripePriceId

#### Step 3: Generate and Test Migration (45 minutes)
```bash
# Generate migration
npx prisma migrate dev --name add_performance_indexes_and_unique_constraints

# Review generated SQL
cat prisma/migrations/*/migration.sql

# Test with existing data
npm run db:push

# Verify
npm run build
```

**Checklist:**
- [ ] Migration generated successfully
- [ ] SQL reviewed (looks correct)
- [ ] Migration applied to dev database
- [ ] Existing data migrated without errors
- [ ] Build passes with zero errors
- [ ] TypeScript types updated

---

### Phase 2: MEDIUM Priority (Code Quality) 🟡
**Recommended:** 2 hours

#### Step 4: Add Zod Validation (1 hour)

**File:** `lib/auth.ts`

**Implementation:**
```typescript
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// In authorize function (around line 25)
const parsedCredentials = credentialsSchema.safeParse(credentials)

if (!parsedCredentials.success) {
  throw new InvalidCredentialsError()
}

const { email, password } = parsedCredentials.data
```

**Testing:**
```bash
# Test with invalid email
# Expected: Zod validation error

# Test with short password
# Expected: Zod validation error

# Test with valid credentials
# Expected: Success
```

#### Step 5: Create Custom Error Classes (30 minutes)

**File:** `lib/auth.ts`

**Add at top of file:**
```typescript
import { CredentialsSignin } from "@auth/core/errors"

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials"
  message = "Invalid email or password format"
}

class UserNotFoundError extends CredentialsSignin {
  code = "user_not_found"
  message = "No user found with this email address"
}

class IncorrectPasswordError extends CredentialsSignin {
  code = "incorrect_password"
  message = "The password you entered is incorrect"
}
```

#### Step 6: Update Error Handling (30 minutes)

**Replace generic errors:**
```typescript
// Replace this:
throw new Error("Invalid credentials")

// With this:
throw new InvalidCredentialsError()

// Replace this:
throw new Error("User not found")

// With this:
throw new UserNotFoundError()

// Replace this:
throw new Error("Incorrect password")

// With this:
throw new IncorrectPasswordError()
```

**Testing:**
```bash
# Test signin with non-existent user
# Expected: UserNotFoundError

# Test signin with wrong password
# Expected: IncorrectPasswordError

# Test signin with invalid format
# Expected: InvalidCredentialsError
```

---

### Phase 3: LOW Priority (Cleanup) 🟢
**Optional:** 45 minutes

#### Step 7: Simplify Cookie Management (30 minutes)

**File:** `i18n/routing.ts`

**Add localeCookie config:**
```typescript
export const routing = defineRouting({
  locales: ['en', 'tr', 'pt-BR'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365
  }
});
```

**File:** `middleware.ts`

**Remove manual cookie setting** (lines that set NEXT_LOCALE cookie)

**Testing:**
```bash
# Test locale switching
# Expected: Cookie still set by framework

# Test locale persistence
# Expected: Works same as before
```

#### Step 8: Review Matcher Pattern (15 minutes)

**File:** `middleware.ts`

**Check if tRPC is used:**
```bash
grep -r "tRPC\|@trpc" .
```

**If tRPC found, update matcher:**
```typescript
matcher: '/((?!api|trpc|_next|_vercel|.*\\..*)*)'
```

---

## 🧪 Testing Checklist

### After Phase 1 (Indexes)
- [ ] Migration applied successfully
- [ ] No data loss or corruption
- [ ] Build passes
- [ ] Can query products by status
- [ ] Can query orders by email
- [ ] Can query posts by publishedAt
- [ ] Can query projects by order

### After Phase 2 (Validation & Errors)
- [ ] Zod validation works for invalid email
- [ ] Zod validation works for short password
- [ ] Valid credentials still work
- [ ] Error messages display correctly
- [ ] Custom error codes appear in logs
- [ ] Signin flow works end-to-end

### After Phase 3 (Cleanup)
- [ ] Locale switching still works
- [ ] Cookie persistence unchanged
- [ ] Middleware still excludes correct routes
- [ ] Build passes
- [ ] No regressions

---

## 📊 Performance Testing

### Before Indexes (Baseline)
```sql
-- Test these queries and record time
EXPLAIN ANALYZE SELECT * FROM products WHERE status = 'published';
EXPLAIN ANALYZE SELECT * FROM orders WHERE customerEmail = 'test@example.com';
EXPLAIN ANALYZE SELECT * FROM posts WHERE status = 'published' ORDER BY publishedAt DESC;
EXPLAIN ANALYZE SELECT * FROM projects WHERE featured = true ORDER BY "order" ASC;
```

### After Indexes (Expected Improvement)
- Products by status: **10-50x faster**
- Orders by email: **20-100x faster**
- Posts by date: **10-30x faster**
- Projects by order: **5-20x faster**

---

## ⚠️ Rollback Plan

### If Migration Fails
```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back <migration-name>

# Or restore from backup
# (Make backup before starting!)
```

### If Code Breaks
```bash
# Revert commits
git revert HEAD

# Or restore specific file
git checkout HEAD~1 -- lib/auth.ts
```

---

## 📝 Commit Strategy

### Commit 1: Database Performance (Phase 1)
```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add performance indexes and Stripe ID unique constraints

- Add indexes to Product, Order, Post, Project models
- Add unique constraints to Stripe IDs
- Expected 10-100x query performance improvement
- Prevents duplicate Stripe sync issues

Context7 audit recommendation: HIGH priority
Estimated impact: 10-100x faster filtered queries"
```

### Commit 2: Auth Improvements (Phase 2)
```bash
git add lib/auth.ts
git commit -m "feat: improve NextAuth validation and error handling

- Add Zod validation for credentials (email + password)
- Create custom error classes (InvalidCredentials, UserNotFound, IncorrectPassword)
- Replace generic Error throws with specific error types
- Better debugging with error codes

Context7 audit recommendation: MEDIUM priority
Follows NextAuth v5 + Zod best practices"
```

### Commit 3: next-intl Cleanup (Phase 3)
```bash
git add i18n/routing.ts middleware.ts
git commit -m "refactor: simplify next-intl cookie management

- Move localeCookie config to routing file
- Remove manual cookie setting from middleware
- Let framework handle cookie lifecycle
- Update matcher pattern for tRPC (if applicable)

Context7 audit recommendation: LOW priority
Aligns with next-intl best practices"
```

---

## 🎯 Success Criteria

### Phase 1 Complete
- ✅ All indexes added to schema
- ✅ Unique constraints on Stripe IDs
- ✅ Migration applied successfully
- ✅ Build passes
- ✅ Performance improved (benchmarked)

### Phase 2 Complete
- ✅ Zod validation implemented
- ✅ Custom error classes created
- ✅ Error handling updated
- ✅ All tests passing
- ✅ Signin flow works perfectly

### Phase 3 Complete
- ✅ localeCookie config moved
- ✅ Manual cookie code removed
- ✅ Matcher pattern updated (if needed)
- ✅ No regressions
- ✅ Build passes

---

## 📅 Timeline

### Recommended Schedule

**Day 1: Phase 1 (HIGH Priority)**
- Morning: Add indexes and unique constraints (1.5h)
- Afternoon: Generate and test migration (45m)
- **Milestone:** Database optimizations complete

**Day 2: Phase 2 (MEDIUM Priority)**
- Morning: Add Zod validation (1h)
- Afternoon: Custom error classes + testing (1h)
- **Milestone:** Auth improvements complete

**Day 3: Phase 3 (LOW Priority) - Optional**
- Morning: Cleanup tasks (45m)
- **Milestone:** All improvements complete

---

## 🔗 Related Files

### Files to Modify
- `prisma/schema.prisma` - Add indexes and unique constraints
- `lib/auth.ts` - Add Zod validation and custom errors
- `i18n/routing.ts` - Add localeCookie config (optional)
- `middleware.ts` - Remove manual cookie code (optional)

### Reference Documents
- **Audit Report:** `.specpulse/memory/notes/code-quality-audit-context7-2025-11-11.md`
- **Spec:** `.specpulse/specs/code-quality-improvements.md`
- **This Plan:** `.specpulse/plans/code-quality-improvements.md`

---

**Status:** 🟠 Ready to Execute
**Total Estimated Time:** 5 hours
**Priority Breakdown:**
- 🔴 HIGH: 2.25 hours (must do)
- 🟡 MEDIUM: 2 hours (should do)
- 🟢 LOW: 45 minutes (nice to have)

**Next Action:** Start with Phase 1, Step 1 (Add Prisma Indexes)
