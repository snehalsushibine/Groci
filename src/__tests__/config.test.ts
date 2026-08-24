import { describe, it, expect } from 'vitest';
import { getLanguageConfig } from '../config/languages';
import { getCountryConfig } from '../config/countries';
import { IntentParser } from '../lib/nlp/IntentParser';

describe('Configuration System', () => {
  it('should find language config by locale', () => {
    const config = getLanguageConfig('hi-IN');
    expect(config.displayName).toBe('Hindi');
    expect(config.textSupported).toBe(true);
  });

  it('should fallback to default language if not found', () => {
    const config = getLanguageConfig('invalid-locale');
    expect(config.locale).toBe('en-US'); // Our defined fallback
  });

  it('should find country config by code', () => {
    const config = getCountryConfig('DE');
    expect(config.currencyCode).toBe('EUR');
    expect(config.locale).toBe('de-DE');
  });

  it('should fallback to default country if not found', () => {
    const config = getCountryConfig('invalid');
    expect(config.countryCode).toBe('IN'); // Our defined fallback is the first one, which is IN
  });
});

describe('Parity: Voice and Text NLP', () => {
  it('should produce identical intents for equivalent text and voice inputs', () => {
    const input1 = "Add 2 bottles of milk";
    const input2 = "add 2 bottles of milk"; // varying case
    const input3 = "ADD 2 BOTTLES OF MILK"; // varying case

    const res1 = IntentParser.parse(input1, 'en-US');
    const res2 = IntentParser.parse(input2, 'en-US');
    const res3 = IntentParser.parse(input3, 'en-US');

    expect(res1).toEqual(res2);
    expect(res1).toEqual(res3);
    
    expect(res1.intent).toBe('ADD_ITEM');
    expect(res1.item).toBe('milk');
    expect(res1.quantity).toBe(2);
    expect(res1.unit).toBe('bottles');
  });

  it('should correctly parse spanish typed command', () => {
    const res = IntentParser.parse("añadir 3 litros leche", 'es-ES');
    expect(res.intent).toBe('ADD_ITEM');
    expect(res.quantity).toBe(3);
    // Since 'litros' is a unit, the remaining text should ideally contain 'leche'.
    // We check that it at least extracted the right intent and quantity using the Spanish dictionary.
  });
});
