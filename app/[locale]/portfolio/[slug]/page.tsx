import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import ProjectGallery from "@/components/portfolio/ProjectGallery";
import { ExternalLink, ArrowLeft, Github, CheckCircle2, TrendingUp } from "lucide-react";
import PageWrapper from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

async function getProject(slug: string, locale: string) {
  const project = await db.project.findUnique({
    where: {
      slug,
    },
    include: {
      translations: {
        where: {
          locale,
        },
      },
    },
  });

  // Check if project exists and is published
  if (
    !project ||
    project.status !== 'published' ||
    project.translations.length === 0
  ) {
    return null;
  }

  return project;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const project = await getProject(params.slug, params.locale);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const translation = project.translations[0];

  return {
    title: translation.title,
    description: translation.description,
    openGraph: {
      title: translation.title,
      description: translation.description,
      images: (translation.images as string[]) || [],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const project = await getProject(params.slug, params.locale);
  const t = await getTranslations('portfolio');

  if (!project) {
    notFound();
  }

  const translation = project.translations[0];
  const technologies = (translation.technologies as string[]) || [];
  const images = (translation.images as string[]) || [];
  const results = (translation.results as Record<string, string>) || {};

  // Structured Data - CreativeWork Schema
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: translation.title,
    description: translation.description,
    creator: {
      '@type': 'Person',
      name: 'Ege Dulundu',
      url: 'https://dulundu.dev',
    },
    ...(images.length > 0 && { image: images[0] }),
    ...(project.url && { url: project.url }),
    ...(technologies.length > 0 && { keywords: technologies.join(', ') }),
    ...(translation.client && {
      client: {
        '@type': 'Organization',
        name: translation.client,
      },
    }),
  };

  return (
    <PageWrapper>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Back Link */}
        <Link
          href={`/${params.locale}/portfolio`}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToPortfolio')}
        </Link>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {translation.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {translation.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            {project.url && (
              <Button size="lg" asChild>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {t('viewLive')}
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" size="lg" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 w-4 h-4" />
                  {t('viewCode')}
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Project Gallery */}
        {images.length > 0 && (
          <div className="mb-16">
            <ProjectGallery images={images} title={translation.title} />
          </div>
        )}

        {/* Overview Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {t('category')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">
                {project.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
            </CardContent>
          </Card>

          {/* Client */}
          {translation.client && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  {t('client')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{translation.client}</p>
              </CardContent>
            </Card>
          )}

          {/* Technologies Count */}
          {technologies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  {t('technologies')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{technologies.length} {t('techUsed')}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Challenge Section */}
        {translation.challenge && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                {t('challenge')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {translation.challenge}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Solution Section */}
        {translation.solution && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                {t('solution')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {translation.solution}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {Object.keys(results).length > 0 && (
          <Card className="mb-12 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">{t('results')}</CardTitle>
              <CardDescription>{t('measurableImpact')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(results).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-background rounded-lg">
                    <p className="text-3xl font-bold text-primary mb-2">{value}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technologies Section */}
        {technologies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t('technologies')}</h2>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <span key={index} className="text-sm px-3 py-1 border border-border rounded-md bg-muted/50">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Testimonial Section */}
        {translation.testimonial && (
          <Card className="mb-12 bg-muted/50">
            <CardContent className="pt-6">
              <blockquote className="text-lg italic leading-relaxed mb-4">
                &ldquo;{translation.testimonial}&rdquo;
              </blockquote>
              {translation.client && (
                <p className="text-sm font-semibold text-muted-foreground">
                  — {translation.client}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Separator className="my-12" />

        {/* Back Link */}
        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link href={`/${params.locale}/portfolio`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToPortfolio')}
            </Link>
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
