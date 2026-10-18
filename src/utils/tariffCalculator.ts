import { convertCurrency } from '../data/currenciesDatabase.ts';
import { ALL_SUBDIVISIONS_MAP } from '../data/statesDatabase.ts';
import { GLOBAL_TAX_DATABASE } from '../data/taxDatabase.ts';

export interface TradeCalculationInput {
  originCountry: string;
  originSubdivision?: string;
  destinationCountry: string;
  destinationSubdivision?: string;
  hsCode: string;
  productDescription: string;
  customsValue: number;
  currency: string;
  shippingInsuranceCost: number;
  tradeAgreementApplied?: string;
  customTariffRate?: number;
  reportingCurrency?: string;
  exchangeRate?: number;
}

export interface ReportingCurrencyAmounts {
  customsValue: number;
  cifValue: number;
  customsDuty: number;
  preferentialDutyRelief: number;
  antiDumpingDuty: number;
  customsProcessingFee: number;
  importVatGstAmount: number;
  subdivisionSalesTaxAmount: number;
  totalTaxesAndTariffs: number;
  totalLandedCost: number;
  tradeAgreementSavings: number;
}

export interface TradeCalculationResult {
  customsValue: number;
  cifValue: number;
  baseTariffRate: number;
  effectiveTariffRate: number;
  preferentialDutyRelief: number;
  customsDuty: number;
  importVatGstRate: number;
  importVatGstAmount: number;
  subdivisionSalesTaxRate: number;
  subdivisionSalesTaxAmount: number;
  customsProcessingFee: number;
  antiDumpingDuty: number;
  totalTaxesAndTariffs: number;
  totalLandedCost: number;
  tradeAgreementApplied?: string;
  tradeAgreementSavings: number;
  isInterstateOnly: boolean;
  requiredDocuments: string[];
  complianceNotes: string[];
  laymanSummary: string;
  reportingCurrency: string;
  exchangeRate: number;
  reportingAmounts: ReportingCurrencyAmounts;
  domesticTaxLabel?: string;
}

export const COUNTRY_DEFAULT_CURRENCY: Record<string, string> = {
  US: 'USD',
  DE: 'EUR',
  FR: 'EUR',
  NL: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  BE: 'EUR',
  IE: 'EUR',
  AT: 'EUR',
  FI: 'EUR',
  PT: 'EUR',
  GR: 'EUR',
  GB: 'GBP',
  IN: 'INR',
  CN: 'CNY',
  JP: 'JPY',
  CA: 'CAD',
  AU: 'AUD',
  SG: 'SGD',
  BR: 'BRL',
  MX: 'MXN',
  AE: 'AED',
  SA: 'SAR',
  KR: 'KRW',
  CH: 'CHF',
  SE: 'SEK',
  NO: 'NOK',
  DK: 'DKK',
  PL: 'PLN',
  CZ: 'CZK',
  ZA: 'ZAR',
  TR: 'TRY',
  TH: 'THB',
  MY: 'MYR',
  ID: 'IDR',
  VN: 'VND',
  PH: 'PHP',
  NZ: 'NZD',
  HK: 'HKD',
  TW: 'TWD',
  IL: 'ILS',
  EG: 'EGP',
  NG: 'NGN',
  KE: 'KES',
  CL: 'CLP',
  CO: 'COP',
  PE: 'PEN',
  AR: 'ARS',
};

export function resolveExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  liveRates?: Record<string, number> | null,
  customRate?: number | null
): { rate: number; source: 'custom' | 'live_api' | 'benchmark_fallback' } {
  if (fromCurrency === toCurrency) {
    return {
      rate: 1.0,
      source: liveRates && Object.keys(liveRates).length > 0 ? 'live_api' : 'benchmark_fallback',
    };
  }

  if (customRate !== undefined && customRate !== null && Number.isFinite(customRate) && customRate > 0) {
    return { rate: customRate, source: 'custom' };
  }

  if (liveRates && typeof liveRates === 'object') {
    const fromRate = liveRates[fromCurrency];
    const toRate = liveRates[toCurrency];
    if (
      typeof fromRate === 'number' &&
      fromRate > 0 &&
      typeof toRate === 'number' &&
      toRate > 0
    ) {
      return {
        rate: toRate / fromRate,
        source: 'live_api',
      };
    }
  }

  const fallbackRate = convertCurrency(1, fromCurrency, toCurrency);
  return {
    rate: fallbackRate,
    source: 'benchmark_fallback',
  };
}

