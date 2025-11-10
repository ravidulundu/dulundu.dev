# 🏗️ Proje Mimarisi

## 📁 Proje Yapısı

```
dulundu.dev/
├── app/                          # Next.js App Router
│   ├── [locale]/                # Dil bazlı routing
│   │   ├── admin/               # Admin panel
│   │   │   ├── dashboard/       # Dashboard sayfası
│   │   │   ├── products/        # Ürün yönetimi
│   │   │   ├── blog/            # Blog yönetimi
│   │   │   ├── portfolio/       # Portfolio yönetimi
│   │   │   ├── orders/          # Sipariş yönetimi
│   │   │   └── layout.tsx       # Admin layout
│   │   ├── layout.tsx           # Genel layout (i18n)
│   │   └── page.tsx             # Ana sayfa
│   ├── api/                     # API routes
│   │   ├── auth/               # NextAuth endpoints
│   │   ├── checkout/           # Stripe checkout
│   │   └── webhooks/           # Stripe webhooks
│   └── globals.css             # Global CSS
│
├── components/                  # React componentleri
│   ├── ui/                     # Temel UI componentleri
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   └── Select.tsx
│   ├── layout/                 # Layout componentleri
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── ...
│   ├── admin/                  # Admin componentleri
│   │   ├── AdminSidebar.tsx
│   │   └── AdminHeader.tsx
│   └── forms/                  # Form componentleri
│
├── lib/                        # Utility fonksiyonları
│   ├── db.ts                   # Prisma client
│   ├── auth.ts                 # NextAuth config
│   ├── auth-helpers.ts         # Auth helper fonksiyonlar
│   ├── stripe.ts               # Stripe helper fonksiyonlar
│   └── utils.ts                # Genel utility fonksiyonlar
│
├── prisma/                     # Prisma ORM
│   ├── schema.prisma           # Veritabanı şeması
│   └── seed.ts                 # Seed data
│
├── messages/                   # i18n çeviri dosyaları
│   ├── en.json                 # İngilizce
│   ├── tr.json                 # Türkçe
│   └── pt-BR.json              # Portekizce (Brezilya)
│
├── types/                      # TypeScript type tanımları
│   └── next-auth.d.ts          # NextAuth types
│
├── public/                     # Static dosyalar
│   ├── images/
│   └── icons/
│
├── middleware.ts               # Next.js middleware (i18n routing)
├── i18n.ts                     # i18n yapılandırması
├── next.config.js              # Next.js config
├── tailwind.config.ts          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
├── package.json                # NPM dependencies
├── .env.example                # Environment variables örneği
├── README.md                   # Genel proje açıklaması
├── SETUP.md                    # Detaylı kurulum kılavuzu
├── QUICKSTART.md               # Hızlı başlangıç kılavuzu
└── ARCHITECTURE.md             # Bu dosya
```

## 🔄 Veri Akışı

### Frontend Akışı

```
User Request
    ↓
Middleware (i18n routing)
    ↓
Next.js App Router
    ↓
Page Component
    ↓
UI Components
    ↓
API Routes (if needed)
    ↓
Response to User
```

### Admin Akışı

```
Admin Login
    ↓
NextAuth Authentication
    ↓
Admin Layout (require admin role)
    ↓
Admin Pages
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

### Ödeme Akışı

```
User selects product
    ↓
Checkout API (/api/checkout)
    ↓
Create Order in DB
    ↓
Create Stripe Checkout Session
    ↓
Redirect to Stripe
    ↓
User completes payment
    ↓
Stripe Webhook (/api/webhooks/stripe)
    ↓
Update Order status in DB
    ↓
Redirect to success page
```

## 🗄️ Veritabanı Şeması

### Temel Modeller

- **User**: Kullanıcılar ve admin hesapları
- **Account**: NextAuth OAuth accounts
- **Session**: Kullanıcı oturumları
- **Product**: Ürünler ve hizmetler
- **ProductTranslation**: Ürün çevirileri (çoklu dil)
- **Post**: Blog yazıları
- **PostTranslation**: Blog yazı çevirileri
- **Project**: Portfolio projeleri
- **ProjectTranslation**: Proje çevirileri
- **Order**: Siparişler
- **OrderItem**: Sipariş kalemleri

### İlişkiler

```
User ──┬─→ Account (1:N)
       ├─→ Session (1:N)
       └─→ Order (1:N)

Product ──┬─→ ProductTranslation (1:N)
          └─→ OrderItem (1:N)

Post ───→ PostTranslation (1:N)

Project ───→ ProjectTranslation (1:N)

