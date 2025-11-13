'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import {
  SUPPORTED_CURRENCIES,
  getCurrencySymbol,
  generatePriceMap,
  formatCurrencyAmount,
  type SupportedCurrency,
} from '@/lib/currency';

export interface ProductTranslationInput {
  locale: string;
  title: string;
  description: string;
  features: string;
  coverImage: string;
}

export type ProductFormInitialData = {
  id?: string;
  slug: string;
  type: string;
  price: string | number;
  currency: string;
  status: string;
  translations: ProductTranslationInput[];
  prices?: { currency: string; amount: string | number }[];
};

interface ProductFormProps {
  initialData?: ProductFormInitialData;
  mode: 'create' | 'edit';
  redirectPath?: string;
  onSuccess?: () => void;
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

const currencyOptions = SUPPORTED_CURRENCIES.map((code) => ({
  value: code,
  label: `${code} (${getCurrencySymbol(code)})`,
}));

export default function ProductForm({ initialData, mode, redirectPath, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const t = useTranslations('admin.forms.product');
  const tCommon = useTranslations('admin.forms.common');
  const [activeTab, setActiveTab] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialCurrency = initialData?.currency || SUPPORTED_CURRENCIES[0];

  // Form state
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [type, setType] = useState(initialData?.type || 'service');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [currency, setCurrency] = useState<SupportedCurrency>(initialCurrency as SupportedCurrency);
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [priceOverrides, setPriceOverrides] = useState<Record<string, string>>(() => {
    const overrides: Record<string, string> = {};
    SUPPORTED_CURRENCIES.forEach((code) => {
      if (code === initialCurrency) return;
      const match = initialData?.prices?.find((p) => p.currency === code);
      overrides[code] = match ? match.amount.toString() : '';
    });
    return overrides;
  });
  const normalizedOverrides = useMemo<Partial<Record<SupportedCurrency, string>>>(() => {
    const normalized: Partial<Record<SupportedCurrency, string>> = {};
    Object.entries(priceOverrides).forEach(([code, value]) => {
      if (code === currency) return;
      if (value && value.trim() !== '') {
        normalized[code as SupportedCurrency] = value.trim();
      }
    });
    return normalized;
  }, [priceOverrides, currency]);

  const computedPriceMap = useMemo(() => {
    const baseInput = price && price.toString().trim() !== '' ? price : '0';
    return generatePriceMap(baseInput, currency, normalizedOverrides);
  }, [price, currency, normalizedOverrides]);

  const basePriceValue = useMemo(() => {
    const parsed = parseFloat(computedPriceMap[currency] ?? '0');
    return Number.isFinite(parsed) ? parsed : 0;
  }, [computedPriceMap, currency]);

  const formattedPriceMap = useMemo(() => {
    const map: Record<string, string> = {};
    SUPPORTED_CURRENCIES.forEach((code) => {
      map[code] = formatCurrencyAmount({
        amount: computedPriceMap[code] ?? '0',
        currency: code,
        locale: 'en-US',
      });
    });
    return map;
  }, [computedPriceMap]);

  // Translations state
  const [translations, setTranslations] = useState<Record<string, ProductTranslationInput>>(
    () => {
      const initial: Record<string, ProductTranslationInput> = {};
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

  const handleCurrencyChange = (nextCurrency: SupportedCurrency) => {
    if (nextCurrency === currency) return;
    setPriceOverrides((prev) => {
      const updated = { ...prev };
      if (price && price.trim() !== '') {
        updated[currency] = price;
      } else {
        delete updated[currency];
      }
      const overrideForNext = updated[nextCurrency];
      if (overrideForNext) {
        setPrice(overrideForNext);
        delete updated[nextCurrency];
      }
      return updated;
    });
    setCurrency(nextCurrency);
  };

  const handleOverrideChange = (code: string, value: string) => {
    setPriceOverrides((prev) => ({
      ...prev,
      [code]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!slug || !price) {
        throw new Error(t('errors.slugPrice'));
      }

      if (!translations.en.title) {
        throw new Error(t('errors.englishTitle'));
      }

      if (!basePriceValue || basePriceValue <= 0) {
        throw new Error(t('errors.pricePositive'));
      }

      const overridesPayload: Record<string, string> = {};
      SUPPORTED_CURRENCIES.forEach((code) => {
        if (code === currency) return;
        const overrideValue = priceOverrides[code];
        if (overrideValue && overrideValue.trim() !== '') {
          overridesPayload[code] = overrideValue.trim();
        }
      });

      const payload = {
        slug,
        type,
        price: basePriceValue,
        currency,
        status,
        priceOverrides: overridesPayload,
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

      router.push(redirectPath ?? '/admin/products');
      router.refresh();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Language Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {locales.map((locale) => (
            <TabsTrigger key={locale.code} value={locale.code}>
              <span className="mr-2">{locale.flag}</span>
              {locale.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {locales.map((locale) => (
          <TabsContent key={locale.code} value={locale.code} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor={`title-${locale.code}`}>
                {t('languageFields.title', {
                  language: locale.name,
                  required: locale.code === 'en' ? tCommon('requiredIndicator') : ''
                })}
              </Label>
              <Input
                id={`title-${locale.code}`}
                value={translations[locale.code].title}
                onChange={(e) =>
                  updateTranslation(locale.code, 'title', e.target.value)
                }
                required={locale.code === 'en'}
                placeholder={t('placeholders.title')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${locale.code}`}>
                {t('languageFields.description', { language: locale.name, required: '' })}
              </Label>
              <Textarea
                id={`description-${locale.code}`}
                value={translations[locale.code].description}
                onChange={(e) =>
                  updateTranslation(locale.code, 'description', e.target.value)
                }
                rows={6}
                placeholder={t('placeholders.description')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`features-${locale.code}`}>
                {t('languageFields.features', { language: locale.name, required: '' })}
              </Label>
              <Textarea
                id={`features-${locale.code}`}
                value={translations[locale.code].features}
                onChange={(e) =>
                  updateTranslation(locale.code, 'features', e.target.value)
                }
                rows={4}
                placeholder={t('placeholders.features')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`coverImage-${locale.code}`}>
                {t('languageFields.coverImage', { language: locale.name, required: '' })}
              </Label>
              <Input
                id={`coverImage-${locale.code}`}
                value={translations[locale.code].coverImage}
                onChange={(e) =>
                  updateTranslation(locale.code, 'coverImage', e.target.value)
                }
                type="url"
                placeholder={t('placeholders.coverImage')}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Global Fields */}
      <div className="border-t border-border pt-8 space-y-6">
        <h3 className="text-lg font-medium text-foreground">Global Settings</h3>

        <div className="space-y-2">
          <Label htmlFor="slug">{t('slugLabel')}</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder={t('slugPlaceholder')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="type">{t('typeLabel')}</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger id="type">
                <SelectValue placeholder={t('typeLabel')} />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(`typeOptions.${option.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t('statusLabel')}</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger id="status">
                <SelectValue placeholder={t('statusLabel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">{t('statusOptions.draft')}</SelectItem>
                <SelectItem value="published">{t('statusOptions.published')}</SelectItem>
                <SelectItem value="archived">{t('statusOptions.archived')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">
              {t('priceLabel', { currencySymbol: getCurrencySymbol(currency) })}
            </Label>
            <Input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              step="0.01"
              min="0"
              required
              placeholder={t('placeholders.price')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">{t('currencyLabel')}</Label>
            <Select value={currency} onValueChange={handleCurrencyChange} required>
              <SelectTrigger id="currency">
                <SelectValue placeholder={t('currencyLabel')} />
              </SelectTrigger>
              <SelectContent>
                {currencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-md font-medium text-foreground">{t('localizedTitle')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('localizedDescription', { currency })}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUPPORTED_CURRENCIES.map((code) => {
              const isBase = code === currency;
              const overrideValue = priceOverrides[code] ?? '';
              const hasManualOverride = overrideValue.trim().length > 0;
              const formatted = formattedPriceMap[code];

              return (
                <div key={code} className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {code} ({getCurrencySymbol(code)})
                      </p>
                      <p className="text-2xl font-semibold text-foreground">{formatted}</p>
                    </div>
                    <Badge variant={isBase ? 'default' : hasManualOverride ? 'secondary' : 'outline'}>
                      {isBase
                        ? t('badge.base')
                        : hasManualOverride
                        ? t('badge.manual')
                        : t('badge.auto')}
                    </Badge>
                  </div>

                  {!isBase && (
                    <div className="space-y-2">
                      <Label htmlFor={`price-${code}`}>{t('overrideLabel')}</Label>
                      <Input
                        id={`price-${code}`}
                        value={overrideValue}
                        onChange={(e) => handleOverrideChange(code, e.target.value)}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder={t('placeholders.override')}
                      />
                      {!hasManualOverride && (
                        <p className="text-xs text-muted-foreground">
                          {t('autoSuggestion', { value: formatted, currency })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(redirectPath ?? '/admin/products')}
          disabled={loading}
        >
          {t('buttons.cancel')}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? t('buttons.saving')
            : mode === 'create'
            ? t('buttons.create')
            : t('buttons.update')}
        </Button>
      </div>
    </form>
  );
}
