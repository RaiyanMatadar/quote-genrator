import type { LineItem, TaxItem, Financials } from '../types/quote';
import { getCurrency } from '../data/currencies';

export function roundTo(num: number, decimals: number = 2): number {
  if (isNaN(num) || !isFinite(num)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

export function calculateLineAmount(quantity: number, rate: number): number {
  const safeQ = Math.max(0, isNaN(quantity) ? 0 : quantity);
  const safeR = Math.max(0, isNaN(rate) ? 0 : rate);
  return roundTo(safeQ * safeR, 2);
}

export function computeFinancials(
  items: LineItem[],
  discountType: 'percentage' | 'fixed',
  discountValue: number,
  taxes: TaxItem[],
  shipping: number,
  amountPaid: number
): Financials {
  // 1. Subtotal
  const subtotal = roundTo(
    items.reduce((sum, item) => sum + (isNaN(item.amount) ? 0 : item.amount || 0), 0),
    2
  );

  // 2. Discount with strict validation
  let discountAmount = 0;
  if (discountType === 'percentage') {
    const safePercent = Math.min(100, Math.max(0, discountValue || 0));
    discountAmount = roundTo(subtotal * (safePercent / 100), 2);
  } else {
    discountAmount = roundTo(Math.min(subtotal, Math.max(0, discountValue || 0)), 2);
  }

  // 3. Taxable Base (supports per-item taxable toggle)
  const hasTaxableFlagging = items.some((i) => i.isTaxable !== undefined);
  let taxableSubtotal = subtotal;
  if (hasTaxableFlagging && items.some((i) => !i.isTaxable)) {
    const rawTaxableItemsSum = items
      .filter((i) => i.isTaxable)
      .reduce((sum, i) => sum + (i.amount || 0), 0);
    const proportion = subtotal > 0 ? rawTaxableItemsSum / subtotal : 0;
    taxableSubtotal = Math.max(0, rawTaxableItemsSum - discountAmount * proportion);
  } else {
    taxableSubtotal = Math.max(0, subtotal - discountAmount);
  }

  // 4. Taxes
  const calculatedTaxes: TaxItem[] = (taxes || []).map((tax) => {
    const rate = Math.max(0, tax.rate || 0);
    const amount = roundTo(taxableSubtotal * (rate / 100), 2);
    return {
      ...tax,
      amount
    };
  });

  const totalTaxAmount = roundTo(
    calculatedTaxes.reduce((sum, t) => sum + t.amount, 0),
    2
  );

  // 5. Total
  const safeShipping = Math.max(0, shipping || 0);
  const total = roundTo(
    Math.max(0, subtotal - discountAmount + totalTaxAmount + safeShipping),
    2
  );

  // 6. Balance Due
  const safePaid = Math.max(0, amountPaid || 0);
  const balanceDue = roundTo(Math.max(0, total - safePaid), 2);

  return {
    subtotal,
    discountType,
    discountValue: discountValue || 0,
    discountAmount,
    taxes: calculatedTaxes,
    shipping: safeShipping,
    total,
    amountPaid: safePaid,
    balanceDue
  };
}

export function formatMoney(amount: number, currencyCode: string): string {
  const currency = getCurrency(currencyCode);
  const safeAmount = isNaN(amount) ? 0 : amount;

  try {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces
    }).format(safeAmount);

    if (currency.symbolPosition === 'suffix') {
      return `${formattedNumber} ${currency.symbol}`;
    }
    return `${currency.symbol}${formattedNumber}`;
  } catch {
    return `${currency.symbol}${safeAmount.toFixed(currency.decimalPlaces)}`;
  }
}
