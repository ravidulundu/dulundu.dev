# 🚀 Dokploy Deployment Guide

## Pre-requisites

- Dokploy installed on your server
- Domain name pointed to your server
- Git repository (GitHub/GitLab/Bitbucket)

---

## 📋 Step 1: Prepare Your Repository

Ensure these files are in your repository:
- [x] `Dockerfile`
- [x] `.dockerignore`
- [x] `docker-compose.yml`
- [x] `.env.example`
- [x] `prisma/schema.prisma`

---

## 📝 Step 2: Configure Environment Variables in Dokploy

In Dokploy dashboard, add these environment variables:

### Database
```bash
DATABASE_URL="postgresql://dulundu:YOUR_PASSWORD@db:5432/dulundu_prod"
POSTGRES_USER="dulundu"
POSTGRES_PASSWORD="YOUR_SECURE_PASSWORD"
POSTGRES_DB="dulundu_prod"
```

### NextAuth
```bash
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="YOUR_RANDOM_SECRET_KEY"
```

Generate secret:
```bash
openssl rand -base64 32
```

### Stripe
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_KEY"
STRIPE_SECRET_KEY="sk_live_YOUR_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET"
```

### Admin
```bash
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="YOUR_ADMIN_PASSWORD"
```

---

## 🐳 Step 3: Deploy with Dokploy

### Option A: Docker Compose (Recommended)

1. In Dokploy, create a new **Docker Compose** project
2. Select your Git repository
3. Dokploy will automatically detect `docker-compose.yml`
4. Add environment variables
5. Click **Deploy**

### Option B: Dockerfile Only

1. In Dokploy, create a new **Docker** project
2. Select your Git repository
3. Dokploy will use the `Dockerfile`
4. **Important:** You'll need to set up PostgreSQL separately
5. Update `DATABASE_URL` to point to your database
6. Click **Deploy**

---

## 🗄️ Step 4: Database Setup

After first deployment, run migrations:

### Method 1: Using Dokploy Terminal

1. Open Dokploy dashboard
2. Go to your app container
3. Open terminal
4. Run:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Create admin user
npx tsx prisma/seed.ts
```

### Method 2: Using Docker Exec

```bash
# Get container ID
docker ps | grep dulundu

# Execute commands
docker exec -it <container_id> npx prisma generate
docker exec -it <container_id> npx prisma db push
docker exec -it <container_id> npx tsx prisma/seed.ts
```

---

## 🔗 Step 5: Configure Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
4. Copy webhook secret
5. Update `STRIPE_WEBHOOK_SECRET` in Dokploy

---

## 🌐 Step 6: Configure Domain

1. In Dokploy, go to your project settings
2. Add your domain name
3. Enable SSL (Let's Encrypt)
4. Dokploy will automatically handle SSL certificates

---

## ✅ Step 7: Verify Deployment

Test these URLs:

```bash
# Homepage (should redirect to /en)
https://yourdomain.com

# English homepage
https://yourdomain.com/en

# Turkish homepage
https://yourdomain.com/tr

# Portuguese homepage
https://yourdomain.com/pt-BR

# Admin login
https://yourdomain.com/en/admin/dashboard

# Blog
https://yourdomain.com/en/blog

# Products
https://yourdomain.com/en/products

# Portfolio
https://yourdomain.com/en/portfolio

# Services
https://yourdomain.com/en/services

# Contact
https://yourdomain.com/en/contact
```

---

## 🔄 Re-deployment

Dokploy can auto-deploy on git push:

1. Go to project settings
2. Enable "Auto Deploy on Push"
3. Configure webhook in your Git repository
4. Every push to main/master will trigger deployment

---

## 🐛 Troubleshooting

### Database Connection Error

Check if database is running:
```bash
docker ps | grep postgres
```

Check DATABASE_URL format:
```
postgresql://user:password@host:port/database
```

### Build Fails

1. Check Docker logs in Dokploy
2. Verify all dependencies in `package.json`
3. Ensure Prisma schema is correct

### 404 on all pages

1. Verify build completed successfully
2. Check if `.next` folder was created
3. Ensure `next.config.js` has `output: 'standalone'`

### Stripe webhook not working

1. Verify webhook URL is correct
2. Check if STRIPE_WEBHOOK_SECRET matches
3. Test webhook from Stripe dashboard

---

## 📊 Monitoring

### Check Logs

In Dokploy dashboard:
1. Go to your project
2. Click "Logs"
3. View real-time logs

### Database Backup

```bash
# Backup
docker exec -it <postgres_container> pg_dump -U dulundu dulundu_prod > backup.sql

# Restore
docker exec -i <postgres_container> psql -U dulundu dulundu_prod < backup.sql
```

---

## 🔒 Security Checklist

- [ ] Changed default admin password
- [ ] Using strong NEXTAUTH_SECRET
- [ ] Using live Stripe keys (not test)
- [ ] SSL enabled
- [ ] Database password is strong
- [ ] Environment variables are secure
- [ ] Webhook secret is configured

---

## 📈 Performance Tips

### Enable Caching

Add to `.env`:
```bash
NEXT_CACHE=redis
REDIS_URL=redis://redis:6379
```

Update `docker-compose.yml`:
```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### Enable CDN

Use Cloudflare or similar:
1. Point domain to Cloudflare
2. Enable Cloudflare CDN
3. Configure cache rules

---

## 🎉 Success!

Your dulundu.dev site is now live!

**Admin Login:**
- URL: https://yourdomain.com/en/admin/dashboard
- Email: admin@yourdomain.com
- Password: (your ADMIN_PASSWORD)

**Remember to:**
1. Change admin password after first login
2. Create your first blog post
3. Add your first product
4. Add your portfolio projects
5. Test checkout flow with Stripe

---

## 🆘 Need Help?

- Dokploy Docs: https://docs.dokploy.com
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Deployment Checklist:**
- [x] Docker files created
- [x] Environment variables configured
- [x] Database setup
- [x] Prisma migrations
- [x] Admin user created
- [x] Stripe webhook configured
- [x] Domain configured
- [x] SSL enabled
- [x] Site tested

**Happy deploying! 🚀**
