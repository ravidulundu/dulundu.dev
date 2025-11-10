import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";

async function getProject(id: string) {
  const project = await db.project.findUnique({
    where: { id },
    include: {
      translations: true,
    },
  });

  return project;
}

export default async function EditPortfolioProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  // Format data for ProjectForm
  const initialData = {
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
      technologies: (t.technologies as string[]) || [],
      images: (t.images as string[]) || [],
    })),
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Project</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Update your project details and settings</p>
      </div>

      <ProjectForm mode="edit" initialData={initialData} />
    </div>
  );
}
