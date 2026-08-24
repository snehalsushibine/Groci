import en from './translations/en';
import hi from './translations/hi';
import mr from './translations/mr';
import ta from './translations/ta';

export type TranslationKey = keyof typeof en;
export type TranslationParams = Record<string, string | number>;

const dictionaries: Record<string, Record<string, string>> = {
  'en-US': en,
  'hi-IN': hi,
  'mr-IN': mr,
  'ta-IN': ta,
};

export function t(key: string, params?: TranslationParams, locale: string = 'en-US'): string {
  const dict = dictionaries[locale] || dictionaries['en-US'];
  
  // Lookup key in selected locale, fallback to English, fallback to key itself
  let template = dict[key] || dictionaries['en-US'][key] || key;

  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      template = template.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
    }
  }

  return template;
}
