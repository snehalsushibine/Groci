import { useMemo } from 'react';
import type { Product } from '../types';
import catalogData from '../data/catalog.json';

const catalog = catalogData as Product[];

export function useRecommendations() {
  
  // 1. History Based Recommendations
  const historyRecs = useMemo(() => {
    const saved = localStorage.getItem('groci_history');
    if (!saved) return [];
    
    try {
      const history = JSON.parse(saved);
      const freq = history.frequentlyBought || {};
      const sortedIds = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
      // Return top 3 products from history that exist in catalog
      return sortedIds
        .map(id => catalog.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined)
        .slice(0, 3);
    } catch {
      return [];
    }
  }, []); // Could depend on list updates, but on mount is fine for MVP

  // 2. Seasonal Recommendations
  const seasonalRecs = useMemo(() => {
    const currentMonth = new Date().getMonth(); // 0-11
    return catalog.filter(p => p.seasonalMonths.includes(currentMonth)).slice(0, 3);
  }, []);

  // 3. On-Sale Recommendations
  const saleRecs = useMemo(() => {
    return catalog.filter(p => p.onSale).slice(0, 3);
  }, []);

  // 4. Substitutes Helper (Can be called when viewing a specific product)
  const getSubstitutes = (productId: string): Product[] => {
    const product = catalog.find(p => p.id === productId);
    if (!product || !product.substituteIds) return [];
    return product.substituteIds
      .map(subId => catalog.find(p => p.id === subId))
      .filter((p): p is Product => p !== undefined);
  };

  return {
    historyRecs,
    seasonalRecs,
    saleRecs,
    getSubstitutes
  };
}
