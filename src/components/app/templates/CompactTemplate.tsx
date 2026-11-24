import React from 'react';
import type { QuoteData } from '../../../types/quote';
import { formatMoney } from '../../../utils/calculations';
import { getTranslation } from '../../../data/translations';

interface TemplateProps {
  quote: QuoteData;
}

export const CompactTemplate: React.FC<TemplateProps> = ({ quote }) => {
  const t = getTranslation(quote.language);
  const accent = quote.branding.accentColor || '#171717';

  return (
    <div className="text-neutral-900 bg-white font-mono text-[11px] leading-tight p-8 w-[794px] min-w-[794px] max-w-[794px] min-h-[1123px] mx-auto box-border flex flex-col justify-between border border-neutral-300">
      <div>
        {/* Compact Spec-Sheet Top Bar */}
        <div className="border-b border-neutral-300 pb-4 mb-4 flex justify-between items-start">
          <div className="space-y-1">
            {quote.branding.logoUrl && (
              <img
                src={quote.branding.logoUrl}
                alt="Logo"
                style={{ width: `${Math.min(quote.branding.logoWidth, 120)}px` }}
                className="max-h-12 object-contain mb-2"
              />
            )}
            <p className="font-bold text-sm tracking-tight font-sans">{quote.from.name}</p>
            <p className="text-neutral-600 text-[10px]">{quote.from.address} | {quote.from.cityStateZip}</p>
            <p className="text-neutral-600 text-[10px]">{quote.from.email} | {quote.from.phone}</p>
            {quote.from.taxId && <p className="text-neutral-600 text-[10px]">TAX ID: {quote.from.taxId}</p>}
          </div>

          <div className="text-right space-y-1">
            <h1 className="text-xl font-bold uppercase tracking-wider font-sans" style={{ color: accent }}>
              {quote.meta.title || t.quote}
            </h1>
            <p className="text-xs font-bold">DOC ID: {quote.meta.quoteNumber}</p>
            <p className="text-[10px] text-neutral-600">DATE: {quote.meta.issueDate}</p>
            {quote.meta.validUntil && <p className="text-[10px] text-neutral-600">VALID: {quote.meta.validUntil}</p>}
          </div>
        </div>

        {/* Client Spec */}
        <div className="border border-neutral-300 p-2.5 mb-4 grid grid-cols-2 gap-4 bg-neutral-50/50">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 block">// CLIENT ENTITY</span>
            <p className="font-bold text-xs">{quote.to.name}</p>
            <p className="text-neutral-600 text-[10px]">{quote.to.address}, {quote.to.cityStateZip}</p>
            <p className="text-neutral-600 text-[10px]">{quote.to.email} | {quote.to.phone}</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-widest text-neutral-400 block">// REFERENCES</span>
            <p className="text-[10px]">PO: {quote.meta.poNumber || 'N/A'}</p>
            {quote.to.taxId && <p className="text-[10px]">CLIENT TAX ID: {quote.to.taxId}</p>}
          </div>
        </div>

        {/* High Density Table */}
        <table className="w-full text-left text-[11px] border border-neutral-300 mb-4">
          <thead className="bg-neutral-100 border-b border-neutral-300 text-[10px] uppercase">
            <tr>
              <th className="py-1.5 px-2 border-r border-neutral-300 w-8">#</th>
              <th className="py-1.5 px-2 border-r border-neutral-300">{t.description}</th>
              <th className="py-1.5 px-2 border-r border-neutral-300 text-right w-16">{t.quantity}</th>
              <th className="py-1.5 px-2 border-r border-neutral-300 text-right w-20">{t.rate}</th>
              <th className="py-1.5 px-2 text-right w-24">{t.amount}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {quote.items.map((item, idx) => (
              <tr key={item.id}>
                <td className="py-1.5 px-2 border-r border-neutral-300 text-neutral-400">{idx + 1}</td>
                <td className="py-1.5 px-2 border-r border-neutral-300">
                  <span className="font-semibold">{item.description}</span>
                  {item.details && <span className="text-neutral-500 block text-[10px]">{item.details}</span>}
                </td>
                <td className="py-1.5 px-2 border-r border-neutral-300 text-right">{item.quantity} {item.unit}</td>
                <td className="py-1.5 px-2 border-r border-neutral-300 text-right">{formatMoney(item.rate, quote.currency)}</td>
                <td className="py-1.5 px-2 text-right font-bold">{formatMoney(item.amount, quote.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Compact Totals & Banking */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-neutral-300 p-2.5 space-y-2 text-[10px]">
            {quote.payment.notes && (
              <div>
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 block">// NOTES</span>
                <p className="text-neutral-700 whitespace-pre-line">{quote.payment.notes}</p>
              </div>
            )}
            {quote.payment.terms && (
              <div>
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 block">// TERMS</span>
                <p className="text-neutral-600 whitespace-pre-line">{quote.payment.terms}</p>
              </div>
            )}
            {quote.payment.accountNumber && (
              <div className="pt-1 border-t border-neutral-200 text-neutral-700">
                <span>WIRE: {quote.payment.bankName} | ACC: {quote.payment.accountNumber}</span>
              </div>
            )}
          </div>

          <div className="border border-neutral-300 p-2.5 space-y-1 text-right">
            <div className="flex justify-between text-neutral-600">
              <span>SUBTOTAL:</span>
              <span>{formatMoney(quote.financials.subtotal, quote.currency)}</span>
            </div>
            {quote.financials.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>DISCOUNT:</span>
                <span>-{formatMoney(quote.financials.discountAmount, quote.currency)}</span>
              </div>
            )}
            {quote.financials.taxes.map(tax => (
              <div key={tax.id} className="flex justify-between text-neutral-600">
                <span>{tax.name} ({tax.rate}%):</span>
                <span>{formatMoney(tax.amount, quote.currency)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1 border-t border-neutral-300 font-bold text-xs mt-1 text-neutral-950">
              <span>TOTAL DUE:</span>
              <span style={{ color: accent }}>{formatMoney(quote.financials.total, quote.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {quote.signature.enabled && (
        <div className="border-t border-neutral-300 pt-3 mt-auto flex justify-between items-end text-[10px]">
          <div>
            <span className="text-neutral-400">// AUTHORIZED SIGNATURE</span>
            {quote.signature.type === 'drawn' && quote.signature.dataUrl ? (
              <img src={quote.signature.dataUrl} alt="Signature" className="h-8 object-contain my-1" />
            ) : (
              <p className="font-serif italic text-sm my-1">{quote.signature.typedName || quote.from.name}</p>
            )}
            <div className="w-36 border-b border-neutral-400" />
          </div>
          <div className="text-right">
            <span className="text-neutral-400">// DATE</span>
            <p className="my-1">{quote.signature.signedDate}</p>
            <div className="w-24 border-b border-neutral-400" />
          </div>
        </div>
      )}
    </div>
  );
};
