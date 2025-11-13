'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent } from '../ui/card';

export interface ProjectTranslationInput {
  locale: string;
  title: string;
  description: string;
  technologies: string[];
  images: string[];
}

export type ProjectFormInitialData = {
  id?: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  url: string | null;
  order: number;
  translations: ProjectTranslationInput[];
};

interface ProjectFormProps {
  initialData?: ProjectFormInitialData;
  mode: 'create' | 'edit';
  redirectPath?: string;
  onSuccess?: () => void;
}

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
];

const categories = [
  { value: 'wordpress', label: 'WordPress' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'optimization', label: 'Optimization' },
];

export default function ProjectForm({ initialData, mode, redirectPath, onSuccess }: ProjectFormProps) {
  const router = useRouter();
  const t = useTranslations('admin.forms.project');
  const tCommon = useTranslations('admin.forms.common');
  const [activeTab, setActiveTab] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category || 'wordpress');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [url, setUrl] = useState(initialData?.url || '');
  const [order, setOrder] = useState(initialData?.order || 0);

  // Translations state
  const [translations, setTranslations] = useState<Record<string, ProjectTranslationInput>>(
    () => {
      const initial: Record<string, ProjectTranslationInput> = {};
      locales.forEach((locale) => {
        const existing = initialData?.translations.find(
          (t) => t.locale === locale.code
        );
        initial[locale.code] = existing || {
          locale: locale.code,
          title: '',
          description: '',
          technologies: [],
          images: [],
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

  const updateTranslation = (locale: string, field: string, value: any) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [field]: value,
      },
    }));
  };

  const handleTechnologiesChange = (locale: string, value: string) => {
    const techArray = value.split(',').map((t) => t.trim()).filter(Boolean);
    updateTranslation(locale, 'technologies', techArray);
  };

  const handleImagesChange = (locale: string, value: string) => {
    const imagesArray = value.split('\n').map((i) => i.trim()).filter(Boolean);
    updateTranslation(locale, 'images', imagesArray);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!slug) {
        throw new Error(t('errors.slugRequired'));
      }

      if (!category) {
        throw new Error(t('errors.categoryRequired'));
      }

      // Check if at least English translation is filled
      if (!translations.en.title || !translations.en.description) {
        throw new Error(t('errors.titleDescription'));
      }

      const data = {
        slug,
        category,
        status,
        featured,
        url: url || null,
        order,
        translations: Object.values(translations).filter(
          (t) => t.title && t.description
        ).map(t => ({
          ...t,
          technologies: t.technologies.length > 0 ? t.technologies : null,
          images: t.images.length > 0 ? t.images : null,
        })),
      };

      const apiUrl =
        mode === 'create'
          ? '/api/admin/portfolio'
          : `/api/admin/portfolio/${initialData?.id}`;

      const response = await fetch(apiUrl, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save project');
      }

      router.push(redirectPath ?? '/admin/portfolio');
      router.refresh();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Global Fields */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">{t('globalTitle')}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="slug">{t('slugLabel')}</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder={t('placeholders.slug')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t('categoryLabel')}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder={t('categoryLabel')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {t(`categoryOptions.${cat.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">{t('statusLabel')}</Label>
            <Select value={status} onValueChange={setStatus}>
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

          <div className="space-y-2">
            <Label htmlFor="order">{t('orderLabel')}</Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              placeholder={t('placeholders.order')}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="url">{t('urlLabel')}</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('placeholders.url')}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium">Featured Project</p>
              <p className="text-sm text-muted-foreground">Highlight this project on listings</p>
            </div>
            <Switch checked={featured} onCheckedChange={setFeatured} id="featured" />
          </div>
        </div>
        </CardContent>
      </Card>

      {/* Language Tabs */}
      <Card>
        <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full justify-start">
            {locales.map((locale) => (
              <TabsTrigger key={locale.code} value={locale.code} className="gap-2">
                <span>{locale.flag}</span>
                <span>{locale.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {locales.map((locale) => (
            <TabsContent key={locale.code} value={locale.code} className="space-y-4">
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
                  onChange={(e) => updateTranslation(locale.code, 'title', e.target.value)}
                  required={locale.code === 'en'}
                  placeholder={t('placeholders.title')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${locale.code}`}>
                  {t('languageFields.description', {
                    language: locale.name,
                    required: locale.code === 'en' ? tCommon('requiredIndicator') : ''
                  })}
                </Label>
                <Textarea
                  id={`description-${locale.code}`}
                  value={translations[locale.code].description}
                  onChange={(e) => updateTranslation(locale.code, 'description', e.target.value)}
                  required={locale.code === 'en'}
                  rows={4}
                  placeholder={t('placeholders.description')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`technologies-${locale.code}`}>
                  {t('languageFields.technologies', { language: locale.name, required: '' })}
                </Label>
                <Input
                  id={`technologies-${locale.code}`}
                  value={translations[locale.code].technologies.join(', ')}
                  onChange={(e) => handleTechnologiesChange(locale.code, e.target.value)}
                  placeholder={t('placeholders.technologies')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`images-${locale.code}`}>
                  {t('languageFields.images', { language: locale.name, required: '' })}
                </Label>
                <Textarea
                  id={`images-${locale.code}`}
                  value={translations[locale.code].images.join('\n')}
                  onChange={(e) => handleImagesChange(locale.code, e.target.value)}
                  rows={5}
                  placeholder={t('placeholders.images')}
                />
                <p className="text-sm text-muted-foreground">{t('placeholders.imagesHelper')}</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(redirectPath ?? '/admin/portfolio')}
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
