# Portfolio-First Redesign - Tasks

## Feature: 016-portfolio-first-redesign

## Status: PLANNING

## Phase 1: Homepage Redesign ⏳

### Task 1.1: Hero Section Update
- [ ] Update hero heading to "Ege Dulundu"
- [ ] Add tagline: "Making websites faster. WordPress expert + full-stack developer."
- [ ] Update CTA buttons: "View Portfolio" (primary), "Book a Service" (secondary)
- [ ] Add optional avatar/photo section
- [ ] Translations (en, tr, pt-BR)
- **Files**: `app/[locale]/page.tsx`, `messages/*.json`
- **Est. Time**: 30 mins

### Task 1.2: Bio Section (New)
- [ ] Create minimalist bio component
- [ ] Content: 2-3 sentences about Ege
- [ ] "3-5 years experience" mention
- [ ] Clean typography with tracking-tight
- [ ] Translations (en, tr, pt-BR)
- **Files**: `components/home/BioSection.tsx` (new), `messages/*.json`
- **Est. Time**: 45 mins

### Task 1.3: Skills Section (New)
- [ ] Create skills showcase component
- [ ] Three expertise areas:
  - WordPress Expert (optimization, themes, plugins, WooCommerce)
  - Performance Optimizer (speed, caching, Core Web Vitals, CDN)
  - Full-Stack Developer (Next.js, React, Node.js, PostgreSQL, TypeScript)
- [ ] Icon badges for each skill
- [ ] Brief descriptions
- [ ] Responsive grid layout
- [ ] Translations (en, tr, pt-BR)
- **Files**: `components/home/SkillsSection.tsx` (new), `messages/*.json`
- **Est. Time**: 1 hour

### Task 1.4: Featured Portfolio Showcase (New)
- [ ] Create featured projects component
- [ ] Query 3-6 featured projects from database
- [ ] Project card design:
  - Cover image
  - Title
  - Category badge
  - Key result/metric
  - Tech stack badges
  - "View Case Study" link
- [ ] Horizontal scroll on mobile
- [ ] Grid layout on desktop
- [ ] Translations (en, tr, pt-BR)
- **Files**: `components/home/FeaturedProjects.tsx` (new), `app/[locale]/page.tsx`
- **Est. Time**: 1.5 hours

### Task 1.5: Services Overview (New)
- [ ] Create services preview component
- [ ] Show 3-4 service categories:
  - WordPress Optimization
  - Technical Consulting
  - Full-Stack Development
  - Performance Audits
- [ ] Brief description for each
- [ ] "View All Services" CTA
- [ ] Card/grid layout
- [ ] Translations (en, tr, pt-BR)
- **Files**: `components/home/ServicesOverview.tsx` (new), `messages/*.json`
- **Est. Time**: 1 hour

### Task 1.6: Homepage Assembly
- [ ] Remove old hero content
- [ ] Add Bio section
- [ ] Add Skills section
- [ ] Add Featured Portfolio section
- [ ] Add Services Overview section
- [ ] Maintain Footer
- [ ] Test responsive design
- [ ] Verify translations
- **Files**: `app/[locale]/page.tsx`
- **Est. Time**: 45 mins

## Phase 2: Portfolio Enhancement ⏳

### Task 2.1: Portfolio Database Schema Review
- [ ] Check current project model
- [ ] Add fields if needed:
  - `challenge` (text)
  - `solution` (text)
  - `results` (JSON: metrics, improvements)
  - `client` (optional string)
  - `testimonial` (optional text)
  - `githubUrl` (optional string)
  - `featured` (boolean)
- [ ] Run Prisma migration if needed
- **Files**: `prisma/schema.prisma`
- **Est. Time**: 30 mins

### Task 2.2: Enhanced Project Card
- [ ] Update project card component
- [ ] Add:
  - Category badge
  - Featured badge
  - Key metric highlight
  - Tech stack icons/badges
  - Hover effects
- [ ] Improve image aspect ratio
- [ ] Add "View Case Study" CTA
- **Files**: `components/portfolio/ProjectCard.tsx`
- **Est. Time**: 1 hour

