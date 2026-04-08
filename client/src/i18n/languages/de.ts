export default {
  home: {
    welcome:
      'Invoicify ist eine moderne Webanwendung zur schnellen und einfachen Erstellung von professionellen Rechnungen. Entwickelt für Freiberufler, Selbstständige und kleine Unternehmen, ermöglicht Invoicify dir: Rechnungen direkt im Browser zu erstellen und zu verwalten Kundendaten zu speichern und automatisch vorzuschlagen Wiederkehrende Positionen oder Leistungen bequem wiederzuverwenden  Alle Rechnungen übersichtlich im Dashboard im Blick zu behalten',
    getStarted: 'Zur Anmeldung',
  },
  auth: {
    errors: {
      defaultError: 'Es gab leider einen Fehler',
    },
    placeholders: {
      email: 'E-Mail',
      password: 'Passwort',
    },
    registerSuccess: 'Registrierung erfolgreich! Bitte anmelden.',
    loginSuccess: 'Login war erfolgreich',
  },
  validation: {
    emailRequired: 'E-Mail ist erforderlich',
    passwordRequired: 'Passwort ist erforderlich',
    passwordMinLength: 'Das Passwort muss mindestens 8 Zeichen enthalten',
    passwordMaxLength: 'Das Passwort darf maximal 72 Zeichen enthalten',
    passwordPattern:
      'Das Passwort muss einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten',
    passwordHint:
      'Verwende 8-72 Zeichen mit Großbuchstaben, Kleinbuchstaben, Zahl und Sonderzeichen.',
  },
  CustomerDetail: {
    add: 'Neuen Kunden hinzufügen',
    edit: 'Änderungen speichern ',
    addSuccess: 'Änderungen erfolgreich gespeichert',
  },
  buttons: {
    toInvoices: 'Rechnungen',
    register: 'Registrieren',
    login: 'Anmelden',
    save: 'Speichern',
    toAddCustomer: 'Kunde hinzufügen',
    toCompanyData: 'Firmendaten bearbeiten',
    createInvoice: 'Rechnung erstellen',
    toCustomers: 'Kunden',
    edit: 'Details',
    delete: 'Löschen',
  },
  commonLabels: {
    name: 'Name',
    contact: 'Ansprechpartner',
    email: 'E-Mail',
    phone: 'Telefon',
    address: 'Adresse',
    city: 'Stadt',
    zip: 'PLZ',
    country: 'Land',
    taxNumber: 'Steuernummer',
  },
  addCustomer: {
    addSuccess: 'Kunde erfolgreich hinzugefügt',
    labels: 'commonLabels',
  },
  addCompanyData: {
    title: 'Firmendaten bearbeiten',
    success: 'Firmendaten erfolgreich gespeichert',
    noUser: 'Kein Benutzer angemeldet',
    labels: 'commonLabels',
  },
  invoice: {
    createTitle: 'Rechnung erstellen',
    selectCustomer: 'Kunde auswählen',
    selectCustomerPlaceholder: '-- Kunde wählen --',
    products: 'Artikel',
    productName: 'Artikelname',
    quantity: 'Menge',
    price: 'Preis',
    addProduct: 'Artikel hinzufügen',
    vat: 'MwSt. (%)',
    invoiceDate: 'Rechnungsdatum',
    dueDate: 'Fällig bis',
    netAmount: 'Nettobetrag',
    grossAmount: 'Bruttobetrag (inkl. MwSt.)',
    create: 'Rechnung erstellen',
    fillAllFields: 'Bitte alle Felder ausfüllen',
  },
  displayInvoice: {
    noInvoices: 'Keine Rechnungen gefunden.',
    invoiceDate: 'Datum',
    name: 'Kunde',
    grossAmount: 'Bruttobetrag',
  },
};
