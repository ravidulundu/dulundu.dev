'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
      <section className="py-20 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              {t('title')}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
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
        </motion.div>

        {/* View All CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button variant="outline" size="lg" asChild className="group">
            <Link href={`/${locale}/portfolio`}>
              {t('viewAllProjects')}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
