import type { Product } from '../../types';

interface Props {
  results: Product[];
  onAdd: (productId: string, quantity: number, unit?: string) => void;
  language: string;
}

export default function SearchResults({ results, onAdd, language }: Props) {
  if (results.length === 0) {
    return (
      <div className="vc-surface py-10 flex flex-col items-center gap-2 text-center">
        <span className="text-3xl">🔍</span>
        <p className="text-sm font-semibold text-slate-600">No products matched your search</p>
        <p className="text-xs text-slate-400">Try a broader term, or adjust your brand, size, or price filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {results.map(product => {
        const name = product.name[language] ?? product.name['en-US'];
        const displayPrice = product.onSale ? (product.salePrice ?? product.price) : product.price;

        return (
          <div
            key={product.id}
            className="vc-surface p-3.5 flex flex-col hover:border-blue-200 transition-colors duration-150"
          >
            {/* Brand + availability badges */}
            <div className="flex items-start justify-between gap-1 mb-2">
              <span className="vc-badge bg-blue-50 text-blue-600 truncate max-w-[70%]">{product.brand}</span>
              {!product.availability && (
                <span className="vc-badge bg-slate-100 text-slate-400 shrink-0">Out of stock</span>
              )}
            </div>

            {/* Name */}
            <p className="text-sm font-bold text-slate-800 leading-snug flex-1">{name}</p>
            <p className="text-xs text-slate-400 mt-0.5 mb-3">{product.size} {product.unit}</p>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-base font-black text-slate-900">${displayPrice.toFixed(2)}</span>
              {product.onSale && (
                <>
                  <span className="text-xs text-slate-400 line-through">${product.price.toFixed(2)}</span>
                  <span className="vc-badge bg-red-50 text-red-500">Sale</span>
                </>
              )}
            </div>

            {/* Add button */}
            <button
              onClick={() => onAdd(product.id, 1, product.unit)}
              disabled={!product.availability}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                product.availability
                  ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              aria-label={product.availability ? `Add ${name} to list` : `${name} is out of stock`}
            >
              {product.availability ? '+ Add to list' : 'Unavailable'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
