import { useState, useEffect, useCallback } from 'react';
import type { ActivityEvent, IntentResult } from '../types';

const MAX_HISTORY = 10;
const ACTIVITY_KEY = 'groci_activity';

export function useRecentActivity() {
  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem(ACTIVITY_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
  }, [activities]);

  const addActivity = useCallback((result: IntentResult, type: ActivityEvent['type'] = 'success') => {
    setActivities(prev => {
      const newItem: ActivityEvent = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        type,
        resultType: result.type,
        product: result.product,
        quantity: result.quantity,
        query: result.query
      };
      return [newItem, ...prev].slice(0, MAX_HISTORY);
    });
  }, []);

  const clearActivity = useCallback(() => {
    setActivities([]);
  }, []);

  return { activities, addActivity, clearActivity };
}