// Common HS Code Base MFN Tariff Rates (illustrative standard WTO rates)
export const HS_CODE_TARIFF_RATES: Record<string, { desc: string; defaultDuty: number; antiDumping?: number }> = {
  // Section III: Animal or Vegetable Fats and Oils (Chapter 15)
  '1509.20': { desc: 'Extra virgin olive oil (EVOO) obtained solely by mechanical means', defaultDuty: 7.5 },
  '1509.40': { desc: 'Other virgin olive oil', defaultDuty: 6.5 },
  '1511.10': { desc: 'Crude palm oil (CPO), whether or not degummed', defaultDuty: 0.0 },
  '1511.90': { desc: 'Refined palm oil and its fractions (RBD Palm Olein)', defaultDuty: 8.0 },
  '1507.10': { desc: 'Crude soybean oil, whether or not degummed', defaultDuty: 4.0 },
  '1512.11': { desc: 'Sunflower-seed or safflower oil, crude', defaultDuty: 5.0 },
  '1513.11': { desc: 'Crude coconut (copra) oil', defaultDuty: 3.0 },
  '1521.90': { desc: 'Vegetable waxes (carnauba, candelilla)', defaultDuty: 0.0 },

  // Section I & II: Agricultural & Food
  '0101.21': { desc: 'Pure-bred breeding horses', defaultDuty: 0.0 },
  '0201.30': { desc: 'Boneless meat of bovine animals, fresh or chilled (Beef)', defaultDuty: 10.0 },
  '0406.90': { desc: 'Other cheese, including cheddar and parmesan', defaultDuty: 12.5 },
  '0702.00': { desc: 'Tomatoes, fresh or chilled', defaultDuty: 8.5 },
  '0804.40': { desc: 'Avocados (Hass), fresh or dried', defaultDuty: 4.5 },
  '0901.11': { desc: 'Coffee, green Arabica/Robusta beans, not roasted', defaultDuty: 0.0 },
  '0901.21': { desc: 'Coffee, roasted, not decaffeinated', defaultDuty: 7.5 },
  '1006.30': { desc: 'Semi-milled or wholly milled rice, polished or glazed', defaultDuty: 11.0 },
  '1201.90': { desc: 'Soya beans, whether or not broken', defaultDuty: 0.0 },

  // Section IV: Prepared Foodstuffs, Beverages & Tobacco
  '1801.00': { desc: 'Cocoa beans, whole or broken, raw or roasted', defaultDuty: 0.0 },
  '1806.32': { desc: 'Chocolate bars and confectionery', defaultDuty: 8.0 },
  '2204.21': { desc: 'Wine of fresh grapes in containers <= 2L', defaultDuty: 6.8 },
  '2208.30': { desc: 'Whiskies (Bourbon, Scotch, single malt)', defaultDuty: 12.0 },
  '2402.20': { desc: 'Cigarettes containing tobacco', defaultDuty: 35.0 },

  // Section V & VI: Energy, Minerals, Chemicals & Pharma
  '2523.29': { desc: 'Portland cement (EU CBAM applicable)', defaultDuty: 0.0 },
  '2601.11': { desc: 'Iron ores and concentrates, non-agglomerated', defaultDuty: 0.0 },
  '2709.00': { desc: 'Petroleum oils and oils obtained from bituminous minerals, crude', defaultDuty: 0.0 },
  '2711.11': { desc: 'Liquefied natural gas (LNG)', defaultDuty: 0.0 },
  '2804.10': { desc: 'Hydrogen, pure industrial grade', defaultDuty: 3.7 },
  '2814.10': { desc: 'Anhydrous ammonia (fertilizer feedstock)', defaultDuty: 5.5 },
  '3002.41': { desc: 'Vaccines for human medicine (WTO ITA zero)', defaultDuty: 0.0 },
  '3004.90': { desc: 'Medicaments for therapeutic uses (Tablets/Vials)', defaultDuty: 0.0 },
  '3102.10': { desc: 'Urea, whether or not in aqueous solution (Fertilizer)', defaultDuty: 3.5 },
  '3303.00': { desc: 'Perfumes and toilet waters', defaultDuty: 0.0 },

  // Section VII, VIII, IX, X, XI, XII, XIII, XIV
  '3901.10': { desc: 'Polyethylene resin pellets (LDPE)', defaultDuty: 6.5 },
  '4011.10': { desc: 'New pneumatic tires for motor cars', defaultDuty: 4.0 },
  '4107.12': { desc: 'Bovine leather, grain splits', defaultDuty: 4.5 },
  '4202.11': { desc: 'Suitcases & executive cases with outer surface of leather', defaultDuty: 8.0 },
  '4407.11': { desc: 'Sawn or chipped coniferous wood of pine, thickness > 6mm', defaultDuty: 0.0 },
  '4819.10': { desc: 'Corrugated paper or paperboard boxes and packaging', defaultDuty: 0.0 },
  // Section XI: Textiles & Textile Articles
  '5201.00': { desc: 'Cotton, not carded or combed (Raw cotton fibers)', defaultDuty: 0.0 },
  '5209.42': { desc: 'Denim fabrics of cotton > 200g/m2', defaultDuty: 8.5 },
  '6109.10': { desc: 'T-shirts, singlets and vests, of knitted cotton', defaultDuty: 12.0 },
  '6110.20': { desc: 'Jerseys, pullovers, cardigans, of cotton', defaultDuty: 16.5 },
  '6203.42': { desc: "Men's or boys' trousers & shorts of cotton (Denim jeans)", defaultDuty: 14.5 },
  '6403.99': { desc: 'Leather upper footwear and casual shoes', defaultDuty: 8.5 },
  '6404.11': { desc: 'Athletic footwear & sports sneakers', defaultDuty: 20.0 },
  '6802.21': { desc: 'Cut or sawn marble & travertine tiles', defaultDuty: 3.5 },
  '6907.21': { desc: 'Porcelain ceramic floor and wall tiles', defaultDuty: 8.5 },
  '7007.11': { desc: 'Toughened safety glass for motor vehicles', defaultDuty: 4.5 },
  '7102.39': { desc: 'Cut polished non-industrial diamonds (KPCS certified)', defaultDuty: 0.0 },
  '7108.12': { desc: 'Investment gold bullion bars (99.99%)', defaultDuty: 0.0 },

  // Section XV: Base Metals
  '7208.39': { desc: 'Hot-rolled flat iron/steel coils', defaultDuty: 0.0, antiDumping: 25.0 },
  '7219.34': { desc: 'Cold-rolled stainless steel sheets', defaultDuty: 5.0, antiDumping: 18.0 },
  '7326.90': { desc: 'Articles of iron or steel, not elsewhere specified', defaultDuty: 7.5, antiDumping: 15.0 },
  '7403.11': { desc: 'Refined copper cathodes', defaultDuty: 0.0 },
  '7601.10': { desc: 'Unwrought aluminum ingots', defaultDuty: 2.6, antiDumping: 10.0 },

  // Section XVI: High-Tech, Electronics & Machinery
  '8471.30': { desc: 'Portable automatic data processing machines (Laptops, Tablets)', defaultDuty: 0.0 },
  '8471.41': { desc: 'Enterprise AI and cloud server computing units', defaultDuty: 0.0 },
  '8471.70': { desc: 'Solid state drives (SSD / NVMe)', defaultDuty: 0.0 },
  '8486.20': { desc: 'Photolithography semiconductor manufacturing steppers', defaultDuty: 0.0 },
  '8504.40': { desc: 'Power inverters and static converters for solar/EV', defaultDuty: 1.5 },
  '8507.60': { desc: 'Lithium-ion battery cells for EVs and energy storage', defaultDuty: 3.4, antiDumping: 12.0 },
  '8517.13': { desc: 'Smartphones and cellular telephone handsets (5G)', defaultDuty: 0.0 },
  '8541.43': { desc: 'Photovoltaic cells assembled in solar panels', defaultDuty: 0.0, antiDumping: 20.0 },
  '8542.31': { desc: 'Electronic integrated circuits: Processors (CPUs, GPUs, ASICs)', defaultDuty: 0.0 },

  // Section XVII: Vehicles & Aerospace
  '8703.23': { desc: 'Motor vehicles (passenger cars 1500cc-3000cc)', defaultDuty: 10.0 },
  '8703.80': { desc: 'Electric vehicles (BEVs)', defaultDuty: 10.0, antiDumping: 21.3 },
  '8704.22': { desc: 'Commercial goods transport trucks (5-20t)', defaultDuty: 25.0 },
  '8708.29': { desc: 'Automotive body parts and accessories', defaultDuty: 2.5 },
  '8802.40': { desc: 'Commercial passenger airliners (>15,000kg)', defaultDuty: 0.0 },
  '8806.24': { desc: 'Commercial cargo and surveillance drones', defaultDuty: 0.0 },

  // Section XVIII, XIX, XX, XXI
  '9018.90': { desc: 'Medical, surgical or veterinary diagnostic instruments', defaultDuty: 0.0 },
  '9022.14': { desc: 'Computed Tomography (CT) scanners', defaultDuty: 0.0 },
  '9031.80': { desc: 'Laser coordinate measuring machines (CMM)', defaultDuty: 1.4 },
  '9102.11': { desc: 'Quartz wrist-watches', defaultDuty: 4.2 },
  '9301.90': { desc: 'Military weapons & defense equipment', defaultDuty: 0.0 },
  '9403.20': { desc: 'Modular metal office furniture and industrial shelving', defaultDuty: 0.0 },
  '9403.60': { desc: 'Wooden furniture for bedrooms and offices', defaultDuty: 3.5 },
  '9406.90': { desc: 'Prefabricated modular buildings & cleanrooms', defaultDuty: 4.0 },
  '9504.50': { desc: 'Video game consoles and gaming machines', defaultDuty: 0.0 },
  '9701.21': { desc: 'Original paintings and artwork executed by hand', defaultDuty: 0.0 },
  '9706.90': { desc: 'Certified antiques exceeding 100 years of age', defaultDuty: 0.0 },
  'DEFAULT': { desc: 'General manufactured merchandise & commercial products', defaultDuty: 5.0 },
};

