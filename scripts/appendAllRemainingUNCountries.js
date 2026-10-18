// scripts/appendAllRemainingUNCountries.js
import fs from 'fs';

// Read existing taxDatabase.ts
let content = fs.readFileSync('src/data/taxDatabase.ts', 'utf8');

const existingCodes = new Set();
const codeRegex = /code:\s*'([A-Z]{2})'/g;
let match;
while ((match = codeRegex.exec(content)) !== null) {
  existingCodes.add(match[1]);
}

const remainingCountries = [
  // --- EUROPE ---
  {
    code: 'EE', name: 'Estonia', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 20.0, vatGstRate: 22.0, withholdingDividends: 7.0, withholdingRoyalties: 10.0, withholdingInterest: 0.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Maksu- ja Tolliamet (Estonian Tax and Customs Board)', authorityWebsite: 'https://www.emta.ee',
    legalGazetteUrl: 'https://www.riigiteataja.ee', statuteReference: 'Käibemaksuseadus (KMS § 3) & Tulumaksuseadus (TuMS)',
    officialEvidenceNote: 'Riigi Teataja RT I 2023 Käibemaksuseaduse muutmise seadus raising standard VAT rate to 22%.',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA'],
    servicesTaxInfo: {
      vatGstOnServices: 22.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 22.0,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'KMS § 3 reverse charge applies to B2B services received by Estonian taxable persons. Non-EU B2C electronic services handled via OSS.',
      servicesEvidenceUrl: 'https://www.emta.ee/en/business-client/taxes-and-payment/value-added-tax'
    }
  },
  {
    code: 'LV', name: 'Latvia', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 20.0, vatGstRate: 21.0, withholdingDividends: 0.0, withholdingRoyalties: 0.0, withholdingInterest: 0.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Valsts ieņēmumu dienests (VID / State Revenue Service)', authorityWebsite: 'https://www.vid.gov.lv',
    legalGazetteUrl: 'https://www.vestnesis.lv', statuteReference: 'Pievienotās vērtības nodokļa likums (PVN likums 86. pants)',
    officialEvidenceNote: 'Latvijas Vēstnesis Nr. 248A Likums par minimālo nodokļu līmeni lielām uzņēmumu grupām (Pillar Two).',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA'],
    servicesTaxInfo: {
      vatGstOnServices: 21.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 21.0,
      withholdingTaxOnServices: 0.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Article 86 VAT Law: reverse charge applies to cross-border supplies of services between taxable persons.',
      servicesEvidenceUrl: 'https://www.vid.gov.lv'
    }
  },
  {
    code: 'LT', name: 'Lithuania', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 15.0, smallBusinessTaxRate: 5.0, vatGstRate: 21.0, withholdingDividends: 15.0, withholdingRoyalties: 10.0, withholdingInterest: 10.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Valstybinė mokesčių inspekcija (VMI)', authorityWebsite: 'https://www.vmi.lt',
    legalGazetteUrl: 'https://www.e-tar.lt', statuteReference: 'Pridėtinės vertės mokesčio įstatymas (PVMĮ 95 straipsnis)',
    officialEvidenceNote: 'Teisės aktų registras (TAR) Nr. 2023-25697 Įstatymas dėl visuotinio minimalaus apmokestinimo (Pillar Two).',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA'],
    servicesTaxInfo: {
      vatGstOnServices: 21.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 21.0,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Article 95 PVMĮ: Lithuanian buyer accounts for VAT under reverse charge. Withholding applies on software royalties unless treaty relief applies.',
      servicesEvidenceUrl: 'https://www.vmi.lt'
    }
  },
  {
    code: 'SK', name: 'Slovakia', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 21.0, smallBusinessTaxRate: 15.0, vatGstRate: 23.0, withholdingDividends: 10.0, withholdingRoyalties: 19.0, withholdingInterest: 19.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Finančná správa Slovenskej republiky', authorityWebsite: 'https://www.financnasprava.sk',
    legalGazetteUrl: 'https://www.slov-lex.sk', statuteReference: 'Zákon č. 222/2004 Z. z. o dani z pridanej hodnoty (§ 69)',
    officialEvidenceNote: 'Zbierka zákonov SR Zákon č. 507/2023 Z. z. o dorovnávacej dani (Pillar Two) a konsolidačný balíček 2024.',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA'],
    servicesTaxInfo: {
      vatGstOnServices: 23.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 23.0,
      withholdingTaxOnServices: 19.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: '§ 69 Zákon o DPH mandates reverse charge for taxable services received from abroad. Standard VAT increased to 23% under 2024 consolidation act.',
      servicesEvidenceUrl: 'https://www.financnasprava.sk'
    }
  },
  {
    code: 'SI', name: 'Slovenia', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 22.0, vatGstRate: 22.0, withholdingDividends: 15.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Finančna uprava Republike Slovenije (FURS)', authorityWebsite: 'https://www.fu.gov.si',
    legalGazetteUrl: 'https://www.uradni-list.si', statuteReference: 'Zakon o davku na dodano vrednost (ZDDV-1 76. člen)',
    officialEvidenceNote: 'Uradni list RS št. 131/23 Zakon o uveljavljanju globalnega minimalnega davka (Pillar Two).',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA'],
    servicesTaxInfo: {
      vatGstOnServices: 22.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 22.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Article 76 ZDDV-1 imposes reverse charge on Slovenian taxable persons receiving cross-border services.',
      servicesEvidenceUrl: 'https://www.fu.gov.si'
    }
  },
  {
    code: 'HR', name: 'Croatia', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 18.0, smallBusinessTaxRate: 10.0, vatGstRate: 25.0, withholdingDividends: 10.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Porezna uprava Republike Hrvatske', authorityWebsite: 'https://www.porezna-uprava.hr',
    legalGazetteUrl: 'https://narodne-novine.nn.hr', statuteReference: 'Zakon o porezu na dodanu vrijednost (Članak 75. stavak 2.)',
    officialEvidenceNote: 'Narodne novine br. 155/2023 Zakon o minimalnom globalnom porezu na dobit (Pillar Two).',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA'],
    servicesTaxInfo: {
      vatGstOnServices: 25.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 25.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Article 75(2) Croatian VAT Act: domestic entrepreneur pays VAT under reverse charge (prijenos porezne obveze).',
      servicesEvidenceUrl: 'https://www.porezna-uprava.hr'
    }
  },
  {
    code: 'BG', name: 'Bulgaria', region: 'Europe', currency: 'BGN', currencySymbol: 'лв',
    corporateTaxRate: 10.0, vatGstRate: 20.0, withholdingDividends: 5.0, withholdingRoyalties: 10.0, withholdingInterest: 10.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'National Revenue Agency (НАП / NRA Bulgaria)', authorityWebsite: 'https://nra.bg',
    legalGazetteUrl: 'https://dv.parliament.bg', statuteReference: 'Закон за данък върху добавената стойност (ЗДДС Чл. 82) & ЗКПО (Pillar Two)',
    officialEvidenceNote: 'Държавен вестник (ДВ) бр. 106 от 2023 г. Закон за корпоративното подоходно облагане (минимален данък Pillar Two).',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA'],
    servicesTaxInfo: {
      vatGstOnServices: 20.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 20.0,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Article 82 ZDDS: reverse charge applies to B2B services. 10% flat corporate income tax.',
      servicesEvidenceUrl: 'https://nra.bg'
    }
  },
  {
    code: 'CY', name: 'Cyprus', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 12.5, vatGstRate: 19.0, withholdingDividends: 0.0, withholdingRoyalties: 0.0, withholdingInterest: 0.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Department of Taxation (Τμήμα Φορολογίας)', authorityWebsite: 'https://www.mof.gov.cy/tax',
    legalGazetteUrl: 'http://www.mof.gov.cy/gpo', statuteReference: 'Cyprus Value Added Tax Law (Law 95(I)/2000 Section 11B)',
    officialEvidenceNote: 'Official Gazette of the Republic of Cyprus Law No. 40(I)/2024 enacting European Union Global Minimum Tax Directive.',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA'],
    servicesTaxInfo: {
      vatGstOnServices: 19.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 19.0,
      withholdingTaxOnServices: 0.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Section 11B VAT Law: reverse charge for B2B imported services. No withholding on services paid to non-resident entities.',
      servicesEvidenceUrl: 'https://www.mof.gov.cy/tax'
    }
  },
  {
    code: 'MT', name: 'Malta', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 35.0, vatGstRate: 18.0, withholdingDividends: 0.0, withholdingRoyalties: 0.0, withholdingInterest: 0.0,
    cbamApplicable: true, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Malta Tax and Customs Administration (MTCA)', authorityWebsite: 'https://cfr.gov.mt',
    legalGazetteUrl: 'https://legislation.mt', statuteReference: 'Value Added Tax Act (Cap. 406 Article 20) & Income Tax Act',
    officialEvidenceNote: 'Government Gazette of Malta Act No. IX of 2024 transposition of Council Directive (EU) 2022/2523.',
    tradeAgreements: ['EU Single Market', 'EU-UK TCA', 'CETA'],
    servicesTaxInfo: {
      vatGstOnServices: 18.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 18.0,
      withholdingTaxOnServices: 0.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Article 20 VAT Act applies reverse charge on cross-border services. Full imputation refund system for non-resident shareholders.',
      servicesEvidenceUrl: 'https://cfr.gov.mt'
    }
  },
  {
    code: 'IS', name: 'Iceland', region: 'Europe', currency: 'ISK', currencySymbol: 'kr',
    corporateTaxRate: 21.0, vatGstRate: 24.0, withholdingDividends: 20.0, withholdingRoyalties: 21.0, withholdingInterest: 12.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Skatturinn (Iceland Revenue and Customs)', authorityWebsite: 'https://www.skatturinn.is',
    legalGazetteUrl: 'https://stjornartidindi.is', statuteReference: 'Lög um virðisaukaskatt nr. 50/1988 (12. gr. a & Simplified VOEC Registration)',
    officialEvidenceNote: 'Stjórnartíðindi Lög nr. 138/2023 um lágmarksskattlagningu stórra samsteypna (Pillar Two).',
    tradeAgreements: ['EEA Agreement', 'EFTA', 'Iceland-China FTA'],
    servicesTaxInfo: {
      vatGstOnServices: 24.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 24.0,
      withholdingTaxOnServices: 21.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'ISK 2,000,000 threshold for digital B2C services',
      servicesStatuteNote: 'Art 12(a) VAT Act: Non-resident suppliers of digital and telecommunications services to Icelandic consumers must register and remit 24% VAT once exceeding ISK 2M.',
      servicesEvidenceUrl: 'https://www.skatturinn.is/atvinnurekstur/virdisaukaskattur/erlend-fyrirtaeki/'
    }
  },

  // --- ASIA-PACIFIC ---
  {
    code: 'PK', name: 'Pakistan', region: 'Asia-Pacific', currency: 'PKR', currencySymbol: 'Rs',
    corporateTaxRate: 29.0, vatGstRate: 18.0, withholdingDividends: 15.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Jun 30',
    statutoryAuthority: 'Federal Board of Revenue (FBR) & Provincial Revenue Authorities (SRB, PRA)', authorityWebsite: 'https://www.fbr.gov.pk',
    legalGazetteUrl: 'https://pakistancode.gov.pk', statuteReference: 'Income Tax Ordinance 2001 (Section 152 WHT) & Provincial Sales Tax on Services Acts',
    officialEvidenceNote: 'The Gazette of Pakistan Extraordinary Finance Act 2024 amending Section 152 for non-resident digital services withholding.',
    tradeAgreements: ['China-Pakistan FTA', 'SAFTA'],
    servicesTaxInfo: {
      vatGstOnServices: 15.0, b2bRule: 'Place of Supply (Destination)', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 15.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Sales tax on services is devolved to provincial revenue authorities (SRB 15%, PRA 16%, KPRA 15%). Section 152 ITO requires 15% withholding on payments to non-residents for technical and digital services.',
      servicesEvidenceUrl: 'https://www.fbr.gov.pk'
    }
  },
  {
    code: 'BD', name: 'Bangladesh', region: 'Asia-Pacific', currency: 'BDT', currencySymbol: '৳',
    corporateTaxRate: 27.5, vatGstRate: 15.0, withholdingDividends: 20.0, withholdingRoyalties: 20.0, withholdingInterest: 20.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Jun 30',
    statutoryAuthority: 'National Board of Revenue (NBR Bangladesh)', authorityWebsite: 'https://nbr.gov.bd',
    legalGazetteUrl: 'https://dpp.gov.bd/bgpress', statuteReference: 'Value Added Tax and Supplementary Duty Act 2012 (Section 15 Non-Resident VAT Agent) & Income Tax Act 2023',
    officialEvidenceNote: 'Bangladesh Gazette Extraordinary Income Tax Act 2023 replacing Income Tax Ordinance 1984.',
    tradeAgreements: ['SAFTA', 'APTA', 'D-8 Preferential Tariff Agreement'],
    servicesTaxInfo: {
      vatGstOnServices: 15.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 15.0,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (Foreign tech firms must appoint VAT agent in Bangladesh)',
      servicesStatuteNote: 'Foreign companies supplying digital services, software, or digital advertising must appoint a VAT agent in Bangladesh and remit 15% VAT. 20% withholding applies on technical fees under Section 119.',
      servicesEvidenceUrl: 'https://nbr.gov.bd'
    }
  },
  {
    code: 'LK', name: 'Sri Lanka', region: 'Asia-Pacific', currency: 'LKR', currencySymbol: 'Rs',
    corporateTaxRate: 30.0, vatGstRate: 18.0, withholdingDividends: 15.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Mar 31',
    statutoryAuthority: 'Inland Revenue Department (IRD Sri Lanka)', authorityWebsite: 'http://www.ird.gov.lk',
    legalGazetteUrl: 'http://documents.gov.lk', statuteReference: 'Inland Revenue Act No. 24 of 2017 & Value Added Tax (Amendment) Act No. 32 of 2023',
    officialEvidenceNote: 'The Gazette of the Democratic Socialist Republic of Sri Lanka Extraordinary No. 2363/22 VAT (Amendment) Act raising VAT to 18%.',
    tradeAgreements: ['ISFTA (India)', 'SAFTA', 'Sri Lanka-Singapore FTA'],
    servicesTaxInfo: {
      vatGstOnServices: 18.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 18.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'LKR 60,000,000 annual threshold',
      servicesStatuteNote: 'Standard VAT raised to 18%. Reverse charge applies to imported professional and management services; 15% Advance Income Tax (AIT) withholding applies on remittances to non-residents.',
      servicesEvidenceUrl: 'http://www.ird.gov.lk'
    }
  },

  // --- MIDDLE EAST ---
  {
    code: 'KW', name: 'Kuwait', region: 'Middle East', currency: 'KWD', currencySymbol: 'KD',
    corporateTaxRate: 15.0, vatGstRate: 0.0, withholdingDividends: 0.0, withholdingRoyalties: 0.0, withholdingInterest: 0.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Ministry of Finance - Tax Administration (MOF Kuwait)', authorityWebsite: 'https://www.mof.gov.kw',
    legalGazetteUrl: 'https://al-kuwait-alyowm.media.gov.kw', statuteReference: 'Amiri Decree No. 3 of 1955 (as amended by Law No. 2 of 2008) & Law 110/2023 (Global Minimum Tax)',
    officialEvidenceNote: 'Kuwait Al-Yawm Official Gazette Decree-Law approving Pillar Two 15% domestic minimum top-up tax framework.',
    tradeAgreements: ['GCC Common Market', 'GAFTA'],
    servicesTaxInfo: {
      vatGstOnServices: 0.0, b2bRule: 'Place of Supply (Destination)', b2cDigitalServicesTaxable: false, b2cDigitalServicesRate: 0.0,
      withholdingTaxOnServices: 5.0, treatyReliefAvailable: true, reverseChargeApplies: false, foreignRegistrationThreshold: 'Immediate (Tax clearance certificate retention required)',
      servicesStatuteNote: 'No general VAT. Kuwaiti entities must retain 5% of total contract value from payments to foreign service contractors until a Tax Clearance Certificate (TCC) is issued by the MOF.',
      servicesEvidenceUrl: 'https://www.mof.gov.kw'
    }
  },
  {
    code: 'BH', name: 'Bahrain', region: 'Middle East', currency: 'BHD', currencySymbol: 'BD',
    corporateTaxRate: 0.0, vatGstRate: 10.0, withholdingDividends: 0.0, withholdingRoyalties: 0.0, withholdingInterest: 0.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'National Bureau for Revenue (NBR Bahrain)', authorityWebsite: 'https://www.nbr.gov.bh',
    legalGazetteUrl: 'https://www.mia.gov.bh', statuteReference: 'Decree-Law No. (48) of 2018 on Value Added Tax & Decree-Law No. (11) of 2024 (Domestic Minimum Top-Up Tax 15%)',
    officialEvidenceNote: 'Official Gazette Issue No. 3740 Decree-Law No. (11) of 2024 imposing Domestic Minimum Top-Up Tax (DMTT) on MNEs effective Jan 1, 2025.',
    tradeAgreements: ['GCC Common Market', 'US-Bahrain FTA', 'GAFTA'],
    servicesTaxInfo: {
      vatGstOnServices: 10.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 10.0,
      withholdingTaxOnServices: 0.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (Nil threshold for non-resident taxable persons supplying Bahrain)',
      servicesStatuteNote: 'Article 66 VAT Executive Regulations: Reverse charge applies to imported services by taxable businesses. Non-residents supplying services to non-taxable persons in Bahrain must register for VAT with no threshold.',
      servicesEvidenceUrl: 'https://www.nbr.gov.bh'
    }
  },
  {
    code: 'OM', name: 'Oman', region: 'Middle East', currency: 'OMR', currencySymbol: 'OMR',
    corporateTaxRate: 15.0, vatGstRate: 5.0, withholdingDividends: 0.0, withholdingRoyalties: 10.0, withholdingInterest: 0.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Tax Authority of Oman (جهاز الضرائب)', authorityWebsite: 'https://tms.taxoman.gov.om',
    legalGazetteUrl: 'https://mjsg.gov.om', statuteReference: 'Royal Decree No. 121/2020 Promulgating Value Added Tax Law & Income Tax Law (Royal Decree 28/2009)',
    officialEvidenceNote: 'Official Gazette Issue No. 1362 Royal Decree No. 121/2020 Value Added Tax Law Art 22 on reverse charge.',
    tradeAgreements: ['GCC Common Market', 'US-Oman FTA', 'GAFTA'],
    servicesTaxInfo: {
      vatGstOnServices: 5.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 5.0,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Article 22 VAT Law: Reverse charge applies on services supplied by non-resident to taxable person in Oman. 10% withholding applies on royalties and technical/management services paid to non-residents.',
      servicesEvidenceUrl: 'https://tms.taxoman.gov.om'
    }
  },

  // --- AFRICA ---
  {
    code: 'DZ', name: 'Algeria', region: 'Africa', currency: 'DZD', currencySymbol: 'DA',
    corporateTaxRate: 26.0, smallBusinessTaxRate: 19.0, vatGstRate: 19.0, withholdingDividends: 15.0, withholdingRoyalties: 30.0, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Direction Générale des Impôts (DGI Algérie)', authorityWebsite: 'https://www.mfdgi.gov.dz',
    legalGazetteUrl: 'https://www.joradp.dz', statuteReference: 'Code des Impôts Directs (CID) & Code des Taxes sur le Chiffre d’Affaires (CTCA)',
    officialEvidenceNote: 'Journal Officiel de la République Algérienne Loi de finances pour 2024 No. 86.',
    tradeAgreements: ['AfCFTA', 'GAFTA', 'Algeria-EU Association Agreement'],
    servicesTaxInfo: {
      vatGstOnServices: 19.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 19.0,
      withholdingTaxOnServices: 30.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Withholding tax (Retenue à la source) of 30% applies to foreign service contracts (TVA 19% + IBS 30% or lump-sum withholding under Article 156 CID).',
      servicesEvidenceUrl: 'https://www.mfdgi.gov.dz'
    }
  },
  {
    code: 'TN', name: 'Tunisia', region: 'Africa', currency: 'TND', currencySymbol: 'DT',
    corporateTaxRate: 15.0, vatGstRate: 19.0, withholdingDividends: 10.0, withholdingRoyalties: 15.0, withholdingInterest: 20.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Direction Générale des Impôts (DGI Tunisie)', authorityWebsite: 'http://www.impots.finances.gov.tn',
    legalGazetteUrl: 'http://www.iort.gov.tn', statuteReference: 'Code de l’IRPP et de l’IS & Code de la TVA (Article 5)',
    officialEvidenceNote: 'Journal Officiel de la République Tunisienne (JORT) Loi de finances pour l’année 2024.',
    tradeAgreements: ['AfCFTA', 'COMESA', 'GAFTA', 'Tunisia-EU Association Agreement'],
    servicesTaxInfo: {
      vatGstOnServices: 19.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 19.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Cross-border remittances for technical assistance and management fees incur 15% non-resident withholding and 19% TVA withheld by the Tunisian customer.',
      servicesEvidenceUrl: 'http://www.impots.finances.gov.tn'
    }
  },
  {
    code: 'CI', name: "Côte d'Ivoire", region: 'Africa', currency: 'XOF', currencySymbol: 'CFA',
    corporateTaxRate: 25.0, vatGstRate: 18.0, withholdingDividends: 15.0, withholdingRoyalties: 20.0, withholdingInterest: 18.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Direction Générale des Impôts (DGI Côte d’Ivoire)', authorityWebsite: 'https://www.dgi.gouv.ci',
    legalGazetteUrl: 'https://www.sgg.gouv.ci', statuteReference: 'Code Général des Impôts (CGI) & Annexe fiscale à la loi de finances',
    officialEvidenceNote: 'Journal Officiel de la République de Côte d’Ivoire Annexe Fiscale à la Loi de Finances 2022 taxation des plateformes numériques.',
    tradeAgreements: ['AfCFTA', 'UEMOA', 'ECOWAS', 'Côte d’Ivoire-EU Stepping Stone EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 18.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 18.0,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (Foreign digital service providers platform registration)',
      servicesStatuteNote: 'Digital economy provisions in CGI impose 18% VAT and 20% non-resident withholding tax on remunerations for services, technical studies, and digital advertising provided from abroad.',
      servicesEvidenceUrl: 'https://www.dgi.gouv.ci'
    }
  },
  {
    code: 'SN', name: 'Senegal', region: 'Africa', currency: 'XOF', currencySymbol: 'CFA',
    corporateTaxRate: 30.0, vatGstRate: 18.0, withholdingDividends: 10.0, withholdingRoyalties: 20.0, withholdingInterest: 16.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Direction Générale des Impôts et des Domaines (DGID Sénégal)', authorityWebsite: 'https://www.impots-et-domaines.sn',
    legalGazetteUrl: 'http://www.jo.gouv.sn', statuteReference: 'Code Général des Impôts (CGI Art 354 et seq.) & Décret d’application sur la TVA des services numériques',
    officialEvidenceNote: 'Journal Officiel de la République du Sénégal Décret n° 2024-954 fixant les modalités de perception de la TVA sur les services numériques fournis par des non-résidents.',
    tradeAgreements: ['AfCFTA', 'UEMOA', 'ECOWAS'],
    servicesTaxInfo: {
      vatGstOnServices: 18.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 18.0,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (Effective 2024 digital VAT simplified registration)',
      servicesStatuteNote: 'Decree No. 2024-954: Foreign operators supplying electronic services (SaaS, digital content, online intermediation) to Senegalese residents must register and collect 18% VAT. B2B payments incur 20% BNC withholding.',
      servicesEvidenceUrl: 'https://www.impots-et-domaines.sn'
    }
  },
  {
    code: 'RW', name: 'Rwanda', region: 'Africa', currency: 'RWF', currencySymbol: 'FRw',
    corporateTaxRate: 28.0, vatGstRate: 18.0, withholdingDividends: 15.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Rwanda Revenue Authority (RRA)', authorityWebsite: 'https://www.rra.gov.rw',
    legalGazetteUrl: 'https://www.minijust.gov.rw', statuteReference: 'Law Nº 027/2022 Establishing Taxes on Income & Ministerial Order Nº 002/23/TC on VAT on Digital Services',
    officialEvidenceNote: 'Official Gazette of the Republic of Rwanda Nº Special of 14/09/2023 Ministerial Order determining rules for VAT collection on digital services provided by non-residents.',
    tradeAgreements: ['AfCFTA', 'EAC Common Market', 'COMESA'],
    servicesTaxInfo: {
      vatGstOnServices: 18.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 18.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (RRA Online Digital Portal)',
      servicesStatuteNote: 'Ministerial Order Nº 002/23/TC: Non-resident suppliers of software licenses, web hosting, streaming, and online training to Rwandan customers must register with RRA and remit 18% VAT quarterly.',
      servicesEvidenceUrl: 'https://www.rra.gov.rw/en/taxes/value-added-tax'
    }
  },
  {
    code: 'UG', name: 'Uganda', region: 'Africa', currency: 'UGX', currencySymbol: 'USh',
    corporateTaxRate: 30.0, vatGstRate: 18.0, withholdingDividends: 15.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    digitalServicesTax: 5.0, cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Jun 30',
    statutoryAuthority: 'Uganda Revenue Authority (URA)', authorityWebsite: 'https://ura.go.ug',
    legalGazetteUrl: 'https://upbc.go.ug', statuteReference: 'Income Tax (Amendment) Act 2023 (Section 86A Digital Services Tax 5%) & Value Added Tax Act Cap 349 (Section 16)',
    officialEvidenceNote: 'The Uganda Gazette No. 45 Vol. CXVI Income Tax (Amendment) Act 2023 introducing 5% Digital Services Tax on non-residents.',
    tradeAgreements: ['AfCFTA', 'EAC Common Market', 'COMESA'],
    servicesTaxInfo: {
      vatGstOnServices: 18.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 18.0,
      digitalServicesTaxRate: 5.0, digitalServicesTaxName: 'Uganda Digital Services Tax (Section 86A)',
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Section 86A Income Tax Act imposes 5% tax on gross revenue derived by non-residents from providing digital services (e-books, SaaS, cloud, digital ads) in Uganda. Standard VAT of 18% applies on electronic services.',
      servicesEvidenceUrl: 'https://ura.go.ug'
    }
  },
  {
    code: 'TZ', name: 'Tanzania', region: 'Africa', currency: 'TZS', currencySymbol: 'TSh',
    corporateTaxRate: 30.0, vatGstRate: 18.0, withholdingDividends: 10.0, withholdingRoyalties: 15.0, withholdingInterest: 10.0,
    digitalServicesTax: 2.0, cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Tanzania Revenue Authority (TRA)', authorityWebsite: 'https://www.tra.go.tz',
    legalGazetteUrl: 'https://www.egov.go.tz', statuteReference: 'Finance Act 2022 (Section 90A Digital Services Tax) & Value Added Tax (Electronic Services) Regulations 2022',
    officialEvidenceNote: 'Gazette of the United Republic of Tanzania GN No. 478 Value Added Tax (Registration of Non-Resident Electronic Service Providers) Regulations 2022.',
    tradeAgreements: ['AfCFTA', 'EAC Common Market', 'SADC'],
    servicesTaxInfo: {
      vatGstOnServices: 18.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 18.0,
      digitalServicesTaxRate: 2.0, digitalServicesTaxName: 'Digital Services Tax (TRA DST 2%)',
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (TRA non-resident portal)',
      servicesStatuteNote: 'Section 90A Income Tax Act: 2% DST on payments received by non-resident digital service providers. Non-resident suppliers of digital services must register online for 18% VAT without physical presence.',
      servicesEvidenceUrl: 'https://www.tra.go.tz/index.php/tax-on-digital-services'
    }
  }
];

