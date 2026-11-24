# Codebase Documentation: Quote Generator Free

**Project Name**: Quote Generator Free  
**Domain**: `quotegeneratorfree.com`  
**Architecture**: 100% Client-Side In-Browser Quotation Generator & Static Landing Page  
**Last Updated**: November 2026  

---

## 1. Architectural Philosophy & Overview

Quote Generator Free is a privacy-first, zero-friction web application designed for freelancers, agencies, contractors, and small businesses to draft, calculate, customize, preview, and download professional PDF quotations without accounts, logins, or server-side databases.

### Core Principles
1. **100% In-Browser Privacy**: All quotation data, customer records, line items, and uploaded logos remain strictly inside the user's browser runtime (`localStorage` and memory). No sensitive business data or client pricing is transmitted to any external server.
2. **Real-Time Synchronous A4 Preview**: An accurate 794px-wide A4 document canvas mirrors user input at 60fps with responsive desktop zoom (Fit-Width vs. 100% scale).
3. **Universal Logo Engine**: Client-side validation, dimension normalization, and Base64 optimization for raster (PNG, JPG, WebP, GIF) and vector (SVG) brand logos.
4. **Dual-Layer Localization (i18n)**:
   - **Website Interface Chrome**: Localized across 12 languages (`en`, `es`, `fr`, `de`, `pt`, `it`, `nl`, `pl`, `ar`, `hi`, `ja`, `zh`) via reactive events without full page reloads.
   - **Quotation Document Content**: Strictly isolated from UI language switches; user-typed quote items, descriptions, and custom labels are never overwritten or auto-translated.
5. **Vercel Geist Design System**: Strict adherence to a minimal monochrome aesthetic (near-black `#171717` ink, near-white `#fafafa` canvas, 1px hairlines, Geist Sans/Mono typography, bimodal buttons).

---

## 2. Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **Astro v7** (`astro: ^7.4.13`) | Static Site Generation (SSG) with Astro Islands architecture. |
| **Component Islands** | **React 19** (`react: ^19.3.1`, `@astrojs/react`) | Powers the interactive quotation editor, line items, signature pad, and live preview. |
| **Styling** | **Tailwind CSS v4** (`tailwindcss: ^4.3.5`, `@tailwindcss/vite`) | CSS-first `@theme` configuration, `@custom-variant dark`, OKLCH palettes, and responsive grid layouts. |
| **Language** | **TypeScript 5** | Strict type definitions across models, financial calculations, storage, and UI dictionaries. |
| **PDF Generation** | **html2canvas-pro** (`^2.6.4`) & **jsPDF** (`^4.2.1`) | High-resolution canvas rasterization with native OKLCH color function support and multi-page vector PDF output. |
| **Icons** | **lucide-react** (`^1.79.0`) | Lightweight, tree-shakable SVG iconography for actions and feature cards. |
| **Effects** | **canvas-confetti** (`^1.9.4`) | Subtle visual delight triggered upon successful PDF downloads. |

---

## 3. Directory Structure & File Map

