# Blog System Specification

> **Feature:** Blog System
> **Status:** Planning
> **Priority:** High
> **Created:** 2025-11-09

---

## Overview

Multi-language blog system for dulundu.dev with admin management and public-facing blog pages.

## Goals

- ✅ Enable content marketing through blog posts
- ✅ Support 3 languages (TR, EN, PT-BR)
- ✅ SEO optimization for blog content
- ✅ Easy-to-use admin interface
- ✅ Rich text editing capabilities

## Requirements

### Functional Requirements

1. **Admin CRUD Operations**
   - Create new blog posts
   - Edit existing posts
   - Delete posts
   - Multi-language content management (TR, EN, PT-BR)
   - Draft/Published status toggle
   - Featured post designation

2. **Rich Text Editor**
   - TipTap integration
   - Basic formatting (bold, italic, headings)
   - Lists (ordered, unordered)
   - Links and images
   - Code blocks (for technical content)

3. **Public Blog Pages**
   - Blog listing page (paginated)
   - Individual blog post page
   - SEO-friendly URLs (slug-based)
   - Multi-language routing

4. **SEO Features**
   - Custom meta titles & descriptions
   - Open Graph tags
   - Canonical URLs
   - Sitemap integration

### Non-Functional Requirements

- **Performance:** Blog listing loads in < 1s
- **Accessibility:** WCAG 2.1 AA compliant
- **Responsive:** Works on mobile, tablet, desktop
- **SEO:** Google-indexable content

## Database Schema

**Uses existing Prisma models:**

```prisma
model Post {
  id          String   @id @default(cuid())
  slug        String   @unique
  status      String   @default("draft")
  publishedAt DateTime?
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  translations PostTranslation[]
}

model PostTranslation {
  id        String  @id @default(cuid())
  postId    String
  locale    String  // en, tr, pt-BR
  title     String
  excerpt   String  @db.Text
  content   String  @db.Text
  coverImage String?

  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([postId, locale])
}
```

## API Endpoints

### Admin API

- `POST /api/admin/blog` - Create new post
- `PUT /api/admin/blog/[id]` - Update post
- `DELETE /api/admin/blog/[id]` - Delete post
- `GET /api/admin/blog` - List all posts (admin view)
- `GET /api/admin/blog/[id]` - Get single post (admin view)

### Public API

- `GET /api/blog` - List published posts (public, paginated)
- `GET /api/blog/[slug]` - Get single published post

## File Structure

```
app/
├── [locale]/
│   ├── admin/
│   │   └── blog/
│   │       ├── page.tsx           # Blog list (admin)
│   │       ├── new/
│   │       │   └── page.tsx       # Create new post
│   │       └── [id]/
│   │           └── page.tsx       # Edit post
│   └── blog/
│       ├── page.tsx               # Blog list (public)
│       └── [slug]/
│           └── page.tsx           # Blog post detail
└── api/
    └── admin/
        └── blog/
            ├── route.ts           # POST (create)
            └── [id]/
                └── route.ts       # GET, PUT, DELETE

components/
├── admin/
│   ├── BlogForm.tsx              # Blog create/edit form
│   ├── BlogList.tsx              # Admin blog list
│   └── RichTextEditor.tsx        # TipTap wrapper
└── blog/
    ├── BlogCard.tsx              # Blog post card (public)
    ├── BlogList.tsx              # Public blog list
    └── BlogPost.tsx              # Full blog post view
```

## UI Components

### BlogForm (Admin)

Multi-tab form with:
- Tab per language (TR, EN, PT-BR)
- Fields per language:
  - Title (input)
  - Excerpt (textarea, 160 chars)
  - Content (rich text editor)
  - Cover image (file upload - optional)
- Global fields:
  - Slug (auto-generated from title, editable)
  - Status (draft/published)
  - Featured (checkbox)
  - Publish date (datetime picker)

### RichTextEditor

TipTap-based editor with toolbar:
- Headings (H2, H3, H4)
- Bold, Italic, Underline
- Ordered/Unordered lists
- Links
- Code blocks
- Image insertion

### BlogCard (Public)

Display:
- Cover image (if available)
- Title
- Excerpt
- Publish date
- Read time estimate
- "Read More" link

## Dependencies

New packages needed:

```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "@tiptap/extension-link": "^2.x",
  "date-fns": "^3.x" // for date formatting
}
```

## Implementation Plan

### Phase 1: Backend (2-3 hours)

1. ✅ Database models (already exist)
2. Create API routes
   - Admin blog API (CRUD)
   - Public blog API (read-only)
3. Add validation (zod schemas)

### Phase 2: Admin UI (3-4 hours)

1. Install TipTap
2. Create RichTextEditor component
3. Create BlogForm component
4. Create admin blog list page
5. Create new/edit pages
6. Wire up API calls

### Phase 3: Public UI (2-3 hours)

1. Create BlogCard component
2. Create blog listing page
3. Create blog detail page
4. Add pagination
5. Add SEO metadata

### Phase 4: Polish & Testing (1-2 hours)

1. Add loading states
2. Error handling
3. Responsive design check
4. SEO validation
5. Test all 3 languages
6. Cross-browser testing

**Total estimated time: 8-12 hours**

## Acceptance Criteria

- [ ] Admin can create blog posts in 3 languages
- [ ] Rich text editor supports all required formatting
- [ ] Posts can be drafted and published
- [ ] Public blog listing shows published posts only
- [ ] Individual blog posts are accessible via slug
- [ ] SEO metadata is properly set
- [ ] All pages are responsive
- [ ] Multi-language routing works correctly
- [ ] Performance meets requirements (< 1s load)

## Testing Strategy

### Unit Tests
- BlogForm validation
- API route handlers
- RichTextEditor component

### Integration Tests
- Create → Edit → Publish workflow
- Multi-language content management
- Public blog access

### E2E Tests
- Full blog creation flow
- Public blog browsing
- SEO metadata verification

## SEO Considerations

1. **URL Structure**
   - `/blog` - Blog listing
   - `/blog/my-post-slug` - Individual posts
   - Language prefix: `/tr/blog`, `/en/blog`, `/pt-BR/blog`

2. **Metadata**
   - Page title: `{post.title} | Dulundu.dev`
   - Meta description: `{post.excerpt}`
   - OG image: `{post.coverImage}`

3. **Sitemap**
   - Add blog posts to sitemap.xml
   - Update on post publish/unpublish

## Security Considerations

- [ ] Authentication check on admin routes
- [ ] Input sanitization (XSS prevention)
- [ ] CSRF protection
- [ ] Rate limiting on API routes
- [ ] Image upload validation

## Future Enhancements (v2)

- Categories/Tags
- Comments system
- Related posts
- Reading time calculation
- Social sharing buttons
- Newsletter integration
- Search functionality
- RSS feed

---

**Next Steps:**
1. Review and approve spec
2. Create implementation plan with `/sp-plan blog-system`
3. Break down into tasks with `/sp-task blog-system`
4. Execute with `/sp-execute blog-system`
