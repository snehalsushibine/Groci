import { useState, useEffect } from 'react';
import type { ShoppingListItem } from '../types';

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>(() => {
    const saved = localStorage.getItem('groci_list');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('groci_list', JSON.stringify(items));
  }, [items]);

  const addItem = (productId: string, quantity: number, unit?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId 
          ? { ...i, quantity: i.quantity + quantity }
          : i
        );
      }
      return [...prev, { 
        id: Math.random().toString(36).substr(2, 9), 
        productId, 
        quantity, 
        unit: unit || 'item', 
        addedAt: Date.now() 
      }];
    });
    
    // Update frequency in history for recommendations
    updateHistory(productId);
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const modifyItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  };
  
  const clearList = () => setItems([]);

  return { items, addItem, removeItem, modifyItem, clearList };
}

// Helper to track purchase history globally (could also be its own context/hook)
function updateHistory(productId: string) {
  const saved = localStorage.getItem('groci_history');
  const history = saved ? JSON.parse(saved) : { frequentlyBought: {} };
  
  if (!history.frequentlyBought[productId]) {
    history.frequentlyBought[productId] = 0;
  }
  history.frequentlyBought[productId] += 1;
  history.lastPurchaseDate = Date.now();
  
  localStorage.setItem('groci_history', JSON.stringify(history));
}