```
quote-genrator/
├── public/                         # Public static assets
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── assets/                     # Default build-time SVG graphics
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components/
│   │   ├── app/                    # React 19 Interactive Generator Islands
│   │   │   ├── templates/          # 5 Designer Quotation Layouts
│   │   │   │   ├── CompactTemplate.tsx     # High line-item density layout
│   │   │   │   ├── CorporateTemplate.tsx   # Structured enterprise layout
│   │   │   │   ├── CreativeTemplate.tsx    # Bold editorial studio layout
│   │   │   │   ├── MinimalistTemplate.tsx  # Clean Swiss-style layout (default)
│   │   │   │   └── NordicTemplate.tsx      # Warm minimalist Scandinavian layout
│   │   │   ├── LineItemsEditor.tsx # Interactive line items table with reordering & clone
│   │   │   ├── LogoUploader.tsx    # Universal logo dropzone, dimension slider, & alignment
│   │   │   ├── PdfViewerModal.tsx  # Google Drive style full-page viewer (zoom, pan, gestures)
│   │   │   ├── QuoteApp.tsx        # Top-level React state orchestrator & reactive tabs
│   │   │   ├── QuoteEditor.tsx     # Left-hand form editor pane (metadata, clients, taxes)
│   │   │   ├── QuotePreview.tsx    # Right-hand sticky A4 live document preview
│   │   │   ├── SignaturePad.tsx    # DPR-scaled digital signature pad (draw / typed)
│   │   │   └── Toolbar.tsx         # Top action bar (Templates, Accent, Currencies, History, PDF)
│   │   ├── landing/                # Astro Landing Page Sections (SSG)
│   │   │   ├── Faq.astro           # Accordion FAQ with semantic schema markup
│   │   │   ├── Features.astro      # Feature showcase with Lucide SVG icons
│   │   │   ├── Footer.astro        # Minimalist footer with data-i18n bindings
│   │   │   ├── Header.astro        # Sticky navbar, global language selector, theme toggle
│   │   │   ├── Hero.astro          # Hero section with animated mesh gradient & trust badges
│   │   │   └── HowItWorks.astro    # 3-step workflow breakdown cards
│   │   └── ui/                     # Reusable Modern UI Components
│   │       ├── ModernModal.tsx     # Backdrop-blurred dialog replacing window.confirm
│   │       └── ToastNotification.tsx # Non-blocking floating toast notification system
│   ├── data/                       # Dictionaries & Master Data
│   │   ├── currencies.ts           # 150+ ISO currencies with formatting helpers
│   │   ├── templates.ts            # Template registry and accent color palettes
│   │   ├── translations.ts         # Quotation document label dictionary (12 languages)
│   │   └── uiTranslations.ts       # Website interface localization dictionary (12 languages)
│   ├── layouts/
│   │   └── Layout.astro            # Base HTML wrapper, SEO meta, JSON-LD, instant theme/i18n scripts
│   ├── pages/
│   │   └── index.astro             # Single-page application root entrypoint
│   ├── scripts/
│   │   └── i18n.ts                 # Client-side global translation synchronizer
│   ├── styles/
│   │   └── global.css              # Tailwind v4 theme, select/option styles, print target CSS
│   ├── types/
│   │   └── quote.ts                # Master TypeScript schemas for quotations
│   └── utils/                      # Pure Business Logic & Platform Helpers
│       ├── calculations.ts         # Safe financial arithmetic & tax calculation
│       ├── logoProcessor.ts        # Image validation, resizing, SVG sanitization
│       ├── pdfExporter.ts          # Offscreen DOM rendering, OKLCH fix, PDF generation
│       └── storage.ts              # SSR-safe localStorage persistence & draft history
├── AGENTS.md                       # Operational rules for background dev server management
├── astro.config.mjs                # Astro configuration (React + Tailwind plugins)
├── CODEBASE.md                     # This codebase architectural documentation
├── DESIGN.md                       # Vercel Geist design tokens & visual standards
├── package.json                    # Project dependencies and script declarations
├── README.md                       # Project introduction
└── tsconfig.json                   # TypeScript compiler configuration
```

---

## 4. Key Subsystems & Implementation Details

### 4.1 Quotation State & Storage Architecture
- **Location**: `src/types/quote.ts`, `src/utils/storage.ts`, `src/components/app/QuoteApp.tsx`
- **State Pattern**: `QuoteApp.tsx` serves as the single source of truth for the active `quote: QuoteData` object.
- **SSR Safety**: All calls to `localStorage` check `typeof window !== 'undefined' && window.localStorage` to prevent Node.js hydration crashes during Astro SSG builds.
- **Auto-Save**: Changes to the quotation state are debounced by 400ms before saving to `quote_current_draft` in `localStorage`.
- **History Management**:
  - Saved drafts are stored in `quote_history_list` as `SavedDraftSummary[]`.
  - Individual drafts are keyed as `quote_draft_${id}`.
  - The History Drawer renders interactive, elevated cards displaying quote number, client name, formatted total, relative timestamp, an active draft badge (`Active Quote` with an animated pulse), an intuitive `"Open Quote →"` button, and a delete action via `deleteQuoteFromHistory`.

