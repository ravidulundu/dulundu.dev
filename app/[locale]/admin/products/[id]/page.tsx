import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ProductForm from "@/components/admin/ProductForm";
import { mapProductToFormData } from "@/lib/admin/product-form-mapper";

async function getProduct(id: string) {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      translations: true,
      prices: true,
    },
  });

  return product;
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const product = await getProduct(params.id);
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.products' });

  if (!product) {
    notFound();
  }

  // Format data for ProductForm
  const initialData = mapProductToFormData(product);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('editTitle')}</h1>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <ProductForm
          mode="edit"
          initialData={initialData}
          redirectPath={`/${params.locale}/admin/products`}
        />
      </div>
    </div>
  );
}
