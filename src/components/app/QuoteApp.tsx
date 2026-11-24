import React, { useState, useEffect } from 'react';
import type { QuoteData } from '../../types/quote';
import { Toolbar } from './Toolbar';
import { QuoteEditor } from './QuoteEditor';
import { QuotePreview } from './QuotePreview';
import {
  loadCurrentQuote,
  saveCurrentQuote,
  createDefaultQuote
} from '../../utils/storage';
import { getSiteUiTranslation } from '../../data/uiTranslations';
import { Edit3, Eye, CheckCircle2 } from 'lucide-react';

export const QuoteApp: React.FC = () => {
  // Start with default quote for SSR consistency
  const [quote, setQuote] = useState<QuoteData>(() => createDefaultQuote());
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [saveStatus, setSaveStatus] = useState<string>('Ready');
  const [isClient, setIsClient] = useState<boolean>(false);

  // Website UI Language state
  const [siteLanguage, setSiteLanguage] = useState<string>('en');

  // Dark Theme state
  const [isDark, setIsDark] = useState<boolean>(false);

  // Hydrate client-side state on mount
  useEffect(() => {
    setIsClient(true);

    // 1. Load active draft
    const saved = loadCurrentQuote();
    if (saved) {
      setQuote(saved);
      setSaveStatus('Loaded from browser');
    }

    // 2. Load site UI language
    const storedLang = localStorage.getItem('site_language');
    if (storedLang) {
      setSiteLanguage(storedLang);
    }

    // 3. Theme detection
    const checkDark = () => {
      const darkActive = document.documentElement.classList.contains('dark');
      setIsDark(darkActive);
    };
    checkDark();

    // Listen for theme change events from header or toolbar
    const handleThemeEvent = (e: any) => {
      if (e.detail && typeof e.detail.isDark === 'boolean') {
        setIsDark(e.detail.isDark);
      } else {
        checkDark();
      }
    };
    window.addEventListener('theme-changed', handleThemeEvent);

    return () => window.removeEventListener('theme-changed', handleThemeEvent);
  }, []);

  // Debounced auto-save to localStorage on quote updates
  useEffect(() => {
    if (!isClient) return;

    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
      saveCurrentQuote(quote);
      setSaveStatus('Saved in browser');
    }, 400);

    return () => clearTimeout(timer);
  }, [quote, isClient]);

  // Handle manual theme toggle
  const handleThemeToggle = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { isDark: nextDark } }));
  };

  // Handle website UI language switch
  const handleSiteLanguageChange = (newLang: string) => {
    setSiteLanguage(newLang);
    try {
      localStorage.setItem('site_language', newLang);
    } catch {}
  };

  const handleReset = () => {
    const fresh = createDefaultQuote();
    fresh.id = 'quote-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    // Generate new quote number
    const randomNum = Math.floor(100 + Math.random() * 900);
    fresh.meta.quoteNumber = `Q-2026-${randomNum}`;
    setQuote(fresh);
    saveCurrentQuote(fresh);
    setSaveStatus('Draft reset');
  };

  const ui = getSiteUiTranslation(siteLanguage);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Top Toolbar */}
      <Toolbar
        quote={quote}
        ui={ui}
        siteLanguage={siteLanguage}
        onSiteLanguageChange={handleSiteLanguageChange}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
        onChange={setQuote}
        onReset={handleReset}
      />

      {/* Mobile Tab Switcher (<lg) */}
      <div className="lg:hidden flex border border-neutral-200 dark:border-neutral-800 rounded-lg p-1 bg-white dark:bg-neutral-900 shadow-2xs no-print">
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'editor'
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" /> {ui.tabEdit}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'preview'
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> {ui.tabPreview}
        </button>
      </div>

      {/* Main Split-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Editor Column (7 cols on desktop) */}
        <div
          className={`lg:col-span-7 space-y-6 editor-pane ${
            activeTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between no-print px-1">
            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              {ui.formEditorTitle}
            </span>
            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />{' '}
              {saveStatus === 'Saving...'
                ? ui.statusSaving
                : saveStatus === 'Saved in browser'
                ? ui.statusSaved
                : saveStatus}
            </span>
          </div>

          <QuoteEditor quote={quote} ui={ui} onChange={setQuote} />
        </div>

        {/* Live Preview Column (5 cols on desktop, sticky) */}
        <div
          className={`lg:col-span-5 lg:sticky lg:top-20 ${
            activeTab === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <QuotePreview quote={quote} ui={ui} />
        </div>
      </div>
    </div>
  );
};
