import { useTranslations } from 'next-intl';
import { Zap, Gauge, Code2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SkillsSection() {
  const t = useTranslations('skills');

  const skills = [
    {
      icon: Code2,
      title: t('wordpress.title'),
      description: t('wordpress.description'),
      badges: t.raw('wordpress.badges') as string[],
      variant: 'default' as const,
    },
    {
      icon: Gauge,
      title: t('performance.title'),
      description: t('performance.description'),
      badges: t.raw('performance.badges') as string[],
      variant: 'secondary' as const,
    },
    {
      icon: Zap,
      title: t('fullstack.title'),
      description: t('fullstack.description'),
      badges: t.raw('fullstack.badges') as string[],
      variant: 'outline' as const,
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <Card key={skill.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{skill.title}</CardTitle>
                  <CardDescription className="text-base">
                    {skill.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skill.badges.map((badge) => (
                      <Badge key={badge} variant={skill.variant}>
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
