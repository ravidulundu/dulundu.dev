'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, ArrowRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { scaleIn, fadeInUp } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface InteractiveProjectCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  images: string[];
  locale: string;
  technologies?: string[];
  url?: string | null;
  index?: number;
}

export function InteractiveProjectCard({
  slug,
  title,
  description,
  category,
  featured,
  images,
  locale,
  technologies = [],
  url,
  index = 0,
}: InteractiveProjectCardProps) {
  const previewImage = images && images.length > 0 ? images[0] : null;
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      variants={scaleIn}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer h-full">
        <Link href={`/${locale}/portfolio/${slug}`}>
          {/* Image Container with Overlay */}
          <div className="relative aspect-video bg-muted overflow-hidden">
            {previewImage ? (
              <>
                <Image
                  src={previewImage}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
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
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-4 right-4 z-10"
              >
                <Badge variant="secondary" className="gap-1 shadow-lg backdrop-blur-sm">
                  <Star className="w-4 h-4 fill-current" />
                  Featured
                </Badge>
              </motion.div>
            )}

            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-4 left-4 z-10"
            >
              <Badge variant="default" className="shadow-lg backdrop-blur-sm">
                {category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
            </motion.div>

            {/* Hover Overlay Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10"
            >
              <div className="flex flex-col items-center gap-3">
                <Button
                  size="lg"
                  className="gap-2 shadow-xl"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/${locale}/portfolio/${slug}`;
                  }}
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </Button>
                {url && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-background/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(url, '_blank');
                    }}
                  >
                    Live Demo
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 mb-4 min-h-[3rem]">{description}</p>

            {/* Technologies */}
            {technologies && technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {technologies.slice(0, 3).map((tech, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {technologies.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{technologies.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* View Project Link */}
            <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
              View Project
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
