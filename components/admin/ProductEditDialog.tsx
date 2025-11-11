'use client';

import { useState } from 'react';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ProductForm, { type ProductFormInitialData } from '@/components/admin/ProductForm';

interface ProductEditDialogProps {
  initialData: ProductFormInitialData;
  locale: string;
}

export default function ProductEditDialog({ initialData, locale }: ProductEditDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('admin.products');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary hover:text-primary">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('editDialog.title')}</DialogTitle>
          <DialogDescription>{t('editDialog.description')}</DialogDescription>
        </DialogHeader>
        <ProductForm
          mode="edit"
          initialData={initialData}
          redirectPath={`/${locale}/admin/products`}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
