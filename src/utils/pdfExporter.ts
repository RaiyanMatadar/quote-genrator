// Client-side PDF exporter with html2canvas-pro (native oklch support) and resilient color sanitization
export async function downloadQuotePDF(elementId: string, quoteNumber: string = 'QUOTE'): Promise<void> {
  if (typeof window === 'undefined') return;

  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    throw new Error(`Quotation element with id "${elementId}" not found.`);
  }

  // 1. Dynamically import jsPDF, html2canvas-pro (with html2canvas fallback), and canvas-confetti
  const [jspdfModule, html2canvasModule, confettiModule] = await Promise.all([
    import('jspdf'),
    import('html2canvas-pro').catch(() => import('html2canvas')),
    import('canvas-confetti')
  ]);

  // Resilient constructor extraction
  const jsPDF = (jspdfModule as any).jsPDF || (jspdfModule as any).default || jspdfModule;
  const html2canvas = (html2canvasModule as any).default || (html2canvasModule as any).html2canvas || html2canvasModule;
  const confetti = (confettiModule as any).default || confettiModule;

  if (typeof jsPDF !== 'function') {
    throw new Error('jsPDF library failed to initialize as a constructor.');
  }

  // 2. Create an isolated offscreen clone container at exact A4 width (794px = 210mm at 96 DPI)
  const a4WidthPx = 794;
  const cloneWrapper = document.createElement('div');
  cloneWrapper.style.position = 'fixed';
  cloneWrapper.style.left = '-99999px';
  cloneWrapper.style.top = '0';
  cloneWrapper.style.width = `${a4WidthPx}px`;
  cloneWrapper.style.background = '#ffffff';
  cloneWrapper.style.zIndex = '-9999';
  cloneWrapper.style.transform = 'none';

  // Deep clone the quotation sheet
  const clonedTarget = targetElement.cloneNode(true) as HTMLElement;
  clonedTarget.style.transform = 'none';
  clonedTarget.style.width = `${a4WidthPx}px`;
  clonedTarget.style.maxWidth = `${a4WidthPx}px`;
  clonedTarget.style.minWidth = `${a4WidthPx}px`;
  clonedTarget.style.boxSizing = 'border-box';
  clonedTarget.style.backgroundColor = '#ffffff';

  // 3. Resilient color normalization for any legacy canvas engines
  // Converts any computed 'oklch' values to standard hex/rgba via a temporary 2D canvas context
  try {
    const helperCanvas = document.createElement('canvas');
    const helperCtx = helperCanvas.getContext('2d');
    if (helperCtx) {
      const colorProps = [
        'color',
        'backgroundColor',
        'borderColor',
        'borderTopColor',
        'borderBottomColor',
        'borderLeftColor',
        'borderRightColor',
        'outlineColor',
        'fill',
        'stroke'
      ];

      const elements = [clonedTarget, ...Array.from(clonedTarget.querySelectorAll('*'))] as HTMLElement[];
      for (const el of elements) {
        const computed = window.getComputedStyle(el);
        for (const prop of colorProps) {
          const val = (computed as any)[prop];
          if (typeof val === 'string' && val.includes('oklch')) {
            try {
              helperCtx.fillStyle = '#000000';
              helperCtx.fillStyle = val;
              (el.style as any)[prop] = helperCtx.fillStyle;
            } catch {}
          }
        }
        if (computed.boxShadow && computed.boxShadow.includes('oklch')) {
          el.style.boxShadow = 'none';
        }
      }
    }
  } catch (err) {
    console.warn('Color normalization warning:', err);
  }

  cloneWrapper.appendChild(clonedTarget);
  document.body.appendChild(cloneWrapper);

  try {
    // Wait for all images in the clone to complete loading
    const images = Array.from(clonedTarget.querySelectorAll('img'));
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve(true);
            else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
            }
          })
      )
    );

    // 4. Render high-resolution canvas with html2canvas-pro
    const canvas = await html2canvas(clonedTarget, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: a4WidthPx,
      windowWidth: a4WidthPx
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.96);

    // 5. Create A4 PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidthMm = 210;
    const pageHeightMm = 297;
    const imgWidthMm = pageWidthMm;
    const imgHeightMm = (canvas.height * pageWidthMm) / canvas.width;

    let heightLeftMm = imgHeightMm;
    let positionMm = 0;

    // First Page
    pdf.addImage(imgData, 'JPEG', 0, positionMm, imgWidthMm, imgHeightMm, undefined, 'FAST');
    heightLeftMm -= pageHeightMm;

    // Multi-page handling (5mm buffer threshold)
    while (heightLeftMm > 5) {
      positionMm -= pageHeightMm;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, positionMm, imgWidthMm, imgHeightMm, undefined, 'FAST');
      heightLeftMm -= pageHeightMm;
    }

    const cleanNumber = (quoteNumber || 'Quote').trim().replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    pdf.save(`${cleanNumber}.pdf`);

    // Celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0070f3', '#171717', '#50e3c2', '#7928ca']
      });
    } catch {
      // Decorative
    }
  } finally {
    if (cloneWrapper.parentNode) {
      cloneWrapper.parentNode.removeChild(cloneWrapper);
    }
  }
}

export function printQuote(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
