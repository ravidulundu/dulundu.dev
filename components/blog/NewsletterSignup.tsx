'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Check, AlertCircle } from 'lucide-react';

export function NewsletterSignup() {
  const t = useTranslations('blog');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage(t('newsletterEmailRequired'));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage(t('newsletterEmailInvalid'));
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error || t('newsletterError'));
        return;
      }

      setStatus('success');
      setMessage(t('newsletterSuccess'));
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(t('newsletterError'));
    }
  };

  return (
    <Card className="my-12 bg-card border-border">
      <CardContent className="p-8 md:p-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          {/* Title & Description */}
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {t('newsletterTitle')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t('newsletterDescription')}
          </p>

          {/* Form */}
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-500">
              <Check className="w-5 h-5" />
              <p className="font-medium">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder={t('newsletterPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className={status === 'error' ? 'border-red-500' : ''}
                />
              </div>
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="gap-2"
              >
                {status === 'loading' ? t('newsletterSending') : t('newsletterSubscribe')}
              </Button>
            </form>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-500 mt-3">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{message}</p>
            </div>
          )}

          {/* Privacy Note */}
          <p className="text-xs text-muted-foreground mt-4">
            {t('newsletterPrivacy')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
