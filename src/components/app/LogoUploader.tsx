import React, { useRef, useState } from 'react';
import { Upload, X, AlignLeft, AlignCenter, AlignRight, Sliders, Image as ImageIcon } from 'lucide-react';
import { processLogoFile } from '../../utils/logoProcessor';
import type { Branding } from '../../types/quote';

interface LogoUploaderProps {
  branding: Branding;
  onChange: (updated: Branding) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ branding, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setErrorMsg(null);
    try {
      const processed = await processLogoFile(file);
      onChange({
        ...branding,
        logoUrl: processed.dataUrl
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process image');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeLogo = () => {
    onChange({
      ...branding,
      logoUrl: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-medium flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" /> Company Logo
        </label>
        {branding.logoUrl && (
          <button
            type="button"
            onClick={removeLogo}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Remove
          </button>
        )}
      </div>

      {!branding.logoUrl ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          <Upload className="w-5 h-5 text-neutral-400 mb-1.5" />
          <p className="text-xs font-medium text-neutral-700">Click to upload or drag & drop</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">PNG, JPG, SVG, WebP, GIF (Max 8MB)</p>
          {errorMsg && <p className="text-xs text-red-600 mt-2">{errorMsg}</p>}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-md p-3 space-y-3">
          <div className="flex items-center justify-center p-2 bg-neutral-50 rounded border border-neutral-100 max-h-28 overflow-hidden">
            <img
              src={branding.logoUrl}
              alt="Uploaded company logo"
              style={{ width: `${branding.logoWidth}px` }}
              className="max-h-24 object-contain"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-100 text-xs">
            {/* Width Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
                <span>Size:</span>
                <span>{branding.logoWidth}px</span>
              </div>
              <input
                type="range"
                min="60"
                max="220"
                step="5"
                value={branding.logoWidth}
                onChange={(e) => onChange({ ...branding, logoWidth: Number(e.target.value) })}
                className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
              />
            </div>

            {/* Alignment */}
            <div className="space-y-1">
              <span className="text-[11px] text-neutral-500 font-mono">Alignment:</span>
              <div className="flex rounded-md border border-neutral-200 overflow-hidden bg-neutral-50 p-0.5">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => onChange({ ...branding, logoAlignment: align })}
                    className={`flex-1 py-1 flex items-center justify-center rounded text-neutral-600 transition-colors ${
                      branding.logoAlignment === align
                        ? 'bg-white shadow-xs text-neutral-900 font-medium'
                        : 'hover:text-neutral-900'
                    }`}
                  >
                    {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                    {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                    {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
