'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function ProjectInquiryForm() {
  const t = useTranslations('projectInquiry');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        projectType: '',
        budget: '',
        timeline: '',
        description: '',
      });
    } catch (err) {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('formTitle')}</CardTitle>
            <CardDescription>{t('formDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {t('success')}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('name')} *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('namePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">{t('company')}</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder={t('companyPlaceholder')}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectType">{t('projectType')} *</Label>
                  <Select
                    value={formData.projectType}
                    onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('projectTypePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wordpress">{t('types.wordpress')}</SelectItem>
                      <SelectItem value="optimization">{t('types.optimization')}</SelectItem>
                      <SelectItem value="fullstack">{t('types.fullstack')}</SelectItem>
                      <SelectItem value="consulting">{t('types.consulting')}</SelectItem>
                      <SelectItem value="other">{t('types.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">{t('budget')} *</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => setFormData({ ...formData, budget: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('budgetPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000-3000">$1,000 - $3,000</SelectItem>
                      <SelectItem value="3000-5000">$3,000 - $5,000</SelectItem>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10000+">{t('budgetOptions.10000plus')}</SelectItem>
                      <SelectItem value="flexible">{t('budgetOptions.flexible')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">{t('timeline')} *</Label>
                <Select
                  value={formData.timeline}
                  onValueChange={(value) => setFormData({ ...formData, timeline: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('timelinePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">{t('timelineOptions.urgent')}</SelectItem>
                    <SelectItem value="1-2weeks">{t('timelineOptions.1-2weeks')}</SelectItem>
                    <SelectItem value="2-4weeks">{t('timelineOptions.2-4weeks')}</SelectItem>
                    <SelectItem value="1-2months">{t('timelineOptions.1-2months')}</SelectItem>
                    <SelectItem value="flexible">{t('timelineOptions.flexible')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('description')} *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('descriptionPlaceholder')}
                  rows={6}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? t('sending') : t('submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
