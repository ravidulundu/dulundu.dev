import { db } from "@/lib/db";
import { getTranslations } from 'next-intl/server';
import ProjectCard from "@/components/portfolio/ProjectCard";
import PageWrapper from '@/components/layout/PageWrapper';

async function getProjects(locale: string) {
  const projects = await db.project.findMany({
    where: {
      status: 'published',
    },
    include: {
      translations: {
        where: {
          locale,
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  // Filter projects that have translations for the requested locale
  return projects.filter((project) => project.translations.length > 0);
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('portfolio');

  return {
    title: t('title', { defaultMessage: 'Portfolio' }),
    description: t('subtitle', {
      defaultMessage: 'Explore our completed projects and case studies',
    }),
    openGraph: {
      title: `${t('title', { defaultMessage: 'Portfolio' })} | Ege Dulundu`,
      description: t('subtitle', {
        defaultMessage: 'Explore our completed projects and case studies',
      }),
      type: 'website',
      url: `https://dulundu.dev/${params.locale}/portfolio`,
    },
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: { locale: string };
}) {
  const projects = await getProjects(params.locale);
  const t = await getTranslations('portfolio');

  // Separate featured projects
  const featuredProjects = projects.filter((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground dark:text-white mb-4">
          {t('title', { defaultMessage: 'Portfolio' })}
        </h1>
        <p className="text-xl text-muted-foreground dark:text-muted-foreground/70 max-w-2xl mx-auto">
          {t('subtitle', {
            defaultMessage: 'Explore our completed projects and case studies',
          })}
        </p>
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6">
            {t('featured', { defaultMessage: 'Featured Projects' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => {
              const translation = project.translations[0];
              return (
                <ProjectCard
                  key={project.id}
                  slug={project.slug}
                  title={translation.title}
                  description={translation.description}
                  category={project.category}
                  featured={project.featured}
                  images={(translation.images as string[]) || []}
                  locale={params.locale}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* All Projects */}
      {regularProjects.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6">
            {t('allProjects', { defaultMessage: 'All Projects' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularProjects.map((project) => {
              const translation = project.translations[0];
              return (
                <ProjectCard
                  key={project.id}
                  slug={project.slug}
                  title={translation.title}
                  description={translation.description}
                  category={project.category}
                  featured={project.featured}
                  images={(translation.images as string[]) || []}
                  locale={params.locale}
                />
              );
            })}
          </div>
        </div>
      ) : (
        !featuredProjects.length && (
          <div className="text-center py-12">
            <p className="text-muted-foreground dark:text-muted-foreground text-lg">
              {t('noProjects', {
                defaultMessage: 'No projects available yet. Check back soon!',
              })}
            </p>
          </div>
        )
      )}
    </div>
    </PageWrapper>
  );
}
