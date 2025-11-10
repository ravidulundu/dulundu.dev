import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = 'force-dynamic';

async function getProducts() {
  const products = await db.product.findMany({
    include: {
      translations: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products & Services</h1>
          <p className="text-gray-500 mt-2">Manage your products, services, and digital items</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No products yet. Create your first product!
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const enTranslation = product.translations.find(t => t.locale === 'en');
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enTranslation?.title || 'Untitled'}
                      </div>
                      <div className="text-sm text-gray-500">{product.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {product.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toString()} {product.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          product.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </Link>
                      <DeleteProductButton
                        productId={product.id}
                        productTitle={enTranslation?.title || 'Untitled'}
                      />
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
