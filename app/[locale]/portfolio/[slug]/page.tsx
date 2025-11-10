import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import ProjectGallery from "@/components/portfolio/ProjectGallery";
import { ExternalLink, ArrowLeft } from "lucide-react";

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

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Back Link */}
      <Link
        href={`/${params.locale}/portfolio`}
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('backToPortfolio', { defaultMessage: 'Back to Portfolio' })}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            {project.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
          {project.featured && (
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium">
              ⭐ Featured
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {translation.title}
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300">
          {translation.description}
        </p>

        {/* Project URL */}
        {project.url && (
          <div className="mt-6">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              {t('viewLive', { defaultMessage: 'View Live Project' })}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Gallery */}
      <div className="mb-12">
        <ProjectGallery images={images} title={translation.title} />
      </div>

      {/* Technologies */}
      {technologies.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('technologies', { defaultMessage: 'Technologies Used' })}
          </h2>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Project Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('projectDetails', { defaultMessage: 'Project Details' })}
        </h2>

        <div className="prose dark:prose-invert max-w-none">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('category', { defaultMessage: 'Category' })}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {project.category.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
            </div>

            {project.url && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {t('website', { defaultMessage: 'Website' })}
                </h3>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {new URL(project.url).hostname}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-12 text-center">
        <Link
          href={`/${params.locale}/portfolio`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToPortfolio', { defaultMessage: 'Back to Portfolio' })}
        </Link>
      </div>
    </div>
  );
}
