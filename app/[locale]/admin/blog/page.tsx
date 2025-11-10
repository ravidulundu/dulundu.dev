import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

async function getPosts() {
  const posts = await db.post.findMany({
    include: {
      translations: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return posts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 mt-2">Manage your blog posts in multiple languages</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Post
        </Link>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Publish Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No blog posts yet. Create your first post!
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                const enTranslation = post.translations.find(t => t.locale === 'en');
                return (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {enTranslation?.title || 'Untitled'}
                      </div>
                      <div className="text-sm text-gray-500">{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : post.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.featured ? (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <Star className="w-5 h-5 text-gray-300" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.publishedAt
                        ? format(new Date(post.publishedAt), 'MMM dd, yyyy')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
