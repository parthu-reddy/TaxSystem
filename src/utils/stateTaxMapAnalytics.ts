import { scaleLinear, max, min, mean } from 'd3';
import type { SubDivisionTax } from '../types/tax.ts';
import { ALL_SUBDIVISIONS_MAP } from '../data/statesDatabase.ts';

export type MapMetricKey =
  | 'combinedRate'
  | 'salesTaxRate'
  | 'corporateRate'
  | 'compositeBurden'
  | 'nexusThreshold'
  | 'saasRegime';

export type NexusCategory =
  | 'No Sales Tax (NOMAD)'
  | 'High Threshold ($250k–$500k)'
  | 'Standard Wayfair ($100k)'
  | 'Strict Dual Trigger ($100k or 200 tx)'
  | 'Mandatory GST / VAT Nexus';

export interface SpatialGridCoord {
  code: string;
  row: number;
  col: number;
  regionGroup: string;
  hubCity?: string;
}

export interface EnrichedSubdivisionAnalytics {
  subdivision: SubDivisionTax;
  countryCode: string;
  code: string;
  name: string;
  grid: SpatialGridCoord;
  salesTaxRate: number;
  combinedRate: number;
  localSurchargeRate: number;
  corporateRate: number;
  nexusRevenueThreshold: number | null;
  nexusTransactionsThreshold: number | null;
  nexusCategory: NexusCategory;
  nexusStrictnessScore: number; // 0-100
  compositeFiscalBurdenScore: number; // 0-100
  saasTaxabilityScore: number; // 0, 50, 100
  // Simulation fields for a given annual sales volume & transaction count
  nexusTriggered: boolean;
  nexusTriggerReason: string;
  simulatedAnnualSalesTax: number;
  simulatedCorporateTax: number;
  simulatedTotalTaxBurden: number;
}

export interface DomesticFederationConfig {
  countryCode: string;
  countryName: string;
  currencySymbol: string;
  currencyCode: string;
  taxSystemName: string;
  nexusFrameworkName: string;
  gridRows: number;
  gridCols: number;
  defaultComparedCodes: string[];
}

export const DOMESTIC_FEDERATIONS: Record<string, DomesticFederationConfig> = {
  US: {
    countryCode: 'US',
    countryName: 'United States (52 Jurisdictions)',
    currencySymbol: '$',
    currencyCode: 'USD',
    taxSystemName: 'State & Local Retail Sales Tax + Franchise CIT',
    nexusFrameworkName: 'South Dakota v. Wayfair Economic Nexus',
    gridRows: 7,
    gridCols: 12,
    defaultComparedCodes: ['CA', 'TX', 'NY', 'DE'],
  },
  IN: {
    countryCode: 'IN',
    countryName: 'India (15 Major GST States & UTs)',
    currencySymbol: '₹',
    currencyCode: 'INR',
    taxSystemName: 'Dual CGST + SGST (Intra-State) / IGST (Inter-State)',
    nexusFrameworkName: 'Sec. 24 IGST Compulsory Interstate Nexus & e-Way Bill',
    gridRows: 6,
    gridCols: 6,
    defaultComparedCodes: ['MH', 'KA', 'DL', 'GJ'],
  },
  CA: {
    countryCode: 'CA',
    countryName: 'Canada (13 Provinces & Territories)',
    currencySymbol: 'CA$',
    currencyCode: 'CAD',
    taxSystemName: 'Federal GST (5%) + Provincial PST / Harmonized HST',
    nexusFrameworkName: 'CRA & Provincial Non-Resident Digital/Retail Nexus',
    gridRows: 4,
    gridCols: 7,
    defaultComparedCodes: ['ON', 'BC', 'QC', 'AB'],
  },
  AU: {
    countryCode: 'AU',
    countryName: 'Australia (8 States & Territories)',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    taxSystemName: 'Federal GST (10%) + State Payroll & Conveyance Levies',
    nexusFrameworkName: 'ATO $75k GST Turnover & State Payroll Grouping Nexus',
    gridRows: 4,
    gridCols: 5,
    defaultComparedCodes: ['NSW', 'VIC', 'QLD', 'WA'],
  },
  BR: {
    countryCode: 'BR',
    countryName: 'Brazil (8 Major ICMS States)',
    currencySymbol: 'R$',
    currencyCode: 'BRL',
    taxSystemName: 'State ICMS + Federal PIS/COFINS + Interstate DIFAL',
    nexusFrameworkName: 'EC 87/2015 Interstate Destination DIFAL & NF-e',
    gridRows: 4,
    gridCols: 4,
    defaultComparedCodes: ['SP', 'RJ', 'MG', 'SC'],
  },
};

