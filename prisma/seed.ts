import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { generatePriceMap } from '../lib/currency'

const prisma = new PrismaClient()

const locales = ['en', 'tr', 'pt-BR'] as const
type Locale = typeof locales[number]

type BlogTranslation = {
  title: string
  excerpt: string
  content: string
  coverImage: string
}

type ProductTranslation = {
  title: string
  description: string
  content: string
  features: string[]
  coverImage: string
}

type ProductPriceMap = Record<string, string>

type ProjectTranslation = {
  title: string
  description: string
  technologies: string[]
  images: string[]
}

const blogPosts: Array<{
  slug: string
  status: string
  featured: boolean
  publishedAt: Date
  translations: Record<Locale, BlogTranslation>
}> = [
  {
    slug: 'headless-wordpress-at-scale',
    status: 'published',
    featured: true,
    publishedAt: new Date('2024-10-12'),
    translations: {
      en: {
        title: 'Headless WordPress at Scale',
        excerpt:
          'A practical checklist for pairing Next.js and WordPress to deliver blazing fast multilingual sites.',
        content: `<p>Going headless lets us keep the publishing comfort of WordPress while shipping a modern UX with Next.js. The trick is building pipelines that keep editors productive and the frontend statically optimized.</p>
<p>We cover how to structure content models, sync locales without duplicated effort, and automate revalidation so marketing can publish whenever they want.</p>
<ul>
  <li>Use WPGraphQL for reliable content access</li>
  <li>Mirror locales between CMS and frontend routing</li>
  <li>Bake image optimization into the pipeline</li>
</ul>`,
        coverImage:
          'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80'
      },
      tr: {
        title: 'Headless WordPress ile Olceklenebilirlik',
        excerpt:
          'Next.js ve WordPress ikilisini kullanarak hizli ve cok dilli siteler kurarken uyguladigimiz adimlar.',
        content: `<p>Headless yaklasim sayesinde WordPress editor deneyimini korurken, Next.js tarafinda tamamen modern bir arayuz sunuyoruz. Butun mesele icerik modellerini dogru kurmak ve yeniden olusturma sureclerini otomatiklestirmek.</p>
<p>Bu yazida locale yapisini nasil organize ettigimizi, pazarlama ekibinin yayin akisini nasil ozgurlestirdigimizi ve cache temizleme adimlarini anlatiyoruz.</p>
<ul>
  <li>WPGraphQL ile tutarli veri modeli</li>
  <li>CMS ve frontend rota yapisini esitlemek</li>
  <li>Gorsel optimizasyonunu pipeline icine almak</li>
</ul>`,
        coverImage:
          'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80'
      },
      'pt-BR': {
        title: 'WordPress Headless em Escala',
        excerpt:
          'Como combinamos Next.js e WordPress para entregar sites multilíngues super rápidos.',
        content: `<p>Com a abordagem headless mantemos a experiência familiar do WordPress e ganhamos uma camada de frontend ultra performática em Next.js.</p>
<p>Mostramos a estrutura de conteúdo, sincronização de idiomas e a automação que libera o time de marketing para publicar a qualquer momento.</p>
<ul>
  <li>WPGraphQL como fonte consistente</li>
  <li>Rotas de locale alinhadas entre CMS e frontend</li>
  <li>Imagens otimizadas direto no pipeline</li>
</ul>`,
        coverImage:
          'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80'
      }
    }
  },
  {
    slug: 'shipping-digital-products-faster',
    status: 'published',
    featured: false,
    publishedAt: new Date('2024-11-05'),
    translations: {
      en: {
        title: 'Shipping Digital Products Faster',
        excerpt:
          'Lessons from automating payments, fulfillment, and localization for premium downloads.',
        content: `<p>Automating the boring parts of digital product sales frees us to focus on content and support. Stripe, Prisma, and localized marketing pages keep everything in sync.</p>
<p>From webhook driven license delivery to localized landing pages, here is the stack we rely on.</p>
<ol>
  <li>Stripe Checkout + customer portal</li>
  <li>Background workers for fulfillment</li>
  <li>Next-intl for copy parity across locales</li>
</ol>`,
        coverImage:
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80'
      },
      tr: {
        title: 'Dijital Urunleri Daha Hizli Yayina Almak',
        excerpt:
          'Odeme, teslimat ve localization sureclerini otomatiklestirirken ogrendigimiz dersler.',
        content: `<p>Stripe, Prisma ve otomatik webhook akislari sayesinde lisans dagitimini elle takip etmiyoruz. Boylece ekip gercekten deger katan gelistirmelere odaklanabiliyor.</p>
<p>Landing sayfalarini next-intl ile cevirirken, destek ekibi icin de tek bir kaynak olusturuyoruz.</p>
<ol>
  <li>Stripe Checkout + musterinin kendi portali</li>
  <li>Arka planda calisan teslimat servisleri</li>
  <li>Tum locale'lerde ayni metin kalitesi</li>
</ol>`,
        coverImage:
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80'
      },
      'pt-BR': {
        title: 'Entregando Produtos Digitais Mais Rápido',
        excerpt:
          'Automação de pagamentos, entrega e localização para downloads premium.',
        content: `<p>Quando automatizamos pagamentos e entrega, sobra tempo para melhorar o produto. Stripe e Prisma garantem rastreabilidade enquanto o conteúdo localizado aumenta a conversão.</p>
<p>Veja como usamos webhooks para liberar licenças e como mantemos páginas de marketing sincronizadas em três idiomas.</p>
<ol>
  <li>Stripe Checkout e portal do cliente</li>
  <li>Workers em background para entrega</li>
  <li>next-intl para consistência multilingue</li>
</ol>`,
        coverImage:
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80'
      }
    }
  }
]

