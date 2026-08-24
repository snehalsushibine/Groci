import { DICTIONARIES } from './dictionaries';
import type { ParsedIntent } from '../../types';
import catalogData from '../../data/catalog.json';

const catalog = catalogData as any[];

// ─── Singular / Plural normalization ───────────────────────────────────────
// Maps common spoken singular forms → canonical search token used in tags
const PLURAL_MAP: Record<string, string> = {
  apple: 'apples', apples: 'apples',
  banana: 'bananas', bananas: 'bananas',
  tomato: 'tomatoes', tomatoes: 'tomatoes',
  orange: 'oranges', oranges: 'oranges',
  chip: 'chips', chips: 'chips', crisp: 'chips', crisps: 'chips',
  biscuit: 'biscuits', biscuits: 'biscuits', cookie: 'biscuits', cookies: 'biscuits',
  nut: 'nuts', nuts: 'nuts',
  bread: 'bread', loaf: 'bread',
  milk: 'milk',
  juice: 'juice',
  soap: 'soap',
  shampoo: 'shampoo',
  toothpaste: 'toothpaste',
  coffee: 'coffee',
  sunscreen: 'sunscreen',
};

function normalizeTerm(term: string): string {
  return PLURAL_MAP[term.toLowerCase()] ?? term.toLowerCase();
}

export class IntentParser {
  static parse(transcript: string, language: string = 'en-US'): ParsedIntent {
    const dict = DICTIONARIES[language] || DICTIONARIES['en-US'];
    const text = transcript.trim().toLowerCase();

    if (!text) return { intent: 'UNKNOWN' };

    // ── Intent Detection (before any cleaning) ─────────────────────────────
    const isRemove   = dict.remove.some((w: string) => text.includes(w.toLowerCase()));
    const isModify   = dict.modify.some((w: string) => text.includes(w.toLowerCase()));
    const isSearch   = dict.search.some((w: string) => text.includes(w.toLowerCase()));
    const isExplicitAdd = dict.add.some((w: string) => text.includes(w.toLowerCase()));

    // Priority 1: Remove beats everything
    if (isRemove) return this.parseRemove(text, dict);

    // Priority 2: Modify
    if (isModify) return this.parseModify(text, dict);

    // Priority 3: Search
    if (isSearch) return this.parseSearch(text, dict);

    // Priority 4: Explicit add keyword
    if (isExplicitAdd) return this.parseAdd(text, dict);

    // Priority 5: Implicit Add — number + item, or item alone with catalog match
    const implicitResult = this.parseImplicitAdd(text, dict);
    if (implicitResult) return implicitResult;

    return { intent: 'UNKNOWN' };
  }

  // ── Quantity extraction ──────────────────────────────────────────────────
  private static extractQuantity(text: string, dict: any): number | undefined {
    // Arabic digit
    const digitMatch = text.match(/\b(\d+)\b/);
    if (digitMatch) return parseInt(digitMatch[1], 10);

    // Indic digits (Devanagari, Bengali, Gujarati …)
    const indicDigits = text.match(/([0-9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F]+)/);
    if (indicDigits) {
      const numStr = indicDigits[1].replace(/[\u0966-\u096F]/g, d => String(d.charCodeAt(0) - 0x0966));
      const parsed = parseInt(numStr, 10);
      if (!isNaN(parsed)) return parsed;
    }

    // English word-numbers (+ localized)
    if (dict.numbers) {
      for (const [word, val] of Object.entries(dict.numbers)) {
        const regex = new RegExp(`(^|\\s)${word.toLowerCase()}(\\s|$)`, 'i');
        if (regex.test(text)) return val as number;
      }
    }
    return undefined;
  }

  // ── Unit extraction ──────────────────────────────────────────────────────
  private static extractUnit(text: string, dict: any): string | undefined {
    if (!dict.units) return undefined;
    for (const unit of dict.units) {
      const regex = new RegExp(`(^|\\s)${unit.toLowerCase()}(\\s|of\\s|$)`, 'i');
      if (regex.test(text)) return unit;
    }
    return undefined;
  }

