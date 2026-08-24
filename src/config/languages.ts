export interface LanguageConfig {
  locale: string;
  displayName: string;
  nativeName: string;
  speechRecognitionCode: string;
  textSupported: boolean;
  voiceSupported: boolean;
}

export const LANGUAGE_CONFIG: LanguageConfig[] = [
  { locale: 'en-US', displayName: 'English', nativeName: 'English', speechRecognitionCode: 'en-US', textSupported: true, voiceSupported: true },
  { locale: 'hi-IN', displayName: 'Hindi', nativeName: 'हिन्दी', speechRecognitionCode: 'hi-IN', textSupported: true, voiceSupported: true },
  { locale: 'mr-IN', displayName: 'Marathi', nativeName: 'मराठी', speechRecognitionCode: 'mr-IN', textSupported: true, voiceSupported: true },
  { locale: 'ta-IN', displayName: 'Tamil', nativeName: 'தமிழ்', speechRecognitionCode: 'ta-IN', textSupported: true, voiceSupported: true },
];

export function getLanguageConfig(locale: string): LanguageConfig {
  return LANGUAGE_CONFIG.find(lang => lang.locale === locale) || LANGUAGE_CONFIG[0];
}
