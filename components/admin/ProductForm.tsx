'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface Translation {
  locale: string;
  title: string;
  description: string;
  features: string;
  coverImage: string;
}

interface ProductFormProps {
  initialData?: {
    id?: string;
    slug: string;
    type: string;
    price: string | number;
    currency: string;
    status: string;
    translations: Translation[];
  };
  mode: 'create' | 'edit';
}

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
];

const productTypes = [
  { value: 'service', label: 'Service' },
  { value: 'digital_product', label: 'Digital Product' },
  { value: 'consulting', label: 'Consulting' },
];

const currencies = [
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
  { value: 'try', label: 'TRY (₺)' },
];

export default function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [type, setType] = useState(initialData?.type || 'service');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [currency, setCurrency] = useState(initialData?.currency || 'usd');
  const [status, setStatus] = useState(initialData?.status || 'draft');

  // Translations state
  const [translations, setTranslations] = useState<Record<string, Translation>>(
    () => {
      const initial: Record<string, Translation> = {};
      locales.forEach((locale) => {
        const existing = initialData?.translations.find(
          (t) => t.locale === locale.code
        );
        initial[locale.code] = existing || {
          locale: locale.code,
          title: '',
          description: '',
          features: '',
          coverImage: '',
        };
      });
      return initial;
    }
  );

  // Auto-generate slug from English title
  useEffect(() => {
    if (mode === 'create' && translations.en.title && !slug) {
      const generatedSlug = translations.en.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  }, [translations.en.title, mode, slug]);

  const updateTranslation = (locale: string, field: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!slug || !price) {
        throw new Error('Slug and price are required');
      }

      if (!translations.en.title) {
        throw new Error('English title is required');
      }

      const payload = {
        slug,
        type,
        price: parseFloat(price),
        currency,
        status,
        translations: Object.values(translations).filter((t) => t.title),
      };

      const url =
        mode === 'create'
          ? '/api/admin/products'
          : `/api/admin/products/${initialData?.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Language Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {locales.map((locale) => (
            <button
              key={locale.code}
              type="button"
              onClick={() => setActiveTab(locale.code)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${
                  activeTab === locale.code
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{locale.flag}</span>
              {locale.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {locales.map((locale) => (
        <div
          key={locale.code}
          className={`space-y-6 ${activeTab === locale.code ? '' : 'hidden'}`}
        >
          <Input
            label={`Title (${locale.name})`}
            value={translations[locale.code].title}
            onChange={(e) =>
              updateTranslation(locale.code, 'title', e.target.value)
            }
            required={locale.code === 'en'}
            placeholder="Enter product title"
          />

          <Textarea
            label={`Description (${locale.name})`}
            value={translations[locale.code].description}
            onChange={(e) =>
              updateTranslation(locale.code, 'description', e.target.value)
            }
            rows={6}
            placeholder="Detailed product description"
          />

          <Textarea
            label={`Features (${locale.name})`}
            value={translations[locale.code].features}
            onChange={(e) =>
              updateTranslation(locale.code, 'features', e.target.value)
            }
            rows={4}
            placeholder="One feature per line (optional)"
          />

          <Input
            label={`Cover Image URL (${locale.name})`}
            value={translations[locale.code].coverImage}
            onChange={(e) =>
              updateTranslation(locale.code, 'coverImage', e.target.value)
            }
            type="url"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      ))}

      {/* Global Fields */}
      <div className="border-t border-gray-200 pt-8 space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Global Settings</h3>

        <Input
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          placeholder="product-slug (auto-generated)"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Product Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            options={productTypes}
          />

          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="99.99"
          />

          <Select
            label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
            options={currencies}
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/products')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? 'Saving...'
            : mode === 'create'
            ? 'Create Product'
            : 'Update Product'}
        </Button>
      </div>
    </form>
  );
}