  // ── Clean the product phrase from a sentence ─────────────────────────────
  // Called AFTER intent has already been determined.
  private static cleanItemName(text: string, dict: any, extraSkip: string[] = []): string {
    const stopWords = new Set([
      ...dict.add.map((w: string) => w.toLowerCase()),
      ...dict.remove.map((w: string) => w.toLowerCase()),
      ...dict.modify.map((w: string) => w.toLowerCase()),
      ...dict.search.map((w: string) => w.toLowerCase()),
      ...(dict.units || []).map((u: string) => u.toLowerCase()),
      ...Object.keys(dict.numbers || {}).map((w: string) => w.toLowerCase()),
      'please', 'can', 'could', 'you', 'i', 'get', 'me', 'want', 'would',
      'like', 'in', 'into', 'cart', 'basket', 'some', 'bring', 'buy',
      'put', 'need', 'give', 'my', 'the', 'a', 'an', 'list',
      'packet', 'packets', 'bottle', 'bottles', 'pack', 'packs',
      'piece', 'pieces', 'loaf', 'loaves', 'bunch', 'bag', 'bags',
      // Prepositions & connectors
      'of', 'from', 'for', 'to', 'at', 'under', 'between', 'and', 'or',
      ...extraSkip.map(w => w.toLowerCase()),
    ]);

    return text
      .replace(/[\d$₹£.,!?]+/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0 && !stopWords.has(token.toLowerCase()))
      .join(' ');
  }

  // ── ADD ──────────────────────────────────────────────────────────────────
  private static parseAdd(text: string, dict: any): ParsedIntent {
    const qty  = this.extractQuantity(text, dict);
    const unit = this.extractUnit(text, dict);
    const item = this.cleanItemName(text, dict);
    return { intent: 'ADD_ITEM', item: item || undefined, quantity: qty ?? 1, unit };
  }

  // ── REMOVE ───────────────────────────────────────────────────────────────
  private static parseRemove(text: string, dict: any): ParsedIntent {
    const item = this.cleanItemName(text, dict);
    return { intent: 'REMOVE_ITEM', item: item || undefined };
  }

  // ── MODIFY ───────────────────────────────────────────────────────────────
  private static parseModify(text: string, dict: any): ParsedIntent {
    const qty  = this.extractQuantity(text, dict);
    const item = this.cleanItemName(text, dict, ['quantity', 'amount', 'set', 'to']);
    return { intent: 'MODIFY_ITEM', item: item || undefined, quantity: qty };
  }

  // ── SEARCH ───────────────────────────────────────────────────────────────
  private static parseSearch(text: string, dict: any): ParsedIntent {
    const intent: ParsedIntent = { intent: 'SEARCH_PRODUCT' };

    const underMatch   = text.match(/under\s*[₹$£]?\s*(\d+)/i);
    if (underMatch) intent.maxPrice = parseInt(underMatch[1], 10);

    const betweenMatch = text.match(/between\s*[₹$£]?\s*(\d+)\s*and\s*[₹$£]?\s*(\d+)/i);
    if (betweenMatch) {
      intent.minPrice = parseInt(betweenMatch[1], 10);
      intent.maxPrice = parseInt(betweenMatch[2], 10);
    }

    const sizeMatch = text.match(/(\d+)\s*(kg|g|litre|litres|liter|liters|ml|lbs|lb)/i);
    if (sizeMatch) {
      intent.size     = parseInt(sizeMatch[1], 10);
      intent.sizeUnit = sizeMatch[2].toLowerCase();
    }

    intent.item = this.cleanItemName(text, dict, ['under', 'between', 'and', 'from', 'to', 'below']);
    return intent;
  }

  // ── IMPLICIT ADD ─────────────────────────────────────────────────────────
  // Handles: "2 apples", "milk", "3 bananas", "some biscuits"
  private static parseImplicitAdd(text: string, dict: any): ParsedIntent | null {
    const qty      = this.extractQuantity(text, dict);
    const unit     = this.extractUnit(text, dict);
    const cleaned  = this.cleanItemName(text, dict);

    if (!cleaned) return null;

    // Normalise each token (singular→plural etc.)
    const tokens = cleaned.split(/\s+/).filter(Boolean).map(normalizeTerm);

    // Try to match against catalog
    const match = this.matchCatalog(tokens);

    // Accept if we found a catalog match OR if there's a numeric quantity (clear intent)
    if (match || qty !== undefined) {
      return { intent: 'ADD_ITEM', item: cleaned, quantity: qty ?? 1, unit };
    }

    return null;
  }

  // ── Catalog match helper used by ImplicitAdd ────────────────────────────
  // Returns first product whose names/tags contain all supplied tokens.
  static matchCatalog(tokens: string[]): any | null {
    if (tokens.length === 0) return null;

    for (const p of catalog) {
      const nameTokens = Object.values(p.name as Record<string, string>)
        .join(' ')
        .toLowerCase();
      const tagTokens  = (p.tags as string[]).join(' ').toLowerCase();
      const combined   = `${nameTokens} ${tagTokens}`;

      if (tokens.every(tok => combined.includes(tok))) {
        return p;
      }
    }
    return null;
  }
}
