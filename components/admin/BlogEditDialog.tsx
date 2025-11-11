'use client';

import { useState } from 'react';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BlogForm, { type BlogFormInitialData } from '@/components/admin/BlogForm';

interface BlogEditDialogProps {
  initialData: BlogFormInitialData;
  locale: string;
}

export default function BlogEditDialog({ initialData, locale }: BlogEditDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('admin.blog');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary hover:text-primary">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('dialogTitle')}</DialogTitle>
          <DialogDescription>{t('dialogDescription')}</DialogDescription>
        </DialogHeader>
        <BlogForm
          mode="edit"
          initialData={initialData}
          redirectPath={`/${locale}/admin/blog`}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