// Standard country VAT/GST import rates
export const COUNTRY_IMPORT_TAX_RATES: Record<string, { vatGst: number; processingFeePct: number; fixedMinFee: number }> = {
  US: { vatGst: 0.0, processingFeePct: 0.3464, fixedMinFee: 31.67 }, // US has no federal VAT; MPF Merchandise Processing Fee applies
  GB: { vatGst: 20.0, processingFeePct: 0.1, fixedMinFee: 15.0 }, // UK VAT
  DE: { vatGst: 19.0, processingFeePct: 0.15, fixedMinFee: 12.0 }, // Germany MwSt
  FR: { vatGst: 20.0, processingFeePct: 0.15, fixedMinFee: 12.0 }, // France TVA
  NL: { vatGst: 21.0, processingFeePct: 0.12, fixedMinFee: 12.0 }, // Netherlands BTW
  CN: { vatGst: 13.0, processingFeePct: 0.2, fixedMinFee: 20.0 }, // China VAT
  JP: { vatGst: 10.0, processingFeePct: 0.05, fixedMinFee: 10.0 }, // Japan Consumption Tax
  CA: { vatGst: 5.0, processingFeePct: 0.2, fixedMinFee: 18.0 }, // Canada federal GST (provincial added separately)
  AU: { vatGst: 10.0, processingFeePct: 0.2, fixedMinFee: 20.0 }, // Australia GST
  IN: { vatGst: 18.0, processingFeePct: 0.25, fixedMinFee: 15.0 }, // India IGST on imports
  SG: { vatGst: 9.0, processingFeePct: 0.05, fixedMinFee: 10.0 }, // Singapore GST
  BR: { vatGst: 17.0, processingFeePct: 0.5, fixedMinFee: 30.0 }, // Brazil ICMS
  MX: { vatGst: 16.0, processingFeePct: 0.8, fixedMinFee: 15.0 }, // Mexico IVA
};

