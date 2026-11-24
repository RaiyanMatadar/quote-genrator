// Client-side PDF exporter with robust module resolution and clean snapshotting
export async function downloadQuotePDF(elementId: string, quoteNumber: string = 'QUOTE'): Promise<void> {
  if (typeof window === 'undefined') return;

  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    throw new Error(`Quotation element with id "${elementId}" not found.`);
  }

  // 1. Dynamically import jsPDF, html2canvas, and canvas-confetti with resilient fallback
  const [jspdfModule, html2canvasModule, confettiModule] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
    import('canvas-confetti')
  ]);

  // Resilient constructor extraction for both ESM and CJS bundles
  const jsPDF = (jspdfModule as any).jsPDF || (jspdfModule as any).default || jspdfModule;
  const html2canvas = (html2canvasModule as any).default || html2canvasModule;
  const confetti = (confettiModule as any).default || confettiModule;

  if (typeof jsPDF !== 'function') {
    throw new Error('jsPDF library failed to initialize as a constructor.');
  }

  // 2. Create an isolated offscreen clone container at exact A4 width (794px)
  // This completely eliminates issues where parent CSS transforms (scale) or mobile viewport
  // widths cause html2canvas to produce distorted, clipped, or blank PDFs!
  const a4WidthPx = 794; // 210mm at 96 DPI
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

  cloneWrapper.appendChild(clonedTarget);
  document.body.appendChild(cloneWrapper);

  try {
    // Wait for any images inside the clone to be ready
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

    // 3. Render high-resolution canvas at 2x scale for crisp print quality
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

    // 4. Create standard A4 PDF (210mm x 297mm)
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

    // Multi-page handling if document exceeds one page (5mm buffer)
    while (heightLeftMm > 5) {
      positionMm -= pageHeightMm;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, positionMm, imgWidthMm, imgHeightMm, undefined, 'FAST');
      heightLeftMm -= pageHeightMm;
    }

    const cleanNumber = (quoteNumber || 'Quote').trim().replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    pdf.save(`${cleanNumber}.pdf`);

    // Festive confetti feedback
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0070f3', '#171717', '#50e3c2', '#7928ca']
      });
    } catch {
      // Confetti is decorative
    }
  } finally {
    // Clean up offscreen clone
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
