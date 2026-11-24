import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { QuoteData } from '../../types/quote';
import type { SiteUiDictionary } from '../../data/uiTranslations';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { CorporateTemplate } from './templates/CorporateTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { NordicTemplate } from './templates/NordicTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Printer,
  Download,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Move
} from 'lucide-react';
import { downloadQuotePDF, printQuote } from '../../utils/pdfExporter';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: QuoteData;
  ui: SiteUiDictionary;
  onNotify?: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  quote,
  ui,
  onNotify
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const a4WidthPx = 794; // 210mm at 96 DPI
  const a4HeightPx = 1123; // 297mm

  const [scale, setScale] = useState<number>(0.9);
  const [fitScale, setFitScale] = useState<number>(0.9);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Drag tracking refs (avoid re-render overhead during high-frequency pointermove)
  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    panX: number;
    panY: number;
    hasMoved: boolean;
  }>({ pointerX: 0, pointerY: 0, panX: 0, panY: 0, hasMoved: false });

  // Touch pinch tracking refs
  const pinchRef = useRef<{
    initialDist: number;
    initialScale: number;
    centerX: number;
    centerY: number;
  }>({ initialDist: 0, initialScale: 1, centerX: 0, centerY: 0 });

  // 1. Clamping function preventing dragging beyond visible boundaries
  const clampPan = useCallback(
    (
      targetX: number,
      targetY: number,
      currentScale: number,
      viewportW: number,
      viewportH: number
    ) => {
      const scaledW = a4WidthPx * currentScale;
      const scaledH = a4HeightPx * currentScale;
      const paddingX = viewportW < 640 ? 12 : 48; // Margin around document inside viewer
      const paddingY = viewportW < 640 ? 24 : 48;

      let clampedX = targetX;
      let clampedY = targetY;

      // Horizontal containment
      if (scaledW <= viewportW) {
        // Document narrower than viewport: Keep centered
        clampedX = (viewportW - scaledW) / 2;
      } else {
        // Document wider than viewport: Clamp so edges don't disappear
        const minX = viewportW - scaledW - paddingX;
        const maxX = paddingX;
        clampedX = Math.min(maxX, Math.max(minX, targetX));
      }

      // Vertical containment
      if (scaledH <= viewportH) {
        // Document shorter than viewport: Keep centered
        clampedY = (viewportH - scaledH) / 2;
      } else {
        // Document taller than viewport: Clamp so edges don't disappear
        const minY = viewportH - scaledH - paddingY;
        const maxY = paddingY;
        clampedY = Math.min(maxY, Math.max(minY, targetY));
      }

      return { x: clampedX, y: clampedY };
    },
    []
  );

  // 2. Compute initial fit scale on open & resize
  const resetToFit = useCallback(() => {
    if (!viewportRef.current) return;
    const vW = viewportRef.current.clientWidth;
    const vH = viewportRef.current.clientHeight;

    // Available space accounting for margins and floating toolbar on mobile vs desktop
    const marginX = vW < 640 ? 16 : 64;
    const marginY = vW < 640 ? 70 : 120;
    const availableW = Math.max(180, vW - marginX);
    const availableH = Math.max(260, vH - marginY);

    const scaleW = availableW / a4WidthPx;
    const scaleH = availableH / a4HeightPx;
    // Fit to entire page comfortably (down to 0.25 on small mobile screens)
    const initialFit = Math.max(0.25, Math.min(1.2, Math.min(scaleW, scaleH)));
    const roundedFit = Number(initialFit.toFixed(2));

    setFitScale(roundedFit);
    setScale(roundedFit);

    // Center document
    const centered = clampPan(0, 0, roundedFit, vW, vH);
    setPan(centered);
    setIsTransitioning(true);
  }, [clampPan]);

  // Recalculate on open and window resize
  useEffect(() => {
    if (!isOpen) return;

    // Small delay to ensure modal DOM is mounted and clientWidth/Height are non-zero
    const timer = setTimeout(() => {
      resetToFit();
    }, 30);

    const handleResize = () => {
      resetToFit();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, resetToFit]);

  // 3. Body scroll lock and keyboard shortcuts (Esc, +, -, 0)
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomBy(0.2);
      } else if (e.key === '-') {
        e.preventDefault();
        zoomBy(-0.2);
      } else if (e.key === '0') {
        e.preventDefault();
        resetToFit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, resetToFit]);

  // 4. Click-to-Zoom at exact coordinate positioning
  const zoomToPoint = useCallback(
    (clientX: number, clientY: number, targetScale: number) => {
      if (!viewportRef.current) return;
      const rect = viewportRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;

      // Calculate unscaled document coordinate under click
      const docX = (clickX - pan.x) / scale;
      const docY = (clickY - pan.y) / scale;

      // Calculate target pan keeping clicked point aligned
      const newPanX = clickX - docX * targetScale;
      const newPanY = clickY - docY * targetScale;

      const clamped = clampPan(
        newPanX,
        newPanY,
        targetScale,
        rect.width,
        rect.height
      );

      setIsTransitioning(true);
      setScale(targetScale);
      setPan(clamped);
    },
    [pan, scale, clampPan]
  );

  const zoomBy = (delta: number) => {
    if (!viewportRef.current) return;
    const vW = viewportRef.current.clientWidth;
    const vH = viewportRef.current.clientHeight;

    const nextScale = Math.max(0.25, Math.min(3.5, Number((scale + delta).toFixed(2))));
    // Center point of viewport as focal point
    const centerX = vW / 2;
    const centerY = vH / 2;

    const docX = (centerX - pan.x) / scale;
    const docY = (centerY - pan.y) / scale;

    const nextPanX = centerX - docX * nextScale;
    const nextPanY = centerY - docY * nextScale;

    const clamped = clampPan(nextPanX, nextPanY, nextScale, vW, vH);

    setIsTransitioning(true);
    setScale(nextScale);
    setPan(clamped);
  };

  // 5. Pointer/Mouse Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only left click
    if (e.button !== 0) return;
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      panX: pan.x,
      panY: pan.y,
      hasMoved: false
    };
    setIsDragging(true);
    setIsTransitioning(false); // Immediate 60fps tracking without transition delay
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !viewportRef.current) return;

    const dx = e.clientX - dragStartRef.current.pointerX;
    const dy = e.clientY - dragStartRef.current.pointerY;

    if (Math.hypot(dx, dy) > 4) {
      dragStartRef.current.hasMoved = true;
    }

    const vW = viewportRef.current.clientWidth;
    const vH = viewportRef.current.clientHeight;

    const rawTargetX = dragStartRef.current.panX + dx;
    const rawTargetY = dragStartRef.current.panY + dy;

    const clamped = clampPan(rawTargetX, rawTargetY, scale, vW, vH);
    setPan(clamped);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    // If it was a clean click without dragging, execute Click-to-Zoom
    if (!dragStartRef.current.hasMoved) {
      // If at fit scale, zoom in to 1.6x at exact coordinates
      if (scale <= fitScale * 1.1) {
        zoomToPoint(e.clientX, e.clientY, 1.6);
      }
    }
  };

  // 6. Double-Click to Zoom In or Reset
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (scale > fitScale * 1.25) {
      // Already zoomed in: reset back to fit
      resetToFit();
    } else {
      // Zoom in to 2x at exact clicked coordinate
      zoomToPoint(e.clientX, e.clientY, 2.0);
    }
  };

  // 7. Touch Gestures: Pinch-to-Zoom & Pan
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchRef.current = {
        initialDist: dist,
        initialScale: scale,
        centerX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        centerY: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };
      setIsTransitioning(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && viewportRef.current) {
      e.preventDefault(); // Prevent native browser zooming
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (pinchRef.current.initialDist > 0) {
        const factor = dist / pinchRef.current.initialDist;
        const targetScale = Math.max(
          0.25,
          Math.min(3.5, Number((pinchRef.current.initialScale * factor).toFixed(2)))
        );

        const vW = viewportRef.current.clientWidth;
        const vH = viewportRef.current.clientHeight;
        const clamped = clampPan(pan.x, pan.y, targetScale, vW, vH);

        setScale(targetScale);
        setPan(clamped);
      }
    }
  };

  const handleTouchEnd = () => {
    pinchRef.current.initialDist = 0;
  };

  // 8. PDF Download within Viewer
  const handleDownloadFromViewer = async () => {
    setIsExporting(true);
    try {
      await downloadQuotePDF('quotation-print-target', quote.meta.quoteNumber);
      if (onNotify) {
        onNotify('PDF downloaded successfully!', 'success');
      }
    } catch (err: any) {
      if (onNotify) {
        onNotify(`Download failed: ${err.message || 'Error'}`, 'error');
      }
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

  if (!isOpen) return null;

  const isZoomedIn = scale > fitScale * 1.05;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full-Page PDF Viewer"
      className="fixed inset-0 z-50 bg-[#1e1f20]/95 backdrop-blur-md flex flex-col select-none text-white animate-in fade-in duration-150"
    >
      {/* Top Bar (Google Drive Style) */}
      <header className="h-14 bg-[#1e1f20] border-b border-white/10 px-3 sm:px-6 flex items-center justify-between gap-2 shrink-0 z-30 shadow-md">
        {/* Left: Document Info & Close */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            title="Close viewer (Esc)"
            className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 truncate">
            <div className="p-1.5 rounded-md bg-neutral-800 text-neutral-300 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h2 className="text-xs sm:text-sm font-semibold truncate leading-tight">
                {quote.meta.quoteNumber || 'Quotation'}
              </h2>
              <p className="text-[10px] text-neutral-400 font-mono truncate">
                {quote.meta.title || 'QUOTE'} · {quote.to.name || 'Client Draft'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Zoom & Navigation Controls Pill */}
        <div className="hidden md:flex items-center gap-1 bg-[#28292a] border border-white/10 px-3 py-1 rounded-full shadow-inner text-xs">
          {/* Page Indicator */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 pr-2 border-r border-white/10">
            <span>1 / 1</span>
          </div>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => zoomBy(-0.15)}
            title="Zoom out (-)"
            className="p-1 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom Percentage Display */}
          <span className="w-14 text-center font-mono text-[11px] font-semibold text-neutral-200">
            {Math.round(scale * 100)}%
          </span>

          {/* Zoom In */}
          <button
            type="button"
            onClick={() => zoomBy(0.15)}
            title="Zoom in (+)"
            className="p-1 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* Reset / Fit to Page */}
          <button
            type="button"
            onClick={resetToFit}
            title="Fit to window (0)"
            className="p-1 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md transition-colors flex items-center gap-1 text-[11px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">Fit</span>
          </button>
        </div>

        {/* Right: Actions (Print, Download, Close) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Print */}
          <button
            type="button"
            onClick={printQuote}
            title={ui.btnPrint || 'Print'}
            className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadFromViewer}
            disabled={isExporting}
            title={ui.btnDownloadPdf || 'Download PDF'}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isExporting ? ui.generatingPdf || 'Generating...' : ui.btnDownloadPdf || 'Download'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Interactive Viewer Viewport */}
      <main
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 relative overflow-hidden flex items-start justify-start select-none touch-none ${
          isDragging
            ? 'cursor-grabbing'
            : isZoomedIn
            ? 'cursor-grab'
            : 'cursor-zoom-in'
        }`}
      >
        {/* Floating Controls for Mobile (<md) */}
        <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#28292a]/95 border border-white/15 px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md">
          <button
            type="button"
            onClick={() => zoomBy(-0.15)}
            className="p-1.5 text-neutral-300 hover:text-white rounded-full"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs font-semibold px-1">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => zoomBy(0.15)}
            className="p-1.5 text-neutral-300 hover:text-white rounded-full"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-3.5 bg-white/20" />
          <button
            type="button"
            onClick={resetToFit}
            className="p-1 text-neutral-300 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Floating Hint Overlay (Auto fades) */}
        <div className="hidden lg:flex items-center gap-2 absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/60 text-neutral-400 text-[11px] font-mono pointer-events-none backdrop-blur-xs border border-white/5">
          <Move className="w-3 h-3 text-neutral-300" />
          <span>Double-click to zoom · Drag to pan · Esc to exit</span>
        </div>

        {/* Scaled A4 Document Canvas */}
        <div
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: isTransitioning
              ? 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'none',
            width: `${a4WidthPx}px`,
            minWidth: `${a4WidthPx}px`,
            maxWidth: `${a4WidthPx}px`,
            position: 'absolute',
            top: 0,
            left: 0
          }}
          className="shadow-2xl rounded-sm print-sheet"
        >
          {renderTemplate()}
        </div>
      </main>
    </div>
  );
};
