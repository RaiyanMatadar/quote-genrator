import React from 'react';
import type { QuoteData } from '../../../types/quote';
import { formatMoney } from '../../../utils/calculations';
import { getTranslation } from '../../../data/translations';

interface TemplateProps {
  quote: QuoteData;
}

export const NordicTemplate: React.FC<TemplateProps> = ({ quote }) => {
  const t = getTranslation(quote.language);
  const accent = quote.branding.accentColor || '#10b981';

  return (
    <div className="text-neutral-800 bg-[#fafafa] font-sans text-xs leading-relaxed p-12 w-[794px] min-w-[794px] max-w-[794px] min-h-[1123px] mx-auto box-border flex flex-col justify-between">
      <div>
        {/* Soft Nordic Header */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 mb-6 flex flex-row justify-between items-start gap-4">
          <div>
            {quote.branding.logoUrl && (
              <img
                src={quote.branding.logoUrl}
                alt="Logo"
                style={{ width: `${quote.branding.logoWidth}px` }}
                className="max-h-16 object-contain mb-3"
              />
            )}
            <h1 className="text-lg font-bold text-neutral-900">{quote.from.name}</h1>
            <p className="text-neutral-500 text-[11px]">{quote.from.address} · {quote.from.cityStateZip}</p>
          </div>

          <div className="text-right">
            <span
              className="inline-block px-3 py-1 rounded-full text-white text-[10px] font-mono uppercase tracking-widest font-semibold mb-2"
              style={{ backgroundColor: accent }}
            >
              {quote.meta.title || t.quote}
            </span>
            <p className="text-sm font-mono font-bold text-neutral-900">#{quote.meta.quoteNumber}</p>
            <p className="text-neutral-400 font-mono text-[11px]">{quote.meta.issueDate}</p>
          </div>
        </div>

        {/* Client Box */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 mb-6">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">{t.to}</span>
          <p className="text-base font-bold text-neutral-900">{quote.to.name}</p>
          <div className="text-neutral-500 text-[11px] mt-1 space-y-0.5">
            <p>{quote.to.address}, {quote.to.cityStateZip}</p>
            <p>{quote.to.email} · {quote.to.phone}</p>
          </div>
        </div>

        {/* Rounded Items Container */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 overflow-hidden mb-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">{t.description}</th>
                <th className="py-3 px-4 text-right w-16">{t.quantity}</th>
                <th className="py-3 px-4 text-right w-24">{t.rate}</th>
                <th className="py-3 px-4 text-right w-28">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {quote.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="py-3.5 px-4 font-mono text-neutral-400">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-neutral-900">{item.description}</p>
                    {item.details && <p className="text-[11px] text-neutral-500 mt-0.5">{item.details}</p>}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-neutral-600">{item.quantity}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-neutral-600">{formatMoney(item.rate, quote.currency)}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900">
                    {formatMoney(item.amount, quote.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Notes */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-3">
            {quote.payment.notes && (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">{t.notes}</span>
                <p className="text-neutral-600 text-[11px] whitespace-pre-line">{quote.payment.notes}</p>
              </div>
            )}
            {quote.payment.terms && (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">{t.termsAndConditions}</span>
                <p className="text-neutral-500 text-[11px] whitespace-pre-line">{quote.payment.terms}</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 text-neutral-500">
              <span className="font-sans">{t.subtotal}</span>
              <span>{formatMoney(quote.financials.subtotal, quote.currency)}</span>
            </div>
            {quote.financials.discountAmount > 0 && (
              <div className="flex justify-between py-1 text-emerald-600">
                <span className="font-sans">{t.discount}</span>
                <span>-{formatMoney(quote.financials.discountAmount, quote.currency)}</span>
              </div>
            )}
            {quote.financials.taxes.map(tax => (
              <div key={tax.id} className="flex justify-between py-1 text-neutral-500">
                <span className="font-sans">{tax.name}</span>
                <span>{formatMoney(tax.amount, quote.currency)}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 border-t border-neutral-100 font-bold text-base text-neutral-900 mt-2">
              <span className="font-sans">{t.total}</span>
              <span style={{ color: accent }}>{formatMoney(quote.financials.total, quote.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {quote.signature.enabled && (
        <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 mt-auto flex justify-between items-end">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">{t.authorizedSignature}</span>
            {quote.signature.type === 'drawn' && quote.signature.dataUrl ? (
              <img src={quote.signature.dataUrl} alt="Signature" className="h-10 object-contain" />
            ) : (
              <p className="font-serif italic text-base text-neutral-900 py-1">{quote.signature.typedName || quote.from.name}</p>
            )}
            <div className="w-40 border-b border-neutral-300 pt-1" />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">{t.signatureDate}</span>
            <p className="font-mono text-xs">{quote.signature.signedDate}</p>
          </div>
        </div>
      )}
    </div>
  );
};
