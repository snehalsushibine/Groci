import { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import type { Product, ParsedIntent } from '../../types';
import catalogData from '../../data/catalog.json';
import type { TranslationParams } from '../../i18n';

const catalog = catalogData as Product[];

interface DiscoverProps {
  language: string;
  onAdd: (productId: string, quantity: number, unit?: string) => void;
  formatPrice: (amount: number) => string;
  searchIntent?: ParsedIntent | null;
  category?: string | null;
  t: (key: string, params?: TranslationParams) => string;
}

export function Discover({ language, onAdd, formatPrice, searchIntent, category, t }: DiscoverProps) {
  const [localQuery, setLocalQuery] = useState('');

  const query = (localQuery || searchIntent?.item || '').toLowerCase();
  const minPrice = searchIntent?.minPrice;
  const maxPrice = searchIntent?.maxPrice;
  const size = searchIntent?.size;
  const sizeUnit = searchIntent?.sizeUnit;
  const brandQuery = searchIntent?.brand?.toLowerCase();

  const results = useMemo(() => {
    return catalog.filter(product => {
      if (query) {
        const nameMatches = Object.values(product.name).some(n => n.toLowerCase().includes(query));
        const brandMatches = product.brand.toLowerCase().includes(query);
        const categoryMatches = product.category.toLowerCase().includes(query);
        if (!nameMatches && !brandMatches && !categoryMatches) return false;
      }
      const price = product.onSale && product.salePrice ? product.salePrice : product.price;
      if (minPrice && price < minPrice) return false;
      if (maxPrice && price > maxPrice) return false;
      if (size && product.size !== size) return false;
      if (sizeUnit && product.unit.toLowerCase() !== sizeUnit.toLowerCase()) return false;
      if (brandQuery && product.brand.toLowerCase() !== brandQuery) return false;
      if (category && category !== 'All' && product.category !== category) return false;
      return true;
    });
  }, [query, minPrice, maxPrice, size, sizeUnit, brandQuery, category]);

  return (
    <section
      id="discover-section"
      className="border-t border-[var(--vc-border)] py-6"
    >
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 mb-5 flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <h2 className="text-lg font-black text-[var(--vc-text)] tracking-tight">
            {t('discover.title')}
          </h2>
          <p className="text-xs text-[var(--vc-text-muted)] mt-0.5">
            {t('discover.subtitle')}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <label htmlFor="discover-search" className="sr-only">{t('discover.placeholder')}</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-[var(--vc-text-muted)]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd"/>
            </svg>
          </div>
          <input
            id="discover-search"
            type="text"
            value={localQuery}
            onChange={e => setLocalQuery(e.target.value)}
            placeholder={t('discover.placeholder')}
            className="
              block w-full pl-9 pr-3 py-2 border border-[var(--vc-border)]
              rounded-lg bg-[var(--vc-surface)] text-sm text-[var(--vc-text)]
              placeholder-[var(--vc-text-muted)]
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              focus:border-[var(--vc-primary)] transition-colors
            "
          />
        </div>
      </div>

      {/* Active filters */}
      {(searchIntent?.minPrice || searchIntent?.maxPrice || searchIntent?.size) && (
        <div className="px-4 sm:px-6 lg:px-8 mb-4 flex flex-wrap gap-2">
          <span className="text-[10px] font-bold text-[var(--vc-text-xmuted)] uppercase tracking-widest py-1">
            {t('discover.filters')}
          </span>
          {searchIntent.maxPrice && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--vc-primary-lt)] text-[var(--vc-primary)]">
              {t('discover.under', { price: formatPrice(searchIntent.maxPrice) })}
            </span>
          )}
          {searchIntent.size && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--vc-primary-lt)] text-[var(--vc-primary)]">
              {searchIntent.size} {searchIntent.sizeUnit}
            </span>
          )}
        </div>
      )}

      {/* Results */}
      <div className="px-4 sm:px-6 lg:px-8">
        {results.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[var(--vc-border)] rounded-xl">
            <p className="text-sm font-bold text-[var(--vc-text-2)]">{t('discover.empty')}</p>
            <p className="text-xs text-[var(--vc-text-muted)] mt-1">{t('discover.emptyHint')}</p>
          </div>
        ) : (
          <>
            {/* Result count */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-[var(--vc-text-muted)] uppercase tracking-widest">
                {t('discover.results', { count: results.length })}
              </span>
              {category && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--vc-primary-lt)] text-[var(--vc-primary)]">
                  {t(`category.${category}`) || category}
                </span>
              )}
            </div>

            {/* Dense grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
              {results.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  onAdd={onAdd}
                  formatPrice={formatPrice}
                  t={t}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer note */}
      <p className="px-4 sm:px-6 lg:px-8 mt-10 text-[10px] text-[var(--vc-text-xmuted)] text-center">
        {t('footer.disclaimer')}
      </p>
    </section>
  );
}
