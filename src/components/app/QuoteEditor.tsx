import React, { useState } from 'react';
import type { QuoteData, CustomField } from '../../types/quote';
import { LogoUploader } from './LogoUploader';
import { LineItemsEditor } from './LineItemsEditor';
import { SignaturePad } from './SignaturePad';
import { computeFinancials, formatMoney } from '../../utils/calculations';
import { Plus, Trash2, ChevronDown, ChevronUp, FileText, User, Building, DollarSign, CreditCard } from 'lucide-react';

interface QuoteEditorProps {
  quote: QuoteData;
  onChange: (updated: QuoteData) => void;
}

export const QuoteEditor: React.FC<QuoteEditorProps> = ({ quote, onChange }) => {
  const [activeSection, setActiveSection] = useState<'all' | string>('all');

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

  // Add / Remove custom fields for metadata
  const addCustomMetaField = () => {
    const newField: CustomField = {
      id: 'field-' + Date.now(),
      label: 'New Field',
      value: ''
    };
    updateMeta('customFields', [...(quote.meta.customFields || []), newField]);
  };

  const removeCustomMetaField = (id: string) => {
    updateMeta(
      'customFields',
      quote.meta.customFields.filter((f) => f.id !== id)
    );
  };

  // Tax Management
  const addTaxRow = () => {
    const newTax = {
      id: 'tax-' + Date.now(),
      name: 'Tax / GST',
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
    <div className="space-y-6 text-xs text-neutral-800">
      {/* 1. Header & Logo */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Logo Uploader */}
          <LogoUploader
            branding={quote.branding}
            onChange={(newBranding) => onChange({ ...quote, branding: newBranding })}
          />

          {/* Document Title & Numbering */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium block mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={quote.meta.title}
                onChange={(e) => updateMeta('title', e.target.value)}
                placeholder="QUOTE / ESTIMATE / PROPOSAL"
                className="w-full text-base font-bold px-3 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-neutral-500 block mb-1">Quote #</label>
                <input
                  type="text"
                  value={quote.meta.quoteNumber}
                  onChange={(e) => updateMeta('quoteNumber', e.target.value)}
                  className="w-full font-mono text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-neutral-500 block mb-1">P.O. Number</label>
                <input
                  type="text"
                  placeholder="Optional PO#"
                  value={quote.meta.poNumber || ''}
                  onChange={(e) => updateMeta('poNumber', e.target.value)}
                  className="w-full font-mono text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-neutral-500 block mb-1">Date</label>
                <input
                  type="date"
                  value={quote.meta.issueDate}
                  onChange={(e) => updateMeta('issueDate', e.target.value)}
                  className="w-full font-mono text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-neutral-500 block mb-1">Valid Until</label>
                <input
                  type="date"
                  value={quote.meta.validUntil || ''}
                  onChange={(e) => updateMeta('validUntil', e.target.value)}
                  className="w-full font-mono text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. From & To Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* From Box */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" /> From (Your Business)
          </label>
          <input
            type="text"
            placeholder="Your Business / Full Name"
            value={quote.from.name}
            onChange={(e) => updateFrom('name', e.target.value)}
            className="w-full font-semibold text-sm px-3 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
          />
          <input
            type="email"
            placeholder="Email address"
            value={quote.from.email}
            onChange={(e) => updateFrom('email', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={quote.from.phone}
            onChange={(e) => updateFrom('phone', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
          />
          <input
            type="text"
            placeholder="Street address"
            value={quote.from.address}
            onChange={(e) => updateFrom('address', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="City, State, Zip"
              value={quote.from.cityStateZip}
              onChange={(e) => updateFrom('cityStateZip', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
            />
            <input
              type="text"
              placeholder="Tax ID / VAT / GSTIN"
              value={quote.from.taxId}
              onChange={(e) => updateFrom('taxId', e.target.value)}
              className="w-full text-xs font-mono px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
            />
          </div>
        </div>

        {/* To Box */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Quote To (Client)
            </label>
            <label className="flex items-center gap-1 text-[11px] text-neutral-500 cursor-pointer">
              <input
                type="checkbox"
                checked={quote.to.hasShippingAddress}
                onChange={(e) => updateTo('hasShippingAddress', e.target.checked)}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-0 w-3 h-3"
              />
              <span>Ship To Address</span>
            </label>
          </div>

          <input
            type="text"
            placeholder="Client or Company Name"
            value={quote.to.name}
            onChange={(e) => updateTo('name', e.target.value)}
            className="w-full font-semibold text-sm px-3 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
          />
          <input
            type="email"
            placeholder="Client Email"
            value={quote.to.email}
            onChange={(e) => updateTo('email', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
          />
          <input
            type="tel"
            placeholder="Client Phone"
            value={quote.to.phone}
            onChange={(e) => updateTo('phone', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
          />
          <input
            type="text"
            placeholder="Client Address"
            value={quote.to.address}
            onChange={(e) => updateTo('address', e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="City, State, Zip"
              value={quote.to.cityStateZip}
              onChange={(e) => updateTo('cityStateZip', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
            />
            <input
              type="text"
              placeholder="Client Tax ID"
              value={quote.to.taxId}
              onChange={(e) => updateTo('taxId', e.target.value)}
              className="w-full text-xs font-mono px-2.5 py-1.5 border border-neutral-200 rounded-md focus:border-neutral-900"
            />
          </div>

          {quote.to.hasShippingAddress && (
            <div className="pt-2 border-t border-neutral-100">
              <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Shipping Destination</label>
              <textarea
                rows={2}
                placeholder="Specific site or delivery address..."
                value={quote.to.shipToAddress || ''}
                onChange={(e) => updateTo('shipToAddress', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Line Items Editor */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <LineItemsEditor
          items={quote.items}
          currency={quote.currency}
          onChange={handleLineItemsChange}
        />
      </div>

      {/* 4. Financials Calculation Block */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5" /> Discounts, Taxes & Financials
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Controls: Discount & Tax Options */}
          <div className="space-y-4">
            {/* Discount Control */}
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-700">Client Discount</span>
                <div className="flex rounded border border-neutral-200 overflow-hidden bg-white text-[11px]">
                  <button
                    type="button"
                    onClick={() => recomputeFinancials({ discountType: 'percentage' })}
                    className={`px-2 py-0.5 ${
                      quote.financials.discountType === 'percentage'
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-neutral-600'
                    }`}
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => recomputeFinancials({ discountType: 'fixed' })}
                    className={`px-2 py-0.5 ${
                      quote.financials.discountType === 'fixed'
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-neutral-600'
                    }`}
                  >
                    Fixed
                  </button>
                </div>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                placeholder={quote.financials.discountType === 'percentage' ? 'e.g. 10 (%)' : 'e.g. 150'}
                value={quote.financials.discountValue === 0 ? '' : quote.financials.discountValue}
                onChange={(e) => recomputeFinancials({ discountValue: Number(e.target.value) || 0 })}
                className="w-full text-xs font-mono px-2.5 py-1.5 border border-neutral-200 rounded bg-white text-right"
              />
            </div>

            {/* Taxes Control */}
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-700">Taxes / VAT / GST</span>
                <button
                  type="button"
                  onClick={addTaxRow}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> Add Tax Row
                </button>
              </div>

              {quote.financials.taxes.map((tax, idx) => (
                <div key={tax.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tax.name}
                    onChange={(e) => updateTaxRow(idx, 'name', e.target.value)}
                    className="flex-1 text-xs px-2 py-1 border border-neutral-200 rounded bg-white"
                  />
                  <div className="flex items-center gap-1 w-24">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={tax.rate === 0 ? '' : tax.rate}
                      onChange={(e) => updateTaxRow(idx, 'rate', Number(e.target.value) || 0)}
                      className="w-full text-xs font-mono px-1.5 py-1 border border-neutral-200 rounded bg-white text-right"
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-neutral-500 block mb-1">Shipping Fee</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={quote.financials.shipping === 0 ? '' : quote.financials.shipping}
                  onChange={(e) => recomputeFinancials({ shipping: Number(e.target.value) || 0 })}
                  className="w-full text-xs font-mono px-2.5 py-1.5 border border-neutral-200 rounded text-right"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-neutral-500 block mb-1">Deposit / Amount Paid</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={quote.financials.amountPaid === 0 ? '' : quote.financials.amountPaid}
                  onChange={(e) => recomputeFinancials({ amountPaid: Number(e.target.value) || 0 })}
                  className="w-full text-xs font-mono px-2.5 py-1.5 border border-neutral-200 rounded text-right"
                />
              </div>
            </div>
          </div>

          {/* Computed Summary Card */}
          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg flex flex-col justify-between font-mono space-y-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-neutral-600">
                <span className="font-sans">Subtotal:</span>
                <span>{formatMoney(quote.financials.subtotal, quote.currency)}</span>
              </div>

              {quote.financials.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="font-sans">
                    Discount ({quote.financials.discountType === 'percentage' ? `${quote.financials.discountValue}%` : 'Fixed'}):
                  </span>
                  <span>-{formatMoney(quote.financials.discountAmount, quote.currency)}</span>
                </div>
              )}

              {quote.financials.taxes.map((t) => (
                <div key={t.id} className="flex justify-between text-neutral-600">
                  <span className="font-sans">{t.name} ({t.rate}%):</span>
                  <span>{formatMoney(t.amount, quote.currency)}</span>
                </div>
              ))}

              {quote.financials.shipping > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span className="font-sans">Shipping:</span>
                  <span>{formatMoney(quote.financials.shipping, quote.currency)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t-2 border-neutral-900 space-y-1">
              <div className="flex justify-between text-base font-bold text-neutral-950">
                <span className="font-sans">Total:</span>
                <span>{formatMoney(quote.financials.total, quote.currency)}</span>
              </div>

              {quote.financials.amountPaid > 0 && (
                <>
                  <div className="flex justify-between text-[11px] text-neutral-500">
                    <span className="font-sans">Amount Paid:</span>
                    <span>{formatMoney(quote.financials.amountPaid, quote.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-neutral-900 pt-1 border-t border-neutral-200">
                    <span className="font-sans">Balance Due:</span>
                    <span>{formatMoney(quote.financials.balanceDue, quote.currency)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Notes & Terms & Payment Wire Info */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5" /> Notes, Payment Terms & Wire Instructions
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono text-neutral-500 block mb-1">Notes / Remarks</label>
            <textarea
              rows={3}
              placeholder="e.g. Thank you for your business. We look forward to working with you!"
              value={quote.payment.notes}
              onChange={(e) => updatePayment('notes', e.target.value)}
              className="w-full text-xs p-2.5 border border-neutral-200 rounded-md"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-neutral-500 block mb-1">Terms & Conditions</label>
            <textarea
              rows={3}
              placeholder="e.g. Payment due within 30 days. 50% advance deposit required for kickoff."
              value={quote.payment.terms}
              onChange={(e) => updatePayment('terms', e.target.value)}
              className="w-full text-xs p-2.5 border border-neutral-200 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-neutral-100">
          <div>
            <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">Bank Name</label>
            <input
              type="text"
              placeholder="e.g. Chase / Barclays"
              value={quote.payment.bankName}
              onChange={(e) => updatePayment('bankName', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">Account / Wire Number</label>
            <input
              type="text"
              placeholder="e.g. 123456789"
              value={quote.payment.accountNumber}
              onChange={(e) => updatePayment('accountNumber', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-neutral-400 block mb-0.5">Payment Link / Stripe / PayPal</label>
            <input
              type="text"
              placeholder="https://pay.yoursite.com"
              value={quote.payment.paymentLink}
              onChange={(e) => updatePayment('paymentLink', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* 6. Signature Pad */}
      <SignaturePad
        signature={quote.signature}
        onChange={(newSig) => onChange({ ...quote, signature: newSig })}
      />
    </div>
  );
};
