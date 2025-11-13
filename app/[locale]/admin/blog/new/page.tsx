import BlogForm from "@/components/admin/BlogForm";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";

export default async function NewBlogPostPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.blog' });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('createTitle')}</h1>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <BlogForm mode="create" redirectPath={`/${params.locale}/admin/blog`} />
        </CardContent>
      </Card>
    </div>
  );
}
