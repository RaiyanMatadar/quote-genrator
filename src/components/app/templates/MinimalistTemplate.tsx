import React from 'react';
import type { QuoteData } from '../../../types/quote';
import { formatMoney } from '../../../utils/calculations';
import { getTranslation } from '../../../data/translations';

interface TemplateProps {
  quote: QuoteData;
}

export const MinimalistTemplate: React.FC<TemplateProps> = ({ quote }) => {
  const t = getTranslation(quote.language);
  const accent = quote.branding.accentColor || '#171717';

  return (
    <div className="text-neutral-900 bg-white font-sans text-xs leading-relaxed p-8 sm:p-12 w-full max-w-[210mm] mx-auto min-h-[297mm] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-neutral-200">
          <div>
            {quote.branding.logoUrl ? (
              <div
                className={`mb-4 flex ${
                  quote.branding.logoAlignment === 'center'
                    ? 'justify-center'
                    : quote.branding.logoAlignment === 'right'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <img
                  src={quote.branding.logoUrl}
                  alt="Company Logo"
                  style={{ width: `${quote.branding.logoWidth}px` }}
                  className="max-h-24 object-contain"
                />
              </div>
            ) : null}
            <h1 className="text-lg font-semibold tracking-tight text-neutral-950">{quote.from.name || 'Your Company Name'}</h1>
            <div className="text-neutral-500 text-[11px] space-y-0.5 mt-1">
              {quote.from.address && <p>{quote.from.address}</p>}
              {quote.from.cityStateZip && <p>{quote.from.cityStateZip}</p>}
              {quote.from.email && <p>{quote.from.email}</p>}
              {quote.from.phone && <p>{quote.from.phone}</p>}
              {quote.from.taxId && <p className="font-mono text-neutral-600">{t.taxId}: {quote.from.taxId}</p>}
            </div>
          </div>

          <div className="text-left sm:text-right">
            <h2
              className="text-2xl font-bold tracking-tight mb-2 uppercase"
              style={{ color: accent }}
            >
              {quote.meta.title || t.quote}
            </h2>
            <div className="space-y-1 text-[11px] font-mono text-neutral-600">
              <p><span className="text-neutral-400 font-sans">{t.quoteNumber}:</span> <span className="font-semibold text-neutral-900">{quote.meta.quoteNumber}</span></p>
              <p><span className="text-neutral-400 font-sans">{t.date}:</span> {quote.meta.issueDate}</p>
              {quote.meta.validUntil && (
                <p><span className="text-neutral-400 font-sans">{t.validUntil}:</span> {quote.meta.validUntil}</p>
              )}
              {quote.meta.poNumber && (
                <p><span className="text-neutral-400 font-sans">{t.poNumber}:</span> {quote.meta.poNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Bill To & Ship To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-neutral-100">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              {t.to}
            </span>
            <p className="font-semibold text-sm text-neutral-900">{quote.to.name || 'Client Name'}</p>
            <div className="text-neutral-500 text-[11px] space-y-0.5 mt-0.5">
              {quote.to.address && <p>{quote.to.address}</p>}
              {quote.to.cityStateZip && <p>{quote.to.cityStateZip}</p>}
              {quote.to.email && <p>{quote.to.email}</p>}
              {quote.to.phone && <p>{quote.to.phone}</p>}
              {quote.to.taxId && <p className="font-mono">{t.taxId}: {quote.to.taxId}</p>}
            </div>
          </div>

          {quote.to.hasShippingAddress && quote.to.shipToAddress && (
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                {t.shipTo}
              </span>
              <p className="text-neutral-600 text-[11px] whitespace-pre-line">{quote.to.shipToAddress}</p>
            </div>
          )}
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-300 text-neutral-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-2 pr-2 w-8">#</th>
                <th className="py-2 px-2">{t.description}</th>
                <th className="py-2 px-2 text-right w-16">{t.quantity}</th>
                <th className="py-2 px-2 text-right w-24">{t.rate}</th>
                <th className="py-2 pl-2 text-right w-28">{t.amount}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {quote.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="py-3 pr-2 font-mono text-[11px] text-neutral-400">{idx + 1}</td>
                  <td className="py-3 px-2">
                    <p className="font-medium text-neutral-900">{item.description || 'Item description'}</p>
                    {item.details && <p className="text-[11px] text-neutral-500 mt-0.5">{item.details}</p>}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-neutral-700">
                    {item.quantity} {item.unit && <span className="text-[10px] text-neutral-400">{item.unit}</span>}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-neutral-700">
                    {formatMoney(item.rate, quote.currency)}
                  </td>
                  <td className="py-3 pl-2 text-right font-mono font-medium text-neutral-900">
                    {formatMoney(item.amount, quote.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financials & Calculation Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 pb-8 border-t border-neutral-200">
          {/* Notes & Terms on Left */}
          <div className="w-full sm:w-1/2 space-y-4">
            {quote.payment.notes && (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  {t.notes}
                </span>
                <p className="text-neutral-600 text-[11px] whitespace-pre-line leading-relaxed">{quote.payment.notes}</p>
              </div>
            )}

            {quote.payment.terms && (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  {t.termsAndConditions}
                </span>
                <p className="text-neutral-500 text-[11px] whitespace-pre-line leading-relaxed">{quote.payment.terms}</p>
              </div>
            )}

            {(quote.payment.bankName || quote.payment.accountNumber || quote.payment.paymentLink) && (
              <div className="p-3 bg-neutral-50 rounded-md border border-neutral-100 text-[11px] space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 block mb-1">
                  {t.paymentInstructions}
                </span>
                {quote.payment.bankName && <p><span className="text-neutral-400">{t.bankName}:</span> {quote.payment.bankName}</p>}
                {quote.payment.accountNumber && <p><span className="text-neutral-400">{t.accountNumber}:</span> {quote.payment.accountNumber}</p>}
                {quote.payment.ibanSwift && <p><span className="text-neutral-400">{t.ibanSwift}:</span> {quote.payment.ibanSwift}</p>}
                {quote.payment.paymentLink && (
                  <p className="pt-1">
                    <span className="text-neutral-400">{t.payOnline}:</span>{' '}
                    <span className="text-blue-600 underline font-mono break-all">{quote.payment.paymentLink}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Totals Table on Right */}
          <div className="w-full sm:w-2/5 space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 text-neutral-600">
              <span className="font-sans">{t.subtotal}</span>
              <span>{formatMoney(quote.financials.subtotal, quote.currency)}</span>
            </div>

            {quote.financials.discountAmount > 0 && (
              <div className="flex justify-between py-1 text-emerald-600">
                <span className="font-sans">
                  {t.discount} {quote.financials.discountType === 'percentage' && `(${quote.financials.discountValue}%)`}
                </span>
                <span>-{formatMoney(quote.financials.discountAmount, quote.currency)}</span>
              </div>
            )}

            {quote.financials.taxes.map(tax => (
              <div key={tax.id} className="flex justify-between py-1 text-neutral-600">
                <span className="font-sans">{tax.name} ({tax.rate}%)</span>
                <span>{formatMoney(tax.amount, quote.currency)}</span>
              </div>
            ))}

            {quote.financials.shipping > 0 && (
              <div className="flex justify-between py-1 text-neutral-600">
                <span className="font-sans">{t.shipping}</span>
                <span>{formatMoney(quote.financials.shipping, quote.currency)}</span>
              </div>
            )}

            <div
              className="flex justify-between py-2 border-t-2 border-neutral-900 font-bold text-sm text-neutral-950 mt-2"
              style={{ borderTopColor: accent }}
            >
              <span className="font-sans">{t.total}</span>
              <span>{formatMoney(quote.financials.total, quote.currency)}</span>
            </div>

            {quote.financials.amountPaid > 0 && (
              <>
                <div className="flex justify-between py-1 text-neutral-500 text-[11px]">
                  <span className="font-sans">{t.amountPaid}</span>
                  <span>{formatMoney(quote.financials.amountPaid, quote.currency)}</span>
                </div>
                <div className="flex justify-between py-1 font-semibold text-neutral-900 border-t border-neutral-100">
                  <span className="font-sans">{t.balanceDue}</span>
                  <span>{formatMoney(quote.financials.balanceDue, quote.currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Signature & Acceptance Block */}
      {quote.signature.enabled && (
        <div className="pt-6 border-t border-neutral-200 mt-auto">
          {quote.signature.declarationText && (
            <p className="text-[10px] text-neutral-400 italic mb-4 max-w-lg">
              {quote.signature.declarationText}
            </p>
          )}

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                {t.authorizedSignature}
              </span>
              {quote.signature.type === 'drawn' && quote.signature.dataUrl ? (
                <div className="h-14 flex items-end">
                  <img src={quote.signature.dataUrl} alt="Signature" className="max-h-12 object-contain" />
                </div>
              ) : (
                <div className="h-10 flex items-end">
                  <span className="font-serif italic text-lg text-neutral-900">
                    {quote.signature.typedName || quote.from.name}
                  </span>
                </div>
              )}
              <div className="w-48 border-b border-neutral-400 pt-1" />
              <p className="text-[11px] font-medium text-neutral-800">{quote.signature.signerTitle || 'Authorized Representative'}</p>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                {t.signatureDate}
              </span>
              <p className="font-mono text-xs text-neutral-800">{quote.signature.signedDate || quote.meta.issueDate}</p>
              <div className="w-32 border-b border-neutral-400 pt-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
