<!-- SPECPULSE_METADATA
FEATURE_DIR: 017-database-indexing-optimization
FEATURE_ID: 017
SPEC_ID: 001
CREATED: 2025-11-13T13:44:17.413961
STATUS: draft
-->

<!-- SpecPulse Specification Template v1.0 -->
# Specification: 017-database-indexing-optimization

## Metadata
- **Feature ID**: 017
- **Spec ID**: 001
- **Created**: 2025-11-13
- **Version**: 1.0.0

## Executive Summary
Add database indexes to Product, Post, Project, and Order models for frequently queried columns (status, featured, createdAt, publishedAt, customerEmail, order) to improve query performance by 10-100x as noted in CLAUDE.md technical debt audit

## Problem Statement

Current database schema in `prisma/schema.prisma` lacks critical indexes on frequently queried columns, causing poor query performance:

**Missing Indexes:**
1. **Product Model**: No indexes on `status`, `featured`, `createdAt` (queried in product listings)
2. **Order Model**: No indexes on `customerEmail`, `status`, `createdAt` (queried in admin panel and order lookups)
3. **Post Model**: No indexes on `status`, `featured`, `publishedAt` (queried in blog listings)
4. **Project Model**: No indexes on `status`, `featured`, `order` (queried in portfolio pages)

**Impact:**
- **Performance**: Full table scans on every query (10-100x slower than indexed queries)
- **Scalability**: Query time increases linearly with table size
- **User Experience**: Slow page loads on product listings, blog, portfolio
- **Admin UX**: Slow dashboard and order management

**Reference:** CLAUDE.md Technical Debt Audit, Test Report lines 63-78

## Functional Requirements

FR-001: Add Product Model Indexes
  - Acceptance: Indexes created on `status`, `featured`, `createdAt` columns
  - Priority: MUST

FR-002: Add Order Model Indexes
  - Acceptance: Indexes created on `customerEmail`, `status`, `createdAt` columns
  - Priority: MUST

FR-003: Add Post Model Indexes
  - Acceptance: Indexes created on `status`, `featured`, `publishedAt` columns
  - Priority: MUST

FR-004: Add Project Model Indexes
  - Acceptance: Indexes created on `status`, `featured`, `order` columns
  - Priority: MUST

FR-005: Composite Index Optimization
  - Acceptance: Add composite index on `[status, featured]` for filtered listings
  - Priority: SHOULD

## User Stories

**As a** website visitor
**I want** product and blog listings to load quickly
**So that** I can browse content without delays

**Acceptance Criteria:**
- [ ] Product listing page loads in <200ms (currently ~2s without indexes)
- [ ] Blog listing page loads in <200ms
- [ ] Portfolio page loads in <200ms
- [ ] No visible performance degradation as content grows

**As a** admin user
**I want** order management dashboard to load quickly
**So that** I can efficiently process customer orders

**Acceptance Criteria:**
- [ ] Order list filtered by status loads in <100ms
- [ ] Customer order history lookup by email is instant (<50ms)
- [ ] Admin dashboard queries don't timeout

## Technical Constraints

1. **Zero Downtime**: Indexes must be added without blocking production database
2. **Backward Compatibility**: Existing queries must work unchanged
3. **Storage**: Indexes add ~10-20% to table size (acceptable trade-off)
4. **Migration Safety**: Use `db:push` (no migration files) or Prisma Migrate
5. **PostgreSQL Version**: Must be compatible with current Postgres version

## Dependencies

**Code Files:**
- `prisma/schema.prisma` (add @@index directives)

**External Dependencies:**
- @prisma/client@6.19.0 (existing)
- PostgreSQL database (existing)

**Database Commands:**
```bash
npm run db:generate    # Regenerate Prisma Client
npm run db:push        # Apply schema changes
```

## Success Criteria

- [ ] All 4 models have appropriate indexes added
- [ ] Schema updated with `@@index([column])` directives
- [ ] Prisma Client regenerated successfully
- [ ] Database schema pushed without errors
- [ ] Query performance tested: 10-100x improvement on filtered queries
- [ ] Production deployment tested (no downtime)
- [ ] Index usage confirmed with EXPLAIN ANALYZE queries
- [ ] Documentation updated in CLAUDE.md (remove from technical debt)
