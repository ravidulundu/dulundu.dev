import Link from "next/link";
import { Package, Star } from "lucide-react";
import { formatCurrencyAmount } from "@/lib/currency";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    type: string;
    price: any;
    currency: string;
    featured: boolean;
    prices?: {
      currency: string;
      amount: any;
    }[];
    translations: {
      title: string;
      description: string;
    }[];
  };
  locale: string;
  preferredCurrency: string;
}

const productTypeVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  'wordpress-plugin': 'default',
  'wordpress-theme': 'secondary',
  'consulting': 'outline',
  'optimization': 'secondary',
};

const productTypeLabels: Record<string, string> = {
  'wordpress-plugin': 'Plugin',
  'wordpress-theme': 'Theme',
  'consulting': 'Consulting',
  'optimization': 'Optimization',
};

export default function ProductCard({ product, locale, preferredCurrency }: ProductCardProps) {
  const translation = product.translations[0]; // Already filtered by locale in the API

  if (!translation) {
    return null;
  }

  const typeVariant = productTypeVariants[product.type] || 'default';
  const typeLabel = productTypeLabels[product.type] || product.type;
  const priceEntry =
    product.prices?.find((price) => price.currency === preferredCurrency) ||
    product.prices?.find((price) => price.currency === product.currency) ||
    product.prices?.[0];

  const displayAmount = priceEntry
    ? parseFloat(priceEntry.amount.toString())
    : parseFloat(product.price.toString());
  const displayCurrency = priceEntry?.currency || product.currency;
  const formattedPrice = formatCurrencyAmount({
    amount: displayAmount,
    currency: displayCurrency,
    locale
  });

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header with Icon & Badges */}
      <CardHeader className="relative h-48 bg-primary/10 flex items-center justify-center p-0">
        <Package className="w-20 h-20 text-primary/30" strokeWidth={1.5} />

        {/* Badges positioned absolutely */}
        <div className="absolute top-4 left-4">
          <Badge variant={typeVariant}>
            {typeLabel}
          </Badge>
        </div>

        {product.featured && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="gap-1">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </Badge>
          </div>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {translation.title}
        </h3>

        <p className="text-muted-foreground line-clamp-3">
          {translation.description}
        </p>
      </CardContent>

      {/* Footer with Price & CTA */}
      <CardFooter className="flex items-center justify-between p-6 pt-0">
        <div className="text-2xl font-bold text-foreground">
          {formattedPrice}
        </div>

        <Button asChild>
          <Link href={`/${locale}/products/${product.slug}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
