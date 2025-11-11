import { db } from "@/lib/db";
import { format } from "date-fns";
import { getTranslations } from "next-intl/server";
import { formatCurrencyAmount } from "@/lib/currency";

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
        <h1 className="text-3xl font-bold text-foreground dark:text-white">{t('title')}</h1>
        <p className="text-muted-foreground dark:text-muted-foreground mt-2">{t('subtitle')}</p>
      </div>

      {/* Orders Table */}
      <div className="bg-card dark:bg-card rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-border dark:divide-border">
          <thead className="bg-muted dark:bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground/70 uppercase tracking-wider">
                {t('table.orderId')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground/70 uppercase tracking-wider">
                {t('table.customer')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground/70 uppercase tracking-wider">
                {t('table.products')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground/70 uppercase tracking-wider">
                {t('table.total')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground/70 uppercase tracking-wider">
                {t('table.status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground/70 uppercase tracking-wider">
                {t('table.date')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-card dark:bg-card divide-y divide-border dark:divide-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground dark:text-muted-foreground">
                  {t('empty')}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted dark:hover:bg-muted">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-foreground dark:text-white">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground dark:text-white">
                      {order.customerName || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground dark:text-white">
                      {order.items.map((item) => {
                        const translation = item.product.translations.find(t => t.locale === locale) ||
                          item.product.translations.find(t => t.locale === 'en');
                        return (
                          <div key={item.id}>
                            {translation?.title || 'Product'} x{item.quantity}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-foreground dark:text-white">
                      {formatCurrencyAmount({
                        amount: order.total.toString(),
                        currency: order.currency,
                        locale,
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                      {order.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        order.status === 'completed'
                          ? 'bg-primary/10 text-primary'
                          : order.status === 'pending'
                            ? 'bg-secondary text-secondary-foreground'
                            : order.status === 'failed'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-muted text-foreground'
                      }`}
                    >
                      {t(`statusLabels.${order.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground dark:text-white">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
