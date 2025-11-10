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
  technologies: string[];
  images: string[];
}

interface ProjectFormProps {
  initialData?: {
    id?: string;
    slug: string;
    category: string;
    status: string;
    featured: boolean;
    url: string | null;
    order: number;
    translations: Translation[];
  };
  mode: 'create' | 'edit';
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

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
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
        throw new Error('Slug is required');
      }

      if (!category) {
        throw new Error('Category is required');
      }

      // Check if at least English translation is filled
      if (!translations.en.title || !translations.en.description) {
        throw new Error('English title and description are required');
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

      // Redirect to portfolio list
      router.push('/admin/portfolio');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Global Fields */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Global Settings</h3>
        <div className="space-y-4">
          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="project-slug"
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories}
            required
          />

          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'archived', label: 'Archived' },
            ]}
          />

          <Input
            label="Project URL (Optional)"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />

          <Input
            label="Display Order"
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
            placeholder="0"
          />

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Featured Project</span>
          </label>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {locales.map((locale) => (
            <button
              key={locale.code}
              type="button"
              onClick={() => setActiveTab(locale.code)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === locale.code
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {locale.flag} {locale.name}
            </button>
          ))}
        </div>

        {/* Translation Fields */}
        {locales.map(
          (locale) =>
            activeTab === locale.code && (
              <div key={locale.code} className="space-y-4">
                <Input
                  label="Project Title"
                  value={translations[locale.code].title}
                  onChange={(e) =>
                    updateTranslation(locale.code, 'title', e.target.value)
                  }
                  required={locale.code === 'en'}
                  placeholder="My Awesome Project"
                />

                <Textarea
                  label="Description"
                  value={translations[locale.code].description}
                  onChange={(e) =>
                    updateTranslation(locale.code, 'description', e.target.value)
                  }
                  required={locale.code === 'en'}
                  rows={4}
                  placeholder="Brief description of the project..."
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technologies (comma-separated)
                  </label>
                  <Input
                    value={translations[locale.code].technologies.join(', ')}
                    onChange={(e) =>
                      handleTechnologiesChange(locale.code, e.target.value)
                    }
                    placeholder="React, Next.js, TypeScript, Tailwind CSS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image URLs (one per line)
                  </label>
                  <Textarea
                    value={translations[locale.code].images.join('\n')}
                    onChange={(e) =>
                      handleImagesChange(locale.code, e.target.value)
                    }
                    rows={5}
                    placeholder="https://example.com/image1.jpg"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Enter one image URL per line
                  </p>
                </div>
              </div>
            )
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/portfolio')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : mode === 'create' ? 'Create Project' : 'Update Project'}
        </Button>
      </div>
    </form>
  );
}
