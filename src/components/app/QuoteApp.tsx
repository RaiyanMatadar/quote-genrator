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
import { Edit3, Eye, CheckCircle2 } from 'lucide-react';

export const QuoteApp: React.FC = () => {
  // Start with default quote for SSR / first paint consistency
  const [quote, setQuote] = useState<QuoteData>(() => createDefaultQuote());
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [saveStatus, setSaveStatus] = useState<string>('Ready');
  const [isClient, setIsClient] = useState<boolean>(false);

  // Hydrate from localStorage once mounted on client
  useEffect(() => {
    setIsClient(true);
    const saved = loadCurrentQuote();
    if (saved) {
      setQuote(saved);
      setSaveStatus('Loaded from browser');
    }
  }, []);

  // Debounced auto-save to localStorage on updates
  useEffect(() => {
    if (!isClient) return;

    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
      saveCurrentQuote(quote);
      setSaveStatus('Saved in browser');
    }, 400);

    return () => clearTimeout(timer);
  }, [quote, isClient]);

  const handleReset = () => {
    const fresh = createDefaultQuote();
    setQuote(fresh);
    saveCurrentQuote(fresh);
    setSaveStatus('Draft reset');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Toolbar */}
      <Toolbar quote={quote} onChange={setQuote} onReset={handleReset} />

      {/* Mobile Tab Switcher (<lg) */}
      <div className="lg:hidden flex border border-neutral-200 rounded-lg p-1 bg-white shadow-2xs no-print">
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'editor'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit Quotation
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'preview'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Live PDF Preview
        </button>
      </div>

      {/* Main Split-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Column (7 cols on desktop) */}
        <div
          className={`lg:col-span-7 space-y-6 editor-pane ${
            activeTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between no-print px-1">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
              QUOTATION FORM EDITOR
            </span>
            <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {saveStatus}
            </span>
          </div>

          <QuoteEditor quote={quote} onChange={setQuote} />
        </div>

        {/* Live Preview Column (5 cols on desktop, sticky) */}
        <div
          className={`lg:col-span-5 lg:sticky lg:top-6 ${
            activeTab === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <QuotePreview quote={quote} />
        </div>
      </div>
    </div>
  );
};
