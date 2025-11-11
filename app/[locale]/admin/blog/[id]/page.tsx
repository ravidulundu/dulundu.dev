import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import BlogForm from "@/components/admin/BlogForm";
import { mapPostToFormData } from "@/lib/admin/blog-form-mapper";

async function getPost(id: string) {
  const post = await db.post.findUnique({
    where: { id },
    include: {
      translations: true,
    },
  });

  return post;
}

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const post = await getPost(params.id);
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.blog' });

  if (!post) {
    notFound();
  }

  // Format data for BlogForm
  const initialData = mapPostToFormData(post);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('editTitle')}</h1>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <BlogForm
          mode="edit"
          initialData={initialData}
          redirectPath={`/${params.locale}/admin/blog`}
        />
      </div>
    </div>
  );
}
