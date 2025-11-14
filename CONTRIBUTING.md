# 🤝 Katkıda Bulunma Rehberi

Dulundu.dev projesine katkıda bulunmak istediğiniz için teşekkür ederiz! Bu doküman, projeye nasıl katkı sağlayabileceğinizi açıklar.

## 📋 İçindekiler

- [Davranış Kuralları](#davranış-kuralları)
- [Başlamadan Önce](#başlamadan-önce)
- [Geliştirme Ortamı Kurulumu](#geliştirme-ortamı-kurulumu)
- [SpecPulse Workflow](#specpulse-workflow)
- [Kod Standartları](#kod-standartları)
- [Commit Kuralları](#commit-kuralları)
- [Pull Request Süreci](#pull-request-süreci)
- [Testing](#testing)
- [Dokümantasyon](#dokümantasyon)

---

## 📜 Davranış Kuralları

Bu projede katkıda bulunan herkes:

- ✅ Saygılı ve yapıcı olmalı
- ✅ Farklı bakış açılarına açık olmalı
- ✅ Eleştirileri kişisel algılamamalı
- ✅ Topluluk odaklı düşünmeli
- ❌ Ayrımcı, hakaret içeren dil kullanmamalı

---

## 🚀 Başlamadan Önce

### Hangi Katkıları Kabul Ediyoruz?

✅ **Kabul Edilen Katkılar:**
- Bug düzeltmeleri
- Yeni özellik eklemeleri (önce Issue açın!)
- Dokümantasyon iyileştirmeleri
- Performans optimizasyonları
- Test coverage artırma
- UI/UX iyileştirmeleri
- Çeviri eklemeleri (yeni diller)

❌ **Kabul Edilmeyen Katkılar:**
- Büyük refactoring'ler (önce tartışılmalı)
- Breaking changes (major version değişikliği gerektirir)
- Kişisel tercih değişiklikleri (örn: "Bence X şöyle olmalı")
- Kod style değişiklikleri (ESLint kurallarımız var)

### İlk Katkınız mı?

1. 🌟 Projeyi **Star**layın
2. 🍴 Projeyi **Fork**layın
3. 💻 Lokal ortamınıza **Clone**layın
4. 🔧 Geliştirme ortamını kurun
5. 🎯 Küçük bir issue'dan başlayın

**İyi Başlangıç Issue'ları:** `good-first-issue` etiketi ile işaretlenmiş issue'lara bakın.

---

## 💻 Geliştirme Ortamı Kurulumu

### Gereksinimler

- Node.js 18.0.0+
- PostgreSQL 14+
- Git
- npm veya yarn

### Kurulum Adımları

```bash
# 1. Fork'ladığınız repoyu clone edin
git clone https://github.com/YOUR_USERNAME/dulundu.dev.git
cd dulundu.dev

# 2. Upstream remote ekleyin
git remote add upstream https://github.com/ravidulundu/dulundu.dev.git

# 3. Bağımlılıkları yükleyin
npm install

# 4. Environment variables oluşturun
cp .env.example .env
# .env dosyasını kendi bilgilerinizle doldurun

# 5. Database'i kurun
npm run db:generate
npm run db:push
npm run db:seed

# 6. Development server'ı başlatın
npm run dev
```

### Branch Stratejisi

```
main (production)
  ↑
  └── develop (latest stable)
       ↑
       └── feature/your-feature
       └── fix/your-bugfix
       └── docs/your-documentation
```

**Yeni bir özellik geliştirirken:**
```bash
git checkout develop
git pull upstream develop
git checkout -b feature/amazing-feature
```

---

## 🎯 SpecPulse Workflow

Bu proje **SpecPulse** metodolojisi kullanır. Yeni özellik eklerken mutlaka bu workflow'u takip edin.

### 1. Özellik Başlatma

```bash
# SpecPulse ile özellik başlat
specpulse sp-pulse "Yeni özellik açıklaması"
```

⚠️ **UYARI**: Manuel dosya oluşturmayın! Her zaman `specpulse sp-pulse` ile başlayın.

### 2. Spec Oluşturma

```bash
# Detaylı belirtim oluştur
specpulse sp-spec feature-name
```

### 3. Plan ve Task Oluşturma

```bash
# Uygulama planı
specpulse sp-plan feature-name

# Görevlere böl
specpulse sp-task feature-name
```

### 4. Implementation

```bash
# Adım adım uygula
specpulse sp-execute feature-name
```

### ❌ Yapmamanız Gerekenler

- `.specpulse/` klasöründe manuel dosya oluşturma
- `feature_counter.txt` dosyasını elle düzenleme
- Write tool ile spec/plan/task dosyaları oluşturma

**Daha fazla bilgi:** [SPECPULSE-GUIDE.md](./SPECPULSE-GUIDE.md)

---

## 📝 Kod Standartları

### TypeScript

✅ **Yapın:**
```typescript
// Tip tanımları kullanın
interface UserData {
  id: string;
  email: string;
  name: string;
}

function getUser(id: string): Promise<UserData> {
  // ...
}
```

❌ **Yapmayın:**
```typescript
// any kullanmayın
function getUser(id: any): any {
  // ...
}
```

### React Components

✅ **Yapın:**
```typescript
// Server Component (default)
export default function HomePage() {
  return <div>Home</div>
}

// Client Component (sadece gerektiğinde)
'use client'
export default function InteractiveButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

❌ **Yapmayın:**
```typescript
// Gereksiz 'use client'
'use client'
export default function StaticPage() {
  return <div>Static content</div>
}
```

### Styling

✅ **Yapın:**
```typescript
// Tailwind CSS utility classes
<div className="flex items-center justify-between p-4 bg-background">
  <h1 className="text-2xl font-bold">Title</h1>
</div>
```

❌ **Yapmayın:**
```typescript
// Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
  <h1 style={{ fontSize: '24px' }}>Title</h1>
</div>
```

### i18n (Internationalization)

✅ **Yapın:**
```typescript
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('homepage');
  return <h1>{t('title')}</h1>
}
```

❌ **Yapmayın:**
```typescript
// Hardcoded strings
export default function Page() {
  return <h1>Welcome to Dulundu.dev</h1>
}
```

### Database Queries

✅ **Yapın:**
```typescript
// Prisma ile type-safe queries
const user = await db.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    name: true
  }
})
```

❌ **Yapmayın:**
```typescript
// Raw SQL (güvenlik riski)
const user = await db.$queryRaw`SELECT * FROM users WHERE id = ${id}`
```

---

## 📌 Commit Kuralları

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Açıklama | Örnek |
|------|----------|-------|
| `feat` | Yeni özellik | `feat(blog): add category filter` |
| `fix` | Bug düzeltme | `fix(auth): resolve session timeout` |
| `docs` | Dokümantasyon | `docs(readme): update installation steps` |
| `style` | Kod formatı | `style(navbar): improve spacing` |
| `refactor` | Kod iyileştirme | `refactor(api): optimize query performance` |
| `test` | Test ekleme | `test(auth): add login unit tests` |
| `chore` | Araç/config | `chore(deps): update next to 14.2.0` |
| `perf` | Performans | `perf(images): add lazy loading` |

### Örnekler

✅ **İyi Commit Mesajları:**
```
feat(portfolio): add category filtering

- Add category dropdown to portfolio page
- Filter projects by selected category
- Update UI to show active filter

Closes #42
```

```
fix(stripe): handle webhook signature errors

Previously, webhook signature validation would fail silently.
Now logs error and returns 400 status.

Fixes #127
```

❌ **Kötü Commit Mesajları:**
```
update files
```

```
fixed bug
```

```
WIP
```

### Commit Best Practices

- ✅ Atomic commits (her commit tek bir değişiklik)
- ✅ Anlamlı mesajlar (ne ve neden açıklayın)
- ✅ Küçük, frequent commits
- ❌ Büyük, monolithic commits
- ❌ "WIP", "temp", "test" gibi mesajlar

---

## 🔄 Pull Request Süreci

### 1. Branch Oluşturma

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature
```

### 2. Değişikliklerinizi Yapın

```bash
# Kod yazın
# Test edin
# Commit edin

git add .
git commit -m "feat(scope): description"
```

### 3. Kodunuzu Test Edin

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Build test
npm run build

# Manual testing
npm run dev
```

### 4. Branch'i Push Edin

```bash
git push origin feature/your-feature
```

### 5. Pull Request Açın

GitHub'da Pull Request açarken:

**PR Title Format:**
```
feat(scope): Add amazing feature
```

**PR Description Template:**
```markdown
## 📝 Açıklama
Bu PR ne yapıyor? Hangi problemi çözüyor?

## 🔗 İlgili Issue
Closes #123

## 🧪 Test Edilen Senaryolar
- [ ] Özellik X test edildi
- [ ] Özellik Y test edildi
- [ ] Tüm diller test edildi (en, tr, pt-BR)

## 📸 Screenshots
(Varsa ekran görüntüleri ekleyin)

## ✅ Checklist
- [ ] Kod ESLint kurallarına uygun
- [ ] TypeScript hataları yok
- [ ] i18n çevirileri eklendi
- [ ] Dokümantasyon güncellendi
- [ ] Tests eklendi/güncellendi
- [ ] Build başarılı
```

### 6. Code Review Süreci

- 🔍 Maintainer'lar kodunuzu inceleyecek
- 💬 Değişiklik önerileri yapabilir
- ✏️ Gerekli düzeltmeleri yapın
- ✅ Onaylandıktan sonra merge edilir

---

## 🧪 Testing

### Unit Tests

```bash
# Tests çalıştır
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Manual Testing Checklist

PR açmadan önce test edin:

**Frontend:**
- [ ] Tüm diller çalışıyor (en, tr, pt-BR)
- [ ] Responsive design (mobil, tablet, desktop)
- [ ] Dark mode çalışıyor
- [ ] Browser compatibility (Chrome, Firefox, Safari)

**Backend:**
- [ ] API endpoints çalışıyor
- [ ] Database queries optimize
- [ ] Error handling mevcut
- [ ] Validation çalışıyor

**Authentication:**
- [ ] Login/logout çalışıyor
- [ ] Admin panel erişim kontrolü
- [ ] Session yönetimi

**Payments (eğer ilgiliyse):**
- [ ] Stripe checkout çalışıyor
- [ ] Webhook handling doğru
- [ ] Order creation başarılı

---

## 📚 Dokümantasyon

### Ne Zaman Dokümantasyon Güncellenir?

- ✅ Yeni özellik eklediğinizde
- ✅ API değişikliği yaptığınızda
- ✅ Configuration değiştiğinde
- ✅ Breaking change olduğunda

### Hangi Dosyaları Güncelleyin?

| Değişiklik | Güncellenecek Dosya |
|------------|---------------------|
| Yeni özellik | `README.md`, `CHANGELOG.md` |
| API değişikliği | `ARCHITECTURE.md` |
| Kurulum adımı | `SETUP.md`, `QUICKSTART.md` |
| AI/SpecPulse | `CLAUDE.md`, `SPECPULSE-GUIDE.md` |

### Dokümantasyon Yazım Stili

- ✅ Açık ve net Türkçe/İngilizce
- ✅ Kod örnekleri ekleyin
- ✅ Emoji kullanın (okunaklılık için)
- ✅ Screenshots ekleyin (UI değişikliklerinde)

---

## 🐛 Bug Raporlama

### Issue Template

```markdown
**Bug Açıklaması**
Net ve kısa bug açıklaması.

**Adımlar**
1. '...' sayfasına git
2. '....' butonuna tıkla
3. '....' sayfasına geç
4. Hatayı gör

**Beklenen Davranış**
Ne olmasını bekliyordunuz?

**Ekran Görüntüsü**
(Varsa ekleyin)

**Ortam:**
- OS: [örn: macOS, Windows, Linux]
- Browser: [örn: Chrome 120]
- Node.js: [örn: 18.17.0]

**Ek Bilgi**
Eklemek istediğiniz başka bilgi var mı?
```

---

## ⚡ Hızlı Referans

### Sık Kullanılan Komutlar

```bash
# Development
npm run dev                 # Dev server başlat
npm run build              # Production build
npm run lint               # ESLint çalıştır

# Database
npm run db:generate        # Prisma client oluştur
npm run db:push           # Schema'yı DB'ye uygula
npm run db:studio         # Prisma Studio aç

# Git
git pull upstream develop  # Upstream'den güncellemeleri al
git push origin feature    # Branch'i push et
```

### Yardım Alın

- 💬 GitHub Issues: Soru sorun
- 📧 Email: admin@dulundu.dev
- 📚 Docs: [SETUP.md](./SETUP.md)

---

## 🙏 Teşekkürler

Katkılarınız için teşekkür ederiz! Her katkı, projeyi daha iyi hale getirir.

---

**Son Güncelleme**: 2025-11-14
**Versiyon**: 1.0.0