// Sub-division (US State, Canadian Province, etc.) Sales Tax Rates
export const SUBDIVISION_TAX_RATES: Record<string, Record<string, { rate: number; nexusThreshold: number }>> = {
  US: {
    CA: { rate: 8.85, nexusThreshold: 500000 }, // California average state + local
    TX: { rate: 8.25, nexusThreshold: 500000 }, // Texas
    NY: { rate: 8.52, nexusThreshold: 500000 }, // New York
    FL: { rate: 7.05, nexusThreshold: 100000 }, // Florida
    IL: { rate: 8.82, nexusThreshold: 100000 }, // Illinois
    WA: { rate: 9.29, nexusThreshold: 100000 }, // Washington
    OR: { rate: 0.0, nexusThreshold: 0 }, // Oregon (no sales tax)
    DE: { rate: 0.0, nexusThreshold: 0 }, // Delaware (no sales tax)
    NH: { rate: 0.0, nexusThreshold: 0 }, // New Hampshire
    MT: { rate: 0.0, nexusThreshold: 0 }, // Montana
    NC: { rate: 6.99, nexusThreshold: 100000 },
    GA: { rate: 7.35, nexusThreshold: 100000 },
    OH: { rate: 7.24, nexusThreshold: 100000 },
    PA: { rate: 6.34, nexusThreshold: 100000 },
  },
  CA: {
    ON: { rate: 13.0, nexusThreshold: 30000 }, // Ontario HST 13%
    QC: { rate: 9.975, nexusThreshold: 30000 }, // Quebec QST
    BC: { rate: 7.0, nexusThreshold: 10000 }, // British Columbia PST
    AB: { rate: 0.0, nexusThreshold: 0 }, // Alberta (0% PST, only federal 5% GST)
  },
};