// Accurate geographic tile cartogram coordinates for US (50 States + DC, PR, VI)
const US_SPATIAL_GRID: Record<string, SpatialGridCoord> = {
  AK: { code: 'AK', row: 0, col: 0, regionGroup: 'West', hubCity: 'Anchorage' },
  ME: { code: 'ME', row: 0, col: 11, regionGroup: 'Northeast', hubCity: 'Portland' },
  WA: { code: 'WA', row: 1, col: 1, regionGroup: 'West', hubCity: 'Seattle' },
  ID: { code: 'ID', row: 1, col: 2, regionGroup: 'West', hubCity: 'Boise' },
  MT: { code: 'MT', row: 1, col: 3, regionGroup: 'West', hubCity: 'Billings' },
  ND: { code: 'ND', row: 1, col: 4, regionGroup: 'Midwest', hubCity: 'Fargo' },
  MN: { code: 'MN', row: 1, col: 5, regionGroup: 'Midwest', hubCity: 'Minneapolis' },
  WI: { code: 'WI', row: 1, col: 6, regionGroup: 'Midwest', hubCity: 'Milwaukee' },
  MI: { code: 'MI', row: 1, col: 7, regionGroup: 'Midwest', hubCity: 'Detroit' },
  VT: { code: 'VT', row: 1, col: 9, regionGroup: 'Northeast', hubCity: 'Burlington' },
  NH: { code: 'NH', row: 1, col: 10, regionGroup: 'Northeast', hubCity: 'Manchester' },
  OR: { code: 'OR', row: 2, col: 1, regionGroup: 'West', hubCity: 'Portland' },
  NV: { code: 'NV', row: 2, col: 2, regionGroup: 'West', hubCity: 'Las Vegas' },
  WY: { code: 'WY', row: 2, col: 3, regionGroup: 'West', hubCity: 'Cheyenne' },
  SD: { code: 'SD', row: 2, col: 4, regionGroup: 'Midwest', hubCity: 'Sioux Falls' },
  IA: { code: 'IA', row: 2, col: 5, regionGroup: 'Midwest', hubCity: 'Des Moines' },
  IL: { code: 'IL', row: 2, col: 6, regionGroup: 'Midwest', hubCity: 'Chicago' },
  IN: { code: 'IN', row: 2, col: 7, regionGroup: 'Midwest', hubCity: 'Indianapolis' },
  OH: { code: 'OH', row: 2, col: 8, regionGroup: 'Midwest', hubCity: 'Columbus' },
  NY: { code: 'NY', row: 2, col: 9, regionGroup: 'Northeast', hubCity: 'New York City' },
  MA: { code: 'MA', row: 2, col: 10, regionGroup: 'Northeast', hubCity: 'Boston' },
  RI: { code: 'RI', row: 2, col: 11, regionGroup: 'Northeast', hubCity: 'Providence' },
  CA: { code: 'CA', row: 3, col: 1, regionGroup: 'West', hubCity: 'Los Angeles' },
  UT: { code: 'UT', row: 3, col: 2, regionGroup: 'West', hubCity: 'Salt Lake City' },
  CO: { code: 'CO', row: 3, col: 3, regionGroup: 'West', hubCity: 'Denver' },
  NE: { code: 'NE', row: 3, col: 4, regionGroup: 'Midwest', hubCity: 'Omaha' },
  MO: { code: 'MO', row: 3, col: 5, regionGroup: 'Midwest', hubCity: 'St. Louis' },
  KY: { code: 'KY', row: 3, col: 6, regionGroup: 'South', hubCity: 'Louisville' },
  WV: { code: 'WV', row: 3, col: 7, regionGroup: 'South', hubCity: 'Charleston' },
  PA: { code: 'PA', row: 3, col: 8, regionGroup: 'Northeast', hubCity: 'Philadelphia' },
  NJ: { code: 'NJ', row: 3, col: 9, regionGroup: 'Northeast', hubCity: 'Newark' },
  CT: { code: 'CT', row: 3, col: 10, regionGroup: 'Northeast', hubCity: 'Hartford' },
  AZ: { code: 'AZ', row: 4, col: 2, regionGroup: 'West', hubCity: 'Phoenix' },
  NM: { code: 'NM', row: 4, col: 3, regionGroup: 'West', hubCity: 'Albuquerque' },
  KS: { code: 'KS', row: 4, col: 4, regionGroup: 'Midwest', hubCity: 'Wichita' },
  AR: { code: 'AR', row: 4, col: 5, regionGroup: 'South', hubCity: 'Little Rock' },
  TN: { code: 'TN', row: 4, col: 6, regionGroup: 'South', hubCity: 'Nashville' },
  VA: { code: 'VA', row: 4, col: 7, regionGroup: 'South', hubCity: 'Richmond' },
  MD: { code: 'MD', row: 4, col: 8, regionGroup: 'South', hubCity: 'Baltimore' },
  DE: { code: 'DE', row: 4, col: 9, regionGroup: 'South', hubCity: 'Wilmington' },
  DC: { code: 'DC', row: 4, col: 10, regionGroup: 'South', hubCity: 'Washington D.C.' },
  OK: { code: 'OK', row: 5, col: 4, regionGroup: 'South', hubCity: 'Oklahoma City' },
  LA: { code: 'LA', row: 5, col: 5, regionGroup: 'South', hubCity: 'New Orleans' },
  MS: { code: 'MS', row: 5, col: 6, regionGroup: 'South', hubCity: 'Jackson' },
  AL: { code: 'AL', row: 5, col: 7, regionGroup: 'South', hubCity: 'Birmingham' },
  GA: { code: 'GA', row: 5, col: 8, regionGroup: 'South', hubCity: 'Atlanta' },
  NC: { code: 'NC', row: 5, col: 9, regionGroup: 'South', hubCity: 'Charlotte' },
  SC: { code: 'SC', row: 5, col: 10, regionGroup: 'South', hubCity: 'Charleston' },
  HI: { code: 'HI', row: 6, col: 0, regionGroup: 'West', hubCity: 'Honolulu' },
  TX: { code: 'TX', row: 6, col: 4, regionGroup: 'South', hubCity: 'Houston / Dallas' },
  FL: { code: 'FL', row: 6, col: 8, regionGroup: 'South', hubCity: 'Miami' },
  PR: { code: 'PR', row: 6, col: 10, regionGroup: 'Territories', hubCity: 'San Juan' },
  VI: { code: 'VI', row: 6, col: 11, regionGroup: 'Territories', hubCity: 'Charlotte Amalie' },
};

