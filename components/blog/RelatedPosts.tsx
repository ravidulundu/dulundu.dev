import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/db';

interface RelatedPostsProps {
  currentPostSlug: string;
  locale: string;
}

async function getRelatedPosts(currentPostSlug: string, locale: string, limit = 3) {
  // Fetch all published posts except the current one
  const posts = await db.post.findMany({
    where: {
      slug: {
        not: currentPostSlug,
      },
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
    take: limit,
  });

  return posts;
}

export async function RelatedPosts({ currentPostSlug, locale }: RelatedPostsProps) {
  const t = await getTranslations({ locale, namespace: 'blog' });
  const relatedPosts = await getRelatedPosts(currentPostSlug, locale);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-border pt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {t('relatedPosts')}
        </h2>
        <p className="text-muted-foreground">
          {t('relatedPostsDescription')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => {
          const translation = post.translations[0];
          if (!translation || !post.publishedAt) return null;

          return (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group"
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                {translation.coverImage && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={translation.coverImage}
                      alt={translation.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="default">{t('featured')}</Badge>
                      </div>
                    )}
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {translation.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  {translation.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {translation.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      <time dateTime={post.publishedAt.toISOString()}>
                        {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                      </time>
                    </div>

                    <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t('readMore')}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
