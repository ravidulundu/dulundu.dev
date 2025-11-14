'use client';

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, ArrowRight, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

interface BlogCardProps {
  post: {
    slug: string;
    publishedAt: Date | string | null;
    featured: boolean;
    translations: {
      title: string;
      excerpt: string;
      coverImage: string | null;
    }[];
  };
  locale: string;
}

export default function BlogCard({ post, locale }: BlogCardProps) {
  const t = useTranslations('blog');
  const translation = post.translations[0]; // Already filtered by locale in the API

  if (!translation || !post.publishedAt) {
    return null;
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Cover Image */}
      {translation.coverImage ? (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={translation.coverImage}
            alt={translation.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {post.featured && (
            <div className="absolute top-4 right-4 z-10">
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3 fill-current" />
                {t('featured')}
              </Badge>
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-48 bg-primary/10 flex items-center justify-center">
          <div className="text-primary/30 text-6xl font-bold">
            {translation.title.charAt(0).toUpperCase()}
          </div>
          {post.featured && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3 fill-current" />
                {t('featured')}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <CardContent className="p-6">
        {/* Date */}
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {translation.title}
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground line-clamp-3">
          {translation.excerpt}
        </p>
      </CardContent>

      {/* Read More Link */}
      <CardFooter className="p-6 pt-0">
        <Button variant="link" asChild className="p-0 h-auto">
          <Link href={`/${locale}/blog/${post.slug}`} className="group/link">
            {t('readMore')}
            <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
