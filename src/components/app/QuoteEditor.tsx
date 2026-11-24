import React from 'react';
import type { QuoteData } from '../../types/quote';
import { LogoUploader } from './LogoUploader';
import { LineItemsEditor } from './LineItemsEditor';
import { SignaturePad } from './SignaturePad';
import { computeFinancials, formatMoney } from '../../utils/calculations';
import type { SiteUiDictionary } from '../../data/uiTranslations';
import { Plus, Trash2, Building, User, DollarSign, CreditCard } from 'lucide-react';

interface QuoteEditorProps {
  quote: QuoteData;
  ui: SiteUiDictionary;
  onChange: (updated: QuoteData) => void;
}

export const QuoteEditor: React.FC<QuoteEditorProps> = ({ quote, ui, onChange }) => {
  const updateMeta = (field: string, value: any) => {
    onChange({
      ...quote,
      meta: { ...quote.meta, [field]: value }
    });
  };

  const updateFrom = (field: string, value: any) => {
    onChange({
      ...quote,
      from: { ...quote.from, [field]: value }
    });
  };

  const updateTo = (field: string, value: any) => {
    onChange({
      ...quote,
      to: { ...quote.to, [field]: value }
    });
  };

  const updatePayment = (field: string, value: any) => {
    onChange({
      ...quote,
      payment: { ...quote.payment, [field]: value }
    });
  };

  const recomputeFinancials = (partialFinancials: Partial<QuoteData['financials']>) => {
    const nextFinancials = computeFinancials(
      quote.items,
      partialFinancials.discountType ?? quote.financials.discountType,
      partialFinancials.discountValue ?? quote.financials.discountValue,
      partialFinancials.taxes ?? quote.financials.taxes,
      partialFinancials.shipping ?? quote.financials.shipping,
      partialFinancials.amountPaid ?? quote.financials.amountPaid
    );
    onChange({
      ...quote,
      financials: nextFinancials
    });
  };

  const handleLineItemsChange = (newItems: any[]) => {
    const nextFinancials = computeFinancials(
      newItems,
      quote.financials.discountType,
      quote.financials.discountValue,
      quote.financials.taxes,
      quote.financials.shipping,
      quote.financials.amountPaid
    );
    onChange({
      ...quote,
      items: newItems,
      financials: nextFinancials
    });
  };

  // Tax Management
  const addTaxRow = () => {
    const newTax = {
      id: 'tax-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      name: 'Tax / VAT',
      rate: 10,
      amount: 0
    };
    recomputeFinancials({
      taxes: [...quote.financials.taxes, newTax]
    });
  };

  const removeTaxRow = (id: string) => {
    recomputeFinancials({
      taxes: quote.financials.taxes.filter((t) => t.id !== id)
    });
  };

  const updateTaxRow = (index: number, field: string, value: any) => {
    const updated = [...quote.financials.taxes];
    updated[index] = { ...updated[index], [field]: value };
    recomputeFinancials({ taxes: updated });
  };

  return (
    <div className="space-y-6 text-xs text-neutral-800 dark:text-neutral-200">
      {/* 1. Header & Logo */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Logo Uploader */}
          <LogoUploader
            branding={quote.branding}
            onChange={(newBranding) => onChange({ ...quote, branding: newBranding })}
          />

          {/* Document Title & Metadata */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium block mb-1">
                {ui.docTitleLabel}
              </label>
              <input
                type="text"
                value={quote.meta.title}
                onChange={(e) => updateMeta('title', e.target.value)}
                placeholder="QUOTE / ESTIMATE"
                className="w-full text-base font-bold px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900 dark:focus:border-neutral-400 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
                  {ui.quoteNumberLabel}
                </label>
                <input
                  type="text"
                  value={quote.meta.quoteNumber}
                  onChange={(e) => updateMeta('quoteNumber', e.target.value)}
                  className="w-full font-mono text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
                  {ui.poNumberLabel}
                </label>
                <input
                  type="text"
                  placeholder="Optional PO#"
                  value={quote.meta.poNumber || ''}
                  onChange={(e) => updateMeta('poNumber', e.target.value)}
                  className="w-full font-mono text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
                  {ui.dateLabel}
                </label>
                <input
                  type="date"
                  value={quote.meta.issueDate}
                  onChange={(e) => updateMeta('issueDate', e.target.value)}
                  className="w-full font-mono text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
                  {ui.validUntilLabel}
                </label>
                <input
                  type="date"
                  value={quote.meta.validUntil || ''}
                  onChange={(e) => updateMeta('validUntil', e.target.value)}
                  className="w-full font-mono text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. From & To Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* From Box */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" /> {ui.fromTitle}
          </label>
          <input
            type="text"
            placeholder={ui.fromNamePlaceholder}
            value={quote.from.name}
            onChange={(e) => updateFrom('name', e.target.value)}
            className="w-full font-semibold text-sm px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
          />
          <input
            type="email"
            placeholder={ui.emailPlaceholder}
            value={quote.from.email}
            onChange={(e) => updateFrom('email', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
          />
          <input
            type="tel"
            placeholder={ui.phonePlaceholder}
            value={quote.from.phone}
            onChange={(e) => updateFrom('phone', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
          />
          <input
            type="text"
            placeholder={ui.addressPlaceholder}
            value={quote.from.address}
            onChange={(e) => updateFrom('address', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder={ui.cityZipPlaceholder}
              value={quote.from.cityStateZip}
              onChange={(e) => updateFrom('cityStateZip', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
            />
            <input
              type="text"
              placeholder={ui.taxIdPlaceholder}
              value={quote.from.taxId}
              onChange={(e) => updateFrom('taxId', e.target.value)}
              className="w-full text-xs font-mono px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
            />
          </div>
        </div>

        {/* To Box */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> {ui.toTitle}
            </label>
            <label className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 cursor-pointer">
              <input
                type="checkbox"
                checked={quote.to.hasShippingAddress}
                onChange={(e) => updateTo('hasShippingAddress', e.target.checked)}
                className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-0 w-3 h-3"
              />
              <span>{ui.shipToToggle}</span>
            </label>
          </div>

          <input
            type="text"
            placeholder={ui.toNamePlaceholder}
            value={quote.to.name}
            onChange={(e) => updateTo('name', e.target.value)}
            className="w-full font-semibold text-sm px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
          />
          <input
            type="email"
            placeholder={ui.emailPlaceholder}
            value={quote.to.email}
            onChange={(e) => updateTo('email', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
          />
          <input
            type="tel"
            placeholder={ui.phonePlaceholder}
            value={quote.to.phone}
            onChange={(e) => updateTo('phone', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
          />
          <input
            type="text"
            placeholder={ui.addressPlaceholder}
            value={quote.to.address}
            onChange={(e) => updateTo('address', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder={ui.cityZipPlaceholder}
              value={quote.to.cityStateZip}
              onChange={(e) => updateTo('cityStateZip', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
            />
            <input
              type="text"
              placeholder={ui.taxIdPlaceholder}
              value={quote.to.taxId}
              onChange={(e) => updateTo('taxId', e.target.value)}
              className="w-full text-xs font-mono px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:border-neutral-900"
            />
          </div>

          {quote.to.hasShippingAddress && (
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <label className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase block mb-1">
                {ui.shippingDestination}
              </label>
              <textarea
                rows={2}
                placeholder="Specific site or delivery address..."
                value={quote.to.shipToAddress || ''}
                onChange={(e) => updateTo('shipToAddress', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Line Items Editor */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs">
        <LineItemsEditor
          items={quote.items}
          currency={quote.currency}
          ui={ui}
          onChange={handleLineItemsChange}
        />
      </div>

      {/* 4. Financials Calculation Block */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5" /> {ui.financialsTitle}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Controls: Discount & Tax Options */}
          <div className="space-y-4">
            {/* Discount Control */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{ui.clientDiscount}</span>
                <div className="flex rounded border border-neutral-200 dark:border-neutral-700 overflow-hidden bg-white dark:bg-neutral-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => recomputeFinancials({ discountType: 'percentage' })}
                    className={`px-2 py-0.5 ${
                      quote.financials.discountType === 'percentage'
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => recomputeFinancials({ discountType: 'fixed' })}
                    className={`px-2 py-0.5 ${
                      quote.financials.discountType === 'fixed'
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {ui.fixed}
                  </button>
                </div>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                placeholder={quote.financials.discountType === 'percentage' ? 'e.g. 10 (%)' : 'e.g. 150'}
                value={quote.financials.discountValue === 0 ? '' : quote.financials.discountValue}
                onChange={(e) => recomputeFinancials({ discountValue: Math.max(0, Number(e.target.value) || 0) })}
                className="w-full text-xs font-mono px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-right"
              />
            </div>

            {/* Taxes Control */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{ui.taxesTitle}</span>
                <button
                  type="button"
                  onClick={addTaxRow}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> {ui.btnAddTaxRow}
                </button>
              </div>

              {quote.financials.taxes.map((tax, idx) => (
                <div key={tax.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tax.name}
                    onChange={(e) => updateTaxRow(idx, 'name', e.target.value)}
                    className="flex-1 text-xs px-2 py-1 border border-neutral-200 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                  <div className="flex items-center gap-1 w-24">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={tax.rate === 0 ? '' : tax.rate}
                      onChange={(e) => updateTaxRow(idx, 'rate', Math.max(0, Number(e.target.value) || 0))}
                      className="w-full text-xs font-mono px-1.5 py-1 border border-neutral-200 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-right"
                    />
                    <span className="text-[11px] text-neutral-500 font-mono">%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTaxRow(tax.id)}
                    className="text-neutral-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Shipping & Deposit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
                  {ui.shippingFee}
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={quote.financials.shipping === 0 ? '' : quote.financials.shipping}
                  onChange={(e) => recomputeFinancials({ shipping: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-full text-xs font-mono px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded text-right"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
                  {ui.depositPaid}
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={quote.financials.amountPaid === 0 ? '' : quote.financials.amountPaid}
                  onChange={(e) => recomputeFinancials({ amountPaid: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-full text-xs font-mono px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded text-right"
                />
              </div>
            </div>
          </div>

          {/* Computed Summary Card */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg flex flex-col justify-between font-mono space-y-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span className="font-sans">{ui.subtotal}:</span>
                <span>{formatMoney(quote.financials.subtotal, quote.currency)}</span>
              </div>

              {quote.financials.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span className="font-sans">
                    {ui.discount} ({quote.financials.discountType === 'percentage' ? `${quote.financials.discountValue}%` : ui.fixed}):
                  </span>
                  <span>-{formatMoney(quote.financials.discountAmount, quote.currency)}</span>
                </div>
              )}

              {quote.financials.taxes.map((t) => (
                <div key={t.id} className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span className="font-sans">
                    {t.name} ({t.rate}%):
                  </span>
                  <span>{formatMoney(t.amount, quote.currency)}</span>
                </div>
              ))}

              {quote.financials.shipping > 0 && (
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span className="font-sans">{ui.shippingFee}:</span>
                  <span>{formatMoney(quote.financials.shipping, quote.currency)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t-2 border-neutral-900 dark:border-neutral-600 space-y-1">
              <div className="flex justify-between text-base font-bold text-neutral-950 dark:text-white">
                <span className="font-sans">{ui.total}:</span>
                <span>{formatMoney(quote.financials.total, quote.currency)}</span>
              </div>

              {quote.financials.amountPaid > 0 && (
                <>
                  <div className="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span className="font-sans">{ui.amountPaid}:</span>
                    <span>{formatMoney(quote.financials.amountPaid, quote.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-neutral-900 dark:text-white pt-1 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="font-sans">{ui.balanceDue}:</span>
                    <span>{formatMoney(quote.financials.balanceDue, quote.currency)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Notes & Terms & Payment Wire Info */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5" /> {ui.notesAndTermsTitle}
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
              {ui.notesLabel}
            </label>
            <textarea
              rows={3}
              placeholder={ui.notesPlaceholder}
              value={quote.payment.notes}
              onChange={(e) => updatePayment('notes', e.target.value)}
              className="w-full text-xs p-2.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
              {ui.termsLabel}
            </label>
            <textarea
              rows={3}
              placeholder={ui.termsPlaceholder}
              value={quote.payment.terms}
              onChange={(e) => updatePayment('terms', e.target.value)}
              className="w-full text-xs p-2.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div>
            <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">{ui.bankNameLabel}</label>
            <input
              type="text"
              placeholder="e.g. Chase / Barclays"
              value={quote.payment.bankName}
              onChange={(e) => updatePayment('bankName', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">{ui.accountNumberLabel}</label>
            <input
              type="text"
              placeholder="e.g. 123456789"
              value={quote.payment.accountNumber}
              onChange={(e) => updatePayment('accountNumber', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">{ui.paymentLinkLabel}</label>
            <input
              type="text"
              placeholder="https://pay.yoursite.com"
              value={quote.payment.paymentLink}
              onChange={(e) => updatePayment('paymentLink', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md"
            />
          </div>
        </div>
      </div>

      {/* 6. Signature Pad */}
      <SignaturePad
        signature={quote.signature}
        onChange={(newSig) => onChange({ ...quote, signature: newSig })}
        labels={{
          signatureTitle: ui.signatureTitle,
          includeSignature: ui.includeSignature,
          typeName: ui.typeName,
          drawSignature: ui.drawSignature,
          clear: ui.clear,
          drawHint: ui.drawHint,
          typePlaceholder: ui.typePlaceholder,
          signerTitle: ui.signerTitle,
          signedDate: ui.signedDate,
          statement: ui.statement
        }}
      />
    </div>
  );
};
