
const BRAND_NAME = 'Quote Generator Free';
const BRAND_LOGO_URL = '/logo.svg';

const getWebsiteUrl = () => 'https://quotegeneratorfree.com';

async function loadLogo(): Promise<string | null> {
  try {
    const response = await fetch(BRAND_LOGO_URL);

    if (!response.ok) return null;

    const blob = await response.blob();

    const dataUrl = await new Promise<string | null>((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(typeof reader.result === 'string' ? reader.result : null);
      };

      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });

    if (!dataUrl) return null;

    // jsPDF.addImage requires raster formats (PNG/JPEG/WEBP), so rasterize SVG to PNG
    if (dataUrl.startsWith('data:image/svg+xml')) {
      return await new Promise<string | null>((resolve) => {
        const img = new Image();
        img.onload = () => {
          try {
            const size = 128;
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(null);
              return;
            }
            ctx.drawImage(img, 0, 0, size, size);
            resolve(canvas.toDataURL('image/png'));
          } catch {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
        img.src = dataUrl;
      });
    }

    return dataUrl;
  } catch {
    console.warn('Unable to load advertisement logo.');
    return null;
  }
}

export async function downloadQuotePDF(
  elementId: string,
  quoteNumber: string = 'QUOTE'
): Promise<void> {
  if (typeof window === 'undefined') return;

  const targetElement = document.getElementById(elementId);

  if (!targetElement) {
    throw new Error(
      `Quotation element with id "${elementId}" not found.`
    );
  }

  // A4 configuration
  const PAGE_WIDTH_MM = 210;
  const PAGE_HEIGHT_MM = 297;

  const FOOTER_HEIGHT_MM = 12;
  const CONTENT_HEIGHT_MM = PAGE_HEIGHT_MM - FOOTER_HEIGHT_MM;

  const A4_WIDTH_PX = 794;
  const SCALE = 2;

  const websiteUrl = getWebsiteUrl();

  // Load dependencies
  const [
    jspdfModule,
    html2canvasModule,
    confettiModule
  ] = await Promise.all([
    import('jspdf'),
    import('html2canvas-pro').catch(() => import('html2canvas')),
    import('canvas-confetti')
  ]);

  const jsPDF =
    (jspdfModule as any).jsPDF ||
    (jspdfModule as any).default ||
    jspdfModule;

  const html2canvas =
    (html2canvasModule as any).default ||
    (html2canvasModule as any).html2canvas ||
    html2canvasModule;

  const confetti =
    (confettiModule as any).default ||
    confettiModule;

  if (typeof jsPDF !== 'function') {
    throw new Error('jsPDF failed to initialize.');
  }

  const logoData = await loadLogo();

  // Create isolated rendering container
  const cloneWrapper = document.createElement('div');

  Object.assign(cloneWrapper.style, {
    position: 'fixed',
    left: '-99999px',
    top: '0',
    width: `${A4_WIDTH_PX}px`,
    background: '#ffffff',
    zIndex: '-9999',
    transform: 'none'
  });

  const clonedTarget = targetElement.cloneNode(true) as HTMLElement;

  Object.assign(clonedTarget.style, {
    transform: 'none',
    width: `${A4_WIDTH_PX}px`,
    maxWidth: `${A4_WIDTH_PX}px`,
    minWidth: `${A4_WIDTH_PX}px`,
    boxSizing: 'border-box',
    backgroundColor: '#ffffff'
  });

  // Remove template footer; exporter adds its own footer.
  clonedTarget.querySelectorAll('.pdf-footer').forEach((el) => {
    el.remove();
  });

  // Normalize unsupported OKLCH colors
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

      const elements = [
        clonedTarget,
        ...Array.from(clonedTarget.querySelectorAll('*'))
      ] as HTMLElement[];

      for (const el of elements) {
        const computed = window.getComputedStyle(el);

        for (const prop of colorProps) {
          const value = (computed as any)[prop];

          if (
            typeof value === 'string' &&
            value.includes('oklch')
          ) {
            try {
              helperCtx.fillStyle = '#000000';
              helperCtx.fillStyle = value;
              (el.style as any)[prop] = helperCtx.fillStyle;
            } catch {
              // Ignore unsupported colors.
            }
          }
        }

        if (
          computed.boxShadow &&
          computed.boxShadow.includes('oklch')
        ) {
          el.style.boxShadow = 'none';
        }
      }
    }
  } catch (error) {
    console.warn('Color normalization warning:', error);
  }

  cloneWrapper.appendChild(clonedTarget);
  document.body.appendChild(cloneWrapper);

  try {
    // Wait for images
    const images = Array.from(
      clonedTarget.querySelectorAll('img')
    );

    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();

        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    );

    // Wait for layout
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    // Capture full quotation
    const canvas = await html2canvas(clonedTarget, {
      scale: SCALE,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      windowWidth: A4_WIDTH_PX
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // =========================================
    // TABLE HEADER DETECTION
    // =========================================

    const rootRect = clonedTarget.getBoundingClientRect();

    const table = clonedTarget.querySelector('table');

    let tableTop = -1;
    let tableBottom = -1;
    let headerTop = -1;
    let headerHeight = 0;

    const canvasScale = canvas.width / A4_WIDTH_PX;

    if (table) {
      const tableRect = table.getBoundingClientRect();

      tableTop =
        (tableRect.top - rootRect.top) * canvasScale;

      tableBottom =
        (tableRect.bottom - rootRect.top) * canvasScale;

      const thead = table.querySelector('thead');

      if (thead) {
        const headerRect = thead.getBoundingClientRect();

        headerTop =
          (headerRect.top - rootRect.top) * canvasScale;

        headerHeight =
          headerRect.height * canvasScale;
      }
    }

    // Extract original table header from full canvas.
    // This preserves the exact typography and alignment.
    let tableHeaderCanvas: HTMLCanvasElement | null = null;

    if (
      table &&
      headerHeight > 0 &&
      headerTop >= 0
    ) {
      tableHeaderCanvas = document.createElement('canvas');

      tableHeaderCanvas.width = canvas.width;
      tableHeaderCanvas.height = Math.ceil(headerHeight);

      const headerCtx = tableHeaderCanvas.getContext('2d');

      if (headerCtx) {
        headerCtx.drawImage(
          canvas,
          0,
          Math.round(headerTop),
          canvas.width,
          Math.ceil(headerHeight),
          0,
          0,
          canvas.width,
          Math.ceil(headerHeight)
        );
      } else {
        tableHeaderCanvas = null;
      }
    }

    // =========================================
    // PAGE CALCULATION
    // =========================================

    const contentHeightPx =
      (CONTENT_HEIGHT_MM / PAGE_WIDTH_MM) * canvas.width;

    const footerHeightPx =
      (FOOTER_HEIGHT_MM / PAGE_WIDTH_MM) * canvas.width;

    const totalHeightPx = canvas.height;

    const pages: Array<{
      start: number;
      end: number;
      repeatHeader: boolean;
    }> = [];

    let currentPosition = 0;

    while (currentPosition < totalHeightPx) {
      // Check whether the current page starts inside the table.
      const continuesTable =
        tableHeaderCanvas !== null &&
        currentPosition > tableTop + headerHeight &&
        currentPosition < tableBottom;

      // Reserve space for the repeated table heading.
      const repeatedHeaderHeight = continuesTable
        ? headerHeight
        : 0;

      const availableHeight =
        contentHeightPx - repeatedHeaderHeight;

      const pageEnd = Math.min(
        currentPosition + availableHeight,
        totalHeightPx
      );

      if (pageEnd <= currentPosition) {
        throw new Error('Unable to calculate PDF page boundaries.');
      }

      pages.push({
        start: currentPosition,
        end: pageEnd,
        repeatHeader: continuesTable
      });

      currentPosition = pageEnd;
    }

    // =========================================
    // GENERATE EACH PAGE
    // =========================================

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      const page = pages[i];

      const repeatedHeaderHeight =
        page.repeatHeader ? headerHeight : 0;

      const sourceHeight = page.end - page.start;

      // A4 page canvas with reserved footer area
      const pageCanvas = document.createElement('canvas');

      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.ceil(contentHeightPx);

      const ctx = pageCanvas.getContext('2d');

      if (!ctx) {
        throw new Error('Unable to create PDF page canvas.');
      }

      ctx.fillStyle = '#ffffff';

      ctx.fillRect(
        0,
        0,
        pageCanvas.width,
        pageCanvas.height
      );

      // Repeat table header on continuing pages.
      if (
        page.repeatHeader &&
        tableHeaderCanvas
      ) {
        ctx.drawImage(
          tableHeaderCanvas,
          0,
          0
        );
      }

      // Draw page content below repeated table header.
      ctx.drawImage(
        canvas,
        0,
        Math.round(page.start),
        canvas.width,
        Math.ceil(sourceHeight),
        0,
        Math.round(repeatedHeaderHeight),
        canvas.width,
        Math.ceil(sourceHeight)
      );

      // Convert page to image
      const imageData = pageCanvas.toDataURL(
        'image/jpeg',
        0.96
      );

      pdf.addImage(
        imageData,
        'JPEG',
        0,
        0,
        PAGE_WIDTH_MM,
        CONTENT_HEIGHT_MM,
        undefined,
        'FAST'
      );

      // =========================================
      // ADVERTISEMENT FOOTER
      // =========================================

      const footerTop = CONTENT_HEIGHT_MM;

      // Footer background
      pdf.setFillColor(248, 250, 252);

      pdf.rect(
        0,
        footerTop,
        PAGE_WIDTH_MM,
        FOOTER_HEIGHT_MM,
        'F'
      );

      // Footer top border
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.2);

      pdf.line(
        12,
        footerTop,
        198,
        footerTop
      );

      // LEFT: LOGO
      const logoX = 13;
      const logoY = 288;
      const logoSize = 6;

      if (logoData) {
        try {
          const format = logoData.startsWith('data:image/png')
            ? 'PNG'
            : logoData.startsWith('data:image/webp')
              ? 'WEBP'
              : 'JPEG';

          pdf.addImage(
            logoData,
            format,
            logoX,
            logoY,
            logoSize,
            logoSize,
            undefined,
            'FAST'
          );
        } catch {
          // Continue without logo.
        }
      }

      // LEFT: BRAND NAME
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(45, 45, 45);

      pdf.text(
        BRAND_NAME,
        logoX + 9,
        292
      );

      // CENTER: PAGE NUMBER
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(130, 130, 130);

      pdf.text(
        `Page ${i + 1} of ${pages.length}`,
        105,
        292,
        { align: 'center' }
      );

      // RIGHT: WEBSITE URL
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(37, 99, 235);

      const websiteText = websiteUrl.replace(
        /^https?:\/\//,
        ''
      );

      pdf.text(
        websiteText,
        197,
        292,
        { align: 'right' }
      );

      // Website underline
      const linkWidth = pdf.getTextWidth(websiteText);

      pdf.setDrawColor(37, 99, 235);
      pdf.setLineWidth(0.15);

      pdf.line(
        197 - linkWidth,
        293,
        197,
        293
      );

      // Clickable website
      pdf.link(
        197 - linkWidth,
        287,
        linkWidth,
        7,
        { url: websiteUrl }
      );
    }

    // =========================================
    // DOWNLOAD PDF
    // =========================================

    const cleanNumber = (quoteNumber || 'Quote')
      .trim()
      .replace(/[^a-zA-Z0-9_\-\.]/g, '_');

    pdf.save(`${cleanNumber}.pdf`);

    // Confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: [
          '#0070f3',
          '#171717',
          '#50e3c2',
          '#7928ca'
        ]
      });
    } catch {
      // Decorative only.
    }

  } finally {
    if (cloneWrapper.parentNode) {
      cloneWrapper.parentNode.removeChild(cloneWrapper);
    }
  }
}

// =========================================
// PRINT
// =========================================

export function printQuote(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
