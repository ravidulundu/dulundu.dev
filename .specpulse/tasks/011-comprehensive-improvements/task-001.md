# Tasks: Comprehensive Improvements (Context7 + DocFork Audit)

**Feature:** Full Stack Improvements
**Created:** 2025-11-11
**Sources:** Context7 MCP + DocFork MCP
**Status:** 🟠 Ready to Execute
**Overall Progress:** 0/19 tasks (0%)

---

## 🔴 Phase 1: CRITICAL - Security & Performance (10 tasks - 4 hours)

**Must Complete This Week**

### Group 1: Middleware Optimization (2 tasks - 1.25h)

- [ ] 1.1: Update middleware matcher to exclude static assets
  - File: `middleware.ts`
  - Add aggressive matcher pattern
  - Exclude prefetch requests
  - Test with `npm run dev`
  - **Impact:** 50-70% performance boost
  - **Effort:** 15 minutes

- [ ] 1.2: Add CSP (Content Security Policy) headers
  - File: `middleware.ts`
  - Generate nonce for scripts
  - Set CSP header with strict policy
  - Update `app/[locale]/layout.tsx` to use nonce
  - Test with browser DevTools Security tab
  - **Impact:** XSS protection
  - **Effort:** 1 hour

### Group 2: Stripe Webhook Security (3 tasks - 1h)

- [ ] 2.1: Tighten webhook signature tolerance to 60s
  - File: `app/api/webhooks/stripe/route.ts`
  - Update `constructEvent` with tolerance parameter
  - **Effort:** 5 minutes

- [ ] 2.2: Add idempotency check for webhook events
  - Implement event ID tracking (Set or Redis)
  - Prevent duplicate processing
  - **Effort:** 30 minutes

- [ ] 2.3: Add event type whitelist validation
  - Define allowed events array
  - Reject unhandled events gracefully
  - Add comprehensive error logging
  - **Effort:** 25 minutes

### Group 3: Database Performance (5 tasks - 1.75h)

**Critical for Production Scale**

- [ ] 3.1: Add indexes to Product model
  - `@@index([status])`
  - `@@index([featured])`
  - `@@index([createdAt])`
  - **Effort:** 15 minutes

- [ ] 3.2: Add indexes to Order model
  - `@@index([customerEmail])`
  - `@@index([status])`
  - `@@index([createdAt])`
  - **Effort:** 15 minutes

- [ ] 3.3: Add indexes to Post model
  - `@@index([status])`
  - `@@index([featured])`
  - `@@index([publishedAt])`
  - **Effort:** 15 minutes

- [ ] 3.4: Add indexes to Project model
  - `@@index([status])`
  - `@@index([featured])`
  - `@@index([order])`
  - **Effort:** 15 minutes

- [ ] 3.5: Generate and test migration
  - Run `npx prisma migrate dev --name add_comprehensive_indexes`
  - Test queries before/after
  - Verify 10-100x performance improvement
  - **Effort:** 45 minutes

---

## 🟡 Phase 2: MEDIUM - Best Practices (9 tasks - 15h)

**Should Complete in 2-3 Weeks**

### Group 4: API Route Improvements (6 tasks - 6h)

**Better Error Handling & Validation**

- [ ] 4.1: Improve `/api/products` (GET)
  - Add Zod schema for query params
  - Add try-catch error handling
  - Add proper HTTP status codes
  - Add Cache-Control headers
  - **Effort:** 1 hour

- [ ] 4.2: Improve `/api/products` (POST)
  - Add Zod validation for body
  - Add error handling
  - Return proper status codes
  - **Effort:** 1 hour

- [ ] 4.3: Improve `/api/admin/products/*` routes
  - Add authentication checks
  - Add input validation
  - Add error handling
  - **Effort:** 1.5 hours

- [ ] 4.4: Improve `/api/checkout` route
  - Add currency validation
  - Add error handling for missing prices
  - Add proper logging
  - **Effort:** 1 hour

