'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';

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
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const translation = project.translations[0];
            const images = translation.images as string[] | undefined;
            const coverImage = images && images.length > 0 ? images[0] : null;
            const technologies = translation.technologies as string[] | undefined;

            return (
              <Card key={project.id} className="group hover:shadow-xl transition-shadow overflow-hidden">
                {coverImage && (
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <Image
                      src={coverImage}
                      alt={translation.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{project.category}</Badge>
                    {project.url && (
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{translation.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {translation.description}
                  </CardDescription>
                </CardHeader>

                {technologies && technologies.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {technologies.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{technologies.length - 4}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                )}

                <CardFooter>
                  <Button variant="ghost" className="w-full group/btn" asChild>
                    <Link href={`/${locale}/portfolio/${project.slug}`}>
                      {t('viewCaseStudy')}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href={`/${locale}/portfolio`}>
              {t('viewAllProjects')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