const toAdd = remainingCountries.filter(c => !existingCodes.has(c.code));
console.log('New countries to append:', toAdd.length);

if (toAdd.length > 0) {
  const formattedEntries = toAdd.map(c => {
    return `  {
    code: '${c.code}',
    name: '${c.name}',
    region: '${c.region}',
    currency: '${c.currency}',
    currencySymbol: '${c.currencySymbol}',
    corporateTaxRate: ${c.corporateTaxRate.toFixed(1)},
    ${c.smallBusinessTaxRate ? `smallBusinessTaxRate: ${c.smallBusinessTaxRate.toFixed(1)},` : ''}
    vatGstRate: ${c.vatGstRate.toFixed(1)},
    withholdingDividends: ${c.withholdingDividends.toFixed(1)},
    withholdingRoyalties: ${c.withholdingRoyalties.toFixed(1)},
    withholdingInterest: ${c.withholdingInterest.toFixed(1)},
    ${c.digitalServicesTax ? `digitalServicesTax: ${c.digitalServicesTax.toFixed(1)},` : ''}
    cbamApplicable: ${c.cbamApplicable},
    hasPillarTwo: ${c.hasPillarTwo},
    taxYearEnd: '${c.taxYearEnd}',
    statutoryAuthority: '${c.statutoryAuthority.replace(/'/g, "\\'")}',
    authorityWebsite: '${c.authorityWebsite}',
    legalGazetteUrl: '${c.legalGazetteUrl}',
    statuteReference: '${c.statuteReference.replace(/'/g, "\\'")}',
    officialEvidenceNote: '${c.officialEvidenceNote.replace(/'/g, "\\'")}',
    tradeAgreements: ${JSON.stringify(c.tradeAgreements)},
    servicesTaxInfo: {
      vatGstOnServices: ${c.servicesTaxInfo.vatGstOnServices.toFixed(1)},
      b2bRule: '${c.servicesTaxInfo.b2bRule}',
      b2cDigitalServicesTaxable: ${c.servicesTaxInfo.b2cDigitalServicesTaxable},
      b2cDigitalServicesRate: ${c.servicesTaxInfo.b2cDigitalServicesRate.toFixed(1)},
      ${c.servicesTaxInfo.digitalServicesTaxRate ? `digitalServicesTaxRate: ${c.servicesTaxInfo.digitalServicesTaxRate.toFixed(1)},` : ''}
      ${c.servicesTaxInfo.digitalServicesTaxName ? `digitalServicesTaxName: '${c.servicesTaxInfo.digitalServicesTaxName.replace(/'/g, "\\'")}',` : ''}
      ${c.servicesTaxInfo.dstThresholdGlobal ? `dstThresholdGlobal: '${c.servicesTaxInfo.dstThresholdGlobal}',` : ''}
      ${c.servicesTaxInfo.dstThresholdLocal ? `dstThresholdLocal: '${c.servicesTaxInfo.dstThresholdLocal}',` : ''}
      withholdingTaxOnServices: ${c.servicesTaxInfo.withholdingTaxOnServices.toFixed(1)},
      treatyReliefAvailable: ${c.servicesTaxInfo.treatyReliefAvailable},
      reverseChargeApplies: ${c.servicesTaxInfo.reverseChargeApplies},
      foreignRegistrationThreshold: '${c.servicesTaxInfo.foreignRegistrationThreshold.replace(/'/g, "\\'")}',
      servicesStatuteNote: '${c.servicesTaxInfo.servicesStatuteNote.replace(/'/g, "\\'")}',
      servicesEvidenceUrl: '${c.servicesTaxInfo.servicesEvidenceUrl}'
    }
  }`;
  }).join(',\n');

  const closingBracketIdx = content.lastIndexOf('];');
  const updated = content.slice(0, closingBracketIdx).trimEnd() + ',\n' + formattedEntries + '\n];\n';
  fs.writeFileSync('src/data/taxDatabase.ts', updated, 'utf8');
  console.log('Successfully appended all remaining countries!');
}
