import React, { useRef, useState, useEffect, useCallback } from 'react';
import { PenTool, Type, Eraser } from 'lucide-react';
import type { SignatureData } from '../../types/quote';

interface SignaturePadProps {
  signature: SignatureData;
  onChange: (updated: SignatureData) => void;
  labels?: {
    signatureTitle?: string;
    includeSignature?: string;
    typeName?: string;
    drawSignature?: string;
    clear?: string;
    drawHint?: string;
    typePlaceholder?: string;
    signerTitle?: string;
    signedDate?: string;
    statement?: string;
  };
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ signature, onChange, labels = {} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Redraw existing signature if available
  useEffect(() => {
    if (signature.type === 'drawn' && canvasRef.current && signature.dataUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = signature.dataUrl;
      }
    }
  }, [signature.type]);

  // Accurate coordinate calculation respecting CSS scaling vs canvas resolution
  const getCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();

      let clientX = 0;
      let clientY = 0;

      if ('touches' in e) {
        if (e.touches && e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else if ('changedTouches' in e && (e as any).changedTouches.length > 0) {
          clientX = (e as any).changedTouches[0].clientX;
          clientY = (e as any).changedTouches[0].clientY;
        }
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Essential fix: scale coordinates by ratio of internal canvas pixels to CSS displayed pixels
      const scaleX = canvas.width / (rect.width || 1);
      const scaleY = canvas.height / (rect.height || 1);

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    },
    []
  );

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#171717';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !canvasRef.current) return;
    setIsDrawing(false);
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onChange({
      ...signature,
      dataUrl
    });
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    onChange({
      ...signature,
      dataUrl: ''
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5" /> {labels.signatureTitle || 'Client Acceptance & Signature'}
        </label>
        <label className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
          <input
            type="checkbox"
            checked={signature.enabled}
            onChange={(e) => onChange({ ...signature, enabled: e.target.checked })}
            className="rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-0 w-3.5 h-3.5"
          />
          <span>{labels.includeSignature || 'Include Signature Section'}</span>
        </label>
      </div>

      {signature.enabled && (
        <div className="space-y-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          {/* Method tabs: Drawn vs Typed */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...signature, type: 'typed' })}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
                signature.type === 'typed'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              <Type className="w-3.5 h-3.5" /> {labels.typeName || 'Type Name'}
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...signature, type: 'drawn' })}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
                signature.type === 'drawn'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" /> {labels.drawSignature || 'Draw Signature'}
            </button>
          </div>

          {signature.type === 'drawn' ? (
            <div className="space-y-2">
              <div className="relative border border-neutral-300 dark:border-neutral-700 rounded-md bg-white overflow-hidden shadow-2xs">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={160}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ touchAction: 'none' }}
                  className="w-full h-32 cursor-crosshair bg-white"
                />
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="absolute bottom-2 right-2 text-xs text-neutral-600 hover:text-neutral-900 bg-white/95 border border-neutral-200 px-2.5 py-1 rounded shadow-xs flex items-center gap-1"
                >
                  <Eraser className="w-3 h-3" /> {labels.clear || 'Clear'}
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                {labels.drawHint || 'Sign with your mouse, trackpad, or finger on touch screens.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                placeholder={labels.typePlaceholder || 'Enter authorized signatory name...'}
                value={signature.typedName || ''}
                onChange={(e) => onChange({ ...signature, typedName: e.target.value })}
                className="w-full text-sm px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:border-neutral-900 dark:focus:border-neutral-400 focus:outline-hidden"
              />
              {signature.typedName && (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 rounded text-center">
                  <span className="font-serif italic text-2xl tracking-wide text-neutral-900 dark:text-neutral-100">
                    {signature.typedName}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
                {labels.signerTitle || 'Signer Title / Role'}
              </label>
              <input
                type="text"
                placeholder="e.g. Managing Director"
                value={signature.signerTitle || ''}
                onChange={(e) => onChange({ ...signature, signerTitle: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
                {labels.signedDate || 'Signed Date'}
              </label>
              <input
                type="date"
                value={signature.signedDate || ''}
                onChange={(e) => onChange({ ...signature, signedDate: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 block mb-1">
              {labels.statement || 'Acceptance Statement'}
            </label>
            <textarea
              rows={2}
              value={signature.declarationText || ''}
              onChange={(e) => onChange({ ...signature, declarationText: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
