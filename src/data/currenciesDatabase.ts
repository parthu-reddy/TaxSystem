export interface WorldCurrency {
  code: string; // ISO 4217
  name: string;
  symbol: string;
  country: string;
  rateToUsd: number; // Benchmark spot rate to USD
  decimalDigits: number;
}

export const ALL_WORLD_CURRENCIES: WorldCurrency[] = [
  // Major Global Currencies
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States', rateToUsd: 1.0, decimalDigits: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union', rateToUsd: 1.085, decimalDigits: 2 },
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£', country: 'United Kingdom', rateToUsd: 1.305, decimalDigits: 2 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan', rateToUsd: 0.0067, decimalDigits: 0 },
  { code: 'CNY', name: 'Chinese Yuan Renminbi', symbol: '¥', country: 'China', rateToUsd: 0.138, decimalDigits: 2 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', country: 'Canada', rateToUsd: 0.725, decimalDigits: 2 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia', rateToUsd: 0.668, decimalDigits: 2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland', rateToUsd: 1.152, decimalDigits: 2 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'India', rateToUsd: 0.0119, decimalDigits: 2 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', country: 'Brazil', rateToUsd: 0.177, decimalDigits: 2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', country: 'Mexico', rateToUsd: 0.051, decimalDigits: 2 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', country: 'Singapore', rateToUsd: 0.762, decimalDigits: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', country: 'Hong Kong', rateToUsd: 0.128, decimalDigits: 2 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', country: 'New Zealand', rateToUsd: 0.608, decimalDigits: 2 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', country: 'South Korea', rateToUsd: 0.00074, decimalDigits: 0 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', country: 'Sweden', rateToUsd: 0.096, decimalDigits: 2 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', country: 'Norway', rateToUsd: 0.092, decimalDigits: 2 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr.', country: 'Denmark', rateToUsd: 0.145, decimalDigits: 2 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', country: 'Poland', rateToUsd: 0.252, decimalDigits: 2 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', country: 'South Africa', rateToUsd: 0.057, decimalDigits: 2 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', country: 'Turkey', rateToUsd: 0.029, decimalDigits: 2 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', country: 'United Arab Emirates', rateToUsd: 0.272, decimalDigits: 2 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', country: 'Saudi Arabia', rateToUsd: 0.266, decimalDigits: 2 },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'QR', country: 'Qatar', rateToUsd: 0.274, decimalDigits: 2 },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', country: 'Kuwait', rateToUsd: 3.26, decimalDigits: 3 },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', country: 'Bahrain', rateToUsd: 2.65, decimalDigits: 3 },
  { code: 'OMR', name: 'Omani Rial', symbol: 'OMR', country: 'Oman', rateToUsd: 2.60, decimalDigits: 3 },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', country: 'Israel', rateToUsd: 0.267, decimalDigits: 2 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', country: 'Thailand', rateToUsd: 0.030, decimalDigits: 2 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', country: 'Indonesia', rateToUsd: 0.000064, decimalDigits: 0 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', country: 'Malaysia', rateToUsd: 0.231, decimalDigits: 2 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', country: 'Philippines', rateToUsd: 0.0173, decimalDigits: 2 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', country: 'Vietnam', rateToUsd: 0.000040, decimalDigits: 0 },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', country: 'Taiwan', rateToUsd: 0.031, decimalDigits: 2 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', country: 'Czech Republic', rateToUsd: 0.043, decimalDigits: 2 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', country: 'Hungary', rateToUsd: 0.0027, decimalDigits: 0 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', country: 'Romania', rateToUsd: 0.218, decimalDigits: 2 },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', country: 'Bulgaria', rateToUsd: 0.554, decimalDigits: 2 },
  { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr', country: 'Iceland', rateToUsd: 0.0073, decimalDigits: 0 },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'din', country: 'Serbia', rateToUsd: 0.0093, decimalDigits: 2 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', country: 'Ukraine', rateToUsd: 0.0242, decimalDigits: 2 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', country: 'Egypt', rateToUsd: 0.0205, decimalDigits: 2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', country: 'Nigeria', rateToUsd: 0.00061, decimalDigits: 2 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', country: 'Kenya', rateToUsd: 0.0077, decimalDigits: 2 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', country: 'Ghana', rateToUsd: 0.063, decimalDigits: 2 },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', country: 'Morocco', rateToUsd: 0.101, decimalDigits: 2 },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'DA', country: 'Algeria', rateToUsd: 0.0075, decimalDigits: 2 },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'DT', country: 'Tunisia', rateToUsd: 0.324, decimalDigits: 3 },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$', country: 'Chile', rateToUsd: 0.00106, decimalDigits: 0 },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', country: 'Colombia', rateToUsd: 0.000236, decimalDigits: 0 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', country: 'Peru', rateToUsd: 0.266, decimalDigits: 2 },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$', country: 'Argentina', rateToUsd: 0.00102, decimalDigits: 2 },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', country: 'Uruguay', rateToUsd: 0.024, decimalDigits: 2 },
  { code: 'CRC', name: 'Costa Rican Colon', symbol: '₡', country: 'Costa Rica', rateToUsd: 0.00195, decimalDigits: 2 },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.', country: 'Panama', rateToUsd: 1.0, decimalDigits: 2 },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', country: 'Dominican Republic', rateToUsd: 0.0167, decimalDigits: 2 },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$', country: 'Jamaica', rateToUsd: 0.0064, decimalDigits: 2 },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: 'TT$', country: 'Trinidad and Tobago', rateToUsd: 0.147, decimalDigits: 2 },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$', country: 'Barbados', rateToUsd: 0.50, decimalDigits: 2 },
  { code: 'BSD', name: 'Bahamian Dollar', symbol: 'B$', country: 'Bahamas', rateToUsd: 1.0, decimalDigits: 2 },
  { code: 'BMD', name: 'Bermudian Dollar', symbol: 'BD$', country: 'Bermuda', rateToUsd: 1.0, decimalDigits: 2 },
  { code: 'KYD', name: 'Cayman Islands Dollar', symbol: 'CI$', country: 'Cayman Islands', rateToUsd: 1.20, decimalDigits: 2 },
  { code: 'XCD', name: 'East Caribbean Dollar', symbol: 'EC$', country: 'OECS (Antigua, St. Lucia, Grenada, etc.)', rateToUsd: 0.37, decimalDigits: 2 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', country: 'Pakistan', rateToUsd: 0.0036, decimalDigits: 2 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', country: 'Bangladesh', rateToUsd: 0.0083, decimalDigits: 2 },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', country: 'Sri Lanka', rateToUsd: 0.0034, decimalDigits: 2 },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'रू', country: 'Nepal', rateToUsd: 0.0074, decimalDigits: 2 },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', country: 'Kazakhstan', rateToUsd: 0.00206, decimalDigits: 2 },
  { code: 'UZS', name: 'Uzbekistani Som', symbol: "so'm", country: 'Uzbekistan', rateToUsd: 0.000078, decimalDigits: 0 },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', country: 'Azerbaijan', rateToUsd: 0.588, decimalDigits: 2 },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾', country: 'Georgia', rateToUsd: 0.367, decimalDigits: 2 },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏', country: 'Armenia', rateToUsd: 0.00258, decimalDigits: 2 },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD', country: 'Jordan', rateToUsd: 1.41, decimalDigits: 3 },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'L£', country: 'Lebanon', rateToUsd: 0.000011, decimalDigits: 0 },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'IQD', country: 'Iraq', rateToUsd: 0.00076, decimalDigits: 0 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', country: 'Tanzania', rateToUsd: 0.00037, decimalDigits: 0 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', country: 'Uganda', rateToUsd: 0.00027, decimalDigits: 0 },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', country: 'Rwanda', rateToUsd: 0.00073, decimalDigits: 0 },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', country: 'Ethiopia', rateToUsd: 0.0084, decimalDigits: 2 },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨', country: 'Mauritius', rateToUsd: 0.0215, decimalDigits: 2 },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: 'SR', country: 'Seychelles', rateToUsd: 0.071, decimalDigits: 2 },
  { code: 'BWP', name: 'Botswana Pula', symbol: 'P', country: 'Botswana', rateToUsd: 0.075, decimalDigits: 2 },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$', country: 'Namibia', rateToUsd: 0.057, decimalDigits: 2 },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', country: 'Zambia', rateToUsd: 0.037, decimalDigits: 2 },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', country: 'Mozambique', rateToUsd: 0.0156, decimalDigits: 2 },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz', country: 'Angola', rateToUsd: 0.00105, decimalDigits: 2 },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', country: 'UEMOA (Senegal, Ivory Coast, etc.)', rateToUsd: 0.00165, decimalDigits: 0 },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', country: 'CEMAC (Cameroon, Gabon, etc.)', rateToUsd: 0.00165, decimalDigits: 0 },
  { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$', country: 'Fiji', rateToUsd: 0.445, decimalDigits: 2 },
  { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K', country: 'Papua New Guinea', rateToUsd: 0.251, decimalDigits: 2 },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$', country: 'Macao SAR', rateToUsd: 0.124, decimalDigits: 2 },
  { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮', country: 'Mongolia', rateToUsd: 0.00029, decimalDigits: 2 },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛', country: 'Cambodia', rateToUsd: 0.00024, decimalDigits: 2 },
  { code: 'LAK', name: 'Lao Kip', symbol: '₭', country: 'Laos', rateToUsd: 0.000045, decimalDigits: 0 },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K', country: 'Myanmar', rateToUsd: 0.00047, decimalDigits: 0 },
  { code: 'BND', name: 'Brunei Dollar', symbol: 'B$', country: 'Brunei', rateToUsd: 0.762, decimalDigits: 2 },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf', country: 'Maldives', rateToUsd: 0.065, decimalDigits: 2 },
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋', country: 'Afghanistan', rateToUsd: 0.0145, decimalDigits: 2 },
  { code: 'ALL', name: 'Albanian Lek', symbol: 'L', country: 'Albania', rateToUsd: 0.0109, decimalDigits: 2 },
  { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', symbol: 'KM', country: 'Bosnia & Herzegovina', rateToUsd: 0.554, decimalDigits: 2 },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'den', country: 'North Macedonia', rateToUsd: 0.0176, decimalDigits: 2 },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L', country: 'Moldova', rateToUsd: 0.056, decimalDigits: 2 },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br', country: 'Belarus', rateToUsd: 0.306, decimalDigits: 2 },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.', country: 'Bolivia', rateToUsd: 0.144, decimalDigits: 2 },
  { code: 'PYG', name: 'Paraguayan Guarani', symbol: '₲', country: 'Paraguay', rateToUsd: 0.000127, decimalDigits: 0 },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q', country: 'Guatemala', rateToUsd: 0.129, decimalDigits: 2 },
  { code: 'HNL', name: 'Honduran Lempira', symbol: 'L', country: 'Honduras', rateToUsd: 0.0396, decimalDigits: 2 },
  { code: 'NIO', name: 'Nicaraguan Cordoba', symbol: 'C$', country: 'Nicaragua', rateToUsd: 0.0272, decimalDigits: 2 },
  { code: 'BZD', name: 'Belize Dollar', symbol: 'BZ$', country: 'Belize', rateToUsd: 0.496, decimalDigits: 2 },
  { code: 'GYD', name: 'Guyanese Dollar', symbol: 'G$', country: 'Guyana', rateToUsd: 0.0048, decimalDigits: 2 },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: 'Sr$', country: 'Suriname', rateToUsd: 0.028, decimalDigits: 2 },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'G', country: 'Haiti', rateToUsd: 0.0076, decimalDigits: 2 },
  { code: 'AWG', name: 'Aruban Florin', symbol: 'Afl.', country: 'Aruba', rateToUsd: 0.555, decimalDigits: 2 },
  { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'NAƒ', country: 'Curaçao & Sint Maarten', rateToUsd: 0.558, decimalDigits: 2 },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$', country: 'Cape Verde', rateToUsd: 0.0098, decimalDigits: 2 },
  { code: 'STN', name: 'São Tomé and Príncipe Dobra', symbol: 'Db', country: 'São Tomé and Príncipe', rateToUsd: 0.044, decimalDigits: 2 },
  { code: 'SZL', name: 'Eswatini Lilangeni', symbol: 'E', country: 'Eswatini', rateToUsd: 0.057, decimalDigits: 2 },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L', country: 'Lesotho', rateToUsd: 0.057, decimalDigits: 2 },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', country: 'Malawi', rateToUsd: 0.00057, decimalDigits: 2 },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', country: 'Gambia', rateToUsd: 0.0141, decimalDigits: 2 },
  { code: 'GNF', name: 'Guinean Franc', symbol: 'FG', country: 'Guinea', rateToUsd: 0.000116, decimalDigits: 0 },
  { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le', country: 'Sierra Leone', rateToUsd: 0.000044, decimalDigits: 2 },
  { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$', country: 'Liberia', rateToUsd: 0.0051, decimalDigits: 2 },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'FC', country: 'Democratic Republic of the Congo', rateToUsd: 0.00035, decimalDigits: 2 },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu', country: 'Burundi', rateToUsd: 0.00034, decimalDigits: 0 },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'So.Sh.', country: 'Somalia', rateToUsd: 0.00175, decimalDigits: 2 },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj', country: 'Djibouti', rateToUsd: 0.0056, decimalDigits: 0 },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk', country: 'Eritrea', rateToUsd: 0.066, decimalDigits: 2 },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'CF', country: 'Comoros', rateToUsd: 0.0022, decimalDigits: 0 },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', country: 'Madagascar', rateToUsd: 0.000218, decimalDigits: 2 },
  { code: 'WST', name: 'Samoan Tala', symbol: 'WS$', country: 'Samoa', rateToUsd: 0.363, decimalDigits: 2 },
  { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$', country: 'Tonga', rateToUsd: 0.421, decimalDigits: 2 },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'VT', country: 'Vanuatu', rateToUsd: 0.0084, decimalDigits: 0 },
  { code: 'SBD', name: 'Solomon Islands Dollar', symbol: 'SI$', country: 'Solomon Islands', rateToUsd: 0.117, decimalDigits: 2 },
  { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu.', country: 'Bhutan', rateToUsd: 0.0119, decimalDigits: 2 }
];

export const CURRENCY_MAP = new Map<string, WorldCurrency>(
  ALL_WORLD_CURRENCIES.map((c) => [c.code, c])
);

export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string
): number {
  if (fromCode === toCode) return amount;
  const from = CURRENCY_MAP.get(fromCode) || { rateToUsd: 1.0 };
  const to = CURRENCY_MAP.get(toCode) || { rateToUsd: 1.0 };
  // Convert from origin to USD, then from USD to target
  const inUsd = amount * from.rateToUsd;
  const inTarget = inUsd / to.rateToUsd;
  return inTarget;
}

export function formatCurrencyAmount(
  amount: number,
  currencyCode: string
): string {
  const curr = CURRENCY_MAP.get(currencyCode);
  if (!curr) return `${currencyCode} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `${curr.symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: curr.decimalDigits,
    maximumFractionDigits: curr.decimalDigits
  })} ${curr.code}`;
}
