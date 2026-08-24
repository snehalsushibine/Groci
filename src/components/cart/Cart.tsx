import type { ShoppingListItem, Product } from '../../types';
import catalogData from '../../data/catalog.json';
import type { TranslationParams } from '../../i18n';

const catalog = catalogData as Product[];

interface Props {
  items: ShoppingListItem[];
  onRemove: (productId: string) => void;
  onModify: (productId: string, qty: number) => void;
  language: string;
  formatPrice: (amount: number) => string;
  t: (key: string, params?: TranslationParams) => string;
  onCheckout: () => void;
}

export function Cart({ items, onRemove, onModify, language, formatPrice, t, onCheckout }: Props) {
  if (items.length === 0) {
    return (
      <div className="vc-cart-panel flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-4 border-b border-[var(--vc-border)] flex items-center justify-between">
          <h2 className="text-base font-black text-[var(--vc-text)] tracking-tight">{t('cart.title')}</h2>
          <span className="text-xs font-bold text-[var(--vc-text-xmuted)] bg-[var(--vc-section)] px-2.5 py-1 rounded-full">
            0
          </span>
        </div>
        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6 py-12">
          <div className="w-14 h-14 rounded-2xl bg-[var(--vc-section)] flex items-center justify-center mb-1">
            <svg className="w-7 h-7 text-[var(--vc-text-xmuted)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
          </div>
          <p className="text-sm font-bold text-[var(--vc-text-2)]">{t('shopping.empty')}</p>
          <p className="text-xs text-[var(--vc-text-muted)] max-w-[200px]">
            {t('shopping.emptyHint')}
          </p>
          <p className="text-[11px] font-semibold text-[var(--vc-primary)] italic mt-1">
            "{t('shopping.emptyExample')}"
          </p>
        </div>
      </div>
    );
  }

  let subtotal = 0;
  const itemsList = items.map(item => {
    const product = catalog.find(p => p.id === item.productId);
    const unitPrice = product ? (product.onSale ? (product.salePrice ?? product.price) : product.price) : 0;
    subtotal += unitPrice * item.quantity;
    const displayName = product?.name[language] ?? product?.name['en-US'] ?? 'Unknown Item';
    return { item, product, displayName, unitPrice };
  });

  const deliveryFee = 5;
  const total = subtotal + deliveryFee;

  return (
    <div className="vc-cart-panel flex flex-col h-full">

      {/* Cart Header */}
      <div className="px-4 py-4 border-b border-[var(--vc-border)] flex items-center justify-between sticky top-0 z-10 bg-[var(--vc-cart-bg)]">
        <h2 className="text-base font-black text-[var(--vc-text)] tracking-tight">{t('cart.title')}</h2>
        <span className="text-xs font-black text-white bg-[var(--vc-primary)] px-2.5 py-1 rounded-full min-w-[28px] text-center">
          {items.length}
        </span>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto">
        <ul role="list" className="divide-y divide-[var(--vc-border-lt)]">
          {itemsList.map(({ item, product, displayName, unitPrice }) => (
            <li key={item.id} className="px-4 py-3 hover:bg-[var(--vc-section)] transition-colors">

              {/* Row: thumbnail + details */}
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-[var(--vc-border)] bg-[var(--vc-section)]">
                  {product?.image && (
                    <img src={product.image} alt={displayName} className="w-full h-full object-cover"/>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--vc-text)] leading-snug truncate">{displayName}</p>
                  <p className="text-[10px] text-[var(--vc-text-muted)] mt-0.5 flex items-center gap-1">
                    {product?.brand && <span>{product.brand}</span>}
                    {product?.brand && <span>·</span>}
                    <span>{product?.size} {product?.unit}</span>
                    {product?.onSale && (
                      <span className="vc-badge-sale text-[9px] font-black px-1.5 py-0.5 rounded ml-1">
                        {t('shopping.sale')}
                      </span>
                    )}
                  </p>

                  {/* Controls row */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-0.5 bg-[var(--vc-section)] rounded-lg p-0.5 border border-[var(--vc-border)]">
                      <button
                        onClick={() => onModify(item.productId, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-[var(--vc-surface)] shadow-sm text-[var(--vc-text-2)] font-black hover:text-[var(--vc-primary)] flex items-center justify-center transition-colors text-sm"
                        aria-label={`Decrease ${displayName}`}
                      >−</button>
                      <span className="w-7 text-center text-xs font-black text-[var(--vc-text)]">{item.quantity}</span>
                      <button
                        onClick={() => onModify(item.productId, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-[var(--vc-surface)] shadow-sm text-[var(--vc-text-2)] font-black hover:text-[var(--vc-primary)] flex items-center justify-center transition-colors text-sm"
                        aria-label={`Increase ${displayName}`}
                      >+</button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[var(--vc-text)]">
                        {formatPrice(unitPrice * item.quantity)}
                      </span>
                      <button
                        onClick={() => onRemove(item.productId)}
                        className="w-6 h-6 flex items-center justify-center rounded text-[var(--vc-text-xmuted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label={`Remove ${displayName}`}
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Cart Summary */}
      <div className="border-t border-[var(--vc-border)] p-4 shrink-0 bg-[var(--vc-cart-bg)] sticky bottom-0">
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs text-[var(--vc-text-muted)] font-medium">
            <span>{t('cart.subtotal')}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-[var(--vc-text-muted)] font-medium">
            <span>{t('cart.delivery')}</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-[var(--vc-text)] pt-2 border-t border-[var(--vc-border)]">
            <span>{t('cart.total')}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="
            w-full bg-[var(--vc-primary)] hover:bg-[var(--vc-primary-hover)]
            text-white font-black py-3 rounded-xl transition-all
            shadow-sm hover:shadow-md focus:outline-none focus:ring-4
            focus:ring-indigo-500/20 active:scale-[0.98] text-sm
          "
        >
          {t('cart.checkout')}
        </button>
      </div>
    </div>
  );
}
