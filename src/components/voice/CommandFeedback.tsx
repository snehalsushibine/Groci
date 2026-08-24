import type { ParsedIntent, IntentResult } from '../../types';
import type { TranslationParams } from '../../i18n';

interface CommandFeedbackProps {
  intent: ParsedIntent | null;
  actionResult: IntentResult | null;
  transcript: string;
  speechErrorMsg: string;
  pendingRemove: { productId: string; name: string } | null;
  onConfirmRemove: () => void;
  onCancelRemove: () => void;
  language: string;
  voiceSupported: boolean;
  t: (key: string, params?: TranslationParams) => string;
}

export function CommandFeedback({
  intent, actionResult, transcript, speechErrorMsg,
  pendingRemove, onConfirmRemove, onCancelRemove,
  language, voiceSupported, t
}: CommandFeedbackProps) {

  // Nothing to show — return null to take zero space
  if (!intent && !actionResult && !transcript && !speechErrorMsg && !pendingRemove && voiceSupported) {
    return null;
  }

  const isError = actionResult?.type.startsWith('ERROR');
  const isSuccess = actionResult && !isError && actionResult.type !== 'CONFIRM_REMOVE';

  const accentColor = speechErrorMsg || !voiceSupported
    ? 'var(--vc-sale)'
    : isSuccess
    ? 'var(--vc-success)'
    : isError
    ? 'var(--vc-sale)'
    : 'var(--vc-primary)';

  const getResultMessage = (result: IntentResult) => {
    switch (result.type) {
      case 'SUCCESS_ADD':    return t('activity.added',      { quantity: result.quantity!, product: result.product! });
      case 'SUCCESS_REMOVE': return t('activity.removed',    { product: result.product! });
      case 'SUCCESS_MODIFY': return t('activity.updated',    { product: result.product!, quantity: result.quantity! });
      case 'SUCCESS_SEARCH': return result.query ? t('activity.searched', { query: result.query }) : t('activity.searchGeneral');
      case 'ERROR_UNKNOWN':  return t('activity.errorUnknown');
      case 'ERROR_NO_ITEM':  return t('activity.errorNoItem');
      case 'ERROR_NOT_FOUND':   return t('activity.errorNotFound',  { query: result.query! });
      case 'ERROR_NOT_ON_LIST': return t('activity.errorNotOnList', { query: result.query! });
      default: return '';
    }
  };

  return (
    <div className="fade-up w-full">
      <div
        className="rounded-xl overflow-hidden relative"
        style={{
          backgroundColor: 'var(--vc-surface)',
          border: '1px solid var(--vc-border)',
          boxShadow: 'var(--vc-shadow-sm)',
        }}
      >
        {/* Top accent stripe */}
        <div className="h-[3px] w-full" style={{ backgroundColor: accentColor }} />

        <div className="px-4 py-3 space-y-2.5">

          {/* Voice unsupported note */}
          {!voiceSupported && !speechErrorMsg && (
            <div
              className="flex items-start gap-2 text-xs rounded-lg px-3 py-2"
              style={{ backgroundColor: 'var(--vc-warn-lt)', color: 'var(--vc-warn)' }}
            >
              <span className="shrink-0 mt-0.5">⚠</span>
              <p>{t('feedback.unsupportedVoice', { language })}</p>
            </div>
          )}

          {/* Speech API error */}
          {speechErrorMsg && (
            <div
              className="flex items-start gap-2 text-xs rounded-lg px-3 py-2"
              style={{ backgroundColor: 'var(--vc-sale-lt)', color: 'var(--vc-sale)' }}
            >
              <span className="shrink-0 mt-0.5">✗</span>
              <p>{speechErrorMsg}</p>
            </div>
          )}

          {/* Raw transcript */}
          {transcript && (
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
                style={{ color: 'var(--vc-text-xmuted)' }}
              >
                {t('feedback.parsed')}
              </p>
              <p
                className="text-sm font-medium italic"
                style={{ color: 'var(--vc-text-2)' }}
              >
                "{transcript}"
              </p>
            </div>
          )}

          {/* Action result */}
          {actionResult && actionResult.type !== 'CONFIRM_REMOVE' && (
            <div
              className="flex items-center gap-2.5"
              style={{ paddingTop: transcript ? '8px' : '0', borderTop: transcript ? '1px solid var(--vc-border-lt)' : 'none' }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm"
                style={{
                  backgroundColor: isError ? 'var(--vc-sale-lt)' : 'var(--vc-success-lt)',
                  color: isError ? 'var(--vc-sale)' : 'var(--vc-success)',
                }}
              >
                {isError ? '✗' : '✓'}
              </div>
              <p
                className="text-sm font-bold"
                style={{ color: isError ? 'var(--vc-sale)' : 'var(--vc-text)' }}
              >
                {getResultMessage(actionResult)}
              </p>
            </div>
          )}

          {/* Destructive confirmation */}
          {pendingRemove && (
            <div className="pt-1">
              <p
                className="text-sm font-bold mb-3"
                style={{ color: 'var(--vc-text)' }}
              >
                ⚠ {t('feedback.removeConfirm', { product: pendingRemove.name })}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onConfirmRemove}
                  className="flex-1 px-4 py-2 text-xs font-bold text-white rounded-xl transition-colors"
                  style={{ backgroundColor: 'var(--vc-sale)' }}
                >
                  {t('feedback.confirm')}
                </button>
                <button
                  onClick={onCancelRemove}
                  className="flex-1 px-4 py-2 text-xs font-bold rounded-xl border transition-colors"
                  style={{
                    backgroundColor: 'var(--vc-surface)',
                    borderColor: 'var(--vc-border)',
                    color: 'var(--vc-text-2)',
                  }}
                >
                  {t('feedback.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
