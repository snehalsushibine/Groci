import React, { useState } from 'react';
import type { TranslationParams } from '../../i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPlaceOrder: (details: { total: number; itemCount: number }) => void;
  subtotal: number;
  delivery: number;
  total: number;
  itemCount: number;
  formatPrice: (amount: number) => string;
  t: (key: string, params?: TranslationParams) => string;
}

export function CheckoutModal({ isOpen, onClose, onPlaceOrder, subtotal, delivery, total, itemCount, formatPrice, t }: Props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !contact) return;
    onPlaceOrder({ total, itemCount });
  };

  const inputClass = `
    w-full border rounded-lg px-4 py-2.5 text-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors
  `;

  const inputStyle = {
    backgroundColor: 'var(--vc-bg)',
    borderColor: 'var(--vc-border)',
    color: 'var(--vc-text)',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    marginBottom: '4px',
    color: 'var(--vc-text-2)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--vc-surface)',
          border: '1px solid var(--vc-border)',
          boxShadow: 'var(--vc-shadow-md)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{
            borderBottom: '1px solid var(--vc-border)',
            backgroundColor: 'var(--vc-section)',
          }}
        >
          <h2
            id="checkout-title"
            className="text-lg font-black tracking-tight"
            style={{ color: 'var(--vc-text)' }}
          >
            {t('checkout.title')}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: 'var(--vc-bg)', color: 'var(--vc-text-muted)' }}
            aria-label={t('checkout.cancel')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {/* Order summary */}
          <div
            className="rounded-xl p-4 mb-5"
            style={{
              backgroundColor: 'var(--vc-primary-lt)',
              border: '1px solid',
              borderColor: 'var(--vc-primary)',
            }}
          >
            <h3
              className="text-xs font-black uppercase tracking-widest mb-2"
              style={{ color: 'var(--vc-primary)' }}
            >
              {t('checkout.summary')}
            </h3>
            <div className="space-y-1 text-sm" style={{ color: 'var(--vc-text-2)' }}>
              <div className="flex justify-between">
                <span>{itemCount} items</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.delivery')}</span>
                <span>{formatPrice(delivery)}</span>
              </div>
              <div
                className="flex justify-between font-black text-sm pt-2 mt-1"
                style={{
                  borderTop: '1px solid var(--vc-primary)',
                  color: 'var(--vc-text)',
                }}
              >
                <span>{t('cart.total')}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={labelStyle}>{t('checkout.name')}</label>
              <input
                required type="text" value={name}
                onChange={e => setName(e.target.value)}
                className={inputClass} style={inputStyle}
                placeholder="Your name"
              />
            </div>
            <div>
              <label style={labelStyle}>{t('checkout.contact')}</label>
              <input
                required type="text" value={contact}
                onChange={e => setContact(e.target.value)}
                className={inputClass} style={inputStyle}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label style={labelStyle}>{t('checkout.address')}</label>
              <textarea
                required rows={2} value={address}
                onChange={e => setAddress(e.target.value)}
                className={inputClass} style={{ ...inputStyle, resize: 'none' }}
                placeholder="Delivery address"
              />
            </div>
            <div>
              <label style={labelStyle}>{t('checkout.notes')}</label>
              <input
                type="text" value={notes}
                onChange={e => setNotes(e.target.value)}
                className={inputClass} style={inputStyle}
                placeholder="Leave at the front door"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex justify-end gap-3"
          style={{
            borderTop: '1px solid var(--vc-border)',
            backgroundColor: 'var(--vc-section)',
          }}
        >
          <button
            type="button" onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors"
            style={{ color: 'var(--vc-text-muted)' }}
          >
            {t('checkout.cancel')}
          </button>
          <button
            form="checkout-form" type="submit"
            className="px-6 py-2.5 text-sm font-black text-white rounded-xl transition-all active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
            style={{ backgroundColor: 'var(--vc-primary)' }}
          >
            {t('checkout.placeOrder')}
          </button>
        </div>
      </div>
    </div>
  );
}
