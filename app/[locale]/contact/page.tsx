'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MapPin, Clock, Send } from 'lucide-react';
import { IconBadge } from '@/components/common/IconBadge';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate API call (replace with actual implementation later)
    setTimeout(() => {
      // For now, just show success
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset status after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-muted py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('form.name')}</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('form.namePlaceholder')}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('form.email')}</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('form.emailPlaceholder')}
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('form.subject')}</Label>
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t('form.subjectPlaceholder')}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">{t('form.message')}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('form.messagePlaceholder')}
                      className="resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full"
                    size="lg"
                  >
                    {status === 'sending' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {t('form.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {t('form.send')}
                      </>
                    )}
                  </Button>

                  {/* Status Messages */}
                  {status === 'success' && (
                    <div className="p-4 bg-muted border border-primary/30 rounded-lg text-primary">
                      {t('success')}
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                      {t('error')}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>{t('info.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email */}
                <div className="flex items-start">
                  <IconBadge icon={Mail} variant="primary" className="mr-4" />
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-foreground mb-1">
                      {t('info.email')}
                    </h3>
                    <a
                      href="mailto:contact@dulundu.dev"
                      className="text-primary hover:text-primary transition-colors"
                    >
                      contact@dulundu.dev
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start">
                  <IconBadge icon={MapPin} variant="secondary" className="mr-4" />
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-foreground mb-1">
                      {t('info.location')}
                    </h3>
                    <p className="text-muted-foreground">Remote / Global</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start">
                  <IconBadge icon={Clock} variant="accent" className="mr-4" />
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-foreground mb-1">
                      {t('info.hours')}
                    </h3>
                    <p className="text-muted-foreground">Mon - Fri: 9:00 - 18:00 UTC</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </PageWrapper>
  );
}
