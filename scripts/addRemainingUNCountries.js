// scripts/addRemainingUNCountries.js
import fs from 'fs';

let content = fs.readFileSync('src/data/taxDatabase.ts', 'utf8');

const existingCodes = new Set();
const codeRegex = /code:\s*'([A-Z]{2})'/g;
let match;
while ((match = codeRegex.exec(content)) !== null) {
  existingCodes.add(match[1]);
}

const restOfWorld = [
  // --- EUROPEAN JURISDICTIONS ---
  {
    code: 'AL', name: 'Albania', region: 'Europe', currency: 'ALL', currencySymbol: 'L',
    corporateTaxRate: 15.0, vatGstRate: 20.0, withholdingDividends: 8.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'General Directorate of Taxes (Drejtoria e Përgjithshme e Tatimeve)', authorityWebsite: 'https://www.tatime.gov.al',
    legalGazetteUrl: 'https://qbz.gov.al', statuteReference: 'Law No. 92/2014 on Value Added Tax & Law No. 8438 on Income Tax',
    officialEvidenceNote: 'Fletorja Zyrtare e Republikës së Shqipërisë Ligji Nr. 29/2023 për Tatimin mbi të Ardhurat.',
    tradeAgreements: ['CEFTA', 'EU-Albania SAA'],
    servicesTaxInfo: {
      vatGstOnServices: 20.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 20.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Law 92/2014 Art 24: Reverse charge applies to services supplied by non-resident to Albanian taxable person. 15% withholding on technical services.',
      servicesEvidenceUrl: 'https://www.tatime.gov.al'
    }
  },
  {
    code: 'AD', name: 'Andorra', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 10.0, vatGstRate: 4.5, withholdingDividends: 0.0, withholdingRoyalties: 5.0, withholdingInterest: 0.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Departament de Tributs i de Fronteres d’Andorra', authorityWebsite: 'https://www.tributs.ad',
    legalGazetteUrl: 'https://www.bopa.ad', statuteReference: 'Llei 95/2010 de l’impost sobre societats & Llei 11/2012 de l’impost general indirecte (IGI)',
    officialEvidenceNote: 'Butlletí Oficial del Principat d’Andorra (BOPA) Llei de l’impost general indirecte (IGI 4.5%).',
    tradeAgreements: ['EU-Andorra Customs Union'],
    servicesTaxInfo: {
      vatGstOnServices: 4.5, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 4.5,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'General indirect tax (IGI) rate is 4.5%. Non-resident income tax (IRNR) applies 10% withholding on service fees without DTA relief.',
      servicesEvidenceUrl: 'https://www.tributs.ad'
    }
  },
  {
    code: 'BA', name: 'Bosnia and Herzegovina', region: 'Europe', currency: 'BAM', currencySymbol: 'KM',
    corporateTaxRate: 10.0, vatGstRate: 17.0, withholdingDividends: 5.0, withholdingRoyalties: 10.0, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Indirect Taxation Authority of Bosnia and Herzegovina (UINO / UIO)', authorityWebsite: 'https://www.uino.gov.ba',
    legalGazetteUrl: 'http://www.sluzbenilist.ba', statuteReference: 'Law on Value Added Tax of BiH (Official Gazette of BiH, No. 9/05) & Entity Corporate Income Tax Acts',
    officialEvidenceNote: 'Službeni glasnik BiH Zakon o porezu na dodanu vrijednost Art 15 on place of supply of services.',
    tradeAgreements: ['CEFTA', 'EU-BiH SAA'],
    servicesTaxInfo: {
      vatGstOnServices: 17.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 17.0,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Single uniform VAT rate of 17% administered by UINO. Reverse charge applies on received cross-border services; 10% withholding tax applies on foreign service contracts.',
      servicesEvidenceUrl: 'https://www.uino.gov.ba'
    }
  },
  {
    code: 'ME', name: 'Montenegro', region: 'Europe', currency: 'EUR', currencySymbol: '€',
    corporateTaxRate: 15.0, vatGstRate: 21.0, withholdingDividends: 15.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Uprava prihoda i carina Crne Gore (Revenue and Customs Administration)', authorityWebsite: 'https://www.gov.me/upc',
    legalGazetteUrl: 'http://www.sluzbenilist.me', statuteReference: 'Law on Value Added Tax (Zakon o porezu na dodatu vrijednost) & Law on Corporate Income Tax',
    officialEvidenceNote: 'Službeni list Crne Gore Zakon o izmjenama i dopunama Zakona o porezu na dobit pravnih lica.',
    tradeAgreements: ['CEFTA', 'EU-Montenegro SAA'],
    servicesTaxInfo: {
      vatGstOnServices: 21.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 21.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: '€0',
      servicesStatuteNote: 'Montenegrin recipient accounts for 21% VAT under reverse charge. 15% withholding tax applies on consulting, legal, market research, and audit fees paid to non-residents.',
      servicesEvidenceUrl: 'https://www.gov.me/upc'
    }
  },
  {
    code: 'MK', name: 'North Macedonia', region: 'Europe', currency: 'MKD', currencySymbol: 'ден',
    corporateTaxRate: 10.0, vatGstRate: 18.0, withholdingDividends: 10.0, withholdingRoyalties: 10.0, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Public Revenue Office of the Republic of North Macedonia (UJP / УЈП)', authorityWebsite: 'https://ujp.gov.mk',
    legalGazetteUrl: 'https://slvesnik.com.mk', statuteReference: 'Law on Value Added Tax & Law on Profit Tax',
    officialEvidenceNote: 'Службен весник на Република Северна Македонија Закон за данокот на додадена вредност.',
    tradeAgreements: ['CEFTA', 'EU-North Macedonia SAA'],
    servicesTaxInfo: {
      vatGstOnServices: 18.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 18.0,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Reverse charge applies on imported services. 10% withholding applies on technical, telecommunications, and management services paid abroad.',
      servicesEvidenceUrl: 'https://ujp.gov.mk'
    }
  },
  {
    code: 'RS', name: 'Serbia', region: 'Europe', currency: 'RSD', currencySymbol: 'din',
    corporateTaxRate: 15.0, vatGstRate: 20.0, withholdingDividends: 20.0, withholdingRoyalties: 20.0, withholdingInterest: 20.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Poreska uprava Republike Srbije (Tax Administration of Serbia)', authorityWebsite: 'https://www.purs.gov.rs',
    legalGazetteUrl: 'http://www.pravno-informacioni-sistem.rs', statuteReference: 'Zakon o porezu na dodatu vrednost (Zakon o PDV Čl. 12) & Zakon o porezu na dobit pravnih lica (Čl. 40)',
    officialEvidenceNote: 'Službeni glasnik RS br. 138/2022 Zakon o porezu na dobit pravnih lica.',
    tradeAgreements: ['CEFTA', 'Serbia-Eurasian Economic Union FTA', 'Serbia-China FTA'],
    servicesTaxInfo: {
      vatGstOnServices: 20.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 20.0,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (Foreign provider of e-services must appoint tax representative)',
      servicesStatuteNote: 'Foreign providers of electronic services to Serbian non-taxable persons must register via a local tax representative and pay 20% VAT. 20% withholding applies on market research, consulting, and software.',
      servicesEvidenceUrl: 'https://www.purs.gov.rs'
    }
  },
  {
    code: 'UA', name: 'Ukraine', region: 'Europe', currency: 'UAH', currencySymbol: '₴',
    corporateTaxRate: 18.0, vatGstRate: 20.0, withholdingDividends: 15.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'State Tax Service of Ukraine (Державна податкова служба України)', authorityWebsite: 'https://tax.gov.ua',
    legalGazetteUrl: 'https://zakon.rada.gov.ua', statuteReference: 'Tax Code of Ukraine (Податковий кодекс України Art 180 & 208-1 Google Tax)',
    officialEvidenceNote: 'Офіційний вісник України Закон України № 1525-IX про оподаткування нерезидентів, які постачають електронні послуги.',
    tradeAgreements: ['DCFTA (EU-Ukraine)', 'Ukraine-Canada CUFTA', 'Ukraine-UK TCA'],
    servicesTaxInfo: {
      vatGstOnServices: 20.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 20.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'UAH 1,000,000 threshold under Article 208-1 (Google Tax)',
      servicesStatuteNote: 'Law 1525-IX (Google Tax): Non-resident digital companies supplying B2C e-services (cloud, advertising, streaming, software) exceeding UAH 1M must register electronically and remit 20% VAT.',
      servicesEvidenceUrl: 'https://tax.gov.ua/en/'
    }
  },
  {
    code: 'MD', name: 'Moldova', region: 'Europe', currency: 'MDL', currencySymbol: 'L',
    corporateTaxRate: 12.0, vatGstRate: 20.0, withholdingDividends: 6.0, withholdingRoyalties: 12.0, withholdingInterest: 12.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Serviciul Fiscal de Stat (State Tax Service of Moldova)', authorityWebsite: 'https://sfs.md',
    legalGazetteUrl: 'https://www.legis.md', statuteReference: 'Tax Code of the Republic of Moldova (Codul Fiscal Art 93 & Art 111)',
    officialEvidenceNote: 'Monitorul Oficial al Republicii Moldova Legea pentru modificarea Codului fiscal privind serviciile electronice prestate de nerezidenți.',
    tradeAgreements: ['CEFTA', 'EU-Moldova DCFTA'],
    servicesTaxInfo: {
      vatGstOnServices: 20.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 20.0,
      withholdingTaxOnServices: 12.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (e-Commerce VAT Service portal)',
      servicesStatuteNote: 'Non-resident companies supplying electronic services to individuals in Moldova must register in the e-Commerce VAT Service portal and pay 20% VAT.',
      servicesEvidenceUrl: 'https://sfs.md/ro/pagina/e-commerce-vat'
    }
  },
  {
    code: 'GE', name: 'Georgia', region: 'Europe', currency: 'GEL', currencySymbol: '₾',
    corporateTaxRate: 15.0, vatGstRate: 18.0, withholdingDividends: 5.0, withholdingRoyalties: 10.0, withholdingInterest: 5.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Revenue Service of the Ministry of Finance of Georgia (RS.ge)', authorityWebsite: 'https://rs.ge',
    legalGazetteUrl: 'https://matsne.gov.ge', statuteReference: 'Tax Code of Georgia (Art 162 & Digital Services VAT)',
    officialEvidenceNote: 'Legislative Herald of Georgia (Matsne) Order No. 999 on VAT registration of foreign digital service providers.',
    tradeAgreements: ['DCFTA (EU-Georgia)', 'Georgia-China FTA', 'Georgia-Turkey FTA'],
    servicesTaxInfo: {
      vatGstOnServices: 18.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 18.0,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (Foreign supplier portal RS.ge)',
      servicesStatuteNote: 'Estonian corporate tax model (CIT 0% until profit distribution). Foreign suppliers of digital services to Georgian consumers must register on the RS.ge digital portal and pay 18% VAT.',
      servicesEvidenceUrl: 'https://rs.ge'
    }
  },
  {
    code: 'AM', name: 'Armenia', region: 'Europe', currency: 'AMD', currencySymbol: '֏',
    corporateTaxRate: 18.0, vatGstRate: 20.0, withholdingDividends: 5.0, withholdingRoyalties: 10.0, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'State Revenue Committee of Armenia (SRC)', authorityWebsite: 'https://www.petekamutner.am',
    legalGazetteUrl: 'https://www.arlis.am', statuteReference: 'Tax Code of the Republic of Armenia (Chapter 11 VAT on Electronic Services)',
    officialEvidenceNote: 'Armenian Legal Information System (ARLIS) Tax Code Amendments on VAT for e-services provided by foreign organizations.',
    tradeAgreements: ['Eurasian Economic Union (EAEU)', 'EU-Armenia CEPA'],
    servicesTaxInfo: {
      vatGstOnServices: 20.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 20.0,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (SRC e-services portal)',
      servicesStatuteNote: 'Foreign electronic service providers selling to physical persons in Armenia must register on the SRC e-services portal and pay 20% VAT quarterly.',
      servicesEvidenceUrl: 'https://www.petekamutner.am'
    }
  },
  {
    code: 'AZ', name: 'Azerbaijan', region: 'Europe', currency: 'AZN', currencySymbol: '₼',
    corporateTaxRate: 20.0, vatGstRate: 18.0, withholdingDividends: 10.0, withholdingRoyalties: 14.0, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'State Tax Service under the Ministry of Economy of the Republic of Azerbaijan', authorityWebsite: 'https://www.taxes.gov.az',
    legalGazetteUrl: 'http://e-qanun.az', statuteReference: 'Tax Code of the Republic of Azerbaijan (Article 168 Place of Supply)',
    officialEvidenceNote: 'E-Qanun Law of the Republic of Azerbaijan amending Tax Code regarding taxation of digital services and e-commerce.',
    tradeAgreements: ['CIS Free Trade Area'],
    servicesTaxInfo: {
      vatGstOnServices: 18.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 18.0,
      withholdingTaxOnServices: 14.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (Financial institution retention)',
      servicesStatuteNote: 'Local banks withhold 18% VAT on payments made by Azerbaijani resident individuals to foreign digital service and electronic commerce vendors.',
      servicesEvidenceUrl: 'https://www.taxes.gov.az'
    }
  },
  {
    code: 'KZ', name: 'Kazakhstan', region: 'Asia-Pacific', currency: 'KZT', currencySymbol: '₸',
    corporateTaxRate: 20.0, vatGstRate: 12.0, withholdingDividends: 15.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: true, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'State Revenue Committee of the Ministry of Finance of Kazakhstan (SRC / КГД МФ РК)', authorityWebsite: 'https://kgd.gov.kz',
    legalGazetteUrl: 'http://zan.gov.kz', statuteReference: 'Tax Code of the Republic of Kazakhstan (Article 779-1 Google Tax)',
    officialEvidenceNote: 'Zan.gov.kz Tax Code amendments introducing conditional VAT registration for non-resident companies supplying electronic services.',
    tradeAgreements: ['Eurasian Economic Union (EAEU)'],
    servicesTaxInfo: {
      vatGstOnServices: 12.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 12.0,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (Conditional registration on e-Salyq portal)',
      servicesStatuteNote: 'Google Tax (Article 779-1): Foreign internet companies providing digital services to physical persons in Kazakhstan must register conditionally with SRC and pay 12% VAT quarterly.',
      servicesEvidenceUrl: 'https://kgd.gov.kz/en/content/taxation-foreign-companies-providing-services-electronic-form'
    }
  },
  {
    code: 'UZ', name: 'Uzbekistan', region: 'Asia-Pacific', currency: 'UZS', currencySymbol: "so'm",
    corporateTaxRate: 15.0, vatGstRate: 12.0, withholdingDividends: 10.0, withholdingRoyalties: 20.0, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Tax Committee under the Cabinet of Ministers of the Republic of Uzbekistan', authorityWebsite: 'https://soliq.uz',
    legalGazetteUrl: 'https://lex.uz', statuteReference: 'Tax Code of the Republic of Uzbekistan (Section XX Electronic Services)',
    officialEvidenceNote: 'Lex.uz Tax Code of Uzbekistan Chapter on Taxation of Foreign Legal Entities Providing Electronic Services.',
    tradeAgreements: ['CIS Free Trade Area'],
    servicesTaxInfo: {
      vatGstOnServices: 12.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 12.0,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (VAT Office for foreign digital companies)',
      servicesStatuteNote: 'Foreign companies supplying digital services to individuals in Uzbekistan must register through the dedicated VAT Office portal (tax.uz) and pay 12% VAT.',
      servicesEvidenceUrl: 'https://soliq.uz'
    }
  },
  {
    code: 'NP', name: 'Nepal', region: 'Asia-Pacific', currency: 'NPR', currencySymbol: 'Rs',
    corporateTaxRate: 25.0, vatGstRate: 13.0, withholdingDividends: 5.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    digitalServicesTax: 2.0, cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Jul 15',
    statutoryAuthority: 'Inland Revenue Department of Nepal (IRD)', authorityWebsite: 'https://ird.gov.np',
    legalGazetteUrl: 'http://rajpatra.dop.gov.np', statuteReference: 'Finance Act 2022 / 2023 (Digital Service Tax & VAT on Electronic Services)',
    officialEvidenceNote: 'Nepal Gazette Finance Act 2079 (2022) Section 20 introducing 2% Digital Service Tax (DST) on non-resident electronic services.',
    tradeAgreements: ['SAFTA', 'BIMSTEC'],
    servicesTaxInfo: {
      vatGstOnServices: 13.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 13.0,
      digitalServicesTaxRate: 2.0, digitalServicesTaxName: 'Nepal Digital Service Tax (DST 2%)',
      dstThresholdLocal: 'NPR 2,000,000 annual digital transaction turnover in Nepal',
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Finance Act: 2% DST applies on gross billing of non-resident electronic service providers (cloud, SaaS, streaming) exceeding NPR 2M/year. 13% VAT applies under IRD digital registry.',
      servicesEvidenceUrl: 'https://ird.gov.np'
    }
  },
  {
    code: 'KH', name: 'Cambodia', region: 'Asia-Pacific', currency: 'KHR', currencySymbol: '៛',
    corporateTaxRate: 20.0, vatGstRate: 10.0, withholdingDividends: 14.0, withholdingRoyalties: 14.0, withholdingInterest: 14.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'General Department of Taxation of Cambodia (GDT)', authorityWebsite: 'https://www.tax.gov.kh',
    legalGazetteUrl: 'http://kram.ocm.gov.kh', statuteReference: 'Sub-Decree No. 65 on the Implementation of VAT on E-Commerce & Prakas No. 542',
    officialEvidenceNote: 'Royal Gazette of Cambodia Sub-Decree No. 65 ANKr.BK on VAT on E-Commerce transactions.',
    tradeAgreements: ['RCEP', 'ASEAN ATIGA', 'Cambodia-China FTA'],
    servicesTaxInfo: {
      vatGstOnServices: 10.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 10.0,
      withholdingTaxOnServices: 14.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'KHR 250,000,000 annual turnover',
      servicesStatuteNote: 'E-Commerce VAT: Non-resident suppliers of digital goods and services exceeding threshold must register simplified VAT with GDT and charge 10% VAT on B2C sales. B2B reverse charged.',
      servicesEvidenceUrl: 'https://www.tax.gov.kh'
    }
  },
  {
    code: 'JO', name: 'Jordan', region: 'Middle East', currency: 'JOD', currencySymbol: 'JD',
    corporateTaxRate: 20.0, vatGstRate: 16.0, withholdingDividends: 0.0, withholdingRoyalties: 10.0, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Income and Sales Tax Department (ISTD Jordan)', authorityWebsite: 'https://www.istd.gov.jo',
    legalGazetteUrl: 'https://pm.gov.jo', statuteReference: 'General Sales Tax Law No. 6 of 1994 & Income Tax Law No. 34 of 2014',
    officialEvidenceNote: 'Official Gazette of the Hashemite Kingdom of Jordan General Sales Tax Regulations on Cross-Border Electronic Services.',
    tradeAgreements: ['US-Jordan FTA', 'GAFTA', 'Jordan-EU Association Agreement'],
    servicesTaxInfo: {
      vatGstOnServices: 16.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 16.0,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Foreign suppliers of digital services and streaming to Jordanian residents must register with ISTD and collect 16% sales tax. 10% withholding applies on non-resident services.',
      servicesEvidenceUrl: 'https://www.istd.gov.jo'
    }
  },
  {
    code: 'LB', name: 'Lebanon', region: 'Middle East', currency: 'LBP', currencySymbol: 'L£',
    corporateTaxRate: 17.0, vatGstRate: 11.0, withholdingDividends: 10.0, withholdingRoyalties: 7.5, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Ministry of Finance - Directorate of Revenue (MOF Lebanon)', authorityWebsite: 'http://www.finance.gov.lb',
    legalGazetteUrl: 'http://www.pcm.gov.lb', statuteReference: 'Income Tax Law (Decree-Law 144/1959) & Value Added Tax Law No. 379/2001',
    officialEvidenceNote: 'Official Gazette of the Lebanese Republic Law No. 379 on Value Added Tax.',
    tradeAgreements: ['GAFTA', 'EU-Lebanon Association Agreement'],
    servicesTaxInfo: {
      vatGstOnServices: 11.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 11.0,
      withholdingTaxOnServices: 7.5, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Under Article 41 Income Tax Law, payments to non-resident service providers are subject to 7.5% withholding tax (deemed profit 50% taxed at 15%). 11% VAT applies via reverse charge.',
      servicesEvidenceUrl: 'http://www.finance.gov.lb'
    }
  },
  {
    code: 'IQ', name: 'Iraq', region: 'Middle East', currency: 'IQD', currencySymbol: 'ID',
    corporateTaxRate: 15.0, vatGstRate: 0.0, withholdingDividends: 0.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'General Commission of Taxes (GCT Iraq / الهيئة العامة للضرائب)', authorityWebsite: 'https://gct.gov.iq',
    legalGazetteUrl: 'https://moj.gov.iq', statuteReference: 'Income Tax Law No. 113 of 1982 (as amended) & Coalition Provisional Authority Order 49',
    officialEvidenceNote: 'Iraqi Official Gazette (Al-Waqai Al-Iraqiya) Law No. 113 of 1982 on Income Taxation of Foreign Contracts.',
    tradeAgreements: ['GAFTA'],
    servicesTaxInfo: {
      vatGstOnServices: 0.0, b2bRule: 'Place of Supply (Destination)', b2cDigitalServicesTaxable: false, b2cDigitalServicesRate: 0.0,
      withholdingTaxOnServices: 7.0, treatyReliefAvailable: false, reverseChargeApplies: false, foreignRegistrationThreshold: 'Immediate (Mandatory tax retention on foreign contract payments)',
      servicesStatuteNote: 'No VAT in federal Iraq. Entities contracting with foreign service providers must retain between 3.3% and 7% of total invoice amounts until GCT issues a final tax clearance certificate.',
      servicesEvidenceUrl: 'https://gct.gov.iq'
    }
  },
  {
    code: 'ET', name: 'Ethiopia', region: 'Africa', currency: 'ETB', currencySymbol: 'Br',
    corporateTaxRate: 30.0, vatGstRate: 15.0, withholdingDividends: 10.0, withholdingRoyalties: 5.0, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Jul 7',
    statutoryAuthority: 'Ministry of Revenues of Ethiopia (MOR)', authorityWebsite: 'https://www.mor.gov.et',
    legalGazetteUrl: 'https://chilot.me/federal-negurit-gazette/', statuteReference: 'Federal Income Tax Proclamation No. 979/2016 & Value Added Tax Proclamation No. 285/2002',
    officialEvidenceNote: 'Federal Negarit Gazette Proclamation No. 979/2016 Federal Income Tax Proclamation Art 51.',
    tradeAgreements: ['AfCFTA', 'COMESA'],
    servicesTaxInfo: {
      vatGstOnServices: 15.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 15.0,
      withholdingTaxOnServices: 10.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Import of services is subject to 15% VAT reverse charge by Ethiopian customer. Article 51 Income Tax Proclamation applies 10% non-resident withholding on technical and managerial fees.',
      servicesEvidenceUrl: 'https://www.mor.gov.et'
    }
  },
  {
    code: 'CM', name: 'Cameroon', region: 'Africa', currency: 'XAF', currencySymbol: 'FCFA',
    corporateTaxRate: 30.0, vatGstRate: 19.25, withholdingDividends: 16.5, withholdingRoyalties: 15.0, withholdingInterest: 16.5,
    digitalServicesTax: 5.0, cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Direction Générale des Impôts du Cameroun (DGI)', authorityWebsite: 'https://www.impots.cm',
    legalGazetteUrl: 'https://www.spm.gov.cm', statuteReference: 'Code Général des Impôts (CGI) & Finance Law on E-Commerce',
    officialEvidenceNote: 'Journal Officiel de la République du Cameroun Loi de finances instituant la taxe sur les transactions électroniques et plateformes numériques.',
    tradeAgreements: ['AfCFTA', 'CEMAC', 'Cameroon-EU Interim EPA'],
    servicesTaxInfo: {
      vatGstOnServices: 19.25, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 19.25,
      digitalServicesTaxRate: 5.0, digitalServicesTaxName: 'Taxe sur les transferts d’argent et services numériques',
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Foreign operators of digital platforms providing services to Cameroonian customers must register with DGI and collect 19.25% VAT. 15% Special Income Tax (TSR) applies on technical fees.',
      servicesEvidenceUrl: 'https://www.impots.cm'
    }
  },
  {
    code: 'AO', name: 'Angola', region: 'Africa', currency: 'AOA', currencySymbol: 'Kz',
    corporateTaxRate: 25.0, vatGstRate: 14.0, withholdingDividends: 10.0, withholdingRoyalties: 10.0, withholdingInterest: 10.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Administração Geral Tributária de Angola (AGT)', authorityWebsite: 'https://agt.minfin.gov.ao',
    legalGazetteUrl: 'https://imprensanacional.gov.ao', statuteReference: 'Código Geral Tributário & Código do IVA (Lei 7/19)',
    officialEvidenceNote: 'Diário da República I Série Lei n.º 7/19 que aprova o Código do Imposto sobre o Valor Acrescentado (IVA).',
    tradeAgreements: ['AfCFTA', 'SADC'],
    servicesTaxInfo: {
      vatGstOnServices: 14.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 14.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Lei do Imposto sobre a Aplicação de Capitais (IAC) and Industrial Tax: 15% withholding tax applies on payments to non-resident entities for technical assistance, software, and management.',
      servicesEvidenceUrl: 'https://agt.minfin.gov.ao'
    }
  },
  {
    code: 'ZW', name: 'Zimbabwe', region: 'Africa', currency: 'ZWG', currencySymbol: 'ZiG',
    corporateTaxRate: 25.0, vatGstRate: 15.0, withholdingDividends: 15.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    digitalServicesTax: 5.0, cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Zimbabwe Revenue Authority (ZIMRA)', authorityWebsite: 'https://www.zimra.co.zw',
    legalGazetteUrl: 'https://www.veritaszim.net', statuteReference: 'Income Tax Act (Chapter 23:06 Section 36G E-Commerce Tax) & Value Added Tax Act',
    officialEvidenceNote: 'Zimbabwe Government Gazette Finance Act No. 1/2020 enacting 5% tax on non-resident satellite broadcasting and e-commerce platforms.',
    tradeAgreements: ['AfCFTA', 'COMESA', 'SADC'],
    servicesTaxInfo: {
      vatGstOnServices: 15.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 15.0,
      digitalServicesTaxRate: 5.0, digitalServicesTaxName: 'Zimbabwe E-Commerce & Digital Platform Tax',
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'US$ 500,000 threshold',
      servicesStatuteNote: 'Section 36G Income Tax Act: 5% gross tax applies on non-resident electronic service operators (SaaS, streaming, advertising) with annual revenue exceeding $500,000 from Zimbabwean users.',
      servicesEvidenceUrl: 'https://www.zimra.co.zw'
    }
  },
  {
    code: 'BW', name: 'Botswana', region: 'Africa', currency: 'BWP', currencySymbol: 'P',
    corporateTaxRate: 22.0, vatGstRate: 14.0, withholdingDividends: 10.0, withholdingRoyalties: 15.0, withholdingInterest: 15.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Jun 30',
    statutoryAuthority: 'Botswana Unified Revenue Service (BURS)', authorityWebsite: 'https://www.burs.org.bw',
    legalGazetteUrl: 'https://www.gov.bw/gazettes', statuteReference: 'Income Tax Act (Cap. 52:01) & Value Added Tax Act (Cap. 50:03)',
    officialEvidenceNote: 'Botswana Government Gazette Extraordinary Value Added Tax (Amendment) Act.',
    tradeAgreements: ['AfCFTA', 'SACU', 'SADC'],
    servicesTaxInfo: {
      vatGstOnServices: 14.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 14.0,
      withholdingTaxOnServices: 15.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate',
      servicesStatuteNote: 'Section 58 Income Tax Act: 15% withholding tax applies to commercial royalties and management or consultancy fees paid to non-resident service providers.',
      servicesEvidenceUrl: 'https://www.burs.org.bw'
    }
  },
  {
    code: 'ZM', name: 'Zambia', region: 'Africa', currency: 'ZMW', currencySymbol: 'ZK',
    corporateTaxRate: 30.0, vatGstRate: 16.0, withholdingDividends: 20.0, withholdingRoyalties: 20.0, withholdingInterest: 20.0,
    cbamApplicable: false, hasPillarTwo: false, taxYearEnd: 'Dec 31',
    statutoryAuthority: 'Zambia Revenue Authority (ZRA)', authorityWebsite: 'https://www.zra.org.zm',
    legalGazetteUrl: 'https://www.parliament.gov.zm', statuteReference: 'Value Added Tax Act (Chapter 331 Electronic Services Regulations) & Income Tax Act',
    officialEvidenceNote: 'Republic of Zambia Government Gazette Statutory Instrument No. 102 Value Added Tax (Electronic Services) Regulations.',
    tradeAgreements: ['AfCFTA', 'COMESA', 'SADC'],
    servicesTaxInfo: {
      vatGstOnServices: 16.0, b2bRule: 'Reverse Charge', b2cDigitalServicesTaxable: true, b2cDigitalServicesRate: 16.0,
      withholdingTaxOnServices: 20.0, treatyReliefAvailable: true, reverseChargeApplies: true, foreignRegistrationThreshold: 'Immediate (Foreign electronic service portal)',
      servicesStatuteNote: 'SI 102 on Electronic Services: Foreign providers of digital services (SaaS, cloud, software, media) to Zambian consumers must register on the ZRA portal and pay 16% VAT.',
      servicesEvidenceUrl: 'https://www.zra.org.zm'
    }
  }
];

const toAdd = restOfWorld.filter(c => !existingCodes.has(c.code));
console.log('Rest of world countries to append:', toAdd.length);

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
  console.log('Successfully appended additional countries!');
}
