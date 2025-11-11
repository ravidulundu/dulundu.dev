import type { Post, PostTranslation } from '@prisma/client';
import type { BlogFormInitialData } from '@/components/admin/BlogForm';

export type AdminPostWithRelations = Post & {
  translations: PostTranslation[];
};

export function mapPostToFormData(post: AdminPostWithRelations): BlogFormInitialData {
  return {
    id: post.id,
    slug: post.slug,
    status: post.status,
    featured: post.featured,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    translations: post.translations.map((t) => ({
      locale: t.locale,
      title: t.title,
      excerpt: t.excerpt,
      content: t.content,
      coverImage: t.coverImage || '',
    })),
  };
}
