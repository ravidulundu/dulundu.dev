'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { InteractiveProjectCard } from '@/components/portfolio/InteractiveProjectCard';
import { staggerContainer, fadeInUp } from '@/lib/animations';

interface ProjectTranslation {
  title: string;
  description: string;
  technologies?: string[];
  images?: string[];
}

interface Project {
  id: string;
  slug: string;
  category: string;
  url?: string;
  featured: boolean;
  translations: ProjectTranslation[];
}

export function FeaturedProjects() {
  const t = useTranslations('featuredProjects');
  const locale = useLocale();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(
          `/api/portfolio?locale=${locale}&featured=true&limit=6`
        );
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Failed to fetch featured projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [locale]);

  if (loading) {
    return (
      <section className="relative py-20 px-6">
        <div className="max-w-screen-md mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Loading...
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-96 bg-muted animate-pulse rounded-xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="relative py-20 px-6">
      <div className="max-w-screen-md mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {t('badge')}
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {t('title')}
          </h2>
          <p className="text-muted-foreground mt-2 sm:mt-4 text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => {
            const translation = project.translations[0];
            const images = translation.images as string[] | undefined;
            const technologies = translation.technologies as string[] | undefined;

            return (
              <InteractiveProjectCard
                key={project.id}
                slug={project.slug}
                title={translation.title}
                description={translation.description}
                category={project.category}
                featured={project.featured}
                images={images || []}
                locale={locale}
                technologies={technologies}
                url={project.url}
                index={index}
              />
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild className="group rounded-full">
            <Link href={`/${locale}/portfolio`}>
              {t('viewAllProjects')}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
