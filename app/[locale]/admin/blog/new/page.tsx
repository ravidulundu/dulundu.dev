import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
        <p className="text-gray-500 mt-2">Write your blog post in multiple languages</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <BlogForm mode="create" />
      </div>
    </div>
  );
}
