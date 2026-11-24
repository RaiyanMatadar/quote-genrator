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
  Copy,
  History,
  Palette,
  Globe,
  Coins,
  Layout,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { downloadQuotePDF, printQuote } from '../../utils/pdfExporter';
import {
  saveToHistory,
  getHistoryList,
  loadQuoteFromHistory
} from '../../utils/storage';

interface ToolbarProps {
  quote: QuoteData;
  ui: SiteUiDictionary;
  siteLanguage: string;
  onSiteLanguageChange: (lang: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  onChange: (updated: QuoteData) => void;
  onReset: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  quote,
  ui,
  siteLanguage,
  onSiteLanguageChange,
  isDark,
  onThemeToggle,
  onChange,
  onReset
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [savedDrafts, setSavedDrafts] = useState(getHistoryList());

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      saveToHistory(quote);
      await downloadQuotePDF('quotation-print-target', quote.meta.quoteNumber);
    } catch (err: any) {
      console.error(err);
      alert(`Unable to download PDF: ${err.message || 'Error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDuplicate = () => {
    const duplicated: QuoteData = {
      ...quote,
      id: 'quote-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      meta: {
        ...quote.meta,
        quoteNumber: `${quote.meta.quoteNumber}-COPY`
      }
    };
    saveToHistory(quote);
    onChange(duplicated);
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
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 shadow-xs space-y-3 no-print transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Section: Template, Colors, Currency, Website Language */}
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
              title={ui.template}
              className="text-xs font-medium pl-8 pr-7 py-1.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-md cursor-pointer focus:outline-hidden focus:border-neutral-900 dark:focus:border-neutral-400 appearance-none text-neutral-800 dark:text-neutral-200"
            >
              {TEMPLATES.map((tmpl) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </option>
              ))}
            </select>
          </div>

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
          <div className="relative flex items-center">
            <Coins className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
            <select
              value={quote.currency}
              onChange={(e) => onChange({ ...quote, currency: e.target.value })}
              title={ui.currency}
              className="text-xs font-mono font-medium pl-8 pr-7 py-1.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-md cursor-pointer focus:outline-hidden focus:border-neutral-900 dark:focus:border-neutral-400 appearance-none text-neutral-800 dark:text-neutral-200"
            >
              {ALL_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Website Interface Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 pointer-events-none" />
            <select
              value={siteLanguage}
              onChange={(e) => onSiteLanguageChange(e.target.value)}
              title={ui.websiteLanguage}
              className="text-xs font-medium pl-8 pr-7 py-1.5 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 rounded-md cursor-pointer focus:outline-hidden focus:border-neutral-900 dark:focus:border-neutral-400 appearance-none text-neutral-800 dark:text-neutral-200"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Section: Drafts, New, Duplicate, Print, Download & Dark Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dark Mode Quick Toggle */}
          <button
            type="button"
            onClick={onThemeToggle}
            title={ui.themeToggle}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

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

          {/* New Quote */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Create a new quote? Current draft is saved in History.')) {
                saveToHistory(quote);
                onReset();
              }
            }}
            title="Start New Quote"
            className="px-2.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700 flex items-center gap-1 transition-colors"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{ui.btnNew}</span>
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={handleDuplicate}
            title="Duplicate Current Quote"
            className="px-2.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700 flex items-center gap-1 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{ui.btnDuplicate}</span>
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

      {/* History Modal */}
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
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-sm"
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
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-md"
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