const CA_SPATIAL_GRID: Record<string, SpatialGridCoord> = {
  YT: { code: 'YT', row: 0, col: 0, regionGroup: 'North', hubCity: 'Whitehorse' },
  NT: { code: 'NT', row: 0, col: 1, regionGroup: 'North', hubCity: 'Yellowknife' },
  NU: { code: 'NU', row: 0, col: 2, regionGroup: 'North', hubCity: 'Iqaluit' },
  BC: { code: 'BC', row: 1, col: 0, regionGroup: 'West', hubCity: 'Vancouver' },
  AB: { code: 'AB', row: 1, col: 1, regionGroup: 'Prairies', hubCity: 'Calgary' },
  SK: { code: 'SK', row: 1, col: 2, regionGroup: 'Prairies', hubCity: 'Saskatoon' },
  MB: { code: 'MB', row: 1, col: 3, regionGroup: 'Prairies', hubCity: 'Winnipeg' },
  ON: { code: 'ON', row: 1, col: 4, regionGroup: 'Central', hubCity: 'Toronto' },
  QC: { code: 'QC', row: 1, col: 5, regionGroup: 'Central', hubCity: 'Montreal' },
  NL: { code: 'NL', row: 1, col: 6, regionGroup: 'Atlantic', hubCity: 'St. John’s' },
  NB: { code: 'NB', row: 2, col: 4, regionGroup: 'Atlantic', hubCity: 'Moncton' },
  PE: { code: 'PE', row: 2, col: 5, regionGroup: 'Atlantic', hubCity: 'Charlottetown' },
  NS: { code: 'NS', row: 2, col: 6, regionGroup: 'Atlantic', hubCity: 'Halifax' },
};

