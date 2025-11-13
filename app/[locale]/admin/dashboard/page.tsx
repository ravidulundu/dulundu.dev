import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { Package, FileText, Briefcase, ShoppingCart, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrencyAmount } from "@/lib/currency";
import { format } from "date-fns";

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

async function getRecentOrders() {
  const orders = await db.order.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders;
}

export default async function AdminDashboard({
  params,
}: {
  params: { locale: string };
}) {
  const [stats, recentOrders] = await Promise.all([
    getStats(),
    getRecentOrders(),
  ]);
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.dashboard' });
  const adminBasePath = `/${params.locale}/admin`;
  const locale = params.locale;

  const cards = [
    {
      title: t('cards.products'),
      value: stats.products,
      icon: Package,
    },
    {
      title: t('cards.posts'),
      value: stats.posts,
      icon: FileText,
    },
    {
      title: t('cards.portfolio'),
      value: stats.projects,
      icon: Briefcase,
    },
    {
      title: t('cards.orders'),
      value: stats.orders,
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <Badge variant="secondary" className="h-7">
          <TrendingUp className="w-3 h-3 mr-1" />
          Live
        </Badge>
      </div>

      <Separator />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                </div>
                <card.icon className="w-6 h-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">{t('quickActions.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`${adminBasePath}/products`}
            className="group relative p-6 border-2 border-border rounded-xl hover:border-primary hover:shadow-lg transition-all duration-200"
          >
            <Package className="w-6 h-6 text-muted-foreground mb-3" />
            <h3 className="font-semibold text-lg mb-1">{t('quickActions.addProduct.title')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('quickActions.addProduct.description')}</p>
          </Link>

          <Link
            href={`${adminBasePath}/blog`}
            className="group relative p-6 border-2 border-border rounded-xl hover:border-primary hover:shadow-lg transition-all duration-200"
          >
            <FileText className="w-6 h-6 text-muted-foreground mb-3" />
            <h3 className="font-semibold text-lg mb-1">{t('quickActions.writePost.title')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('quickActions.writePost.description')}</p>
          </Link>

          <Link
            href={`${adminBasePath}/portfolio`}
            className="group relative p-6 border-2 border-border rounded-xl hover:border-primary hover:shadow-lg transition-all duration-200"
          >
            <Briefcase className="w-6 h-6 text-muted-foreground mb-3" />
            <h3 className="font-semibold text-lg mb-1">{t('quickActions.addProject.title')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t('quickActions.addProject.description')}</p>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">{t('recentOrders.title')}</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`${adminBasePath}/orders`} className="flex items-center gap-1">
              {t('recentOrders.viewAll')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('recentOrders.table.orderId')}</TableHead>
                <TableHead>{t('recentOrders.table.customer')}</TableHead>
                <TableHead>{t('recentOrders.table.total')}</TableHead>
                <TableHead>{t('recentOrders.table.status')}</TableHead>
                <TableHead>{t('recentOrders.table.date')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {t('recentOrders.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-mono text-sm">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {order.customerName || 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.customerEmail}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">
                        {formatCurrencyAmount({
                          amount: order.total.toString(),
                          currency: order.currency,
                          locale,
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'default'
                            : order.status === 'pending'
                            ? 'secondary'
                            : order.status === 'failed'
                            ? 'destructive'
                            : 'outline'
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
