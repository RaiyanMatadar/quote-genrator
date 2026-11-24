export interface ProcessedLogo {
  dataUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
  format: string;
}

export async function processLogoFile(file: File): Promise<ProcessedLogo> {
  const validTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/svg+xml',
    'image/webp',
    'image/gif'
  ];

  if (!validTypes.includes(file.type)) {
    throw new Error('Unsupported format. Please upload PNG, JPG, SVG, WebP, or GIF.');
  }

  // Max 8MB
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Logo file size exceeds 8MB. Please use a smaller file.');
  }

  // If SVG
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result as string;
        // Basic sanitization: strip script tags
        const sanitized = svgContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(sanitized)}`;

        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth || 200;
          const h = img.naturalHeight || 80;
          resolve({
            dataUrl,
            width: w,
            height: h,
            aspectRatio: w / (h || 1),
            format: 'svg'
          });
        };
        img.onerror = () => {
          // Fallback if natural width fails
          resolve({
            dataUrl,
            width: 200,
            height: 80,
            aspectRatio: 2.5,
            format: 'svg'
          });
        };
        img.src = dataUrl;
      };
      reader.onerror = () => reject(new Error('Failed to read SVG file.'));
      reader.readAsText(file);
    });
  }

  // For Raster Images (PNG, JPG, WebP, GIF)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const naturalW = img.naturalWidth;
        const naturalH = img.naturalHeight;
        const aspectRatio = naturalW / (naturalH || 1);

        // If very large image, downscale for localStorage optimization
        const maxDimension = 1200;
        if (naturalW > maxDimension || naturalH > maxDimension) {
          const canvas = document.createElement('canvas');
          let targetW = naturalW;
          let targetH = naturalH;

          if (naturalW > naturalH) {
            targetW = maxDimension;
            targetH = Math.round(maxDimension / aspectRatio);
          } else {
            targetH = maxDimension;
            targetW = Math.round(maxDimension * aspectRatio);
          }

          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, targetW, targetH);
            const optimizedUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.92);
            resolve({
              dataUrl: optimizedUrl,
              width: targetW,
              height: targetH,
              aspectRatio,
              format: file.type.replace('image/', '')
            });
            return;
          }
        }

        resolve({
          dataUrl: rawDataUrl,
          width: naturalW,
          height: naturalH,
          aspectRatio,
          format: file.type.replace('image/', '')
        });
      };
      img.onerror = () => reject(new Error('Unable to decode image file.'));
      img.src = rawDataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}
