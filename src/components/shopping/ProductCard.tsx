import { useState } from 'react';
import type { Product } from '../../types';
import type { TranslationParams } from '../../i18n';

interface ProductCardProps {
  product: Product;
  formatPrice: (amount: number, productId?: string, isOnSale?: boolean) => string;
  language: string;
  onAdd: (productId: string, quantity: number, unit?: string) => void;
  badge?: { text: string; className: string };
  t: (key: string, params?: TranslationParams) => string;
}

export function ProductCard({ product, formatPrice, language, onAdd, badge, t }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const name = product.name[language] ?? product.name['en-US'];
  const isSale = !!(product.onSale && product.salePrice);

  const handleAdd = () => {
    if (!product.availability || added) return;
    onAdd(product.id, 1, product.unit);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="vc-card flex flex-col h-full group relative overflow-hidden transition-all duration-200">

      {/* ── Product Image ─────────────────── */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-[0.65rem] bg-[var(--vc-section)]">
        <img
          src={product.image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          loading="lazy"
        />

        {/* Sale badge overlay */}
        {isSale && (
          <span className="absolute top-2 left-2 vc-badge-sale text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
            SALE
          </span>
        )}

        {/* Custom badge (for Recommendations row) */}
        {badge && !isSale && (
          <span className={`absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${badge.className}`}>
            {badge.text}
          </span>
        )}

        {/* Out-of-stock overlay */}
        {!product.availability && (
          <div className="absolute inset-0 bg-white/70 dark:bg-black/60 flex items-center justify-center">
            <span className="text-xs font-bold text-[var(--vc-text-muted)] uppercase tracking-widest">
              {t('shopping.outOfStock')}
            </span>
          </div>
        )}
      </div>

      {/* ── Card Body ────────────────────── */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        {/* Brand */}
        <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--vc-text-xmuted)] truncate">
          {product.brand}
        </p>

        {/* Product name */}
        <h3
          className="text-sm font-bold text-[var(--vc-text)] leading-snug line-clamp-2"
          title={name}
        >
          {name}
        </h3>

        {/* Size / unit */}
        <p className="text-xs text-[var(--vc-text-muted)]">
          {product.size} {product.unit}
        </p>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className={`text-base font-black ${isSale ? 'text-[var(--vc-sale)]' : 'text-[var(--vc-text)]'}`}>
            {formatPrice(product.salePrice ?? product.price, product.id, isSale)}
          </span>
          {isSale && (
            <span className="text-xs text-[var(--vc-text-xmuted)] line-through font-medium">
              {formatPrice(product.price, product.id, false)}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAdd}
          disabled={!product.availability}
          aria-label={product.availability ? `Add ${name} to cart` : `${name} unavailable`}
          className={`
            mt-2 w-full py-2 rounded-lg text-xs font-bold
            transition-all duration-200 active:scale-[0.97]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
            ${added
              ? 'bg-[var(--vc-success-lt)] text-[var(--vc-success)] border border-[var(--vc-success)]'
              : product.availability
                ? 'bg-[var(--vc-primary-lt)] text-[var(--vc-primary-hover)] hover:bg-[var(--vc-primary)] hover:text-white dark:hover:bg-[var(--vc-primary)] dark:hover:text-white border border-transparent hover:border-[var(--vc-primary)]'
                : 'bg-[var(--vc-section)] text-[var(--vc-text-xmuted)] cursor-not-allowed border border-[var(--vc-border-lt)]'
            }
          `}
        >
          {added
            ? '✓ ' + (t('shopping.added') || 'Added')
            : product.availability
              ? t('shopping.add')
              : t('shopping.unavailable')}
        </button>
      </div>
    </div>
  );
}
