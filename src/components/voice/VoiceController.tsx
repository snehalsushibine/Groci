import type { SpeechState } from '../../hooks/useSpeechEngine';
import type { ParsedIntent } from '../../types';

interface Props {
  state: SpeechState;
  transcript: string;
  errorMsg: string;
  intent: ParsedIntent | null;
  actionResult: string;
  actionError: boolean;
  onStart: () => void;
  onStop: () => void;
}

const STATE_META: Record<SpeechState, {
  label: string;
  sublabel: string;
  btnClass: string;
  micClass: string;
  svgColor: string;
}> = {
  IDLE: {
    label: 'Tap to speak',
    sublabel: 'Voice command ready',
    btnClass: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
    micClass: 'mic-idle',
    svgColor: 'white',
  },
  LISTENING: {
    label: 'Listening…',
    sublabel: 'Speak your command now',
    btnClass: 'bg-red-500 hover:bg-red-600 shadow-red-200',
    micClass: 'mic-listen',
    svgColor: 'white',
  },
  PROCESSING: {
    label: 'Processing…',
    sublabel: 'Interpreting your command',
    btnClass: 'bg-amber-500 shadow-amber-200 cursor-wait',
    micClass: '',
    svgColor: 'white',
  },
  SUCCESS: {
    label: 'Done!',
    sublabel: 'Command executed',
    btnClass: 'bg-green-500 shadow-green-200',
    micClass: '',
    svgColor: 'white',
  },
  ERROR: {
    label: 'Unavailable',
    sublabel: 'Voice recognition not available',
    btnClass: 'bg-slate-400 cursor-not-allowed',
    micClass: '',
    svgColor: 'white',
  },
};

/* Rendered intent detail for the feedback card */
function IntentDetail({ intent }: { intent: ParsedIntent }) {
  if (intent.intent === 'UNKNOWN') return null;

  const labelMap: Record<string, string> = {
    ADD_ITEM: 'Add Item',
    REMOVE_ITEM: 'Remove Item',
    MODIFY_ITEM: 'Modify Item',
    SEARCH_PRODUCT: 'Search',
  };

  return (
    <div className="fade-up mt-3 text-left space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
        <span className="text-slate-400 font-medium">Detected action</span>
        <span className="font-bold text-blue-600">{labelMap[intent.intent] ?? intent.intent}</span>
      </div>
      {intent.item && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Product</span>
          <span className="font-semibold text-slate-700 capitalize">{intent.item}</span>
        </div>
      )}
      {intent.quantity !== undefined && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Quantity</span>
          <span className="font-semibold text-slate-700">{intent.quantity} {intent.unit ?? ''}</span>
        </div>
      )}
      {intent.maxPrice !== undefined && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Max price</span>
          <span className="font-semibold text-slate-700">${intent.maxPrice}</span>
        </div>
      )}
      {intent.minPrice !== undefined && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Min price</span>
          <span className="font-semibold text-slate-700">${intent.minPrice}</span>
        </div>
      )}
      {intent.size !== undefined && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Size</span>
          <span className="font-semibold text-slate-700">{intent.size}{intent.sizeUnit}</span>
        </div>
      )}
    </div>
  );
}

export default function VoiceController({
  state, transcript, errorMsg, intent, actionResult, actionError, onStart, onStop
}: Props) {
  const meta = STATE_META[state];
  const isListening = state === 'LISTENING';
  const isProcessing = state === 'PROCESSING';
  const showHint = state === 'IDLE' && !transcript && !actionResult;
  const showFeedback = !!(transcript || intent || actionResult || errorMsg);

  return (
    <section aria-label="Voice command area" className="mt-6 mb-4">
      {/* ── Hero card ── */}
      <div className="vc-surface overflow-hidden">
        {/* Subtle top stripe for brand identity */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500" />

        <div className="px-6 py-8 flex flex-col items-center text-center">
          {/* Mic button */}
          <button
            onClick={isListening ? onStop : onStart}
            disabled={isProcessing || state === 'ERROR'}
            className={`
              relative w-20 h-20 rounded-full text-white shadow-lg
              flex items-center justify-center
              transition-all duration-200 active:scale-95
              focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300
              ${meta.btnClass} ${meta.micClass}
            `}
            aria-label={isListening ? 'Stop listening' : 'Start voice command'}
          >
            {isProcessing ? (
              /* Spinner while processing */
              <svg className="spin w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            ) : state === 'SUCCESS' ? (
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              /* Microphone SVG */
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="11" rx="3"/>
                <path d="M5 10a7 7 0 0 0 14 0"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="8" y1="22" x2="16" y2="22"/>
              </svg>
            )}
          </button>

          {/* State label */}
          <p className="mt-4 text-base font-bold text-slate-800">{meta.label}</p>
          <p className="mt-0.5 text-xs text-slate-400">{meta.sublabel}</p>

          {/* ── Command feedback area ── */}
          {showFeedback && (
            <div className="fade-up w-full max-w-sm mt-5 bg-slate-50 rounded-xl px-4 py-4 text-left">

              {/* Live transcript */}
              {transcript && (
                <p className="text-sm text-slate-500 italic mb-1">
                  "{transcript}"
                </p>
              )}

              {/* Intent breakdown */}
              {intent && intent.intent !== 'UNKNOWN' && (state === 'LISTENING' || state === 'PROCESSING') && (
                <IntentDetail intent={intent} />
              )}

              {/* Error from browser speech API */}
              {errorMsg && (
                <div className="flex items-start gap-2 mt-2">
                  <span className="text-red-500 mt-0.5 shrink-0 text-sm">⚠</span>
                  <div>
                    <p className="text-sm font-semibold text-red-600">{errorMsg}</p>
                    {(errorMsg.includes('not supported') || errorMsg.includes('denied')) && (
                      <p className="text-xs text-slate-500 mt-0.5">Use the text input below to type your commands.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Action result */}
              {actionResult && !errorMsg && (
                <div className={`flex items-center gap-2 mt-2 text-sm font-semibold ${actionError ? 'text-amber-700' : 'text-green-700'}`}>
                  <span className="text-base">{actionError ? '⚠' : '✓'}</span>
                  <span>{actionResult}</span>
                </div>
              )}
            </div>
          )}

          {/* Hint — shown only when idle with no feedback */}
          {showHint && (
            <div className="mt-5 w-full max-w-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Try saying</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['"Add 2 bottles of milk"', '"Find cereal under $6"', '"Remove apples"'].map(cmd => (
                  <span key={cmd} className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-mono">
                    {cmd}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