- [ ] 4.5: Improve `/api/admin/orders` routes
  - Add pagination validation
  - Add error handling
  - Add proper status codes
  - **Effort:** 1 hour

- [ ] 4.6: Add global error handling middleware
  - Create `lib/api-error-handler.ts`
  - Standardize error responses
  - Add logging
  - **Effort:** 30 minutes

### Group 5: Monitoring & Instrumentation (2 tasks - 2h)

- [ ] 5.1: Create `instrumentation.ts`
  - Add register() function
  - Initialize monitoring (optional: OpenTelemetry)
  - Add onRequestError handler
  - **Effort:** 1 hour

- [ ] 5.2: Add request/error logging
  - Log to console in development
  - Send to monitoring service in production
  - Track performance metrics
  - **Effort:** 1 hour

### Group 6: Performance Optimization (1 task - 3h)

- [ ] 6.1: Implement parallel routes for admin dashboard
  - Create `app/admin/dashboard/@stats/page.tsx`
  - Create `app/admin/dashboard/@orders/page.tsx`
  - Create `app/admin/dashboard/@products/page.tsx`
  - Update layout to use parallel routes
  - Add Suspense with skeletons
  - Test 3x faster loading
  - **Effort:** 3 hours

---

## 🟢 Phase 3: ENHANCEMENTS - Nice to Have (10 tasks - varies)

**Can Be Done Anytime**

### Group 7: Stripe Multi-Currency (4 tasks - 4h)

- [ ] 7.1: Update product creation to support multiple prices
  - Modify admin product form
  - Create prices for USD, TRY, BRL
  - Store price IDs in database
  - **Effort:** 1.5 hours

- [ ] 7.2: Update checkout to select currency-specific price
  - Get price by currency
  - Create session with correct price
  - **Effort:** 1 hour

- [ ] 7.3: Add currency selector on product pages
  - Create CurrencySelector component
  - Update ProductCard to show selected currency
  - **Effort:** 1 hour

- [ ] 7.4: Test multi-currency flow end-to-end
  - Test USD checkout
  - Test TRY checkout
  - Test BRL checkout
  - Verify correct amounts
  - **Effort:** 30 minutes

### Group 8: Database Optimization (2 tasks - 1h)

- [ ] 8.1: Add connection pooling configuration
  - Update `lib/db.ts`
  - Add connection limit to DATABASE_URL
  - Test with serverless deployment
  - **Effort:** 30 minutes

- [ ] 8.2: Add database health check endpoint
  - Create `/api/health` route
  - Check database connection
  - Return status + metrics
  - **Effort:** 30 minutes

### Group 9: Code Quality (from previous audit) (4 tasks - 2h)

- [ ] 9.1: Add Zod validation to NextAuth
  - Update `lib/auth.ts`
  - Create credentialsSchema
  - Replace basic validation
  - **Effort:** 1 hour

- [ ] 9.2: Create custom error classes for NextAuth
  - InvalidCredentialsError
  - UserNotFoundError
  - IncorrectPasswordError
  - **Effort:** 30 minutes

- [ ] 9.3: Update error handling in authorize function
  - Replace generic Error throws
  - Use custom error classes
  - **Effort:** 15 minutes

- [ ] 9.4: Test auth error scenarios
  - Test invalid email
  - Test wrong password
  - Test non-existent user
  - **Effort:** 15 minutes

---

## 📊 Progress Summary

| Phase | Priority | Tasks | Completed | Progress | Time |
|-------|----------|-------|-----------|----------|------|
| Phase 1 | 🔴 CRITICAL | 10 | 0 | 0% | 4h |
| Phase 2 | 🟡 MEDIUM | 9 | 0 | 0% | 15h |
| Phase 3 | 🟢 LOW | 10 | 0 | 0% | 7h |
| **Total** | - | **29** | **0** | **0%** | **26h** |

