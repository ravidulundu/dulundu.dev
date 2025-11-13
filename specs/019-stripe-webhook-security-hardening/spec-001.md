<!-- SPECPULSE_METADATA
FEATURE_DIR: 019-stripe-webhook-security-hardening
FEATURE_ID: 019
SPEC_ID: 001
CREATED: 2025-11-13T13:47:14.428565
STATUS: draft
-->

<!-- SpecPulse Specification Template v1.0 -->
# Specification: 019-stripe-webhook-security-hardening

## Metadata
- **Feature ID**: 019
- **Spec ID**: 001
- **Created**: 2025-11-13
- **Version**: 1.0.0

## Executive Summary
Reduce Stripe webhook signature verification tolerance from 300 seconds to 60 seconds to prevent replay attacks. Update STRIPE_WEBHOOK_TOLERANCE environment variable and add idempotency checks for checkout.session.completed events to prevent duplicate order processing

## Problem Statement

Current Stripe webhook handler in `app/api/webhooks/stripe/route.ts` has security vulnerabilities:

1. **Tolerance Too Lenient**: Webhook signature verification uses default 300-second tolerance, allowing replay attacks within 5-minute window
2. **No Idempotency Checks**: `checkout.session.completed` events can be processed multiple times, creating duplicate orders
3. **Missing Rate Limiting**: No rate limiting on webhook endpoint

**Impact:**
- Security risk: Attackers can replay captured webhook events within 300s window
- Data integrity: Duplicate orders can be created if Stripe retries webhook
- Financial risk: Multiple charges or order fulfillment for same transaction

**Reference:** CLAUDE.md Technical Debt Audit, Test Report line 154

## Functional Requirements

FR-001: Reduce Webhook Signature Tolerance
  - Acceptance: Webhook handler verifies signatures with 60-second tolerance instead of 300s
  - Priority: MUST

FR-002: Implement Idempotency Checks
  - Acceptance: Check `stripeSessionId` uniqueness before creating orders
  - Priority: MUST

FR-003: Add Request ID Tracking
  - Acceptance: Store and validate Stripe-Signature request IDs to prevent replay
  - Priority: SHOULD

FR-004: Environment Variable Configuration
  - Acceptance: Add `STRIPE_WEBHOOK_TOLERANCE` to .env with default 60
  - Priority: MUST

FR-005: Error Handling Enhancement
  - Acceptance: Return proper HTTP status codes (200, 400, 500) with error details
  - Priority: SHOULD

## User Stories

**As a** business owner
**I want** webhook events to be processed securely with replay attack protection
**So that** I don't face duplicate orders or fraudulent transactions

**Acceptance Criteria:**
- [ ] Webhook signature tolerance reduced to 60 seconds
- [ ] Duplicate `checkout.session.completed` events are rejected
- [ ] Orders with existing `stripeSessionId` are not created
- [ ] Proper error responses returned to Stripe (200/400/500)
- [ ] Webhook failures logged for monitoring

**As a** developer
**I want** idempotency keys for webhook processing
**So that** Stripe retries don't cause data corruption

**Acceptance Criteria:**
- [ ] Database constraint prevents duplicate `stripeSessionId` in orders table
- [ ] Webhook handler checks for existing orders before creation
- [ ] Stripe request IDs stored in logs for audit trail

## Technical Constraints

1. **Stripe API Compatibility**: Must maintain compatibility with Stripe API v19.3.0
2. **Database Schema**: Requires `stripeSessionId` to be unique in orders table
3. **Backward Compatibility**: Existing orders must not be affected
4. **Performance**: Idempotency checks must not add >50ms latency
5. **Logging**: Must integrate with existing logging system (if any)

## Dependencies

**Code Files:**
- `app/api/webhooks/stripe/route.ts` (webhook handler - modify)
- `prisma/schema.prisma` (add unique constraint - modify)
- `.env.example` (add STRIPE_WEBHOOK_TOLERANCE - modify)

**External Dependencies:**
- stripe@19.3.0 (existing)
- @prisma/client@6.19.0 (existing)

**Environment Variables:**
- `STRIPE_WEBHOOK_SECRET` (existing)
- `STRIPE_WEBHOOK_TOLERANCE` (new - default: 60)

## Success Criteria

- [ ] Webhook signature tolerance configurable via env var (default 60s)
- [ ] Duplicate `checkout.session.completed` events return 200 OK but don't create orders
- [ ] Database schema updated with unique constraint on `stripeSessionId`
- [ ] Migration applied without affecting existing data
- [ ] Manual testing: Replay attack prevented with >60s old signature
- [ ] Manual testing: Duplicate webhook delivery handled gracefully
- [ ] Error logging includes Stripe request IDs
- [ ] Documentation updated in CLAUDE.md (remove from technical debt)
