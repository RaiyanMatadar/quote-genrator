import React, { useState } from 'react';
import type { QuoteData } from '../../types/quote';
import { TEMPLATES, ACCENT_COLORS } from '../../data/templates';
import { ALL_CURRENCIES } from '../../data/currencies';
import { SUPPORTED_LANGUAGES } from '../../data/translations';
import type { SiteUiDictionary } from '../../data/uiTranslations';
import {
  Download,
  Printer,
  FilePlus,
  History,
  Palette,
  Check
} from 'lucide-react';
import { downloadQuotePDF, printQuote } from '../../utils/pdfExporter';
import {
  saveToHistory,
  getHistoryList,
  loadQuoteFromHistory
} from '../../utils/storage';
import { ModernModal } from '../ui/ModernModal';

interface ToolbarProps {
  quote: QuoteData;
  ui: SiteUiDictionary;
  siteLanguage: string;
  onSiteLanguageChange: (lang: string) => void;
  onChange: (updated: QuoteData) => void;
  onReset: () => void;
  onNotify?: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  quote,
  ui,
  siteLanguage,
  onSiteLanguageChange,
  onChange,
  onReset,
  onNotify
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState(getHistoryList());

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      saveToHistory(quote);
      await downloadQuotePDF('quotation-print-target', quote.meta.quoteNumber);
      if (onNotify) {
        onNotify('PDF downloaded successfully!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      if (onNotify) {
        onNotify(`Download failed: ${err.message || 'Please use Print button'}`, 'error');
      } else {
        alert(`Unable to download PDF: ${err.message || 'Error'}`);
      }
    } finally {
      setIsExporting(false);
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
      if (onNotify) {
        onNotify(`Restored draft ${loaded.meta.quoteNumber}`, 'info');
      }
    }
  };

  const confirmNewQuote = () => {
    saveToHistory(quote);
    onReset();
    setShowNewQuoteModal(false);
    if (onNotify) {
      onNotify('Created new quotation draft', 'info');
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 shadow-xs space-y-3 no-print transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Section: Template, Colors, Currency, Website Language */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Template Selector */}
          <select
            value={quote.branding.templateId}
            onChange={(e) =>
              onChange({
                ...quote,
                branding: { ...quote.branding, templateId: e.target.value as any }
              })
            }
            title={ui.template}
          >
            {TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.name}
              </option>
            ))}
          </select>

          {/* Accent Color Palette */}
          <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md p-1">
            <Palette className="w-3.5 h-3.5 text-neutral-400 ml-1 mr-0.5" />
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
                className="w-4 h-4 rounded-full transition-transform hover:scale-110 flex items-center justify-center shrink-0"
                style={{ backgroundColor: color.hex }}
              >
                {quote.branding.accentColor === color.hex && (
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                )}
              </button>
            ))}
          </div>

          {/* Currency Selector */}
          <select
            value={quote.currency}
            onChange={(e) => onChange({ ...quote, currency: e.target.value })}
            title={ui.currency}
            className="font-mono font-medium"
          >
            {ALL_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>

          {/* Website Interface Language Selector */}
          <select
            value={siteLanguage}
            onChange={(e) => onSiteLanguageChange(e.target.value)}
            title={ui.websiteLanguage}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName}
              </option>
            ))}
          </select>
        </div>

        {/* Right Section: Drafts, New, Print & Download */}
        <div className="flex flex-wrap items-center gap-2">
          {/* History */}
          <button
            type="button"
            onClick={openHistory}
            title={ui.savedDraftsTitle}
            className="px-2.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700 flex items-center gap-1 transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{ui.btnHistory}</span>
          </button>

          {/* New Quote (Replaced plain window.confirm with ModernModal) */}
          <button
            type="button"
            onClick={() => setShowNewQuoteModal(true)}
            title="Start New Quote"
            className="px-2.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700 flex items-center gap-1 transition-colors"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{ui.btnNew}</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={printQuote}
            className="px-3 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{ui.btnPrint}</span>
          </button>

          {/* Primary Download CTA */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="px-4 py-1.5 text-xs font-semibold text-white dark:text-neutral-900 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? ui.generatingPdf : ui.btnDownloadPdf}</span>
          </button>
        </div>
      </div>

      {/* Modern Confirmation Modal for New Quote (Replacing window.confirm) */}
      <ModernModal
        isOpen={showNewQuoteModal}
        title="Start a new quotation?"
        description="Your current quotation has been saved to History. Starting a new quote will reset the form fields."
        confirmLabel="Create New Quote"
        cancelLabel="Keep Editing"
        onConfirm={confirmNewQuote}
        onCancel={() => setShowNewQuoteModal(false)}
      />

      {/* Modern History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4" /> {ui.savedDraftsTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {savedDrafts.length === 0 ? (
                <p className="text-neutral-400 text-center py-6">{ui.noDrafts}</p>
              ) : (
                savedDrafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="py-2.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 px-2 rounded cursor-pointer transition-colors"
                    onClick={() => restoreDraft(draft.id)}
                  >
                    <div>
                      <p className="font-mono font-semibold text-neutral-900 dark:text-white">{draft.quoteNumber}</p>
                      <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">{draft.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-medium text-neutral-900 dark:text-white">
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

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-md transition-colors"
              >
                {ui.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
