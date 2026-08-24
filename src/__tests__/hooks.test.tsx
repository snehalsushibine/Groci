import { renderHook, act } from '@testing-library/react';
import { useShoppingList } from '../hooks/useShoppingList';
import { useRecommendations } from '../hooks/useRecommendations';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useShoppingList', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes empty', () => {
    const { result } = renderHook(() => useShoppingList());
    expect(result.current.items).toEqual([]);
  });

  it('adds an item to the list', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => {
      result.current.addItem('p1', 1, 'litre');
    });
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].productId).toBe('p1');
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('handles duplicate item by incrementing quantity', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => {
      result.current.addItem('p1', 1, 'litre');
      result.current.addItem('p1', 2, 'litre');
    });
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('removes an item', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => {
      result.current.addItem('p1', 1);
      result.current.removeItem('p1');
    });
    expect(result.current.items.length).toBe(0);
  });

  it('modifies item quantity', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => {
      result.current.addItem('p1', 1);
      result.current.modifyItem('p1', 5);
    });
    expect(result.current.items[0].quantity).toBe(5);
  });

  it('removes item if quantity modified to 0', () => {
    const { result } = renderHook(() => useShoppingList());
    act(() => {
      result.current.addItem('p1', 1);
      result.current.modifyItem('p1', 0);
    });
    expect(result.current.items.length).toBe(0);
  });
});

describe('useRecommendations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides on-sale recommendations', () => {
    const { result } = renderHook(() => useRecommendations());
    expect(result.current.saleRecs.length).toBeGreaterThan(0);
    expect(result.current.saleRecs[0].onSale).toBe(true);
  });

  it('provides seasonal recommendations', () => {
    const { result } = renderHook(() => useRecommendations());
    const currentMonth = new Date().getMonth();
    const allHaveSeason = result.current.seasonalRecs.every(r => r.seasonalMonths.includes(currentMonth));
    expect(allHaveSeason).toBe(true);
  });

  it('provides substitutes for unavailable items', () => {
    const { result } = renderHook(() => useRecommendations());
    const subs = result.current.getSubstitutes('p9');
    expect(subs.length).toBeGreaterThan(0);
    expect(subs[0].id).toBe('p10');
  });

  it('provides history-based recommendations', () => {
    localStorage.setItem('groci_history', JSON.stringify({ frequentlyBought: { 'p1': 5 } }));
    const { result } = renderHook(() => useRecommendations());
    expect(result.current.historyRecs.length).toBe(1);
    expect(result.current.historyRecs[0].id).toBe('p1');
  });
});
