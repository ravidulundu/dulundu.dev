import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  images: string[];
  locale: string;
}

export default function ProjectCard({
  slug,
  title,
  description,
  category,
  featured,
  images,
  locale,
}: ProjectCardProps) {
  const previewImage = images && images.length > 0 ? images[0] : null;

  return (
    <Link
      href={`/${locale}/portfolio/${slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
        {previewImage ? (
          <Image
            src={previewImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium shadow-lg">
            <Star className="w-4 h-4 fill-white" />
            Featured
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          {category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
          {description}
        </p>

        {/* Read More Link */}
        <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
          View Project
          <svg
            className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
