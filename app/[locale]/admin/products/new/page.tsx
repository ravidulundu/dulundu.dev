import ProductForm from "@/components/admin/ProductForm";
import { Card, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function NewProductPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.products' });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('createTitle')}</h1>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ProductForm mode="create" redirectPath={`/${params.locale}/admin/products`} />
        </CardContent>
      </Card>
    </div>
  );
}
