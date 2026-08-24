import { ProductCard } from './ProductCard';
import type { Product } from '../../types';
import type { TranslationParams } from '../../i18n';

interface RecommendationsProps {
  historyRecs: Product[];
  seasonalRecs: Product[];
  saleRecs: Product[];
  language: string;
  onAdd: (productId: string, quantity: number, unit?: string) => void;
  formatPrice: (amount: number) => string;
  t: (key: string, params?: TranslationParams) => string;
}

interface RowProps {
  title: string;
  products: Product[];
  badgeText: string;
  badgeClass: string;
  language: string;
  onAdd: (productId: string, quantity: number, unit?: string) => void;
  formatPrice: (amount: number) => string;
  t: (key: string, params?: TranslationParams) => string;
}

function RecommendationRow({ title, products, badgeText, badgeClass, language, onAdd, formatPrice, t }: RowProps) {
  if (products.length === 0) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-4 sm:px-6 lg:px-8">
        <h3 className="text-sm font-black text-[var(--vc-text)] tracking-tight">{title}</h3>
        <span className="text-xs text-[var(--vc-text-muted)] font-medium">{products.length} items</span>
      </div>
      <div className="flex overflow-x-auto gap-3 px-4 sm:px-6 lg:px-8 pb-3 scrollbar-hide snap-x snap-mandatory">
        {products.map(p => (
          <div key={`${title}-${p.id}`} className="min-w-[160px] w-[180px] flex-none snap-start">
            <ProductCard
              product={p}
              language={language}
              onAdd={onAdd}
              formatPrice={formatPrice}
              badge={{ text: badgeText, className: badgeClass }}
              t={t}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Recommendations({ historyRecs, seasonalRecs, saleRecs, language, onAdd, formatPrice, t }: RecommendationsProps) {
  const hasAnyRecs = historyRecs.length > 0 || seasonalRecs.length > 0 || saleRecs.length > 0;

  if (!hasAnyRecs) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="border border-dashed border-[var(--vc-border)] rounded-xl p-8 text-center">
          <p className="text-sm font-bold text-[var(--vc-text-2)]">{t('recommendations.empty')}</p>
          <p className="text-xs text-[var(--vc-text-muted)] mt-1 max-w-[220px] mx-auto">
            {t('recommendations.emptyHint')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 space-y-6">
      <RecommendationRow
        title={t('recommendations.buyAgain')}
        products={historyRecs}
        badgeText={t('badge.buyAgain')}
        badgeClass="vc-badge-orange text-[10px] font-black"
        language={language} onAdd={onAdd} formatPrice={formatPrice} t={t}
      />
      <RecommendationRow
        title={t('recommendations.seasonal')}
        products={seasonalRecs}
        badgeText={t('badge.seasonal')}
        badgeClass="vc-badge-green text-[10px] font-black"
        language={language} onAdd={onAdd} formatPrice={formatPrice} t={t}
      />
      <RecommendationRow
        title={t('recommendations.onSale')}
        products={saleRecs}
        badgeText={t('badge.onSale')}
        badgeClass="vc-badge-sale text-[10px] font-black"
        language={language} onAdd={onAdd} formatPrice={formatPrice} t={t}
      />
    </div>
  );
}
