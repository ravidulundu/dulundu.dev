import { db } from "@/lib/db";
import { Package, FileText, Briefcase, ShoppingCart } from "lucide-react";

async function getStats() {
  const [productsCount, postsCount, projectsCount, ordersCount] = await Promise.all([
    db.product.count(),
    db.post.count(),
    db.project.count(),
    db.order.count(),
  ]);

  return {
    products: productsCount,
    posts: postsCount,
    projects: projectsCount,
    orders: ordersCount,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Blog Posts',
      value: stats.posts,
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      title: 'Portfolio',
      value: stats.projects,
      icon: Briefcase,
      color: 'bg-purple-500',
    },
    {
      title: 'Orders',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Package className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Add Product</h3>
            <p className="text-sm text-gray-500 mt-1">Create a new product or service</p>
          </a>
          <a
            href="/admin/blog"
            className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <FileText className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Write Post</h3>
            <p className="text-sm text-gray-500 mt-1">Create a new blog post</p>
          </a>
          <a
            href="/admin/portfolio"
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Briefcase className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Add Project</h3>
            <p className="text-sm text-gray-500 mt-1">Showcase a new portfolio project</p>
          </a>
        </div>
      </div>
    </div>
  );
}
