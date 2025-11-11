import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Trash2, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProjectEditDialog from "@/components/admin/ProjectEditDialog";
import { mapProjectToFormData, type AdminProjectWithRelations } from "@/lib/admin/project-form-mapper";

export const dynamic = 'force-dynamic';

async function getProjects(): Promise<AdminProjectWithRelations[]> {
  const projects = await db.project.findMany({
    include: {
      translations: true,
    },
    orderBy: {
      order: 'asc',
    },
  });

  return projects as AdminProjectWithRelations[];
}

export default async function PortfolioPage({
  params,
}: {
  params: { locale: string };
}) {
  const projects = await getProjects();
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.portfolio' });
  const adminBasePath = `/${params.locale}/admin`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <Button asChild>
          <Link href={`${adminBasePath}/portfolio/new`}>
            <Plus className="w-5 h-5 mr-2" />
            {t('createTitle')}
          </Link>
        </Button>
      </div>

      {/* Portfolio Projects Table */}
      <div className="bg-card rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.project')}</TableHead>
              <TableHead>{t('table.category')}</TableHead>
              <TableHead>{t('table.status')}</TableHead>
              <TableHead>{t('table.featured')}</TableHead>
              <TableHead>{t('table.order')}</TableHead>
              <TableHead className="text-right">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t('empty')}
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => {
                const enTranslation = project.translations.find(t => t.locale === 'en');
                const formData = mapProjectToFormData(project);
                return (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="font-medium">
                        {enTranslation?.title || 'Untitled'}
                      </div>
                      <div className="text-sm text-muted-foreground">{project.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{project.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === 'published'
                            ? 'default'
                            : project.status === 'draft'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {t(`statusOptions.${project.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {project.featured ? (
                        <Star className="w-5 h-5 text-accent fill-accent" />
                      ) : (
                        <Star className="w-5 h-5 text-muted-foreground/70" />
                      )}
                    </TableCell>
                    <TableCell>{project.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ProjectEditDialog initialData={formData} locale={params.locale} />
                        <button className="text-destructive hover:text-destructive/80" aria-label="Delete">
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
