# 🔌 Bağlantı Kılavuzu

Bu dokümantasyon, dulundu.dev projesinde kullanılan tüm servislere nasıl bağlanacağınızı adım adım açıklar.

## 📑 İçindekiler

1. [PostgreSQL Veritabanı Bağlantısı](#postgresql-veritabanı-bağlantısı)
2. [Stripe Bağlantısı](#stripe-bağlantısı)
3. [NextAuth.js Yapılandırması](#nextauthjs-yapılandırması)
4. [Vercel Deployment Bağlantıları](#vercel-deployment-bağlantıları)
5. [Harici Database Servisler](#harici-database-servisler)

---

## 🗄️ PostgreSQL Veritabanı Bağlantısı

### Yerel PostgreSQL Kurulumu

#### 1. PostgreSQL Kurulumu

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Windows:**
[PostgreSQL Installer](https://www.postgresql.org/download/windows/) indirin ve yükleyin.

#### 2. PostgreSQL'e Bağlanma

```bash
# postgres kullanıcısı ile bağlan
sudo -u postgres psql

# veya macOS'ta
psql postgres
```

#### 3. Veritabanı ve Kullanıcı Oluşturma

```sql
-- Yeni veritabanı oluştur
CREATE DATABASE dulundu;

-- Yeni kullanıcı oluştur
CREATE USER dulundu_user WITH PASSWORD 'your_secure_password_here';

-- Kullanıcıya veritabanı üzerinde tam yetki ver
GRANT ALL PRIVILEGES ON DATABASE dulundu TO dulundu_user;

-- PostgreSQL 15+ için gerekli
GRANT ALL ON SCHEMA public TO dulundu_user;

-- Çıkış
\q
```

#### 4. Bağlantı String'i Oluşturma

`.env` dosyanızda:

```env
DATABASE_URL="postgresql://dulundu_user:your_secure_password_here@localhost:5432/dulundu"
```

**Format Açıklaması:**
```
postgresql://[username]:[password]@[host]:[port]/[database]
```

- `username`: dulundu_user
- `password`: Güçlü bir şifre
- `host`: localhost (yerel), veya remote host
- `port`: 5432 (varsayılan PostgreSQL portu)
- `database`: dulundu

#### 5. Bağlantıyı Test Etme

```bash
# psql ile test
psql -h localhost -U dulundu_user -d dulundu

# veya Node.js ile
npx prisma db push
```

### Remote PostgreSQL Bağlantısı

Remote bir PostgreSQL sunucusuna bağlanıyorsanız:

```env
DATABASE_URL="postgresql://username:password@remote-host.com:5432/database_name?sslmode=require"
```

**SSL Bağlantısı için:**
```env
DATABASE_URL="postgresql://username:password@host:5432/db?sslmode=require&sslcert=/path/to/cert.pem"
```

---

## 💳 Stripe Bağlantısı

### 1. Stripe Hesabı Oluşturma

1. [Stripe](https://stripe.com) adresine gidin
2. **Sign Up** butonuna tıklayın
3. Email, şifre ve ülke bilgilerinizi girin
4. Email adresinizi doğrulayın

### 2. API Anahtarlarını Alma

#### Test Mode (Development için)

1. [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) → **Developers** → **API keys**
2. **Test mode** toggle'ının açık olduğundan emin olun
3. İki anahtar göreceksiniz:

   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

4. `.env` dosyanıza ekleyin:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51H..."
STRIPE_SECRET_KEY="sk_test_51H..."
```

⚠️ **DİKKAT:**
- `NEXT_PUBLIC_` ile başlayanlar frontend'de görünür
- `STRIPE_SECRET_KEY` asla frontend'e eklenmemeli!

### 3. Webhook Secret Alma

#### Development (Stripe CLI)

**Stripe CLI Kurulumu:**

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

**Windows:**
[Releases sayfasından](https://github.com/stripe/stripe-cli/releases) indirin.

**Stripe'a Giriş:**
```bash
stripe login
```

Browser'da açılan sayfadan izin verin.

**Webhook Dinleyicisini Başlatma:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Çıktıda şunu göreceksiniz:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef...
```

Bu secret'i `.env` dosyanıza ekleyin:
```env
STRIPE_WEBHOOK_SECRET="whsec_1234567890abcdef..."
```

**Webhook'u Test Etme:**
```bash
# Başka bir terminalde
stripe trigger payment_intent.succeeded
```

#### Production (Stripe Dashboard)

1. [Stripe Dashboard](https://dashboard.stripe.com/webhooks) → **Developers** → **Webhooks**
2. **Add endpoint** butonuna tıklayın
3. Endpoint details:
   - **Endpoint URL**: `https://dulundu.dev/api/webhooks/stripe`
   - **Description**: "Production webhook for dulundu.dev"
   - **Events to send**: Şunları seçin:
     - ✅ `checkout.session.completed`
     - ✅ `checkout.session.expired`
     - ✅ `payment_intent.payment_failed`

4. **Add endpoint** butonuna tıklayın
5. **Signing secret** kısmından secret'i kopyalayın
6. Production `.env` dosyanıza ekleyin:

```env
STRIPE_WEBHOOK_SECRET="whsec_production_secret_here"
```

### 4. Live Mode'a Geçiş

Production'da ödeme almak için:

1. Stripe Dashboard'da **Activate your account** sürecini tamamlayın
2. İş bilgilerinizi girin
3. KYC (Know Your Customer) doğrulamasını yapın
4. **Live mode** toggle'ına geçin
5. Live API anahtarlarını alın:

```env
# Production .env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_51H..."
STRIPE_SECRET_KEY="sk_live_51H..."
STRIPE_WEBHOOK_SECRET="whsec_live_..."
```

### 5. Stripe Bağlantısını Test Etme

```bash
# Development sunucusunu başlat
npm run dev

# Başka bir terminalde webhook'u dinle
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Başka bir terminalde test event gönder
stripe trigger checkout.session.completed
```

Admin panelde bir ürün oluşturup, satın alma akışını test edin.

---

## 🔐 NextAuth.js Yapılandırması

### 1. Secret Key Oluşturma

Güvenli bir secret key oluşturun:

```bash
openssl rand -base64 32
```

Çıktı:
```
A8pYjK9mL3nQr5tUvWxYz2BcDeF7gHiJ
```

`.env` dosyanıza ekleyin:
```env
NEXTAUTH_SECRET="A8pYjK9mL3nQr5tUvWxYz2BcDeF7gHiJ"
```

### 2. NextAuth URL Yapılandırması

**Development:**
```env
NEXTAUTH_URL="http://localhost:3000"
```

**Production:**
```env
NEXTAUTH_URL="https://dulundu.dev"
```

### 3. Admin Kullanıcısı Oluşturma

`.env` dosyasında:

```env
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-strong-password"
```

Seed script'i çalıştırın:
```bash
npm run db:seed
```

### 4. Giriş Testi

1. `http://localhost:3000/auth/signin` adresine gidin
2. Admin email ve şifrenizi girin
3. `/admin/dashboard` sayfasına yönlendirileceksiniz

---

## ☁️ Vercel Deployment Bağlantıları

### 1. Vercel Hesabı Oluşturma

1. [Vercel](https://vercel.com) adresine gidin
2. GitHub, GitLab veya Bitbucket ile giriş yapın

### 2. Proje Import Etme

```bash
# Vercel CLI kurulumu
npm install -g vercel

# Projeyi deploy et
vercel
```

Soruları yanıtlayın:
- Set up and deploy: **Y**
- Which scope: Hesabınızı seçin
- Link to existing project: **N**
- Project name: **dulundu-dev**
- Directory: **./***
- Override settings: **N**

### 3. Environment Variables Ekleme

Vercel Dashboard'da:

1. Projenizi seçin
2. **Settings** → **Environment Variables**
3. Şu değişkenleri ekleyin:

```
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD (opsiyonel)
```

4. Her değişken için:
   - **Name**: Değişken adı
   - **Value**: Değeri
   - **Environment**: Production, Preview, Development seçin
   - **Add** butonuna tıklayın

### 4. Domain Bağlama

1. Vercel Dashboard → **Settings** → **Domains**
2. **Add** butonuna tıklayın
3. `dulundu.dev` girin
4. DNS kayıtlarını yapılandırın:

**Vercel'in verdiği IP'leri domain sağlayıcınıza ekleyin:**

```
A Record:
Type: A
Name: @
Value: 76.76.21.21

CNAME Record:
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. DNS değişikliklerinin yayılmasını bekleyin (5-30 dakika)

---

## 🌐 Harici Database Servisler

### Supabase (Önerilen)

1. [Supabase](https://supabase.com) hesabı oluşturun
2. **New Project** butonuna tıklayın
3. Proje bilgilerini doldurun:
   - Name: dulundu
   - Database Password: Güçlü bir şifre
   - Region: Size yakın bir bölge seçin

4. Projeniz oluşturulunca **Settings** → **Database**
5. **Connection string** → **URI** kopyalayın

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

**Avantajları:**
- ✅ Ücretsiz tier (500MB)
- ✅ Otomatik yedekleme
- ✅ Built-in authentication (opsiyonel)
- ✅ Real-time subscriptions

### Railway

1. [Railway](https://railway.app) hesabı oluşturun
2. **New Project** → **Provision PostgreSQL**
3. Database oluşturulduktan sonra **Connect** → **Connection String** kopyalayın

```env
DATABASE_URL="postgresql://postgres:password@containers-us-west-1.railway.app:7777/railway"
```

**Avantajları:**
- ✅ Ücretsiz $5/ay kredit
- ✅ Kolay deployment
- ✅ Otomatik backups

### Neon (Serverless PostgreSQL)

1. [Neon](https://neon.tech) hesabı oluşturun
2. **Create Project** → Proje adı girin
3. **Connection string** kopyalayın

```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

**Avantajları:**
- ✅ Serverless (kullanmadığınızda ödeme yok)
- ✅ Auto-scaling
- ✅ Branching (test için)

### Vercel Postgres

1. Vercel Dashboard → Projeniz → **Storage**
2. **Create Database** → **Postgres**
3. Database adı girin
4. Otomatik olarak `DATABASE_URL` environment variable eklenir

```env
POSTGRES_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"
```

**Avantajları:**
- ✅ Vercel ile tam entegrasyon
- ✅ Kolay setup
- ✅ Otomatik connection pooling

---

## 🧪 Bağlantıları Test Etme

### Veritabanı Testi

```bash
# Prisma ile test
npx prisma db push

# Başarılı olursa:
# ✓ Database schema applied successfully
```

### Stripe Testi

```bash
# Webhook'u test et
curl -X POST http://localhost:3000/api/webhooks/stripe

# Başarılı olursa:
# {"error":"No signature"}
# (Bu normal, sadece endpoint erişilebilir olduğunu gösterir)
```

### NextAuth Testi

```bash
# Development server başlat
npm run dev

# Browser'da aç
http://localhost:3000/api/auth/signin

# Giriş sayfası görünüyorsa başarılı
```

---

## 🔒 Güvenlik İpuçları

### Environment Variables

✅ **YAPILMASI GEREKENLER:**
- `.env` dosyasını `.gitignore`'a ekleyin
- Production'da farklı, güçlü secret'ler kullanın
- API anahtarlarını asla public repo'lara commit etmeyin

❌ **YAPILMAMASI GEREKENLER:**
- Test API anahtarlarını production'da kullanmayın
- `NEXTAUTH_SECRET`'i basit yapın
- Database şifresini zayıf seçmeyin

### Database Güvenliği

- ✅ SSL/TLS bağlantısı kullanın (production)
- ✅ Güçlü database şifreleri kullanın
- ✅ Düzenli yedekleme yapın
- ✅ Sadece gerekli IP'lerden bağlantıya izin verin

### Stripe Güvenliği

- ✅ Webhook secret'lerini koruyun
- ✅ Test ve live mode'u karıştırmayın
- ✅ Production'da test kartları kullanmayın
- ✅ Hassas ödeme bilgilerini asla loglamayın

---

## 📞 Yardım ve Destek

Bağlantı sorunları için:

1. **SETUP.md** → [Sorun Giderme](./SETUP.md#sorun-giderme) bölümüne bakın
2. **GitHub Issues** → Problem bildirin
3. **Dokümantasyon:**
   - [Prisma Docs](https://www.prisma.io/docs)
   - [Stripe Docs](https://stripe.com/docs)
   - [NextAuth Docs](https://next-auth.js.org/)

---

**Başarılar! Tüm bağlantılarınız düzgün çalışıyor olmalı 🎉**