### 4.2 Financial Calculation Engine
- **Location**: `src/utils/calculations.ts`
- **Arithmetic Precision**: Financial calculations round values using `Math.round(val * 100) / 100` to prevent floating-point inaccuracies (e.g., `0.1 + 0.2 = 0.30000000000000004`).
- **Discount Clamping**: Percentage discounts are clamped to `[0, 100]`. Fixed discounts are clamped to `[0, subtotal]`.
- **Per-Item Taxability**: Each line item carries an `isTaxable: boolean` flag. Only taxable items are summed into the taxable base when computing multi-row tax rates.
- **Currency Formatting**: `formatMoney(amount, currencyCode)` utilizes `Intl.NumberFormat` with fallback logic for custom symbols.

### 4.3 High-Fidelity PDF Export & Print Engine
- **Location**: `src/utils/pdfExporter.ts`
- **Root Cause of `oklch` Errors**: Tailwind CSS v4 defaults to modern CSS `oklch(...)` colors. Legacy `html2canvas` throws fatal parsing exceptions. This is solved by using `html2canvas-pro` alongside a temporary Canvas 2D color normalizer.
- **Off-Screen Clone Technique**:
  1. The target `#quotation-print-target` is deeply cloned into an offscreen container fixed at exactly `794px` width (standard A4 width at 96 DPI).
  2. All external styles are retained while isolating the element from viewport scaling or zoom levels.
  3. `html2canvas-pro` renders the clone at `scale: 2` (equivalent to 192 DPI print density) with `useCORS: true`.
  4. Output is stitched into an A4 PDF (`210mm x 297mm`) via `jsPDF`.
  5. Triggers a celebration via `canvas-confetti` upon download completion.
- **Direct Vector Printing**: `printQuote()` uses window native `@media print` rules defined in `global.css`, preserving crisp vector typography and pure `#ffffff` paper backgrounds.

### 4.4 Dual-Layer Localization (i18n) Engine
- **Location**: `src/data/uiTranslations.ts`, `src/scripts/i18n.ts`, `src/components/landing/Header.astro`
- **Supported Languages**:
  1. English (`en`)
  2. Spanish (`es`)
  3. French (`fr`)
  4. German (`de`)
  5. Portuguese (`pt`)
  6. Italian (`it`)
  7. Dutch (`nl`)
  8. Polish (`pl`)
  9. Arabic (`ar`, with automatic `dir="rtl"`)
  10. Hindi (`hi`)
  11. Japanese (`ja`)
  12. Simplified Chinese (`zh`)
- **Event-Driven Client Sync**:
  - Selection from either the Header navbar `<select id="global-lang-select">` or the editor Toolbar updates `localStorage.setItem('site_language', lang)` and dispatches a window `site-language-changed` event.
  - Landing page DOM nodes annotated with `data-i18n="key"` update their text content instantly.
  - `QuoteApp.tsx` listens to the event and triggers a React state update for `siteLanguage`, causing all editor labels, placeholders, modals, and toasts to switch languages without page reloads.
  - **Zero FOUC**: An inline script in `Layout.astro` reads the stored language before first paint and immediately configures `<html lang="..." dir="...">`.
  - **Quotation Isolation**: The quotation's business content is deliberately never translated or overwritten.

