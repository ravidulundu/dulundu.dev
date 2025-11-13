<!-- SPECPULSE_METADATA
FEATURE_DIR: 020-modern-portfolio-template-integration
FEATURE_ID: 020
SPEC_ID: 001
CREATED: 2025-11-13T18:09:36.168468
STATUS: draft
-->

<!-- SpecPulse Specification Template v1.0 -->
# Specification: 020-modern-portfolio-template-integration

## Metadata
- **Feature ID**: 020
- **Spec ID**: 001
- **Created**: 2025-11-13
- **Version**: 1.0.0

## Executive Summary
Integrate modern portfolio template from akash3444/portfolio-template (Next.js 15, Tailwind 4.0, Shadcn UI) into existing dulundu.dev. Adapt hero section with animated elements, project showcase grid with hover effects, skills section with progress bars, testimonials carousel, and interactive contact form. Maintain existing multi-language support (TR/EN/PT-BR), Prisma database integration, and claymorphism theme. Update homepage and portfolio pages with modern UI blocks while preserving current functionality.

## Problem Statement

Current dulundu.dev portfolio has solid functionality but lacks modern interactive UI patterns that engage users. The referenced template (akash3444/portfolio-template) showcases contemporary design trends:

**Current State:**
- Static hero section without animations
- Basic project grid layout
- Simple skills display without visual engagement
- No testimonials showcase
- Standard contact form

**Desired Improvements:**
- Animated hero section with gradient text effects
- Interactive project cards with smooth hover states
- Skill progress bars with animation
- Testimonials carousel/slider
- Enhanced contact form with validation feedback

**Challenge:**
Integrate modern UI patterns while maintaining:
- Multi-language support (TR/EN/PT-BR)
- Prisma database integration
- Existing claymorphism theme
- Current routing structure
- Performance (<170 kB bundle size)

## Functional Requirements

FR-001: Modern Hero Section
  - Acceptance: Animated gradient text, typewriter effect, floating elements, CTA buttons with hover effects
  - Priority: MUST

FR-002: Interactive Project Showcase
  - Acceptance: Grid layout with hover effects, project cards reveal details on hover, smooth transitions
  - Priority: MUST

FR-003: Animated Skills Section
  - Acceptance: Progress bars with percentage animation, skill categories with icons, stagger animation on scroll
  - Priority: MUST

FR-004: Testimonials Carousel
  - Acceptance: Auto-rotating testimonials, navigation dots, swipe gestures on mobile
  - Priority: SHOULD

FR-005: Enhanced Contact Form
  - Acceptance: Real-time validation, success/error states, loading animation, accessibility compliant
  - Priority: MUST

FR-006: Preserve Existing Functionality
  - Acceptance: All current features work unchanged (i18n, database, auth, Stripe)
  - Priority: MUST

FR-007: Responsive Design
  - Acceptance: All new components mobile-first, tested on 375px-1920px viewports
  - Priority: MUST

## User Stories

**As a** potential client visiting the portfolio
**I want** an engaging, modern interface with smooth animations
**So that** I get a positive first impression and stay to explore services

**Acceptance Criteria:**
- [ ] Hero section has eye-catching gradient animations
- [ ] Project cards reveal information smoothly on hover
- [ ] Skills display with animated progress bars (0% → actual%)
- [ ] Page feels modern and professional
- [ ] All interactions are smooth (60fps)

**As a** mobile user
**I want** touch-friendly interactions and responsive layouts
**So that** I can navigate easily on my phone

**Acceptance Criteria:**
- [ ] Hero CTA buttons easy to tap (min 44x44px)
- [ ] Project cards work with touch gestures
- [ ] Testimonials swipeable on mobile
- [ ] Contact form inputs properly sized for mobile
- [ ] No horizontal scroll on any device

**As a** site owner
**I want** to maintain existing i18n and database functionality
**So that** the site continues working in 3 languages with dynamic content

**Acceptance Criteria:**
- [ ] All new UI text uses next-intl translations
- [ ] Projects loaded from Prisma database
- [ ] Skills can be managed via admin panel (future)
- [ ] Testimonials stored in database (future feature)

## Technical Constraints

1. **Next.js Version**: Currently 14.2.0, template uses 15.x (must adapt code to 14.x syntax)
2. **Tailwind Version**: Currently 3.4.18, template uses 4.0 (may need compatibility adjustments)
3. **Bundle Size**: Must stay under 170 kB per page
4. **Performance**: Animations must not impact Core Web Vitals (LCP <2.5s, FID <100ms)
5. **Accessibility**: All animations must respect `prefers-reduced-motion`
6. **Browser Support**: Chrome/Firefox/Safari/Edge latest 2 versions

## Dependencies

**Code Files to Modify:**
- `app/[locale]/page.tsx` - Homepage with new hero section
- `app/[locale]/portfolio/page.tsx` - Project showcase grid
- `components/home/` - New animated components
- `messages/*.json` - Translations for new UI text

**New Components to Create:**
- `components/home/AnimatedHero.tsx` - Hero with gradient text
- `components/home/SkillsProgress.tsx` - Animated progress bars
- `components/home/TestimonialsCarousel.tsx` - Testimonials slider
- `components/portfolio/InteractiveProjectCard.tsx` - Hover effects
- `components/ui/animated-text.tsx` - Reusable text animations

**External Dependencies (May Need to Add):**
- `framer-motion` - Animation library (if not using pure CSS)
- `embla-carousel-react` - For testimonials carousel
- `react-intersection-observer` - Scroll-triggered animations

**Existing Dependencies (Keep):**
- next@14.2.0
- tailwindcss@3.4.18
- next-intl@4.5.0
- @prisma/client@6.19.0

## Success Criteria

- [ ] Hero section has gradient animated text and floating elements
- [ ] Project cards show smooth hover effects with overlay
- [ ] Skills section animates progress bars on scroll into view
- [ ] Testimonials carousel works with auto-rotation and manual navigation
- [ ] Contact form has real-time validation and loading states
- [ ] All animations respect `prefers-reduced-motion` media query
- [ ] Mobile responsive on 375px viewport
- [ ] All 3 languages (TR/EN/PT-BR) work with new components
- [ ] Build size stays under 170 kB per page
- [ ] Lighthouse score: Performance >90, Accessibility >95
- [ ] No console errors or warnings
- [ ] Playwright tests updated for new UI interactions
