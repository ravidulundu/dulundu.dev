# Specification: Remaining Pages

## Overview

**Feature:** Remaining Pages
**Created:** 2025-11-10
**Status:** Planned
**Priority:** High

---

## Purpose

Complete missing pages that are referenced in navigation but not yet implemented.

---

## Requirements

### Functional Requirements

- [ ] Public products list page
- [ ] Services page (static content)
- [ ] Contact page (form + info)
- [ ] Admin settings page

### Non-Functional Requirements

- [ ] Responsive: Works on all devices
- [ ] SEO: Optimized metadata
- [ ] i18n: Multi-language support
- [ ] Accessibility: WCAG 2.1 AA

---

## User Stories

### Story 1: Visitor Views Products

**As a** visitor
**I want to** browse all available products
**So that** I can choose what to purchase

**Acceptance Criteria:**
- [ ] Grid layout of product cards
- [ ] Filter by category/type
- [ ] Price display
- [ ] "Buy Now" button
- [ ] Click to detail page

### Story 2: Visitor Views Services

**As a** visitor
**I want to** see available services
**So that** I can understand what services are offered

**Acceptance Criteria:**
- [ ] Service cards/sections
- [ ] Description of each service
- [ ] Pricing information
- [ ] Contact CTA

### Story 3: Visitor Contacts

**As a** visitor
**I want to** contact the business
**So that** I can ask questions or request services

**Acceptance Criteria:**
- [ ] Contact form (name, email, message)
- [ ] Form validation
- [ ] Success/error messages
- [ ] Alternative contact methods (email, social)

### Story 4: Admin Manages Settings

**As an** admin
**I want to** manage site settings
**So that** I can configure the website

**Acceptance Criteria:**
- [ ] Site settings form
- [ ] Save/update functionality
- [ ] Settings categories

---

## Technical Details

### Pages to Create

1. `app/[locale]/products/page.tsx` - Public products list
2. `app/[locale]/services/page.tsx` - Services showcase
3. `app/[locale]/contact/page.tsx` - Contact form
4. `app/[locale]/admin/settings/page.tsx` - Admin settings

---

## Dependencies

- Product model (already exists)
- Contact form handling (new)
- Settings storage (optional)

---

## Constraints

- Contact form can be client-side only initially
- Settings page can be placeholder for now
- Services page is static content

---

## Implementation Notes

- Reuse existing components where possible
- Keep it simple and functional
- Focus on completing navigation links
