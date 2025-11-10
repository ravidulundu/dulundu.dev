import { db } from "@/lib/db";
import BlogCard from "@/components/blog/BlogCard";
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

async function getPosts(locale: string) {
  const posts = await db.post.findMany({
    where: {
      status: 'published',
      publishedAt: {
        lte: new Date(),
      },
      translations: {
        some: {
          locale,
        },
      },
    },
    include: {
      translations: {
        where: {
          locale,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
  });

  return posts;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'blog' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function BlogPage({
  params,
}: {
  params: { locale: string };
}) {
  const posts = await getPosts(params.locale);
  const t = await getTranslations({ locale: params.locale, namespace: 'blog' });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('noPostsYet')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} locale={params.locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
