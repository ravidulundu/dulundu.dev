import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { Package, FileText, Briefcase, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getStats() {
  const [productsCount, postsCount, projectsCount, ordersCount] = await Promise.all([
    db.product.count(),
    db.post.count(),
    db.project.count(),
    db.order.count(),
  ]);

  return {
    products: productsCount,
    posts: postsCount,
    projects: projectsCount,
    orders: ordersCount,
  };
}

export default async function AdminDashboard({
  params,
}: {
  params: { locale: string };
}) {
  const stats = await getStats();
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.dashboard' });
  const adminBasePath = `/${params.locale}/admin`;

  const cards = [
    {
      title: t('cards.products'),
      value: stats.products,
      icon: Package,
      color: 'bg-muted0',
    },
    {
      title: t('cards.posts'),
      value: stats.posts,
      icon: FileText,
      color: 'bg-muted0',
    },
    {
      title: t('cards.portfolio'),
      value: stats.projects,
      icon: Briefcase,
      color: 'bg-accent/100',
    },
    {
      title: t('cards.orders'),
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-accent/100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quickActions.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href={`${adminBasePath}/products`}
              className="p-4 border border-border rounded-lg hover:border-primary hover:bg-muted transition-colors"
            >
              <Package className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">{t('quickActions.addProduct.title')}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t('quickActions.addProduct.description')}</p>
            </Link>
            <Link
              href={`${adminBasePath}/blog`}
              className="p-4 border border-border rounded-lg hover:border-primary hover:bg-muted transition-colors"
            >
              <FileText className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">{t('quickActions.writePost.title')}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t('quickActions.writePost.description')}</p>
            </Link>
            <Link
              href={`${adminBasePath}/portfolio`}
              className="p-4 border border-border rounded-lg hover:border-purple-500 hover:bg-accent/10 transition-colors"
            >
              <Briefcase className="w-8 h-8 text-accent mb-2" />
              <h3 className="font-semibold text-foreground">{t('quickActions.addProject.title')}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t('quickActions.addProject.description')}</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
