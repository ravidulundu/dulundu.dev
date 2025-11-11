import { db } from "@/lib/db";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Plus, Info } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductEditDialog from "@/components/admin/ProductEditDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SUPPORTED_CURRENCIES,
  formatCurrencyAmount,
  generatePriceMap,
  getCurrencySymbol,
  normalizeCurrency,
} from "@/lib/currency";
import { mapProductToFormData, type AdminProductWithRelations } from "@/lib/admin/product-form-mapper";

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<AdminProductWithRelations[]> {
  const products = await db.product.findMany({
    include: {
      translations: true,
      prices: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products as AdminProductWithRelations[];
}

type ProductWithRelations = AdminProductWithRelations;

type AdminCurrency = (typeof SUPPORTED_CURRENCIES)[number];

type PriceDetail = {
  currency: AdminCurrency;
  formatted: string;
  numeric: number;
  source: 'base' | 'override' | 'auto';
  stripePriceId?: string | null;
};

function buildPriceDetails(product: ProductWithRelations, locale: string): PriceDetail[] {
  const baseCurrency = normalizeCurrency(product.currency);
  const overrides = product.prices.reduce<Partial<Record<AdminCurrency, string>>>(
    (acc, price) => {
      const normalized = normalizeCurrency(price.currency);
      if (SUPPORTED_CURRENCIES.includes(normalized)) {
        acc[normalized] = price.amount.toString();
      }
      return acc;
    },
    {}
  );

  const priceMap = generatePriceMap(product.price.toString(), baseCurrency, overrides);

  return SUPPORTED_CURRENCIES.map((currency) => {
    const amount = parseFloat(priceMap[currency]);
    return {
      currency,
      numeric: amount,
      formatted: formatCurrencyAmount({
        amount,
        currency,
        locale,
      }),
      source: overrides[currency]
        ? 'override'
        : currency === baseCurrency
        ? 'base'
        : 'auto',
      stripePriceId: product.prices.find(
        (price) => normalizeCurrency(price.currency) === currency
      )?.stripePriceId,
    };
  });
}

export default async function ProductsPage({
  params,
}: {
  params: { locale: string };
}) {
  const products = await getProducts();
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'admin.products' });
  const adminBasePath = `/${locale}/admin`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <Button asChild>
          <Link href={`${adminBasePath}/products/new`}>
            <Plus className="w-5 h-5 mr-2" />
            {t('createTitle')}
          </Link>
        </Button>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-lg shadow border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.product')}</TableHead>
              <TableHead>{t('table.type')}</TableHead>
              {SUPPORTED_CURRENCIES.map((currency) => (
                <TableHead key={currency} className="text-center">
                  {t(`table.${currency.toLowerCase()}`)}
                </TableHead>
              ))}
              <TableHead className="w-32 text-center">{t('table.summary')}</TableHead>
              <TableHead>{t('table.status')}</TableHead>
              <TableHead className="text-right">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={SUPPORTED_CURRENCIES.length + 5} className="h-24 text-center">
                  {t('empty')}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                const enTranslation = product.translations.find(t => t.locale === 'en');
                const formInitialData = mapProductToFormData(product);
                const priceDetails = buildPriceDetails(product, locale);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">
                        {enTranslation?.title || 'Untitled'}
                      </div>
                      <div className="text-sm text-muted-foreground">{product.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.type}</Badge>
                    </TableCell>
                    {priceDetails.map((detail) => (
                      <TableCell key={detail.currency} className="text-center">
                        <div className="text-sm font-semibold">{detail.formatted}</div>
                        <Badge
                          variant={
                            detail.source === 'override'
                              ? 'default'
                              : detail.source === 'base'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="mt-1 text-[0.7rem]"
                        >
                          {detail.source === 'override'
                            ? t('badge.manual')
                            : detail.source === 'base'
                            ? t('badge.base')
                            : t('badge.auto')}
                        </Badge>
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Info className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-64">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{t('popover.title')}</p>
                              <p className="text-xs text-muted-foreground">
                                {t('popover.description')}
                              </p>
                            </div>
                            <div className="space-y-2">
                              {priceDetails.map((detail) => (
                                <div key={detail.currency} className="flex items-start justify-between rounded-lg border border-border px-3 py-2 text-sm">
                                  <div>
                                    <div className="font-medium">{detail.currency}</div>
                                    <div className="text-muted-foreground">{detail.formatted}</div>
                                    <div className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                                      {detail.source === 'override'
                                        ? t('popover.manual')
                                        : detail.source === 'base'
                                        ? t('popover.base')
                                        : t('popover.auto')}
                                    </div>
                                  </div>
                                  <div className="text-[0.65rem] text-right text-muted-foreground max-w-[110px] break-all">
                                    {detail.stripePriceId ?? t('popover.noStripe')}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                        {t(`statusOptions.${product.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right flex items-center gap-2 justify-end">
                      <ProductEditDialog initialData={formInitialData} locale={locale} />
                      <DeleteProductButton
                        productId={product.id}
                        productTitle={enTranslation?.title || 'Untitled'}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
