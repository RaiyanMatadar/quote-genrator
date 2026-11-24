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
  Check,
  FileText,
  ArrowRight,
  Trash2,
  Clock,
  X
} from 'lucide-react';
import { downloadQuotePDF, printQuote } from '../../utils/pdfExporter';
import {
  saveToHistory,
  getHistoryList,
  loadQuoteFromHistory,
  deleteQuoteFromHistory
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

// Shared control styles so every element has the same height and look
const controlBase =
  'h-9 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/20 transition-colors';

const ghostBtn =
  'h-9 px-2.5 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center gap-1.5 transition-colors';

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

  const handleDeleteDraft = (id: string) => {
    deleteQuoteFromHistory(id);
    const updated = getHistoryList();
    setSavedDrafts(updated);
    if (onNotify) {
      onNotify('Quotation draft removed from history', 'info');
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
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 shadow-xs no-print transition-colors">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Template, Colors, Currency, Website Language */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
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
            className={`${controlBase} col-span-2 w-full sm:col-span-1 sm:w-auto`}
          >
            {TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.name}
              </option>
            ))}
          </select>

          {/* Accent Color Palette */}
          <div className="col-span-2 h-9 flex items-center justify-between sm:justify-start gap-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md px-2.5 sm:col-span-1">
            <Palette className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <div className="flex items-center gap-1.5">
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
                  aria-label={color.name}
                  className="w-4 h-4 rounded-full transition-transform hover:scale-110 flex items-center justify-center shrink-0"
                  style={{ backgroundColor: color.hex }}
                >
                  {quote.branding.accentColor === color.hex && (
                    <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Selector */}
          <select
            value={quote.currency}
            onChange={(e) => onChange({ ...quote, currency: e.target.value })}
            title={ui.currency}
            className={`${controlBase} w-full sm:w-auto font-mono font-medium`}
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
            className={`${controlBase} w-full sm:w-auto`}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName}
              </option>
            ))}
          </select>
        </div>

        {/* Right: History, New, Print, Download */}
        <div className="grid grid-cols-[2.25rem_2.25rem_1fr_1fr] gap-2 border-t border-neutral-100 dark:border-neutral-800 pt-3 sm:flex sm:flex-wrap sm:items-center sm:justify-end lg:border-t-0 lg:pt-0">
          {/* History */}
          <button
            type="button"
            onClick={openHistory}
            title={ui.savedDraftsTitle}
            aria-label={ui.btnHistory}
            className={`${ghostBtn} px-0 sm:px-2.5`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{ui.btnHistory}</span>
          </button>

          {/* New Quote */}
          <button
            type="button"
            onClick={() => setShowNewQuoteModal(true)}
            title="Start New Quote"
            aria-label={ui.btnNew}
            className={`${ghostBtn} px-0 sm:px-2.5`}
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{ui.btnNew}</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={printQuote}
            className="h-9 px-3 text-xs font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{ui.btnPrint}</span>
          </button>

          {/* Primary Download CTA */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="h-9 px-4 text-xs font-semibold text-white dark:text-neutral-900 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 rounded-full flex items-center justify-center gap-1.5 transition-colors shadow-xs whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? ui.generatingPdf : ui.btnDownloadPdf}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for New Quote */}
      <ModernModal
        isOpen={showNewQuoteModal}
        title="Start a new quotation?"
        description="Your current quotation has been saved to History. Starting a new quote will reset the form fields."
        confirmLabel="Create New Quote"
        cancelLabel="Keep Editing"
        onConfirm={confirmNewQuote}
        onCancel={() => setShowNewQuoteModal(false)}
      />

      {/* History Modal with Clickable Cards */}
      {showHistoryModal && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-150"
          onClick={() => setShowHistoryModal(false)}
        >
          <div
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="font-semibold text-base text-neutral-950 dark:text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-neutral-900 dark:text-white" />
                  {ui.savedDraftsTitle || 'Quotation History'}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {ui.savedDraftsSubtitle || 'Select any quotation below to load and continue editing.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Draft Cards List */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-2.5">
              {savedDrafts.length === 0 ? (
                <div className="py-12 text-center space-y-2.5">
                  <div className="w-11 h-11 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500">
                    <History className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {ui.noDrafts || 'No saved quotations found'}
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 max-w-xs mx-auto leading-relaxed">
                    Quotations are automatically saved here as you work, download, or create new quotes.
                  </p>
                </div>
              ) : (
                savedDrafts.map((draft) => {
                  const isActive = draft.id === quote.id;
                  const formattedDate = new Date(draft.lastUpdated).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <div
                      key={draft.id}
                      onClick={() => restoreDraft(draft.id)}
                      className={`group relative p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isActive
                          ? 'bg-neutral-50/90 dark:bg-neutral-800/90 border-neutral-900 dark:border-white shadow-xs ring-1 ring-neutral-900/10 dark:ring-white/20'
                          : 'bg-white dark:bg-neutral-900/80 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-md hover:bg-neutral-50/60 dark:hover:bg-neutral-800/60'
                        }`}
                    >
                      {/* Left: Document Info */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900 transition-colors shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {draft.quoteNumber}
                            </span>
                            {isActive && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                {ui.activeDraft || 'Active'}
                              </span>
                            )}
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-300 text-[11px] font-medium truncate max-w-[200px] sm:max-w-[240px]">
                            {draft.clientName || 'Unnamed Client'}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500 pt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Total & Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100 dark:border-neutral-800/80">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono">
                            Total
                          </span>
                          <span className="font-mono font-bold text-xs sm:text-sm text-neutral-950 dark:text-white">
                            {draft.currency}{' '}
                            {Number(draft.total || 0).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900 transition-all">
                            {isActive ? 'Current' : ui.openQuote || 'Open Quote'}
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                          <button
                            type="button"
                            title={ui.deleteDraft || 'Delete draft'}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDraft(draft.id);
                            }}
                            className="p-1 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
              >
                {ui.close || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};