const products: Array<{
  slug: string
  type: string
  status: string
  price: string
  currency: string
  featured: boolean
  translations: Record<Locale, ProductTranslation>
  prices?: ProductPriceMap
}> = [
  {
    slug: 'wp-performance-audit',
    type: 'consulting',
    status: 'published',
    price: '1200',
    currency: 'USD',
    featured: true,
    translations: {
      en: {
        title: 'WordPress Performance Audit',
        description:
          'Deep dive into Core Web Vitals, caching, and database bottlenecks tailored for content heavy sites.',
        content:
          '<p>Includes 30+ page report, prioritized backlog, and pairing session with your engineering team.</p>',
        features: [
          'Full Lighthouse and WebPageTest runbook',
          'Database + object cache review',
          'Actionable backlog prioritized for effort vs impact'
        ],
        coverImage:
          'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80'
      },
      tr: {
        title: 'WordPress Performans Analizi',
        description:
          'Core Web Vitals, cache ve veritabani darbogazlarini hedefleyen kapsamli inceleme.',
        content:
          '<p>30+ sayfalik rapor, onceliklendirilmis backlog ve ekip ile canli calisma seansi dahildir.</p>',
        features: [
          'Lighthouse ve WebPageTest ceklistesi',
          'Veritabani ve object cache incelemesi',
          'Efor/etki oranina gore siralanmis backlog'
        ],
        coverImage:
          'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80'
      },
      'pt-BR': {
        title: 'Auditoria de Performance WordPress',
        description:
          'Análise profunda de Core Web Vitals, cache e gargalos de banco para portais de conteúdo.',
        content:
          '<p>Relatório completo, plano de ação priorizado e sessão de pareamento com o seu time.</p>',
        features: [
          'Rotina completa de Lighthouse/WebPageTest',
          'Revisão de banco de dados e object cache',
          'Backlog priorizado por esforço e impacto'
        ],
        coverImage:
          'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1200&q=80'
      }
    }
    ,
    prices: {
      USD: '1200',
      TRY: '42000',
      BRL: '6200'
    }
  },
  {
    slug: 'ai-content-suite',
    type: 'wordpress-plugin',
    status: 'published',
    price: '149',
    currency: 'USD',
    featured: false,
    translations: {
      en: {
        title: 'AI Content Suite for WordPress',
        description:
          'Plan, translate, and optimize posts without leaving the editor. Built for multi-locale teams.',
        content:
          '<p>Generate outlines, sync translations, and push updates to Preview in one click.</p>',
        features: [
          'Prompt templates for product updates',
          'Inline translation suggestions',
          'SEO checklist per locale'
        ],
        coverImage:
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
      },
      tr: {
        title: 'WordPress icin AI Content Suite',
        description:
          'Yazilari planla, cevir ve optimize et. Hepsi tek bir editor deneyiminde.',
        content:
          '<p>Outline olustur, ceviri onerilerini kontrol et ve on izlemeye tek tikla gonder.</p>',
        features: [
          'Urun notlari icin hazir prompt setleri',
          'Satir ici ceviri onerileri',
          'Her locale icin SEO kontrol listesi'
        ],
        coverImage:
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
      },
      'pt-BR': {
        title: 'AI Content Suite para WordPress',
        description:
          'Planeje, traduza e otimize artigos sem sair do editor. Ideal para times multilíngues.',
        content:
          '<p>Crie outlines, sincronize traduções e publique previews em segundos.</p>',
        features: [
          'Modelos de prompt para lançamentos',
          'Sugestões de tradução em linha',
          'Checklist de SEO por idioma'
        ],
        coverImage:
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'
      }
    }
    ,
    prices: {
      USD: '149',
      TRY: '4990',
      BRL: '790'
    }
  }
]

async function upsertProductPrices(productId: string, priceMap: ProductPriceMap) {
  const entries = Object.entries(priceMap)
  for (const [currency, amount] of entries) {
    await prisma.productPrice.upsert({
      where: {
        productId_currency: {
          productId,
          currency
        }
      },
      update: {
        amount
      },
      create: {
        productId,
        currency,
        amount
      }
    })
  }
}

