import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ProjectForm from "@/components/admin/ProjectForm";
import { mapProjectToFormData } from "@/lib/admin/project-form-mapper";

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
  params: { id: string; locale: string };
}) {
  const project = await getProject(params.id);
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.portfolio' });

  if (!project) {
    notFound();
  }

  // Format data for ProjectForm
  const initialData = mapProjectToFormData(project);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground dark:text-white">{t('editTitle')}</h1>
        <p className="text-muted-foreground dark:text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      <ProjectForm
        mode="edit"
        initialData={initialData}
        redirectPath={`/${params.locale}/admin/portfolio`}
      />
    </div>
  );
}
