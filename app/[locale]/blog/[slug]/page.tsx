import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import BlogPost from "@/components/blog/BlogPost";
import { getTranslations } from 'next-intl/server';

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

  return <BlogPost post={post} locale={locale} />;
}
