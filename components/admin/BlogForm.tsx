'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

export interface BlogTranslationInput {
  locale: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
}

export type BlogFormInitialData = {
  id?: string;
  slug: string;
  status: string;
  featured: boolean;
  publishedAt: string | null;
  translations: BlogTranslationInput[];
};

interface BlogFormProps {
  initialData?: BlogFormInitialData;
  mode: 'create' | 'edit';
  redirectPath?: string;
  onSuccess?: () => void;
}

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
];

export default function BlogForm({ initialData, mode, redirectPath, onSuccess }: BlogFormProps) {
  const router = useRouter();
  const t = useTranslations('admin.forms.blog');
  const tCommon = useTranslations('admin.forms.common');
  const [activeTab, setActiveTab] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
      : ''
  );

  // Translations state
  const [translations, setTranslations] = useState<Record<string, BlogTranslationInput>>(
    () => {
      const initial: Record<string, BlogTranslationInput> = {};
      locales.forEach((locale) => {
        const existing = initialData?.translations.find(
          (t) => t.locale === locale.code
        );
        initial[locale.code] = existing || {
          locale: locale.code,
          title: '',
          excerpt: '',
          content: '',
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
      if (!slug) {
        throw new Error(t('errors.slugRequired'));
      }

      // Check if at least English translation is filled
      if (!translations.en.title || !translations.en.excerpt) {
        throw new Error(t('errors.englishTitleExcerpt'));
      }

      const data = {
        slug,
        status,
        featured,
        publishedAt: publishedAt || null,
        translations: Object.values(translations).filter(
          (t) => t.title && t.excerpt
        ),
      };

      const url =
        mode === 'create'
          ? '/api/admin/blog'
          : `/api/admin/blog/${initialData?.id}`;

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save post');
      }

      // Redirect to blog list
      router.push(redirectPath ?? '/admin/blog');
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
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Global Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">{t('globalTitle')}</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="slug">{t('slugLabel')}</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={t('placeholders.slug')}
              required
            />
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
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featured}
              onCheckedChange={(checked) => setFeatured(checked as boolean)}
            />
            <Label htmlFor="featured" className="text-sm font-medium cursor-pointer">
              {t('featuredLabel')}
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishedAt">{t('publishedAtLabel')}</Label>
            <Input
              id="publishedAt"
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Language Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          {locales.map((locale) => (
            <TabsTrigger key={locale.code} value={locale.code} className="gap-2">
              <span>{locale.flag}</span>
              <span>{locale.name}</span>
              {translations[locale.code].title && <span className="text-primary">✓</span>}
            </TabsTrigger>
          ))}
        </TabsList>

        {locales.map((locale) => (
          <TabsContent key={locale.code} value={locale.code} className="space-y-4 p-1">
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
                placeholder={t('placeholders.title')}
                required={locale.code === 'en'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`excerpt-${locale.code}`}>
                {t('languageFields.excerpt', {
                  language: locale.name,
                  required: locale.code === 'en' ? tCommon('requiredIndicator') : ''
                })}
              </Label>
              <Textarea
                id={`excerpt-${locale.code}`}
                value={translations[locale.code].excerpt}
                onChange={(e) => updateTranslation(locale.code, 'excerpt', e.target.value)}
                placeholder={t('placeholders.excerpt')}
                rows={3}
                maxLength={160}
                required={locale.code === 'en'}
              />
              <p className="text-xs text-muted-foreground">
                {t('excerptCounter', { count: translations[locale.code].excerpt.length, max: 160 })}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`cover-${locale.code}`}>
                {t('languageFields.coverImage', { language: locale.name, required: '' })}
              </Label>
              <Input
                id={`cover-${locale.code}`}
                value={translations[locale.code].coverImage}
                onChange={(e) => updateTranslation(locale.code, 'coverImage', e.target.value)}
                placeholder={t('placeholders.coverImage')}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('languageFields.content', { language: locale.name, required: '' })}</Label>
              <RichTextEditor
                content={translations[locale.code].content}
                onChange={(content) => updateTranslation(locale.code, 'content', content)}
                placeholder={t('placeholders.content', { language: locale.name })}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(redirectPath ?? '/admin/blog')}
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
