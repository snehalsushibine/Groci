import { useState, useCallback } from 'react';
import { useSpeechEngine } from './hooks/useSpeechEngine';
import { useShoppingList } from './hooks/useShoppingList';
import { useRecommendations } from './hooks/useRecommendations';
import { usePreferences } from './hooks/usePreferences';
import { useRecentActivity } from './hooks/useRecentActivity';
import { IntentParser } from './lib/nlp/IntentParser';

import { Header } from './components/layout/Header';
import { CategorySidebar } from './components/layout/CategorySidebar';
import { CategoryStrip } from './components/layout/CategoryStrip';
import { FeaturedBanner } from './components/layout/FeaturedBanner';
import { CommandHero } from './components/voice/CommandHero';
import { CommandFeedback } from './components/voice/CommandFeedback';
import { Cart } from './components/cart/Cart';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { Recommendations } from './components/shopping/Recommendations';
import { Discover } from './components/shopping/Discover';
import { OrderHistory } from './components/orders/OrderHistory';
import { OrderConfirmation } from './components/orders/OrderConfirmation';
import { useOrders } from './hooks/useOrders';

import catalogData from './data/catalog.json';
import type { Product, ParsedIntent, IntentResult } from './types';

const catalog = catalogData as Product[];

export default function App() {
  const { activeLanguage, setLanguage, activeCountry, setCountry, theme, setTheme, formatPrice, t } = usePreferences();
  const { activities, addActivity } = useRecentActivity();
  const shopping = useShoppingList();
  const recs = useRecommendations();
  const { orders, addOrder } = useOrders();

  // ── UI State ─────────────────────────────────────────
  const [actionResult, setActionResult] = useState<IntentResult | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [pendingRemove, setPendingRemove] = useState<{ productId: string; name: string } | null>(null);
  const [searchIntent, setSearchIntent] = useState<ParsedIntent | null>(null);

  const [activeView, setActiveView] = useState<'home' | 'orders'>('home');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // ── Product lookup — memo'd by locale ────────────────
  const findProduct = useCallback((itemText: string): Product[] => {
    if (!itemText) return [];
    const raw = itemText.toLowerCase().trim();

    // Singular/plural normalization
    const PLURAL_MAP: Record<string, string> = {
      apple: 'apples', banana: 'bananas', tomato: 'tomatoes', orange: 'oranges',
      chip: 'chips', crisp: 'chips', crisps: 'chips',
      biscuit: 'biscuits', cookie: 'biscuits', cookies: 'biscuits', nut: 'nuts',
      bread: 'bread', loaf: 'bread',
    };
    const norm = (t: string) => PLURAL_MAP[t] ?? t;

    const rawTokens  = raw.split(/\s+/).filter(Boolean);
    const normTokens = rawTokens.map(norm);

    // Combined field string for a product
    const combined = (p: Product): string =>
      [p.name[activeLanguage.locale] || '', p.name['en-US'] || '', p.brand, ...(p.tags as string[])]
        .join(' ').toLowerCase();

    // 1. Exact name match
    const exact = catalog.filter(p =>
      (p.name[activeLanguage.locale] || '').toLowerCase() === raw ||
      (p.name['en-US'] || '').toLowerCase() === raw
    );
    if (exact.length > 0) return exact;

    // 2. All normalized tokens present
    const allNorm = catalog.filter(p => normTokens.every(t => combined(p).includes(t)));
    if (allNorm.length > 0) return allNorm;

    // 3. All raw tokens present
    const allRaw = catalog.filter(p => rawTokens.every(t => combined(p).includes(t)));
    if (allRaw.length > 0) return allRaw;

    // 4. Any normalized token matches a tag exactly (e.g. "bread" matches tag "bread")
    return catalog.filter(p => {
      const tags = (p.tags as string[]).map(t => t.toLowerCase());
      return normTokens.some(t => tags.includes(t) || tags.some(tag => tag.includes(t)));
    });
  }, [activeLanguage.locale]);

  // ── Core Intent Executor ─────────────────────────────
  // Receives the already-parsed intent and executes it directly.
  // Does NOT read any React state — only receives arguments.
  const executeIntent = useCallback((intent: ParsedIntent | null): IntentResult | null => {
    setActionResult(null);
    setSearchIntent(null);

    if (!intent || intent.intent === 'UNKNOWN') {
      const res: IntentResult = { type: 'ERROR_UNKNOWN' };
      setActionResult(res);
      addActivity(res, 'error');
      return res;
    }

    if (intent.intent === 'ADD_ITEM') {
      if (!intent.item) {
        const res: IntentResult = { type: 'ERROR_NO_ITEM' };
        setActionResult(res);
        return res;
      }
      const matches = findProduct(intent.item);
      if (matches.length === 1) {
        const match = matches[0];
        shopping.addItem(match.id, intent.quantity ?? 1, intent.unit ?? match.unit);
        const name = match.name[activeLanguage.locale] ?? match.name['en-US'];
        const res: IntentResult = { type: 'SUCCESS_ADD', product: name, quantity: intent.quantity ?? 1 };
        setActionResult(res);
        addActivity(res, 'success');
        return res;
      } else if (matches.length > 1) {
        const res: IntentResult = { type: 'ERROR_AMBIGUOUS', query: intent.item };
        setActionResult(res);
        addActivity(res, 'error');
        return res;
      }
      const res: IntentResult = { type: 'ERROR_NOT_FOUND', query: intent.item };
      setActionResult(res);
      return res;
    }

    if (intent.intent === 'REMOVE_ITEM') {
      if (!intent.item) {
        const res: IntentResult = { type: 'ERROR_NO_ITEM' };
        setActionResult(res);
        return res;
      }
      const matches = findProduct(intent.item);
      if (matches.length === 1) {
        const match = matches[0];
        const name = match.name[activeLanguage.locale] ?? match.name['en-US'];
        setPendingRemove({ productId: match.id, name });
        const res: IntentResult = { type: 'CONFIRM_REMOVE', product: name };
        setActionResult(res);
        return res;
      } else if (matches.length > 1) {
        const res: IntentResult = { type: 'ERROR_AMBIGUOUS', query: intent.item };
        setActionResult(res);
        return res;
      }
      const res: IntentResult = { type: 'ERROR_NOT_ON_LIST', query: intent.item };
      setActionResult(res);
      return res;
    }

    if (intent.intent === 'MODIFY_ITEM') {
      if (!intent.item || intent.quantity === undefined) {
        const res: IntentResult = { type: 'ERROR_NO_ITEM' };
        setActionResult(res);
        return res;
      }
      const matches = findProduct(intent.item);
      if (matches.length === 1) {
        const match = matches[0];
        shopping.modifyItem(match.id, intent.quantity);
        const name = match.name[activeLanguage.locale] ?? match.name['en-US'];
        const type = intent.quantity <= 0 ? 'SUCCESS_REMOVE' : 'SUCCESS_MODIFY';
        const res: IntentResult = { type, product: name, quantity: intent.quantity };
        setActionResult(res);
        addActivity(res, 'success');
        return res;
      } else if (matches.length > 1) {
        const res: IntentResult = { type: 'ERROR_AMBIGUOUS', query: intent.item };
        setActionResult(res);
        return res;
      }
      const res: IntentResult = { type: 'ERROR_NOT_ON_LIST', query: intent.item };
      setActionResult(res);
      return res;
    }

    if (intent.intent === 'SEARCH_PRODUCT') {
      setSearchIntent(intent);
      const res: IntentResult = { type: 'SUCCESS_SEARCH', query: intent.item };
      setActionResult(res);
      addActivity(res, 'search');
      setTimeout(() => {
        document.getElementById('discover-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return res;
    }

    return null;
  }, [activeLanguage.locale, findProduct, shopping, addActivity]);

  // ── Shared text/voice command handler ────────────────
  // Both voice (final transcript) and text (submit) go through here.
  // Text is passed directly — NO reading of stale state.
  const handleCommand = useCallback((text: string) => {
    const normalized = text.trim();
    if (!normalized) return null;
    const intent = IntentParser.parse(normalized, activeLanguage.locale);
    return executeIntent(intent);
  }, [activeLanguage.locale, executeIntent]);

  // ── VOICE: Callback from useSpeechEngine (FINAL transcript only) ─
  // Called by the engine when isFinal=true — never for interim results.
  // Uses useCallback ref pattern inside the engine to avoid stale closure.
  const handleFinalVoiceTranscript = useCallback((finalText: string) => {
    const normalized = finalText.trim();
    if (!normalized) return;

    setCurrentTranscript(normalized);
    const result = handleCommand(normalized);

    if (result && result.type.startsWith('SUCCESS')) {
      speech.setState('SUCCESS');
      setTimeout(() => speech.setState('IDLE'), 2200);
    } else {
      speech.setState('IDLE');
    }
  // speech.setState ref is stable — eslint-disable needed because `speech` is
  // declared below but handleFinalVoiceTranscript is passed to useSpeechEngine
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleCommand]);

  // ── Speech engine ────────────────────────────────────
  // Declared AFTER handleFinalVoiceTranscript to allow the callback to reference it.
  // The engine stores the callback in a ref internally, so changes propagate automatically.
  const speech = useSpeechEngine({
    language: activeLanguage.speechRecognitionCode,
    onFinalTranscript: handleFinalVoiceTranscript,
  });

  // ── TEXT: Manual submit ───────────────────────────────
  const handleManualSubmit = (text: string) => {
    setCurrentTranscript(text.trim());
    const result = handleCommand(text);
    if (result && result.type.startsWith('SUCCESS')) {
      speech.setState('SUCCESS');
      setTimeout(() => speech.setState('IDLE'), 2200);
    } else {
      speech.setState('IDLE');
    }
  };

  // ── Remove confirmation ───────────────────────────────
  const confirmRemove = () => {
    if (!pendingRemove) return;
    shopping.removeItem(pendingRemove.productId);
    const res: IntentResult = { type: 'SUCCESS_REMOVE', product: pendingRemove.name };
    setActionResult(res);
    setPendingRemove(null);
    addActivity(res, 'success');
  };
  const cancelRemove = () => { setPendingRemove(null); setActionResult(null); };

  // ── Activity message renderer ─────────────────────────
  const getActivityMessage = (act: import('./types').ActivityEvent) => {
    switch (act.resultType) {
      case 'SUCCESS_ADD':       return t('activity.added',       { quantity: act.quantity!, product: act.product! });
      case 'SUCCESS_REMOVE':    return t('activity.removed',     { product: act.product! });
      case 'SUCCESS_MODIFY':    return t('activity.updated',     { product: act.product!, quantity: act.quantity! });
      case 'SUCCESS_SEARCH':    return act.query ? t('activity.searched', { query: act.query }) : t('activity.searchGeneral');
      case 'ERROR_UNKNOWN':     return t('activity.errorUnknown');
      case 'ERROR_NO_ITEM':     return t('activity.errorNoItem');
      case 'ERROR_NOT_FOUND':   return t('activity.errorNotFound',   { query: act.query! });
      case 'ERROR_NOT_ON_LIST': return t('activity.errorNotOnList',  { query: act.query! });
      case 'ERROR_AMBIGUOUS':   return 'I found multiple matching products. Please specify which one.';
      default: return '';
    }
  };

  // ── Order handlers ────────────────────────────────────
  const handlePlaceOrder = (details: { total: number; itemCount: number }) => {
    const orderId = addOrder(details.total, details.itemCount);
    shopping.clearList();
    setIsCheckoutOpen(false);
    setConfirmedOrderId(orderId);
  };

  const handleShopSeasonal = () => {
    setActiveView('home');
    setTimeout(() => {
      document.getElementById('discover-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  // ── Cart totals ───────────────────────────────────────
  const subtotal = shopping.items.reduce((acc, item) => {
    const p = catalog.find(p => p.id === item.productId);
    if (!p) return acc;
    return acc + ((p.onSale && p.salePrice ? p.salePrice : p.price) * item.quantity);
  }, 0);
  const delivery = 5;
  const orderTotal = subtotal + delivery;

  // ── Render ────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col relative transition-colors duration-300"
      style={{ backgroundColor: 'var(--vc-bg)', color: 'var(--vc-text)' }}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <Header
        activeLanguage={activeLanguage}
        setLanguage={setLanguage}
        activeCountry={activeCountry}
        setCountry={setCountry}
        theme={theme}
        setTheme={setTheme}
        t={t}
        cartCount={shopping.items.length}
        onOpenCartMobile={() => setIsCartOpen(true)}
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          setIsCartOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* ── Main 3-column workspace ─────────────────────── */}
      <main className="flex-1 flex flex-col w-full" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div
          className="w-full h-full flex flex-col lg:flex-row"
          style={{ maxWidth: '1600px', margin: '0 auto', width: '100%' }}
        >
          {/* LEFT: Category Sidebar — desktop only, sticky */}
          {activeView === 'home' && (
            <div
              className="hidden lg:flex flex-col shrink-0 overflow-y-auto sticky top-16 self-start"
              style={{
                width: '220px',
                minHeight: 'calc(100vh - 64px)',
                maxHeight: 'calc(100vh - 64px)',
                borderRight: '1px solid var(--vc-border)',
                backgroundColor: 'var(--vc-bg)',
                padding: '20px 8px',
              }}
            >
              <CategorySidebar
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                t={t}
              />
            </div>
          )}

          {/* CENTER: Main scrollable content */}
          <div
            className="flex-1 min-w-0 overflow-y-auto"
            id="main-scroll"
            style={{ maxHeight: 'calc(100vh - 64px)' }}
          >
            {activeView === 'orders' ? (
              /* ── Orders view ── */
              <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
                <h2
                  className="text-2xl font-black tracking-tight mb-6"
                  style={{ color: 'var(--vc-text)' }}
                >
                  {t('orders.title')}
                </h2>
                <OrderHistory orders={orders} formatPrice={formatPrice} t={t} />
              </div>
            ) : (
              /* ── Home view ── */
              <div className="flex flex-col">

                {/* 1. Compact Voice + Text Hero */}
                <CommandHero
                  state={speech.state}
                  onStartVoice={speech.startListening}
                  onStopVoice={speech.stopListening}
                  onSubmitText={handleManualSubmit}
                  voiceSupported={activeLanguage.voiceSupported}
                  t={t}
                />

                {/* 2. Command Feedback — only when there's something to show */}
                {(actionResult || currentTranscript || speech.errorMsg || pendingRemove || !activeLanguage.voiceSupported) && (
                  <div
                    className="px-4 sm:px-6 lg:px-8 py-3"
                    style={{ borderBottom: '1px solid var(--vc-border)' }}
                  >
                    <div className="max-w-4xl mx-auto">
                      <CommandFeedback
                        intent={null}
                        actionResult={actionResult}
                        transcript={currentTranscript}
                        speechErrorMsg={speech.errorMsg}
                        pendingRemove={pendingRemove}
                        onConfirmRemove={confirmRemove}
                        onCancelRemove={cancelRemove}
                        language={activeLanguage.displayName}
                        voiceSupported={activeLanguage.voiceSupported}
                        t={t}
                      />
                    </div>
                  </div>
                )}

                {/* 3. Mobile horizontal category strip */}
                <div className="lg:hidden">
                  <CategoryStrip
                    activeCategory={activeCategory}
                    onSelectCategory={setActiveCategory}
                    t={t}
                  />
                </div>

                {/* 4. Featured promotional banner */}
                <FeaturedBanner onShopSeasonal={handleShopSeasonal} t={t} />

                {/* 5. Recommendations — horizontal rows */}
                {(recs.historyRecs.length > 0 || recs.seasonalRecs.length > 0 || recs.saleRecs.length > 0) && (
                  <div
                    className="py-5"
                    style={{ borderBottom: '1px solid var(--vc-border)' }}
                  >
                    <div className="px-4 sm:px-6 lg:px-8 mb-3">
                      <h2
                        className="text-base font-black tracking-tight"
                        style={{ color: 'var(--vc-text)' }}
                      >
                        {t('recommendations.title')}
                      </h2>
                    </div>
                    <Recommendations
                      historyRecs={recs.historyRecs}
                      seasonalRecs={recs.seasonalRecs}
                      saleRecs={recs.saleRecs}
                      language={activeLanguage.locale}
                      onAdd={shopping.addItem}
                      formatPrice={formatPrice}
                      t={t}
                    />
                  </div>
                )}

                {/* 6. Recent activity chips — only if any */}
                {activities.length > 0 && (
                  <div
                    className="px-4 sm:px-6 lg:px-8 py-3"
                    style={{
                      borderBottom: '1px solid var(--vc-border)',
                      backgroundColor: 'var(--vc-section)',
                    }}
                  >
                    <p
                      className="text-[10px] font-black uppercase tracking-widest mb-2"
                      style={{ color: 'var(--vc-text-xmuted)' }}
                    >
                      {t('activity.title')}
                    </p>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                      {activities.slice(0, 5).map(act => (
                        <div
                          key={act.id}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
                          style={{
                            backgroundColor: 'var(--vc-surface)',
                            borderColor: 'var(--vc-border)',
                            color: 'var(--vc-text-2)',
                          }}
                        >
                          <span className="text-sm leading-none">
                            {act.type === 'success' ? '✓' : act.type === 'search' ? '⌕' : '✗'}
                          </span>
                          <span className="max-w-[200px] truncate">{getActivityMessage(act)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Discover catalog */}
                <Discover
                  language={activeLanguage.locale}
                  onAdd={shopping.addItem}
                  formatPrice={formatPrice}
                  searchIntent={searchIntent}
                  category={activeCategory}
                  t={t}
                />
              </div>
            )}
          </div>

          {/* RIGHT: Cart — sticky desktop, slide-in mobile */}
          <div
            className={`
              fixed inset-y-0 right-0 z-40 w-full flex flex-col
              transition-transform duration-300 ease-out
              lg:relative lg:translate-x-0 lg:z-auto lg:flex lg:sticky lg:top-16 lg:self-start
              ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
            style={{
              maxWidth: '340px',
              width: '340px',
              height: 'calc(100vh - 64px)',
              maxHeight: 'calc(100vh - 64px)',
            }}
          >
            {/* Mobile close */}
            <div className="lg:hidden absolute top-3 left-3 z-50">
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full transition-colors"
                style={{ backgroundColor: 'var(--vc-section)', color: 'var(--vc-text-muted)' }}
                aria-label="Close cart"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <Cart
              items={shopping.items}
              onRemove={(id) => {
                const name = catalog.find(p => p.id === id)?.name[activeLanguage.locale]
                  ?? catalog.find(p => p.id === id)?.name['en-US']
                  ?? id;
                setPendingRemove({ productId: id, name });
              }}
              onModify={shopping.modifyItem}
              language={activeLanguage.locale}
              formatPrice={formatPrice}
              t={t}
              onCheckout={() => { setIsCheckoutOpen(true); setIsCartOpen(false); }}
            />
          </div>

          {/* Mobile cart backdrop */}
          {isCartOpen && (
            <div
              className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]"
              onClick={() => setIsCartOpen(false)}
              aria-hidden="true"
            />
          )}
        </div>
      </main>

      {/* Mobile sticky cart bar */}
      {shopping.items.length > 0 && !isCartOpen && activeView === 'home' && (
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
          style={{
            padding: '12px 16px 16px',
            background: 'linear-gradient(to top, var(--vc-bg) 70%, transparent)',
          }}
        >
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between font-black py-3.5 px-5 rounded-2xl shadow-lg transition-transform active:scale-[0.98] pointer-events-auto text-sm text-white"
            style={{ backgroundColor: 'var(--vc-primary)' }}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-black"
                style={{ color: 'var(--vc-primary)' }}
              >
                {shopping.items.length}
              </span>
              {shopping.items.length} {shopping.items.length === 1 ? 'item' : 'items'}
            </span>
            <span className="flex items-center gap-1.5">
              {t('cart.view')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </button>
        </div>
      )}

      {/* ── Modals ──────────────────────────────────────── */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onPlaceOrder={handlePlaceOrder}
        subtotal={subtotal}
        delivery={delivery}
        total={orderTotal}
        itemCount={shopping.items.length}
        formatPrice={formatPrice}
        t={t}
      />

      {confirmedOrderId && (
        <OrderConfirmation
          orderId={confirmedOrderId}
          itemCount={orders.find(o => o.id === confirmedOrderId)?.itemCount || 0}
          total={orders.find(o => o.id === confirmedOrderId)?.total || 0}
          formatPrice={formatPrice}
          t={t}
          onContinueShopping={() => {
            setConfirmedOrderId(null);
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onViewOrders={() => {
            setConfirmedOrderId(null);
            setActiveView('orders');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
