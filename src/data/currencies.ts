export interface Currency {
  code: string;
  name: string;
  symbol: string;
  symbolPosition: 'prefix' | 'suffix';
  decimalPlaces: number;
}

export const POPULAR_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'CHF', 'SGD', 'AED', 'CNY'
];

export const ALL_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', symbolPosition: 'suffix', decimalPlaces: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', symbolPosition: 'prefix', decimalPlaces: 0 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'SG$', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', symbolPosition: 'suffix', decimalPlaces: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', symbolPosition: 'suffix', decimalPlaces: 2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', symbolPosition: 'suffix', decimalPlaces: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', symbolPosition: 'suffix', decimalPlaces: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', symbolPosition: 'prefix', decimalPlaces: 0 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', symbolPosition: 'prefix', decimalPlaces: 0 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', symbolPosition: 'suffix', decimalPlaces: 0 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', symbolPosition: 'suffix', decimalPlaces: 2 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', symbolPosition: 'suffix', decimalPlaces: 0 },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$', symbolPosition: 'prefix', decimalPlaces: 0 },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', symbolPosition: 'prefix', decimalPlaces: 0 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', symbolPosition: 'prefix', decimalPlaces: 2 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', symbolPosition: 'prefix', decimalPlaces: 3 },
  { code: 'OMR', name: 'Omani Rial', symbol: 'OMR', symbolPosition: 'prefix', decimalPlaces: 3 }
];

export function getCurrency(code: string): Currency {
  const found = ALL_CURRENCIES.find(c => c.code.toUpperCase() === code.toUpperCase());
  return found || { code, name: code, symbol: code, symbolPosition: 'prefix', decimalPlaces: 2 };
}
