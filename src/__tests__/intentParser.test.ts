import { describe, it, expect } from 'vitest';
import { IntentParser } from '../lib/nlp/IntentParser';

describe('IntentParser - ADD_ITEM', () => {
  it('parses basic add intent in English', () => {
    const res = IntentParser.parse('add milk to my list', 'en-US');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('milk');
    expect(res.quantity).toBe(1);
  });

  it('extracts quantity and units', () => {
    const res = IntentParser.parse('add 2 bottles of milk', 'en-US');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('milk');
    expect(res.quantity).toBe(2);
    expect(res.unit).toBe('bottles');
  });

  it('extracts word quantities', () => {
    const res = IntentParser.parse('buy three apples', 'en-US');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('apples');
    expect(res.quantity).toBe(3);
  });

  it('handles conversational noise (please put 3 apples in my list)', () => {
    const res = IntentParser.parse('please put 3 apples in my list', 'en-US');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('apples');
    expect(res.quantity).toBe(3);
  });

  it('handles conversational noise (I need 2 bottles of milk)', () => {
    const res = IntentParser.parse('I need 2 bottles of milk', 'en-US');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('milk');
    expect(res.quantity).toBe(2);
    expect(res.unit).toBe('bottles');
  });

  it('handles conversational noise (can you get me 4 bananas)', () => {
    const res = IntentParser.parse('can you get me 4 bananas', 'en-US');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('bananas');
    expect(res.quantity).toBe(4);
  });

  it('handles implicit add (2 apples)', () => {
    const res = IntentParser.parse('2 apples', 'en-US');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('apples');
    expect(res.quantity).toBe(2);
  });
});

describe('IntentParser - REMOVE_ITEM', () => {
  it('parses remove intent', () => {
    const res = IntentParser.parse('remove apples from list', 'en-US');
    expect(res.intent).toBe('REMOVE_ITEM');
    expect(res.item).toBe('apples');
  });

  it('handles conversational remove (remove the apples)', () => {
    const res = IntentParser.parse('remove the apples', 'en-US');
    expect(res.intent).toBe('REMOVE_ITEM');
    expect(res.item).toBe('apples');
  });
});

describe('IntentParser - MODIFY_ITEM', () => {
  it('parses modify intent', () => {
    const res = IntentParser.parse('change milk quantity to 5', 'en-US');
    expect(res.intent).toBe('MODIFY_ITEM');
    expect(res.item).toBe('milk');
    expect(res.quantity).toBe(5);
  });

  it('handles conversational modify (change apples quantity to 4)', () => {
    const res = IntentParser.parse('change apples quantity to 4', 'en-US');
    expect(res.intent).toBe('MODIFY_ITEM');
    expect(res.item).toBe('apples');
    expect(res.quantity).toBe(4);
  });
});

describe('IntentParser - SEARCH_PRODUCT', () => {
  it('parses basic search', () => {
    const res = IntentParser.parse('find colgate toothpaste', 'en-US');
    expect(res.intent).toBe('SEARCH_PRODUCT');
    expect(res.item).toBe('colgate toothpaste');
  });

  it('parses search with max price', () => {
    const res = IntentParser.parse('find toothpaste under $5', 'en-US');
    expect(res.intent).toBe('SEARCH_PRODUCT');
    expect(res.item).toBe('toothpaste');
    expect(res.maxPrice).toBe(5);
  });

  it('parses search with min and max price range', () => {
    const res = IntentParser.parse('find cereal between $3 and $8', 'en-US');
    expect(res.intent).toBe('SEARCH_PRODUCT');
    expect(res.item).toBe('cereal');
    expect(res.minPrice).toBe(3);
    expect(res.maxPrice).toBe(8);
  });

  it('parses search with size', () => {
    const res = IntentParser.parse('find 500g cereal', 'en-US');
    expect(res.intent).toBe('SEARCH_PRODUCT');
    expect(res.item).toBe('cereal');
    expect(res.size).toBe(500);
    expect(res.sizeUnit).toBe('g');
  });
  
  it('parses combined search filters with sizes and max price', () => {
    const res = IntentParser.parse('find 1 litre milk under $5', 'en-US');
    expect(res.intent).toBe('SEARCH_PRODUCT');
    expect(res.item).toBe('milk');
    expect(res.size).toBe(1);
    expect(res.sizeUnit).toBe('litre');
    expect(res.maxPrice).toBe(5);
  });
});

describe('IntentParser - Multilingual', () => {
  it('parses Hindi add command', () => {
    const res = IntentParser.parse('दो बोतल दूध जोड़ें', 'hi-IN');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('दूध');
    expect(res.quantity).toBe(2);
    expect(res.unit).toBe('बोतल');
  });

  it('parses Tamil search command', () => {
    const res = IntentParser.parse('பால் தேடு', 'ta-IN');
    expect(res.intent).toBe('SEARCH_PRODUCT');
    expect(res.item).toBe('பால்');
  });
});

describe('IntentParser - Edge Cases', () => {
  it('normalizes punctuation and casing safely', () => {
    const res = IntentParser.parse('ADD, MILK!!!', 'en-US');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.item).toBe('milk');
  });

  it('safely falls back to UNKNOWN on ambiguous input', () => {
    const res = IntentParser.parse('hello how are you', 'en-US');
    expect(res.intent).toBe('UNKNOWN');
  });
});