---

## ✅ Acceptance Criteria

### Phase 1 Complete When:
- [ ] Middleware executes 50-70% less
- [ ] CSP headers present on all pages
- [ ] Webhook events validated and logged
- [ ] All database queries use indexes
- [ ] Performance benchmarks show 10-100x improvement
- [ ] Security audit passes

### Phase 2 Complete When:
- [ ] All API routes have error handling
- [ ] Instrumentation file created
- [ ] Admin dashboard loads 3x faster
- [ ] All errors logged properly
- [ ] TypeScript errors: 0

### Phase 3 Complete When:
- [ ] Multi-currency checkout works
- [ ] Connection pooling enabled
- [ ] NextAuth has Zod validation
- [ ] Custom error classes in use
- [ ] All tests passing

---

## 🧪 Testing Checklist

### After Phase 1:
- [ ] Middleware performance test (Chrome DevTools)
- [ ] CSP validation (Security tab)
- [ ] Webhook signature test (Stripe CLI)
- [ ] Database query speed test (Prisma Studio)
- [ ] Security headers check (securityheaders.com)

### After Phase 2:
- [ ] API error handling test (Postman/Thunder Client)
- [ ] Admin dashboard loading test (Network tab)
- [ ] Monitoring dashboard check
- [ ] Build succeeds (`npm run build`)

### After Phase 3:
- [ ] Multi-currency purchase test (all 3 currencies)
- [ ] Connection pooling test (serverless)
- [ ] Auth error message test
- [ ] End-to-end regression test

---

## 📋 Dependencies

```
Phase 1 (Critical)
├── Group 1: Middleware (independent)
├── Group 2: Webhooks (independent)
└── Group 3: Database (must complete before Phase 2)

Phase 2 (Medium)
├── Group 4: API Routes (requires Phase 1 database)
├── Group 5: Monitoring (independent)
└── Group 6: Parallel Routes (independent)

Phase 3 (Low)
├── Group 7: Multi-currency (requires Phase 1 + 2)
├── Group 8: DB Optimization (requires Phase 1)
└── Group 9: Code Quality (independent)
```

---

## 🎯 Quick Start Guide

### To Start Phase 1:
1. **Middleware** (15m + 1h)
   - Open `middleware.ts`
   - Update matcher
   - Add CSP headers
   - Test with DevTools

2. **Webhooks** (1h)
   - Open `app/api/webhooks/stripe/route.ts`
   - Add tolerance, idempotency, whitelist
   - Test with Stripe CLI

3. **Database** (1.75h)
   - Open `prisma/schema.prisma`
   - Add all indexes
   - Run migration
   - Benchmark queries

### To Start Phase 2:
1. **API Routes** (6h)
   - Start with `/api/products` (highest traffic)
   - Add Zod validation
   - Add error handling
   - Test with Postman

2. **Monitoring** (2h)
   - Create `instrumentation.ts`
   - Add error tracking
   - Test logging

3. **Parallel Routes** (3h)
   - Create `@stats`, `@orders`, `@products` folders
   - Update layout
   - Add Suspense
   - Test loading speed

---

## 📝 Notes

### Source Documentation
- **Context7 Findings:** High-trust GitHub sources (Trust Score 8.9-10)
- **DocFork Findings:** Official web documentation + guides
- **Combined Confidence:** 98%

### Performance Expectations
- **Middleware:** 50-70% faster
- **Database:** 10-100x faster queries
- **Admin Dashboard:** 3x faster loads
- **API Routes:** Better error recovery

### Security Improvements
- **CSP:** XSS protection
- **Webhooks:** Replay attack prevention
- **Validation:** SQL injection protection
- **Error Handling:** No information leakage

---

**Last Updated:** 2025-11-11
**Next Action:** Start Phase 1, Group 1 (Middleware optimization)
**Reference:** See `comprehensive-audit-context7-docfork-2025-11-11.md` for details
