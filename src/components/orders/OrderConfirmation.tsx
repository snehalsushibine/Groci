
import type { TranslationParams } from '../../i18n';

interface Props {
  orderId: string;
  itemCount: number;
  total: number;
  formatPrice: (amount: number) => string;
  t: (key: string, params?: TranslationParams) => string;
  onContinueShopping: () => void;
  onViewOrders: () => void;
}

export function OrderConfirmation({ orderId, itemCount, total, formatPrice, t, onContinueShopping, onViewOrders }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          {t('orders.success')}
        </h2>
        
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">
          {t('orders.orderId', { id: orderId })}
        </p>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mb-8 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{itemCount} items</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">{formatPrice(total)}</span>
        </div>

        <div className="space-y-3">
          <button
            onClick={onContinueShopping}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all active:scale-[0.98]"
          >
            {t('orders.continue')}
          </button>
          <button
            onClick={onViewOrders}
            className="w-full py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all active:scale-[0.98]"
          >
            {t('orders.viewOrders')}
          </button>
        </div>
        
      </div>
    </div>
  );
}
