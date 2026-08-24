import { useState, useEffect, useCallback } from 'react';

export interface Order {
  id: string;
  date: string;
  itemCount: number;
  total: number;
  status: 'demo';
}

const ORDERS_KEY = 'groci_orders';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = localStorage.getItem(ORDERS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = useCallback((total: number, itemCount: number) => {
    const newOrder: Order = {
      id: `VC-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      itemCount,
      total,
      status: 'demo'
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  }, []);

  const clearOrders = useCallback(() => {
    setOrders([]);
  }, []);

  return {
    orders,
    addOrder,
    clearOrders
  };
}