// Recognized preferential Free Trade Agreements
export const FREE_TRADE_AGREEMENTS = [
  {
    id: 'USMCA',
    name: 'United States-Mexico-Canada Agreement (USMCA)',
    countries: ['US', 'MX', 'CA'],
    dutyMultiplier: 0.0, // 100% preferential duty exemption for qualifying origin goods
  },
  {
    id: 'EU_SINGLE_MARKET',
    name: 'European Union Single Market & Customs Union',
    countries: ['DE', 'FR', 'NL', 'IT', 'ES', 'BE', 'IE', 'AT', 'SE', 'DK', 'FI', 'PL', 'CZ', 'PT', 'GR'],
    dutyMultiplier: 0.0, // Zero tariffs between member states
  },
  {
    id: 'EU_UK_TCA',
    name: 'EU-UK Trade and Cooperation Agreement',
    countries: ['GB', 'DE', 'FR', 'NL', 'IT', 'ES', 'BE', 'IE'],
    dutyMultiplier: 0.0,
  },
  {
    id: 'CPTPP',
    name: 'Comprehensive & Progressive Trans-Pacific Partnership (CPTPP)',
    countries: ['JP', 'CA', 'AU', 'NZ', 'SG', 'MX', 'VN', 'MY', 'CL', 'PE', 'BN', 'GB'],
    dutyMultiplier: 0.1, // 90% tariff reduction on average
  },
  {
    id: 'RCEP',
    name: 'Regional Comprehensive Economic Partnership (RCEP)',
    countries: ['CN', 'JP', 'KR', 'AU', 'NZ', 'SG', 'ID', 'TH', 'MY', 'VN', 'PH'],
    dutyMultiplier: 0.2, // 80% tariff elimination
  },
];

/**
 * Pure calculation function for cross-border and interstate trade tariffs and taxes.
 */