const IN_SPATIAL_GRID: Record<string, SpatialGridCoord> = {
  PB: { code: 'PB', row: 0, col: 1, regionGroup: 'North', hubCity: 'Ludhiana' },
  HR: { code: 'HR', row: 0, col: 2, regionGroup: 'North', hubCity: 'Gurugram' },
  DL: { code: 'DL', row: 1, col: 2, regionGroup: 'North', hubCity: 'New Delhi' },
  RJ: { code: 'RJ', row: 1, col: 1, regionGroup: 'West', hubCity: 'Jaipur' },
  UP: { code: 'UP', row: 1, col: 3, regionGroup: 'North', hubCity: 'Noida / Lucknow' },
  GJ: { code: 'GJ', row: 2, col: 0, regionGroup: 'West', hubCity: 'Ahmedabad' },
  MP: { code: 'MP', row: 2, col: 2, regionGroup: 'Central', hubCity: 'Indore' },
  WB: { code: 'WB', row: 2, col: 4, regionGroup: 'East', hubCity: 'Kolkata' },
  MH: { code: 'MH', row: 3, col: 1, regionGroup: 'West', hubCity: 'Mumbai / Pune' },
  TS: { code: 'TS', row: 3, col: 2, regionGroup: 'South', hubCity: 'Hyderabad' },
  OD: { code: 'OD', row: 3, col: 3, regionGroup: 'East', hubCity: 'Bhubaneswar' },
  KA: { code: 'KA', row: 4, col: 1, regionGroup: 'South', hubCity: 'Bengaluru' },
  AP: { code: 'AP', row: 4, col: 2, regionGroup: 'South', hubCity: 'Visakhapatnam' },
  KL: { code: 'KL', row: 5, col: 1, regionGroup: 'South', hubCity: 'Kochi' },
  TN: { code: 'TN', row: 5, col: 2, regionGroup: 'South', hubCity: 'Chennai' },
};

const AU_SPATIAL_GRID: Record<string, SpatialGridCoord> = {
  NT: { code: 'NT', row: 0, col: 1, regionGroup: 'North', hubCity: 'Darwin' },
  QLD: { code: 'QLD', row: 0, col: 2, regionGroup: 'East', hubCity: 'Brisbane' },
  WA: { code: 'WA', row: 1, col: 0, regionGroup: 'West', hubCity: 'Perth' },
  SA: { code: 'SA', row: 1, col: 1, regionGroup: 'Central', hubCity: 'Adelaide' },
  NSW: { code: 'NSW', row: 1, col: 2, regionGroup: 'East', hubCity: 'Sydney' },
  ACT: { code: 'ACT', row: 1, col: 3, regionGroup: 'East', hubCity: 'Canberra' },
  VIC: { code: 'VIC', row: 2, col: 2, regionGroup: 'South', hubCity: 'Melbourne' },
  TAS: { code: 'TAS', row: 3, col: 2, regionGroup: 'South', hubCity: 'Hobart' },
};

const BR_SPATIAL_GRID: Record<string, SpatialGridCoord> = {
  BA: { code: 'BA', row: 0, col: 2, regionGroup: 'Northeast', hubCity: 'Salvador' },
  DF: { code: 'DF', row: 1, col: 1, regionGroup: 'Center-West', hubCity: 'Brasília' },
  MG: { code: 'MG', row: 1, col: 2, regionGroup: 'Southeast', hubCity: 'Belo Horizonte' },
  SP: { code: 'SP', row: 2, col: 1, regionGroup: 'Southeast', hubCity: 'São Paulo' },
  RJ: { code: 'RJ', row: 2, col: 2, regionGroup: 'Southeast', hubCity: 'Rio de Janeiro' },
  PR: { code: 'PR', row: 3, col: 1, regionGroup: 'South', hubCity: 'Curitiba' },
  SC: { code: 'SC', row: 3, col: 2, regionGroup: 'South', hubCity: 'Florianópolis' },
  RS: { code: 'RS', row: 3, col: 0, regionGroup: 'South', hubCity: 'Porto Alegre' },
};

const SPATIAL_GRIDS_BY_COUNTRY: Record<string, Record<string, SpatialGridCoord>> = {
  US: US_SPATIAL_GRID,
  CA: CA_SPATIAL_GRID,
  IN: IN_SPATIAL_GRID,
  AU: AU_SPATIAL_GRID,
  BR: BR_SPATIAL_GRID,
};

