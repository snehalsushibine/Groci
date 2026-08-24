import type { TranslationParams } from '../../i18n';
import catalogData from '../../data/catalog.json';
import type { Product } from '../../types';

const catalog = catalogData as Product[];

interface FeaturedBannerProps {
  onShopSeasonal: () => void;
  t: (key: string, params?: TranslationParams) => string;
}

export function FeaturedBanner({ onShopSeasonal, t }: FeaturedBannerProps) {
  return (
    <section
      className="mx-4 sm:mx-6 lg:mx-8 my-5 rounded-xl overflow-hidden border border-[var(--vc-border)]"
      aria-label="Featured promotion"
    >
      <div className="relative flex items-center gap-0 bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 dark:from-indigo-900 dark:via-indigo-800 dark:to-violet-900">

        {/* Text content */}
        <div className="flex-1 p-6 sm:p-8">
          <p className="text-indigo-200 dark:text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-1">
            {t('banner.label') || 'Weekend Picks'}
          </p>
          <h3 className="text-white text-xl sm:text-2xl font-black leading-snug mb-2">
            {t('banner.title') || 'Fresh essentials for your next grocery run'}
          </h3>
          <p className="text-indigo-200 text-sm mb-5 max-w-sm">
            {t('banner.subtitle') || 'Sample catalog prices — illustrative, not live market rates.'}
          </p>
          <button
            onClick={onShopSeasonal}
            className="
              inline-flex items-center gap-2 px-5 py-2.5
              bg-white text-indigo-700 font-bold text-sm rounded-xl
              hover:bg-indigo-50 transition-colors shadow-sm
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
            "
          >
            {t('banner.cta') || 'Browse Seasonal Picks'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Product image collage — decorative */}
        <div className="hidden sm:flex shrink-0 items-end gap-2 pr-6 pb-0 overflow-hidden h-[160px]">
          {catalog.slice(0, 3).map((p, i) => (
            <div key={p.id} className={`w-24 rounded-t-xl overflow-hidden opacity-90 border border-white/20 shadow-xl mt-auto ${i === 1 ? 'h-32' : i === 0 ? 'h-28' : 'h-24'}`}>
              <img src={p.image} alt="" className="w-full h-full object-cover" aria-hidden="true"/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
