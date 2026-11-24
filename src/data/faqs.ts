export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answerText: string;
  answerHtml: string;
}

export const faqs: FaqItem[] = [
  {
    id: 'faq-what-is-quote-generator',
    category: 'Overview',
    question: 'What is an online quotation generator and how does it work?',
    answerText:
      'An online quotation generator is a web-based business application that allows freelancers, contractors, agencies, and small business owners to quickly create, format, and calculate commercial price quotes and estimates. Instead of manually editing spreadsheets or documents, you fill in company details, client information, itemized services or products, quantities, rates, taxes, and discounts. The generator automatically computes subtotals, applied taxes, and the grand total in real time, producing an instant print-ready vector PDF quotation.',
    answerHtml:
      '<p>An <strong>online quotation generator</strong> is a web-based business application that allows freelancers, contractors, agencies, and small business owners to quickly create, format, and calculate commercial price quotes and estimates.</p><p>Instead of manually editing complex spreadsheets or Word documents, you simply enter your company details, client information, itemized goods or services, quantities, rates, and tax parameters. The generator automatically calculates subtotals, discounts, and tax liabilities in real time, instantly generating an exportable, professional vector PDF quotation ready to send to prospective clients.</p>'
  },
  {
    id: 'faq-create-quote-free',
    category: 'Getting Started',
    question: 'How do I create a professional business quote for free?',
    answerText:
      'Creating a professional quote on Quote Generator Free takes under two minutes: 1) Fill in your business name, contact information, and upload your company logo. 2) Enter client billing and optional shipping details. 3) Add line items with descriptions, quantities, unit metrics (hrs, items, projects), and rates. 4) Set applicable tax rates (VAT, GST, Sales Tax) and discount percentages or fixed amounts. 5) Choose one of 5 designer templates and customize your brand accent color. 6) Click "Download PDF" or "Print" to export your high-resolution quotation instantly with no account or payment required.',
    answerHtml:
      '<p>Creating a professional business quote is completely free and takes under two minutes with our step-by-step workflow:</p><ol class="list-decimal pl-5 space-y-1 my-2"><li><strong>Business Profile:</strong> Enter your company details, contact info, and upload your logo.</li><li><strong>Client Information:</strong> Add your client’s name, billing address, and optional project shipping location.</li><li><strong>Line Items:</strong> Itemize your services or products with clear descriptions, quantities, unit metrics (hrs, units, project), and unit rates.</li><li><strong>Taxes & Discounts:</strong> Configure regional tax rules (VAT, GST, sales tax) and apply percentage or fixed discounts.</li><li><strong>Branding:</strong> Select from 5 designer templates (Minimalist, Corporate, Creative, Nordic, Compact) and choose your brand accent color.</li><li><strong>Instant Export:</strong> Click <em>Download PDF</em> or <em>Print</em> to obtain your high-resolution quotation immediately.</li></ol>'
  },
  {
    id: 'faq-pdf-and-share',
    category: 'Export & Sharing',
    question: 'Can I download my quotation as a PDF or share it via a link?',
    answerText:
      'Yes. You can instantly export and download your quotation as a high-resolution, vector-quality PDF optimized for standard A4 and US Letter printing. The PDF is generated client-side in your browser for maximum privacy and speed. You can attach the downloaded PDF file directly to any email, WhatsApp message, Slack conversation, or CRM record. Furthermore, you can embed direct online payment links (such as Stripe, PayPal, or custom client portals) right inside the payment section of your quote so clients can settle balances with a single click.',
    answerHtml:
      '<p><strong>Yes.</strong> You can instantly download your quotation as a high-resolution, vector-quality PDF calibrated for standard A4 and US Letter printing. The generation occurs 100% client-side in your browser for instant speed and complete privacy.</p><p>Once downloaded, you can attach the PDF to an email, WhatsApp message, Slack message, or CRM deal. Additionally, you can embed direct payment links (such as Stripe, PayPal, or client portal URLs) in the quote payment section, allowing clients to approve and pay for your services seamlessly.</p>'
  },
  {
    id: 'faq-terms-payments-signatures',
    category: 'Compliance & Legal',
    question: 'Can I include terms and conditions, payment schedules, and digital signatures?',
    answerText:
      'Yes. Quote Generator Free provides specialized sections to include comprehensive commercial terms and conditions, validity duration, advance deposit requirements, and milestone payment schedules. It also includes bank payment details (bank name, account number, IBAN, and SWIFT code) and a built-in interactive Digital Signature Pad that supports both hand-drawn signatures (touchscreen or mouse) and legally formal typed signatures with authorized title and timestamp.',
    answerHtml:
      '<p><strong>Yes.</strong> Quote Generator Free includes comprehensive fields designed for legal clarity and commercial protection:</p><ul class="list-disc pl-5 space-y-1 my-2"><li><strong>Terms & Conditions:</strong> Specify payment schedules, delivery milestones, project scope boundaries, and quotation validity windows (e.g., 30 calendar days).</li><li><strong>Payment Instructions:</strong> Include bank name, account holder, account number, IBAN, SWIFT/BIC codes, and online payment links.</li><li><strong>Digital Signature Pad:</strong> Built-in touchscreen- and mouse-compatible electronic signature pad supporting drawn signatures or typed legal authorizations with signer title and timestamp.</li></ul>'
  },
  {
    id: 'faq-standard-quote-elements',
    category: 'Best Practices',
    question: 'What should be included in a standard business quotation?',
    answerText:
      'A standard, professional business quotation should include: 1) Header with company name, branding logo, contact information, and tax ID (VAT/GST/EIN). 2) Document metadata including a unique quotation number, issue date, and validity expiration date. 3) Client information including company name, contact person, and billing/shipping address. 4) An itemized schedule of services or goods with descriptions, units, quantities, and unit rates. 5) Financial summary detailing subtotal, taxes (GST/VAT), discounts, shipping fees, and final balance due. 6) Payment methods and banking instructions. 7) Terms and conditions alongside a client acceptance signature block.',
    answerHtml:
      '<p>A complete, professional business quotation should always include the following core elements:</p><ul class="list-disc pl-5 space-y-1 my-2"><li><strong>Header & Branding:</strong> Company name, logo, contact information, website, and business tax registration ID (VAT, GST, or EIN).</li><li><strong>Document Tracking:</strong> Unique quote reference number (e.g., <code>Q-2026-001</code>), issue date, and quote expiry/validity date.</li><li><strong>Client Information:</strong> Client name, company, email, phone, and billing or site address.</li><li><strong>Itemized Scope:</strong> Granular line items detailing descriptions, unit metrics (hours, days, units), quantities, and unit prices.</li><li><strong>Financial Breakdown:</strong> Subtotal, itemized tax rates (VAT/GST/Sales Tax), applied discounts, shipping fees, and grand total.</li><li><strong>Payment & Legal Terms:</strong> Payment terms (e.g., net 30, deposit upon kickoff), accepted payment channels, and an authorized client signature approval line.</li></ul>'
  },
  {
    id: 'faq-logo-and-brand-customization',
    category: 'Customization',
    question: 'Can I customize the quotation template with my company logo and brand colors?',
    answerText:
      'Yes! Quote Generator Free features a Universal Logo Engine that accepts high-resolution PNG, JPG, JPEG, SVG vector graphics, WebP, and GIF files. You can adjust the logo width, scale, and alignment (left, center, or right). Additionally, you can choose from 5 designer quotation templates (Minimalist, Corporate, Creative, Nordic, and Compact) and personalize table accents, header banners, borders, and badges using an interactive color picker or custom HEX code.',
    answerHtml:
      '<p><strong>Yes.</strong> You have complete aesthetic control over your quotation branding:</p><ul class="list-disc pl-5 space-y-1 my-2"><li><strong>Universal Logo Engine:</strong> Upload company logos in PNG, JPG, JPEG, SVG vector graphics, WebP, or GIF formats. Easily adjust dimensions, scaling, and alignment (left, center, right).</li><li><strong>5 Designer Templates:</strong> Switch instantly between Minimalist, Corporate, Creative, Nordic, and Compact layouts to reflect your industry aesthetic.</li><li><strong>Brand Color Palettes:</strong> Choose from preset color palettes or supply your exact corporate HEX color code to style header accents, line items, and signature elements.</li></ul>'
  },
  {
    id: 'faq-taxes-gst-vat-discounts',
    category: 'Calculations',
    question: 'Does the quotation generator automatically calculate taxes, GST/VAT, and discounts?',
    answerText:
      'Yes. The intelligent calculation engine computes all financial totals in real time. It calculates line item totals, supports line-level tax exemption toggles, enables multiple simultaneous tax tiers (VAT, GST, CGST/SGST, Provincial/State Sales Tax), computes flat or percentage discounts, and accounts for shipping charges and advance deposits to produce a mathematically verified total balance due.',
    answerHtml:
      '<p><strong>Yes.</strong> The intelligent calculation engine handles all financial mathematics dynamically in real time:</p><ul class="list-disc pl-5 space-y-1 my-2"><li><strong>Line-by-Line Calculations:</strong> Multiplies quantity by unit rate and displays calculated line amounts automatically.</li><li><strong>Tax-Exemption Toggles:</strong> Choose whether each specific line item is taxable or tax-exempt.</li><li><strong>Multi-Tax Tiers:</strong> Add multiple tax lines (e.g., VAT, GST, CGST/SGST, PST, or local sales taxes) with custom percentage rates.</li><li><strong>Flexible Discounts:</strong> Apply discounts as either an overall percentage (%) or a fixed flat deduction.</li><li><strong>Shipping & Deposits:</strong> Factor in shipping costs and record advance payments to display the remaining balance due accurately.</li></ul>'
  },
  {
    id: 'faq-multiple-currencies',
    category: 'International',
    question: 'Can I create quotes in multiple currencies for international clients?',
    answerText:
      'Yes. Quote Generator Free supports over 150 international currencies, including USD ($), EUR (€), GBP (£), CAD ($), AUD ($), JPY (¥), INR (₹), AED (د.إ), CHF, SGD, and more. When you select a currency, the quote automatically formats all line item rates, subtotals, tax breakdowns, and final totals with the correct currency symbol and localized number formatting.',
    answerHtml:
      '<p><strong>Yes.</strong> Quote Generator Free supports over <strong>150 world currencies</strong>, including US Dollar ($), Euro (€), British Pound (£), Canadian Dollar (CAD $), Australian Dollar (AUD $), Japanese Yen (¥), Indian Rupee (₹), UAE Dirham (د.إ), Swiss Franc (CHF), and Singapore Dollar (SGD $).</p><p>Switching currencies automatically updates all line items, tax breakdowns, subtotals, and total sums with appropriate currency symbols and standard financial notation, making international quoting effortless.</p>'
  },
  {
    id: 'faq-quote-vs-estimate-vs-invoice',
    category: 'Overview',
    question: 'What is the difference between a quotation, an estimate, and an invoice?',
    answerText:
      'While all three are essential commercial documents, they serve different stages of client engagement: 1) An Estimate is an initial, non-binding approximation of project costs that can fluctuate as scope changes. 2) A Quotation (Quote) is a formal, fixed-price proposal that legally binds the seller to the agreed price if accepted within the validity window. 3) An Invoice is a formal request for payment issued after deliverables are completed or according to agreed milestone schedules. You can toggle your document title between Quote, Estimate, Proforma Invoice, and Invoice with one click.',
    answerHtml:
      '<p>Although related, these three financial documents fulfill distinct roles in the sales workflow:</p><ul class="list-disc pl-5 space-y-1 my-2"><li><strong>Estimate:</strong> A preliminary projection of expected costs subject to scope evolution. It is non-binding and intended to give clients an approximate price range.</li><li><strong>Quotation (Quote):</strong> A formal, fixed-price commercial offer. Once accepted by the client within the stated validity timeframe, it becomes a binding commitment to deliver work at that exact price.</li><li><strong>Invoice:</strong> A formal payment demand issued upon project milestone delivery or final completion, containing payment terms and due dates.</li></ul><p>With Quote Generator Free, you can toggle between <em>Quote</em>, <em>Estimate</em>, <em>Proforma Invoice</em>, and <em>Invoice</em> document headers in one click.</p>'
  },
  {
    id: 'faq-convert-quote-to-invoice',
    category: 'Billing',
    question: 'Can I convert an approved quotation directly into an invoice?',
    answerText:
      'Yes. Converting an approved quotation into an invoice takes only seconds. Because all line items, pricing, client details, and tax calculations are preserved in your current session, you simply change the document title from "QUOTE" to "INVOICE", update the document number (e.g. from Q-2026-001 to INV-2026-001), set your payment due date, and download or print the final invoice without re-entering any data.',
    answerHtml:
      '<p><strong>Yes.</strong> Converting an approved quote into a billable invoice takes just a few seconds:</p><ol class="list-decimal pl-5 space-y-1 my-2"><li>Change the document title selector from <strong>QUOTE</strong> to <strong>INVOICE</strong>.</li><li>Update the reference number (e.g., from <code>Q-2026-001</code> to <code>INV-2026-001</code>).</li><li>Set the payment due date and any updated milestone notes.</li><li>Click <strong>Download PDF</strong> or <strong>Print</strong> to generate the completed invoice immediately.</li></ol><p>All line items, client details, calculations, and tax percentages remain perfectly intact without manual re-entry.</p>'
  },
  {
    id: 'faq-no-signup-required',
    category: 'Privacy & Security',
    question: 'Do I need to sign up or create an account to generate a quote?',
    answerText:
      'No registration, sign-up, or account creation is required. You can start creating quotes immediately upon visiting the website. Quote Generator Free runs 100% client-side in your web browser. None of your sensitive commercial data, client information, pricing, or uploaded logos are sent to or stored on external servers. Everything is saved locally on your device in your browser local storage.',
    answerHtml:
      '<p><strong>No.</strong> Quote Generator Free is completely registration-free. You do not need to create an account, provide an email address, or input a credit card to create and download unlimited quotes.</p><p>The application runs <strong>100% in your browser</strong>. Your company information, client database, pricing, and uploaded logos are processed client-side and saved exclusively in your browser’s private <code>localStorage</code>—ensuring maximum commercial privacy and data security.</p>'
  },
  {
    id: 'faq-mobile-phone-support',
    category: 'Accessibility',
    question: 'Can I create and send quotations from my mobile phone?',
    answerText:
      'Yes. Quote Generator Free is fully responsive and optimized for mobile devices and tablets across iOS (iPhone, iPad) and Android. You can enter quote items, upload logos from your photo gallery, sign documents using your finger on the touch-friendly signature pad, preview the formatted quotation, and download or share the PDF directly from your mobile browser while on the road or at a job site.',
    answerHtml:
      '<p><strong>Yes.</strong> The application is fully responsive and specifically designed to work seamlessly on smartphones and tablets (iOS and Android).</p><p>You can add line items on the go, upload company logos directly from your phone’s camera or photo library, sign proposals using your finger on the touch-sensitive signature pad, preview the live quotation, and download or email the finished PDF quotation directly from your mobile device.</p>'
  }
];
