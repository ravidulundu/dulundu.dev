import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, ArrowLeft } from "lucide-react";
import { getTranslations } from 'next-intl/server';

interface BlogPostProps {
  post: {
    slug: string;
    publishedAt: Date | null;
    featured: boolean;
    translations: {
      title: string;
      excerpt: string;
      content: string;
      coverImage: string | null;
    }[];
  };
  locale: string;
}

export default async function BlogPost({ post, locale }: BlogPostProps) {
  const translation = post.translations[0];
  const t = await getTranslations({ locale, namespace: 'blog' });

  if (!translation || !post.publishedAt) {
    return null;
  }

  return (
    <article className="min-h-screen bg-muted">
      {/* Back Button */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center text-primary hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('backToBlog')}
          </Link>
        </div>
      </div>

      {/* Cover Image */}
      {translation.coverImage && (
        <div className="relative w-full h-96 overflow-hidden bg-muted">
          <Image
            src={translation.coverImage}
            alt={translation.title}
            fill
            className="object-cover opacity-90"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {translation.title}
          </h1>

          <div className="flex items-center text-muted-foreground">
            <Calendar className="w-5 h-5 mr-2" />
            <time dateTime={post.publishedAt.toISOString()}>
              {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
            </time>
          </div>

          {translation.excerpt && (
            <p className="text-xl text-muted-foreground mt-6 italic border-l-4 border-primary pl-4">
              {translation.excerpt}
            </p>
          )}
        </header>

        {/* Blog Content */}
        <div
          className="prose prose-lg prose-blue max-w-none
            prose-headings:font-bold prose-headings:text-foreground
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:bg-muted prose-code:text-pink-600 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
            prose-pre:bg-muted prose-pre:text-foreground
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
            prose-li:text-muted-foreground prose-li:mb-2
            prose-img:rounded-lg prose-img:shadow-lg
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: translation.content }}
        />
      </div>
    </article>
  );
}
