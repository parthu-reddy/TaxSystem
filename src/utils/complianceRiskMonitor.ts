import type { TradeCalculationInput, TradeCalculationResult } from './tariffCalculator.ts';
import { FREE_TRADE_AGREEMENTS } from './tariffCalculator.ts';
import { GLOBAL_TAX_DATABASE } from '../data/taxDatabase.ts';

export type RiskSeverity = 'Critical' | 'High' | 'Medium' | 'Advisory';

export type RiskActionType =
  | 'apply_fta'
  | 'set_benchmark_freight'
  | 'open_permissions'
  | 'switch_to_cross_border'
  | 'acknowledge_mitigation';

export interface ComplianceRiskAlert {
  id: string;
  title: string;
  badgeLabel: string;
  severity: RiskSeverity;
  category:
    | 'FTA Rules of Origin'
    | 'WTO Customs Valuation'
    | 'Carbon & ESG (CBAM)'
    | 'Trade Remedies & ADD/CVD'
    | 'Export Controls & Sanctions'
    | 'PGA / Biosecurity & Excise'
    | 'Customs Entry & Bonding'
    | 'Domestic / Interstate Nexus';
  violationSummary: string;
  statutoryCitation: string;
  financialExposureNote: string;
  actionType: RiskActionType;
  actionLabel: string;
  actionPayload?: string | number;
}

export interface ComplianceRiskSummary {
  alerts: ComplianceRiskAlert[];
  activeAlertsCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  mitigatedIds: string[];
  overallRiskLevel: 'Critical' | 'High' | 'Elevated' | 'Compliant';
  readinessScore: number; // 0 to 100
}

const CBAM_HS_PREFIXES = ['76', '72', '73', '25', '28', '31', '27'];
const DUAL_USE_HS_PREFIXES = ['8542', '8471', '8517', '8541', '88', '93'];
const SPS_EXCISE_HS_PREFIXES = [
  '01',
  '02',
  '03',
  '04',
  '07',
  '08',
  '09',
  '10',
  '15',
  '16',
  '19',
  '20',
  '21',
  '22',
  '24',
  '30',
];

/**
 * Pure function that evaluates cross-border and domestic shipment parameters from TariffCalculator
 * and returns structured, actionable compliance violation alerts and a readiness score.
 */
