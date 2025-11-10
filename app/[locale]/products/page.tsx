import { db } from "@/lib/db";
import ProductCard from "@/components/products/ProductCard";
import { getTranslations } from 'next-intl/server';
import { Package } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getProducts(locale: string, category?: string) {
  const products = await db.product.findMany({
    where: {
      status: 'published',
      ...(category && category !== 'all' ? { type: category } : {}),
      translations: {
        some: {
          locale,
        },
      },
    },
    include: {
      translations: {
        where: {
          locale,
        },
      },
    },
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return products;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'products' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string };
}) {
  const category = searchParams.category;
  const products = await getProducts(params.locale, category);
  const t = await getTranslations({ locale: params.locale, namespace: 'products' });

  // Get unique product types for filter
  const allProducts = await db.product.findMany({
    where: { status: 'published' },
    select: { type: true },
    distinct: ['type'],
  });
  const categories = allProducts.map((p) => p.type);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Package className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {t('title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-3 justify-center">
            <a
              href={`/${params.locale}/products`}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !category || category === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('allProducts')}
            </a>
            {categories.map((cat) => (
              <a
                key={cat}
                href={`/${params.locale}/products?category=${cat}`}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.replace('-', ' ')}
              </a>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">{t('noProductsYet')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={params.locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
