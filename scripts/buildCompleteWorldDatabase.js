// scripts/buildCompleteWorldDatabase.js
import fs from 'fs';

// Helper to generate services tax info
function generateServicesTaxInfo(c) {
  const isEU = [
    'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'
  ].includes(c.code);
  const isZeroVat = c.vatGstRate === 0;

  let b2bRule = 'Reverse Charge';
  let b2cRate = c.vatGstRate;
  let whtRate = c.withholdingRoyalties || 10;
  let threshold = '€0 (Immediate Registration)';
  let note = '';
  let evidenceUrl = c.authorityWebsite;

  if (c.code === 'US') {
    return {
      vatGstOnServices: 0.0,
      b2bRule: 'Place of Supply (Destination)',
      b2cDigitalServicesTaxable: true,
      b2cDigitalServicesRate: 6.5,
      withholdingTaxOnServices: 30.0,
      treatyReliefAvailable: true,
      reverseChargeApplies: false,
      foreignRegistrationThreshold: '$100,000 / 200 txns (Wayfair State Nexus)',
      servicesStatuteNote: 'No federal VAT. States levy sales tax on SaaS & digital services (25+ states tax SaaS; NY, TX, WA, OH, PA, MA). Withholding tax under IRC Chapter 3 & 4 (Form W-8BEN-E).',
      servicesEvidenceUrl: 'https://www.irs.gov/individuals/international-taxpayers/nra-withholding'
    };
  }

  if (isEU) {
    b2bRule = 'Reverse Charge';
    b2cRate = c.vatGstRate;
    threshold = '€0 (Non-EU suppliers under Non-Union OSS)';
    note = `Article 196 EU VAT Directive: B2B services subject to reverse charge by the customer. B2C digital services taxed at ${c.vatGstRate}% destination VAT via One-Stop Shop (OSS).`;
    evidenceUrl = 'https://vat-one-stop-shop.ec.europa.eu';
  } else if (c.code === 'GB') {
    b2bRule = 'Reverse Charge';
    b2cRate = 20.0;
    threshold = '£0 for non-established taxable persons';
    note = 'VATA 1994 Section 8: Reverse charge applies on B2B cross-border services. B2C digital services subject to standard 20% VAT via Simplified VOEC scheme.';
    evidenceUrl = 'https://www.gov.uk/guidance/the-vat-rules-if-you-supply-digital-services-to-private-consumers';
  } else if (c.code === 'IN') {
    b2bRule = 'Reverse Charge';
    b2cRate = 18.0;
    threshold = '₹0 for foreign OIDAR providers';
    whtRate = 10.0;
    note = 'Section 5(3) IGST Act: RCM applies on imported B2B services. B2C digital/OIDAR services subject to 18% GST. Withholding tax under Section 195 (Form 15CA/15CB).';
    evidenceUrl = 'https://www.incometax.gov.in';
  } else if (c.code === 'AU') {
    b2bRule = 'Reverse Charge';
    b2cRate = 10.0;
    threshold = 'A$75,000';
    whtRate = 10.0;
    note = 'Reverse charge applies on imported B2B services under GST Act 1999 Division 84. Foreign B2C digital providers register under Simplified GST.';
    evidenceUrl = 'https://www.ato.gov.au/business/international-tax-for-business';
  } else if (c.code === 'CA') {
    b2bRule = 'Reverse Charge';
    b2cRate = 5.0;
    threshold = 'CA$30,000';
    whtRate = 25.0;
    note = 'Excise Tax Act Part IX: GST/HST reverse charge on imported taxable services. B2C digital economy registration under Simplified GST/HST regime + 3% DST.';
    evidenceUrl = 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/digital-economy-gsthst.html';
  } else if (c.code === 'JP') {
    b2bRule = 'Reverse Charge';
    b2cRate = 10.0;
    threshold = '¥10,000,000';
    whtRate = 20.42;
    note = 'Consumption Tax Act Article 28-2: Reverse charge mechanism applies to B2B electronic services. Foreign B2C digital providers register under Registered Foreign Business framework.';
    evidenceUrl = 'https://www.nta.go.jp/english/taxes/consumption_tax/cross_border.htm';
  } else if (c.code === 'SG') {
    b2bRule = 'Reverse Charge';
    b2cRate = 9.0;
    threshold = 'S$100,000 digital turnover';
    whtRate = 10.0;
    note = 'Reverse Charge applies to B2B imported services under GST Act. Foreign digital services providers register under Overseas Vendor Registration (OVR) for B2C supplies.';
    evidenceUrl = 'https://www.iras.gov.sg/taxes/goods-services-tax-(gst)/overseas-vendor-registration-(ovr)';
  } else if (c.code === 'AE') {
    b2bRule = 'Reverse Charge';
    b2cRate = 5.0;
    threshold = 'AED 375,000';
    whtRate = 0.0;
    note = 'Federal Decree-Law No. 8 of 2017 Article 48: Reverse charge mechanism mandatory for taxable persons importing services. Standard 5% VAT on cross-border services.';
    evidenceUrl = 'https://tax.gov.ae';
  } else if (c.code === 'SA') {
    b2bRule = 'Reverse Charge';
    b2cRate = 15.0;
    threshold = 'SAR 375,000';
    whtRate = 15.0;
    note = 'Reverse charge mechanism applies under ZATCA VAT Implementing Regulations Article 47. Non-resident digital service providers must register or appoint a tax representative.';
    evidenceUrl = 'https://zatca.gov.sa';
  } else if (isZeroVat) {
    b2bRule = 'Exempt';
    b2cRate = 0.0;
    threshold = 'None';
    whtRate = c.withholdingRoyalties || 0;
    note = `No standard VAT/GST imposed on digital services or software. Statutory withholding tax of ${whtRate}% applies unless treaty relief or domestic exemption is available.`;
    evidenceUrl = c.authorityWebsite;
  } else {
    b2bRule = 'Reverse Charge';
    b2cRate = c.vatGstRate;
    threshold = `Standard threshold or $0 for non-residents`;
    whtRate = c.withholdingRoyalties || 10.0;
    note = `Standard reverse charge applies on B2B cross-border services. B2C digital services and SaaS subject to ${c.vatGstRate}% standard VAT/GST at customer destination.`;
    evidenceUrl = c.authorityWebsite;
  }

  return {
    vatGstOnServices: c.vatGstRate,
    b2bRule,
    b2cDigitalServicesTaxable: c.vatGstRate > 0,
    b2cDigitalServicesRate: b2cRate,
    withholdingTaxOnServices: whtRate,
    treatyReliefAvailable: true,
    reverseChargeApplies: b2bRule === 'Reverse Charge',
    foreignRegistrationThreshold: threshold,
    servicesStatuteNote: note,
    servicesEvidenceUrl: evidenceUrl
  };
}

console.log('Compiling complete list of sovereign nations...');
