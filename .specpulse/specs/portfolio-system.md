# Specification: Portfolio System

## Overview

**Feature:** Portfolio System
**Created:** 2025-11-09
**Status:** Planned
**Priority:** High

---

## Purpose

Build a complete portfolio showcase system to display completed projects with case studies, images, and client testimonials.

---

## Requirements

### Functional Requirements

- [ ] Admin panel for project management
- [ ] Create/Edit/Delete projects
- [ ] Multi-language support (TR, EN, PT-BR)
- [ ] Rich text editor for case studies
- [ ] Multiple images per project
- [ ] Project categories/tags
- [ ] Featured projects
- [ ] Public portfolio gallery
- [ ] Project detail pages
- [ ] Filter by category

### Non-Functional Requirements

- [ ] Performance: Fast image loading
- [ ] SEO: Optimized metadata
- [ ] Responsive: Works on all devices
- [ ] Accessibility: WCAG 2.1 AA

---

## User Stories

### Story 1: Admin Creates Project

**As an** admin
**I want to** create a new portfolio project
**So that** I can showcase my work to potential clients

**Acceptance Criteria:**
- [ ] Form with multi-language tabs
- [ ] Fields: title, description, case study, client name
- [ ] Multiple image uploads
- [ ] Category selection
- [ ] Featured toggle
- [ ] Live preview link (optional)
- [ ] Project date
- [ ] Technologies used (tags)

### Story 2: Visitor Views Portfolio

**As a** visitor
**I want to** browse completed projects
**So that** I can evaluate the quality of work

**Acceptance Criteria:**
- [ ] Grid layout of project cards
- [ ] Hover effects on cards
- [ ] Filter by category
- [ ] Responsive design
- [ ] Click to view details

### Story 3: Visitor Reads Case Study

**As a** visitor
**I want to** read detailed case studies
**So that** I can understand the approach and results

**Acceptance Criteria:**
- [ ] Full project details
- [ ] Image gallery/slider
- [ ] Technologies used
- [ ] Client testimonial (if available)
- [ ] Results/metrics
- [ ] Live demo link (if available)

---

## Technical Details

### Data Models

```prisma
model Project {
  id          String   @id @default(cuid())
  slug        String   @unique
  category    String   // web, mobile, wordpress, etc.
  featured    Boolean  @default(false)
  clientName  String?
  projectDate DateTime?
  demoUrl     String?
  tags        String?  @db.Text // JSON array
  status      String   @default("draft")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  translations ProjectTranslation[]
}

model ProjectTranslation {
  id          String  @id @default(cuid())
  projectId   String
  locale      String  // en, tr, pt-BR
  title       String
  description String  @db.Text
  caseStudy   String? @db.Text // Rich text
  testimonial String? @db.Text
  results     String? @db.Text
  images      String? @db.Text // JSON array of URLs

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

### API Endpoints

**Admin API:**
- `POST /api/admin/portfolio` - Create project
- `GET /api/admin/portfolio` - List all projects
- `GET /api/admin/portfolio/[id]` - Get single project
- `PUT /api/admin/portfolio/[id]` - Update project
- `DELETE /api/admin/portfolio/[id]` - Delete project

**Public API:**
- `GET /api/portfolio` - List published projects (with filters)
- `GET /api/portfolio/[slug]` - Get project by slug

### Components

**Admin:**
- `components/admin/ProjectForm.tsx` - Multi-language project form
- `app/[locale]/admin/portfolio/page.tsx` - Project list
- `app/[locale]/admin/portfolio/new/page.tsx` - Create project
- `app/[locale]/admin/portfolio/[id]/page.tsx` - Edit project

**Public:**
- `components/portfolio/ProjectCard.tsx` - Project preview card
- `components/portfolio/ProjectGallery.tsx` - Image gallery
- `app/[locale]/portfolio/page.tsx` - Portfolio gallery
- `app/[locale]/portfolio/[slug]/page.tsx` - Project detail

---

## Dependencies

- TipTap (rich text for case studies)
- react-image-gallery or similar (image slider)
- Next.js Image (optimization)

---

## Constraints

- Image upload can be URL-based initially
- Gallery can be simple (no fancy transitions needed)
- Categories are predefined (no dynamic category creation)

---

## Implementation Notes

- Very similar to Blog System structure
- Reuse multi-language form pattern
- Image gallery can be simple initially
- Consider Cloudinary for image hosting (optional)
