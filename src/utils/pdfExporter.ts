// Dynamic client-side PDF exporter
export async function downloadQuotePDF(elementId: string, quoteNumber: string = 'QUOTE'): Promise<void> {
  if (typeof window === 'undefined') return;

  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found.`);
  }

  // Dynamically import jsPDF and html2canvas for code splitting
  const [{ default: jsPDF }, { default: html2canvas }, { default: confetti }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
    import('canvas-confetti')
  ]);

  const originalTransform = element.style.transform;
  element.style.transform = 'none';

  try {
    const canvas = await html2canvas(element, {
      scale: 2.2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 5) {
      position = position - pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const cleanFilename = `${quoteNumber.trim() || 'Quote'}.pdf`.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    pdf.save(cleanFilename);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0070f3', '#171717', '#50e3c2', '#7928ca']
      });
    } catch {
      // Ignore
    }
  } finally {
    element.style.transform = originalTransform;
  }
}

export function printQuote(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
