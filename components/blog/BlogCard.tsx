import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, ArrowRight, Star } from "lucide-react";

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
  const translation = post.translations[0]; // Already filtered by locale in the API

  if (!translation || !post.publishedAt) {
    return null;
  }

  return (
    <article className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
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
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-6xl font-bold opacity-20">
            {translation.title.charAt(0).toUpperCase()}
          </div>
          {post.featured && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Date */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {translation.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {translation.excerpt}
        </p>

        {/* Read More Link */}
        <Link
          href={`/${locale}/blog/${post.slug}`}
          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors group/link"
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
