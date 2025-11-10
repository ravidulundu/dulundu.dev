import Link from "next/link";
import { Package, Star, DollarSign } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    type: string;
    price: any; // Decimal type from Prisma
    currency: string;
    featured: boolean;
    translations: {
      title: string;
      description: string;
    }[];
  };
  locale: string;
}

const productTypeColors: Record<string, string> = {
  'wordpress-plugin': 'bg-blue-100 text-blue-800',
  'wordpress-theme': 'bg-purple-100 text-purple-800',
  'consulting': 'bg-green-100 text-green-800',
  'optimization': 'bg-orange-100 text-orange-800',
};

const productTypeLabels: Record<string, string> = {
  'wordpress-plugin': 'Plugin',
  'wordpress-theme': 'Theme',
  'consulting': 'Consulting',
  'optimization': 'Optimization',
};

export default function ProductCard({ product, locale }: ProductCardProps) {
  const translation = product.translations[0]; // Already filtered by locale in the API

  if (!translation) {
    return null;
  }

  const typeColor = productTypeColors[product.type] || 'bg-gray-100 text-gray-800';
  const typeLabel = productTypeLabels[product.type] || product.type;

  return (
    <article className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Header with Icon */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center">
        <Package className="w-20 h-20 text-white/20" strokeWidth={1.5} />

        {/* Product Type Badge */}
        <div className={`absolute top-4 left-4 ${typeColor} px-3 py-1 rounded-full text-xs font-semibold`}>
          {typeLabel}
        </div>

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {translation.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {translation.description}
        </p>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-2xl font-bold text-gray-900">
            <DollarSign className="w-5 h-5" />
            {parseFloat(product.price.toString()).toFixed(2)}
            <span className="text-sm text-gray-500 ml-1 font-normal">
              {product.currency}
            </span>
          </div>

          <Link
            href={`/${locale}/products/${product.slug}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
