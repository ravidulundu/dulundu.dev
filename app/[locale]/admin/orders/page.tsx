import { db } from "@/lib/db";
import { format } from "date-fns";
import { getTranslations } from "next-intl/server";
import { formatCurrencyAmount } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

async function getOrders() {
  const orders = await db.order.findMany({
    include: {
      items: {
        include: {
          product: {
            include: {
              translations: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders;
}

export default async function OrdersPage({
  params,
}: {
  params: { locale: string };
}) {
  const orders = await getOrders();
  const locale = params.locale;
  const t = await getTranslations({ locale, namespace: 'admin.orders' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.orderId')}</TableHead>
              <TableHead>{t('table.customer')}</TableHead>
              <TableHead>{t('table.products')}</TableHead>
              <TableHead>{t('table.total')}</TableHead>
              <TableHead>{t('table.status')}</TableHead>
              <TableHead>{t('table.date')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t('empty')}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
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
                    <div className="space-y-1">
                      {order.items.map((item) => {
                        const translation = item.product.translations.find(t => t.locale === locale) ||
                          item.product.translations.find(t => t.locale === 'en');
                        return (
                          <div key={item.id} className="text-sm">
                            {translation?.title || 'Product'} x{item.quantity}
                          </div>
                        );
                      })}
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
                    <div className="text-xs text-muted-foreground uppercase">
                      {order.currency}
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
                      {t(`statusLabels.${order.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
