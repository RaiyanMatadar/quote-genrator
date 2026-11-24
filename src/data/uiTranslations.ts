// Comprehensive Website UI Localization Dictionary
export interface SiteUiDictionary {
  // Navigation
  brandName: string;
  badgeFree: string;
  navGenerator: string;
  navFeatures: string;
  navTemplates: string;
  navFaq: string;
  btnCreateQuote: string;

  // Hero
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtitle: string;
  badgeLogoEngine: string;
  badgePdfPreview: string;
  badgeLanguages: string;
  badgePrivate: string;

  // Toolbar
  template: string;
  accentColor: string;
  currency: string;
  websiteLanguage: string;
  btnHistory: string;
  btnNew: string;
  btnDuplicate: string;
  btnPrint: string;
  btnDownloadPdf: string;
  generatingPdf: string;
  savedDraftsTitle: string;
  noDrafts: string;
  close: string;

  // Mobile Tabs
  tabEdit: string;
  tabPreview: string;

  // Editor Sections
  statusSaving: string;
  statusSaved: string;
  statusReady: string;
  formEditorTitle: string;
  docTitleLabel: string;
  quoteNumberLabel: string;
  poNumberLabel: string;
  dateLabel: string;
  validUntilLabel: string;

  // From / To
  fromTitle: string;
  fromNamePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  addressPlaceholder: string;
  cityZipPlaceholder: string;
  taxIdPlaceholder: string;
  toTitle: string;
  toNamePlaceholder: string;
  shipToToggle: string;
  shippingDestination: string;

  // Line items
  lineItemsTitle: string;
  btnAddItem: string;
  btnAddAnotherItem: string;
  colIndex: string;
  colDescription: string;
  colQty: string;
  colUnit: string;
  colRate: string;
  colAmount: string;
  colTax: string;
  colActions: string;
  itemPlaceholder: string;
  detailsPlaceholder: string;

  // Financials
  financialsTitle: string;
  clientDiscount: string;
  fixed: string;
  taxesTitle: string;
  btnAddTaxRow: string;
  shippingFee: string;
  depositPaid: string;
  subtotal: string;
  discount: string;
  total: string;
  amountPaid: string;
  balanceDue: string;

  // Payment, Notes, Signature
  notesAndTermsTitle: string;
  notesLabel: string;
  notesPlaceholder: string;
  termsLabel: string;
  termsPlaceholder: string;
  bankNameLabel: string;
  accountNumberLabel: string;
  paymentLinkLabel: string;
  signatureTitle: string;
  includeSignature: string;
  typeName: string;
  drawSignature: string;
  clear: string;
  drawHint: string;
  typePlaceholder: string;
  signerTitle: string;
  signedDate: string;
  statement: string;

  // Preview header
  livePreview: string;
  fitWidth: string;
  zoomOut: string;
  zoomIn: string;

  // Features
  featuresEyebrow: string;
  featuresTitle: string;
  featuresSubtitle: string;

  // How it works
  howTitle: string;
  howSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // FAQ
  faqEyebrow: string;
  faqTitle: string;

  // Footer
  footerCopyright: string;
  footerNotice: string;
  themeToggle: string;
}

