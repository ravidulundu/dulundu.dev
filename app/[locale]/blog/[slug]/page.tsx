import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import BlogPost from "@/components/blog/BlogPost";
import { getTranslations } from 'next-intl/server';
import PageWrapper from '@/components/layout/PageWrapper';

async function getPost(slug: string, locale: string) {
  const post = await db.post.findUnique({
    where: {
      slug,
    },
    include: {
      translations: {
        where: {
          locale,
        },
      },
    },
  });

  // Check if post exists and is published
  if (
    !post ||
    post.status !== 'published' ||
    !post.publishedAt ||
    post.publishedAt > new Date() ||
    post.translations.length === 0
  ) {
    return null;
  }

  return post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const translation = post.translations[0];

  return {
    title: translation.title,
    description: translation.excerpt,
    openGraph: {
      title: translation.title,
      description: translation.excerpt,
      images: translation.coverImage ? [translation.coverImage] : [],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale);

  if (!post) {
    notFound();
  }

  const translation = post.translations[0];

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = translation.content?.split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200);

  // Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: translation.title,
    description: translation.excerpt,
    image: translation.coverImage || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Ege Dulundu',
      url: 'https://dulundu.dev',
      jobTitle: 'WordPress Expert & Full-Stack Developer',
    },
    publisher: {
      '@type': 'Person',
      name: 'Ege Dulundu',
      url: 'https://dulundu.dev',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://dulundu.dev/${locale}/blog/${slug}`,
    },
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://dulundu.dev/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `https://dulundu.dev/${locale}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: translation.title,
        item: `https://dulundu.dev/${locale}/blog/${slug}`,
      },
    ],
  };

  return (
    <PageWrapper>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <BlogPost post={post} locale={locale} readingTime={readingTime} />
    </PageWrapper>
  );
}
