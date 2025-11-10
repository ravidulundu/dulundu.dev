import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Trash2, Star } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getProjects() {
  const projects = await db.project.findMany({
    include: {
      translations: true,
    },
    orderBy: {
      order: 'asc',
    },
  });

  return projects;
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Projects</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your portfolio projects in multiple languages</p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Project
        </Link>
      </div>

      {/* Portfolio Projects Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No projects yet. Create your first project!
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const enTranslation = project.translations.find(t => t.locale === 'en');
                return (
                  <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {enTranslation?.title || 'Untitled'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{project.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          project.status === 'published'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : project.status === 'draft'
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.featured ? (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <Star className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {project.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/portfolio/${project.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </Link>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
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
