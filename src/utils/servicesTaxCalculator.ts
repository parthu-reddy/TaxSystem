import { ServicesCalculationInput, ServicesCalculationResult } from '../types/tax.ts';
import { US_STATES_DATABASE, CANADIAN_PROVINCES_DATABASE, INDIAN_STATES_DATABASE } from '../data/statesDatabase.ts';
import { GLOBAL_DST_REGIMES } from '../data/servicesTaxDatabase.ts';
import { GLOBAL_TAX_DATABASE } from '../data/taxDatabase.ts';

export function calculateServicesTax(input: ServicesCalculationInput): ServicesCalculationResult {
  const {
    serviceCategory,
    contractValue,
    currency,
    clientType,
    providerCountry,
    providerSubdivision,
    clientCountry,
    clientSubdivision,
    hasDtaaTreaty,
    hasTaxResidencyCert
  } = input;

  const isCrossBorder = providerCountry !== clientCountry;
  const isUsDomestic = providerCountry === 'US' && clientCountry === 'US';

  // Find country info
  const clientCountryInfo = GLOBAL_TAX_DATABASE.find((c) => c.code === clientCountry) || {
    name: clientCountry,
    vatGstRate: 0,
    statuteReference: 'National Tax Code',
    legalGazetteUrl: 'https://www.oecd.org',
    authorityWebsite: 'https://www.oecd.org',
    withholdingRoyalties: 20
  };

  let destinationTaxRate = 0;
  let taxMechanism: 'Reverse Charge (Buyer Self-Assesses)' | 'Supplier Collected' | 'State Sales Tax' | 'Exempt / Zero-Rated' = 'Exempt / Zero-Rated';
  let statuteCitation = clientCountryInfo.statuteReference;
  let authorityEvidenceUrl = clientCountryInfo.authorityWebsite;

  // 1. Destination Consumption Tax (VAT / GST / State Sales Tax)
  if (clientCountry === 'US') {
    // Look up state in US_STATES_DATABASE
    const state = US_STATES_DATABASE.find((s) => s.code === clientSubdivision);
    if (state) {
      authorityEvidenceUrl = state.evidenceUrl || authorityEvidenceUrl;
      statuteCitation = state.statuteCitation || statuteCitation;

      if (serviceCategory === 'saas' || serviceCategory === 'cloud_infrastructure') {
        if (state.saasTaxable === true) {
          destinationTaxRate = state.avgCombinedSalesTaxRate || state.salesTaxRate;
          taxMechanism = 'State Sales Tax';
        } else if (state.saasTaxable === 'Partially Taxable') {
          destinationTaxRate = state.saasTaxRate || Number((state.salesTaxRate * 0.8).toFixed(2));
          taxMechanism = 'State Sales Tax';
        } else {
          destinationTaxRate = 0.0;
          taxMechanism = 'Exempt / Zero-Rated';
        }
      } else if (serviceCategory === 'mgmt_legal' || serviceCategory === 'tech_consulting') {
        if (state.professionalServicesTaxable) {
          destinationTaxRate = state.salesTaxRate;
          taxMechanism = 'State Sales Tax';
        } else {
          destinationTaxRate = 0.0;
          taxMechanism = 'Exempt / Zero-Rated';
        }
      } else {
        destinationTaxRate = state.digitalGoodsTaxable ? (state.avgCombinedSalesTaxRate || state.salesTaxRate) : 0;
        taxMechanism = destinationTaxRate > 0 ? 'State Sales Tax' : 'Exempt / Zero-Rated';
      }
    } else {
      destinationTaxRate = 0.0;
      taxMechanism = 'Exempt / Zero-Rated';
    }
  } else if (isCrossBorder) {
    // International Cross-Border
    const baseVat = clientCountryInfo.vatGstRate;
    if (clientType === 'B2B') {
      // B2B general rule: Reverse Charge Mechanism
      destinationTaxRate = baseVat;
      taxMechanism = 'Reverse Charge (Buyer Self-Assesses)';
    } else {
      // B2C: foreign seller collected
      destinationTaxRate = baseVat;
      taxMechanism = 'Supplier Collected';
    }
  } else {
    // Domestic non-US
    destinationTaxRate = clientCountryInfo.vatGstRate;
    taxMechanism = 'Supplier Collected';
  }

  const destinationTaxAmount = Number(((contractValue * destinationTaxRate) / 100).toFixed(2));

  // 2. Withholding Tax (WHT) on Technical & Management Services (FTS)
  let statutoryWhtRate = 0;
  let effectiveWhtRate = 0;
  let treatyReliefApplied = false;

  if (isCrossBorder) {
    if (serviceCategory === 'tech_consulting' || serviceCategory === 'mgmt_legal' || serviceCategory === 'freelance_it') {
      // Developing & source jurisdictions levy 15-25% statutory FTS WHT
      statutoryWhtRate = clientCountryInfo.withholdingRoyalties || 20.0;

      if (hasDtaaTreaty && hasTaxResidencyCert) {
        // Reduced treaty rate (typically 10% under OECD/UN Art 12 / Art 12A or 0% under Art 7)
        effectiveWhtRate = Math.min(statutoryWhtRate, 10.0);
        treatyReliefApplied = true;
      } else {
        effectiveWhtRate = statutoryWhtRate;
        treatyReliefApplied = false;
      }
    } else if (serviceCategory === 'saas') {
      // Pure SaaS is generally business profits (0% under Art 7) unless local tax authority treats as copyright license
      statutoryWhtRate = 0;
      effectiveWhtRate = 0;
    }
  }

  const whtAmount = Number(((contractValue * effectiveWhtRate) / 100).toFixed(2));
  const fullStatutoryWht = Number(((contractValue * statutoryWhtRate) / 100).toFixed(2));
  const whtSavings = Number(Math.max(0, fullStatutoryWht - whtAmount).toFixed(2));

  // 3. Digital Services Tax (DST)
  let dstRate = 0;
  let dstAmount = 0;
  let dstName: string | undefined = undefined;

  const matchedDst = GLOBAL_DST_REGIMES.find((d) => d.countryCode === clientCountry);
  if (matchedDst && (serviceCategory === 'digital_ads' || serviceCategory === 'saas' || serviceCategory === 'cloud_infrastructure')) {
    dstRate = matchedDst.rate;
    dstAmount = Number(((contractValue * dstRate) / 100).toFixed(2));
    dstName = matchedDst.taxName;
  }

  // 4. Net Settlement
  // Provider receives contractValue minus WHT withheld at source
  const netRemittanceToSupplier = Number((contractValue - whtAmount).toFixed(2));
  const totalTaxComplianceBurden = Number((destinationTaxAmount + whtAmount + dstAmount).toFixed(2));

  // 5. Compliance Checklist & Required Documents
  const requiredDocuments: string[] = [];
  const complianceChecklist: string[] = [];

  if (clientCountry === 'US') {
    requiredDocuments.push('Form W-8BEN-E (Certificate of Status of Beneficial Owner for United States Tax Withholding)');
    complianceChecklist.push('Verify state economic nexus threshold ($100k - $500k sales in destination state)');
    if (taxMechanism === 'State Sales Tax') {
      complianceChecklist.push('Issue sales invoice itemizing state sales tax for ' + (clientSubdivision || 'destination state'));
    }
  } else if (isCrossBorder) {
    if (clientType === 'B2B') {
      complianceChecklist.push('Include mandatory Reverse Charge invoice statement: "Reverse charge: customer to account for VAT pursuant to national law"');
      complianceChecklist.push('Validate client corporate VAT / Tax ID on government registry (e.g. EU VIES, HMRC Checker)');
    } else {
      complianceChecklist.push('Collect and remit destination consumer VAT/GST via One-Stop Shop (EU OSS) or local non-resident portal');
    }

    if (effectiveWhtRate > 0 || hasDtaaTreaty) {
      requiredDocuments.push('Tax Residency Certificate (TRC) from provider country tax ministry');
      requiredDocuments.push('Form 10F / No PE (Permanent Establishment) declaration');
      complianceChecklist.push('File withholding tax treaty relief claim with foreign revenue authority');
    }
  }

  if (dstAmount > 0) {
    complianceChecklist.push(`Annual DST reconciliation under ${dstName} (${matchedDst?.globalRevenueThreshold})`);
  }

  const laymanExplanation =
    clientType === 'B2B' && isCrossBorder && taxMechanism === 'Reverse Charge (Buyer Self-Assesses)'
      ? `Because this is a cross-border B2B digital/service transaction to ${clientCountryInfo.name}, the supplier bills $0 VAT on the invoice under the Reverse Charge Mechanism. The buyer self-assesses ${destinationTaxRate}% local VAT in their domestic VAT return with an offsetting input tax credit.`
      : clientCountry === 'US'
      ? `For delivery into ${clientSubdivision || 'the US'}, the service is subject to ${destinationTaxRate}% state/local sales tax (${taxMechanism}).`
      : `Standard destination consumption tax of ${destinationTaxRate}% is applicable on this ${clientType} service delivery.`;

  return {
    contractValue,
    currency,
    clientType,
    destinationTaxRate,
    destinationTaxAmount,
    taxMechanism,
    statutoryWhtRate,
    effectiveWhtRate,
    whtAmount,
    treatyReliefApplied,
    whtSavings,
    dstRate,
    dstAmount,
    dstName,
    netRemittanceToSupplier,
    totalTaxComplianceBurden,
    statuteCitation,
    authorityEvidenceUrl,
    requiredDocuments,
    complianceChecklist,
    laymanExplanation
  };
}
