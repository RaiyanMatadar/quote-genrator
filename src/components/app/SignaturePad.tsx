import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, Eraser, CheckSquare } from 'lucide-react';
import type { SignatureData } from '../../types/quote';

interface SignaturePadProps {
  signature: SignatureData;
  onChange: (updated: SignatureData) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ signature, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (signature.type === 'drawn' && canvasRef.current && signature.dataUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = signature.dataUrl;
      }
    }
  }, [signature.type]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#171717';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

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
    <div className="bg-white border border-neutral-200 rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5" /> Client Acceptance & Signature
        </label>
        <label className="flex items-center gap-1.5 text-xs text-neutral-700 cursor-pointer">
          <input
            type="checkbox"
            checked={signature.enabled}
            onChange={(e) => onChange({ ...signature, enabled: e.target.checked })}
            className="rounded border-neutral-300 text-neutral-900 focus:ring-0 w-3.5 h-3.5"
          />
          <span>Include Signature Section</span>
        </label>
      </div>

      {signature.enabled && (
        <div className="space-y-3 pt-2 border-t border-neutral-100">
          {/* Method tabs: Drawn vs Typed */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...signature, type: 'typed' })}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
                signature.type === 'typed'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" /> Type Name
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...signature, type: 'drawn' })}
              className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
                signature.type === 'drawn'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" /> Draw Signature
            </button>
          </div>

          {signature.type === 'drawn' ? (
            <div className="space-y-2">
              <div className="relative border border-neutral-300 rounded-md bg-neutral-50/50 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={110}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-28 touch-none cursor-crosshair bg-white"
                />
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="absolute bottom-2 right-2 text-xs text-neutral-500 hover:text-neutral-900 bg-white/90 border border-neutral-200 px-2 py-0.5 rounded shadow-xs flex items-center gap-1"
                >
                  <Eraser className="w-3 h-3" /> Clear
                </button>
              </div>
              <p className="text-[11px] text-neutral-400">Draw using mouse or finger on touch screens</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Enter authorized signatory name..."
                value={signature.typedName || ''}
                onChange={(e) => onChange({ ...signature, typedName: e.target.value })}
                className="w-full text-sm px-3 py-2 border border-neutral-200 rounded-md focus:border-neutral-900 focus:outline-hidden"
              />
              {signature.typedName && (
                <div className="p-2.5 bg-neutral-50 border border-neutral-100 rounded text-center">
                  <span className="font-serif italic text-xl tracking-wide text-neutral-900">
                    {signature.typedName}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-mono text-neutral-500 block mb-1">Signer Title / Role</label>
              <input
                type="text"
                placeholder="e.g. Managing Director"
                value={signature.signerTitle || ''}
                onChange={(e) => onChange({ ...signature, signerTitle: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-500 block mb-1">Signed Date</label>
              <input
                type="date"
                value={signature.signedDate || ''}
                onChange={(e) => onChange({ ...signature, signedDate: e.target.value })}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-neutral-500 block mb-1">Acceptance Statement</label>
            <textarea
              rows={2}
              value={signature.declarationText || ''}
              onChange={(e) => onChange({ ...signature, declarationText: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md text-neutral-600 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
