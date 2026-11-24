import React, { useState } from 'react';
import type { QuoteData } from '../../types/quote';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { NordicTemplate } from './templates/NordicTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import { ZoomIn, ZoomOut, Maximize2, Download, Printer } from 'lucide-react';
import { downloadQuotePDF, printQuote } from '../../utils/pdfExporter';

interface QuotePreviewProps {
  quote: QuoteData;
}

export const QuotePreview: React.FC<QuotePreviewProps> = ({ quote }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await downloadQuotePDF('quotation-print-target', quote.meta.quoteNumber);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Failed to generate PDF. Please try again or use the Print button.');
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

  return (
    <div className="flex flex-col h-full bg-neutral-100 rounded-xl border border-neutral-200 overflow-hidden">
      {/* Preview Header & Zoom Controls */}
      <div className="bg-white border-b border-neutral-200 px-4 py-2.5 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-neutral-500 uppercase tracking-wider">
            Live Preview
          </span>
          <span className="text-[11px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-mono">
            A4 · {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* Zoom & Quick Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoomLevel(Math.max(0.4, zoomLevel - 0.1))}
            title="Zoom Out"
            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(0.85)}
            title="Fit Width"
            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(Math.min(1.3, zoomLevel + 0.1))}
            title="Zoom In"
            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-neutral-200 mx-1" />

          <button
            type="button"
            onClick={printQuote}
            title="Print or Save as System PDF"
            className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md flex items-center gap-1 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="px-3 py-1 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Preview Viewport Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center min-h-[500px]">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out'
          }}
          className="shadow-xl rounded-sm print-sheet"
        >
          <div id="quotation-print-target">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