export function evaluateShipmentComplianceRisks(
  input: TradeCalculationInput,
  result: TradeCalculationResult,
  mitigatedIds: string[] = []
): ComplianceRiskSummary {
  const alerts: ComplianceRiskAlert[] = [];
  const hsClean = (input.hsCode || '').trim();
  const hsChapter = hsClean.slice(0, 2);
  const hsHeading = hsClean.slice(0, 4);

  const destCountryObj = GLOBAL_TAX_DATABASE.find((c) => c.code === input.destinationCountry);

  if (!result.isInterstateOnly) {
    // 1. Check WTO Customs Valuation Risk: Missing or anomalously low Freight & Insurance
    const freightRatio =
      input.customsValue > 0 ? input.shippingInsuranceCost / input.customsValue : 0;
    const benchmarkFreight = Math.max(150, Math.round(input.customsValue * 0.05));

    if (input.shippingInsuranceCost <= 0) {
      alerts.push({
        id: 'cif-freight-zero',
        title: 'Undeclared CIF Freight & Insurance ($0.00 Valuation Violation)',
        badgeLabel: '$0 CIF Freight Violation',
        severity: 'Critical',
        category: 'WTO Customs Valuation',
        violationSummary:
          'Declaring $0.00 international freight and marine insurance on a cross-border entry triggers automatic customs valuation rejection or statutory uplift under WTO Valuation Agreement Art. VII.',
        statutoryCitation: 'WTO Customs Valuation Agreement Art. 8 & 19 CFR § 152.103',
        financialExposureNote: `Customs authorities may assess arbitrary uplift + 20% negligence penalty. Recommended 5% CIF benchmark: ${benchmarkFreight.toLocaleString()} ${input.currency}.`,
        actionType: 'set_benchmark_freight',
        actionLabel: `Auto-Set 5% CIF Freight (${benchmarkFreight.toLocaleString()} ${input.currency})`,
        actionPayload: benchmarkFreight,
      });
    } else if (freightRatio < 0.015 && input.customsValue >= 5000) {
      alerts.push({
        id: 'cif-freight-low',
        title: `Abnormally Low Freight-to-Value Ratio (${(freightRatio * 100).toFixed(2)}% of FOB)`,
        badgeLabel: 'Low CIF Ratio (<1.5%)',
        severity: 'High',
        category: 'WTO Customs Valuation',
        violationSummary:
          'Declared freight and insurance is below 1.5% of goods value, flagging post-entry audit risk for omitted Incoterms (EXW/FOB) inland haulage or insurance charges.',
        statutoryCitation: 'WTO Valuation Agreement Art. 8(2) & UCC Art. 70–71',
        financialExposureNote: `Subject to customs CF-28 Request for Information. Benchmark 5% CIF freight is ${benchmarkFreight.toLocaleString()} ${input.currency}.`,
        actionType: 'set_benchmark_freight',
        actionLabel: `Adjust to 5% CIF Benchmark (${benchmarkFreight.toLocaleString()} ${input.currency})`,
        actionPayload: benchmarkFreight,
      });
    }

    // 2. Check Unclaimed / Uncertified Eligible Free Trade Agreement (FTA) OR Active FTA Origin Audit Risk
    const eligibleFta = FREE_TRADE_AGREEMENTS.find(
      (fta) =>
        fta.countries.includes(input.originCountry) &&
        fta.countries.includes(input.destinationCountry)
    );

    if (
      eligibleFta &&
      input.tradeAgreementApplied !== eligibleFta.id &&
      result.baseTariffRate > 0
    ) {
      const discountRatio = 1 - (eligibleFta.dutyMultiplier ?? 0);
      const potentialSavings = Math.round(
        result.cifValue * (result.baseTariffRate / 100) * discountRatio
      );
      alerts.push({
        id: `unclaimed-fta-${eligibleFta.id}`,
        title: `Uncertified Preferential Tariff Claim (${eligibleFta.name})`,
        badgeLabel: `Lock In ${eligibleFta.id} Relief`,
        severity: 'High',
        category: 'FTA Rules of Origin',
        violationSummary: `Origin (${input.originCountry}) and Destination (${input.destinationCountry}) qualify for ${eligibleFta.name}, but the preferential pact has not been explicitly locked in on the commercial invoice declaration (${result.baseTariffRate}% MFN duty at risk).`,
        statutoryCitation: `${eligibleFta.name} — Rules of Origin & Preferential Tariff Protocol`,
        financialExposureNote: `Duty relief at stake: ${potentialSavings.toLocaleString()} ${input.currency} upon formal Certificate of Origin election.`,
        actionType: 'apply_fta',
        actionLabel: `Lock In ${eligibleFta.id} Preferential Pact`,
        actionPayload: eligibleFta.id,
      });
    } else if (result.tradeAgreementApplied) {
      alerts.push({
        id: `fta-rvc-audit-${result.tradeAgreementApplied}`,
        title: `${result.tradeAgreementApplied} Rules of Origin & RVC Verification Requirement`,
        badgeLabel: `${result.tradeAgreementApplied} Origin Audit Risk`,
        severity: 'Medium',
        category: 'FTA Rules of Origin',
        violationSummary: `Claiming preferential duty relief (${result.tradeAgreementSavings.toLocaleString()} ${input.currency} saved) requires a valid Certificate of Origin and Regional Value Content (RVC) bill-of-materials audit trail retained for 5 years.`,
        statutoryCitation: `${result.tradeAgreementApplied} Chapter 4/5 Origin Procedures & 19 CFR Part 182`,
        financialExposureNote: `Invalid origin declarations result in retroactive clawback of ${result.tradeAgreementSavings.toLocaleString()} ${input.currency} plus statutory interest.`,
        actionType: 'acknowledge_mitigation',
        actionLabel: 'Attest Origin Certificate & RVC File',
      });
    }

    // 3. Check EU / UK Carbon Border Adjustment Mechanism (CBAM) Violation Risk
    const isCbamDest =
      Boolean(destCountryObj?.cbamApplicable) ||
      ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'PL', 'SE', 'AT', 'IE', 'GB'].includes(
        input.destinationCountry
      );

    if (isCbamDest && CBAM_HS_PREFIXES.includes(hsChapter)) {
      alerts.push({
        id: `cbam-carbon-${hsChapter}-${input.destinationCountry}`,
        title: 'Mandatory EU/UK CBAM Embedded Carbon Emissions Reporting Violation',
        badgeLabel: 'CBAM Carbon Levy Alert',
        severity: 'Critical',
        category: 'Carbon & ESG (CBAM)',
        violationSummary: `HS Chapter ${hsChapter} (${hsClean}) is a regulated carbon-intensive sector imported into ${input.destinationCountry}. Entry without an Authorized CBAM Declarant account and verified installation-level CO2e emissions report is prohibited.`,
        statutoryCitation: 'Regulation (EU) 2023/956 (CBAM Definitive Regime 2026) Arts. 4–9',
        financialExposureNote:
          'Non-compliance penalty of €10 to €50 per tonne of unreported embedded CO2e emissions plus border hold.',
        actionType: 'open_permissions',
        actionLabel: 'Verify CBAM Declarant & Emissions Filing',
      });
    }

    // 4. Check Trade Remedies: Anti-Dumping / Countervailing Duties (ADD/CVD) & Section 301
    const isHighRiskTradeRemedyRoute =
      input.originCountry === 'CN' &&
      ['US', 'DE', 'FR', 'IT', 'CA', 'IN', 'GB'].includes(input.destinationCountry) &&
      ['8703', '8541', '7601', '8507', '8542', '7208', '7304'].includes(hsHeading);

    if (result.antiDumpingDuty > 0 || isHighRiskTradeRemedyRoute) {
      alerts.push({
        id: `add-cvd-${hsHeading}-${input.originCountry}-${input.destinationCountry}`,
        title: 'Anti-Dumping / Countervailing Duty (ADD/CVD) & Trade Remedy Enforcement',
        badgeLabel: 'ADD / CVD Trade Remedy',
        severity: 'Critical',
        category: 'Trade Remedies & ADD/CVD',
        violationSummary: `Commodity HS ${hsClean} from ${input.originCountry} to ${input.destinationCountry} is subject to active trade remedy surcharges, Mill Test Certificate (MTC) melt-and-pour verification, and UFLPA supply-chain traceability.`,
        statutoryCitation:
          'WTO Anti-Dumping Agreement Art. 9 · 19 U.S.C. § 1673 · EU Reg. 2016/1036',
        financialExposureNote:
          result.antiDumpingDuty > 0
            ? `Assessed ADD/CVD surcharge: +${result.antiDumpingDuty.toLocaleString()} ${input.currency} (cash deposit required at entry).`
            : 'Subject to punitive ad-valorem trade remedy cash deposits if manufacturer-specific rate is not documented.',
        actionType: 'acknowledge_mitigation',
        actionLabel: 'Confirm Mill Test & Non-Dumping Bond',
      });
    }

    // 5. Check Dual-Use & Strategic Export Controls (BIS EAR / Wassenaar Arrangement)
    if (
      DUAL_USE_HS_PREFIXES.includes(hsHeading) ||
      DUAL_USE_HS_PREFIXES.includes(hsChapter)
    ) {
      const isAdvancedSemi = hsHeading === '8542' || hsHeading === '8541';
      alerts.push({
        id: `dual-use-export-${hsHeading}`,
        title: isAdvancedSemi
          ? 'ECCN 3A090 / 3A001 Advanced Semiconductor Export Control Screening'
          : 'Dual-Use Encryption & Strategic Technology Export Control Screening',
        badgeLabel: isAdvancedSemi ? 'ECCN 3A090 Export Control' : 'Dual-Use / ECCN Screening',
        severity: isAdvancedSemi ? 'Critical' : 'High',
        category: 'Export Controls & Sanctions',
        violationSummary: `HS ${hsClean} falls under Wassenaar Arrangement Category 3/4/5 (Computing, Telecommunications, Information Security, or Microelectronics). Requires ECCN classification, Mass-Market Encryption (ENC) verification, and Consolidated Screening List (CSL) end-user checks prior to export from ${input.originCountry}.`,
        statutoryCitation:
          '15 CFR Parts 730–774 (EAR) · EU Dual-Use Regulation (EU) 2021/821',
        financialExposureNote:
          'Strict liability administrative fines up to $364,992 per violation or 2x transaction value.',
        actionType: 'acknowledge_mitigation',
        actionLabel: 'Attest ECCN & End-User Screening',
      });
    }

    // 6. Check Sanitary / Phytosanitary (SPS), FDA/USDA & Excise Clearance
    if (SPS_EXCISE_HS_PREFIXES.includes(hsChapter)) {
      alerts.push({
        id: `sps-pga-${hsChapter}`,
        title: 'Partner Government Agency (FDA / Phytosanitary / Excise) Hold Risk',
        badgeLabel: 'SPS / Biosecurity & Excise Hold',
        severity: 'High',
        category: 'PGA / Biosecurity & Excise',
        violationSummary: `HS Chapter ${hsChapter} (${hsClean}) requires advance Partner Government Agency (PGA) electronic message set filing, sanitary/phytosanitary health certificates, or bonded excise warehouse stamping before vessel arrival.`,
        statutoryCitation:
          'WTO SPS Agreement · 21 U.S.C. § 381(m) (FDA Prior Notice) · EU Reg. 2017/625',
        financialExposureNote:
          'Unfiled Prior Notice or missing health certificate triggers immediate port detention and demurrage.',
        actionType: 'open_permissions',
        actionLabel: 'Review Required Health & Excise Permits',
      });
    }

    // 7. Check High-Value Formal Customs Entry & Continuous Surety Bond
    if (input.customsValue >= 2500) {
      alerts.push({
        id: 'formal-entry-bond',
        title: `Formal Customs Entry & Surety Bond Requirement (Value ${input.customsValue.toLocaleString()} ${input.currency})`,
        badgeLabel: 'Formal Entry Bond (> $2.5k)',
        severity: input.customsValue >= 50000 ? 'High' : 'Medium',
        category: 'Customs Entry & Bonding',
        violationSummary: `Commercial shipments exceeding the $2,500 informal entry threshold require a Formal Consumption Entry (CBP Form 7501 / EU SAD), verified Importer of Record (IOR) registration (EORI / EIN / IEC), and an active Single-Transaction or Continuous Customs Bond.`,
        statutoryCitation: '19 CFR § 141.4 & § 113.62 · Union Customs Code (UCC) Art. 89',
        financialExposureNote: `Minimum Continuous Bond = 10% of annual duties/taxes (min $50,000 bond coverage).`,
        actionType: 'acknowledge_mitigation',
        actionLabel: 'Verify Importer Bond & EORI/IOR',
      });
    }
  } else {
    // Domestic / Interstate Compliance Risks
    if (input.originCountry === 'IN') {
      alerts.push({
        id: 'in-interstate-eway-bill',
        title: 'Compulsory GST e-Way Bill (FORM GST EWB-01) & Sec. 24 IGST Compliance',
        badgeLabel: 'Mandatory e-Way Bill & IGST',
        severity: input.customsValue >= 50000 ? 'Critical' : 'High',
        category: 'Domestic / Interstate Nexus',
        violationSummary: `Interstate movement of goods (${input.originSubdivision || 'Origin'} → ${input.destinationSubdivision || 'Dest'}) requires a live 12-digit e-Way Bill (Part-A GSTIN/HSN + Part-B Vehicle/Transporter ID) matched with an IRN e-Invoice prior to dispatch.`,
        statutoryCitation: 'Rule 138 CGST Rules 2017 & Section 129 CGST Act 2017',
        financialExposureNote: `Roadside detention penalty under Sec. 129 equals 200% of applicable IGST (${Math.round(result.subdivisionSalesTaxAmount * 2).toLocaleString()} ${input.currency}).`,
        actionType: 'acknowledge_mitigation',
        actionLabel: 'Confirm e-Way Bill Part-A & Part-B',
      });
    } else if (input.originCountry === 'BR') {
      alerts.push({
        id: 'br-interstate-nfe-difal',
        title: 'SEFAZ NF-e (Modelo 55) XML Authorization & Interstate DIFAL Remittance',
        badgeLabel: 'SEFAZ NF-e & DIFAL Alert',
        severity: 'Critical',
        category: 'Domestic / Interstate Nexus',
        violationSummary: `Interstate shipment in Brazil (${input.originSubdivision || 'SP'} → ${input.destinationSubdivision || 'RJ'}) requires real-time SEFAZ XML authorization of DANFE/NF-e and GNRE payment of the destination state ICMS differential (DIFAL).`,
        statutoryCitation: 'Emenda Constitucional 87/2015 & Ajuste SINIEF 07/05',
        financialExposureNote:
          'Fiscal barrier seizure and 50%–100% ICMS fine for unvalidated DANFE in transit.',
        actionType: 'acknowledge_mitigation',
        actionLabel: 'Attest SEFAZ NF-e & GNRE Receipt',
      });
    } else {
      alerts.push({
        id: `domestic-nexus-${input.originCountry}-${input.destinationSubdivision || 'FED'}`,
        title: `Destination State Economic Nexus & Tax Collection Obligation (${input.destinationSubdivision || input.destinationCountry})`,
        badgeLabel: 'Destination Economic Nexus',
        severity: result.subdivisionSalesTaxRate > 0 ? 'High' : 'Advisory',
        category: 'Domestic / Interstate Nexus',
        violationSummary: `Shipping into ${input.destinationSubdivision || input.destinationCountry} subjects the seller to destination-based sales/use or GST collection (${result.subdivisionSalesTaxRate}%) once economic nexus thresholds are met, unless a valid Resale / Exemption Certificate is on file.`,
        statutoryCitation:
          input.originCountry === 'US'
            ? 'South Dakota v. Wayfair, Inc., 585 U.S. ___ (2018)'
            : 'National Interstate Place-of-Supply & GST/HST Statute',
        financialExposureNote: `Uncollected destination tax liability: ${result.subdivisionSalesTaxAmount.toLocaleString()} ${input.currency} per shipment.`,
        actionType: 'acknowledge_mitigation',
        actionLabel: 'Attest Nexus Registration / Resale Cert',
      });
    }
  }

  // Filter which alerts are still unmitigated
  const unmitigatedAlerts = alerts.filter((a) => !mitigatedIds.includes(a.id));
  const criticalCount = unmitigatedAlerts.filter((a) => a.severity === 'Critical').length;
  const highCount = unmitigatedAlerts.filter((a) => a.severity === 'High').length;
  const mediumCount = unmitigatedAlerts.filter((a) => a.severity === 'Medium').length;

  let overallRiskLevel: ComplianceRiskSummary['overallRiskLevel'] = 'Compliant';
  if (criticalCount > 0) {
    overallRiskLevel = 'Critical';
  } else if (highCount > 0) {
    overallRiskLevel = 'High';
  } else if (mediumCount > 0) {
    overallRiskLevel = 'Elevated';
  }

  const rawPenalty = criticalCount * 32 + highCount * 18 + mediumCount * 10;
  const readinessScore = Math.max(12, Math.min(100, 100 - rawPenalty));

  return {
    alerts,
    activeAlertsCount: unmitigatedAlerts.length,
    criticalCount,
    highCount,
    mediumCount,
    mitigatedIds,
    overallRiskLevel,
    readinessScore,
  };
}
