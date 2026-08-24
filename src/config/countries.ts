export interface CountryConfig {
  countryCode: string;
  displayName: string;
  currencyCode: string;
  locale: string;
  currencySymbol: string;
}

export const COUNTRY_CONFIG: CountryConfig[] = [
  { countryCode: 'IN', displayName: 'India', currencyCode: 'INR', locale: 'en-IN', currencySymbol: '₹' },
  { countryCode: 'US', displayName: 'United States', currencyCode: 'USD', locale: 'en-US', currencySymbol: '$' },
  { countryCode: 'GB', displayName: 'United Kingdom', currencyCode: 'GBP', locale: 'en-GB', currencySymbol: '£' },
  { countryCode: 'DE', displayName: 'Germany', currencyCode: 'EUR', locale: 'de-DE', currencySymbol: '€' },
  { countryCode: 'FR', displayName: 'France', currencyCode: 'EUR', locale: 'fr-FR', currencySymbol: '€' },
  { countryCode: 'ES', displayName: 'Spain', currencyCode: 'EUR', locale: 'es-ES', currencySymbol: '€' },
  { countryCode: 'CA', displayName: 'Canada', currencyCode: 'CAD', locale: 'en-CA', currencySymbol: '$' },
  { countryCode: 'AU', displayName: 'Australia', currencyCode: 'AUD', locale: 'en-AU', currencySymbol: '$' },
  { countryCode: 'JP', displayName: 'Japan', currencyCode: 'JPY', locale: 'ja-JP', currencySymbol: '¥' },
  { countryCode: 'AE', displayName: 'United Arab Emirates', currencyCode: 'AED', locale: 'ar-AE', currencySymbol: 'د.إ' },
  { countryCode: 'SA', displayName: 'Saudi Arabia', currencyCode: 'SAR', locale: 'ar-SA', currencySymbol: 'ر.س' },
  { countryCode: 'SG', displayName: 'Singapore', currencyCode: 'SGD', locale: 'en-SG', currencySymbol: '$' },
];

export function getCountryConfig(countryCode: string): CountryConfig {
  return COUNTRY_CONFIG.find(c => c.countryCode === countryCode) || COUNTRY_CONFIG[0];
}
