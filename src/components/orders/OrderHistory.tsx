
import type { TranslationParams } from '../../i18n';
import type { Order } from '../../hooks/useOrders';

interface Props {
  orders: Order[];
  formatPrice: (amount: number) => string;
  t: (key: string, params?: TranslationParams) => string;
}

export function OrderHistory({ orders, formatPrice, t }: Props) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-4xl opacity-50 mb-3 inline-block">📦</span>
        <p className="text-slate-500 dark:text-slate-400 font-medium">{t('orders.empty')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="vc-surface bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                {t('orders.orderId', { id: order.id })}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400">
                {t('orders.demoLabel')}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {new Date(order.date).toLocaleDateString()} • {order.itemCount} items
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {formatPrice(order.total)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
