export interface Product {
  id: string;
  name: Record<string, string>; // e.g., { "en-US": "Milk", "hi-IN": "दूध", "ta-IN": "பால்" }
  image: string;
  category: string;
  brand: string;
  price: number;
  currency: string;
  size: number;
  unit: string;
  availability: boolean;
  onSale: boolean;
  salePrice?: number;
  seasonalMonths: number[]; // 0-11
  tags: string[];
  substituteIds: string[];
}

export interface UserPreferences {
  preferredBrands: Record<string, number>;
  preferredCategories: Record<string, number>;
  preferredLanguage: string; // 'en-US' | 'hi-IN' | 'ta-IN'
}

export interface ShoppingListItem {
  id: string;
  productId: string;
  quantity: number;
  unit: string;
  addedAt: number;
}

// Intent Types
export type IntentType = 'ADD_ITEM' | 'REMOVE_ITEM' | 'MODIFY_ITEM' | 'SEARCH_PRODUCT' | 'UNKNOWN';

export interface ParsedIntent {
  intent: IntentType;
  item?: string; // The recognized item name
  quantity?: number; // E.g., 2
  unit?: string; // E.g., bottles, kg
  size?: number; // E.g., 500
  sizeUnit?: string; // E.g., g, ml
  brand?: string; // E.g., Colgate
  minPrice?: number;
  maxPrice?: number;
}

export type IntentResultType = 'SUCCESS_ADD' | 'SUCCESS_REMOVE' | 'SUCCESS_MODIFY' | 'SUCCESS_SEARCH' | 'CONFIRM_REMOVE' | 'ERROR_UNKNOWN' | 'ERROR_NO_ITEM' | 'ERROR_NOT_FOUND' | 'ERROR_NOT_ON_LIST' | 'ERROR_AMBIGUOUS';

export interface IntentResult {
  type: IntentResultType;
  product?: string; // Localized product name for the UI to use in templates
  productId?: string;
  quantity?: number;
  query?: string; // The recognized raw string that failed or searched
}

export interface ActivityEvent {
  id: string;
  timestamp: number;
  type: 'success' | 'error' | 'search';
  resultType: IntentResultType;
  product?: string;
  quantity?: number;
  query?: string;
}
