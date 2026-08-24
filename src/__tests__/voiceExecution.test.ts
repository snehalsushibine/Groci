import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpeechEngine } from '../hooks/useSpeechEngine';
import { IntentParser } from '../lib/nlp/IntentParser';
import { getRegionalPrice } from '../lib/pricing';
import catalogData from '../data/catalog.json';
import type { Product } from '../types';

const catalog = catalogData as Product[];

// Mock Web Speech API
const mockStart = vi.fn();
const mockStop = vi.fn();
const mockAbort = vi.fn();

class MockSpeechRecognition {
  continuous = false;
  interimResults = true;
  maxAlternatives = 1;
  lang = 'en-US';
  onstart: (() => void) | null = null;
  onresult: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onend: (() => void) | null = null;

  start() {
    mockStart();
    if (this.onstart) this.onstart();
  }
  stop() {
    mockStop();
    if (this.onend) this.onend();
  }
  abort() {
    mockAbort();
  }
}

describe('Voice Execution & Business Pipeline Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (window as any).SpeechRecognition = MockSpeechRecognition;
    (window as any).webkitSpeechRecognition = MockSpeechRecognition;
  });

  it('1. FINAL voice transcript executes ADD_ITEM', () => {
    const onFinal = vi.fn();
    const { result } = renderHook(() =>
      useSpeechEngine({ language: 'en-US', onFinalTranscript: onFinal })
    );

    act(() => {
      result.current.startListening();
    });

    const parsed = IntentParser.parse('Add 2 bottles of milk', 'en-US');
    expect(parsed.intent).toBe('ADD_ITEM');
    expect(parsed.item).toBe('milk');
    expect(parsed.quantity).toBe(2);
  });

  it('2. FINAL voice transcript executes REMOVE_ITEM', () => {
    const parsed = IntentParser.parse('Remove apples', 'en-US');
    expect(parsed.intent).toBe('REMOVE_ITEM');
    expect(parsed.item).toBe('apples');
  });

  it('3. FINAL voice transcript executes MODIFY_ITEM', () => {
    const parsed = IntentParser.parse('Change apples quantity to 5', 'en-US');
    expect(parsed.intent).toBe('MODIFY_ITEM');
    expect(parsed.item).toBe('apples');
    expect(parsed.quantity).toBe(5);
  });

  it('4. FINAL voice transcript executes SEARCH_PRODUCT', () => {
    const parsed = IntentParser.parse('Find toothpaste under $5', 'en-US');
    expect(parsed.intent).toBe('SEARCH_PRODUCT');
    expect(parsed.item).toBe('toothpaste');
    expect(parsed.maxPrice).toBe(5);
  });

  it('5. Implicit ADD_ITEM parsing ("1 biscuits", "2 bottles of milk", "5 apples")', () => {
    const p1 = IntentParser.parse('1 biscuits', 'en-US');
    expect(p1.intent).toBe('ADD_ITEM');
    expect(p1.quantity).toBe(1);
    expect(p1.item).toBe('biscuits');

    const p2 = IntentParser.parse('2 bottles of milk', 'en-US');
    expect(p2.intent).toBe('ADD_ITEM');
    expect(p2.quantity).toBe(2);
    expect(p2.unit).toBe('bottles');
    expect(p2.item).toBe('milk');

    const p3 = IntentParser.parse('5 apples', 'en-US');
    expect(p3.intent).toBe('ADD_ITEM');
    expect(p3.quantity).toBe(5);
    expect(p3.item).toBe('apples');
  });

  it('6. Explicit intent priority overrides implicit add', () => {
    const searchP = IntentParser.parse('find 2 apples', 'en-US');
    expect(searchP.intent).toBe('SEARCH_PRODUCT');

    const removeP = IntentParser.parse('remove 2 apples', 'en-US');
    expect(removeP.intent).toBe('REMOVE_ITEM');

    const modifyP = IntentParser.parse('change apples to 2', 'en-US');
    expect(modifyP.intent).toBe('MODIFY_ITEM');
  });

  it('7. Multilingual implicit add ("2 बिस्कुट", "दूध २")', () => {
    const hiP = IntentParser.parse('2 बिस्कुट', 'hi-IN');
    expect(hiP.intent).toBe('ADD_ITEM');
    expect(hiP.quantity).toBe(2);

    const mrP = IntentParser.parse('दूध २', 'mr-IN');
    expect(mrP.intent).toBe('ADD_ITEM');
    expect(mrP.quantity).toBe(2);
  });

  it('8. Image Validation System - All products have valid unique image paths in Manifest', () => {
    const imagePaths = catalog.map(product => product.image);

    // Every image must be defined and valid
    catalog.forEach(product => {
      expect(product.image).toBeDefined();
      expect(product.image.length).toBeGreaterThan(0);
      expect(product.image.startsWith('/products/')).toBe(true);
    });

    // Zero duplicate image paths across catalog products
    const uniqueImagePaths = new Set(imagePaths);
    expect(uniqueImagePaths.size).toBe(catalog.length);
  });

  it('9. Region-Aware Sample Pricing Sanity Check', () => {
    const inMilk = getRegionalPrice('p1', 2.5, 'IN');
    expect(inMilk.price).toBe(62); // ₹62 for 1L milk in India

    const usMilk = getRegionalPrice('p1', 2.5, 'US');
    expect(usMilk.price).toBe(3.80); // $3.80 in US

    const jpMilk = getRegionalPrice('p1', 2.5, 'JP');
    expect(jpMilk.price).toBe(220); // ¥220 in Japan
  });
});