### Task 2.3: Project Detail Page Redesign
- [ ] Create case study layout
- [ ] Sections:
  - Hero with project title and image
  - Overview (category, date, client, tech stack)
  - Challenge/Problem statement
  - Solution approach
  - Process/Timeline
  - Results/Metrics (with visual emphasis)
  - Screenshots gallery
  - Code samples (if applicable)
  - Client testimonial (if available)
  - GitHub link (if applicable)
  - Related projects
- [ ] Before/after comparison component
- [ ] Metrics visualization (numbers, graphs)
- [ ] Responsive design
- [ ] Translations support
- **Files**: `app/[locale]/portfolio/[slug]/page.tsx`, `components/portfolio/*`
- **Est. Time**: 3 hours

### Task 2.4: Portfolio List Page Enhancement
- [ ] Add filter by category
  - All
  - WordPress
  - Full-Stack
  - Optimization
  - Consulting
- [ ] Add sort options
  - Featured first
  - Date (newest)
  - Date (oldest)
- [ ] Grid layout improvements
- [ ] Empty state handling
- [ ] Loading states
- **Files**: `app/[locale]/portfolio/page.tsx`
- **Est. Time**: 1.5 hours

### Task 2.5: Project Form Enhancement (Admin)
- [ ] Add new fields to project form:
  - Challenge textarea
  - Solution textarea
  - Results JSON editor (or structured fields)
  - Client name
  - Testimonial textarea
  - GitHub URL
  - Featured toggle
- [ ] Update API endpoints
- [ ] Update admin UI
- [ ] Translations
- **Files**: `components/admin/ProjectForm.tsx`, `app/api/admin/portfolio/*`
- **Est. Time**: 2 hours

## Phase 3: Services/Pricing Page ⏳

### Task 3.1: Services Page Structure
- [ ] Create new services page route
- [ ] Page header with title and subtitle
- [ ] Navigation from homepage
- **Files**: `app/[locale]/services/page.tsx` (update existing or create new layout)
- **Est. Time**: 30 mins

### Task 3.2: Service Packages Section
- [ ] Define service packages:
  1. **WordPress Optimization Package**
     - Site audit
     - Performance optimization
     - Caching setup
     - CDN integration
     - Price: Fixed or range
  2. **WordPress Consulting**
     - Hourly rate
     - Monthly retainer
     - Technical advice
     - Code review
  3. **Full-Stack Development**
     - Custom web apps
     - API development
     - Database design
     - Project-based pricing
  4. **Performance Audit**
     - Comprehensive audit
     - Recommendations report
     - Implementation roadmap
     - Fixed price
- [ ] Package card design with shadcn Card
- [ ] "Book This Service" CTA buttons
- [ ] Translations (en, tr, pt-BR)
- **Files**: `app/[locale]/services/page.tsx`, `messages/*.json`
- **Est. Time**: 2 hours

### Task 3.3: Custom Project Inquiry Section
- [ ] Create project inquiry form
- [ ] Fields:
  - Name
  - Email
  - Company (optional)
  - Project type (select)
  - Budget range (select)
  - Project description (textarea)
  - Timeline expectations
- [ ] Form validation
- [ ] API endpoint for submission
- [ ] Email notification
- [ ] Success/error handling
- [ ] Translations
- **Files**: `components/services/ProjectInquiryForm.tsx`, `app/api/inquiry/route.ts`
- **Est. Time**: 2 hours

### Task 3.4: Process/How I Work Section
- [ ] Create process explanation component
- [ ] Steps:
  1. Discovery & Planning
  2. Development/Implementation
  3. Testing & Review
  4. Launch & Support
- [ ] Timeline estimates
- [ ] Deliverables list
- [ ] Communication approach
- [ ] Visual timeline/steps design
- [ ] Translations (en, tr, pt-BR)
- **Files**: `components/services/ProcessSection.tsx`, `messages/*.json`
- **Est. Time**: 1.5 hours

### Task 3.5: FAQ Section (Optional)
- [ ] Common questions about services
- [ ] shadcn Accordion component
- [ ] Questions:
  - What's included in optimization?
  - How long does a project take?
  - Do you offer ongoing support?
  - What technologies do you use?
  - Can you work with my existing team?
- [ ] Translations (en, tr, pt-BR)
- **Files**: `components/services/FAQSection.tsx`, `messages/*.json`
- **Est. Time**: 1 hour

## Phase 4: Polish & Optimization ⏳

