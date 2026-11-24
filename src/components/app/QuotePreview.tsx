import React, { useState, useEffect, useRef } from 'react';
import type { QuoteData } from '../../types/quote';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { NordicTemplate } from './templates/NordicTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import { ZoomIn, ZoomOut, Maximize2, Expand } from 'lucide-react';
import type { SiteUiDictionary } from '../../data/uiTranslations';
import { PdfViewerModal } from './PdfViewerModal';

interface QuotePreviewProps {
  quote: QuoteData;
  ui: SiteUiDictionary;
  onNotify?: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({ quote, ui, onNotify }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [isFullViewerOpen, setIsFullViewerOpen] = useState<boolean>(false);
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
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-3 sm:px-4 py-2.5 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
            {ui.livePreview}
          </span>
          <span className="text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded font-mono">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* Viewport Zoom & Full-Page Viewer Controls */}
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

          <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-1" />

          {/* Dedicated Full-Page Google Drive Style Viewer Button */}
          <button
            type="button"
            onClick={() => setIsFullViewerOpen(true)}
            title="Open Dedicated Full-Screen PDF Viewer"
            className="px-2.5 py-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Expand className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full Viewer</span>
          </button>
        </div>
      </div>

      {/* Preview Viewport Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-6 flex items-start justify-center min-h-[440px] max-w-full relative group"
      >
        {/* Desktop Hover Zoom / Expand Indicator */}
        <div 
          onClick={() => setIsFullViewerOpen(true)}
          className="hidden lg:flex items-center gap-1.5 absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-neutral-900/85 dark:bg-white/90 text-white dark:text-neutral-900 text-[11px] font-mono font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md backdrop-blur-xs cursor-pointer hover:scale-105"
        >
          <Expand className="w-3 h-3" />
          <span>Click to Open Full Viewer</span>
        </div>

        {/* Scaled A4 Document Container */}
        <div
          onClick={() => setIsFullViewerOpen(true)}
          style={{
            width: `${effectiveWidth}px`,
            height: `${effectiveHeight}px`,
            position: 'relative'
          }}
          className="shadow-xl rounded-sm print-sheet shrink-0 transition-all duration-150 cursor-pointer group-hover:ring-2 lg:group-hover:ring-neutral-400/50 dark:lg:group-hover:ring-neutral-600/50"
          title="Click to open Full-Screen Google Drive Viewer"
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

      {/* Google Drive Style Full-Page PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={isFullViewerOpen}
        onClose={() => setIsFullViewerOpen(false)}
        quote={quote}
        ui={ui}
        onNotify={onNotify}
      />
    </div>
  );
};