export const SITE_UI_TRANSLATIONS: Record<string, SiteUiDictionary> = {
  en: {
    brandName: 'Quote Generator Free',
    badgeFree: 'Free',
    navGenerator: 'Generator',
    navFeatures: 'Features',
    navTemplates: 'Templates',
    navFaq: 'FAQ',
    btnCreateQuote: 'Create Quote',

    heroEyebrow: '100% Free · No Sign-Up · Zero Server Latency',
    heroHeadline: 'Create Professional Quotations in Seconds.',
    heroSubtitle: 'A fast, free online quotation generator for freelancers, agencies, and businesses. Add your logo, calculate taxes, customize designer templates, preview in real time, and download high-resolution PDFs instantly.',
    badgeLogoEngine: 'Universal Logo Engine',
    badgePdfPreview: 'Live A4 PDF Preview',
    badgeLanguages: '12+ Languages & Currencies',
    badgePrivate: '100% Private (Runs In Browser)',

    template: 'Template',
    accentColor: 'Accent Color',
    currency: 'Currency',
    websiteLanguage: 'Site Language',
    btnHistory: 'History',
    btnNew: 'New',
    btnDuplicate: 'Duplicate',
    btnPrint: 'Print',
    btnDownloadPdf: 'Download PDF',
    generatingPdf: 'Generating PDF...',
    savedDraftsTitle: 'Saved Quotation Drafts',
    noDrafts: 'No previous drafts saved yet.',
    close: 'Close',

    tabEdit: 'Edit Quotation',
    tabPreview: 'Live PDF Preview',

    statusSaving: 'Saving...',
    statusSaved: 'Saved in browser',
    statusReady: 'Ready',
    formEditorTitle: 'QUOTATION FORM EDITOR',
    docTitleLabel: 'Document Title',
    quoteNumberLabel: 'Quote #',
    poNumberLabel: 'P.O. Number',
    dateLabel: 'Date',
    validUntilLabel: 'Valid Until',

    fromTitle: 'From (Your Business)',
    fromNamePlaceholder: 'Your Business / Full Name',
    emailPlaceholder: 'Email address',
    phonePlaceholder: 'Phone number',
    addressPlaceholder: 'Street address',
    cityZipPlaceholder: 'City, State, Zip',
    taxIdPlaceholder: 'Tax ID / VAT / GSTIN',
    toTitle: 'Quote To (Client)',
    toNamePlaceholder: 'Client or Company Name',
    shipToToggle: 'Ship To Address',
    shippingDestination: 'Shipping Destination',

    lineItemsTitle: 'Line Items',
    btnAddItem: 'Add Item',
    btnAddAnotherItem: 'Add Another Line Item',
    colIndex: '#',
    colDescription: 'Description & Details',
    colQty: 'Qty',
    colUnit: 'Unit',
    colRate: 'Rate',
    colAmount: 'Amount',
    colTax: 'Tax',
    colActions: 'Actions',
    itemPlaceholder: 'Item or service name...',
    detailsPlaceholder: 'Additional details (optional)...',

    financialsTitle: 'Discounts, Taxes & Financials',
    clientDiscount: 'Client Discount',
    fixed: 'Fixed',
    taxesTitle: 'Taxes / VAT / GST',
    btnAddTaxRow: 'Add Tax Row',
    shippingFee: 'Shipping Fee',
    depositPaid: 'Deposit / Amount Paid',
    subtotal: 'Subtotal',
    discount: 'Discount',
    total: 'Total',
    amountPaid: 'Amount Paid',
    balanceDue: 'Balance Due',

    notesAndTermsTitle: 'Notes, Payment Terms & Wire Instructions',
    notesLabel: 'Notes / Remarks',
    notesPlaceholder: 'e.g. Thank you for your business. We look forward to working with you!',
    termsLabel: 'Terms & Conditions',
    termsPlaceholder: 'e.g. Payment due within 30 days. 50% advance deposit required for kickoff.',
    bankNameLabel: 'Bank Name',
    accountNumberLabel: 'Account / Wire Number',
    paymentLinkLabel: 'Payment Link / Stripe / PayPal',
    signatureTitle: 'Client Acceptance & Signature',
    includeSignature: 'Include Signature Section',
    typeName: 'Type Name',
    drawSignature: 'Draw Signature',
    clear: 'Clear',
    drawHint: 'Sign with your mouse, trackpad, or finger on touch screens.',
    typePlaceholder: 'Enter authorized signatory name...',
    signerTitle: 'Signer Title / Role',
    signedDate: 'Signed Date',
    statement: 'Acceptance Statement',

    livePreview: 'Live Preview',
    fitWidth: 'Fit Width',
    zoomOut: 'Zoom Out',
    zoomIn: 'Zoom In',

    featuresEyebrow: 'Why Quote Generator Free',
    featuresTitle: 'Everything you need to send winning estimates',
    featuresSubtitle: 'Engineered with zero fluff. Every feature is built to give your business an edge without subscriptions or registrations.',

    howTitle: 'How to generate quotations in minutes',
    howSubtitle: 'Simple 3-Step Workflow',
    step1Title: 'Fill in Details & Logo',
    step1Desc: 'Enter your company info, client details, upload your brand logo, and customize the quote title, number, and issue date.',
    step2Title: 'Add Items, Discounts & Taxes',
    step2Desc: 'List your products or services, set quantities, units, and rates. Apply percentage or fixed discounts, multi-tax rows, and deposits.',
    step3Title: 'Preview & Download PDF',
    step3Desc: 'Pick your favorite designer template, inspect the real-time A4 preview, and click Download PDF or Print for instant vector export.',

    faqEyebrow: 'Got Questions?',
    faqTitle: 'Frequently Asked Questions',

    footerCopyright: 'Quote Generator Free. 100% Free & Open In-Browser Tool.',
    footerNotice: 'No cookies · No database storage · Zero tracking',
    themeToggle: 'Toggle Theme'
  },
  es: {
    brandName: 'Quote Generator Free',
    badgeFree: 'Gratis',
    navGenerator: 'Generador',
    navFeatures: 'Características',
    navTemplates: 'Plantillas',
    navFaq: 'Preguntas',
    btnCreateQuote: 'Crear Cotización',

    heroEyebrow: '100% Gratis · Sin Registro · Cero Latencia',
    heroHeadline: 'Crea Cotizaciones Profesionales en Segundos.',
    heroSubtitle: 'Un generador de presupuestos online gratuito para autónomos, agencias y empresas. Agrega tu logo, calcula impuestos, personaliza plantillas y descarga PDFs al instante.',
    badgeLogoEngine: 'Motor de Logo Universal',
    badgePdfPreview: 'Vista Previa PDF A4',
    badgeLanguages: '12+ Idiomas y Monedas',
    badgePrivate: '100% Privado en Navegador',

    template: 'Plantilla',
    accentColor: 'Color de Acento',
    currency: 'Moneda',
    websiteLanguage: 'Idioma del Sitio',
    btnHistory: 'Historial',
    btnNew: 'Nuevo',
    btnDuplicate: 'Duplicar',
    btnPrint: 'Imprimir',
    btnDownloadPdf: 'Descargar PDF',
    generatingPdf: 'Generando PDF...',
    savedDraftsTitle: 'Borradores Guardados',
    noDrafts: 'Aún no hay borradores guardados.',
    close: 'Cerrar',

    tabEdit: 'Editar Cotización',
    tabPreview: 'Vista Previa PDF',

    statusSaving: 'Guardando...',
    statusSaved: 'Guardado en navegador',
    statusReady: 'Listo',
    formEditorTitle: 'EDITOR DE COTIZACIÓN',
    docTitleLabel: 'Título del Documento',
    quoteNumberLabel: 'Cotización N°',
    poNumberLabel: 'Orden de Compra',
    dateLabel: 'Fecha',
    validUntilLabel: 'Válido Hasta',

    fromTitle: 'De (Tu Empresa)',
    fromNamePlaceholder: 'Tu Empresa / Nombre Completo',
    emailPlaceholder: 'Correo electrónico',
    phonePlaceholder: 'Teléfono',
    addressPlaceholder: 'Dirección',
    cityZipPlaceholder: 'Ciudad, Estado, C.P.',
    taxIdPlaceholder: 'RFC / NIF / CIF / RUT',
    toTitle: 'Cotizar a (Cliente)',
    toNamePlaceholder: 'Nombre del Cliente o Empresa',
    shipToToggle: 'Dirección de Envío',
    shippingDestination: 'Destino de Envío',

    lineItemsTitle: 'Artículos y Servicios',
    btnAddItem: 'Agregar Artículo',
    btnAddAnotherItem: 'Agregar Otro Artículo',
    colIndex: '#',
    colDescription: 'Descripción y Detalles',
    colQty: 'Cant.',
    colUnit: 'Unidad',
    colRate: 'Precio',
    colAmount: 'Importe',
    colTax: 'Imp.',
    colActions: 'Acciones',
    itemPlaceholder: 'Nombre del artículo o servicio...',
    detailsPlaceholder: 'Detalles adicionales (opcional)...',

    financialsTitle: 'Descuentos, Impuestos y Totales',
    clientDiscount: 'Descuento al Cliente',
    fixed: 'Fijo',
    taxesTitle: 'Impuestos / IVA',
    btnAddTaxRow: 'Agregar Fila de Impuesto',
    shippingFee: 'Costo de Envío',
    depositPaid: 'Anticipo Pagado',
    subtotal: 'Subtotal',
    discount: 'Descuento',
    total: 'Total',
    amountPaid: 'Monto Pagado',
    balanceDue: 'Saldo Pendiente',

    notesAndTermsTitle: 'Notas, Términos y Datos de Pago',
    notesLabel: 'Notas / Observaciones',
    notesPlaceholder: 'ej. ¡Gracias por confiar en nosotros!',
    termsLabel: 'Términos y Condiciones',
    termsPlaceholder: 'ej. Pago a 30 días. Se requiere 50% de anticipo para iniciar.',
    bankNameLabel: 'Nombre del Banco',
    accountNumberLabel: 'N° de Cuenta / Clabe',
    paymentLinkLabel: 'Enlace de Pago / Stripe / PayPal',
    signatureTitle: 'Firma y Aceptación del Cliente',
    includeSignature: 'Incluir Sección de Firma',
    typeName: 'Escribir Nombre',
    drawSignature: 'Dibujar Firma',
    clear: 'Borrar',
    drawHint: 'Firma con el ratón o con el dedo en pantallas táctiles.',
    typePlaceholder: 'Ingresa el nombre del firmante...',
    signerTitle: 'Cargo / Rol',
    signedDate: 'Fecha de Firma',
    statement: 'Declaración de Aceptación',

    livePreview: 'Vista Previa',
    fitWidth: 'Ajustar Ancho',
    zoomOut: 'Alejar',
    zoomIn: 'Acercar',

    featuresEyebrow: 'Por Qué Elegirnos',
    featuresTitle: 'Todo lo necesario para enviar cotizaciones exitosas',
    featuresSubtitle: 'Diseñado sin complicaciones. Cada función está pensada para dar ventaja a tu negocio sin suscripciones.',

    howTitle: 'Cómo generar cotizaciones en minutos',
    howSubtitle: 'Flujo Simple en 3 Pasos',
    step1Title: 'Completa Datos y Logo',
    step1Desc: 'Ingresa los datos de tu empresa, cliente, sube tu logo y ajusta fechas.',
    step2Title: 'Agrega Artículos e Impuestos',
    step2Desc: 'Detalla servicios o productos, aplica descuentos, impuestos y anticipos.',
    step3Title: 'Previsualiza y Descarga',
    step3Desc: 'Elige plantilla, revisa la vista A4 y descarga el PDF de alta resolución.',

    faqEyebrow: '¿Tienes Dudas?',
    faqTitle: 'Preguntas Frecuentes',

    footerCopyright: 'Quote Generator Free. Herramienta 100% gratuita y privada.',
    footerNotice: 'Sin cookies · Sin base de datos · Cero rastreo',
    themeToggle: 'Cambiar Tema'
  },
  fr: {
    brandName: 'Quote Generator Free',
    badgeFree: 'Gratuit',
    navGenerator: 'Générateur',
    navFeatures: 'Fonctionnalités',
    navTemplates: 'Modèles',
    navFaq: 'FAQ',
    btnCreateQuote: 'Créer un Devis',

    heroEyebrow: '100% Gratuit · Sans Inscription · Zéro Latence',
    heroHeadline: 'Créez des Devis Professionnels en Quelques Secondes.',
    heroSubtitle: 'Un générateur de devis en ligne gratuit pour freelances, agences et entreprises. Ajoutez votre logo, calculez la TVA, personnalisez vos modèles et téléchargez votre PDF instantanément.',
    badgeLogoEngine: 'Moteur de Logo Universel',
    badgePdfPreview: 'Aperçu PDF A4 en Direct',
    badgeLanguages: '12+ Langues & Devises',
    badgePrivate: '100% Privé dans le Navigateur',

    template: 'Modèle',
    accentColor: 'Couleur',
    currency: 'Devise',
    websiteLanguage: 'Langue du Site',
    btnHistory: 'Historique',
    btnNew: 'Nouveau',
    btnDuplicate: 'Dupliquer',
    btnPrint: 'Imprimer',
    btnDownloadPdf: 'Télécharger PDF',
    generatingPdf: 'Génération en cours...',
    savedDraftsTitle: 'Brouillons Enregistrés',
    noDrafts: 'Aucun brouillon enregistré.',
    close: 'Fermer',

    tabEdit: 'Modifier Devis',
    tabPreview: 'Aperçu PDF',

    statusSaving: 'Sauvegarde...',
    statusSaved: 'Enregistré dans le navigateur',
    statusReady: 'Prêt',
    formEditorTitle: 'ÉDITEUR DE DEVIS',
    docTitleLabel: 'Titre du Document',
    quoteNumberLabel: 'Devis n°',
    poNumberLabel: 'N° Commande',
    dateLabel: 'Date',
    validUntilLabel: 'Validité',

    fromTitle: 'De (Votre Entreprise)',
    fromNamePlaceholder: 'Nom de votre entreprise',
    emailPlaceholder: 'Adresse email',
    phonePlaceholder: 'Téléphone',
    addressPlaceholder: 'Adresse',
    cityZipPlaceholder: 'Code postal & Ville',
    taxIdPlaceholder: 'N° TVA / SIRET',
    toTitle: 'Pour (Client)',
    toNamePlaceholder: 'Nom du client ou entreprise',
    shipToToggle: 'Adresse de livraison',
    shippingDestination: 'Lieu de livraison',

    lineItemsTitle: 'Prestations & Articles',
    btnAddItem: 'Ajouter une Ligne',
    btnAddAnotherItem: 'Ajouter une Autre Ligne',
    colIndex: '#',
    colDescription: 'Description & Détails',
    colQty: 'Qté',
    colUnit: 'Unité',
    colRate: 'Prix Unit.',
    colAmount: 'Montant',
    colTax: 'TVA',
    colActions: 'Actions',
    itemPlaceholder: 'Nom de la prestation...',
    detailsPlaceholder: 'Détails complémentaires...',

    financialsTitle: 'Remises, Taxes & Totaux',
    clientDiscount: 'Remise Client',
    fixed: 'Fixe',
    taxesTitle: 'Taxes / TVA',
    btnAddTaxRow: 'Ajouter une Taxe',
    shippingFee: 'Frais de Port',
    depositPaid: 'Acompte Versé',
    subtotal: 'Sous-total',
    discount: 'Remise',
    total: 'Total',
    amountPaid: 'Montant Payé',
    balanceDue: 'Reste à Payer',

    notesAndTermsTitle: 'Remarques, Conditions & Coordonnées Bancaires',
    notesLabel: 'Remarques',
    notesPlaceholder: 'ex. Merci pour votre confiance !',
    termsLabel: 'Conditions Générales',
    termsPlaceholder: 'ex. Paiement à 30 jours. Acompte de 30% requis à la commande.',
    bankNameLabel: 'Nom de la Banque',
    accountNumberLabel: 'IBAN / N° de Compte',
    paymentLinkLabel: 'Lien de Paiement',
    signatureTitle: 'Signature et Accord Client',
    includeSignature: 'Inclure la Section Signature',
    typeName: 'Saisir le Nom',
    drawSignature: 'Dessiner la Signature',
    clear: 'Effacer',
    drawHint: 'Signez à la souris ou avec le doigt sur écran tactile.',
    typePlaceholder: 'Nom du signataire autorisé...',
    signerTitle: 'Titre / Fonction',
    signedDate: 'Date de Signature',
    statement: 'Mention d’Acceptation',

    livePreview: 'Aperçu en Direct',
    fitWidth: 'Ajuster',
    zoomOut: 'Zoom -',
    zoomIn: 'Zoom +',

    featuresEyebrow: 'Nos Avantages',
    featuresTitle: 'Tout pour concevoir des devis percutants',
    featuresSubtitle: 'Efficace et direct. Conçu pour valoriser votre travail sans abonnement.',

    howTitle: 'Comment générer un devis en quelques minutes',
    howSubtitle: 'Méthode en 3 Étapes',
    step1Title: 'Renseignez Coordonnées & Logo',
    step1Desc: 'Saisissez vos informations, celles du client, et importez votre logo.',
    step2Title: 'Ajoutez Prestations & Remises',
    step2Desc: 'Détaillez les tarifs, la TVA, les remises et les éventuels acomptes.',
    step3Title: 'Visualisez & Téléchargez',
    step3Desc: 'Choisissez un modèle soigné et téléchargez immédiatement votre PDF.',

    faqEyebrow: 'Des Questions ?',
    faqTitle: 'Foire Aux Questions',

    footerCopyright: 'Quote Generator Free. Outil 100% gratuit et privé.',
    footerNotice: 'Pas de cookies · Aucune base de données',
    themeToggle: 'Changer le Thème'
  },
  de: {
    brandName: 'Quote Generator Free',
    badgeFree: 'Kostenlos',
    navGenerator: 'Generator',
    navFeatures: 'Funktionen',
    navTemplates: 'Vorlagen',
    navFaq: 'FAQ',
    btnCreateQuote: 'Angebot erstellen',

    heroEyebrow: '100% Kostenlos · Ohne Registrierung · Sofortige Generierung',
    heroHeadline: 'Professionelle Angebote in Sekundenschnelle.',
    heroSubtitle: 'Ein schneller, kostenloser Online-Angebotsgenerator für Freelancer, Agenturen und Unternehmen. Logo hochladen, Steuern berechnen, Vorlagen wählen und PDF sofort herunterladen.',
    badgeLogoEngine: 'Universelle Logo-Unterstützung',
    badgePdfPreview: 'Live A4 PDF-Vorschau',
    badgeLanguages: '12+ Sprachen & Währungen',
    badgePrivate: '100% Privat im Browser',

    template: 'Vorlage',
    accentColor: 'Akzentfarbe',
    currency: 'Währung',
    websiteLanguage: 'Webseiten-Sprache',
    btnHistory: 'Verlauf',
    btnNew: 'Neu',
    btnDuplicate: 'Duplizieren',
    btnPrint: 'Drucken',
    btnDownloadPdf: 'PDF herunterladen',
    generatingPdf: 'PDF wird erstellt...',
    savedDraftsTitle: 'Gespeicherte Entwürfe',
    noDrafts: 'Noch keine Entwürfe vorhanden.',
    close: 'Schließen',

    tabEdit: 'Angebot bearbeiten',
    tabPreview: 'Live PDF-Vorschau',

    statusSaving: 'Wird gespeichert...',
    statusSaved: 'Im Browser gespeichert',
    statusReady: 'Bereit',
    formEditorTitle: 'ANGEBOTS-EDITOR',
    docTitleLabel: 'Dokumententitel',
    quoteNumberLabel: 'Angebots-Nr.',
    poNumberLabel: 'Bestell-Nr.',
    dateLabel: 'Datum',
    validUntilLabel: 'Gültig bis',

    fromTitle: 'Von (Ihr Unternehmen)',
    fromNamePlaceholder: 'Ihr Name oder Firmenname',
    emailPlaceholder: 'E-Mail-Adresse',
    phonePlaceholder: 'Telefonnummer',
    addressPlaceholder: 'Straße & Hausnummer',
    cityZipPlaceholder: 'PLZ & Ort',
    taxIdPlaceholder: 'USt-IdNr. / Steuernummer',
    toTitle: 'Angebot für (Kunde)',
    toNamePlaceholder: 'Kunden- oder Firmenname',
    shipToToggle: 'Lieferadresse angeben',
    shippingDestination: 'Lieferadresse',

    lineItemsTitle: 'Positionen & Leistungen',
    btnAddItem: 'Position hinzufügen',
    btnAddAnotherItem: 'Weitere Position hinzufügen',
    colIndex: '#',
    colDescription: 'Beschreibung & Details',
    colQty: 'Menge',
    colUnit: 'Einheit',
    colRate: 'Einzelpreis',
    colAmount: 'Gesamtpreis',
    colTax: 'MwSt.',
    colActions: 'Aktionen',
    itemPlaceholder: 'Bezeichnung der Leistung...',
    detailsPlaceholder: 'Zusätzliche Details...',

    financialsTitle: 'Rabatte, Steuern & Endsumme',
    clientDiscount: 'Kundenrabatt',
    fixed: 'Festbetrag',
    taxesTitle: 'Umsatzsteuer / MwSt.',
    btnAddTaxRow: 'Steuersatz hinzufügen',
    shippingFee: 'Versandkosten',
    depositPaid: 'Anzahlung',
    subtotal: 'Zwischensumme',
    discount: 'Rabatt',
    total: 'Gesamtbetrag',
    amountPaid: 'Gezahlt',
    balanceDue: 'Fälliger Betrag',

    notesAndTermsTitle: 'Hinweise, Zahlungsbedingungen & Bankdaten',
    notesLabel: 'Hinweise',
    notesPlaceholder: 'z.B. Vielen Dank für Ihr Vertrauen!',
    termsLabel: 'Geschäftsbedingungen',
    termsPlaceholder: 'z.B. Zahlbar innerhalb von 14 Tagen ohne Abzug.',
    bankNameLabel: 'Bankname',
    accountNumberLabel: 'IBAN / Kontonummer',
    paymentLinkLabel: 'Zahlungslink',
    signatureTitle: 'Unterschrift & Auftragsbestätigung',
    includeSignature: 'Unterschriftenfeld anzeigen',
    typeName: 'Name eingeben',
    drawSignature: 'Unterschrift zeichnen',
    clear: 'Löschen',
    drawHint: 'Mit Maus oder Finger unterschreiben.',
    typePlaceholder: 'Name des Zeichnungsberechtigten...',
    signerTitle: 'Position / Rolle',
    signedDate: 'Datum',
    statement: 'Bestätigungserklärung',

    livePreview: 'Live-Vorschau',
    fitWidth: 'Anpassen',
    zoomOut: 'Verkleinern',
    zoomIn: 'Vergrößern',

    featuresEyebrow: 'Ihre Vorteile',
    featuresTitle: 'Alles für professionelle Angebote',
    featuresSubtitle: 'Direkt im Browser, ohne Registrierung und ohne Verpflichtungen.',

    howTitle: 'In 3 Schritten zum fertigen Angebot',
    howSubtitle: 'Einfacher Ablauf',
    step1Title: 'Daten & Logo eingeben',
    step1Desc: 'Firmendaten eintragen, Logo hochladen und Angebotsdaten festlegen.',
    step2Title: 'Positionen & Rabatte erfassen',
    step2Desc: 'Leistungen aufführen, MwSt. berechnen und Rabatte gewähren.',
    step3Title: 'Prüfen & PDF laden',
    step3Desc: 'Designvorlage wählen, A4-Vorschau prüfen und PDF herunterladen.',

    faqEyebrow: 'Häufige Fragen',
    faqTitle: 'Fragen & Antworten',

    footerCopyright: 'Quote Generator Free. 100% kostenlos und datenschutzfreundlich.',
    footerNotice: 'Keine Cookies · Keine Cloud-Speicherung',
    themeToggle: 'Design umschalten'
  }
};

export function getSiteUiTranslation(langCode: string): SiteUiDictionary {
  return SITE_UI_TRANSLATIONS[langCode] || SITE_UI_TRANSLATIONS.en;
}
