import { Settings, User, Bell, Shield, Database, Globe } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const sectionConfig = [
  { icon: User, key: 'profile', color: 'blue' },
  { icon: Bell, key: 'notifications', color: 'green' },
  { icon: Shield, key: 'security', color: 'red' },
  { icon: Database, key: 'database', color: 'purple' },
  { icon: Globe, key: 'localization', color: 'orange' },
  { icon: Settings, key: 'system', color: 'gray' }
];

export default async function AdminSettingsPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.settings' });
  const settingsSections = sectionConfig.map((section) => ({
    icon: section.icon,
    color: section.color,
    title: t(`sections.${section.key}.title`),
    description: t(`sections.${section.key}.description`)
  }));

  const colorClasses = {
    blue: 'bg-primary/10 text-primary',
    green: 'bg-primary/10 text-primary',
    red: 'bg-destructive/10 text-destructive',
    purple: 'bg-accent/10 text-accent-foreground',
    orange: 'bg-secondary text-secondary-foreground',
    gray: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('subtitle')}
        </p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="bg-gradient-to-r from-muted to-accent/20 border-primary/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">
              {t('comingSoonTitle')}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {t('comingSoonDescription')}
          </p>
        </CardContent>
      </Card>

      {/* Settings Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          const colorClass = colorClasses[section.color as keyof typeof colorClasses];

          return (
            <Card
              key={section.title}
              className="hover:shadow-md transition-shadow cursor-not-allowed opacity-60"
            >
              <CardContent className="pt-6">
                <div className={`inline-flex p-3 ${colorClass} rounded-lg mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {section.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {section.description}
                </p>
                <div className="mt-4 text-xs text-muted-foreground italic">
                  {t('cardBadge')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">{t('quickActions')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="secondary" disabled className="cursor-not-allowed">
              {t('quickButtons.clearCache')}
            </Button>
            <Button variant="secondary" disabled className="cursor-not-allowed">
              {t('quickButtons.runBackup')}
            </Button>
            <Button variant="secondary" disabled className="cursor-not-allowed">
              {t('quickButtons.exportData')}
            </Button>
            <Button variant="secondary" disabled className="cursor-not-allowed">
              {t('quickButtons.systemInfo')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