### Task 4.1: Performance Optimization
- [ ] Image optimization (all new images)
- [ ] Lazy loading for portfolio images
- [ ] Code splitting for new components
- [ ] Bundle size check
- [ ] Lighthouse audit (target: 95+)
- [ ] Core Web Vitals check
- **Est. Time**: 1.5 hours

### Task 4.2: SEO Updates
- [ ] Update metadata
  - Title: "Ege Dulundu - WordPress Expert & Full-Stack Developer"
  - Description: Include key services
- [ ] Add schema.org markup:
  - Person schema for Ege
  - Service schema for offerings
- [ ] Update Open Graph tags
- [ ] Add structured data for portfolio items
- [ ] Test with Google Rich Results
- **Files**: `app/layout.tsx`, `app/[locale]/*/page.tsx`
- **Est. Time**: 1 hour

### Task 4.3: Visual Polish
- [ ] Typography consistency check
- [ ] Spacing/padding review
- [ ] Color contrast validation
- [ ] Animation polish (if any)
- [ ] Dark mode verification
- [ ] Icon consistency
- **Est. Time**: 1 hour

### Task 4.4: Mobile Testing
- [ ] Test all new sections on mobile
- [ ] Touch interaction verification
- [ ] Horizontal scroll UX
- [ ] Form usability on small screens
- [ ] Image sizes on mobile
- **Est. Time**: 1 hour

### Task 4.5: Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Android)
- **Est. Time**: 45 mins

### Task 4.6: Translation Verification
- [ ] Review English content
- [ ] Review Turkish content
- [ ] Review Portuguese content
- [ ] Check for missing translations
- [ ] Verify context makes sense
- **Est. Time**: 45 mins

## Phase 5: Blog SEO & Conversion Optimization ⏳

### Task 5.1: Author Branding & Schema
- [ ] Add author schema markup (Ege Dulundu)
- [ ] Author bio component for blog posts
- [ ] Profile photo/avatar
- [ ] Links to portfolio and services
- [ ] Social media links
- [ ] "Written by Ege Dulundu" byline
- [ ] Translations (en, tr, pt-BR)
- **Files**: `components/blog/AuthorBio.tsx`, `app/[locale]/blog/[slug]/page.tsx`
- **Est. Time**: 1.5 hours

### Task 5.2: Article SEO Enhancement
- [ ] Add Article structured data (schema.org)
- [ ] Optimize meta descriptions (dynamic from excerpt)
- [ ] Add Open Graph images
- [ ] Add reading time estimate
- [ ] Canonical URLs
- [ ] Keywords/tags support (optional)
- [ ] Breadcrumb navigation
- **Files**: `app/[locale]/blog/[slug]/page.tsx`, `components/blog/BlogPost.tsx`
- **Est. Time**: 2 hours

### Task 5.3: Related Posts & Internal Linking
- [ ] Create related posts algorithm (same category or tags)
- [ ] Related posts component (3-4 posts)
- [ ] Display at bottom of blog posts
- [ ] "You might also like" section
- [ ] Internal linking to portfolio projects (if related)
- [ ] Translations
- **Files**: `components/blog/RelatedPosts.tsx`, `app/[locale]/blog/[slug]/page.tsx`
- **Est. Time**: 1.5 hours

### Task 5.4: In-Post CTAs & Conversion
- [ ] Create CTA components:
  - "Need help with this?" → Services
  - "See this in action" → Portfolio
  - "Book a consultation" → Contact
- [ ] Inline CTA placement strategy
- [ ] Bottom-of-post CTA (primary conversion)
- [ ] "What's next?" section
- [ ] Service recommendation based on post topic
- [ ] Translations (en, tr, pt-BR)
- **Files**: `components/blog/BlogCTA.tsx`, `components/blog/ServiceRecommendation.tsx`
- **Est. Time**: 2 hours

### Task 5.5: Social Sharing & Engagement
- [ ] Social sharing buttons (Twitter, LinkedIn, Facebook)
- [ ] Copy link button
- [ ] Share count (optional)
- [ ] Email newsletter signup box
- [ ] "Subscribe to updates" CTA
- [ ] Social media follow buttons
- [ ] Translations
- **Files**: `components/blog/SocialShare.tsx`, `components/blog/NewsletterSignup.tsx`
- **Est. Time**: 1.5 hours

