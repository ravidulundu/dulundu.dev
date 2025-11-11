import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';
import BuyButton from "@/components/products/BuyButton";
import PageWrapper from '@/components/layout/PageWrapper';
import { formatCurrencyAmount } from "@/lib/currency";
import { getPreferredCurrencyForRequest } from '@/lib/currency-preferences';

async function getProduct(slug: string, locale: string) {
  const product = await db.product.findUnique({
    where: {
      slug,
    },
    include: {
      prices: true,
      translations: {
        where: {
          locale,
        },
      },
    },
  });

  // Check if product exists and is published
  if (
    !product ||
    product.status !== 'published' ||
    product.translations.length === 0
  ) {
    return null;
  }

  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProduct(slug, locale);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const translation = product.translations[0];

  return {
    title: translation.title,
    description: translation.description,
    openGraph: {
      title: translation.title,
      description: translation.description,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProduct(slug, locale);
  const t = await getTranslations({ locale, namespace: 'products' });

  if (!product) {
    notFound();
  }

  const translation = product.translations[0];
  const features = translation.features as string[] | null;
  const preferredCurrency = getPreferredCurrencyForRequest(locale);
  const priceEntry =
    product.prices?.find((price) => price.currency === preferredCurrency) ||
    product.prices?.find((price) => price.currency === product.currency) ||
    product.prices?.[0];

  const displayAmount = priceEntry
    ? parseFloat(priceEntry.amount.toString())
    : parseFloat(product.price.toString());
  const displayCurrency = priceEntry?.currency || product.currency;
  const checkoutCurrency = priceEntry?.currency || product.currency;
  const isPurchasable = Boolean(priceEntry);
  const formattedPrice = formatCurrencyAmount({
    amount: displayAmount,
    currency: displayCurrency,
    locale
  });

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Product Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground dark:text-white mb-4">
          {translation.title}
        </h1>
        <p className="text-xl text-muted-foreground dark:text-muted-foreground/70">
          {translation.description}
        </p>
      </div>

      {/* Price Section */}
      <div className="bg-card dark:bg-card rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-1">
              {t('price')}
            </p>
            <p className="text-4xl font-bold text-foreground dark:text-white">
              {formattedPrice}
            </p>
            {!isPurchasable && (
              <p className="text-sm text-destructive mt-2">
                {t('currencyUnavailable', {
                  currency: checkoutCurrency,
                  defaultMessage: 'This currency is not available for checkout yet.'
                })}
              </p>
            )}
          </div>
          <BuyButton
            productId={product.id}
            locale={locale}
            currency={checkoutCurrency}
            isAvailable={isPurchasable}
          />
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="border-t border-border dark:border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
              {t('features')}
            </h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start text-muted-foreground dark:text-muted-foreground/70"
                >
                  <svg
                    className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Detailed Content */}
      {translation.content && (
        <div className="bg-card dark:bg-card rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6">
            {t('details')}
          </h2>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: translation.content }}
          />
        </div>
      )}
    </div>
    </PageWrapper>
  );
}
