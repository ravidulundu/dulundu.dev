# Troubleshooting Guide

> 🔧 Solutions to common problems encountered during development

---

## 🚨 Critical Issues

### Issue: Database Connection Failed
**Error**:
```
PrismaClientInitializationError: Can't reach database server
```

**Causes & Solutions**:

1. **DATABASE_URL not set**
   ```bash
   # Check .env.local exists
   ls -la .env.local

   # Add DATABASE_URL
   echo 'DATABASE_URL="postgresql://user:pass@localhost:5432/dulundu_dev"' >> .env.local
   ```

2. **PostgreSQL not running**
   ```bash
   # Linux/Mac
   sudo systemctl status postgresql
   sudo systemctl start postgresql

   # Docker
   docker ps | grep postgres
   docker start postgres-container
   ```

3. **Wrong connection string**
   ```bash
   # Test connection
   psql "postgresql://user:pass@localhost:5432/dulundu_dev"

   # If fails, check:
   # - Username/password correct?
   # - Database exists?
   # - Port 5432 accessible?
   ```

---

### Issue: NextAuth Session Not Working
**Error**:
```
[auth][error] session error null
```

**Solutions**:

1. **NEXTAUTH_SECRET not set**
   ```bash
   # Generate secret
   openssl rand -base64 32

   # Add to .env.local
   echo 'NEXTAUTH_SECRET="<generated-secret>"' >> .env.local
   ```

2. **NEXTAUTH_URL incorrect**
   ```bash
   # Development
   NEXTAUTH_URL="http://localhost:3000"

   # Production
   NEXTAUTH_URL="https://yourdomain.com"
   ```

3. **Restart dev server**
   ```bash
   # .env changes require restart
   # Ctrl+C then:
   npm run dev
   ```

---

### Issue: Stripe Webhook Failing
**Error**:
```
Webhook signature verification failed
```

**Solutions**:

1. **Wrong webhook secret**
   ```bash
   # Get from Stripe Dashboard > Webhooks
   # Add to .env.local
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

2. **Using test mode secret in production**
   ```bash
   # Test mode: whsec_test_...
   # Production: whsec_...
   # Make sure they match your Stripe mode
   ```

3. **Test with Stripe CLI**
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe

   # Login
   stripe login

   # Forward webhooks
   stripe listen --forward-to localhost:3000/api/webhooks/stripe

   # Get webhook secret from output
   # Copy to STRIPE_WEBHOOK_SECRET
   ```

---

## ⚠️ Build Errors

### Issue: Build Fails with DATABASE_URL
**Error**:
```
Error: Environment variable DATABASE_URL not found
```

**Solution**:
```typescript
// This is EXPECTED behavior!
// Database queries run at build time need DATABASE_URL

// Two options:

// 1. Provide DATABASE_URL for build (recommended for production)
DATABASE_URL="..." npm run build

// 2. Use dynamic rendering (already done in all DB pages)
export const dynamic = 'force-dynamic';
```

**Status**: ✅ Not a bug, working as designed

---

### Issue: TypeScript Type Errors
**Error**:
```
Property 'translations' does not exist on type 'Post'
```

**Solutions**:

1. **Regenerate Prisma client**
   ```bash
   # After schema changes
   npx prisma generate

   # Restart TS server in VSCode
   # Cmd+Shift+P > TypeScript: Restart TS Server
   ```

2. **Check Prisma schema**
   ```prisma
   # Make sure relation exists
   model Post {
     id String @id @default(cuid())
     translations PostTranslation[]
   }
   ```

3. **Include in query**
   ```typescript
   // Wrong
   const post = await db.post.findUnique({ where: { id } });
   post.translations // undefined

   // Correct
   const post = await db.post.findUnique({
     where: { id },
     include: { translations: true }
   });
   ```

---

### Issue: Module Not Found
**Error**:
```
Module not found: Can't resolve '@/components/...'
```

**Solutions**:

1. **Check tsconfig.json paths**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

2. **File actually exists?**
   ```bash
   ls -la components/ui/Button.tsx
   ```

3. **Restart dev server**
   ```bash
   # Sometimes hot reload fails
   npm run dev
   ```

---

## 🐛 Runtime Errors

### Issue: 401 Unauthorized on Admin Routes
**Error**:
```
{"error": "Unauthorized"}
```

**Solutions**:

1. **Not logged in**
   ```
   1. Go to /api/auth/signin
   2. Login with admin credentials
   3. Try again
   ```

2. **Session expired**
   ```
   1. Clear cookies
   2. Login again
   ```

3. **User not admin**
   ```sql
   -- Check user role in database
   SELECT email, role FROM "User" WHERE email = 'your@email.com';

   -- Update to admin
   UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
   ```

4. **requireAdmin() failing**
   ```typescript
   // Check lib/auth.ts implementation
   // Make sure session.user.role exists
   ```

---

### Issue: Translation Not Found
**Error**:
```
TypeError: Cannot read property 'title' of undefined
```

**Solutions**:

1. **Translation doesn't exist for locale**
   ```typescript
   // Wrong
   const title = post.translations[0].title;

   // Correct
   const translation = post.translations.find(t => t.locale === locale);
   const title = translation?.title || 'Untitled';
   ```

2. **Query doesn't include translations**
   ```typescript
   // Add include
   const post = await db.post.findUnique({
     where: { slug },
     include: { translations: true }
   });
   ```

3. **Create missing translation**
   ```typescript
   // In admin panel, ensure all languages have content
   // Or add fallback logic
   const translation = post.translations.find(t => t.locale === locale)
     || post.translations.find(t => t.locale === 'en')
     || post.translations[0];
   ```

