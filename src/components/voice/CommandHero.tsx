import React, { useState } from 'react';
import type { SpeechState } from '../../hooks/useSpeechEngine';
import type { TranslationParams } from '../../i18n';

interface CommandHeroProps {
  state: SpeechState;
  onStartVoice: () => void;
  onStopVoice: () => void;
  onSubmitText: (text: string) => void;
  voiceSupported: boolean;
  t: (key: string, params?: TranslationParams) => string;
}

export function CommandHero({ state, onStartVoice, onStopVoice, onSubmitText, voiceSupported, t }: CommandHeroProps) {
  const [inputText, setInputText] = useState('');
  const isListening = state === 'LISTENING';
  const isProcessing = state === 'PROCESSING';
  const isSuccess = state === 'SUCCESS';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSubmitText(inputText);
    setInputText('');
  };

  const handleExampleClick = (text: string) => {
    setInputText(text);
    document.getElementById('vc-composer-input')?.focus();
  };

  const examples = [
    "1 bread",
    "2 bottles of milk",
    "5 apples",
    t("example.findCereal"),
  ];

  // Orb state colors using CSS variable primary sage green
  const orbColor = isProcessing
    ? 'bg-amber-500 hover:bg-amber-500 cursor-wait'
    : !voiceSupported
    ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
    : isListening
    ? 'bg-rose-500 hover:bg-rose-600'
    : isSuccess
    ? 'bg-emerald-600'
    : 'bg-[var(--vc-primary)] hover:bg-[var(--vc-primary-hover)]';

  const orbLabel = isListening
    ? t('hero.listening')
    : isProcessing
    ? t('hero.processing')
    : isSuccess
    ? '✓'
    : !voiceSupported
    ? t('hero.voiceNotSupported')
    : t('hero.tapToSpeak');

  return (
    <section
      className="px-4 sm:px-6 lg:px-8 py-5 bg-[var(--vc-surface)] border-b border-[var(--vc-border)]"
      aria-label="Voice and text command area"
    >
      {/* Title row — compact */}
      <div className="max-w-4xl mx-auto mb-4">
        <h2 className="text-xl font-black text-[var(--vc-text)] tracking-tight">
          {t('hero.title')}
        </h2>
        <p className="text-xs font-medium text-[var(--vc-text-muted)] mt-0.5">
          {t('hero.subtitle')}
        </p>
      </div>

      {/* Main interaction row — side-by-side on sm+, stacked on mobile */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">

        {/* Voice Orb — fixed size */}
        <div className="flex flex-col items-center shrink-0">
          <div className={`relative rounded-full transition-all duration-300 ${isListening ? 'mic-listen' : !isProcessing && voiceSupported ? 'mic-idle' : ''}`}>
            <button
              onClick={isListening ? onStopVoice : onStartVoice}
              disabled={isProcessing || !voiceSupported}
              className={`
                w-16 h-16 rounded-full text-white shadow-lg flex items-center justify-center
                transition-all duration-200 active:scale-95 focus-visible:outline-none
                focus-visible:ring-4 focus-visible:ring-emerald-300
                ${orbColor}
              `}
              aria-label={orbLabel}
              title={orbLabel}
            >
              {isProcessing ? (
                <svg className="spin w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              ) : isListening ? (
                /* Waveform bars when listening */
                <div className="flex items-end justify-center gap-[3px] h-7">
                  <div className="w-[3px] bg-white rounded-full wave-bar-1" style={{height:'14px'}} />
                  <div className="w-[3px] bg-white rounded-full wave-bar-2" style={{height:'22px'}} />
                  <div className="w-[3px] bg-white rounded-full wave-bar-3" style={{height:'28px'}} />
                  <div className="w-[3px] bg-white rounded-full wave-bar-4" style={{height:'18px'}} />
                </div>
              ) : isSuccess ? (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="11" rx="3"/>
                  <path d="M5 10a7 7 0 0 0 14 0"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <line x1="8" y1="22" x2="16" y2="22"/>
                </svg>
              )}
            </button>
          </div>
          {/* Compact status label under orb */}
          <p className="mt-2 text-[11px] font-semibold text-center leading-tight w-20 text-[var(--vc-text-muted)]">
            {!voiceSupported
              ? t('hero.voiceNotSupported')
              : isListening
              ? <span className="text-rose-500 dark:text-rose-400">{t('hero.listening')}</span>
              : isProcessing
              ? <span className="text-amber-600 dark:text-amber-400">{t('hero.processing')}</span>
              : t('hero.tapToSpeak')}
          </p>
        </div>

        {/* Divider — only visible on sm+ */}
        <div className="hidden sm:flex flex-col items-center self-stretch justify-center gap-0 select-none">
          <div className="w-px flex-1 bg-[var(--vc-border)]" />
          <span className="my-2 text-[10px] font-bold text-[var(--vc-text-xmuted)] uppercase tracking-widest px-1">{t('hero.or')}</span>
          <div className="w-px flex-1 bg-[var(--vc-border)]" />
        </div>

        {/* Text Composer */}
        <div className="flex-1 w-full">
          <form onSubmit={handleSubmit} className="relative">
            <label htmlFor="vc-composer-input" className="sr-only">{t('hero.placeholder')}</label>
            <input
              id="vc-composer-input"
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={t('hero.placeholder')}
              className="
                w-full bg-[var(--vc-bg)] border-2 border-[var(--vc-border)]
                rounded-xl py-3 pl-4 pr-14
                text-sm text-[var(--vc-text)] placeholder-[var(--vc-text-muted)]
                focus:outline-none focus:border-[var(--vc-primary)]
                focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/40
                transition-all
              "
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="
                absolute right-2 top-2 bottom-2 aspect-square
                bg-[var(--vc-primary)] hover:bg-[var(--vc-primary-hover)]
                disabled:bg-[var(--vc-border)] disabled:text-[var(--vc-text-muted)]
                text-white rounded-lg flex items-center justify-center
                transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
              "
              aria-label={t('hero.send')}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>

          {/* Example chips */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="text-[10px] font-bold text-[var(--vc-text-xmuted)] uppercase tracking-widest py-1">{t('hero.try')}</span>
            {examples.map(ex => (
              <button
                key={ex}
                type="button"
                onClick={() => handleExampleClick(ex)}
                className="
                  px-2.5 py-1 bg-[var(--vc-section)] hover:bg-[var(--vc-primary-lt)]
                  text-[var(--vc-text-muted)] hover:text-[var(--vc-primary-hover)]
                  text-[11px] font-medium rounded-full transition-colors
                  border border-[var(--vc-border)] hover:border-[var(--vc-primary)]
                "
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