### 4.5 Digital Signature Engine
- **Location**: `src/components/app/SignaturePad.tsx`
- **DPR & Coordinate Scaling**: Resolves client coordinate offsets between CSS display width (`w-full`) and internal canvas resolution (`600x160`):
  $$\text{x} = (\text{clientX} - \text{rect.left}) \times \left(\frac{\text{canvas.width}}{\text{rect.width}}\right)$$
  $$\text{y} = (\text{clientY} - \text{rect.top}) \times \left(\frac{\text{canvas.height}}{\text{rect.height}}\right)$$
- **Dual Mode**:
  - `typed`: Renders an italicized stylized signature with legal declaration.
  - `drawn`: Smooth quadratic Bézier stroke rendering on HTML5 Canvas exported as PNG Base64 Data URL.

### 4.6 Global Select & Option Styling
- **Location**: `src/styles/global.css`
- Modern cross-browser reset removing default platform arrows (`appearance: none`).
- Custom SVG chevron arrow with high-DPI sizing and padding.
- Dark mode theme styles targeting `.dark select` and `.dark select option` with `#18181b` canvas and `#27272a` borders.

### 4.7 Interactive Full-Page PDF Viewer & Pan-Zoom Engine
- **Location**: `src/components/app/PdfViewerModal.tsx`, `src/components/app/QuotePreview.tsx`
- **Google Drive Aesthetics**: Dark immersive `#1e1f20` canvas with floating header, document metadata, page indicator (`1 / 1`), zoom pill, print, and download actions.
- **Click-to-Zoom Geometry**: Clicks map client coordinates $(c_x, c_y)$ to unscaled document coordinates $(doc_x, doc_y)$:
  $$doc_x = \frac{c_x - pan_x}{s_1}, \quad doc_y = \frac{c_y - pan_y}{s_1}$$
  The target zoom translates the document so the clicked point stays aligned:
  $$pan_{x2} = c_x - doc_x \cdot s_2, \quad pan_{y2} = c_y - doc_y \cdot s_2$$
- **Boundary Containment (`clampPan`)**: Prevents dragging the document out of view. When document dimensions exceed viewport dimensions, pan is clamped between $[V_w - W_s - \text{padding}, \text{padding}]$. When smaller than the viewport, it stays strictly centered.
- **Double-Click & Drag-to-Pan**: Double clicking toggles between fit scale and 2x zoom centered on clicked coordinates. Dragging updates coordinates smoothly with instantaneous tracking (`transition: none`), and smooth cubic-bezier transitions when clicking zoom buttons.
- **Touch Support**: Supports two-finger pinch-to-zoom using Euclidean distance tracking, single-touch panning, and locks background body scroll only while the modal is open.
- **Zero Loss of Progress**: Returning from the viewer restores the user directly to the exact editor state without full-page reloads or data loss.

---

## 5. Development & Operations Guide

### 5.1 Dev Server Management (`AGENTS.md` Rules)
In accordance with project rules, always run the dev server in the background:

```powershell
# Start background server
npx astro dev --background

# Check background server status
npx astro dev status

# View recent background server logs
npx astro dev logs

# Stop background server
npx astro dev stop
```

### 5.2 Build & Verification
```powershell
# Perform full static production build
npm run build

# Preview production build locally
npm run preview
```

### 5.3 Gotchas & Development Tips
1. **Never use `window.alert()` or `window.confirm()`**: Use `ModernModal.tsx` for confirmations and `ToastNotification.tsx` for informational/error alerts.
2. **Never place `overflow-x: hidden` on `<main>` or parent containers**: Doing so creates a clipping context that breaks `position: sticky` on the live preview canvas.
3. **Always check for browser environment**: Guard browser APIs (`window`, `localStorage`, `document`) when authoring utility modules imported by Astro SSG pages.
4. **Vite Dynamic ESM Imports**: When importing `jspdf`, handle both default and named exports:
   ```ts
   const jspdfModule = await import('jspdf');
   const jsPDF = jspdfModule.jsPDF || jspdfModule.default || jspdfModule;
   ```
