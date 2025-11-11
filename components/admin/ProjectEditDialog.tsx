'use client';

import { useState } from 'react';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProjectForm, { type ProjectFormInitialData } from '@/components/admin/ProjectForm';

interface ProjectEditDialogProps {
  initialData: ProjectFormInitialData;
  locale: string;
}

export default function ProjectEditDialog({ initialData, locale }: ProjectEditDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('admin.portfolio');

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
        <ProjectForm
          mode="edit"
          initialData={initialData}
          redirectPath={`/${locale}/admin/portfolio`}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