Order ───→ OrderItem (1:N)
```

## 🔐 Kimlik Doğrulama

### NextAuth.js Yapısı

- **Provider**: Credentials (email/password)
- **Adapter**: Prisma Adapter
- **Session Strategy**: JWT
- **Callbacks**: Role-based authorization

### Korumalı Rotalar

```typescript
// Sadece giriş yapanlar için
await requireAuth();

// Sadece admin için
await requireAdmin();

// Rol kontrolü
const isAdmin = await isAdmin();
```

## 🌍 Çoklu Dil (i18n)

### Middleware Akışı

```
Request
    ↓
Middleware kontrol eder:
  - URL'de dil var mı? → Devam et
  - Cookie'de dil var mı? → O dili kullan
  - IP bazlı algılama → Ülkeye göre dil seç
  - Varsayılan dil (en) → Fallback
    ↓
/[locale]/... rotasına yönlendir
```

### Desteklenen Diller

- `en` - English (varsayılan)
- `tr` - Türkçe
- `pt-BR` - Português (Brasil)

## 💳 Stripe Entegrasyonu

### Workflow

1. **Ürün Oluşturma**: Admin panelinden ürün eklendiğinde otomatik olarak Stripe'a senkronize edilir
2. **Checkout**: Kullanıcı ödeme yapmak istediğinde Stripe Checkout Session oluşturulur
3. **Webhook**: Ödeme tamamlandığında Stripe webhook ile sipariş durumu güncellenir

### Önemli Endpoint'ler

- `POST /api/checkout` - Checkout session oluştur
- `POST /api/webhooks/stripe` - Stripe webhook handler

## 🎨 Tasarım Sistemi

### Renkler

- **Primary**: Blue (#0ea5e9)
- **Secondary**: Purple (#a855f7)
- **Success**: Green
- **Danger**: Red
- **Gray Scale**: 50-950

### Componentler

- Button (primary, secondary, danger, ghost)
- Input
- Textarea
- Select
- Navbar
- Footer
- LanguageSwitcher

## 📦 Kullanılan Teknolojiler

### Core
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**

### Styling
- **Tailwind CSS**
- **Lucide React** (icons)

### Database
- **PostgreSQL**
- **Prisma ORM**

### Authentication
- **NextAuth.js v5** (beta)
- **bcryptjs**

### Payments
- **Stripe**
- **@stripe/stripe-js**

### i18n
- **next-intl**

### Dev Tools
- **ESLint**
- **Prettier** (opsiyonel)
- **tsx** (TypeScript execution)

## 🚀 Deployment

### Önerilen Platform: Vercel

**장점:**
- Zero-config deployment
- Otomatik HTTPS
- Edge middleware support
- PostgreSQL integration
- Environment variables yönetimi
- Preview deployments

### Alternatif Platformlar

- **Railway**: Kolay deployment + database hosting
- **Render**: Free tier + PostgreSQL
- **DigitalOcean App Platform**: VPS alternatifleri
- **AWS / Azure / GCP**: Enterprise çözümler

## 🔧 Geliştirme İpuçları

### Yeni Sayfa Eklemek

```typescript
// app/[locale]/new-page/page.tsx
import { useTranslations } from 'next-intl';

export default function NewPage() {
  const t = useTranslations('newPage');
  return <div>{t('title')}</div>;
}
```

### Yeni API Route Eklemek

```typescript
// app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello' });
}
```

### Yeni Model Eklemek

1. `prisma/schema.prisma` dosyasını düzenle
2. `npx prisma generate` çalıştır
3. `npx prisma db push` ile veritabanına uygula

## 📝 Best Practices

- ✅ Tüm string'leri i18n dosyalarından çek
- ✅ Server Component kullan (client component sadece gerektiğinde)
- ✅ API route'larda error handling yap
- ✅ Sensitive data'yı .env'de sakla
- ✅ TypeScript type safety'sini koru
- ✅ Prisma query'lerini optimize et
- ✅ Image'ları next/image ile optimize et

## 🔍 Debugging

### Prisma Studio

```bash
npm run db:studio
```

Browser'da veritabanını görsel olarak incele.

### Stripe CLI Events

```bash
stripe events list --limit 10
```

Son webhook event'lerini gör.

### Next.js Build Analysis

```bash
npm run build
```

Build çıktısında bundle size'ları kontrol et.

---

Daha fazla bilgi için:
- [SETUP.md](./SETUP.md) - Detaylı kurulum
- [QUICKSTART.md](./QUICKSTART.md) - Hızlı başlangıç
- [README.md](./README.md) - Genel bakış