---

### Issue: Image Not Loading
**Error**:
```
Unhandled Runtime Error
Error: Invalid src prop on `next/image`
```

**Solutions**:

1. **External domain not allowed**
   ```javascript
   // Add to next.config.js
   module.exports = {
     images: {
       domains: ['example.com', 'images.unsplash.com'],
     },
   };
   ```

2. **Invalid URL**
   ```typescript
   // Validate before using
   const isValidUrl = (url: string) => {
     try {
       new URL(url);
       return true;
     } catch {
       return false;
     }
   };

   {isValidUrl(imageUrl) && (
     <Image src={imageUrl} alt="..." width={500} height={300} />
   )}
   ```

3. **Missing width/height**
   ```typescript
   // Always provide dimensions
   <Image src={src} alt={alt} width={500} height={300} />
   ```

---

## 🔄 Form Issues

### Issue: Form Not Submitting
**Symptoms**: Button click does nothing

**Solutions**:

1. **Missing onSubmit**
   ```typescript
   // Wrong
   <form>

   // Correct
   <form onSubmit={handleSubmit}>
   ```

2. **Prevent default not called**
   ```typescript
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault(); // ← Important!
     // ... form logic
   };
   ```

3. **Loading state blocking**
   ```typescript
   // Check if loading is stuck at true
   console.log('Loading:', loading);

   // Reset on error
   } catch (err) {
     setError(err.message);
     setLoading(false); // ← Don't forget!
   }
   ```

---

### Issue: Slug Already Exists
**Error**:
```
{"error": "A product with this slug already exists"}
```

**Solutions**:

1. **Change slug**
   ```
   Manual fix: Edit slug field before submitting
   ```

2. **Auto-increment slug**
   ```typescript
   // Future enhancement
   let slug = baseSlug;
   let counter = 1;
   while (await db.product.findUnique({ where: { slug } })) {
     slug = `${baseSlug}-${counter++}`;
   }
   ```

3. **Delete old product**
   ```
   Use admin panel to delete conflicting product
   ```

---

## 🎨 UI Issues

### Issue: Tailwind Styles Not Applied
**Symptoms**: Components look unstyled

**Solutions**:

1. **Tailwind not loaded**
   ```typescript
   // Check app/layout.tsx has:
   import '@/app/globals.css'
   ```

2. **Class name typo**
   ```typescript
   // Wrong
   className="bg-blu-500"

   // Correct
   className="bg-blue-500"
   ```

3. **Purge removed classes**
   ```javascript
   // Check tailwind.config.js
   module.exports = {
     content: [
       './app/**/*.{js,ts,jsx,tsx}',
       './components/**/*.{js,ts,jsx,tsx}',
     ],
   };
   ```

4. **Restart dev server**
   ```bash
   # Tailwind config changes need restart
   npm run dev
   ```

---

### Issue: Language Switcher Not Working
**Symptoms**: Clicking language doesn't change locale

**Solutions**:

1. **Check middleware**
   ```typescript
   // middleware.ts should exist
   export { default } from "next-intl/middleware";
   ```

2. **Routing correct?**
   ```typescript
   // Should navigate to /[locale]/...
   router.push(`/${newLocale}/${currentPath}`);
   ```

3. **Messages files exist?**
   ```bash
   ls -la messages/
   # Should have: en.json, tr.json, pt-BR.json
   ```

---

## 📦 Dependency Issues

### Issue: Package Version Conflict
**Error**:
```
ERESOLVE unable to resolve dependency tree
```

**Solutions**:

1. **Check package.json**
   ```bash
   # Look for conflicting versions
   npm list <package-name>
   ```

2. **Force install**
   ```bash
   npm install --force
   # or
   npm install --legacy-peer-deps
   ```

3. **Clean install**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

### Issue: NextAuth v5 + Prisma Adapter
**Error**:
```
PrismaAdapter is not compatible with NextAuth v5
```

**Status**: ✅ Known issue, already handled

**Solution**:
```typescript
// PrismaAdapter removed from auth.ts
// Using JWT session strategy instead
// No action needed
```

---

## 🔍 Debugging Tips

### Enable Detailed Logging

```typescript
// Add to API routes for debugging
console.log('[DEBUG] Request:', {
  method: req.method,
  url: req.url,
  body: await req.json(),
});
```

### Check Prisma Queries

```bash
# Enable query logging
# Add to .env.local
DEBUG="prisma:query"

# Then run
npm run dev
```

### Inspect Database

```bash
# Open Prisma Studio
npx prisma studio

# Or use psql
psql $DATABASE_URL
```

### Network Requests

```
Browser DevTools > Network tab
- Check request payload
- Check response status/body
- Check headers
```

---

## 🆘 When All Else Fails

1. **Check SpecPulse docs**
   ```bash
   cat .specpulse/INDEX.md
   cat .specpulse/memory/notes/quick-reference.md
   ```

2. **Check recent changes**
   ```bash
   git diff
   git log --oneline -10
   ```

3. **Restore from checkpoint**
   ```bash
   cat .specpulse/checkpoints/checkpoint-*.md
   # Review last known good state
   ```

4. **Fresh start**
   ```bash
   # Nuclear option
   rm -rf node_modules .next
   npm install
   npx prisma generate
   npm run dev
   ```

5. **Ask for help**
   - Check error message carefully
   - Search docs/GitHub issues
   - Include full error stack trace

---

**Last Updated**: 2025-11-09 (Session 2)
**Maintained by**: Claude Code + SpecPulse
