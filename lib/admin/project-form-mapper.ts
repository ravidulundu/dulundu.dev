import type { Project, ProjectTranslation } from '@prisma/client';
import type { ProjectFormInitialData } from '@/components/admin/ProjectForm';

export type AdminProjectWithRelations = Project & {
  translations: ProjectTranslation[];
};

export function mapProjectToFormData(project: AdminProjectWithRelations): ProjectFormInitialData {
  return {
    id: project.id,
    slug: project.slug,
    category: project.category,
    status: project.status,
    featured: project.featured,
    url: project.url,
    order: project.order,
    translations: project.translations.map((t) => ({
      locale: t.locale,
      title: t.title,
      description: t.description,
      technologies: Array.isArray(t.technologies)
        ? (t.technologies as unknown as string[])
        : typeof t.technologies === 'string'
        ? t.technologies.split(',').map((tech) => tech.trim()).filter(Boolean)
        : [],
      images: Array.isArray(t.images)
        ? (t.images as unknown as string[])
        : typeof t.images === 'string'
        ? t.images.split('\n').map((img) => img.trim()).filter(Boolean)
        : [],
    })),
  };
}
