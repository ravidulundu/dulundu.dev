# SpecPulse Directory

Bu klasör SpecPulse Specification-Driven Development framework'ü tarafından kullanılmaktadır.

## 📁 Klasör Yapısı

```
.specpulse/
├── README.md                    # Bu dosya
├── cache/                       # SpecPulse cache (gitignore'da)
├── specs/                       # Özellik belirtimleri (spec'ler)
│   └── blog-system-example.md  # Örnek blog system spec
├── plans/                       # Uygulama planları
├── tasks/                       # Görev listeleri
├── memory/                      # Proje hafızası ve kararlar
│   └── notes/
├── templates/                   # Custom spec template'leri
│   └── decomposition/
├── checkpoints/                 # Checkpoints (gitignore'da)
└── docs/                        # SpecPulse dokümantasyonu
```

## 🎯 Kullanım

### Claude Code'da

SpecPulse komutları doğrudan Claude Code içinde kullanılır:

```
/sp-pulse "özellik açıklaması"    # Yeni özellik başlat
/sp-spec <feature-name>           # Spec'i genişlet
/sp-plan <feature-name>           # Plan oluştur
/sp-task <feature-name>           # Görevlere böl
/sp-execute <feature-name>        # Uygula
```

### Terminal'de

```bash
# Spec oluştur
specpulse spec create blog-system "Blog sistemi ekle"

# Spec'i göster
specpulse spec show blog-system

# Durum
specpulse status
```

## 📝 Örnek Workflow

### Blog Sistemi Ekleme

```
1. /sp-pulse "Blog sistemi ekle"
   → .specpulse/specs/blog-system.md oluşturulur

2. /sp-spec blog-system
   → Spec detaylandırılır (database, API, UI)

3. /sp-plan blog-system
   → .specpulse/plans/blog-system.md oluşturulur

4. /sp-task blog-system
   → .specpulse/tasks/blog-system.json oluşturulur

5. /sp-execute blog-system
   → Task'lar sırayla uygulanır
```

## 📚 Daha Fazla Bilgi

Detaylı kılavuz için proje kökündeki dosyalara bakın:
- `SPECPULSE-GUIDE.md` - Tam kullanım kılavuzu
- `PROGRESS.md` - Proje ilerleme durumu

## ⚠️ Not

- `specs/` ve `plans/` klasörlerini Git'e commit etmek ekip çalışması için faydalıdır
- `cache/` ve `checkpoints/` klasörleri .gitignore'da (local working files)
