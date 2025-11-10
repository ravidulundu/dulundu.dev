'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from './RichTextEditor';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface Translation {
  locale: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
}

interface BlogFormProps {
  initialData?: {
    id?: string;
    slug: string;
    status: string;
    featured: boolean;
    publishedAt: string | null;
    translations: Translation[];
  };
  mode: 'create' | 'edit';
}

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
];

export default function BlogForm({ initialData, mode }: BlogFormProps) {
  const router = useRouter();
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
        throw new Error('Slug is required');
      }

      // Check if at least English translation is filled
      if (!translations.en.title || !translations.en.excerpt) {
        throw new Error('English title and excerpt are required');
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
      router.push('/admin/blog');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Global Fields */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Global Settings
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="URL Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-blog-post"
            required
          />

          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
            ]}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Featured Post
              </span>
            </label>
          </div>

          <Input
            label="Publish Date (optional)"
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </div>
      </div>

      {/* Language Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Tab Headers */}
        <div className="border-b border-gray-200 flex">
          {locales.map((locale) => (
            <button
              key={locale.code}
              type="button"
              onClick={() => setActiveTab(locale.code)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === locale.code
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{locale.flag}</span>
              {locale.name}
              {translations[locale.code].title && (
                <span className="ml-2 text-green-600">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4">
          {locales.map((locale) => (
            <div
              key={locale.code}
              className={activeTab === locale.code ? 'block' : 'hidden'}
            >
              <Input
                label="Title"
                value={translations[locale.code].title}
                onChange={(e) =>
                  updateTranslation(locale.code, 'title', e.target.value)
                }
                placeholder={`Blog title in ${locale.name}`}
                required={locale.code === 'en'}
              />

              <div className="mt-4">
                <Textarea
                  label="Excerpt (Max 160 characters)"
                  value={translations[locale.code].excerpt}
                  onChange={(e) =>
                    updateTranslation(locale.code, 'excerpt', e.target.value)
                  }
                  placeholder={`Brief description in ${locale.name}`}
                  rows={3}
                  maxLength={160}
                  required={locale.code === 'en'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {translations[locale.code].excerpt.length}/160 characters
                </p>
              </div>

              <div className="mt-4">
                <Input
                  label="Cover Image URL (optional)"
                  value={translations[locale.code].coverImage}
                  onChange={(e) =>
                    updateTranslation(locale.code, 'coverImage', e.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <RichTextEditor
                  content={translations[locale.code].content}
                  onChange={(content) =>
                    updateTranslation(locale.code, 'content', content)
                  }
                  placeholder={`Write your blog content in ${locale.name}...`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/blog')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Update Post'}
        </Button>
      </div>
    </form>
  );
}