export function calculateTariffsAndTaxes(input: TradeCalculationInput): TradeCalculationResult {
  const customsValue = Math.max(0, input.customsValue);
  const shippingInsurance = Math.max(0, input.shippingInsuranceCost);
  const cifValue = customsValue + shippingInsurance; // Cost, Insurance, and Freight

  const isSameCountry = input.originCountry === input.destinationCountry;
  const isInterstateOnly = isSameCountry;

  // 1. Identify tariff schedule
  const hsKey = Object.keys(HS_CODE_TARIFF_RATES).find((k) => input.hsCode.startsWith(k)) || 'DEFAULT';
  const tariffConfig = HS_CODE_TARIFF_RATES[hsKey] || HS_CODE_TARIFF_RATES['DEFAULT'];
  const baseTariffRate = isSameCountry
    ? 0
    : input.customTariffRate !== undefined
    ? input.customTariffRate
    : tariffConfig.defaultDuty;

  // 2. Check Trade Agreement eligibility
  let appliedAgreement: string | undefined = input.tradeAgreementApplied;
  let dutyMultiplier = 1.0;

  if (!isSameCountry) {
    if (appliedAgreement) {
      const p = FREE_TRADE_AGREEMENTS.find((a) => a.id === appliedAgreement);
      if (p && p.countries.includes(input.originCountry) && p.countries.includes(input.destinationCountry)) {
        dutyMultiplier = p.dutyMultiplier;
      }
    } else {
      // Auto-detect applicable FTA
      const match = FREE_TRADE_AGREEMENTS.find(
        (a) => a.countries.includes(input.originCountry) && a.countries.includes(input.destinationCountry)
      );
      if (match) {
        appliedAgreement = match.id;
        dutyMultiplier = match.dutyMultiplier;
      }
    }
  } else {
    appliedAgreement = undefined;
  }

  const effectiveTariffRate = baseTariffRate * dutyMultiplier;
  const normalDutyWithoutFTA = (cifValue * baseTariffRate) / 100;
  const customsDuty = (cifValue * effectiveTariffRate) / 100;
  const preferentialDutyRelief = Math.max(0, normalDutyWithoutFTA - customsDuty);

  // Anti-dumping duties (applicable when trade remedies active)
  let antiDumpingDuty = 0;
  if (!isSameCountry && tariffConfig.antiDumping && !appliedAgreement) {
    antiDumpingDuty = (cifValue * tariffConfig.antiDumping) / 100;
  }

  // 3. Customs Processing Fees
  let customsProcessingFee = 0;
  if (!isSameCountry) {
    const destFee = COUNTRY_IMPORT_TAX_RATES[input.destinationCountry] || { processingFeePct: 0.15, fixedMinFee: 15 };
    const calculatedFee = (cifValue * destFee.processingFeePct) / 100;
    customsProcessingFee = Math.max(destFee.fixedMinFee, Math.min(600, calculatedFee));
  }

  // 4. Import VAT/GST
  // Standard WTO/WCO practice: Import VAT is assessed on (CIF Value + Customs Duty + Processing Fees)
  let importVatGstRate = 0;
  let importVatGstAmount = 0;

  if (!isSameCountry) {
    const destVatConfig = COUNTRY_IMPORT_TAX_RATES[input.destinationCountry];
    importVatGstRate = destVatConfig ? destVatConfig.vatGst : 10.0;
    const taxableImportBase = cifValue + customsDuty + customsProcessingFee + antiDumpingDuty;
    importVatGstAmount = (taxableImportBase * importVatGstRate) / 100;
  }

  // 5. Interstate / Sub-division / Domestic Tax
  let subdivisionSalesTaxRate = 0;
  let subdivisionSalesTaxAmount = 0;
  let domesticTaxLabel = 'Destination State/Province Sales Tax';

  if (input.destinationSubdivision) {
    const stateConfig = SUBDIVISION_TAX_RATES[input.destinationCountry]?.[input.destinationSubdivision];
    const subFromDb = ALL_SUBDIVISIONS_MAP[input.destinationCountry]?.find(
      (s) => s.code === input.destinationSubdivision
    );
    const resolvedSubRate =
      stateConfig?.rate ?? subFromDb?.avgCombinedSalesTaxRate ?? subFromDb?.salesTaxRate;

    if (resolvedSubRate !== undefined) {
      subdivisionSalesTaxRate = resolvedSubRate;
      subdivisionSalesTaxAmount = (customsValue * subdivisionSalesTaxRate) / 100;
    }
  } else if (isSameCountry && input.destinationCountry !== 'US') {
    // For domestic movement in countries with national GST/VAT when no specific state override is chosen
    const countryInfo = GLOBAL_TAX_DATABASE.find((c) => c.code === input.destinationCountry);
    const nationalRate =
      COUNTRY_IMPORT_TAX_RATES[input.destinationCountry]?.vatGst ?? countryInfo?.vatGstRate ?? 0;
    if (nationalRate > 0) {
      subdivisionSalesTaxRate = nationalRate;
      subdivisionSalesTaxAmount = (customsValue * subdivisionSalesTaxRate) / 100;
    }
  }

  if (input.destinationCountry === 'IN') {
    domesticTaxLabel =
      input.originSubdivision &&
      input.destinationSubdivision &&
      input.originSubdivision === input.destinationSubdivision
        ? 'Intra-State GST (CGST 9% + SGST 9%)'
        : 'Integrated GST (IGST — Interstate Supply)';
  } else if (input.destinationCountry === 'CA') {
    domesticTaxLabel = 'Provincial HST / GST + PST';
  } else if (input.destinationCountry === 'BR') {
    domesticTaxLabel = 'Interstate ICMS & DIFAL Tax';
  } else if (input.destinationCountry === 'AU') {
    domesticTaxLabel = 'Domestic GST (ATO)';
  } else if (input.destinationCountry !== 'US' && isSameCountry) {
    domesticTaxLabel = `Domestic VAT / GST (${input.destinationCountry})`;
  }

  // Total liabilities & landed cost
  const totalTaxesAndTariffs = customsDuty + antiDumpingDuty + customsProcessingFee + importVatGstAmount + subdivisionSalesTaxAmount;
  const totalLandedCost = cifValue + totalTaxesAndTariffs;

  // Document requirements
  const requiredDocuments: string[] = [];
  if (isSameCountry) {
    if (input.destinationCountry === 'IN') {
      requiredDocuments.push('GST Tax Invoice under Sec. 31 CGST/IGST Act (with 6/8-digit HSN & GSTIN)');
      requiredDocuments.push('Electronic Way Bill (Form GST EWB-01 via ewaybillgst.gov.in — mandatory > ₹50,000)');
      requiredDocuments.push('e-Invoice IRN & Signed QR Code (Form GST INV-01 via IRP)');
      requiredDocuments.push('Lorry Receipt (LR) / Domestic Consignment Note (Bilty)');
    } else if (input.destinationCountry === 'CA') {
      requiredDocuments.push('CRA GST/HST Tax Invoice (with 9-digit Business Number RT0001)');
      requiredDocuments.push('Interprovincial Straight Bill of Lading');
      if (subdivisionSalesTaxRate > 0) {
        requiredDocuments.push('Provincial PST Resale Exemption Certificate (if applicable)');
      }
    } else if (input.destinationCountry === 'BR') {
      requiredDocuments.push('DANFE & Nota Fiscal Eletrônica (NF-e Modelo 55 via SEFAZ)');
      requiredDocuments.push('Conhecimento de Transporte Eletrônico (CT-e Modelo 57)');
      requiredDocuments.push('GNRE Interstate DIFAL Payment Receipt (if non-ICMS contributor)');
    } else {
      requiredDocuments.push('Commercial Invoice / Domestic Bill of Sale');
      requiredDocuments.push('Interstate Bill of Lading (BOL)');
      if (subdivisionSalesTaxRate > 0) {
        requiredDocuments.push('State Resale Exemption Certificate (if B2B reseller)');
      }
    }
  } else {
    requiredDocuments.push('Commercial Invoice (with HS Code 6-digit classification)');
    requiredDocuments.push('Ocean / Air Bill of Lading (BOL / AWB)');
    requiredDocuments.push('Packing List');
    requiredDocuments.push('Import Customs Entry Declaration (e.g., CBP Form 7501 or EU SAD)');
    if (appliedAgreement) {
      requiredDocuments.push(`Certificate of Origin (${appliedAgreement} preferential proof)`);
    }
    if (antiDumpingDuty > 0) {
      requiredDocuments.push('Non-Circumvention Manufacturer Affidavit');
    }
  }

  // Compliance notes
  const complianceNotes: string[] = [];
  if (appliedAgreement) {
    complianceNotes.push(`Preferential duty granted under ${appliedAgreement}. Saved approximately ${input.currency} ${preferentialDutyRelief.toFixed(2)}.`);
  } else if (!isSameCountry && baseTariffRate > 0) {
    complianceNotes.push(`MFN Standard Tariff of ${baseTariffRate}% applied. Verify if regional trade pact applies.`);
  }

  if (isInterstateOnly && subdivisionSalesTaxRate > 0) {
    if (input.destinationCountry === 'IN') {
      complianceNotes.push(
        `Domestic movement in India incurs 0% Customs Duty. ${domesticTaxLabel} of ${subdivisionSalesTaxRate}% applies under the IGST/CGST Act, 2017, along with mandatory Form GST EWB-01 (e-Way Bill).`
      );
    } else if (input.destinationCountry === 'US') {
      complianceNotes.push(
        `Interstate destination sales tax applies in ${input.destinationSubdivision} at ${subdivisionSalesTaxRate}%. Check South Dakota v. Wayfair economic nexus thresholds.`
      );
    } else {
      complianceNotes.push(
        `Domestic movement within ${input.destinationCountry} incurs 0% border customs duty. ${domesticTaxLabel} of ${subdivisionSalesTaxRate}% applies.`
      );
    }
  }

  if (importVatGstAmount > 0) {
    complianceNotes.push(`Import VAT/GST of ${importVatGstRate}% is generally reclaimable on company input tax returns if registered as a taxable entity.`);
  }

  const reportingCurrency = input.reportingCurrency || input.currency;
  const resolvedRate =
    input.exchangeRate !== undefined && input.exchangeRate > 0
      ? input.exchangeRate
      : resolveExchangeRate(input.currency, reportingCurrency).rate;

  const reportingAmounts: ReportingCurrencyAmounts = {
    customsValue: customsValue * resolvedRate,
    cifValue: cifValue * resolvedRate,
    customsDuty: customsDuty * resolvedRate,
    preferentialDutyRelief: preferentialDutyRelief * resolvedRate,
    antiDumpingDuty: antiDumpingDuty * resolvedRate,
    customsProcessingFee: customsProcessingFee * resolvedRate,
    importVatGstAmount: importVatGstAmount * resolvedRate,
    subdivisionSalesTaxAmount: subdivisionSalesTaxAmount * resolvedRate,
    totalTaxesAndTariffs: totalTaxesAndTariffs * resolvedRate,
    totalLandedCost: totalLandedCost * resolvedRate,
    tradeAgreementSavings: preferentialDutyRelief * resolvedRate,
  };

  if (reportingCurrency !== input.currency) {
    complianceNotes.push(
      `Reporting currency conversion applied: 1 ${input.currency} = ${resolvedRate.toFixed(4)} ${reportingCurrency} (Total Duties & Taxes: ${reportingCurrency} ${reportingAmounts.totalTaxesAndTariffs.toFixed(2)}).`
    );
  }

  // Layman explanation
  let laymanSummary = '';
  const reportingSuffix =
    reportingCurrency !== input.currency
      ? ` Converted at 1 ${input.currency} = ${resolvedRate.toFixed(4)} ${reportingCurrency}, your total tax & duty liability is ${reportingCurrency} ${reportingAmounts.totalTaxesAndTariffs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} and your final landed cost is ${reportingCurrency} ${reportingAmounts.totalLandedCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
      : '';

  if (isSameCountry) {
    laymanSummary = `You are shipping ${tariffConfig.desc} domestically inside the same country (${input.originCountry}${input.originSubdivision ? ' - ' + input.originSubdivision : ''} to ${input.destinationCountry}${input.destinationSubdivision ? ' - ' + input.destinationSubdivision : ''}). Because this is an interstate/domestic movement with no international border crossing, there are NO border customs duties (0%) and NO customs port entry fees. Your only tax liability is ${domesticTaxLabel} of ${subdivisionSalesTaxRate}%, which equals ${input.currency} ${subdivisionSalesTaxAmount.toFixed(2)}.${reportingSuffix}`;
  } else {
    laymanSummary = `Shipping ${tariffConfig.desc} from ${input.originCountry} to ${input.destinationCountry}: The customs duty is ${effectiveTariffRate.toFixed(1)}% (${input.currency} ${customsDuty.toFixed(2)})${appliedAgreement ? ' (discounted via trade agreement)' : ''}, plus import VAT/GST of ${importVatGstRate}% (${input.currency} ${importVatGstAmount.toFixed(2)}) and standard processing fees. Your total extra tax cost at the border is ${input.currency} ${totalTaxesAndTariffs.toFixed(2)}, making your total final landed cost ${input.currency} ${totalLandedCost.toFixed(2)}.${reportingSuffix}`;
  }

  return {
    customsValue,
    cifValue,
    baseTariffRate,
    effectiveTariffRate,
    preferentialDutyRelief,
    customsDuty,
    importVatGstRate,
    importVatGstAmount,
    subdivisionSalesTaxRate,
    subdivisionSalesTaxAmount,
    customsProcessingFee,
    antiDumpingDuty,
    totalTaxesAndTariffs,
    totalLandedCost,
    tradeAgreementApplied: appliedAgreement,
    tradeAgreementSavings: preferentialDutyRelief,
    isInterstateOnly,
    requiredDocuments,
    complianceNotes,
    laymanSummary,
    reportingCurrency,
    exchangeRate: resolvedRate,
    reportingAmounts,
    domesticTaxLabel,
  };
}
