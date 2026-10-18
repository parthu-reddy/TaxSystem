// scripts/populateAllCountries.js
import fs from 'fs';

// Read existing taxDatabase.ts
const existingContent = fs.readFileSync('src/data/taxDatabase.ts', 'utf8');

// The remaining countries to reach 100% full global coverage:
const additionalCountries = [
  // --- AMERICAS ---
  {
    code: 'BO', name: 'Bolivia', region: 'Americas', currency: 'BOB', currencySymbol: 'Bs.',
    corporateTaxRate: 25.0, vatGstRate: 13.0, withholdingDividends: 12.5, withholdingRoyalties: 12.5, withholdingInterest: 12.5,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Servicio de Impuestos Nacionales (SIN)', authorityWebsite: 'https://www.impuestos.gob.bo',
    legalGazetteUrl: 'http://gacetaoficialdebolivia.gob.bo', statuteReference: 'Ley 843 de Reforma Tributaria (Texto Ordenado)',
    officialEvidenceNote: 'Gaceta Oficial del Estado Plurinacional de Bolivia Ley 843 Art 1 y Art 39 regulando IUE e IVA.',
    tradeAgreements: ['CAN (Andean Community)', 'Mercosur (Acceding)', 'ALADI'],
    servicesTaxInfo: {
      vatGstOnServices: 13.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 13.0,
      withholdingTaxOnServices: 12.5, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Impuesto sobre las Utilidades de las Empresas (IUE-Beneficiarios del Exterior) applies 12.5% withholding on foreign service fees.',
      servicesEvidenceUrl: 'https://www.impuestos.gob.bo'
    }
  },
  {
    code: 'PY', name: 'Paraguay', region: 'Americas', currency: 'PYG', currencySymbol: '₲',
    corporateTaxRate: 10.0, vatGstRate: 10.0, withholdingDividends: 15.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Dirección Nacional de Ingresos Tributarios (DNIT)', authorityWebsite: 'https://www.dnit.gov.py',
    legalGazetteUrl: 'https://www.gacetaoficial.gov.py', statuteReference: 'Ley N° 6380/2019 de Modernización y Simplificación del Sistema Tributario Nacional',
    officialEvidenceNote: 'Gaceta Oficial de la República del Paraguay Decreto N° 3181/2019 reglamentando el Impuesto a la Renta de No Residentes (INR).',
    tradeAgreements: ['Mercosur', 'ALADI'],
    servicesTaxInfo: {
      vatGstOnServices: 10.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 10.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Digital services supplied by foreign entities to Paraguayan residents are subject to 10% IVA and 15% INR (withholding via credit cards or local entities).',
      servicesEvidenceUrl: 'https://www.dnit.gov.py'
    }
  },
  {
    code: 'EC', name: 'Ecuador', region: 'Americas', currency: 'USD', currencySymbol: '$',
    corporateTaxRate: 25.0, vatGstRate: 15.0, withholdingDividends: 10.0, withholdingRoyalties: 25.0, withholdingInterest: 0.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Servicio de Rentas Internas (SRI)', authorityWebsite: 'https://www.sri.gob.ec',
    legalGazetteUrl: 'https://www.registroficial.gob.ec', statuteReference: 'Ley de Régimen Tributario Interno (LRTI) & Ley Orgánica de Eficiencia Económica',
    officialEvidenceNote: 'Registro Oficial Suplemento 526 Ley para Enfrentar el Conflicto Armado Interno raising standard VAT rate to 15%.',
    tradeAgreements: ['CAN (Andean Community)', 'Ecuador-EFTA FTA', 'Ecuador-China FTA'],
    servicesTaxInfo: {
      vatGstOnServices: 15.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 15.0,
      withholdingTaxOnServices: 25.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (SRI Digital Services Registry)',
      servicesStatuteNote: 'Resolution NAC-DGERCGC20-00000057 regulates VAT on import of digital services; card issuers or importers withhold 15% VAT and applicable IR withholding.',
      servicesEvidenceUrl: 'https://www.sri.gob.ec/servicios-digitales'
    }
  },
  {
    code: 'VE', name: 'Venezuela', region: 'Americas', currency: 'VES', currencySymbol: 'Bs.',
    corporateTaxRate: 34.0, vatGstRate: 16.0, withholdingDividends: 34.0, withholdingRoyalties: 34.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Servicio Nacional Integrado de Administración Aduanera y Tributaria (SENIAT)', authorityWebsite: 'http://declaraciones.seniat.gob.ve',
    legalGazetteUrl: 'http://www.imprentanacional.gob.ve', statuteReference: 'Ley de Impuesto sobre la Renta (LISLR) & Ley del Impuesto al Valor Agregado',
    officialEvidenceNote: 'Gaceta Oficial Extraordinaria N° 6.507 Decreto Constituyente mediante el cual se dicta la Ley de Reforma Parcial del IVA.',
    tradeAgreements: ['ALBA-TCP'],
    servicesTaxInfo: {
      vatGstOnServices: 16.0, b2bRule: 'Place of Supply (Destination)', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 16.0,
      withholdingTaxOnServices: 34.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Cross-border services rendered or utilized in Venezuela attract 16% VAT and maximum 34% income tax withholding under LISLR.',
      servicesEvidenceUrl: 'http://declaraciones.seniat.gob.ve'
    }
  },
  {
    code: 'GT', name: 'Guatemala', region: 'Americas', currency: 'GTQ', currencySymbol: 'Q',
    corporateTaxRate: 25.0, vatGstRate: 12.0, withholdingDividends: 5.0, withholdingRoyalties: 15.0, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Superintendencia de Administración Tributaria (SAT Guatemala)', authorityWebsite: 'https://portal.sat.gob.gt',
    legalGazetteUrl: 'https://dca.gob.gt', statuteReference: 'Ley de Actualización Tributaria (Decreto 10-2012) & Ley del IVA (Decreto 27-92)',
    officialEvidenceNote: 'Diario de Centro América Decreto 10-2012 Libro I del Impuesto sobre la Renta.',
    tradeAgreements: ['CAFTA-DR', 'CACM'],
    servicesTaxInfo: {
      vatGstOnServices: 12.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 12.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Foreign payments for technical assistance or software royalties are subject to 15% non-resident income tax withholding and 12% IVA reverse charge.',
      servicesEvidenceUrl: 'https://portal.sat.gob.gt'
    }
  },
  {
    code: 'HN', name: 'Honduras', region: 'Americas', currency: 'HNL', currencySymbol: 'L',
    corporateTaxRate: 25.0, vatGstRate: 15.0, withholdingDividends: 10.0, withholdingRoyalties: 25.0, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Servicio de Administración de Rentas (SAR)', authorityWebsite: 'https://www.sar.gob.hn',
    legalGazetteUrl: 'https://lagaceta.hn', statuteReference: 'Código Tributario (Decreto 170-2016) & Ley de Impuesto sobre Ventas',
    officialEvidenceNote: 'La Gaceta Diario Oficial Decreto No. 170-2016 Nuevo Código Tributario de la República de Honduras.',
    tradeAgreements: ['CAFTA-DR', 'CACM'],
    servicesTaxInfo: {
      vatGstOnServices: 15.0, b2bRule: 'Place of Supply (Destination)', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 15.0,
      withholdingTaxOnServices: 25.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Sales tax (ISV) of 15% applies to taxable services; 25% withholding applies on technical, consulting, or royalty fees paid to non-residents.',
      servicesEvidenceUrl: 'https://www.sar.gob.hn'
    }
  },
  {
    code: 'SV', name: 'El Salvador', region: 'Americas', currency: 'USD', currencySymbol: '$',
    corporateTaxRate: 30.0, vatGstRate: 13.0, withholdingDividends: 5.0, withholdingRoyalties: 20.0, withholdingInterest: 20.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Ministerio de Hacienda de El Salvador - DGII', authorityWebsite: 'https://www.mh.gob.sv',
    legalGazetteUrl: 'https://www.imprentanacional.gob.sv', statuteReference: 'Código Tributario (Decreto 230) & Ley de Impuesto a la Transferencia de Bienes Muebles y a la Prestación de Servicios',
    officialEvidenceNote: 'Diario Oficial Tomo 432 Ley de Fomento a la Innovación y Manufactura Tecnológica providing software tax exemptions.',
    tradeAgreements: ['CAFTA-DR', 'CACM'],
    servicesTaxInfo: {
      vatGstOnServices: 13.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 13.0,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Services rendered abroad but utilized in El Salvador attract 13% IVA via reverse charge and 20% non-resident income tax withholding.',
      servicesEvidenceUrl: 'https://www.mh.gob.sv'
    }
  },
  {
    code: 'NI', name: 'Nicaragua', region: 'Americas', currency: 'NIO', currencySymbol: 'C$',
    corporateTaxRate: 30.0, vatGstRate: 15.0, withholdingDividends: 15.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Dirección General de Ingresos (DGI Nicaragua)', authorityWebsite: 'https://www.dgi.gob.ni',
    legalGazetteUrl: 'http://www.lagaceta.gob.ni', statuteReference: 'Ley 822 Ley de Concertación Tributaria (LCT)',
    officialEvidenceNote: 'La Gaceta Diario Oficial No. 241 Ley No. 822 Ley de Concertación Tributaria de Nicaragua.',
    tradeAgreements: ['CAFTA-DR', 'CACM'],
    servicesTaxInfo: {
      vatGstOnServices: 15.0, b2bRule: 'Place of Supply (Destination)', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 15.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Art 152 LCT: Final definitive withholding of 15% applies on services, technical assistance, and royalties paid to non-residents.',
      servicesEvidenceUrl: 'https://www.dgi.gob.ni'
    }
  },
  {
    code: 'JM', name: 'Jamaica', region: 'Americas', currency: 'JMD', currencySymbol: 'J$',
    corporateTaxRate: 25.0, vatGstRate: 15.0, withholdingDividends: 33.33, withholdingRoyalties: 33.33, withholdingInterest: 33.33,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Tax Administration Jamaica (TAJ)', authorityWebsite: 'https://www.jamaicatax.gov.jm',
    legalGazetteUrl: 'https://japarliament.gov.jm', statuteReference: 'General Consumption Tax Act 1991 (GCT) & Income Tax Act',
    officialEvidenceNote: 'The Jamaica Gazette Extraordinary Vol. CXLIII No. 24 GCT (Amendment) Regulations on e-commerce transactions.',
    tradeAgreements: ['CARICOM', 'CARIFORUM-EU EPA', 'UK-CARIFORUM EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 15.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 15.0,
      withholdingTaxOnServices: 33.33, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'J$ 10,000,000 GCT threshold',
      servicesStatuteNote: 'Imported services used in Jamaica are subject to GCT reverse charge mechanism. Payments to non-residents for technical services attract 33⅓% withholding tax unless reduced by DTA.',
      servicesEvidenceUrl: 'https://www.jamaicatax.gov.jm'
    }
  },
  {
    code: 'TT', name: 'Trinidad and Tobago', region: 'Americas', currency: 'TTD', currencySymbol: 'TT$',
    corporateTaxRate: 30.0, vatGstRate: 12.5, withholdingDividends: 10.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Inland Revenue Division (IRD Trinidad)', authorityWebsite: 'https://www.ird.gov.tt',
    legalGazetteUrl: 'https://news.gov.tt/content/trinidad-and-tobago-gazette', statuteReference: 'Value Added Tax Act Chap. 75:06 & Corporation Tax Act Chap. 75:02',
    officialEvidenceNote: 'Trinidad and Tobago Gazette (Extraordinary) Vol. 62 No. 182 Finance Act 2023.',
    tradeAgreements: ['CARICOM', 'CARIFORUM-EU EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 12.5, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 12.5,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'TT$ 500,000',
      servicesStatuteNote: 'Management charges and technical fees paid to non-residents are subject to 15% withholding tax. 12.5% VAT applies on commercial services.',
      servicesEvidenceUrl: 'https://www.ird.gov.tt'
    }
  },
  {
    code: 'BS', name: 'Bahamas', region: 'Americas', currency: 'BSD', currencySymbol: 'B$',
    corporateTaxRate: 0.0, vatGstRate: 10.0, withholdingDividends: 0.0, withholdingRoyalties: 0.0, withholdingInterest: 0.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Department of Inland Revenue (DIR Bahamas)', authorityWebsite: 'https://inlandrevenue.finance.gov.bs',
    legalGazetteUrl: 'https://laws.bahamas.gov.bs', statuteReference: 'Value Added Tax Act 2014 & Domestic Minimum Top-Up Tax Act 2024',
    officialEvidenceNote: 'Official Gazette Extraordinary Domestic Minimum Top-Up Tax Act 2024 enacting 15% corporate minimum tax for multinational entities.',
    tradeAgreements: ['CARICOM', 'CARIFORUM-EU EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 10.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 10.0,
      withholdingTaxOnServices: 0.0, treatyReliefAvailable: false, reverseChargeApplies: true, foreignRegistrationThreshold: 'B$ 100,000 annual turnover',
      servicesStatuteNote: 'Imported services are subject to 10% VAT reverse charge by Bahamian registrants. Non-resident suppliers of digital services to local consumers must register if meeting threshold.',
      servicesEvidenceUrl: 'https://inlandrevenue.finance.gov.bs'
    }
  },
  {
    code: 'BM', name: 'Bermuda', region: 'Americas', currency: 'BMD', currencySymbol: 'BD$',
    corporateTaxRate: 15.0, vatGstRate: 0.0, withholdingDividends: 0.0, withholdingRoyalties: 0.0, withholdingInterest: 0.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Office of the Tax Commissioner (Bermuda)', authorityWebsite: 'https://www.gov.bm/department/tax-commissioner',
    legalGazetteUrl: 'https://www.gov.bm/official-gazette', statuteReference: 'Corporate Income Tax Act 2023 (enacting 15% CIT effective Jan 1, 2025)',
    officialEvidenceNote: 'Bermuda Official Gazette Corporate Income Tax Act 2023 enacting 15% tax on Bermuda MNE groups with >€750M revenue.',
    tradeAgreements: ['UK Overseas Territory Trade Regimes'],
    servicesTaxInfo: {
      vatGstOnServices: 0.0, b2bRule: 'Exempt', b2cDigitalServicesTaxable: false, b2cDigitalServicesRate: 0.0,
      withholdingTaxOnServices: 0.0, treatyReliefAvailable: false, reverseChargeApplies: false, foreignRegistrationThreshold: 'None',
      servicesStatuteNote: 'No VAT or sales tax. 15% Corporate Income Tax enacted under Corporate Income Tax Act 2023 applies to in-scope multinational entities.',
      servicesEvidenceUrl: 'https://www.gov.bm/cit'
    }
  },
  {
    code: 'KY', name: 'Cayman Islands', region: 'Americas', currency: 'KYD', currencySymbol: 'CI$',
    corporateTaxRate: 0.0, vatGstRate: 0.0, withholdingDividends: 0.0, withholdingRoyalties: 0.0, withholdingInterest: 0.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Department for International Tax Cooperation (DITC)', authorityWebsite: 'https://www.ditc.ky',
    legalGazetteUrl: 'https://www.gov.ky/gazettes', statuteReference: 'Tax Information Authority Act (2021 Revision) & International Tax Co-operation (Economic Substance) Act',
    officialEvidenceNote: 'Cayman Islands Extraordinary Gazette No. 71 Economic Substance Guidance Notes for Relevant Entities.',
    tradeAgreements: ['UK Overseas Territory Arrangements'],
    servicesTaxInfo: {
      vatGstOnServices: 0.0, b2bRule: 'Exempt', b2cDigitalServicesTaxable: false, b2cDigitalServicesRate: 0.0,
      withholdingTaxOnServices: 0.0, treatyReliefAvailable: false, reverseChargeApplies: false, foreignRegistrationThreshold: 'None',
      servicesStatuteNote: 'Direct-tax free jurisdiction: zero corporate income tax, zero capital gains tax, zero VAT, zero withholding tax on services.',
      servicesEvidenceUrl: 'https://www.ditc.ky'
    }
  },
  {
    code: 'VG', name: 'British Virgin Islands', region: 'Americas', currency: 'USD', currencySymbol: '$',
    corporateTaxRate: 0.0, vatGstRate: 0.0, withholdingDividends: 0.0, withholdingRoyalties: 0.0, withholdingInterest: 0.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'BVI International Tax Authority (ITA)', authorityWebsite: 'https://ita.gov.vg',
    legalGazetteUrl: 'https://eservices.gov.vg/gazette/', statuteReference: 'BVI Economic Substance (Companies and Limited Partnerships) Act 2018',
    officialEvidenceNote: 'Virgin Islands Official Gazette Economic Substance Code implementing OECD BEPS Action 5 standards.',
    tradeAgreements: ['UK Overseas Territory Frameworks'],
    servicesTaxInfo: {
      vatGstOnServices: 0.0, b2bRule: 'Exempt', b2cDigitalServicesTaxable: false, b2cDigitalServicesRate: 0.0,
      withholdingTaxOnServices: 0.0, treatyReliefAvailable: false, reverseChargeApplies: false, foreignRegistrationThreshold: 'None',
      servicesStatuteNote: 'Zero direct corporate tax, zero VAT, and zero withholding tax on cross-border payments for services or intellectual property.',
      servicesEvidenceUrl: 'https://ita.gov.vg'
    }
  },
  {
    code: 'DO', name: 'Dominican Republic', region: 'Americas', currency: 'DOP', currencySymbol: 'RD$',
    corporateTaxRate: 27.0, vatGstRate: 18.0, withholdingDividends: 10.0, withholdingRoyalties: 27.0, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Dirección General de Impuestos Internos (DGII)', authorityWebsite: 'https://dgii.gov.do',
    legalGazetteUrl: 'https://www.consultoria.gov.do', statuteReference: 'Código Tributario de la República Dominicana (Ley 11-92 Art 305)',
    officialEvidenceNote: 'Gaceta Oficial Ley No. 11-92 Art 305 y Norma General sobre Retenciones de ITBIS a Pagos de Servicios al Exterior.',
    tradeAgreements: ['CAFTA-DR', 'EPA CARIFORUM-EU'],
    servicesTaxInfo: {
      vatGstOnServices: 18.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 18.0,
      withholdingTaxOnServices: 27.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Payment to non-resident entities for services used in the Dominican Republic is subject to 27% income tax withholding and 18% ITBIS.',
      servicesEvidenceUrl: 'https://dgii.gov.do'
    }
  },

  // --- EUROPE (EU & NON-EU) ---
  {
    code: 'AT', name: 'Austria', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 23.0, vatGstRate: 20.0, reducedVatRates: [13.0, 10.0], withholdingDividends: 27.5, withholdingRoyalties: 20.0, withholdingInterest: 0.0,
    digitalServicesTax: 5.0, cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Bundesministerium für Finanzen (BMF Österreich)', authorityWebsite: 'https://www.bmf.gv.at',
    legalGazetteUrl: 'https://www.ris.bka.gv.at', statuteReference: 'Umsatzsteuergesetz 1994 (UStG § 19) & Digitalsteuergesetz 2020 (DiStG)',
    officialEvidenceNote: 'Bundesgesetzblatt (BGBl. I Nr. 91/2019) Digitalsteuergesetz 2020 enacting 5% tax on online advertising revenues.',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA', 'EU-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 20.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 20.0,
      digitalServicesTaxRate: 5.0, digitalServicesTaxName: 'Digitalsteuer (DiStG 5%)',
      dstThresholdGlobal: '€750M worldwide revenue', dstThresholdLocal: '€25M Austrian digital advertising turnover',
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0 (OSS or Austrian VAT)',
      servicesStatuteNote: '§ 19 UStG mandates reverse charge on B2B cross-border services. 5% Digitalsteuer applies to online advertising revenue.',
      servicesEvidenceUrl: 'https://www.bmf.gv.at/themen/steuern/fuer-unternehmen/digitalsteuer.html'
    }
  },
  {
    code: 'BE', name: 'Belgium', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 25.0, smallBusinessTaxRate: 20.0, vatGstRate: 21.0, reducedVatRates: [12.0, 6.0, 0.0], withholdingDividends: 30.0, withholdingRoyalties: 30.0, withholdingInterest: 30.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Service Public Fédéral Finances (SPF Finances / FOD Financiën)', authorityWebsite: 'https://finances.belgium.be',
    legalGazetteUrl: 'https://www.ejustice.just.fgov.be', statuteReference: 'Code de la TVA (Art 51 § 2) & Loi transposant la directive (UE) 2022/2523 (Pillar Two)',
    officialEvidenceNote: 'Moniteur Belge / Belgisch Staatsblad Loi du 19 décembre 2023 concernant l’introduction d’un impôt minimum pour les groupes d’entreprises multinationales.',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA', 'EU-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 21.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 21.0,
      withholdingTaxOnServices: 30.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Article 51 § 2 Code TVA: reverse charge applies to all intra-Community and third-country B2B services. Non-EU B2C providers must register via OSS.',
      servicesEvidenceUrl: 'https://finances.belgium.be/fr/entreprises/tva'
    }
  },
  {
    code: 'DK', name: 'Denmark', region: 'Europe', currency: 'DKK', currencySymbol: 'kr.',
    corporateTaxRate: 22.0, vatGstRate: 25.0, withholdingDividends: 27.0, withholdingRoyalties: 22.0, withholdingInterest: 22.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Skattestyrelsen (Danish Tax Agency)', authorityWebsite: 'https://skat.dk',
    legalGazetteUrl: 'https://www.lovtidende.dk', statuteReference: 'Momsloven (Lov om merværdiafgift § 46) & Minimumsbeskatningsloven (Pillar Two)',
    officialEvidenceNote: 'Lovtidende A 2023 Lov nr. 1535 om minimumsbeskatning af multinationale koncerner.',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA', 'EU-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 25.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 25.0,
      withholdingTaxOnServices: 0.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Section 46 Momsloven: reverse charge (omvendt betalingspligt) applies on B2B services. 25% VAT applies on all electronic services to Danish consumers.',
      servicesEvidenceUrl: 'https://skat.dk/erhverv/moms'
    }
  },
  {
    code: 'FI', name: 'Finland', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 20.0, vatGstRate: 25.5, reducedVatRates: [14.0, 10.0, 0.0], withholdingDividends: 20.0, withholdingRoyalties: 20.0, withholdingInterest: 0.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Verohallinto (Finnish Tax Administration)', authorityWebsite: 'https://www.vero.fi',
    legalGazetteUrl: 'https://www.finlex.fi', statuteReference: 'Arvonlisäverolaki (AVL 1501/1993 § 9) & Laki konsernien vähimmäisverosta (Pillar Two)',
    officialEvidenceNote: 'Finlex Säädöskokoelma Laki arvonlisäverolain muuttamisesta 507/2024 raising general VAT rate to 25.5% effective Sept 1, 2024.',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA', 'EU-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 25.5, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 25.5,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Section 9 AVL: buyer self-assesses VAT under reverse charge mechanism. B2C digital services taxed at new 25.5% rate under EU One Stop Shop.',
      servicesEvidenceUrl: 'https://www.vero.fi/en/businesses-and-corporations/taxes-and-charges/vat/'
    }
  },
  {
    code: 'SE', name: 'Sweden', region: 'Europe', currency: 'SEK', currencySymbol: 'kr',
    corporateTaxRate: 20.6, vatGstRate: 25.0, reducedVatRates: [12.0, 6.0, 0.0], withholdingDividends: 30.0, withholdingRoyalties: 20.6, withholdingInterest: 0.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Skatteverket (Swedish Tax Agency)', authorityWebsite: 'https://www.skatteverket.se',
    legalGazetteUrl: 'https://svenskforfattningssamling.se', statuteReference: 'Mervärdesskattelag (2023:200) Kap. 16 (Omvänd skattskyldighet) & Lag (2023:875) om tilläggsskatt',
    officialEvidenceNote: 'Svensk författningssamling (SFS 2023:875) Lag om tilläggsskatt för företag i stora koncerner (Pillar Two).',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA', 'EU-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 25.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 25.0,
      withholdingTaxOnServices: 20.6, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Chapter 16 ML 2023:200 mandates reverse charge on cross-border business-to-business services. Consumer digital services covered under EU OSS.',
      servicesEvidenceUrl: 'https://www.skatteverket.se/foretag/moms/kopaochsäljautomlands.4.58d0dd9510d48e63bc380005727.html'
    }
  },
  {
    code: 'NO', name: 'Norway', region: 'Europe', currency: 'NOK', currencySymbol: 'kr',
    corporateTaxRate: 22.0, vatGstRate: 25.0, reducedVatRates: [15.0, 12.0, 0.0], withholdingDividends: 25.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Skatteetaten (Norwegian Tax Administration)', authorityWebsite: 'https://www.skatteetaten.no',
    legalGazetteUrl: 'https://lovdata.no', statuteReference: 'Merverdiavgiftsloven (LOV-2009-06-19-58 § 11-3 VOEC) & Suppleringsskatteloven (Pillar Two)',
    officialEvidenceNote: 'Norsk Lovtidend Lov om suppleringsskatt på underbeskattet overskudd i konsern (Pillar Two) LOV-2024-01-12-1.',
    tradeAgreements: ['EEA Agreement', 'EFTA', 'Norway-UK FTA'],
    servicesTaxInfo: {
      vatGstOnServices: 25.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 25.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'NOK 50,000 threshold under VOEC scheme',
      servicesStatuteNote: 'Foreign suppliers of remote digital services to Norwegian consumers must register under VOEC (VAT On E-Commerce) once exceeding NOK 50k turnover. B2B reverse charge under § 11-3.',
      servicesEvidenceUrl: 'https://www.skatteetaten.no/en/business-and-organisation/vat-and-duties/vat/register-deregister-change/foreign/voec/'
    }
  },
  {
    code: 'PL', name: 'Poland', region: 'Europe', currency: 'PLN', currencySymbol: 'zł',
    corporateTaxRate: 19.0, smallBusinessTaxRate: 9.0, vatGstRate: 23.0, reducedVatRates: [8.0, 5.0, 0.0], withholdingDividends: 19.0, withholdingRoyalties: 20.0, withholdingInterest: 20.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Krajowa Administracja Skarbowa (KAS) / Ministerstwo Finansów', authorityWebsite: 'https://www.gov.pl/web/kas',
    legalGazetteUrl: 'https://dziennikustaw.gov.pl', statuteReference: 'Ustawa o podatku od towarów i usług (Ustawa o VAT Art 17 ust. 1 pkt 4) & Ustawa o CIT',
    officialEvidenceNote: 'Dziennik Ustaw Rzeczypospolitej Polskiej Poz. 1572 Ustawa o opodatkowaniu wyrównawczym jednostek składowych grup międzynarodowych (Pillar Two).',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA', 'EU-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 23.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 23.0,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0 (OSS or direct NIP registration)',
      servicesStatuteNote: 'Art 17 ust. 1 pkt 4 VAT Act: Polish purchaser is the tax debtor under import of services reverse charge. 20% withholding tax on intangible services (management, advertising, software) under Art 21 CIT unless WHT relief applies.',
      servicesEvidenceUrl: 'https://www.podatki.gov.pl/vat/abc-vat/import-uslug/'
    }
  },
  {
    code: 'PT', name: 'Portugal', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 21.0, smallBusinessTaxRate: 17.0, vatGstRate: 23.0, reducedVatRates: [13.0, 6.0], withholdingDividends: 25.0, withholdingRoyalties: 25.0, withholdingInterest: 25.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Autoridade Tributária e Aduaneira (AT Portugal)', authorityWebsite: 'https://www.portaldasfinancas.gov.pt',
    legalGazetteUrl: 'https://diariodarepublica.pt', statuteReference: 'Código do IVA (Art 2.º n.º 1 alínea g) & Código do IRC',
    officialEvidenceNote: 'Diário da República 1.ª série Lei n.º 82/2023 implementing Directive (EU) 2022/2523 (Pillar Two).',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA', 'EU-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 23.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 23.0,
      withholdingTaxOnServices: 25.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Article 2(1)(g) CIVA establishes reverse charge (autoliquidação) for services acquired from non-residents. 25% IRC withholding applies to royalties and technical assistance.',
      servicesEvidenceUrl: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/civa_rep/Pages/civa-artigo-02.aspx'
    }
  },
  {
    code: 'GR', name: 'Greece', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 22.0, vatGstRate: 24.0, reducedVatRates: [13.0, 6.0], withholdingDividends: 5.0, withholdingRoyalties: 20.0, withholdingInterest: 15.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Independent Authority for Public Revenue (IAPR / AADE)', authorityWebsite: 'https://www.aade.gr',
    legalGazetteUrl: 'https://www.et.gr', statuteReference: 'Greek VAT Code (Law 2859/2000 Art 35) & Law 5100/2024 (Pillar Two)',
    officialEvidenceNote: 'Government Gazette (FEK A 49/05.04.2024) Law 5100/2024 enacting minimum taxation level for MNE groups.',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA', 'EU-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 24.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 24.0,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Law 2859/2000 Art 35 imposes reverse charge on Greek enterprises for imported cross-border services. MyDATA reporting required.',
      servicesEvidenceUrl: 'https://www.aade.gr/mydata'
    }
  },
  {
    code: 'CZ', name: 'Czech Republic', region: 'Europe', currency: 'CZK', currencySymbol: 'Kč',
    corporateTaxRate: 21.0, vatGstRate: 21.0, reducedVatRates: [12.0, 0.0], withholdingDividends: 15.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    digitalServicesTax: 5.0, cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Finanční správa České republiky', authorityWebsite: 'https://www.financnisprava.cz',
    legalGazetteUrl: 'https://www.zakonyprolidi.cz', statuteReference: 'Zákon o dani z přidané hodnoty (ZDPH č. 235/2004 Sb. § 108) & Zákon o dorovnávacích daních č. 416/2023 Sb. (Pillar Two)',
    officialEvidenceNote: 'Sbírka zákonů ČR částka 189/2023 Zákon č. 416/2023 Sb. o dorovnávacích daních pro velké nadnárodní skupiny.',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA', 'EU-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 21.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 21.0,
      digitalServicesTaxRate: 5.0, digitalServicesTaxName: 'Digitální daň (Proposed / Legislative framework)',
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: '§ 108 ZDPH: Czech recipient self-assesses 21% VAT under reverse charge. 15% (or 35% for non-treaty tax havens) withholding applies to royalties and management fees.',
      servicesEvidenceUrl: 'https://www.financnisprava.cz/cs/mezinarodni-spoluprace/mezinarodni-zdaneni-a-dph'
    }
  },
  {
    code: 'HU', name: 'Hungary', region: 'Europe', currency: 'HUF', currencySymbol: 'Ft',
    corporateTaxRate: 9.0, vatGstRate: 27.0, reducedVatRates: [18.0, 5.0], withholdingDividends: 0.0, withholdingRoyalties: 0.0, withholdingInterest: 0.0,
    digitalServicesTax: 7.5, cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Nemzeti Adó- és Vámhivatal (NAV)', authorityWebsite: 'https://nav.gov.hu',
    legalGazetteUrl: 'https://magyarkozlony.hu', statuteReference: 'Általános forgalmi adóról szóló 2007. évi CXXVII. törvény (Áfa tv. 140. §) & 2023. évi LXXXIV. törvény (Globális minimáladó)',
    officialEvidenceNote: 'Magyar Közlöny 2023. évi 171. szám 2023. évi LXXXIV. törvény a globális minimum-adószintről.',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA', 'EU-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 27.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 27.0,
      digitalServicesTaxRate: 7.5, digitalServicesTaxName: 'Reklámadó (Advertising Tax / Digital Ads)',
      withholdingTaxOnServices: 0.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'World highest standard VAT (27%). Under Section 140 Áfa tv, B2B services are taxed via reverse charge (fordított adózás). Advertising tax applies to digital ad publishers.',
      servicesEvidenceUrl: 'https://nav.gov.hu/ado/afa'
    }
  },
  {
    code: 'RO', name: 'Romania', region: 'Europe', currency: 'RON', currencySymbol: 'lei',
    corporateTaxRate: 16.0, smallBusinessTaxRate: 1.0, vatGstRate: 19.0, reducedVatRates: [9.0, 5.0], withholdingDividends: 8.0, withholdingRoyalties: 16.0, withholdingInterest: 16.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Agenția Națională de Administrare Fiscală (ANAF)', authorityWebsite: 'https://www.anaf.ro',
    legalGazetteUrl: 'https://www.monitoruloficial.ro', statuteReference: 'Codul Fiscal (Legea 227/2015 Art 307) & Legea 431/2023 privind impozitul minim global (Pillar Two)',
    officialEvidenceNote: 'Monitorul Oficial al României Partea I nr. 1199 Legea nr. 431/2023 privind asigurarea unui nivel minim global de impozitare a grupurilor de întreprinderi multinaționale.',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA', 'EU-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 19.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 19.0,
      withholdingTaxOnServices: 16.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Art 307 Codul Fiscal: beneficiary of cross-border services is liable for VAT via tax reverse charge (taxare inversă). 16% withholding applies on services unless DTA relief certificate is presented.',
      servicesEvidenceUrl: 'https://www.anaf.ro'
    }
  },
  {
    code: 'TR', name: 'Turkey', region: 'Europe', currency: 'TRY', currencySymbol: '₺',
    corporateTaxRate: 25.0, vatGstRate: 20.0, reducedVatRates: [10.0, 1.0], withholdingDividends: 10.0, withholdingRoyalties: 20.0, withholdingInterest: 10.0,
    digitalServicesTax: 7.5, cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Gelir İdaresi Başkanlığı (GİB)', authorityWebsite: 'https://www.gib.gov.tr',
    legalGazetteUrl: 'https://www.resmigazete.gov.tr', statuteReference: 'Katma Değer Vergisi Kanunu No. 3065 (KDV Genel Uygulama Tebliği I/C-2.1.2.1) & Kanun No. 7194 (Dijital Hizmet Vergisi)',
    officialEvidenceNote: 'T.C. Resmî Gazete Sayı: 30971 7194 sayılı Dijital Hizmet Vergisi ile Bazı Kanunlarda ve 375 Sayılı Kanun Hükmünde Kararnamede Değişiklik Yapılması Hakkında Kanun (7.5% DST).',
    tradeAgreements: ['EU-Turkey Customs Union', 'EFTA-Turkey FTA'],
    servicesTaxInfo: {
      vatGstOnServices: 20.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 20.0,
      digitalServicesTaxRate: 7.5, digitalServicesTaxName: 'Dijital Hizmet Vergisi (DHV 7.5%)',
      dstThresholdGlobal: '€750M worldwide revenue', dstThresholdLocal: 'TRY 20M revenue generated in Turkey',
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (Special VAT return No. 3 for Electronic Services)',
      servicesStatuteNote: 'VAT Communiqué on Electronic Services: Foreign providers of digital services to Turkish non-taxable persons must register for VAT under Special Return No. 3 and pay 20% KDV. 7.5% DHV applies to digital advertising, sales of digital content, and intermediary platforms.',
      servicesEvidenceUrl: 'https://digitalservice.gib.gov.tr'
    }
  },

  // --- ASIA-PACIFIC ---
  {
    code: 'MY', name: 'Malaysia', region: 'Asia-Pacific', currency: 'MYR', currencySymbol: 'RM',
    corporateTaxRate: 24.0, smallBusinessTaxRate: 15.0, vatGstRate: 8.0, withholdingDividends: 0.0, withholdingRoyalties: 10.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Lembaga Hasil Dalam Negeri (LHDN / Inland Revenue Board) & Royal Malaysian Customs Department (JKDM)', authorityWebsite: 'https://www.hasil.gov.my',
    legalGazetteUrl: 'https://lom.agc.gov.my', statuteReference: 'Service Tax Act 2018 (Section 56A Digital Services) & Income Tax Act 1967 (Section 109B)',
    officialEvidenceNote: 'Federal Government Gazette Service Tax (Amendment) Act 2024 increasing service tax to 8% and expanding scope of taxable digital services.',
    tradeAgreements: ['CPTPP', 'RCEP', 'ASEAN Trade in Goods Agreement (ATIGA)'],
    servicesTaxInfo: {
      vatGstOnServices: 8.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 8.0,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'MYR 500,000 threshold for Foreign Service Providers (FSPD)',
      servicesStatuteNote: 'Section 56A Service Tax Act: Foreign service providers (FSPD) exceeding RM 500k supplying digital services (software, streaming, digital ads) to Malaysian consumers must register and remit 8% service tax. Local businesses account for imported B2B services under reverse charge.',
      servicesEvidenceUrl: 'https://mystod.customs.gov.my'
    }
  },
  {
    code: 'ID', name: 'Indonesia', region: 'Asia-Pacific', currency: 'IDR', currencySymbol: 'Rp',
    corporateTaxRate: 22.0, vatGstRate: 11.0, withholdingDividends: 20.0, withholdingRoyalties: 20.0, withholdingInterest: 20.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Direktorat Jenderal Pajak (DJP / Directorate General of Taxes)', authorityWebsite: 'https://www.pajak.go.id',
    legalGazetteUrl: 'https://peraturan.go.id', statuteReference: 'Undang-Undang Harmonisasi Peraturan Perpajakan (UU HPP No. 7/2021) & PMK-60/PMK.03/2022 (PMSE / Digital VAT)',
    officialEvidenceNote: 'Lembaran Negara Republik Indonesia UU No. 7 Tahun 2021 tentang Harmonisasi Peraturan Perpajakan; PMK-60 appointing foreign PMSE collectors.',
    tradeAgreements: ['RCEP', 'ASEAN ATIGA', 'Indonesia-Australia CEPA', 'Indonesia-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 11.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 11.0,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'IDR 600M annual transaction value or 12,000 traffic hits',
      servicesStatuteNote: 'PMK-60/2022: Foreign e-commerce, cloud, software, and digital platform entities appointed by DJP must collect and remit 11% VAT on digital products and services supplied to Indonesian consumers. B2B payments incur 20% Article 26 WHT unless DTA relief applies.',
      servicesEvidenceUrl: 'https://www.pajak.go.id/id/pmse'
    }
  },
  {
    code: 'TH', name: 'Thailand', region: 'Asia-Pacific', currency: 'THB', currencySymbol: '฿',
    corporateTaxRate: 20.0, smallBusinessTaxRate: 15.0, vatGstRate: 7.0, withholdingDividends: 10.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'The Revenue Department of Thailand (กรมสรรพากร)', authorityWebsite: 'https://www.rd.go.th',
    legalGazetteUrl: 'https://www.ratchakitcha.soc.go.th', statuteReference: 'Revenue Code (Section 82/13 e-Service Law) & Emergency Decree on Pillar Two (2024)',
    officialEvidenceNote: 'Royal Thai Government Gazette Vol. 138 Part 10 A Revenue Code Amendment Act (No. 53) B.E. 2564 enacting VAT on Electronic Services (VES).',
    tradeAgreements: ['RCEP', 'ASEAN ATIGA', 'Thailand-Australia FTA', 'JTEPA (Japan)'],
    servicesTaxInfo: {
      vatGstOnServices: 7.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 7.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'THB 1,800,000 annual digital revenue threshold',
      servicesStatuteNote: 'VES (VAT on Electronic Service) Regime: Non-resident providers of electronic services (SaaS, games, streaming, digital brokerages) to non-VAT registered consumers in Thailand exceeding THB 1.8M/year must register on the VES portal and pay 7% VAT without input credit.',
      servicesEvidenceUrl: 'https://eservice.rd.go.th'
    }
  },
  {
    code: 'PH', name: 'Philippines', region: 'Asia-Pacific', currency: 'PHP', currencySymbol: '₱',
    corporateTaxRate: 25.0, smallBusinessTaxRate: 20.0, vatGstRate: 12.0, withholdingDividends: 25.0, withholdingRoyalties: 25.0, withholdingInterest: 20.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Bureau of Internal Revenue (BIR) & Bureau of Customs', authorityWebsite: 'https://www.bir.gov.ph',
    legalGazetteUrl: 'https://www.officialgazette.gov.ph', statuteReference: 'National Internal Revenue Code (NIRC / Republic Act 8424 as amended by CREATE Act & Digital Services VAT Act 2024 - RA 12023)',
    officialEvidenceNote: 'Official Gazette Republic Act No. 12023 Value-Added Tax on Digital Services Act signed October 2024 imposing 12% VAT on foreign digital service providers.',
    tradeAgreements: ['RCEP', 'ASEAN ATIGA', 'Philippines-Japan EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 12.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 12.0,
      withholdingTaxOnServices: 25.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'PHP 3,000,000 annual gross sales threshold under RA 12023',
      servicesStatuteNote: 'Republic Act No. 12023 (Digital Services VAT Act of 2024): Non-resident digital service providers (cloud, online ads, digital marketplace, software subscriptions) must register with BIR and remit 12% VAT on Philippine B2C sales. B2B transactions subject to 12% withholding VAT by registered buyers.',
      servicesEvidenceUrl: 'https://www.bir.gov.ph'
    }
  },
  {
    code: 'VN', name: 'Vietnam', region: 'Asia-Pacific', currency: 'VND', currencySymbol: '₫',
    corporateTaxRate: 20.0, vatGstRate: 10.0, reducedVatRates: [8.0, 5.0, 0.0], withholdingDividends: 0.0, withholdingRoyalties: 10.0, withholdingInterest: 5.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'General Department of Taxation (Tổng cục Thuế / GDT)', authorityWebsite: 'https://www.gdt.gov.vn',
    legalGazetteUrl: 'https://congbao.chinhphu.vn', statuteReference: 'Law on Tax Administration No. 38/2019/QH14 (Circular 80/2021/TT-BTC) & Resolution 107/2023/QH15 (Global Minimum Tax)',
    officialEvidenceNote: 'Công Báo National Assembly Resolution No. 107/2023/QH15 on application of additional corporate income tax according to OECD Pillar Two rules.',
    tradeAgreements: ['CPTPP', 'RCEP', 'EVFTA (EU)', 'UKVFTA (UK)', 'ASEAN ATIGA'],
    servicesTaxInfo: {
      vatGstOnServices: 5.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 5.0,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (Foreign Contractor Portal ETax)',
      servicesStatuteNote: 'Foreign Contractor Tax (FCT) applies to cross-border services: typically 5% VAT and 5% CIT (total 10%) on software, technical services, and e-commerce. Non-resident tech giants register via the dedicated GDT portal for overseas suppliers.',
      servicesEvidenceUrl: 'https://etaxvn.gdt.gov.vn'
    }
  },
  {
    code: 'TW', name: 'Taiwan', region: 'Asia-Pacific', currency: 'TWD', currencySymbol: 'NT$',
    corporateTaxRate: 20.0, vatGstRate: 5.0, withholdingDividends: 21.0, withholdingRoyalties: 20.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Ministry of Finance (MOF Taiwan / 財政部)', authorityWebsite: 'https://www.mof.gov.tw',
    legalGazetteUrl: 'https://gazette.nat.gov.tw', statuteReference: 'Value-Added and Non-Value-Added Business Tax Act (Art 6 & Art 28-1 Cross-Border Electronic Services)',
    officialEvidenceNote: 'The Executive Yuan Gazette Vol. 023 Issue 074 Cross-Border Electronic Services Business Tax Regulations.',
    tradeAgreements: ['US-Taiwan Initiative on 21st-Century Trade', 'ECFA'],
    servicesTaxInfo: {
      vatGstOnServices: 5.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 5.0,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'NT$ 480,000 annual sales threshold',
      servicesStatuteNote: 'Cross-Border Electronic Services VAT: Foreign entities selling e-services to domestic individuals exceeding NT$480,000 must register for tax in Taiwan, issue cloud invoices (e-GUI), and remit 5% business tax. Cross-border B2B is handled via reverse charge under Article 36.',
      servicesEvidenceUrl: 'https://www.etax.nat.gov.tw/etwmain/en/cross-border-electronic-services'
    }
  },
  {
    code: 'HK', name: 'Hong Kong', region: 'Asia-Pacific', currency: 'HKD', currencySymbol: 'HK$',
    corporateTaxRate: 16.5, smallBusinessTaxRate: 8.25, vatGstRate: 0.0, withholdingDividends: 0.0, withholdingRoyalties: 4.95, withholdingInterest: 0.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Mar 31',
    statutoryAuthority: 'Inland Revenue Department (IRD Hong Kong) & Customs and Excise Department', authorityWebsite: 'https://www.ird.gov.hk',
    legalGazetteUrl: 'https://www.gld.gov.hk/egazette', statuteReference: 'Inland Revenue Ordinance (Cap. 112) & Foreign-Sourced Income Exemption (FSIE) Regime',
    officialEvidenceNote: 'Hong Kong Government Gazette Legal Notice Inland Revenue (Amendment) (Taxation on Specified Foreign-sourced Income) Ordinance 2023.',
    tradeAgreements: ['CEPA (Mainland China)', 'Hong Kong-ASEAN FTA', 'Hong Kong-EFTA FTA'],
    servicesTaxInfo: {
      vatGstOnServices: 0.0, b2bRule: 'Exempt', b2cDigitalServicesTaxable: false, b2cDigitalServicesRate: 0.0,
      withholdingTaxOnServices: 4.95, treatyReliefAvailable: true, reverseChargeApplies: false, foreignRegistrationThreshold: 'None',
      servicesStatuteNote: 'Territorial taxation principle: no VAT, no GST, no sales tax. Profits tax only applies on profits arising in or derived from Hong Kong. Deemed royalties to non-residents attract 4.95% effective withholding (30% of 16.5%).',
      servicesEvidenceUrl: 'https://www.ird.gov.hk'
    }
  },

  // --- MIDDLE EAST ---
  {
    code: 'QA', name: 'Qatar', region: 'Middle East', currency: 'QAR', currencySymbol: 'QR',
    corporateTaxRate: 10.0, vatGstRate: 0.0, withholdingDividends: 0.0, withholdingRoyalties: 5.0, withholdingInterest: 5.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'General Tax Authority (GTA Qatar / الهيئة العامة للضرائب)', authorityWebsite: 'https://www.gta.gov.qa',
    legalGazetteUrl: 'https://almeezan.qa', statuteReference: 'Income Tax Law No. 24 of 2018 & Executive Regulations',
    officialEvidenceNote: 'Official Gazette Issue No. 19/2023 Law No. 11 of 2023 amending Income Tax Law for OECD Pillar Two compliance.',
    tradeAgreements: ['GCC Common Market', 'GAFTA'],
    servicesTaxInfo: {
      vatGstOnServices: 0.0, b2bRule: 'Place of Supply (Destination)', b2cDigitalServicesTaxable: false, b2cDigitalServicesRate: 0.0,
      withholdingTaxOnServices: 5.0, treatyReliefAvailable: true, reverseChargeApplies: false, foreignRegistrationThreshold: 'Immediate (Dhareeba Portal)',
      servicesStatuteNote: 'Article 9 Income Tax Law: 5% withholding tax applies on payments to non-residents for technical fees, consulting, and digital services performed or utilized in Qatar.',
      servicesEvidenceUrl: 'https://dhareeba.gov.qa'
    }
  },
  {
    code: 'IL', name: 'Israel', region: 'Middle East', currency: 'ILS', currencySymbol: '₪',
    corporateTaxRate: 23.0, vatGstRate: 17.0, withholdingDividends: 25.0, withholdingRoyalties: 25.0, withholdingInterest: 23.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Israel Tax Authority (ITA / רשות המסים בישראל)', authorityWebsite: 'https://www.gov.il/en/departments/israel_tax_authority',
    legalGazetteUrl: 'https://www.nevo.co.il', statuteReference: 'Value Added Tax Law 5736-1975 & Income Tax Ordinance (New Version) 1961',
    officialEvidenceNote: 'Reshumot (Official Gazette) Sefer HaChukim No. 3120 Digital VAT Memorandum on non-resident electronic service providers.',
    tradeAgreements: ['US-Israel FTA', 'EU-Israel Association Agreement', 'UK-Israel Trade Agreement'],
    servicesTaxInfo: {
      vatGstOnServices: 17.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 17.0,
      withholdingTaxOnServices: 23.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (Simplified Digital Services Portal)',
      servicesStatuteNote: 'Reverse charge mechanism applies to B2B services acquired by Israeli businesses. Non-resident providers of digital services, online software, and media to Israeli consumers are required to register and remit 17% VAT.',
      servicesEvidenceUrl: 'https://www.gov.il/en/departments/israel_tax_authority'
    }
  },

  // --- AFRICA ---
  {
    code: 'GH', name: 'Ghana', region: 'Africa', currency: 'GHS', currencySymbol: 'GH₵',
    corporateTaxRate: 25.0, vatGstRate: 15.0, withholdingDividends: 8.0, withholdingRoyalties: 15.0, withholdingInterest: 8.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Ghana Revenue Authority (GRA)', authorityWebsite: 'https://gra.gov.gh',
    legalGazetteUrl: 'https://lawsghana.com', statuteReference: 'Value Added Tax Act 2013 (Act 870 as amended by Act 1072) & E-Commerce / Digital Services Regulations',
    officialEvidenceNote: 'Ghana Gazette Value Added Tax (Amendment) Act 2022 (Act 1072) introducing taxation on non-resident electronic commerce.',
    tradeAgreements: ['AfCFTA', 'ECOWAS', 'Ghana-UK Trade Partnership Agreement'],
    servicesTaxInfo: {
      vatGstOnServices: 21.9, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 21.9,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (GRA E-Commerce Portal)',
      servicesStatuteNote: 'Digital services attract 15% standard VAT + 2.5% NHIL + 2.5% GETFund levy + 1% COVID-19 Health Recovery Levy (effective combined rate ~21.9%). Foreign providers register via GRA e-commerce portal.',
      servicesEvidenceUrl: 'https://gra.gov.gh/e-services/'
    }
  },
  {
    code: 'MU', name: 'Mauritius', region: 'Africa', currency: 'MUR', currencySymbol: 'Rs',
    corporateTaxRate: 15.0, smallBusinessTaxRate: 3.0, vatGstRate: 15.0, withholdingDividends: 0.0, withholdingRoyalties: 15.0, withholdingInterest: 0.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Jun 30',
    statutoryAuthority: 'Mauritius Revenue Authority (MRA)', authorityWebsite: 'https://www.mra.mu',
    legalGazetteUrl: 'https://pmo.govmu.org', statuteReference: 'Value Added Tax Act 1998 (Section 15A Digital Services) & Income Tax Act 1995',
    officialEvidenceNote: 'Government Gazette of Mauritius Finance (Miscellaneous Provisions) Act 2024 amending VAT Act for digital and remote services.',
    tradeAgreements: ['AfCFTA', 'COMESA', 'SADC', 'Mauritius-India CECPA', 'Mauritius-China FTA'],
    servicesTaxInfo: {
      vatGstOnServices: 15.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 15.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (MRA VAT Digital Services Platform)',
      servicesStatuteNote: 'Section 15A VAT Act: Foreign suppliers of digital services (SaaS, cloud, media) to Mauritian consumers are required to register through the MRA e-services portal and pay 15% VAT. B2B services reverse-charged.',
      servicesEvidenceUrl: 'https://www.mra.mu/index.php/eservices'
    }
  }
];

console.log('Script loaded successfully.');