const projects: Array<{
  slug: string
  status: string
  category: string
  url: string
  featured: boolean
  order: number
  translations: Record<Locale, ProjectTranslation>
}> = [
  {
    slug: 'dulundu-commerce-rebuild',
    status: 'published',
    category: 'web-development',
    url: 'https://commerce.dulundu.dev',
    featured: true,
    order: 1,
    translations: {
      en: {
        title: 'Dulundu Commerce Rebuild',
        description:
          'Replatformed the entire store to a Next.js + Stripe stack with localized checkout.',
        technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Prisma'],
        images: [
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80'
        ]
      },
      tr: {
        title: 'Dulundu Commerce Yeniden Yapilanmasi',
        description:
          'Butun magazayi Next.js ve Stripe uzerine tasidik, cok dilli odeme akislarini kurguladik.',
        technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Prisma'],
        images: [
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80'
        ]
      },
      'pt-BR': {
        title: 'Replatforma do Dulundu Commerce',
        description:
          'Migramos a loja inteira para Next.js com checkout Stripe traduzido para três idiomas.',
        technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Prisma'],
        images: [
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80'
        ]
      }
    }
  },
  {
    slug: 'helix-marketing-site',
    status: 'published',
    category: 'wordpress',
    url: 'https://helix.dulundu.dev',
    featured: false,
    order: 2,
    translations: {
      en: {
        title: 'Helix Marketing Site',
        description:
          'Marketing site with live component library, powered by WordPress as a headless CMS.',
        technologies: ['WordPress', 'WPGraphQL', 'Tailwind CSS'],
        images: [
          'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80'
        ]
      },
      tr: {
        title: 'Helix Pazarlama Sitesi',
        description:
          'Headless WordPress ile calisan, bilesen kutuphanesi dogrudan editore acik olan pazarlama sitesi.',
        technologies: ['WordPress', 'WPGraphQL', 'Tailwind CSS'],
        images: [
          'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80'
        ]
      },
      'pt-BR': {
        title: 'Site de Marketing Helix',
        description:
          'Site com biblioteca de componentes ao vivo, administrado pelo WordPress headless.',
        technologies: ['WordPress', 'WPGraphQL', 'Tailwind CSS'],
        images: [
          'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80'
        ]
      }
    }
  }
]

async function seedAdmin(adminEmail: string, adminPassword: string) {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('Admin user already exists')
    return
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date()
    }
  })

  console.log('Admin user created:', admin.email)
  console.log('Password:', adminPassword)
  console.log('IMPORTANT: Change this password after first login!')
}

async function seedBlogPosts() {
  for (const post of blogPosts) {
    const existing = await prisma.post.findUnique({
      where: { slug: post.slug }
    })

    if (existing) {
      console.log('Blog post already exists:', post.slug)
      continue
    }

    await prisma.post.create({
      data: {
        slug: post.slug,
        status: post.status,
        featured: post.featured,
        publishedAt: post.publishedAt,
        translations: {
          create: locales.map((locale) => ({
            locale,
            title: post.translations[locale].title,
            excerpt: post.translations[locale].excerpt,
            content: post.translations[locale].content,
            coverImage: post.translations[locale].coverImage
          }))
        }
      }
    })

    console.log('Blog post created:', post.slug)
  }
}

async function seedProducts() {
  for (const product of products) {
    const existing = await prisma.product.findUnique({
      where: { slug: product.slug }
    })

    const priceMap = product.prices ?? generatePriceMap(product.price, product.currency)

    if (existing) {
      console.log('Product already exists:', product.slug)
      await upsertProductPrices(existing.id, priceMap)
      continue
    }

    const created = await prisma.product.create({
      data: {
        slug: product.slug,
        type: product.type,
        status: product.status,
        price: product.price,
        currency: product.currency,
        featured: product.featured,
        translations: {
          create: locales.map((locale) => ({
            locale,
            title: product.translations[locale].title,
            description: product.translations[locale].description,
            content: product.translations[locale].content,
            features: product.translations[locale].features,
            coverImage: product.translations[locale].coverImage
          }))
        }
      }
    })

    await upsertProductPrices(created.id, priceMap)

    console.log('Product created:', product.slug)
  }
}

async function seedProjects() {
  for (const project of projects) {
    const existing = await prisma.project.findUnique({
      where: { slug: project.slug }
    })

    if (existing) {
      console.log('Project already exists:', project.slug)
      continue
    }

    await prisma.project.create({
      data: {
        slug: project.slug,
        status: project.status,
        category: project.category,
        url: project.url,
        featured: project.featured,
        order: project.order,
        translations: {
          create: locales.map((locale) => ({
            locale,
            title: project.translations[locale].title,
            description: project.translations[locale].description,
            technologies: project.translations[locale].technologies,
            images: project.translations[locale].images
          }))
        }
      }
    })

    console.log('Project created:', project.slug)
  }
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@dulundu.dev'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  await seedAdmin(adminEmail, adminPassword)
  await seedBlogPosts()
  await seedProducts()
  await seedProjects()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
