import ProjectForm from "@/components/admin/ProjectForm";
import { getTranslations } from "next-intl/server";

export default async function NewPortfolioProjectPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.portfolio' });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground dark:text-white">{t('createTitle')}</h1>
        <p className="text-muted-foreground dark:text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      <ProjectForm mode="create" redirectPath={`/${params.locale}/admin/portfolio`} />
    </div>
  );
}
