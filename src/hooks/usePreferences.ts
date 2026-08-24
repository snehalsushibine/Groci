import { useState, useEffect, useCallback } from 'react';
import { getLanguageConfig } from '../config/languages';
import { getCountryConfig } from '../config/countries';
import { t as translate, type TranslationParams } from '../i18n';
import { getRegionalPrice } from '../lib/pricing';

const PREF_KEY = 'groci_preferences';

export type ThemeType = 'light' | 'dark' | 'system';

interface PreferencesState {
  languageCode: string;
  countryCode: string;
  theme: ThemeType;
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<PreferencesState>(() => {
    const stored = localStorage.getItem(PREF_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          languageCode: parsed.languageCode || 'en-US',
          countryCode: parsed.countryCode || 'IN',
          theme: parsed.theme || 'system'
        };
      } catch (e) {
        // ignore
      }
    }
    return { languageCode: 'en-US', countryCode: 'IN', theme: 'system' };
  });

  const activeLanguage = getLanguageConfig(prefs.languageCode);
  const activeCountry = getCountryConfig(prefs.countryCode);

  useEffect(() => {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  }, [prefs]);

  // Sync HTML Lang & Dir
  useEffect(() => {
    document.documentElement.lang = activeLanguage.locale.split('-')[0];
    document.documentElement.dir = activeLanguage.locale.startsWith('ar') ? 'rtl' : 'ltr';
  }, [activeLanguage.locale]);

  // Sync Theme
  useEffect(() => {
    const applyTheme = (theme: ThemeType) => {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme(prefs.theme);

    if (prefs.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [prefs.theme]);

  const setLanguage = useCallback((code: string) => {
    setPrefs(p => ({ ...p, languageCode: code }));
  }, []);

  const setCountry = useCallback((code: string) => {
    setPrefs(p => ({ ...p, countryCode: code }));
  }, []);

  const setTheme = useCallback((theme: ThemeType) => {
    setPrefs(p => ({ ...p, theme }));
  }, []);

  const formatPrice = useCallback((amount: number, productId?: string, isOnSale?: boolean) => {
    let finalPrice = amount;
    if (productId) {
      const reg = getRegionalPrice(productId, amount, activeCountry.countryCode, isOnSale);
      finalPrice = isOnSale && reg.salePrice ? reg.salePrice : reg.price;
    } else if (activeCountry.countryCode === 'IN' && amount < 20) {
      // Scale legacy dollar amounts to INR scale if no productId passed
      finalPrice = amount * 83;
    }

    return new Intl.NumberFormat(activeCountry.locale, {
      style: 'currency',
      currency: activeCountry.currencyCode,
      maximumFractionDigits: activeCountry.currencyCode === 'JPY' ? 0 : 2
    }).format(finalPrice);
  }, [activeCountry]);

  const t = useCallback((key: string, params?: TranslationParams) => {
    return translate(key, params, activeLanguage.locale);
  }, [activeLanguage.locale]);

  return {
    activeLanguage,
    setLanguage,
    activeCountry,
    setCountry,
    theme: prefs.theme,
    setTheme,
    formatPrice,
    t
  };
}
