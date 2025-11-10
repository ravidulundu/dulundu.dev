# Blog System Implementation Plan

> **Feature:** Blog System
> **Spec:** `.specpulse/specs/blog-system-example.md`
> **Status:** Ready for Implementation
> **Estimated Time:** 8-10 hours

---

## Implementation Phases

### Phase 1: Dependencies & Setup (15 min)

**Install Required Packages:**
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image date-fns
```

**Files to Create:**
- None (dependencies only)

---

### Phase 2: Rich Text Editor Component (1 hour)

**Create RichTextEditor Component:**

**File:** `components/admin/RichTextEditor.tsx`

**Features:**
- TipTap integration
- Toolbar with formatting options
- Headings (H2, H3, H4)
- Bold, Italic, Underline
- Lists (ordered, unordered)
- Links
- Code blocks
- Image insertion (optional for MVP)

**Dependencies:**
- @tiptap/react
- @tiptap/starter-kit
- @tiptap/extension-link

---

### Phase 3: Admin Blog API Routes (1.5 hours)

**Create API Endpoints:**

**File:** `app/api/admin/blog/route.ts`
- `POST` - Create new blog post
- `GET` - List all posts (admin view, includes drafts)

**File:** `app/api/admin/blog/[id]/route.ts`
- `GET` - Get single post for editing
- `PUT` - Update existing post
- `DELETE` - Delete post

**Validation:**
- Input validation with Zod
- Multi-language field validation
- Slug uniqueness check
- Auth middleware (requireAdmin)

**Database Operations:**
- Create Post + PostTranslation records
- Update with transaction support
- Delete with cascade (translations)
- Proper error handling

---

### Phase 4: BlogForm Component (2 hours)

**Create Multi-Language Form:**

**File:** `components/admin/BlogForm.tsx`

**Features:**
- Tab-based interface (TR, EN, PT-BR)
- Per-language fields:
  - Title (input)
  - Excerpt (textarea, max 160 chars)
  - Content (RichTextEditor)
  - Cover Image URL (input) - optional
- Global fields:
  - Slug (auto-generated, editable)
  - Status (draft/published dropdown)
  - Featured (checkbox)
  - Publish Date (datetime-local input)
- Form validation
- Loading states
- Error handling
- Success notifications

**Form State Management:**
- React useState for form data
- Slug auto-generation from first language title
- Draft auto-save (optional for MVP)

---

### Phase 5: Admin Blog List Page (1 hour)

**Create Admin Blog Management Page:**

**File:** `app/[locale]/admin/blog/page.tsx`

**Features:**
- Table view of all blog posts
- Columns:
  - Title (from default locale)
  - Status (draft/published badge)
  - Featured (icon)
  - Publish Date
  - Actions (Edit, Delete)
- "Create New Post" button
- Filter by status (optional)
- Search by title (optional)
- Pagination (optional for MVP)

**Data Fetching:**
- Server Component
- Prisma query with translations
- Order by createdAt DESC

---

### Phase 6: Admin Create/Edit Pages (1 hour)

**File:** `app/[locale]/admin/blog/new/page.tsx`
- Create new blog post
- Empty form with BlogForm component
- Handle form submission
- Redirect to list on success

**File:** `app/[locale]/admin/blog/[id]/page.tsx`
- Edit existing blog post
- Pre-populate BlogForm with existing data
- Fetch post data on server
- Handle update submission
- Redirect to list on success

**API Integration:**
- POST to `/api/admin/blog` (create)
- PUT to `/api/admin/blog/[id]` (update)
- DELETE confirmation modal

---

### Phase 7: Public Blog API (30 min)

**Create Public Endpoints:**

**File:** `app/api/blog/route.ts`
- `GET` - List published posts only
- Pagination support
- Locale filtering

**File:** `app/api/blog/[slug]/route.ts`
- `GET` - Get single published post by slug
- Locale parameter
- 404 if not found or not published

---

### Phase 8: Public Blog Components (1.5 hours)

**Create BlogCard Component:**

**File:** `components/blog/BlogCard.tsx`
- Display cover image (if available)
- Title
- Excerpt
- Publish date (formatted with date-fns)
- "Read More" link
- Responsive design

**Create BlogPost Component:**

**File:** `components/blog/BlogPost.tsx`
- Full blog post display
- Cover image
- Title
- Publish date
- Content (rendered HTML from TipTap)
- Responsive typography
- Code block syntax highlighting (optional)

---

### Phase 9: Public Blog Pages (1 hour)

**File:** `app/[locale]/blog/page.tsx`
- Blog listing page
- Grid/List of BlogCard components
- Pagination (if needed)
- SEO metadata
- Multi-language support

**File:** `app/[locale]/blog/[slug]/page.tsx`
- Individual blog post page
- BlogPost component
- Dynamic metadata generation
- Breadcrumbs (optional)
- Related posts (optional for MVP)
- Social sharing buttons (optional)

**Metadata:**
```typescript
export async function generateMetadata({ params: { slug, locale } }) {
  const post = await getPost(slug, locale);
  return {
    title: `${post.title} | Dulundu.dev`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}
```

---

### Phase 10: i18n Messages (15 min)

**Update Translation Files:**

**File:** `messages/en.json`
```json
{
  "blog": {
    "title": "Blog",
    "readMore": "Read More",
    "publishedOn": "Published on",
    "admin": {
      "createPost": "Create New Post",
      "editPost": "Edit Post",
      "title": "Title",
      "excerpt": "Excerpt",
      "content": "Content",
      "coverImage": "Cover Image URL",
      "slug": "URL Slug",
      "status": "Status",
      "featured": "Featured",
      "publishDate": "Publish Date",
      "draft": "Draft",
      "published": "Published",
      "save": "Save Post",
      "delete": "Delete Post"
    }
  }
}
```

**File:** `messages/tr.json` - Turkish translations
**File:** `messages/pt-BR.json` - Portuguese translations

---

### Phase 11: Navigation Integration (15 min)

**Update Navbar:**

**File:** `components/layout/Navbar.tsx`
- Blog link already exists in nav
- Verify routing works

**Update Admin Sidebar:**

**File:** `components/admin/AdminSidebar.tsx`
- Blog link already exists
- Verify routing to /admin/blog

---

### Phase 12: Styling & Polish (1 hour)

**Styling Tasks:**
- BlogForm responsive design
- RichTextEditor styling
- BlogCard hover effects
- BlogPost typography
- Code block styling
- Mobile responsiveness
- Loading skeletons
- Error states

**Professional/Corporate Design:**
- Consistent color scheme (blue/purple gradient)
- Clean, minimal UI
- Good spacing and typography
- Accessible form labels
- Focus states

---

### Phase 13: Testing & Validation (1 hour)

**Test Scenarios:**
- [ ] Create blog post in all 3 languages
- [ ] Edit existing blog post
- [ ] Delete blog post
- [ ] Publish/Unpublish toggle
- [ ] Featured toggle
- [ ] Public blog listing shows published only
- [ ] Blog detail page renders correctly
- [ ] Multi-language routing works
- [ ] SEO metadata correct
- [ ] Responsive on mobile
- [ ] Rich text editor all features work
- [ ] Form validation works
- [ ] Error handling works

---

## File Structure Summary

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
    ├── admin/
    │   └── blog/
    │       ├── route.ts           # POST, GET
    │       └── [id]/
    │           └── route.ts       # GET, PUT, DELETE
    └── blog/
        ├── route.ts               # GET (public list)
        └── [slug]/
            └── route.ts           # GET (public detail)

components/
├── admin/
│   ├── BlogForm.tsx              # Blog create/edit form
│   ├── BlogList.tsx              # Admin blog list (optional)
│   └── RichTextEditor.tsx        # TipTap wrapper
└── blog/
    ├── BlogCard.tsx              # Blog post card (public)
    └── BlogPost.tsx              # Full blog post view

messages/
├── en.json                       # + blog translations
├── tr.json                       # + blog translations
└── pt-BR.json                    # + blog translations
```

---

## Dependencies

```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-link": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "date-fns": "^3.x"
}
```

---

## Total Estimated Time: 8-10 hours

**Breakdown:**
- Setup & Dependencies: 15 min
- RichTextEditor: 1 hour
- Admin API: 1.5 hours
- BlogForm: 2 hours
- Admin Pages: 2 hours
- Public API: 30 min
- Public Components: 1.5 hours
- Public Pages: 1 hour
- i18n: 15 min
- Navigation: 15 min
- Styling: 1 hour
- Testing: 1 hour

---

## Success Criteria

- [x] Admin can create/edit/delete blog posts
- [x] Multi-language content support (TR, EN, PT-BR)
- [x] Rich text editor functional
- [x] Public blog listing shows published posts
- [x] Individual blog posts accessible
- [x] SEO metadata properly set
- [x] Responsive design
- [x] Professional styling
- [x] All tests pass

---

**Ready for execution with `/sp-task` and `/sp-execute`**
