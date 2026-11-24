import React, { useState, useEffect, useRef } from 'react';
import type { QuoteData } from '../../types/quote';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { NordicTemplate } from './templates/NordicTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import { ZoomIn, ZoomOut, Maximize2, Download, Printer } from 'lucide-react';
import { downloadQuotePDF, printQuote } from '../../utils/pdfExporter';
import type { SiteUiDictionary } from '../../data/uiTranslations';

interface QuotePreviewProps {
  quote: QuoteData;
  ui: SiteUiDictionary;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({ quote, ui }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const a4WidthPx = 794; // 210mm at 96 DPI
  const a4HeightPx = 1123; // 297mm

  // Auto-fit zoom on mount and window resize for small screens
  useEffect(() => {
    const autoScale = () => {
      if (containerRef.current) {
        const availableW = containerRef.current.clientWidth - 32;
        if (availableW < a4WidthPx) {
          const autoZoom = Math.max(0.35, Math.min(1, availableW / a4WidthPx));
          setZoomLevel(Number(autoZoom.toFixed(2)));
        } else {
          setZoomLevel(0.85);
        }
      }
    };

    autoScale();
    window.addEventListener('resize', autoScale);
    return () => window.removeEventListener('resize', autoScale);
  }, []);

  const handleFitWidth = () => {
    if (containerRef.current) {
      const availableW = containerRef.current.clientWidth - 32;
      const fitZoom = Math.max(0.35, Math.min(1.2, availableW / a4WidthPx));
      setZoomLevel(Number(fitZoom.toFixed(2)));
    }
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await downloadQuotePDF('quotation-print-target', quote.meta.quoteNumber);
    } catch (err: any) {
      console.error('PDF download error:', err);
      alert(`Unable to generate PDF (${err.message || 'Error'}). You can also click the Print button to save as PDF.`);
    } finally {
      setIsExporting(false);
    }
  };

  const renderTemplate = () => {
    switch (quote.branding.templateId) {
      case 'corporate':
        return <CorporateTemplate quote={quote} />;
      case 'creative':
        return <CreativeTemplate quote={quote} />;
      case 'nordic':
        return <NordicTemplate quote={quote} />;
      case 'compact':
        return <CompactTemplate quote={quote} />;
      case 'minimalist':
      default:
        return <MinimalistTemplate quote={quote} />;
    }
  };

  const effectiveWidth = Math.round(a4WidthPx * zoomLevel);
  const effectiveHeight = Math.round(a4HeightPx * zoomLevel);

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs transition-colors">
      {/* Preview Header & Controls */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
            {ui.livePreview}
          </span>
          <span className="text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded font-mono">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* Zoom & Quick Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.35, Number((z - 0.1).toFixed(2))))}
            title={ui.zoomOut}
            className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleFitWidth}
            title={ui.fitWidth}
            className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(1.3, Number((z + 0.1).toFixed(2))))}
            title={ui.zoomIn}
            className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700 mx-1" />

          <button
            type="button"
            onClick={printQuote}
            title={ui.btnPrint}
            className="px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md flex items-center gap-1 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{ui.btnPrint}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="px-3 py-1 text-xs font-medium text-white dark:text-neutral-900 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? ui.generatingPdf : ui.btnDownloadPdf}</span>
          </button>
        </div>
      </div>

      {/* Preview Viewport Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-6 flex items-start justify-center min-h-[440px] max-w-full"
      >
        {/* Exact-dimension box to contain the scaled A4 document and prevent mobile layout overflow */}
        <div
          style={{
            width: `${effectiveWidth}px`,
            height: `${effectiveHeight}px`,
            position: 'relative'
          }}
          className="shadow-xl rounded-sm print-sheet shrink-0 transition-all duration-150"
        >
          <div
            id="quotation-print-target"
            style={{
              width: `${a4WidthPx}px`,
              minWidth: `${a4WidthPx}px`,
              maxWidth: `${a4WidthPx}px`,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
