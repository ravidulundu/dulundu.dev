import type { Product, ProductPrice, ProductTranslation } from '@prisma/client';
import type { ProductFormInitialData } from '@/components/admin/ProductForm';

export type AdminProductWithRelations = Product & {
  translations: ProductTranslation[];
  prices: ProductPrice[];
};

export function mapProductToFormData(product: AdminProductWithRelations): ProductFormInitialData {
  return {
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
      features:
        typeof t.features === 'string'
          ? t.features
          : JSON.stringify((t.features as unknown) || []),
      coverImage: '',
    })),
    prices: product.prices.map((p) => ({
      currency: p.currency,
      amount: p.amount.toString(),
    })),
  };
}
