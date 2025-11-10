# 🎯 SpecPulse Entegrasyon Kılavuzu

> **SpecPulse Nedir?** Specification-Driven Development (SDD) framework'ü. Önce "ne yapacağız" belirlenir, sonra AI yardımıyla kod yazılır.

---

## 📑 İçindekiler

1. [SpecPulse Nedir?](#specpulse-nedir)
2. [Kurulum](#kurulum)
3. [Dulundu.dev'e Entegrasyon](#dulundudev-e-entegrasyon)
4. [Temel Kullanım](#temel-kullanım)
5. [Pratik Örnekler](#pratik-örnekler)
6. [Workflow](#workflow)
7. [Komut Referansı](#komut-referansı)

---

## 🤔 SpecPulse Nedir?

### Temel Konsept

**Specification-Driven Development (SDD):**
```
1. Önce "ne yapacağız" (spec) → Belirtim
2. Nasıl yapacağız (plan) → Plan
3. Adım adım ne yapacağız (tasks) → Görevler
4. Yap! (execute) → Uygulama
```

### Klasik Yaklaşım vs SpecPulse

**❌ Klasik Yaklaşım:**
```
Sen: "Blog sistemi ekle"
AI: *direkt kod yazmaya başlar*
    *bazı şeyleri unutur*
    *tutarsızlıklar olur*
```

**✅ SpecPulse Yaklaşımı:**
```
1. /sp-pulse "Blog sistemi"
   → AI detaylı spec oluşturur

2. /sp-spec blog-system
   → Spec genişletilir, detaylandırılır

3. /sp-plan blog-system
   → Uygulama planı oluşturulur

4. /sp-task blog-system
   → Görevlere bölünür

5. /sp-execute blog-system
   → Adım adım uygulanır
```

### Faydaları

✅ **Organize Geliştirme** - Her şey planlanmış ve dokümante
✅ **Tutarlılık** - Tüm kod aynı spec'e göre yazılır
✅ **Takip Edilebilirlik** - Ne yaptığımız açık
✅ **Hafıza** - Proje kararları kaydedilir
✅ **Ekip Çalışması** - Specs herkes tarafından okunabilir
✅ **AI Optimizasyonu** - AI daha iyi sonuçlar üretir

---

## 📦 Kurulum

### 1. Python Kurulumu

SpecPulse Python 3.8+ gerektirir.

**Python kontrolü:**
```bash
python3 --version
# veya
python --version
```

**Python yoksa:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# macOS
brew install python3

# Windows
# https://www.python.org/downloads/ adresinden indir
```

### 2. SpecPulse Kurulumu

```bash
pip install specpulse
# veya
pip3 install specpulse
```

**Kurulumu doğrula:**
```bash
specpulse --version
# Output: SpecPulse v2.6.0
```

### 3. SpecPulse'ı Projeye Entegre Et

Dulundu.dev projesinde:

```bash
cd /home/dev/projects/dulundu.dev

# SpecPulse'ı mevcut projede başlat
specpulse init . --ai claude
```

Bu komut `.specpulse/` klasörü oluşturur:
```
.specpulse/
├── specs/        # Belirtimler
├── plans/        # Uygulama planları
├── tasks/        # Görev listeleri
├── memory/       # Proje hafızası
└── config.json   # Yapılandırma
```

### 4. .gitignore Güncelleme

`.gitignore` dosyasına ekle (opsiyonel):
```bash
# SpecPulse (working files - optional)
.specpulse/tasks/
.specpulse/memory/

# SpecPulse specs & plans'i commit etmek isteyebilirsin
# Ekip çalışmasında faydalı olur
```

---

## 🔧 Dulundu.dev'e Entegrasyon

### Mevcut Proje Durumu

Dulundu.dev projesi zaten %70 tamamlanmış. SpecPulse'ı **yeni özellikler** için kullanacağız:

- ✅ Blog sistemi
- ✅ Portfolio sistemi
- ✅ Ürün CRUD tamamlama
- ✅ SEO optimizasyonları
- ✅ İletişim formu

### Entegrasyon Stratejisi

**Yaklaşım 1: Yeni Özellikler için Kullan**
- Her yeni özellik için spec oluştur
- Mevcut kodu değiştirme

**Yaklaşım 2: Mevcut Özellikleri Dokümante Et**
- Tamamlanmış özelliklerin spec'lerini oluştur
- Gelecekteki değişiklikler için referans

**Önerilen:** Yaklaşım 1 (yeni özellikler için)

---

## 🚀 Temel Kullanım

### SpecPulse Komutları (Claude Code'da)

Claude Code içinde özel `/sp-*` komutları kullanılır:

#### 1. `/sp-pulse` - Özellik Başlatma

Yeni bir özellik için ilk adım.

**Kullanım:**
```
/sp-pulse "Blog sistemi ekle"
```

**Ne yapar:**
- Özellik için özet belirtim oluşturur
- `.specpulse/specs/` altına kaydeder
- Sonraki adımları önerir

#### 2. `/sp-spec` - Belirtim Genişletme

Belirtimi detaylandırır ve genişletir.

**Kullanım:**
```
/sp-spec blog-system
```

**Ne yapar:**
- Teknik detayları ekler
- Database şemasını planlar
- API endpoint'lerini listeler
- UI component'lerini belirler

#### 3. `/sp-plan` - Uygulama Planı

Spec'ten uygulama planı oluşturur.

**Kullanım:**
```
/sp-plan blog-system
```

**Ne yapar:**
- Adım adım uygulama planı
- Dosya ve klasör yapısı
- Bağımlılıklar
- Test stratejisi

#### 4. `/sp-task` - Görev Bölme

Planı küçük görevlere böler.

**Kullanım:**
```
/sp-task blog-system
```

**Ne yapar:**
- Her görevi ayrı task olarak listeler
- Önceliklendirme
- Tahmini süreler
- Bağımlılıklar

#### 5. `/sp-execute` - Uygulama

Görevleri sırayla çalıştırır.

**Kullanım:**
```
/sp-execute blog-system
```

**Ne yapar:**
- Her task'ı sırayla uygular
- Kod yazar
- Test eder
- Commit eder (opsiyonel)

### CLI Komutları (Terminal'de)

Terminal'den de kullanılabilir:

```bash
# Spec oluştur
specpulse spec create blog-system "Blog sistemi ekle"

# Spec'i görüntüle
specpulse spec show blog-system

# Plan oluştur
specpulse plan create blog-system

# Task'ları listele
specpulse task list blog-system

# Belirli task'ı çalıştır
specpulse task execute blog-system --task 1
```

---

## 💡 Pratik Örnekler

### Örnek 1: Blog Sistemi Ekleme

#### Adım 1: Claude Code'da Başlat

```
Sen: /sp-pulse "Blog sistemi ekle - admin panelinde yazı yönetimi, public blog listesi ve detay sayfaları"

Claude: SpecPulse başlatıldı! blog-system.md spec'i oluşturuldu.

Özet:
- Admin blog yönetimi (CRUD)
- Rich text editor
- Kategori sistemi
- Public blog sayfaları
- SEO optimizasyonu

Sonraki adım: /sp-spec blog-system
```

#### Adım 2: Spec'i Genişlet

```
Sen: /sp-spec blog-system

Claude: Belirtim genişletiliyor...

Teknik Detaylar:
- Database: Post, PostTranslation (mevcut Prisma modelleri kullanılacak)
- Rich Text Editor: TipTap
- Admin Sayfalar:
  * /admin/blog (liste)
  * /admin/blog/new (oluştur)
  * /admin/blog/[id] (düzenle)
- Public Sayfalar:
  * /blog (liste)
  * /blog/[slug] (detay)
- API Routes:
  * POST /api/blog
  * PUT /api/blog/[id]
  * DELETE /api/blog/[id]

Spec kaydedildi: .specpulse/specs/blog-system.md
Sonraki adım: /sp-plan blog-system
```

#### Adım 3: Plan Oluştur

```
Sen: /sp-plan blog-system

Claude: Uygulama planı oluşturuluyor...

Plan:
1. Dependencies
   - npm install @tiptap/react @tiptap/starter-kit

2. Dosya Yapısı
   - app/[locale]/admin/blog/page.tsx
   - app/[locale]/admin/blog/new/page.tsx
   - app/[locale]/blog/page.tsx
   - app/[locale]/blog/[slug]/page.tsx
   - components/admin/BlogForm.tsx
   - components/blog/BlogCard.tsx
   - app/api/blog/route.ts

3. Sıralama
   a) Admin liste sayfası
   b) API routes
   c) BlogForm komponenti
   d) Public sayfalar
   e) SEO & metadata

Plan kaydedildi: .specpulse/plans/blog-system.md
Sonraki adım: /sp-task blog-system
```

#### Adım 4: Görevlere Böl

```
Sen: /sp-task blog-system

Claude: Görevlere bölünüyor...

Tasks:
□ TASK-1: TipTap kurulumu (15 min)
□ TASK-2: Admin blog liste sayfası (30 min)
□ TASK-3: Blog API routes (45 min)
□ TASK-4: BlogForm komponenti (60 min)
□ TASK-5: Public blog liste (30 min)
□ TASK-6: Blog detay sayfası (45 min)
□ TASK-7: SEO metadata (20 min)

Toplam tahmini süre: ~4 saat

Task'lar kaydedildi: .specpulse/tasks/blog-system.json
Sonraki adım: /sp-execute blog-system
```

#### Adım 5: Uygula

```
Sen: /sp-execute blog-system

Claude: TASK-1 uygulanıyor: TipTap kurulumu...
✅ npm install @tiptap/react @tiptap/starter-kit tamamlandı

TASK-2 uygulanıyor: Admin blog liste sayfası...
✅ app/[locale]/admin/blog/page.tsx oluşturuldu

TASK-3 uygulanıyor: Blog API routes...
✅ app/api/blog/route.ts oluşturuldu
✅ POST, PUT, DELETE endpoints eklendi

... (devam eder)

Tüm task'lar tamamlandı! 🎉
```

### Örnek 2: Ürün CRUD Tamamlama

```
Sen: /sp-pulse "Ürün CRUD formlarını tamamla - yeni ürün ekleme, düzenleme, silme, Stripe senkronizasyonu"

Claude: [Spec oluşturur]

Sen: /sp-spec product-crud

Claude: [Spec genişletir]

Sen: /sp-plan product-crud

Claude: [Plan oluşturur]

Sen: /sp-execute product-crud

Claude: [Adım adım uygular]
```

### Örnek 3: Portfolio Sistemi

```
Sen: /sp-pulse "Portfolio showcase sistemi - admin'de proje yönetimi, public'te proje galerisi, kategori filtreleme"

[Aynı akış]
```

---

## 🔄 Workflow (İş Akışı)

### Önerilen Workflow

```
┌─────────────────────────────────────────┐
│  1. ÖZELLİK BELİRLE                     │
│     /sp-pulse "özellik açıklaması"     │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  2. SPEC GENİŞLET                       │
│     /sp-spec <feature-name>             │
│     • Teknik detaylar                   │
│     • Database şeması                   │
│     • API endpoint'ler                  │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  3. PLAN OLUŞTUR                        │
│     /sp-plan <feature-name>             │
│     • Dosya yapısı                      │
│     • Bağımlılıklar                     │
│     • Sıralama                          │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  4. GÖREVLERE BÖL                       │
│     /sp-task <feature-name>             │
│     • Küçük task'lar                    │
│     • Önceliklendirme                   │
│     • Süre tahminleri                   │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  5. UYGULA                              │
│     /sp-execute <feature-name>          │
│     • Kod yaz                           │
│     • Test et                           │
│     • Commit et                         │
└─────────────────────────────────────────┘
```

### Dulundu.dev için Örnek Workflow

**Hafta 1: Blog Sistemi**
```bash
# Pazartesi
/sp-pulse "Blog sistemi"
/sp-spec blog-system
/sp-plan blog-system

# Salı-Çarşamba
/sp-task blog-system
/sp-execute blog-system

# Perşembe
Test & bug fixes

# Cuma
Deploy & dokümantasyon
```

**Hafta 2: Portfolio Sistemi**
```bash
# Aynı akış
/sp-pulse "Portfolio sistemi"
...
```

---

## 📚 Komut Referansı

### Claude Code Komutları

| Komut | Açıklama | Kullanım |
|-------|----------|----------|
| `/sp-pulse` | Yeni özellik başlat | `/sp-pulse "açıklama"` |
| `/sp-spec` | Spec genişlet | `/sp-spec <feature>` |
| `/sp-plan` | Plan oluştur | `/sp-plan <feature>` |
| `/sp-task` | Görevlere böl | `/sp-task <feature>` |
| `/sp-execute` | Uygula | `/sp-execute <feature>` |
| `/sp-status` | Durum göster | `/sp-status <feature>` |
| `/sp-review` | Review yap | `/sp-review <feature>` |

### CLI Komutları

```bash
# Proje başlatma
specpulse init <project> --ai claude

# Spec yönetimi
specpulse spec create <name> "description"
specpulse spec show <name>
specpulse spec list
specpulse spec edit <name>

# Plan yönetimi
specpulse plan create <name>
specpulse plan show <name>

# Task yönetimi
specpulse task list <feature>
specpulse task execute <feature> --task <id>
specpulse task complete <feature> <task-id>

# Memory (hafıza)
specpulse memory add <key> <value>
specpulse memory show <key>

# Durum
specpulse status
```

---

## 🎯 Dulundu.dev için Kullanım Stratejisi

### Öncelikli Özellikler (SpecPulse ile)

1. **Blog Sistemi** ⭐ Yüksek Öncelik
   ```
   /sp-pulse "Blog sistemi - admin yönetimi, rich text editor, public sayfalar"
   ```

2. **Ürün CRUD Tamamlama** ⭐ Yüksek Öncelik
   ```
   /sp-pulse "Ürün CRUD formları - oluştur, düzenle, sil, çoklu dil"
   ```

3. **Portfolio Sistemi** ⭐ Yüksek Öncelik
   ```
   /sp-pulse "Portfolio showcase - proje galerisi, kategori filtreleme"
   ```

4. **Checkout Flow** 🟡 Orta Öncelik
   ```
   /sp-pulse "Checkout akışı - success/cancel sayfaları, order confirmation"
   ```

5. **İletişim Formu** 🟡 Orta Öncelik
   ```
   /sp-pulse "Contact form - email entegrasyonu, validation"
   ```

6. **SEO Optimizasyonu** ⚪ Düşük Öncelik
   ```
   /sp-pulse "SEO - sitemap, robots.txt, meta tags, schema.org"
   ```

### Önerilen Sıralama

```
Hafta 1: Blog Sistemi
Hafta 2: Ürün CRUD
Hafta 3: Portfolio
Hafta 4: Checkout + Contact
Hafta 5: SEO + Polish
```

---

## 💾 SpecPulse Dosya Yapısı

### .specpulse/ Klasörü

```
.specpulse/
├── config.json              # SpecPulse yapılandırması
├── specs/                   # Belirtimler
│   ├── blog-system.md
│   ├── product-crud.md
│   └── portfolio-system.md
├── plans/                   # Uygulama planları
│   ├── blog-system.md
│   ├── product-crud.md
│   └── portfolio-system.md
├── tasks/                   # Görev listeleri
│   ├── blog-system.json
│   ├── product-crud.json
│   └── portfolio-system.json
└── memory/                  # Proje hafızası
    ├── decisions.md         # Alınan kararlar
    ├── tech-stack.md        # Teknoloji seçimleri
    └── patterns.md          # Kullanılan pattern'ler
```

### Örnek Spec Dosyası

`.specpulse/specs/blog-system.md`:
```markdown
# Blog System Specification

## Overview
Multi-language blog system with admin management and public pages.

## Requirements
- Admin CRUD for blog posts
- Rich text editor (TipTap)
- Multi-language support (TR, EN, PT-BR)
- Public blog listing and detail pages
- SEO optimization

## Database
Uses existing Prisma models:
- Post
- PostTranslation

## API Endpoints
- POST /api/blog
- PUT /api/blog/[id]
- DELETE /api/blog/[id]
- GET /api/blog (public)
- GET /api/blog/[slug] (public)

## UI Components
- BlogForm (admin)
- BlogCard (public)
- RichTextEditor (TipTap wrapper)

...
```

---

## ⚡ Hızlı Başlangıç

### İlk Özelliğini Ekle (5 Dakika)

```bash
# 1. SpecPulse'ı kur
pip install specpulse

# 2. Projeye entegre et
cd /home/dev/projects/dulundu.dev
specpulse init . --ai claude

# 3. Claude Code'da yeni özellik başlat
# (Claude Code içinde)
/sp-pulse "Blog sistemi ekle"

# 4. Spec'i genişlet
/sp-spec blog-system

# 5. Planı oluştur
/sp-plan blog-system

# 6. Uygula
/sp-execute blog-system
```

---

## 🤝 Ekip Çalışması

### Specs'i Paylaş

`.specpulse/specs/` ve `.specpulse/plans/` klasörlerini Git'e commit et:

```bash
git add .specpulse/specs/
git add .specpulse/plans/
git commit -m "Add blog system specification"
git push
```

Ekip arkadaşların aynı spec'i kullanarak tutarlı kod yazabilir.

---

## 🐛 Sorun Giderme

### SpecPulse komutları çalışmıyor

```bash
# Python ve pip versiyonunu kontrol et
python3 --version
pip3 --version

# SpecPulse'ı güncelle
pip3 install --upgrade specpulse

# PATH kontrolü
which specpulse
```

### Claude Code'da /sp- komutları görünmüyor

SpecPulse'ın doğru kurulduğundan emin ol:
```bash
specpulse --version
```

### Spec dosyaları oluşturulmuyor

`.specpulse/` klasörünün var olduğundan emin ol:
```bash
ls -la .specpulse/
```

Yoksa tekrar init et:
```bash
specpulse init . --ai claude
```

---

## 📖 İleri Seviye

### Custom Templates

`.specpulse/templates/` klasörü oluştur ve kendi spec template'lerini ekle.

### Memory System

Proje kararlarını kaydet:
```bash
specpulse memory add "editor-choice" "TipTap seçildi, çünkü lightweight ve extensible"
specpulse memory show editor-choice
```

### Multiple AI Providers

```bash
# Gemini kullan
specpulse init . --ai gemini

# Claude kullan (default)
specpulse init . --ai claude
```

---

## 🎉 Özet

### SpecPulse Avantajları

✅ **Organize**: Her şey planlanmış
✅ **Dokümante**: Specs kalıcı referans
✅ **Tutarlı**: Tek bir spec, tutarlı kod
✅ **Hızlı**: AI daha iyi sonuçlar üretir
✅ **Takip**: İlerleme net görünür

### İlk Adımlar

1. ✅ `pip install specpulse`
2. ✅ `specpulse init . --ai claude`
3. ✅ `/sp-pulse "ilk özellik"`
4. ✅ Workflow'u takip et
5. ✅ Kod yaz, test et, deploy et!

---

**Başarılar! SpecPulse ile dulundu.dev projesini hızlıca tamamlayabilirsin! 🚀**
