import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";

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
  params: { id: string };
}) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  // Format data for BlogForm
  const initialData = {
    id: post.id,
    slug: post.slug,
    status: post.status,
    featured: post.featured,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    translations: post.translations.map((t) => ({
      locale: t.locale,
      title: t.title,
      excerpt: t.excerpt,
      content: t.content,
      coverImage: t.coverImage || '',
    })),
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="text-gray-500 mt-2">Update your blog post content and settings</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <BlogForm mode="edit" initialData={initialData} />
      </div>
    </div>
  );
}
