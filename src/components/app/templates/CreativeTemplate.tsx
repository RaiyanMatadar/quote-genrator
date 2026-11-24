import React from 'react';
import type { QuoteData } from '../../../types/quote';
import { formatMoney } from '../../../utils/calculations';
import { getTranslation } from '../../../data/translations';

interface TemplateProps {
  quote: QuoteData;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ quote }) => {
  const t = getTranslation(quote.language);
  const accent = quote.branding.accentColor || '#7928ca';

  return (
    <div className="text-neutral-900 bg-white font-sans text-xs leading-relaxed p-12 w-[794px] min-w-[794px] max-w-[794px] min-h-[1123px] mx-auto box-border flex flex-col justify-between">
      <div>
        {/* Creative Top Accent Line */}
        <div className="h-2 w-full rounded-full mb-8" style={{ backgroundColor: accent }} />

        {/* Header */}
        <div className="flex flex-row justify-between items-start gap-6 pb-6">
          <div>
            {quote.branding.logoUrl && (
              <img
                src={quote.branding.logoUrl}
                alt="Logo"
                style={{ width: `${quote.branding.logoWidth}px` }}
                className="max-h-20 object-contain mb-3"
              />
            )}
            <h1 className="text-xl font-black tracking-tight text-neutral-950">{quote.from.name}</h1>
            <p className="text-neutral-500 text-[11px]">{quote.from.email} · {quote.from.phone}</p>
          </div>

          <div className="text-right bg-neutral-900 text-white p-4 rounded-xl min-w-48">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
              {quote.meta.title || t.quote}
            </span>
            <p className="text-lg font-mono font-bold">{quote.meta.quoteNumber}</p>
            <p className="text-[11px] text-neutral-300 font-mono mt-1">{t.date}: {quote.meta.issueDate}</p>
          </div>
        </div>

        {/* Addresses in Pill Cards */}
        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">{t.from}</span>
            <p className="font-bold text-neutral-900">{quote.from.name}</p>
            <p className="text-neutral-500 text-[11px]">{quote.from.address}, {quote.from.cityStateZip}</p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">{t.to}</span>
            <p className="font-bold text-neutral-900">{quote.to.name}</p>
            <p className="text-neutral-500 text-[11px]">{quote.to.address}, {quote.to.cityStateZip}</p>
          </div>
        </div>

        {/* Creative Items Table */}
        <div className="my-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-neutral-900 text-neutral-900 font-mono text-[11px] uppercase font-bold">
                <th className="py-2.5 px-2 w-8">#</th>
                <th className="py-2.5 px-2">{t.description}</th>
                <th className="py-2.5 px-2 text-right w-16">{t.quantity}</th>
                <th className="py-2.5 px-2 text-right w-24">{t.rate}</th>
                <th className="py-2.5 px-2 text-right w-28">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {quote.items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-neutral-50/50">
                  <td className="py-3 px-2 font-mono text-neutral-400">{idx + 1}</td>
                  <td className="py-3 px-2">
                    <p className="font-bold text-neutral-900">{item.description}</p>
                    {item.details && <p className="text-[11px] text-neutral-500 mt-0.5">{item.details}</p>}
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-medium">
                    {item.quantity} {item.unit && <span className="text-neutral-400 text-[10px]">{item.unit}</span>}
                  </td>
                  <td className="py-3 px-2 text-right font-mono">{formatMoney(item.rate, quote.currency)}</td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-neutral-900">
                    {formatMoney(item.amount, quote.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Details & Totals */}
        <div className="flex flex-row justify-between items-start gap-8 pt-6 border-t-2 border-neutral-900">
          <div className="w-1/2 space-y-3">
            {quote.payment.notes && (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-0.5">{t.notes}</span>
                <p className="text-neutral-600 text-[11px] whitespace-pre-line">{quote.payment.notes}</p>
              </div>
            )}
            {quote.payment.terms && (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-0.5">{t.termsAndConditions}</span>
                <p className="text-neutral-500 text-[11px] whitespace-pre-line">{quote.payment.terms}</p>
              </div>
            )}
          </div>

          <div className="w-2/5 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between py-1 text-neutral-600">
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
              <div key={tax.id} className="flex justify-between py-1 text-neutral-600">
                <span className="font-sans">{tax.name}</span>
                <span>{formatMoney(tax.amount, quote.currency)}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 border-t-2 border-neutral-900 font-black text-base text-neutral-950">
              <span className="font-sans">{t.total}</span>
              <span style={{ color: accent }}>{formatMoney(quote.financials.total, quote.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {quote.signature.enabled && (
        <div className="pt-6 border-t border-neutral-200 mt-auto">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">{t.authorizedSignature}</span>
              {quote.signature.type === 'drawn' && quote.signature.dataUrl ? (
                <img src={quote.signature.dataUrl} alt="Signature" className="h-12 object-contain" />
              ) : (
                <p className="font-serif italic text-lg text-neutral-900">{quote.signature.typedName || quote.from.name}</p>
              )}
              <div className="w-48 border-b-2 border-neutral-900 pt-1" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">{t.signatureDate}</span>
              <p className="font-mono text-xs font-bold">{quote.signature.signedDate}</p>
              <div className="w-32 border-b-2 border-neutral-900 pt-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
