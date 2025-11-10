# Architectural Decisions

## Decision Log

### **AD-001**: Multi-Language Architecture (2025-11-09)
- **Status**: Implemented
- **Context**: Site needs to support 3 languages (TR, EN, PT-BR) with dynamic content
- **Decision**: Use next-intl with separate translation tables in database (ProductTranslation, PostTranslation, ProjectTranslation)
- **Consequences**:
  - ✅ Clean separation of translatable content
  - ✅ Easy to add new languages
  - ⚠️ Requires translation tables for all dynamic content models

### **AD-002**: Next.js 14 App Router (2025-11-09)
- **Status**: Implemented
- **Context**: Need modern React framework with SSR/SSG capabilities
- **Decision**: Use Next.js 14 with App Router (not Pages Router)
- **Consequences**:
  - ✅ Server Components by default
  - ✅ Better performance
  - ✅ Simplified routing with [locale] dynamic routes
  - ⚠️ Newer API, some packages may not be fully compatible

### **AD-003**: Authentication - NextAuth.js v5 (2025-11-09)
- **Status**: Implemented
- **Context**: Need secure authentication for admin panel
- **Decision**: Use NextAuth.js v5 (beta) with Credentials provider + Prisma adapter
- **Consequences**:
  - ✅ Industry-standard auth solution
  - ✅ JWT session strategy
  - ✅ Role-based access control (user/admin)
  - ⚠️ v5 is in beta, removed PrismaAdapter due to compatibility issues

### **AD-004**: Database ORM - Prisma (2025-11-09)
- **Status**: Implemented
- **Context**: Need type-safe database access with PostgreSQL
- **Decision**: Use Prisma ORM with 11 models (User, Product, Post, Project, Order, etc.)
- **Consequences**:
  - ✅ Type-safe queries
  - ✅ Automatic migrations
  - ✅ Great DX with Prisma Studio
  - ✅ Protection against SQL injection

### **AD-005**: Payment Processing - Stripe (2025-11-09)
- **Status**: Implemented (90%)
- **Context**: Need secure payment processing for digital products
- **Decision**: Use Stripe Checkout with webhook integration
- **Consequences**:
  - ✅ PCI compliance handled by Stripe
  - ✅ Multiple currency support
  - ✅ Webhook for order status updates
  - ⏳ Frontend checkout flow pending completion

### **AD-006**: Rich Text Editor - TipTap (2025-11-09)
- **Status**: Implemented
- **Context**: Blog posts need rich text formatting
- **Decision**: Use TipTap editor (not Quill or Draft.js)
- **Consequences**:
  - ✅ Modern, extensible editor
  - ✅ Good React integration
  - ✅ Toolbar with common formatting options
  - ✅ Clean HTML output

### **AD-007**: Form Pattern - Multi-Language Tabs (2025-11-09)
- **Status**: Implemented
- **Context**: Admin forms need to support 3 languages efficiently
- **Decision**: Use tab-based UI with flag emojis for language switching
- **Consequences**:
  - ✅ Clean UX for multi-language content
  - ✅ Consistent across ProductForm and BlogForm
  - ✅ Easy to validate required fields per language
  - ✅ Auto-slug generation from English title

### **AD-008**: API Route Protection (2025-11-09)
- **Status**: Implemented
- **Context**: Admin API routes need authentication
- **Decision**: Use requireAdmin() and requireAuth() helper functions
- **Consequences**:
  - ✅ Centralized auth logic
  - ✅ Easy to apply to all admin routes
  - ✅ Consistent error responses
  - ✅ Role-based access control

### **AD-009**: SpecPulse Integration (2025-11-09)
- **Status**: Implemented
- **Context**: Need systematic approach to feature development and progress tracking
- **Decision**: Use SpecPulse v2.6.0 with Specification-Driven Development
- **Consequences**:
  - ✅ Clear feature specifications
  - ✅ Task breakdown and tracking
  - ✅ Session continuity across breaks
  - ✅ Documented progress and decisions
  - ✅ Faster implementation (Product CRUD: 1h vs estimated 2.5h)

### **AD-010**: Dynamic Rendering for Database Queries (2025-11-09)
- **Status**: Implemented
- **Context**: Build failing with database queries in page components
- **Decision**: Add `export const dynamic = 'force-dynamic'` to pages with DB queries
- **Consequences**:
  - ✅ Prevents build-time database access errors
  - ✅ Ensures fresh data on each request
  - ⚠️ Slightly slower page loads (no static generation)
  - ✅ Necessary for admin panel pages

## Future Decisions to Make

### **FD-001**: Image Upload Strategy
- **Context**: Currently using URL-based images
- **Options**:
  1. Upload to Vercel Blob Storage
  2. Use Cloudinary
  3. AWS S3
  4. Keep URL-based
- **Status**: Pending

### **FD-002**: Email Service Provider
- **Context**: Need email for contact form and order confirmations
- **Options**:
  1. Resend (modern, developer-friendly)
  2. SendGrid (established, more features)
  3. AWS SES (cheaper for high volume)
- **Status**: Pending

---
*Last updated: 2025-11-09 (Session 2)*
*This file is maintained by SpecPulse and Claude Code*
