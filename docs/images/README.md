# 📸 Project Screenshots

Bu klasör, projenin ekran görüntülerini içerir. README.md ve diğer dokümantasyon dosyalarında kullanılır.

## 📁 Dosya Yapısı

```
docs/images/
├── homepage/
│   ├── hero-section.png
│   ├── features-section.png
│   └── testimonials-section.png
├── admin/
│   ├── dashboard.png
│   ├── products-list.png
│   ├── blog-editor.png
│   └── portfolio-management.png
├── public/
│   ├── blog-list.png
│   ├── blog-detail.png
│   ├── portfolio-showcase.png
│   └── product-detail.png
├── features/
│   ├── language-switcher.png
│   ├── dark-mode.png
│   └── responsive-design.png
└── stripe/
    ├── checkout-page.png
    └── success-page.png
```

## 📝 Naming Convention

Dosya isimlendirme kuralları:
- Küçük harfler kullanın
- Kelimeler arası tire (-) kullanın
- Açıklayıcı isimler verin
- Sayfa ismini içersin

**Örnekler:**
```
✅ homepage-hero-section.png
✅ admin-dashboard-dark-mode.png
✅ blog-detail-mobile-view.png

❌ Screenshot1.png
❌ img_2024.png
❌ Untitled.png
```

## 🖼️ Screenshot Gereksinimleri

### Boyutlar

| Tip | Önerilen Boyut | Format |
|-----|---------------|--------|
| Desktop | 1920x1080 | PNG |
| Tablet | 1024x768 | PNG |
| Mobile | 375x667 | PNG |
| Thumbnail | 800x450 | PNG/JPG |

### Kalite

- **Format**: PNG (transparency için) veya JPG (foto için)
- **Çözünürlük**: Retina display için 2x (3840x2160)
- **Compression**: Optimize edilmiş (TinyPNG kullanın)
- **Dosya Boyutu**: < 500KB (ideal)

### İçerik

- ✅ Gerçek data kullanın (lorem ipsum değil)
- ✅ Professional appearance
- ✅ Clean, clutter-free
- ✅ Önemli features'ı highlight edin
- ❌ Hassas bilgiler (email, şifreler, API keys)
- ❌ Placeholder images
- ❌ Development errors

## 📋 Gerekli Screenshots Listesi

### Priority 1 (Mutlaka Eklenecek)
- [ ] `homepage/hero-section.png` - Ana sayfa hero
- [ ] `admin/dashboard.png` - Admin dashboard
- [ ] `admin/blog-editor.png` - Blog editor (TipTap)
- [ ] `public/blog-list.png` - Blog liste sayfası
- [ ] `public/portfolio-showcase.png` - Portfolio showcase
- [ ] `features/language-switcher.png` - Dil değiştirici
- [ ] `features/dark-mode.png` - Dark mode comparison

### Priority 2 (Önemli)
- [ ] `admin/products-list.png` - Ürün listesi
- [ ] `admin/portfolio-management.png` - Portfolio yönetimi
- [ ] `public/product-detail.png` - Ürün detay sayfası
- [ ] `stripe/checkout-page.png` - Stripe checkout
- [ ] `features/responsive-design.png` - Responsive showcase

### Priority 3 (Opsiyonel)
- [ ] `homepage/features-section.png` - Özellikler bölümü
- [ ] `public/blog-detail.png` - Blog detay sayfası
- [ ] `admin/orders-list.png` - Sipariş yönetimi
- [ ] `stripe/success-page.png` - Ödeme başarılı sayfası
- [ ] Multiple language screenshots (TR, EN, PT-BR)

## 🛠️ Screenshot Alma Araçları

### Tarayıcı Araçları
- **Chrome DevTools**: Device emulation için
- **Firefox Developer Tools**: Screenshot feature
- **Safari Web Inspector**: Responsive mode

### Desktop Araçları
- **macOS**: Cmd + Shift + 4
- **Windows**: Windows + Shift + S
- **Linux**: Flameshot, Shutter

### Online Araçları
- [Screely](https://www.screely.com/) - Browser mockups
- [Browserframe](https://browserframe.com/) - Browser frames
- [Pika](https://pika.style/) - Code screenshots

## 🎨 Editing Guidelines

### Annotate Important Features
```
1. Highlight with colored boxes (red, blue)
2. Add arrows to point features
3. Add text labels
4. Use blur for sensitive info
```

### Recommended Tools
- **Figma**: Professional editing
- **Sketch**: macOS design tool
- **Photopea**: Free Photoshop alternative (web)
- **GIMP**: Free desktop editor

## 📝 Adding to Documentation

### README.md'de Kullanım

```markdown
## 📸 Screenshots

### Homepage
![Homepage Hero](./docs/images/homepage/hero-section.png)

### Admin Dashboard
![Admin Dashboard](./docs/images/admin/dashboard.png)
```

### Relative Paths

README.md'den:
```markdown
![Alt text](./docs/images/folder/file.png)
```

SETUP.md'den:
```markdown
![Alt text](../docs/images/folder/file.png)
```

## 🔄 Update Process

1. Screenshot alın (yukarıdaki guidelines'a göre)
2. Dosyayı optimize edin (TinyPNG, ImageOptim)
3. Doğru klasöre yerleştirin
4. Anlamlı isim verin
5. Dokümantasyona ekleyin
6. Git'e commit edin

```bash
git add docs/images/
git commit -m "docs: add homepage hero screenshot"
git push
```

## 📊 Mevcut Durum

| Kategori | Eklenmiş | Toplam | %  |
|----------|----------|--------|-----|
| Homepage | 0 | 3 | 0% |
| Admin | 0 | 4 | 0% |
| Public | 0 | 4 | 0% |
| Features | 0 | 3 | 0% |
| Stripe | 0 | 2 | 0% |
| **TOPLAM** | **0** | **16** | **0%** |

---

## 🎯 Next Steps

1. Development sunucusunu başlat: `npm run dev`
2. Sayfaları ziyaret edin ve screenshot alın
3. Screenshots'ları optimize edin
4. Bu klasöre ekleyin
5. README.md'ye ekleyin
6. Commit & push!

---

**Maintained by**: [@ravidulundu](https://github.com/ravidulundu)
**Last Updated**: 2025-11-14
