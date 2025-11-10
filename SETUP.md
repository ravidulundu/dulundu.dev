# 🚀 Dulundu.dev Kurulum Rehberi

Bu dokümantasyon, dulundu.dev projesini sıfırdan kurmak için gereken tüm adımları içerir.

## 📋 İçindekiler

1. [Gereksinimler](#gereksinimler)
2. [Proje Kurulumu](#proje-kurulumu)
3. [Veritabanı Kurulumu](#veritabanı-kurulumu)
4. [Environment Variables](#environment-variables)
5. [NextAuth.js Yapılandırması](#nextauthjs-yapılandırması)
6. [Stripe Entegrasyonu](#stripe-entegrasyonu)
7. [Development Sunucusu](#development-sunucusu)
8. [Production Deployment](#production-deployment)
9. [Sorun Giderme](#sorun-giderme)

---

## 🔧 Gereksinimler

Projeyi çalıştırmak için aşağıdaki yazılımların sisteminizde kurulu olması gerekir:

- **Node.js** 18.x veya üzeri ([İndir](https://nodejs.org/))
- **npm** veya **yarn**
- **PostgreSQL** 14.x veya üzeri ([İndir](https://www.postgresql.org/download/))
- **Git** ([İndir](https://git-scm.com/))

### Kurulumları Kontrol Etme

```bash
node --version   # v18.0.0 veya üzeri
npm --version    # 8.0.0 veya üzeri
psql --version   # PostgreSQL 14.0 veya üzeri
```

---

## 📦 Proje Kurulumu

### 1. Projeyi Klonlayın (veya mevcut dizini kullanın)

```bash
cd /home/dev/projects/dulundu.dev
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

Bu komut tüm gerekli Node.js paketlerini yükleyecektir.

---

## 🗄️ Veritabanı Kurulumu

### 1. PostgreSQL Veritabanı Oluşturma

PostgreSQL'e bağlanın:

```bash
psql -U postgres
```

Yeni bir veritabanı oluşturun:

```sql
CREATE DATABASE dulundu;
CREATE USER dulundu_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE dulundu TO dulundu_user;
\q
```

**💡 Not:** Production ortamında mutlaka güçlü bir şifre kullanın!

### 2. Alternatif: Docker ile PostgreSQL

Docker kullanıyorsanız:

```bash
docker run --name dulundu-postgres \
  -e POSTGRES_DB=dulundu \
  -e POSTGRES_USER=dulundu_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  -d postgres:14
```

### 3. Veritabanı Bağlantısını Test Etme

```bash
psql -h localhost -U dulundu_user -d dulundu
```

---

## ⚙️ Environment Variables

### 1. .env Dosyası Oluşturma

```bash
cp .env.example .env
```

### 2. .env Dosyasını Düzenleme

`.env` dosyasını açın ve aşağıdaki değerleri doldurun:

```env
# Database Connection
DATABASE_URL="postgresql://dulundu_user:your_secure_password@localhost:5432/dulundu"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key-here"

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Admin Configuration
ADMIN_EMAIL="admin@dulundu.dev"
ADMIN_PASSWORD="change_this_password"
```

### 3. NEXTAUTH_SECRET Oluşturma

Güvenli bir secret key oluşturmak için:

```bash
openssl rand -base64 32
```

Çıktıyı kopyalayın ve `NEXTAUTH_SECRET` değerine yapıştırın.

**Örnek:**
```env
NEXTAUTH_SECRET="A8pYjK9mL3nQr5tUvWxYz2BcDeF7gHiJ"
```

---

## 🔐 NextAuth.js Yapılandırması

NextAuth.js otomatik olarak yapılandırılmıştır. Sadece environment variables'ları doğru şekilde ayarladığınızdan emin olun.

### Admin Kullanıcısı Oluşturma

Veritabanı kurulumundan sonra admin kullanıcısı oluşturun:

```bash
npm run db:seed
```

Bu komut aşağıdaki bilgilerle bir admin kullanıcısı oluşturacak:
- **Email:** `.env` dosyasındaki `ADMIN_EMAIL` (varsayılan: admin@dulundu.dev)
- **Password:** `.env` dosyasındaki `ADMIN_PASSWORD` (varsayılan: admin123)

**⚠️ ÖNEMLİ:** İlk girişten sonra admin şifresini mutlaka değiştirin!

### Admin Paneline Giriş

1. Tarayıcınızda `http://localhost:3000/auth/signin` adresine gidin
2. Admin email ve şifrenizi girin
3. `/admin/dashboard` sayfasına yönlendirileceksiniz

---

## 💳 Stripe Entegrasyonu

### 1. Stripe Hesabı Oluşturma

1. [Stripe Dashboard](https://dashboard.stripe.com/register) adresinden hesap oluşturun
2. Dashboard'a giriş yapın

### 2. API Anahtarlarını Alma

**Test Modu için:**

1. Stripe Dashboard → **Developers** → **API keys**
2. **Publishable key** ve **Secret key**'i kopyalayın
3. `.env` dosyasına yapıştırın:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51..."
STRIPE_SECRET_KEY="sk_test_51..."
```

**Production Modu için:**

⚠️ Production'a geçmeden önce Stripe hesabınızı aktive edin ve KYC sürecini tamamlayın.

### 3. Webhook Kurulumu

Stripe webhook'ları ödeme durumlarını takip etmek için gereklidir.

#### Development Ortamı için (Stripe CLI)

**Stripe CLI Kurulumu:**

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (Scoop)
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

**Stripe'a Giriş Yapın:**

```bash
stripe login
```

**Webhook'u Başlatın:**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Bu komut size bir webhook secret verecek:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Bu secret'i `.env` dosyasına ekleyin:

```env
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"
```

#### Production Ortamı için

1. Stripe Dashboard → **Developers** → **Webhooks**
2. **Add endpoint** butonuna tıklayın
3. Endpoint URL'i girin: `https://dulundu.dev/api/webhooks/stripe`
4. Dinlenecek event'leri seçin:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
5. **Signing secret**'i kopyalayın ve production `.env` dosyasına ekleyin

### 4. Ürün Senkronizasyonu

Admin panelinden ürün oluşturduğunuzda otomatik olarak Stripe'a senkronize edilecektir.

**Manuel Senkronizasyon:**

Mevcut ürünleri Stripe'a senkronize etmek için admin panelinden "Sync to Stripe" butonunu kullanın.

---

## 🚀 Development Sunucusu

### 1. Prisma Client Oluşturma

```bash
npm run db:generate
```

### 2. Veritabanı Şemasını Uygulama

```bash
npm run db:push
```

### 3. Admin Kullanıcısı Oluşturma

```bash
npm run db:seed
```

### 4. Development Server'ı Başlatma

```bash
npm run dev
```

Site şu adreste çalışacak: **http://localhost:3000**

### 5. Stripe Webhook Dinleyicisini Başlatma (Ayrı Terminal)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 📱 Sayfa Yapısı

Proje çalıştıktan sonra şu sayfalara erişebilirsiniz:

### Public Sayfalar
- **Ana Sayfa:** `http://localhost:3000` (otomatik dil algılama)
- **Türkçe:** `http://localhost:3000/tr`
- **İngilizce:** `http://localhost:3000/en`
- **Portekizce:** `http://localhost:3000/pt-BR`

### Admin Sayfaları
- **Giriş:** `http://localhost:3000/auth/signin`
- **Dashboard:** `http://localhost:3000/tr/admin/dashboard`
- **Ürünler:** `http://localhost:3000/tr/admin/products`
- **Blog:** `http://localhost:3000/tr/admin/blog`
- **Portfolio:** `http://localhost:3000/tr/admin/portfolio`
- **Siparişler:** `http://localhost:3000/tr/admin/orders`

---

## 🌐 Production Deployment

### Vercel Deployment (Önerilir)

1. **Vercel Hesabı Oluşturun:** [vercel.com](https://vercel.com)

2. **Projeyi Import Edin:**
   ```bash
   # Vercel CLI kurulumu
   npm install -g vercel

   # Deploy
   vercel
   ```

3. **Environment Variables Ekleyin:**

   Vercel Dashboard → Settings → Environment Variables

   Tüm `.env` değişkenlerini ekleyin.

4. **PostgreSQL Veritabanı:**

   Production için öneriler:
   - [Vercel Postgres](https://vercel.com/storage/postgres)
   - [Supabase](https://supabase.com/)
   - [Railway](https://railway.app/)
   - [Neon](https://neon.tech/)

5. **Domain Yapılandırması:**

   Vercel Dashboard → Settings → Domains → dulundu.dev ekleyin

6. **Build Commands:**
   ```bash
   # Build Command
   npm run build

   # Install Command (otomatik)
   npm install
   ```

### Environment Variables Checklist

Production deployment öncesi kontrol edin:

- ✅ `DATABASE_URL` - Production veritabanı URL'i
- ✅ `NEXTAUTH_URL` - Production domain (https://dulundu.dev)
- ✅ `NEXTAUTH_SECRET` - Güçlü, unique secret
- ✅ `STRIPE_SECRET_KEY` - Live mode secret key
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Live mode publishable key
- ✅ `STRIPE_WEBHOOK_SECRET` - Production webhook secret
- ✅ `ADMIN_EMAIL` - Gerçek admin email

---

## 🛠️ Sorun Giderme

### 1. "Cannot connect to database" Hatası

**Çözüm:**
- PostgreSQL'in çalıştığından emin olun: `sudo service postgresql status`
- `DATABASE_URL` değişkeninin doğru olduğunu kontrol edin
- Veritabanı kullanıcısının gerekli izinlere sahip olduğunu kontrol edin

```bash
# PostgreSQL'i başlat
sudo service postgresql start

# veya macOS
brew services start postgresql
```

### 2. "Prisma Client is not generated" Hatası

**Çözüm:**
```bash
npm run db:generate
```

### 3. "Invalid credentials" Hatası (NextAuth)

**Çözüm:**
- Admin kullanıcısının oluşturulduğunu kontrol edin: `npm run db:seed`
- Email ve şifrenin doğru olduğunu kontrol edin
- `NEXTAUTH_SECRET` değişkeninin set edildiğini kontrol edin

### 4. Stripe Webhook Çalışmıyor

**Çözüm:**
- Stripe CLI'nin çalıştığından emin olun
- `STRIPE_WEBHOOK_SECRET` değişkeninin güncel olduğunu kontrol edin
- Webhook endpoint'in erişilebilir olduğunu test edin

```bash
# Webhook'u test et
curl -X POST http://localhost:3000/api/webhooks/stripe
```

### 5. "Module not found" Hatası

**Çözüm:**
```bash
# node_modules'u sil ve yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

### 6. Port 3000 Kullanımda

**Çözüm:**
```bash
# Farklı port kullan
PORT=3001 npm run dev
```

### 7. Çoklu Dil Çalışmıyor

**Çözüm:**
- `messages/` klasöründe tüm dil dosyalarının olduğunu kontrol edin
- Middleware'in doğru yapılandırıldığını kontrol edin
- Browser cache'i temizleyin

---

## 📚 Ek Kaynaklar

### Dokümantasyon
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Stripe Docs](https://stripe.com/docs)
- [next-intl Docs](https://next-intl-docs.vercel.app/)

### Yararlı Komutlar

```bash
# Veritabanı yönetimi
npm run db:generate     # Prisma client oluştur
npm run db:push         # Schema'yı veritabanına uygula
npm run db:studio       # Prisma Studio'yu aç (GUI)
npm run db:seed         # Seed data ekle

# Development
npm run dev             # Dev server başlat
npm run build           # Production build
npm run start           # Production server başlat
npm run lint            # Linter çalıştır

# Prisma
npx prisma studio       # Veritabanı GUI
npx prisma migrate dev  # Migration oluştur
npx prisma migrate deploy # Migration'ları uygula
```

### Veritabanı Backup

```bash
# Backup oluştur
pg_dump -U dulundu_user dulundu > backup.sql

# Backup'tan geri yükle
psql -U dulundu_user dulundu < backup.sql
```

---

## 🎉 Tamamlandı!

Kurulum başarıyla tamamlandıysa:

1. ✅ Site `http://localhost:3000` adresinde çalışıyor
2. ✅ Admin paneline `http://localhost:3000/tr/admin/dashboard` adresinden erişebiliyorsunuz
3. ✅ Stripe webhook'ları çalışıyor
4. ✅ Çoklu dil desteği aktif

**Sonraki Adımlar:**
- Admin panelinden ilk ürününüzü oluşturun
- Blog yazısı ekleyin
- Portfolio projeleri ekleyin
- Tasarımı özelleştirin
- Production'a deploy edin

**Sorularınız için:**
- GitHub Issues: [Repo link]
- Email: admin@dulundu.dev

İyi çalışmalar! 🚀
