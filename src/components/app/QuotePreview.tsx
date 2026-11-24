import React, { useState, useEffect, useRef } from 'react';
import type { QuoteData } from '../../types/quote';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { NordicTemplate } from './templates/NordicTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type { SiteUiDictionary } from '../../data/uiTranslations';

interface QuotePreviewProps {
  quote: QuoteData;
  ui: SiteUiDictionary;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({ quote, ui }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
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

  // Toggle between Fit and 100% zoom on desktop click
  const handleDesktopClickZoom = () => {
    if (window.innerWidth >= 1024) {
      if (zoomLevel >= 1) {
        handleFitWidth();
      } else {
        setZoomLevel(1);
      }
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
      {/* Preview Header & Controls (Cleaned: duplicate Print & Download buttons removed) */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-3 sm:px-4 py-2.5 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
            {ui.livePreview}
          </span>
          <span className="text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-0.5 rounded font-mono">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* Viewport Zoom Controls */}
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
        </div>
      </div>

      {/* Preview Viewport Canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-6 flex items-start justify-center min-h-[440px] max-w-full relative group"
      >
        {/* Desktop Hover Zoom Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full bg-neutral-900/80 dark:bg-white/90 text-white dark:text-neutral-900 text-[11px] font-mono font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md backdrop-blur-xs">
          <ZoomIn className="w-3 h-3" />
          <span>{zoomLevel >= 1 ? 'Click to Fit' : 'Click for 100%'}</span>
        </div>

        {/* Scaled A4 Document Container */}
        <div
          onClick={handleDesktopClickZoom}
          style={{
            width: `${effectiveWidth}px`,
            height: `${effectiveHeight}px`,
            position: 'relative'
          }}
          className="shadow-xl rounded-sm print-sheet shrink-0 transition-all duration-150 cursor-default lg:cursor-zoom-in group-hover:ring-2 lg:group-hover:ring-neutral-400/40 dark:lg:group-hover:ring-neutral-600/40"
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
