# ⚡ Hızlı Başlangıç Kılavuzu

5 dakikada projeyi çalıştırın!

## 🚀 Adım Adım Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin ve en azından şunları doldurun:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dulundu"
NEXTAUTH_SECRET="$(openssl rand -base64 32 ile oluşturun)"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Veritabanını Hazırlayın

**PostgreSQL veritabanı oluşturun:**

```bash
# PostgreSQL'e bağlan
psql -U postgres

# Veritabanı oluştur
CREATE DATABASE dulundu;
\q
```

**Prisma'yı çalıştırın:**

```bash
# Prisma client oluştur
npm run db:generate

# Veritabanı schema'sını uygula
npm run db:push

# Admin kullanıcısı oluştur
npm run db:seed
```

### 4. Sunucuyu Başlatın

```bash
npm run dev
```

Site `http://localhost:3000` adresinde çalışacak!

## 🔑 İlk Giriş

**Admin Panel:** `http://localhost:3000/tr/admin/dashboard`

**Varsayılan Admin Bilgileri:**
- Email: `admin@dulundu.dev`
- Password: `admin123`

⚠️ **İlk girişten sonra şifreyi değiştirin!**

## 🎯 Temel Kullanım

### Ürün Eklemek

1. Admin paneline giriş yapın
2. Sidebar'dan **Products** seçin
3. **Add Product** butonuna tıklayın
4. Ürün bilgilerini doldurun (3 dilde)
5. Kaydedin

### Stripe Entegrasyonu (Opsiyonel)

Ödeme kabul etmek için:

1. [Stripe](https://dashboard.stripe.com) hesabı oluşturun
2. API anahtarlarını `.env`'e ekleyin:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   ```
3. Webhook dinleyicisini başlatın:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

## 📚 Detaylı Dokümantasyon

Tüm detaylar için [SETUP.md](./SETUP.md) dosyasına bakın.

## ❓ Sık Karşılaşılan Sorunlar

**"Cannot connect to database"**
```bash
# PostgreSQL'in çalıştığından emin olun
sudo service postgresql status
sudo service postgresql start
```

**"Prisma Client is not generated"**
```bash
npm run db:generate
```

**Port 3000 kullanımda**
```bash
PORT=3001 npm run dev
```

## 🎉 Başarılı!

Artık projeniz çalışıyor. İyi çalışmalar! 🚀