export interface FiscalSimulationOptions {
  annualRevenue: number;
  annualTransactions: number;
  taxableProfitMarginPercent?: number; // default 15%
}

/**
 * Enriches a single subdivision with composite burden scores, economic nexus classification,
 * and simulated tax liabilities based on annual revenue and transaction count.
 */
export function analyzeSubdivisionFiscalEnvironment(
  sub: SubDivisionTax,
  countryCode: string,
  sim: FiscalSimulationOptions = { annualRevenue: 250000, annualTransactions: 250, taxableProfitMarginPercent: 15 }
): EnrichedSubdivisionAnalytics {
  const gridMap = SPATIAL_GRIDS_BY_COUNTRY[countryCode] || {};
  const grid: SpatialGridCoord = gridMap[sub.code] || {
    code: sub.code,
    row: 0,
    col: 0,
    regionGroup: 'General',
  };

  const salesTaxRate = sub.salesTaxRate ?? 0;
  const combinedRate = sub.avgCombinedSalesTaxRate ?? salesTaxRate;
  const localSurchargeRate = Math.max(0, Number((combinedRate - salesTaxRate).toFixed(3)));
  const corporateRate = sub.corporateFranchiseTax ?? 0;

  // Determine economic nexus thresholds
  let nexusRevenueThreshold: number | null = sub.economicNexusThreshold?.revenue ?? null;
  const nexusTransactionsThreshold: number | null = sub.economicNexusThreshold?.transactions ?? null;

  if (nexusRevenueThreshold === null) {
    if (countryCode === 'IN') nexusRevenueThreshold = 2000000; // ₹20L standard GST threshold (₹0 for interstate goods)
    else if (countryCode === 'CA') nexusRevenueThreshold = 30000; // CA$30,000 small supplier threshold
    else if (countryCode === 'AU') nexusRevenueThreshold = 75000; // A$75,000 GST registration turnover
    else if (countryCode === 'BR') nexusRevenueThreshold = 81000; // R$81,000 MEI threshold
  }

  // Classify Nexus Category & Strictness Score (0-100)
  let nexusCategory: NexusCategory = 'Standard Wayfair ($100k)';
  let nexusStrictnessScore = 65;

  if (countryCode === 'US') {
    if (salesTaxRate === 0 && combinedRate < 2.0) {
      nexusCategory = 'No Sales Tax (NOMAD)';
      nexusStrictnessScore = 5;
      nexusRevenueThreshold = null;
    } else if (nexusRevenueThreshold && nexusRevenueThreshold >= 250000) {
      nexusCategory = 'High Threshold ($250k–$500k)';
      nexusStrictnessScore = 40;
    } else if (nexusTransactionsThreshold && nexusTransactionsThreshold > 0) {
      nexusCategory = 'Strict Dual Trigger ($100k or 200 tx)';
      nexusStrictnessScore = 85;
    } else {
      nexusCategory = 'Standard Wayfair ($100k)';
      nexusStrictnessScore = 65;
    }
  } else {
    nexusCategory = 'Mandatory GST / VAT Nexus';
    nexusStrictnessScore = countryCode === 'IN' || countryCode === 'BR' ? 92 : 78;
  }

  // SaaS Taxability Score
  const saasTaxabilityScore =
    sub.saasTaxable === true ? 100 : sub.saasTaxable === 'Partially Taxable' ? 55 : 0;

  // Composite Fiscal Burden Score (0-100)
  // Normalizes combined sales/GST rate (0-30%), corporate rate (0-35%), and SaaS/Digital exposure
  const normalizedSalesComponent = Math.min(100, (combinedRate / 22) * 100);
  const normalizedCorpComponent = Math.min(100, (corporateRate / 34) * 100);
  const compositeFiscalBurdenScore = Math.round(
    normalizedSalesComponent * 0.48 +
      normalizedCorpComponent * 0.32 +
      saasTaxabilityScore * 0.12 +
      nexusStrictnessScore * 0.08
  );

  // Determine whether Nexus is triggered under current simulation parameters
  let nexusTriggered = false;
  let nexusTriggerReason = 'No retail sales tax nexus';

  if (countryCode === 'US' && salesTaxRate === 0 && combinedRate < 2.0) {
    if (sub.code === 'AK') {
      const revHit = sim.annualRevenue >= 100000;
      const txHit = sim.annualTransactions >= 200;
      nexusTriggered = revHit || txHit;
      nexusTriggerReason = revHit
        ? 'ARSSTC Local Municipal Revenue Nexus (>= $100k)'
        : txHit
        ? 'ARSSTC Local Municipal Transaction Nexus (>= 200 tx)'
        : 'Below ARSSTC $100k / 200 tx threshold';
    } else {
      nexusTriggered = false;
      nexusTriggerReason = 'NOMAD State (0% State Sales Tax)';
    }
  } else if (countryCode === 'IN') {
    nexusTriggered = true;
    nexusTriggerReason = 'Sec. 24 IGST Act: Mandatory for all interstate supplies';
  } else if (nexusRevenueThreshold !== null) {
    const revHit = sim.annualRevenue >= nexusRevenueThreshold;
    const txHit =
      nexusTransactionsThreshold !== null && sim.annualTransactions >= nexusTransactionsThreshold;
    nexusTriggered = revHit || txHit;
    if (revHit && txHit) {
      nexusTriggerReason = `Both Revenue (>= ${nexusRevenueThreshold.toLocaleString()}) & Tx (>= ${nexusTransactionsThreshold}) exceeded`;
    } else if (revHit) {
      nexusTriggerReason = `Revenue threshold (>= ${nexusRevenueThreshold.toLocaleString()}) exceeded`;
    } else if (txHit) {
      nexusTriggerReason = `Transaction count (>= ${nexusTransactionsThreshold} tx) exceeded`;
    } else {
      nexusTriggerReason = `Below ${nexusRevenueThreshold.toLocaleString()} economic nexus threshold`;
    }
  }

  const profitMargin = (sim.taxableProfitMarginPercent ?? 15) / 100;
  const simulatedAnnualSalesTax = nexusTriggered
    ? Math.round(sim.annualRevenue * (combinedRate / 100))
    : 0;
  const simulatedCorporateTax = Math.round(
    sim.annualRevenue * profitMargin * (corporateRate / 100)
  );
  const simulatedTotalTaxBurden = simulatedAnnualSalesTax + simulatedCorporateTax;

  return {
    subdivision: sub,
    countryCode,
    code: sub.code,
    name: sub.name,
    grid,
    salesTaxRate,
    combinedRate,
    localSurchargeRate,
    corporateRate,
    nexusRevenueThreshold,
    nexusTransactionsThreshold,
    nexusCategory,
    nexusStrictnessScore,
    compositeFiscalBurdenScore,
    saasTaxabilityScore,
    nexusTriggered,
    nexusTriggerReason,
    simulatedAnnualSalesTax,
    simulatedCorporateTax,
    simulatedTotalTaxBurden,
  };
}

