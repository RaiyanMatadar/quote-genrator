export interface LineItem {
  id: string;
  description: string;
  details?: string;
  quantity: number;
  unit?: string;
  rate: number;
  amount: number;
  isTaxable: boolean;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface BusinessDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  taxId: string; // e.g. VAT, GST, EIN
  customFields: CustomField[];
}

export interface ClientDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  cityStateZip: string;
  taxId: string;
  shipToAddress?: string;
  hasShippingAddress: boolean;
  customFields: CustomField[];
}

export interface TaxItem {
  id: string;
  name: string; // e.g., VAT, GST, Sales Tax
  rate: number; // percentage
  amount: number;
}

export interface Financials {
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxes: TaxItem[];
  shipping: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
}

export interface DocumentMeta {
  title: string; // "QUOTE", "ESTIMATE", "PROPOSAL", "PROFORMA INVOICE"
  quoteNumber: string;
  issueDate: string;
  validUntil: string;
  poNumber: string;
  customFields: CustomField[];
}

export interface Branding {
  logoUrl?: string;
  logoWidth: number; // in pixels (e.g. 60 - 220)
  logoAlignment: 'left' | 'center' | 'right';
  templateId: 'minimalist' | 'corporate' | 'creative' | 'nordic' | 'compact';
  accentColor: string; // hex code
}

export interface SignatureData {
  enabled: boolean;
  type: 'drawn' | 'typed';
  dataUrl?: string; // canvas drawing data URL
  typedName?: string;
  signedDate?: string;
  signerTitle?: string;
  declarationText?: string;
}

export interface PaymentDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ibanSwift: string;
  paymentLink: string;
  notes: string;
  terms: string;
}

export interface QuoteData {
  id: string;
  lastUpdated: string;
  currency: string; // e.g. "USD", "EUR"
  language: string; // e.g. "en", "es"
  meta: DocumentMeta;
  branding: Branding;
  from: BusinessDetails;
  to: ClientDetails;
  items: LineItem[];
  financials: Financials;
  payment: PaymentDetails;
  signature: SignatureData;
}
