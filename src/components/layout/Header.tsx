import { type LanguageConfig, LANGUAGE_CONFIG } from '../../config/languages';
import { type CountryConfig, COUNTRY_CONFIG } from '../../config/countries';
import type { ThemeType } from '../../hooks/usePreferences';
import type { TranslationParams } from '../../i18n';

interface HeaderProps {
  activeLanguage: LanguageConfig;
  setLanguage: (locale: string) => void;
  activeCountry: CountryConfig;
  setCountry: (code: string) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  t: (key: string, params?: TranslationParams) => string;
  cartCount: number;
  onOpenCartMobile: () => void;
  activeView: 'home' | 'orders';
  onNavigate: (view: 'home' | 'orders') => void;
}

export function Header({
  activeLanguage, setLanguage, activeCountry, setCountry,
  theme, setTheme, t, cartCount, onOpenCartMobile, activeView, onNavigate
}: HeaderProps) {

  const selectClass = `
    appearance-none border rounded-lg pl-3 pr-7 py-1.5 text-xs font-semibold
    cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors
  `;

  return (
    <header
      className="sticky top-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--vc-surface)',
        borderBottom: '1px solid var(--vc-border)',
        boxShadow: 'var(--vc-shadow-sm)',
      }}
    >
      <div
        className="h-16 flex items-center justify-between px-4 sm:px-6"
        style={{ maxWidth: '1600px', margin: '0 auto' }}
      >

        {/* Brand + Nav */}
        <div className="flex items-center gap-5">
          {/* Logo */}
          <button
            className="flex items-center gap-2.5"
            onClick={() => onNavigate('home')}
            aria-label="Groci home"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--vc-primary)' }}
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="11" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            </div>
            <div className="leading-tight">
              <h1
                className="text-base font-black tracking-tight leading-none"
                style={{ color: 'var(--vc-text)' }}
              >
                Groci
              </h1>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider hidden sm:block"
                style={{ color: 'var(--vc-text-muted)' }}
              >
                {t('header.tagline')}
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {[
              { id: 'home' as const, label: t('header.navHome') || 'Home' },
              { id: 'orders' as const, label: t('header.navOrders') || 'Orders' },
            ].map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: activeView === link.id ? 'var(--vc-primary-lt)' : 'transparent',
                  color: activeView === link.id ? 'var(--vc-primary)' : 'var(--vc-text-muted)',
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('home');
                setTimeout(() => {
                  document.getElementById('discover-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ color: 'var(--vc-text-muted)' }}
            >
              {t('header.navShop') || 'Shop'}
            </button>
          </nav>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">

          {/* Theme */}
          <div className="relative hidden sm:block">
            <label htmlFor="theme-select" className="sr-only">{t('header.theme')}</label>
            <select
              id="theme-select"
              value={theme}
              onChange={e => setTheme(e.target.value as ThemeType)}
              className={selectClass}
              style={{
                backgroundColor: 'var(--vc-section)',
                borderColor: 'var(--vc-border)',
                color: 'var(--vc-text-2)',
              }}
            >
              <option value="light">☀ {t('theme.light')}</option>
              <option value="dark">🌙 {t('theme.dark')}</option>
              <option value="system">🖥 {t('theme.system')}</option>
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" style={{ color: 'var(--vc-text-muted)' }}>
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Country */}
          <div className="relative">
            <label htmlFor="country-select" className="sr-only">{t('header.country')}</label>
            <select
              id="country-select"
              value={activeCountry.countryCode}
              onChange={e => setCountry(e.target.value)}
              className={selectClass}
              style={{
                backgroundColor: 'var(--vc-section)',
                borderColor: 'var(--vc-border)',
                color: 'var(--vc-text-2)',
              }}
            >
              {COUNTRY_CONFIG.map(c => (
                <option key={c.countryCode} value={c.countryCode}>
                  {c.countryCode} · {c.currencyCode}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" style={{ color: 'var(--vc-text-muted)' }}>
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Language */}
          <div className="relative">
            <label htmlFor="language-select" className="sr-only">{t('header.language')}</label>
            <select
              id="language-select"
              value={activeLanguage.locale}
              onChange={e => setLanguage(e.target.value)}
              className={selectClass}
              style={{
                backgroundColor: 'var(--vc-primary-lt)',
                borderColor: 'var(--vc-primary)',
                color: 'var(--vc-primary)',
              }}
            >
              {LANGUAGE_CONFIG.map(l => (
                <option key={l.locale} value={l.locale}>
                  {l.nativeName} {l.voiceSupported ? '🎙️' : '⌨️'}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" style={{ color: 'var(--vc-primary)' }}>
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Mobile cart icon */}
          <button
            onClick={onOpenCartMobile}
            className="relative p-2 ml-0.5 rounded-xl transition-colors lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ color: 'var(--vc-text-2)' }}
            aria-label="View Cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute top-0.5 right-0.5 w-4 h-4 text-white text-[10px] font-black flex items-center justify-center rounded-full"
                style={{ backgroundColor: 'var(--vc-sale)' }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
