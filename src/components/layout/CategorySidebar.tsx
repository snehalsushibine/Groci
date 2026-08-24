import type { TranslationParams } from '../../i18n';

interface Props {
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

export function CategorySidebar({ activeCategory, onSelectCategory, t }: Props) {
  const isActive = (id: string | null) => activeCategory === id;

  const handleCategoryClick = (catId: string | null) => {
    onSelectCategory(catId);
    setTimeout(() => {
      document.getElementById('discover-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const btnClass = (id: string | null) =>
    `w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-semibold text-left relative
    ${isActive(id)
      ? 'bg-[var(--vc-primary-lt)] text-[var(--vc-primary-hover)] border-l-[3px] border-[var(--vc-primary)] pl-[calc(0.75rem-3px)] font-bold'
      : 'text-[var(--vc-text-2)] hover:bg-[var(--vc-section)] hover:text-[var(--vc-text)] border-l-[3px] border-transparent'
    }`;

  return (
    <aside className="w-full h-full flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible scrollbar-hide">

      {/* Section label — desktop only */}
      <p className="hidden lg:block text-[10px] font-black text-[var(--vc-text-xmuted)] uppercase tracking-widest px-3 mb-2 mt-1">
        {t('sidebar.browse') || 'Browse'}
      </p>

      {/* All Products */}
      <button
        onClick={() => handleCategoryClick(null)}
        className={`${btnClass(null)} shrink-0 lg:shrink`}
      >
        <div className="w-7 h-7 rounded bg-[var(--vc-section)] flex items-center justify-center shrink-0">
          <svg className="w-3.5 h-3.5 text-[var(--vc-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <span className="truncate">{t('category.All') || 'All Products'}</span>
      </button>

      {CATEGORIES.map(c => (
        <button
          key={c.id}
          onClick={() => handleCategoryClick(c.id)}
          className={`${btnClass(c.id)} whitespace-nowrap lg:whitespace-normal shrink-0 lg:shrink`}
        >
          <div className="w-7 h-7 rounded-md overflow-hidden shrink-0 border border-[var(--vc-border)]">
            <img
              src={c.image}
              alt={c.id}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="truncate">{t(`category.${c.id}`) || c.id}</span>
        </button>
      ))}
    </aside>
  );
}
