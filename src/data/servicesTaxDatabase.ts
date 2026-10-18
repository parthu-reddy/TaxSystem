export interface ServiceCategoryDefinition {
  id: 'saas' | 'tech_consulting' | 'mgmt_legal' | 'digital_ads' | 'freelance_it' | 'cloud_infrastructure';
  title: string;
  unCpcCode: string;
  sacCode: string; // India SAC (Services Accounting Code)
  description: string;
  typicalB2BRule: string;
  typicalB2CRule: string;
  typicalWhtRange: string;
  notes: string;
}

export const SERVICE_CATEGORIES: ServiceCategoryDefinition[] = [
  {
    id: 'saas',
    title: 'Software-as-a-Service (SaaS) & Cloud Subscriptions',
    unCpcCode: 'CPC 84210 (Internet telecommunications & on-demand software)',
    sacCode: 'SAC 998311 (Information technology software services)',
    description: 'Cloud-hosted multi-tenant software accessed remotely via web browser or API without transfer of source code or localized copy.',
    typicalB2BRule: 'Reverse Charge (Recipient accounts for VAT in destination country; 0% VAT on supplier invoice).',
    typicalB2CRule: 'Destination VAT/GST charged directly by foreign provider (e.g. EU OSS, UK VOEC) if past registration threshold.',
    typicalWhtRange: '0% - 10% (Often treated as business profits exempt under Article 7 of OECD Model, unless classified as royalty or FTS).',
    notes: 'In the US, 25+ states levy sales tax on SaaS (e.g. NY, TX, WA, OH, PA, MA) while others treat it as exempt service (CA, FL).'
  },
  {
    id: 'tech_consulting',
    title: 'IT Engineering, System Architecture & Technical Services (FTS)',
    unCpcCode: 'CPC 83141 (IT design and development services)',
    sacCode: 'SAC 998313 (Information technology consulting & support services)',
    description: 'Custom programming, software engineering, technical architecture, and cybersecurity analysis performed remotely or on-site.',
    typicalB2BRule: 'Reverse Charge Mechanism (RCM) applies in destination country.',
    typicalB2CRule: 'Subject to local consumption tax at customer location.',
    typicalWhtRange: '10% - 25% statutory Withholding Tax on Fees for Technical Services (FTS) unless reduced under Double Tax Treaty (DTT).',
    notes: 'Requires Tax Residency Certificate (TRC) and Form 10F / W-8BEN-E to invoke treaty relief.'
  },
  {
    id: 'mgmt_legal',
    title: 'Legal, Accounting, Auditing & Management Advisory',
    unCpcCode: 'CPC 82110 (Legal advisory & documentation) / CPC 82210 (Accounting)',
    sacCode: 'SAC 998211 (Legal services) / SAC 998221 (Accounting & auditing)',
    description: 'Professional legal counsel, statutory audits, transfer pricing analysis, and strategic corporate management consulting.',
    typicalB2BRule: 'Place of supply is recipient establishment (B2B general rule); recipient applies Reverse Charge.',
    typicalB2CRule: 'Provider location or recipient location depending on statutory cross-border professional service rules.',
    typicalWhtRange: '10% - 20% statutory withholding in many developing/source jurisdictions.',
    notes: 'Bar admission and local regulatory licensing may apply in addition to tax compliance.'
  },
  {
    id: 'digital_ads',
    title: 'Digital Advertising, Sponsored Placement & Marketplace Fees',
    unCpcCode: 'CPC 83610 (Advertising services & provision of advertising space)',
    sacCode: 'SAC 998361 (Advertising services / online marketplace intermediation)',
    description: 'Online targeted ads, search PPC advertising, sponsored content, and platform marketplace transaction commissions.',
    typicalB2BRule: 'Reverse Charge for B2B. Directly targeted by Digital Services Taxes (DST) in 15+ countries.',
    typicalB2CRule: 'Standard VAT/GST charged in destination country.',
    typicalWhtRange: 'Subject to unilateral Digital Services Taxes (DST 2% - 7.5%) and Equalisation Levies.',
    notes: 'Subject to UK DST (2%), French TSN (3%), Italian DST (3%), Spanish DST (3%), Canadian DST (3%), Turkish DST (7.5%).'
  },
  {
    id: 'cloud_infrastructure',
    title: 'Cloud Infrastructure (IaaS / PaaS), Compute & Data Hosting',
    unCpcCode: 'CPC 84220 (Data processing, web hosting & infrastructure services)',
    sacCode: 'SAC 998315 (Hosting and data infrastructure provisioning)',
    description: 'Virtual private servers, elastic compute clusters, object storage buckets, database hosting, and CDN transit.',
    typicalB2BRule: 'General B2B place of supply: customer location with buyer Reverse Charge.',
    typicalB2CRule: 'Destination country consumer VAT/GST.',
    typicalWhtRange: '0% - 10% (Generally classified as commercial lease of equipment or business profits under tax treaties).',
    notes: 'Exempt from physical import tariffs; subject to local data sovereignty laws and electronic services VAT.'
  },
  {
    id: 'freelance_it',
    title: 'Remote Freelance & Independent Contractor Services',
    unCpcCode: 'CPC 83149 (Other information technology services)',
    sacCode: 'SAC 998319 (Other computer services n.e.c.)',
    description: 'Independent contractor delivery of digital design, software bug fixes, UI/UX prototyping, and content creation.',
    typicalB2BRule: 'Reverse charge if recipient is VAT registered; otherwise subject to source-country withholding.',
    typicalB2CRule: 'Exempt under small business registration thresholds in most jurisdictions.',
    typicalWhtRange: 'Subject to 30% US backup withholding without Form W-8BEN; 0% - 15% with valid treaty certification.',
    notes: 'Independent contractor classification vs permanent establishment (PE) risk must be audited.'
  }
];

