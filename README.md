# 🌐 Dulundu.dev

> Professional multi-language portfolio and service selling platform built with Next.js 14 App Router

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff)](https://stripe.com/)

## ✨ Features

- 🌍 **Multi-language Support** - Turkish, English, Portuguese-BR with automatic IP-based detection
- 💼 **Portfolio Showcase** - Display your best work with multi-language descriptions
- 📝 **Blog System** - Share your knowledge with integrated blog functionality
- 🛒 **E-Commerce** - Sell products and services with Stripe integration
- 🔐 **Admin Panel** - Comprehensive admin dashboard for content management
- ⚡ **Optimized Performance** - Built with Next.js 14 App Router for blazing-fast speeds
- 🎨 **Professional Design** - Clean, modern, and responsive corporate design
- 🔒 **Secure Authentication** - NextAuth.js with role-based access control

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your database and API keys

# 3. Initialize database
npm run db:generate
npm run db:push
npm run db:seed

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` 🎉

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### Backend
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v5](https://next-auth.js.org/)

### Features
- **Payments**: [Stripe](https://stripe.com/)
- **i18n**: [next-intl](https://next-intl-docs.vercel.app/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
dulundu.dev/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Multi-language routing
│   │   ├── admin/         # Admin panel
│   │   └── page.tsx       # Homepage
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Navbar, Footer, etc.
│   └── admin/            # Admin components
├── lib/                  # Utilities & configs
├── prisma/               # Database schema
├── messages/             # i18n translations
└── types/                # TypeScript types
```

## 🎯 Services Offered

- ⚡ **WordPress Optimization** - Speed up and optimize WordPress sites
- 🔧 **Technical Consulting** - Expert web development guidance
- 📦 **Digital Products** - Premium themes, plugins, and tools

## 🌍 Multi-Language Support

The platform automatically detects user language based on:
1. IP geolocation (country-based)
2. Browser language preferences
3. User manual selection

Supported languages:
- 🇺🇸 English (en)
- 🇹🇷 Türkçe (tr)
- 🇧🇷 Português (pt-BR)

## 🔐 Admin Panel

Access the admin dashboard at `/admin/dashboard`

**Default credentials:**
- Email: `admin@dulundu.dev`
- Password: `admin123`

⚠️ **Important:** Change the default password after first login!

### Admin Features
- ✅ Product/Service management
- ✅ Blog post creation and editing
- ✅ Portfolio project showcase
- ✅ Order management
- ✅ Multi-language content management
- ✅ Stripe integration

## 💳 Stripe Integration

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Get your API keys from the Stripe Dashboard
3. Add them to `.env`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Set up webhooks for payment events

## 🚀 Deployment

### Recommended: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Add environment variables in Vercel Dashboard and connect your PostgreSQL database.

**Other options:** Railway, Render, DigitalOcean, AWS, Azure, GCP

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio (GUI)
npm run db:seed      # Seed database with admin user
```

## 🤝 Contributing

This is a private project, but feel free to fork and adapt for your own use.

## 📄 Documentation

- **CLAUDE.md** - Development guidelines and AI assistant context
- **README.md** - This file (setup and usage guide)

For feature specifications and implementation plans, see `.specpulse/` directory.

## 🔄 Recent Updates (2025-11-14)

### Security Enhancements
- ✅ Added transaction safety for all database update operations
- ✅ Implemented input length validation to prevent DoS attacks
- ✅ Added session ownership verification in checkout flow
- ✅ Sanitized error logging for production security

### New Features
- ✅ Project inquiry form with database persistence
- ✅ Enhanced indexes for better query performance

### Bug Fixes
- Fixed inquiry data loss (100% of submissions now saved)
- Fixed race conditions in admin panel updates
- Fixed session tampering vulnerability

## 📝 License

Private Project - © 2024 Dulundu.dev

## 📧 Contact

- Website: [dulundu.dev](https://dulundu.dev)
- Email: admin@dulundu.dev

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
