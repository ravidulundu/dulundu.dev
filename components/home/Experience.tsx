'use client';

import { Badge } from '@/components/ui/badge';
import { Building2, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ExperienceItemProps {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  isFirst?: boolean;
}

const ExperienceItem = ({
  title,
  company,
  period,
  description,
  technologies,
  isFirst = false,
}: ExperienceItemProps) => {
  return (
    <div className="relative pl-8 not-last:pb-12 group">
      {/* Timeline dot only - no line */}
      <div className="absolute left-0 top-2.5">
        <div className="h-3 w-3 -left-[5px] rounded-full border-2 border-primary bg-background" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 size-9 bg-accent rounded-full flex items-center justify-center">
            <Building2 className="size-5 text-muted-foreground" />
          </div>
          <span className="text-lg font-semibold">{company}</span>
        </div>
        <div>
          <h3 className="text-xl font-medium">{title}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <Calendar className="size-4" />
            <span>{period}</span>
          </div>
        </div>
        <p className="text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge key={tech} variant="secondary" className="rounded-full">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export function Experience() {
  const t = useTranslations('experience');

  // Parse experiences from translations
  const experiences = [
    {
      title: t('items.0.title'),
      company: t('items.0.company'),
      period: t('items.0.period'),
      description: t('items.0.description'),
      technologies: t('items.0.technologies').split(','),
    },
    {
      title: t('items.1.title'),
      company: t('items.1.company'),
      period: t('items.1.period'),
      description: t('items.1.description'),
      technologies: t('items.1.technologies').split(','),
    },
    {
      title: t('items.2.title'),
      company: t('items.2.company'),
      period: t('items.2.period'),
      description: t('items.2.description'),
      technologies: t('items.2.technologies').split(','),
    },
  ];

  return (
    <section id="experience" className="relative py-20 px-6">
      <div className="max-w-screen-md mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {t('badge')}
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {t('title')}
          </h2>
          <p className="text-muted-foreground mt-2 sm:mt-4 text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="relative">
          {experiences.map((experience, index) => (
            <ExperienceItem
              key={index}
              {...experience}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
