import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

async function getProduct(id: string) {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      translations: true,
    },
  });

  return product;
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Format data for ProductForm
  const initialData = {
    id: product.id,
    slug: product.slug,
    type: product.type,
    price: product.price.toString(),
    currency: product.currency,
    status: product.status,
    translations: product.translations.map((t) => ({
      locale: t.locale,
      title: t.title,
      description: t.description,
      features: typeof t.features === 'string' ? t.features : JSON.stringify(t.features || []),
      coverImage: '',
    })),
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-2">Update product details and settings</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ProductForm mode="edit" initialData={initialData} />
      </div>
    </div>
  );
}
