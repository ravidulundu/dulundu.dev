import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('portfolio');
  const previewImage = images && images.length > 0 ? images[0] : null;

  return (
    <Link href={`/${locale}/portfolio/${slug}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Image */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {previewImage ? (
            <Image
              src={previewImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
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
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="gap-1 shadow-lg">
                <Star className="w-4 h-4 fill-current" />
                {t('featured')}
              </Badge>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge variant="default" className="shadow-lg">
              {category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {description}
          </p>

          {/* View Project Link */}
          <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
            {t('viewProject')}
            <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
