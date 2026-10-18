export interface ServicesTaxProfile {
  vatGstOnServices: number; // percentage
  b2bRule: 'Reverse Charge' | 'Place of Supply (Destination)' | 'Origin-based' | 'Exempt';
  b2cDigitalServicesTaxable: boolean;
  b2cDigitalServicesRate: number; // standard or special digital rate
  digitalServicesTaxRate?: number; // DST percentage (e.g. 2%, 3%)
  digitalServicesTaxName?: string; // e.g. "Taxe sur les Services Numériques (TSN)", "Digital Services Tax"
  dstThresholdGlobal?: string; // e.g. "€750M global turnover"
  dstThresholdLocal?: string; // e.g. "€25M domestic turnover"
  withholdingTaxOnServices: number; // statutory withholding on technical/management services (FTS)
  treatyReliefAvailable: boolean;
  reverseChargeApplies: boolean;
  foreignRegistrationThreshold: string; // e.g. "€0 (Immediate)", "None", "$100k"
  servicesStatuteNote: string;
  servicesEvidenceUrl: string;
}

export interface CountryTaxInfo {
  code: string;
  name: string;
  region: 'Americas' | 'Europe' | 'Asia-Pacific' | 'Middle East' | 'Africa';
  currency: string;
  currencySymbol: string;
  corporateTaxRate: number; // percentage
  smallBusinessTaxRate?: number;
  vatGstRate: number; // standard VAT/GST rate
  reducedVatRates?: number[];
  withholdingDividends: number;
  withholdingRoyalties: number;
  withholdingInterest: number;
  digitalServicesTax?: number;
  cbamApplicable: boolean;
  hasPillarTwo: boolean; // OECD 15% Global Minimum Tax
  taxYearEnd: string;
  statutoryAuthority: string;
  authorityWebsite: string;
  statuteReference: string;
  legalGazetteUrl: string; // Official government gazette / legislative portal
  officialEvidenceNote?: string; // Verification note citing statutory circular or gazette issue
  servicesTaxInfo?: ServicesTaxProfile;
  subdivisions?: SubDivisionTax[];
  tradeAgreements: string[];
}

export interface SubDivisionTax {
  code: string;
  name: string;
  type: 'State' | 'Province' | 'Canton' | 'Prefecture' | 'Territory' | 'Union Territory';
  countryCode?: string;
  salesTaxRate: number; // percentage (state level)
  avgCombinedSalesTaxRate?: number; // combined state + local avg
  economicNexusThreshold?: {
    revenue: number;
    transactions?: number;
  };
  corporateFranchiseTax?: number;
  // Services & SaaS Taxability
  saasTaxable: boolean | 'Partially Taxable'; // Is SaaS subject to sales tax?
  saasTaxRate?: number;
  digitalGoodsTaxable: boolean;
  professionalServicesTaxable: boolean; // legal, accounting, consulting
  statuteCitation?: string;
  evidenceUrl?: string;
  stateAuthority?: string;
  notes?: string;
}

export interface ServicesCalculationInput {
  serviceCategory: 'saas' | 'tech_consulting' | 'mgmt_legal' | 'digital_ads' | 'freelance_it' | 'cloud_infrastructure';
  serviceName: string;
  contractValue: number;
  currency: string;
  clientType: 'B2B' | 'B2C';
  providerCountry: string;
  providerSubdivision?: string;
  clientCountry: string;
  clientSubdivision?: string;
  hasDtaaTreaty: boolean;
  hasTaxResidencyCert: boolean; // TRC or Form 10F / W-8BEN-E
}

export interface ServicesCalculationResult {
  contractValue: number;
  currency: string;
  clientType: 'B2B' | 'B2C';
  // VAT / GST / Sales Tax
  destinationTaxRate: number;
  destinationTaxAmount: number;
  taxMechanism: 'Reverse Charge (Buyer Self-Assesses)' | 'Supplier Collected' | 'State Sales Tax' | 'Exempt / Zero-Rated';
  // Withholding Tax (WHT)
  statutoryWhtRate: number;
  effectiveWhtRate: number;
  whtAmount: number;
  treatyReliefApplied: boolean;
  whtSavings: number;
  // Digital Services Tax (DST)
  dstRate: number;
  dstAmount: number;
  dstName?: string;
  // Net Settlement
  netRemittanceToSupplier: number;
  totalTaxComplianceBurden: number;
  // Legal compliance guidance
  statuteCitation: string;
  authorityEvidenceUrl: string;
  requiredDocuments: string[];
  complianceChecklist: string[];
  laymanExplanation: string;
}

export interface FiscalPolicyUpdate {
  id: string;
  countryCode: string;
  countryName: string;
  title: string;
  category: 'Corporate' | 'Tariffs & Trade' | 'VAT / GST' | 'Carbon & ESG' | 'Digital Services' | 'Pillar Two';
  severity: 'High' | 'Medium' | 'Low';
  effectiveDate: string;
  publishedDate: string;
  officialGazette: string;
  sourceUrl: string;
  summary: string;
  mneImpact: {
    cashFlowImpact: string;
    supplyChainRisk: string;
    actionRequired: string;
    laymanExplanation: string;
  };
}

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
}

export interface VaultDocument {
  id: string;
  title: string;
  fileName: string;
  category: 'Commercial Invoice' | 'Bill of Lading' | 'Certificate of Origin' | 'Customs Declaration (SAD)' | 'Tax Clearance' | 'W-8BEN / Withholding Certificate' | 'Transfer Pricing Policy';
  uploadDate: string;
  fileSize: string;
  hsCodes?: string[];
  declaredValue?: number;
  currency?: string;
  originCountry?: string;
  destinationCountry?: string;
  complianceStatus: 'Verified' | 'Attention Required' | 'Pending Review';
  complianceIssues?: string[];
  language?: string;
  tags: string[];
}

export interface RegulatorySource {
  id: string;
  country: string;
  countryCode: string;
  agencyName: string;
  jurisdictionLevel: 'Federal' | 'National' | 'State / Regional' | 'International';
  officialPortal: string;
  legalGazetteUrl: string;
  taxCodeCitation: string;
  lastVerifiedDate: string;
  status: 'Live & Monitored' | 'Periodic Sync';
}
