import type { TranslationParams } from '../../i18n';

interface CategoryStripProps {
  activeCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  t: (key: string, params?: TranslationParams) => string;
}

const CATEGORIES = [
  { id: 'Produce', image: '/products/apples.png' },
  { id: 'Dairy', image: '/products/milk.png' },
  { id: 'Bakery', image: '/products/bread.png' },
  { id: 'Beverages', image: '/products/juice.png' },
  { id: 'Snacks', image: '/products/snacks.png' },
  { id: 'Personal Care', image: '/products/toothpaste.png' },
  { id: 'Household', image: '/products/soap.png' },
];

export function CategoryStrip({ activeCategory, onSelectCategory, t }: CategoryStripProps) {
  const handleCategoryClick = (catId: string | null) => {
    onSelectCategory(catId);
    setTimeout(() => {
      document.getElementById('discover-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <section className="vc-section px-4 sm:px-6 lg:px-8 py-5 border-b border-[var(--vc-border)]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-[var(--vc-text-muted)]">
            {t('category.shopBy') || 'Shop by Category'}
          </h2>
        </div>

        {/* Horizontal scroll row */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {/* All */}
          <button
            onClick={() => handleCategoryClick(null)}
            className="flex flex-col items-center gap-1.5 shrink-0 group transition-all"
          >
            <div className={`
              w-16 h-16 sm:w-18 sm:h-18 rounded-xl flex items-center justify-center
              border-2 transition-colors overflow-hidden
              ${activeCategory === null
                ? 'border-[var(--vc-primary)] bg-[var(--vc-primary-lt)]'
                : 'border-[var(--vc-border)] bg-[var(--vc-surface)] hover:border-[var(--vc-primary)] hover:bg-[var(--vc-primary-lt)]'}
            `}>
              <svg
                className={`w-7 h-7 transition-colors ${activeCategory === null ? 'text-[var(--vc-primary)]' : 'text-[var(--vc-text-muted)] group-hover:text-[var(--vc-primary)]'}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <span className={`text-[10px] font-bold leading-tight max-w-[64px] text-center transition-colors ${activeCategory === null ? 'text-[var(--vc-primary)]' : 'text-[var(--vc-text-muted)] group-hover:text-[var(--vc-primary)]'}`}>
              {t('category.All') || 'All'}
            </span>
          </button>

          {CATEGORIES.map(c => {
            const isActive = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleCategoryClick(isActive ? null : c.id)}
                className="flex flex-col items-center gap-1.5 shrink-0 group transition-all"
              >
                <div className={`
                  w-16 h-16 rounded-xl overflow-hidden
                  border-2 transition-all
                  ${isActive
                    ? 'border-[var(--vc-primary)] scale-105 shadow-md'
                    : 'border-[var(--vc-border)] hover:border-[var(--vc-primary)] hover:scale-[1.03]'}
                `}>
                  <img
                    src={c.image}
                    alt={t(`category.${c.id}`) || c.id}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`text-[10px] font-bold leading-tight max-w-[64px] text-center transition-colors ${isActive ? 'text-[var(--vc-primary)]' : 'text-[var(--vc-text-muted)] group-hover:text-[var(--vc-primary)]'}`}>
                  {t(`category.${c.id}`) || c.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
