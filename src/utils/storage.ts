import type { QuoteData } from '../types/quote';
import { computeFinancials } from './calculations';

const CURRENT_QUOTE_KEY = 'quote_current_draft';
const HISTORY_LIST_KEY = 'quote_history_list';

export interface SavedDraftSummary {
  id: string;
  quoteNumber: string;
  clientName: string;
  total: number;
  currency: string;
  lastUpdated: string;
}

export function createDefaultQuote(): QuoteData {
  const today = '2026-11-24';
  const validDate = '2026-12-24';

  const defaultItems = [
    {
      id: 'item-1',
      description: 'Brand Identity & Design System',
      details: 'Comprehensive typography, color palette, logo lockups, and design tokens specification.',
      quantity: 1,
      unit: 'project',
      rate: 1850,
      amount: 1850,
      isTaxable: true
    },
    {
      id: 'item-2',
      description: 'Web Application Development',
      details: 'Responsive front-end implementation with high performance, accessibility, and modern framework integration.',
      quantity: 40,
      unit: 'hrs',
      rate: 85,
      amount: 3400,
      isTaxable: true
    },
    {
      id: 'item-3',
      description: 'Cloud Infrastructure & Deployment Setup',
      details: 'CI/CD pipeline configuration, edge CDN routing, SSL certification, and monitoring.',
      quantity: 1,
      unit: 'setup',
      rate: 750,
      amount: 750,
      isTaxable: false
    }
  ];

  const defaultFinancials = computeFinancials(
    defaultItems,
    'percentage',
    5,
    [{ id: 'tax-1', name: 'Tax / VAT', rate: 10, amount: 0 }],
    0,
    1500
  );

  return {
    id: 'quote-' + Date.now(),
    lastUpdated: new Date().toISOString(),
    currency: 'USD',
    language: 'en',
    meta: {
      title: 'QUOTE',
      quoteNumber: 'Q-2026-001',
      issueDate: today,
      validUntil: validDate,
      poNumber: 'PO-9842',
      customFields: []
    },
    branding: {
      logoUrl: '',
      logoWidth: 150,
      logoAlignment: 'left',
      templateId: 'minimalist',
      accentColor: '#171717'
    },
    from: {
      name: 'Acme Studio & Labs',
      email: 'hello@acmestudio.design',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace, Suite 400',
      cityStateZip: 'San Francisco, CA 94107',
      taxId: 'US-EIN-94-1234567',
      customFields: []
    },
    to: {
      name: 'Nexus Horizon Corp',
      email: 'procurement@nexushorizon.io',
      phone: '+1 (555) 876-5432',
      address: '100 Innovation Way, Building 4',
      cityStateZip: 'Austin, TX 78701',
      taxId: 'TX-VAT-884920',
      hasShippingAddress: false,
      shipToAddress: '',
      customFields: []
    },
    items: defaultItems,
    financials: defaultFinancials,
    payment: {
      bankName: 'Silicon Valley National Bank',
      accountName: 'Acme Studio Design Inc.',
      accountNumber: '•••• •••• 9821',
      ibanSwift: 'SVNBUS33XXX',
      paymentLink: 'https://pay.acmestudio.design/q/001',
      notes: 'Thank you for considering Acme Studio! We are excited about the prospect of partnering on this initiative.',
      terms: '• Quote valid for 30 calendar days from issue date.\n• 30% advance deposit required prior to project kickoff.\n• Deliverables will be released upon full settlement of balance due.'
    },
    signature: {
      enabled: true,
      type: 'typed',
      typedName: 'Alex Morgan',
      signedDate: today,
      signerTitle: 'Head of Accounts',
      declarationText: 'By signing above, the client confirms acceptance of the scope of work, fees, and terms outlined in this quotation.'
    }
  };
}

export function saveCurrentQuote(quote: QuoteData): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(CURRENT_QUOTE_KEY, JSON.stringify(quote));
  } catch (e) {
    console.warn('Unable to save quote to localStorage:', e);
  }
}

export function loadCurrentQuote(): QuoteData {
  if (typeof window === 'undefined' || !window.localStorage) return createDefaultQuote();
  try {
    const raw = localStorage.getItem(CURRENT_QUOTE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.items) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse quote from localStorage:', e);
  }
  return createDefaultQuote();
}

export function saveToHistory(quote: QuoteData): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const history = getHistoryList();
    const summary: SavedDraftSummary = {
      id: quote.id,
      quoteNumber: quote.meta.quoteNumber || 'Untitled',
      clientName: quote.to.name || 'Unnamed Client',
      total: quote.financials.total,
      currency: quote.currency,
      lastUpdated: new Date().toISOString()
    };

    const filtered = history.filter(h => h.id !== quote.id);
    const updated = [summary, ...filtered].slice(0, 20);

    localStorage.setItem(HISTORY_LIST_KEY, JSON.stringify(updated));
    localStorage.setItem(`quote_draft_${quote.id}`, JSON.stringify(quote));
  } catch (e) {
    console.warn('Failed to save to history:', e);
  }
}

export function getHistoryList(): SavedDraftSummary[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(HISTORY_LIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load history list:', e);
  }
  return [];
}

export function loadQuoteFromHistory(id: string): QuoteData | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(`quote_draft_${id}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load quote from history:', e);
  }
  return null;
}

export function deleteQuoteFromHistory(id: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const history = getHistoryList().filter((h) => h.id !== id);
    localStorage.setItem(HISTORY_LIST_KEY, JSON.stringify(history));
    localStorage.removeItem(`quote_draft_${id}`);
  } catch (e) {
    console.warn('Failed to delete quote from history:', e);
  }
}