/**
 * Analyzes all subdivisions in a federation and computes summary statistics and D3 scales.
 */
export function getFederationFiscalDataset(
  countryCode: string,
  sim?: FiscalSimulationOptions
): {
  config: DomesticFederationConfig;
  items: EnrichedSubdivisionAnalytics[];
  stats: {
    minCombinedRate: number;
    maxCombinedRate: number;
    avgCombinedRate: number;
    maxCorporateRate: number;
    saasTaxableCount: number;
    nexusTriggeredCount: number;
    lowestBurdenState: EnrichedSubdivisionAnalytics | null;
    highestBurdenState: EnrichedSubdivisionAnalytics | null;
  };
} {
  const config = DOMESTIC_FEDERATIONS[countryCode] || DOMESTIC_FEDERATIONS.US;
  const rawSubs = ALL_SUBDIVISIONS_MAP[config.countryCode] || [];
  const items = rawSubs.map((sub) =>
    analyzeSubdivisionFiscalEnvironment(sub, config.countryCode, sim)
  );

  const combinedRates = items.map((d) => d.combinedRate);
  const corpRates = items.map((d) => d.corporateRate);

  const minCombinedRate = min(combinedRates) ?? 0;
  const maxCombinedRate = max(combinedRates) ?? 0;
  const avgCombinedRate = Number((mean(combinedRates) ?? 0).toFixed(2));
  const maxCorporateRate = max(corpRates) ?? 0;
  const saasTaxableCount = items.filter((d) => d.subdivision.saasTaxable !== false).length;
  const nexusTriggeredCount = items.filter((d) => d.nexusTriggered).length;

  const sortedByBurden = [...items].sort(
    (a, b) => a.compositeFiscalBurdenScore - b.compositeFiscalBurdenScore
  );

  return {
    config,
    items,
    stats: {
      minCombinedRate,
      maxCombinedRate,
      avgCombinedRate,
      maxCorporateRate,
      saasTaxableCount,
      nexusTriggeredCount,
      lowestBurdenState: sortedByBurden[0] || null,
      highestBurdenState: sortedByBurden[sortedByBurden.length - 1] || null,
    },
  };
}

