# Tasks: Code Quality Improvements

**Feature:** Code Quality Improvements (Context7 Audit)
**Created:** 2025-11-11
**Status:** 🟠 Not Started
**Overall Progress:** 0/21 tasks (0%)

---

## 🔴 Phase 1: HIGH Priority - Database Performance (12 tasks)

**Estimated Time:** 2.25 hours
**Status:** ⏳ Not Started
**Progress:** 0/12 (0%)

### Task Group 1: Add Prisma Indexes (12 tasks)

#### Product Model Indexes (3 tasks)
- [ ] 1.1: Add `@@index([status])` to Product model
- [ ] 1.2: Add `@@index([featured])` to Product model
- [ ] 1.3: Add `@@index([createdAt])` to Product model

#### Order Model Indexes (3 tasks)
- [ ] 1.4: Add `@@index([customerEmail])` to Order model
- [ ] 1.5: Add `@@index([status])` to Order model
- [ ] 1.6: Add `@@index([createdAt])` to Order model

#### Post Model Indexes (3 tasks)
- [ ] 1.7: Add `@@index([status])` to Post model
- [ ] 1.8: Add `@@index([featured])` to Post model
- [ ] 1.9: Add `@@index([publishedAt])` to Post model

#### Project Model Indexes (3 tasks)
- [ ] 1.10: Add `@@index([status])` to Project model
- [ ] 1.11: Add `@@index([featured])` to Project model
- [ ] 1.12: Add `@@index([order])` to Project model

### Task Group 2: Add Stripe Unique Constraints (3 tasks)

- [ ] 2.1: Add `@unique` to Product.stripeProductId field
- [ ] 2.2: Add `@unique` to Product.stripePriceId field
- [ ] 2.3: Add `@unique` to ProductPrice.stripePriceId field

### Task Group 3: Migration (1 task)

- [ ] 3.1: Generate and test migration
  - Run `npx prisma migrate dev --name add_performance_indexes_and_unique_constraints`
  - Review generated SQL
  - Apply migration
  - Verify indexes created
  - Test with existing data
  - Run build to confirm no errors

---

## 🟡 Phase 2: MEDIUM Priority - Auth Improvements (4 tasks)

**Estimated Time:** 2 hours
**Status:** ⏳ Not Started
**Progress:** 0/4 (0%)

### Task Group 4: Zod Validation (1 task)

- [ ] 4.1: Implement Zod validation in lib/auth.ts
  - Import Zod
  - Create credentialsSchema (email + password)
  - Replace basic validation with safeParse
  - Update error handling
  - Test with invalid inputs

### Task Group 5: Custom Error Classes (1 task)

- [ ] 5.1: Create custom error classes
  - Import CredentialsSignin from @auth/core/errors
  - Create InvalidCredentialsError class
  - Create UserNotFoundError class
  - Create IncorrectPasswordError class

### Task Group 6: Update Error Handling (1 task)

- [ ] 6.1: Replace generic Error throws with custom classes
  - Replace "Invalid credentials" → InvalidCredentialsError
  - Replace "User not found" → UserNotFoundError
  - Replace "Incorrect password" → IncorrectPasswordError
  - Test error messages display correctly

### Task Group 7: Testing (1 task)

- [ ] 7.1: Test all auth error scenarios
  - Test with invalid email format
  - Test with short password
  - Test with non-existent user
  - Test with wrong password
  - Test with valid credentials
  - Verify error codes and messages

---

## 🟢 Phase 3: LOW Priority - Cleanup (2 tasks)

**Estimated Time:** 45 minutes
**Status:** ⏳ Not Started
**Progress:** 0/2 (0%)

### Task Group 8: Cookie Management (1 task)

- [ ] 8.1: Simplify cookie management
  - Add localeCookie config to i18n/routing.ts
  - Remove manual cookie setting from middleware.ts
  - Test locale persistence
  - Verify behavior unchanged

### Task Group 9: Matcher Pattern (1 task)

- [ ] 9.1: Review and update matcher pattern
  - Check if project uses tRPC
  - Update matcher if tRPC found
  - Test middleware still works correctly

---

## 📊 Progress Summary

| Phase | Priority | Tasks | Completed | Progress | Time |
|-------|----------|-------|-----------|----------|------|
| Phase 1 | 🔴 HIGH | 16 | 0 | 0% | 2.25h |
| Phase 2 | 🟡 MEDIUM | 4 | 0 | 0% | 2h |
| Phase 3 | 🟢 LOW | 2 | 0 | 0% | 45m |
| **Total** | - | **22** | **0** | **0%** | **5h** |

