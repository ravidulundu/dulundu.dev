import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, ArrowLeft, Clock, Github, Linkedin } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SocialShare } from './SocialShare';
import { BlogCTA } from './BlogCTA';
import { NewsletterSignup } from './NewsletterSignup';
import { RelatedPosts } from './RelatedPosts';

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
  readingTime: number;
}

export default async function BlogPost({ post, locale, readingTime }: BlogPostProps) {
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

          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <time dateTime={post.publishedAt.toISOString()}>
                {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
              </time>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{readingTime} {t('minuteRead')}</span>
            </div>
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

        {/* Social Share */}
        <div className="mt-8">
          <SocialShare
            title={translation.title}
            url={`/${locale}/blog/${post.slug}`}
          />
        </div>

        {/* CTA Section */}
        <BlogCTA locale={locale} />

        {/* Author Bio */}
        <Card className="mt-8 bg-card border-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  ED
                </div>
              </div>

              {/* Author Info */}
              <div className="flex-1">
                <div className="mb-2">
                  <Badge variant="secondary" className="mb-2">
                    {t('author')}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Ege Dulundu
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  WordPress Expert & Full-Stack Developer
                </p>
                <p className="text-muted-foreground mb-4">
                  {t('authorBio')}
                </p>

                {/* Social Links */}
                <div className="flex gap-4">
                  <a
                    href="https://github.com/dulundu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/egedulundu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <Link
                    href={`/${locale}/portfolio`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t('viewPortfolio')} →
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Signup */}
        <NewsletterSignup />

        {/* Related Posts */}
        <RelatedPosts currentPostSlug={post.slug} locale={locale} />
      </div>
    </article>
  );
}