/**
 * Returns the numeric metric value for a given state and selected choropleth metric.
 */
export function getMetricNumericValue(
  item: EnrichedSubdivisionAnalytics,
  metric: MapMetricKey
): number {
  switch (metric) {
    case 'combinedRate':
      return item.combinedRate;
    case 'salesTaxRate':
      return item.salesTaxRate;
    case 'corporateRate':
      return item.corporateRate;
    case 'compositeBurden':
      return item.compositeFiscalBurdenScore;
    case 'nexusThreshold':
      return item.nexusRevenueThreshold ?? 0;
    case 'saasRegime':
      return item.saasTaxabilityScore;
  }
}

/**
 * Computes a D3-powered color hex/rgb string and readable text contrast class for a state tile
 * based on the active metric and federation dataset domain.
 */
export function getChoroplethTileStyle(
  item: EnrichedSubdivisionAnalytics,
  metric: MapMetricKey,
  allItems: EnrichedSubdivisionAnalytics[]
): { fillHex: string; textClass: string; badgeText: string } {
  if (metric === 'saasRegime') {
    if (item.subdivision.saasTaxable === true) {
      return { fillHex: '#4f46e5', textClass: 'text-white', badgeText: 'Taxable' };
    }
    if (item.subdivision.saasTaxable === 'Partially Taxable') {
      return { fillHex: '#f59e0b', textClass: 'text-slate-950', badgeText: 'Partial' };
    }
    return { fillHex: '#10b981', textClass: 'text-white', badgeText: 'Exempt' };
  }

  if (metric === 'nexusThreshold') {
    if (item.nexusCategory === 'No Sales Tax (NOMAD)') {
      return { fillHex: '#10b981', textClass: 'text-white', badgeText: 'No Tax' };
    }
    if (item.nexusRevenueThreshold && item.nexusRevenueThreshold >= 250000) {
      return {
        fillHex: '#38bdf8',
        textClass: 'text-slate-950',
        badgeText: `${Math.round(item.nexusRevenueThreshold / 1000)}k`,
      };
    }
    if (item.nexusTransactionsThreshold) {
      return { fillHex: '#e11d48', textClass: 'text-white', badgeText: '100k/200tx' };
    }
    return {
      fillHex: '#6366f1',
      textClass: 'text-white',
      badgeText: item.nexusRevenueThreshold
        ? `${Math.round(item.nexusRevenueThreshold / 1000)}k`
        : 'Mandatory',
    };
  }

  const values = allItems.map((d) => getMetricNumericValue(d, metric));
  const minVal = min(values) ?? 0;
  const maxVal = Math.max(minVal + 1, max(values) ?? 10);
  const val = getMetricNumericValue(item, metric);

  if (val === 0 && (metric === 'salesTaxRate' || metric === 'combinedRate' || metric === 'corporateRate')) {
    return {
      fillHex: '#10b981',
      textClass: 'text-white',
      badgeText: '0%',
    };
  }

  const ratioScale = scaleLinear().domain([minVal, maxVal]).range([0, 1]).clamp(true);
  const t = ratioScale(val);

  // 5-stop institutional fiscal palette from soft sky/indigo to deep crimson-indigo
  let fillHex = '#e0e7ff';
  let textClass = 'text-slate-900';
  if (t < 0.25) {
    fillHex = '#dbeafe'; // blue-100
    textClass = 'text-slate-900';
  } else if (t < 0.5) {
    fillHex = '#93c5fd'; // blue-300
    textClass = 'text-slate-950';
  } else if (t < 0.75) {
    fillHex = '#4f46e5'; // indigo-600
    textClass = 'text-white';
  } else {
    fillHex = '#312e81'; // indigo-900
    textClass = 'text-white';
  }

  const badgeText =
    metric === 'compositeBurden' ? `${val}/100` : `${Number(val.toFixed(2))}%`;

  return { fillHex, textClass, badgeText };
}