---

## ✅ Acceptance Criteria

### Phase 1 Complete When:
- [ ] All 12 indexes added to Prisma schema
- [ ] All 3 Stripe unique constraints added
- [ ] Migration generated successfully
- [ ] Migration applied without errors
- [ ] Build passes with zero TypeScript errors
- [ ] Performance benchmarks show improvement

### Phase 2 Complete When:
- [ ] Zod validation implemented
- [ ] All 3 custom error classes created
- [ ] Error handling updated throughout lib/auth.ts
- [ ] All auth error scenarios tested
- [ ] Signin flow works perfectly
- [ ] Build passes

### Phase 3 Complete When:
- [ ] localeCookie config moved to routing
- [ ] Manual cookie code removed
- [ ] Matcher pattern updated (if needed)
- [ ] No regressions in locale behavior
- [ ] Build passes

---

## 🧪 Testing Checklist

### Database Performance Testing
- [ ] Test Product query by status (before/after comparison)
- [ ] Test Order query by email (before/after comparison)
- [ ] Test Post query by date (before/after comparison)
- [ ] Test Project query by order (before/after comparison)
- [ ] Document performance improvements

### Validation Testing
- [ ] Test Zod with invalid email format
- [ ] Test Zod with short password (< 6 chars)
- [ ] Test Zod with valid credentials
- [ ] Verify error messages are user-friendly

### Error Handling Testing
- [ ] Test signin with non-existent user
- [ ] Test signin with wrong password
- [ ] Test signin with invalid format
- [ ] Verify error codes are correct
- [ ] Verify error messages display in UI

### Integration Testing
- [ ] Run full build after all changes
- [ ] Test complete signin flow
- [ ] Test product listing performance
- [ ] Test admin order filtering
- [ ] Verify no regressions anywhere

---

## 📋 Task Dependencies

```
Phase 1 (Database)
├── Task Group 1: Indexes (can do in parallel)
│   ├── 1.1-1.3: Product indexes
│   ├── 1.4-1.6: Order indexes
│   ├── 1.7-1.9: Post indexes
│   └── 1.10-1.12: Project indexes
├── Task Group 2: Unique Constraints (after indexes)
│   └── 2.1-2.3: Stripe IDs
└── Task Group 3: Migration (after all schema changes)
    └── 3.1: Generate and test

Phase 2 (Auth)
├── Task Group 4: Zod (can start independently)
├── Task Group 5: Error Classes (after Zod)
├── Task Group 6: Update Errors (after classes)
└── Task Group 7: Testing (after all Phase 2)

Phase 3 (Cleanup)
├── Task Group 8: Cookies (independent)
└── Task Group 9: Matcher (independent)
```

---

## 🎯 Quick Start Guide

### To Start Phase 1:
1. Open `prisma/schema.prisma`
2. Find Product model (around line 85)
3. Add indexes after existing fields
4. Repeat for Order, Post, Project
5. Add @unique to Stripe ID fields
6. Run migration command

### To Start Phase 2:
1. Open `lib/auth.ts`
2. Import Zod at top
3. Create credentialsSchema
4. Create custom error classes
5. Update authorize function
6. Test signin flow

### To Start Phase 3:
1. Open `i18n/routing.ts`
2. Add localeCookie config
3. Open `middleware.ts`
4. Remove manual cookie code
5. Test locale switching

---

## 📝 Notes

### Context7 Audit Scores
- **NextAuth v5:** 8/10 → 9/10 (after Phase 2)
- **next-intl:** 9/10 → 9.5/10 (after Phase 3)
- **Prisma:** 7/10 → 9.5/10 (after Phase 1)
- **Overall:** 8/10 → 9.5/10 (after all phases)

### Performance Impact
- **Phase 1:** 10-100x query speed improvement
- **Phase 2:** Better validation + error handling
- **Phase 3:** Cleaner code + easier maintenance

### Priority Guidance
- **Must Do:** Phase 1 (performance critical)
- **Should Do:** Phase 2 (code quality)
- **Nice to Have:** Phase 3 (cleanup)

---

**Last Updated:** 2025-11-11
**Next Action:** Start Phase 1, Task 1.1 (Add Product status index)
**Reference:** See `.specpulse/specs/code-quality-improvements.md` for detailed design
