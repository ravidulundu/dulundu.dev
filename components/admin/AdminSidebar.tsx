'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Package,
  FileText,
  Briefcase,
  ShoppingCart,
  Settings,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations('admin.sidebar');
  const navigation = [
    { name: t('links.dashboard'), segment: 'dashboard', icon: LayoutDashboard },
    // Products removed - migrating to Services (Feature 028)
    { name: t('links.blog'), segment: 'blog', icon: FileText },
    { name: t('links.portfolio'), segment: 'portfolio', icon: Briefcase },
    { name: t('links.orders'), segment: 'orders', icon: ShoppingCart },
    { name: t('links.settings'), segment: 'settings', icon: Settings },
  ];
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0] ?? 'en';
  const adminBase = `/${locale}/admin`;

  return (
    <aside className="w-64 bg-card border-r border-border">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="mb-8 px-3">
          <h1 className="text-2xl font-bold text-primary">Dulundu.dev</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('title')}</p>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const targetPath = `${adminBase}/${item.segment}`;
            const isActive = pathname.startsWith(targetPath);
            return (
            <Link
              key={item.name}
              href={targetPath}
              className={`
                  flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                  ${
                    isActive
                      ? 'bg-muted text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
            >
              <item.icon className="w-5 h-5" strokeWidth={2} />
              {item.name}
            </Link>
          );
          })}
        </nav>
      </div>
    </aside>
  );
}
