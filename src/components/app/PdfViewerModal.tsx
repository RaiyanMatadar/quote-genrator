
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
  RotateCcw,
  Printer,
  Download,
  X,
  FileText,
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
  const docRef = useRef<HTMLDivElement>(null);

  const a4WidthPx = 794;
  const a4HeightPx = 1123;

  const [scale, setScale] = useState<number>(0.9);
  const [fitScale, setFitScale] = useState<number>(0.9);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const scaleRef = useRef(scale);
  const panRef = useRef(pan);

  scaleRef.current = scale;
  panRef.current = pan;

  const lastWheelTimeRef = useRef(0);
  const lastSingleClickZoomTimeRef = useRef(0);

  const dragStartRef = useRef({
    pointerX: 0,
    pointerY: 0,
    panX: 0,
    panY: 0,
    hasMoved: false,
    clickedPdf: false,
    pointerType: 'mouse',
    pointerDownTime: 0
  });

  const pinchRef = useRef({
    initialDist: 0,
    initialScale: 1,
    centerX: 0,
    centerY: 0
  });

  const isDesktopScreen = useCallback(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 768;
  }, []);

  const getDocHeightPx = useCallback(() => {
    return Math.max(
      a4HeightPx,
      docRef.current?.offsetHeight || a4HeightPx
    );
  }, []);

  const clampPan = useCallback((
    targetX: number,
    targetY: number,
    currentScale: number,
    viewportW: number,
    viewportH: number
  ) => {
    const scaledW = a4WidthPx * currentScale;
    const scaledH = getDocHeightPx() * currentScale;

    const paddingX = viewportW < 640 ? 12 : 48;
    const paddingY = viewportW < 640 ? 24 : 48;

    let clampedX = targetX;
    let clampedY = targetY;

    if (scaledW <= viewportW) {
      clampedX = (viewportW - scaledW) / 2;
    } else {
      const minX = viewportW - scaledW - paddingX;
      clampedX = Math.min(paddingX, Math.max(minX, targetX));
    }

    if (scaledH <= viewportH) {
      clampedY = (viewportH - scaledH) / 2;
    } else {
      const minY = viewportH - scaledH - paddingY;
      clampedY = Math.min(paddingY, Math.max(minY, targetY));
    }

    return { x: clampedX, y: clampedY };
  }, [getDocHeightPx]);

  // Initial zoom calculation
  const resetToFit = useCallback(() => {
    if (!viewportRef.current) return;

    const vW = viewportRef.current.clientWidth;
    const vH = viewportRef.current.clientHeight;
    const docHeightPx = getDocHeightPx();

    const isDesktop = window.innerWidth >= 768;

    const marginX = isDesktop ? 96 : 24;
    const marginY = isDesktop ? 96 : 70;
    const paddingY = isDesktop ? 48 : 24;

    const availableW = Math.max(180, vW - marginX);
    const availableH = Math.max(260, vH - marginY);

    const scaleW = availableW / a4WidthPx;
    const scaleH = availableH / docHeightPx;

    // Desktop: Fit to width, not the entire document height.
    // Mobile: Continue fitting the complete document into the screen.
    const initialFit = isDesktop
      ? Math.min(1.15, scaleW)
      : Math.min(1.2, scaleW, scaleH);

    const roundedFit = Math.max(
      0.25,
      Number(initialFit.toFixed(2))
    );

    setFitScale(roundedFit);
    scaleRef.current = roundedFit;
    setScale(roundedFit);

    const centered = clampPan(
      0,
      paddingY,
      roundedFit,
      vW,
      vH
    );

    panRef.current = centered;
    setPan(centered);
    setIsTransitioning(true);
  }, [clampPan, getDocHeightPx]);

  // Open and resize handling
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(resetToFit, 100);

    const handleResize = () => resetToFit();

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, resetToFit]);

  // Keyboard shortcuts
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

  // Desktop two-finger touchpad scrolling
  useEffect(() => {
    if (!isOpen) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isDesktopScreen()) return;

      e.preventDefault();

      // Ignore trackpad pinch-to-zoom gestures.
      if (e.ctrlKey) return;

      const vW = viewport.clientWidth;
      const vH = viewport.clientHeight;

      const multiplier =
        e.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 32
          : e.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? vH
            : 1;

      const dx = e.deltaX * multiplier;
      const dy = e.deltaY * multiplier;

      if (dx === 0 && dy === 0) return;

      lastWheelTimeRef.current = performance.now();
      setIsTransitioning(false);

      setPan(prev => {
        const clamped = clampPan(
          prev.x - dx,
          prev.y - dy,
          scaleRef.current,
          vW,
          vH
        );

        if (clamped.x === prev.x && clamped.y === prev.y) {
          return prev;
        }

        panRef.current = clamped;
        return clamped;
      });
    };

    viewport.addEventListener('wheel', handleWheel, {
      passive: false
    });

    return () => {
      viewport.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, clampPan, isDesktopScreen]);

  // Zoom at clicked position
  const zoomToPoint = useCallback((
    clientX: number,
    clientY: number,
    targetScale: number
  ) => {
    if (!viewportRef.current) return;

    const rect = viewportRef.current.getBoundingClientRect();

    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const currentPan = panRef.current;
    const currentScale = scaleRef.current;

    const docX = (clickX - currentPan.x) / currentScale;
    const docY = (clickY - currentPan.y) / currentScale;

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

    scaleRef.current = targetScale;
    panRef.current = clamped;

    setScale(targetScale);
    setPan(clamped);
  }, [clampPan]);

  // Zoom controls
  const zoomBy = (delta: number) => {
    if (!viewportRef.current) return;

    const vW = viewportRef.current.clientWidth;
    const vH = viewportRef.current.clientHeight;

    const currentScale = scaleRef.current;
    const currentPan = panRef.current;

    const nextScale = Math.max(
      0.25,
      Math.min(3.5, Number((currentScale + delta).toFixed(2)))
    );

    const centerX = vW / 2;
    const centerY = vH / 2;

    const docX = (centerX - currentPan.x) / currentScale;
    const docY = (centerY - currentPan.y) / currentScale;

    const nextPanX = centerX - docX * nextScale;
    const nextPanY = centerY - docY * nextScale;

    const clamped = clampPan(
      nextPanX,
      nextPanY,
      nextScale,
      vW,
      vH
    );

    setIsTransitioning(true);

    scaleRef.current = nextScale;
    panRef.current = clamped;

    setScale(nextScale);
    setPan(clamped);
  };

  // Pointer drag
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (e.pointerType === 'touch' && !e.isPrimary) return;

    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
      hasMoved: false,
      clickedPdf: Boolean(
        docRef.current?.contains(e.target as Node)
      ),
      pointerType: e.pointerType,
      pointerDownTime: performance.now()
    };

    setIsDragging(true);
    setIsTransitioning(false);
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

    const clamped = clampPan(
      dragStartRef.current.panX + dx,
      dragStartRef.current.panY + dy,
      scaleRef.current,
      vW,
      vH
    );

    panRef.current = clamped;
    setPan(clamped);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    setIsDragging(false);

    const wheelOccurredRecently =
      lastWheelTimeRef.current >=
      dragStartRef.current.pointerDownTime - 150;

    if (
      isDesktopScreen() &&
      dragStartRef.current.pointerType === 'mouse' &&
      dragStartRef.current.clickedPdf &&
      !dragStartRef.current.hasMoved &&
      !wheelOccurredRecently &&
      scaleRef.current <= fitScale * 1.1
    ) {
      const targetZoom = Math.min(
        2.5,
        Math.max(1.6, Number((fitScale * 1.75).toFixed(2)))
      );

      lastSingleClickZoomTimeRef.current = performance.now();

      zoomToPoint(e.clientX, e.clientY, targetZoom);
    }
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
  };

  // Double click zoom
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!isDesktopScreen()) return;
    if (!docRef.current?.contains(e.target as Node)) return;

    if (performance.now() - lastSingleClickZoomTimeRef.current < 400) {
      return;
    }

    if (scaleRef.current > fitScale * 1.25) {
      resetToFit();
    } else {
      zoomToPoint(e.clientX, e.clientY, 2.0);
    }
  };

  // Mobile pinch zoom
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      setIsDragging(false);

      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );

      pinchRef.current = {
        initialDist: dist,
        initialScale: scaleRef.current,
        centerX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        centerY: (e.touches[0].clientY + e.touches[1].clientY) / 2
      };

      setIsTransitioning(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && viewportRef.current) {
      e.preventDefault();

      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );

      if (pinchRef.current.initialDist > 0) {
        const factor = dist / pinchRef.current.initialDist;

        const targetScale = Math.max(
          0.25,
          Math.min(
            3.5,
            Number((pinchRef.current.initialScale * factor).toFixed(2))
          )
        );

        const vW = viewportRef.current.clientWidth;
        const vH = viewportRef.current.clientHeight;

        const clamped = clampPan(
          panRef.current.x,
          panRef.current.y,
          targetScale,
          vW,
          vH
        );

        scaleRef.current = targetScale;
        panRef.current = clamped;

        setScale(targetScale);
        setPan(clamped);
      }
    }
  };

  const handleTouchEnd = () => {
    pinchRef.current.initialDist = 0;
  };

  // Download PDF
  const handleDownloadFromViewer = async () => {
    setIsExporting(true);

    try {
      await downloadQuotePDF(
        'quotation-print-target',
        quote.meta.quoteNumber
      );

      onNotify?.('PDF downloaded successfully!', 'success');
    } catch (err: any) {
      onNotify?.(
        `Download failed: ${err.message || 'Error'}`,
        'error'
      );
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
      {/* Top Bar */}
      <header className="h-14 bg-[#1e1f20] border-b border-white/10 px-3 sm:px-6 flex items-center justify-between gap-2 shrink-0 z-30 shadow-md">
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

        {/* Desktop Zoom Controls */}
        <div className="hidden md:flex items-center gap-1 bg-[#28292a] border border-white/10 px-3 py-1 rounded-full shadow-inner text-xs">
          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 pr-2 border-r border-white/10">
            <span>1 / 1</span>
          </div>

          <button
            type="button"
            onClick={() => zoomBy(-0.15)}
            title="Zoom out (-)"
            className="p-1 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="w-14 text-center font-mono text-[11px] font-semibold text-neutral-200">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={() => zoomBy(0.15)}
            title="Zoom in (+)"
            className="p-1 text-neutral-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-white/10 mx-1" />

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

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={printQuote}
            title={ui.btnPrint || 'Print'}
            className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleDownloadFromViewer}
            disabled={isExporting}
            title={ui.btnDownloadPdf || 'Download PDF'}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-neutral-900 hover:bg-neutral-100 font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isExporting
                ? ui.generatingPdf || 'Generating...'
                : ui.btnDownloadPdf || 'Download'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Viewer */}
      <main
        ref={viewportRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 relative overflow-hidden flex items-start justify-start select-none touch-none ${isDragging
            ? 'cursor-grabbing'
            : isZoomedIn
              ? 'cursor-grab'
              : 'cursor-zoom-in'
          }`}
      >
        {/* Mobile Controls */}
        <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#28292a]/95 border border-white/15 px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md">
          <button
            type="button"
            onClick={() => zoomBy(-0.15)}
            title="Zoom out"
            className="p-1.5 text-neutral-300 hover:text-white rounded-full transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="font-mono text-xs font-semibold px-1">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={() => zoomBy(0.15)}
            title="Zoom in"
            className="p-1.5 text-neutral-300 hover:text-white rounded-full transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-3.5 bg-white/20" />

          <button
            type="button"
            onClick={resetToFit}
            title="Fit to screen"
            className="p-1 text-neutral-300 hover:text-white rounded-full transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-3.5 bg-white/20" />

          <button
            type="button"
            onClick={onClose}
            title="Close PDF viewer"
            aria-label="Close PDF viewer"
            className="p-1.5 text-red-500 hover:text-white hover:bg-red-600 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Improved Desktop Interaction Hint */}
        <div className="hidden lg:flex items-center gap-3 absolute bottom-5 right-5 z-20 px-4 py-2.5 rounded-xl bg-black/70 text-neutral-300 text-[11px] pointer-events-none backdrop-blur-md border border-white/10 shadow-lg">
          <span className="flex items-center gap-1.5">
            <ZoomIn className="w-3.5 h-3.5 text-white" />
            Click to zoom
          </span>

          <span className="text-neutral-600">|</span>

          <span className="flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-white" />
            Drag to pan
          </span>

          <span className="text-neutral-600">|</span>

          <span>Two-finger scroll</span>

          <span className="text-neutral-600">|</span>

          <span className="font-semibold text-white">Esc to close</span>
        </div>

        {/* PDF Document */}
        <div
          ref={docRef}
          onDragStart={e => e.preventDefault()}
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