export interface DstRegimeInfo {
  country: string;
  countryCode: string;
  rate: number;
  taxName: string;
  globalRevenueThreshold: string;
  domesticRevenueThreshold: string;
  coveredActivities: string;
  enactedDate: string;
  evidenceUrl: string;
  statuteCitation: string;
}

export const GLOBAL_DST_REGIMES: DstRegimeInfo[] = [
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    rate: 2.0,
    taxName: 'UK Digital Services Tax (DST)',
    globalRevenueThreshold: '£500 Million global digital turnover',
    domesticRevenueThreshold: '£25 Million UK digital turnover',
    coveredActivities: 'Social media platforms, search engines, and online marketplaces.',
    enactedDate: 'Finance Act 2020 Part 2',
    evidenceUrl: 'https://www.gov.uk/guidance/check-if-you-need-to-pay-digital-services-tax',
    statuteCitation: 'Finance Act 2020 c. 14, Part 2, Sections 38-72'
  },
  {
    country: 'France',
    countryCode: 'FR',
    rate: 3.0,
    taxName: 'Taxe sur les Services Numériques (TSN / GAFA Tax)',
    globalRevenueThreshold: '€750 Million global digital turnover',
    domesticRevenueThreshold: '€25 Million French digital turnover',
    coveredActivities: 'Targeted online advertising, user data monetization, and multi-sided digital intermediation.',
    enactedDate: 'Loi n° 2019-759 du 24 juillet 2019',
    evidenceUrl: 'https://www.impots.gouv.fr/international-professionnel/taxe-sur-les-services-numeriques',
    statuteCitation: 'Code Général des Impôts (CGI) Articles 299 bis et suivants'
  },
  {
    country: 'Italy',
    countryCode: 'IT',
    rate: 3.0,
    taxName: 'Imposta sui Servizi Digitali (Digital Services Tax)',
    globalRevenueThreshold: '€750 Million global digital revenue',
    domesticRevenueThreshold: '€5.5 Million Italian digital revenue',
    coveredActivities: 'Targeted advertising, digital interface provision, and transmission of user data.',
    enactedDate: 'Legge di Bilancio 2019 (Law 145/2018)',
    evidenceUrl: 'https://www.agenziaentrate.gov.it/portale/imposta-sui-servizi-digitali',
    statuteCitation: 'Legge 30 dicembre 2018, n. 145, art. 1, commi 35-50'
  },
  {
    country: 'Spain',
    countryCode: 'ES',
    rate: 3.0,
    taxName: 'Impuesto sobre Determinados Servicios Digitales (IDSD)',
    globalRevenueThreshold: '€750 Million global worldwide turnover',
    domesticRevenueThreshold: '€3 Million Spanish digital turnover',
    coveredActivities: 'Online advertising, online intermediation services, and data transfer services.',
    enactedDate: 'Ley 4/2020, de 15 de octubre',
    evidenceUrl: 'https://sede.agenciatributaria.gob.es/Sede/procedimientoini/GC42.shtml',
    statuteCitation: 'Ley 4/2020 del Impuesto sobre Determinados Servicios Digitales (BOE núm. 275)'
  },
  {
    country: 'Canada',
    countryCode: 'CA',
    rate: 3.0,
    taxName: 'Canadian Digital Services Tax (DST)',
    globalRevenueThreshold: '€750 Million global enterprise revenue',
    domesticRevenueThreshold: 'CA$ 20 Million Canadian in-scope revenue',
    coveredActivities: 'Online marketplace services, online targeted ads, social media services, and user data sales.',
    enactedDate: 'Bill C-59 (Budget Implementation Act, 2024)',
    evidenceUrl: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/digital-services-tax.html',
    statuteCitation: 'Digital Services Tax Act (Statutes of Canada 2024, c. 15, s. 128)'
  },
  {
    country: 'India',
    countryCode: 'IN',
    rate: 2.0,
    taxName: 'Equalisation Levy 2.0 (E-Commerce Supply of Services)',
    globalRevenueThreshold: 'No global threshold (Applicable to non-resident e-commerce operators)',
    domesticRevenueThreshold: '₹2 Crore (approx. $240,000 USD) annual sales in India',
    coveredActivities: 'E-commerce supply of goods or provision of services facilitated by non-resident operators to Indian residents.',
    enactedDate: 'Finance Act 2016 & Finance Act 2020 Amendments',
    evidenceUrl: 'https://incometaxindia.gov.in',
    statuteCitation: 'Chapter VIII of Finance Act, 2016, amended by Finance Act, 2020'
  },
  {
    country: 'Austria',
    countryCode: 'AT',
    rate: 5.0,
    taxName: 'Digitalsteuer (Digital Advertising Tax)',
    globalRevenueThreshold: '€750 Million global annual revenue',
    domesticRevenueThreshold: '€25 Million Austrian online advertising revenue',
    coveredActivities: 'Provision of online advertising space in Austria.',
    enactedDate: 'Digitalsteuergesetz 2020 (DiStG 2020)',
    evidenceUrl: 'https://www.bmf.gv.at/themen/steuern/fuer-unternehmen/digitalsteuer.html',
    statuteCitation: 'BGBl. I Nr. 91/2019 (Digitalsteuergesetz 2020)'
  },
  {
    country: 'Turkey',
    countryCode: 'TR',
    rate: 7.5,
    taxName: 'Dijital Hizmet Vergisi (Digital Services Tax)',
    globalRevenueThreshold: '€750 Million global digital revenue',
    domesticRevenueThreshold: '20 Million TL Turkish digital revenue',
    coveredActivities: 'All digital advertising services, sale of digital content (audio, video, software), and digital intermediation.',
    enactedDate: 'Law No. 7194 on Digital Services Tax',
    evidenceUrl: 'https://www.gib.gov.tr',
    statuteCitation: 'Resmi Gazete No. 30971, Dijital Hizmet Vergisi Kanunu (Law No. 7194)'
  },
  {
    country: 'Kenya',
    countryCode: 'KE',
    rate: 1.5,
    taxName: 'Digital Service Tax (DST) & Significant Economic Presence',
    globalRevenueThreshold: 'No global threshold',
    domesticRevenueThreshold: 'Gross transaction value from Kenyan users',
    coveredActivities: 'Downloadable digital content, SaaS, streaming services, and online ticket sales.',
    enactedDate: 'Finance Act 2020 & 2023 Amendments',
    evidenceUrl: 'https://www.kra.go.ke',
    statuteCitation: 'Section 12D of Income Tax Act (Cap. 470, Laws of Kenya)'
  }
];
