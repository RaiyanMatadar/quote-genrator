import React from 'react';
import type { QuoteData } from '../../../types/quote';
import { formatMoney } from '../../../utils/calculations';
import { getTranslation } from '../../../data/translations';

interface TemplateProps {
  quote: QuoteData;
}

export const CorporateTemplate: React.FC<TemplateProps> = ({ quote }) => {
  const t = getTranslation(quote.language);
  const accent = quote.branding.accentColor || '#171717';

  return (
    <div className="text-neutral-900 bg-white font-sans text-xs leading-relaxed p-12 w-[794px] min-w-[794px] max-w-[794px] min-h-[1123px] mx-auto box-border flex flex-col justify-between shadow-xs">
      <div>
        {/* Solid Header Banner */}
        <div
          className="p-6 rounded-t-md text-white mb-8 flex flex-row justify-between items-center gap-4"
          style={{ backgroundColor: accent }}
        >
          <div className="flex items-center gap-4">
            {quote.branding.logoUrl && (
              <div className="bg-white p-2 rounded max-h-16 flex items-center justify-center">
                <img
                  src={quote.branding.logoUrl}
                  alt="Company Logo"
                  style={{ width: `${Math.min(quote.branding.logoWidth, 140)}px` }}
                  className="max-h-12 object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-tight">{quote.from.name || 'Your Company Name'}</h1>
              <p className="text-white/80 text-[11px]">{quote.from.email || quote.from.phone}</p>
            </div>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-black uppercase tracking-wider">{quote.meta.title || t.quote}</h2>
            <p className="font-mono text-xs text-white/90 font-medium">#{quote.meta.quoteNumber}</p>
          </div>
        </div>

        {/* Meta Bar */}
        <div className="grid grid-cols-4 gap-4 p-3 bg-neutral-100 rounded-md font-mono text-[11px] mb-8">
          <div>
            <span className="text-neutral-500 font-sans block text-[10px] uppercase">{t.date}</span>
            <span className="font-semibold">{quote.meta.issueDate}</span>
          </div>
          <div>
            <span className="text-neutral-500 font-sans block text-[10px] uppercase">{t.validUntil}</span>
            <span className="font-semibold">{quote.meta.validUntil || 'Net 30'}</span>
          </div>
          <div>
            <span className="text-neutral-500 font-sans block text-[10px] uppercase">{t.poNumber}</span>
            <span className="font-semibold">{quote.meta.poNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-neutral-500 font-sans block text-[10px] uppercase">{t.total}</span>
            <span className="font-bold text-neutral-900">{formatMoney(quote.financials.total, quote.currency)}</span>
          </div>
        </div>

        {/* Two Column Addresses */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="p-4 rounded-md border border-neutral-200 bg-neutral-50/50">
            <span className="text-[10px] font-mono uppercase font-bold text-neutral-500 block mb-1">
              {t.from}
            </span>
            <p className="font-bold text-sm text-neutral-900">{quote.from.name}</p>
            <div className="text-neutral-600 text-[11px] mt-1 space-y-0.5">
              <p>{quote.from.address}</p>
              <p>{quote.from.cityStateZip}</p>
              <p>{quote.from.phone}</p>
              {quote.from.taxId && <p className="font-mono text-neutral-700">{t.taxId}: {quote.from.taxId}</p>}
            </div>
          </div>

          <div className="p-4 rounded-md border border-neutral-200 bg-neutral-50/50">
            <span className="text-[10px] font-mono uppercase font-bold text-neutral-500 block mb-1">
              {t.to}
            </span>
            <p className="font-bold text-sm text-neutral-900">{quote.to.name || 'Client Name'}</p>
            <div className="text-neutral-600 text-[11px] mt-1 space-y-0.5">
              <p>{quote.to.address}</p>
              <p>{quote.to.cityStateZip}</p>
              <p>{quote.to.email}</p>
              <p>{quote.to.phone}</p>
              {quote.to.taxId && <p className="font-mono text-neutral-700">{t.taxId}: {quote.to.taxId}</p>}
            </div>
          </div>
        </div>

        {/* Corporate Styled Table */}
        <div className="mb-8 border border-neutral-200 rounded-md overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-800 text-white font-mono text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-10">#</th>
                <th className="py-2.5 px-3">{t.description}</th>
                <th className="py-2.5 px-3 text-right w-16">{t.quantity}</th>
                <th className="py-2.5 px-3 text-right w-24">{t.rate}</th>
                <th className="py-2.5 px-3 text-right w-28">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {quote.items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/60'}>
                  <td className="py-3 px-3 font-mono text-neutral-400">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-neutral-900">{item.description}</p>
                    {item.details && <p className="text-[11px] text-neutral-500 mt-0.5">{item.details}</p>}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    {item.quantity} {item.unit && <span className="text-neutral-400 text-[10px]">{item.unit}</span>}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">{formatMoney(item.rate, quote.currency)}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900">
                    {formatMoney(item.amount, quote.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Corporate Financial Box */}
        <div className="flex flex-row justify-between items-start gap-8 mb-8">
          <div className="w-1/2 space-y-4">
            {quote.payment.notes && (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">
                  {t.notes}
                </span>
                <p className="text-neutral-600 text-[11px] whitespace-pre-line">{quote.payment.notes}</p>
              </div>
            )}
            {quote.payment.terms && (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">
                  {t.termsAndConditions}
                </span>
                <p className="text-neutral-500 text-[11px] whitespace-pre-line">{quote.payment.terms}</p>
              </div>
            )}
          </div>

          <div className="w-2/5 p-4 rounded-md bg-neutral-50 border border-neutral-200 space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 text-neutral-600">
              <span className="font-sans">{t.subtotal}:</span>
              <span>{formatMoney(quote.financials.subtotal, quote.currency)}</span>
            </div>

            {quote.financials.discountAmount > 0 && (
              <div className="flex justify-between py-1 text-emerald-600">
                <span className="font-sans">{t.discount}:</span>
                <span>-{formatMoney(quote.financials.discountAmount, quote.currency)}</span>
              </div>
            )}

            {quote.financials.taxes.map(tax => (
              <div key={tax.id} className="flex justify-between py-1 text-neutral-600">
                <span className="font-sans">{tax.name} ({tax.rate}%):</span>
                <span>{formatMoney(tax.amount, quote.currency)}</span>
              </div>
            ))}

            {quote.financials.shipping > 0 && (
              <div className="flex justify-between py-1 text-neutral-600">
                <span className="font-sans">{t.shipping}:</span>
                <span>{formatMoney(quote.financials.shipping, quote.currency)}</span>
              </div>
            )}

            <div
              className="flex justify-between py-2 border-t-2 font-bold text-sm text-white px-2 rounded mt-2"
              style={{ backgroundColor: accent }}
            >
              <span className="font-sans">{t.total}:</span>
              <span>{formatMoney(quote.financials.total, quote.currency)}</span>
            </div>

            {quote.financials.amountPaid > 0 && (
              <div className="flex justify-between py-1 text-neutral-700 font-bold border-t border-neutral-200 mt-2">
                <span className="font-sans">{t.balanceDue}:</span>
                <span>{formatMoney(quote.financials.balanceDue, quote.currency)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Corporate Signature */}
      {quote.signature.enabled && (
        <div className="pt-6 border-t border-neutral-300 mt-auto">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 block">
                {t.authorizedSignature}
              </span>
              {quote.signature.type === 'drawn' && quote.signature.dataUrl ? (
                <img src={quote.signature.dataUrl} alt="Signature" className="h-12 object-contain" />
              ) : (
                <p className="font-serif italic text-lg text-neutral-900 py-1">
                  {quote.signature.typedName || quote.from.name}
                </p>
              )}
              <div className="w-56 border-b border-neutral-900 pt-1" />
              <p className="text-xs font-semibold text-neutral-800 mt-1">{quote.signature.signerTitle || 'Executive Officer'}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 block">{t.signatureDate}</span>
              <p className="font-mono text-xs">{quote.signature.signedDate}</p>
              <div className="w-32 border-b border-neutral-900 pt-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
