import React, { useState } from 'react';
import type { QuoteData } from '../../types/quote';
import { TEMPLATES, ACCENT_COLORS } from '../../data/templates';
import { ALL_CURRENCIES } from '../../data/currencies';
import { SUPPORTED_LANGUAGES } from '../../data/translations';
import {
  Download,
  Printer,
  FilePlus,
  Copy,
  History,
  FileDown,
  FileUp,
  Palette,
  Globe,
  Coins,
  Layout,
  Check
} from 'lucide-react';
import { downloadQuotePDF, printQuote } from '../../utils/pdfExporter';
import {
  exportQuoteAsJSON,
  importQuoteFromJSON,
  saveToHistory,
  getHistoryList,
  loadQuoteFromHistory,
  createDefaultQuote
} from '../../utils/storage';

interface ToolbarProps {
  quote: QuoteData;
  onChange: (updated: QuoteData) => void;
  onReset: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ quote, onChange, onReset }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState(getHistoryList());

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      saveToHistory(quote);
      await downloadQuotePDF('quotation-print-target', quote.meta.quoteNumber);
    } catch (err) {
      console.error(err);
      alert('Unable to generate PDF. You can also click the Print button to save as PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDuplicate = () => {
    const duplicated: QuoteData = {
      ...quote,
      id: 'quote-' + Date.now(),
      meta: {
        ...quote.meta,
        quoteNumber: `${quote.meta.quoteNumber}-COPY`
      }
    };
    saveToHistory(quote);
    onChange(duplicated);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const imported = await importQuoteFromJSON(e.target.files[0]);
        onChange(imported);
      } catch (err: any) {
        alert(err.message || 'Failed to import backup JSON file.');
      }
    }
  };

  const openHistory = () => {
    setSavedDrafts(getHistoryList());
    setShowHistoryModal(true);
  };

  const restoreDraft = (id: string) => {
    const loaded = loadQuoteFromHistory(id);
    if (loaded) {
      onChange(loaded);
      setShowHistoryModal(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-xs space-y-3 no-print">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Controls: Template, Color, Currency, Language */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Template Selector */}
          <div className="relative flex items-center">
            <Layout className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
            <select
              value={quote.branding.templateId}
              onChange={(e) =>
                onChange({
                  ...quote,
                  branding: { ...quote.branding, templateId: e.target.value as any }
                })
              }
              className="text-xs font-medium pl-8 pr-7 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md cursor-pointer focus:outline-hidden focus:border-neutral-900 appearance-none text-neutral-800"
            >
              {TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </option>
              ))}
            </select>
          </div>

          {/* Accent Color Picker */}
          <div className="flex items-center gap-1 bg-neutral-50 border border-neutral-200 rounded-md p-1">
            <Palette className="w-3.5 h-3.5 text-neutral-400 ml-1" />
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() =>
                  onChange({
                    ...quote,
                    branding: { ...quote.branding, accentColor: color.hex }
                  })
                }
                title={color.name}
                className="w-4 h-4 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                style={{ backgroundColor: color.hex }}
              >
                {quote.branding.accentColor === color.hex && (
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                )}
              </button>
            ))}
          </div>

          {/* Currency Selector */}
          <div className="relative flex items-center">
            <Coins className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
            <select
              value={quote.currency}
              onChange={(e) => onChange({ ...quote, currency: e.target.value })}
              className="text-xs font-mono font-medium pl-8 pr-7 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md cursor-pointer focus:outline-hidden focus:border-neutral-900 appearance-none text-neutral-800"
            >
              {ALL_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
            <select
              value={quote.language}
              onChange={(e) => onChange({ ...quote, language: e.target.value })}
              className="text-xs font-medium pl-8 pr-7 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md cursor-pointer focus:outline-hidden focus:border-neutral-900 appearance-none text-neutral-800"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Actions: Drafts, New, Duplicate, Print, Download */}
        <div className="flex items-center gap-2">
          {/* History */}
          <button
            type="button"
            onClick={openHistory}
            title="Saved Quotation Drafts"
            className="px-2.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md border border-neutral-200 flex items-center gap-1 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* New Quote */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Create a new quote? (Current draft is saved in History)')) {
                saveToHistory(quote);
                onReset();
              }
            }}
            title="Start New Quote"
            className="px-2.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md border border-neutral-200 flex items-center gap-1 transition-colors"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={handleDuplicate}
            title="Duplicate Current Quote"
            className="px-2.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md border border-neutral-200 flex items-center gap-1 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Duplicate</span>
          </button>

          {/* Export JSON Backup */}
          <button
            type="button"
            onClick={() => exportQuoteAsJSON(quote)}
            title="Export JSON Backup"
            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md border border-neutral-200 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
          </button>

          {/* Import JSON Backup */}
          <label
            title="Import JSON Backup"
            className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md border border-neutral-200 cursor-pointer transition-colors"
          >
            <FileUp className="w-3.5 h-3.5" />
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          {/* Print */}
          <button
            type="button"
            onClick={printQuote}
            className="px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* Primary Download CTA */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-semibold text-sm text-neutral-900 flex items-center gap-2">
                <History className="w-4 h-4" /> Saved Quotation Drafts
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-neutral-400 hover:text-neutral-900 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 text-xs">
              {savedDrafts.length === 0 ? (
                <p className="text-neutral-400 text-center py-6">No previous drafts saved yet.</p>
              ) : (
                savedDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="py-2.5 flex items-center justify-between hover:bg-neutral-50 px-2 rounded cursor-pointer transition-colors"
                    onClick={() => restoreDraft(draft.id)}
                  >
                    <div>
                      <p className="font-mono font-semibold text-neutral-900">{draft.quoteNumber}</p>
                      <p className="text-neutral-500 text-[11px]">{draft.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-medium text-neutral-900">
                        {draft.currency} {draft.total}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {new Date(draft.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