### Task 5.6: Blog List Page Enhancement
- [ ] Category filter/navigation
- [ ] Tag cloud or tag list
- [ ] Search functionality (optional)
- [ ] Featured posts section
- [ ] Author filter (future-proof for multi-author)
- [ ] Improved pagination
- [ ] Empty states
- [ ] Translations
- **Files**: `app/[locale]/blog/page.tsx`, `components/blog/*`
- **Est. Time**: 2 hours

### Task 5.7: Blog-Portfolio Integration
- [ ] Link blog posts to related portfolio projects
- [ ] Show related portfolio items in blog posts
- [ ] Create "Case Study" category for blog
- [ ] Sync portfolio case studies with blog
- [ ] Cross-linking strategy
- **Files**: `components/blog/RelatedProjects.tsx`, `prisma/schema.prisma` (optional relation)
- **Est. Time**: 1.5 hours

### Task 5.8: Performance & Analytics
- [ ] Image optimization for blog posts
- [ ] Lazy loading for blog images
- [ ] Table of contents for long posts (optional)
- [ ] Add analytics events:
  - Blog post views
  - Reading time tracking
  - CTA clicks
  - Social shares
- [ ] Monitor conversion rates
- **Files**: Various
- **Est. Time**: 1 hour

## Additional Tasks (Optional/Future) 🔮

### Task X.1: About Page (if needed)
- [ ] Detailed bio page
- [ ] Work history timeline
- [ ] Skills breakdown
- [ ] Certifications
- [ ] Personal interests (optional)
- **Est. Time**: 2 hours

### Task X.2: Social Proof Section
- [ ] Client testimonials slider
- [ ] Performance metrics counter
  - Sites optimized
  - Avg speed improvement
  - Happy clients
- [ ] Trust badges (if applicable)
- **Est. Time**: 1.5 hours

### Task X.3: Contact Page Enhancement
- [ ] Add booking calendar integration (Calendly/Cal.com)
- [ ] Service selection in contact form
- [ ] Estimated response time
- **Est. Time**: 2 hours

## Summary

### Phase Breakdown
- **Phase 1 (Homepage)**: ~5.5 hours
- **Phase 2 (Portfolio)**: ~8 hours
- **Phase 3 (Services)**: ~7 hours
- **Phase 4 (Polish)**: ~6 hours
- **Phase 5 (Blog SEO & Conversion)**: ~13 hours
- **Total Estimated Time**: ~39.5 hours

### Files Created (New)
- `components/home/BioSection.tsx`
- `components/home/SkillsSection.tsx`
- `components/home/FeaturedProjects.tsx`
- `components/home/ServicesOverview.tsx`
- `components/services/ProjectInquiryForm.tsx`
- `components/services/ProcessSection.tsx`
- `components/services/FAQSection.tsx`
- `components/blog/AuthorBio.tsx`
- `components/blog/RelatedPosts.tsx`
- `components/blog/BlogCTA.tsx`
- `components/blog/ServiceRecommendation.tsx`
- `components/blog/SocialShare.tsx`
- `components/blog/NewsletterSignup.tsx`
- `components/blog/RelatedProjects.tsx`
- `app/api/inquiry/route.ts`

### Files Modified
- `app/[locale]/page.tsx`
- `app/[locale]/services/page.tsx`
- `app/[locale]/portfolio/page.tsx`
- `app/[locale]/portfolio/[slug]/page.tsx`
- `app/[locale]/blog/page.tsx`
- `app/[locale]/blog/[slug]/page.tsx`
- `components/portfolio/ProjectCard.tsx`
- `components/blog/BlogCard.tsx`
- `components/admin/ProjectForm.tsx`
- `prisma/schema.prisma`
- `messages/en.json`
- `messages/tr.json`
- `messages/pt-BR.json`
- `app/layout.tsx`

### Priority Order
1. **Phase 1** - Immediate impact, establishes personal brand
2. **Phase 2** - Shows technical depth, converts visitors
3. **Phase 3** - Enables client acquisition
4. **Phase 4** - Professional finish
5. **Phase 5** - SEO/traffic engine, ongoing content strategy

---
**Feature Status**: PLANNING
**Last Updated**: 2025-11-13
**Feature ID**: 016-portfolio-first-redesign
