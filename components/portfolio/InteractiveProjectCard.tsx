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
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-accent transition-all hover:border-primary/50">
      {/* Project Image */}
      <div className="relative h-64 overflow-hidden bg-accent">
        {previewImage ? (
          <Image
            src={previewImage}
            alt={title}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
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
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>

        {/* Technologies */}
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {technologies.map((tech, i) => (
              <Badge key={i} variant="secondary" className="rounded-full">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
          <Button variant="default" className="rounded-full" asChild>
            <Link href={`/${locale}/portfolio/${slug}`}>
              <ExternalLink className="mr-1 h-4 w-4" />
              View Details
            </Link>
          </Button>
          {url && (
            <Button
              variant="outline"
              className="rounded-full shadow-none"
              asChild
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
