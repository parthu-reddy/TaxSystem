export interface ThirdPartyEntity {
  category:
    | 'Freight Forwarder & Carrier (NVOCC)'
    | 'Accredited Testing Lab / Notified Body (TIC)'
    | 'Surety Bond Underwriter & Trade Insurer'
    | 'Chamber of Commerce & Consular Legalization'
    | 'In-Country Legal Representative / Resident Agent'
    | 'Chartered Accountant / Auditor / CPA'
    | 'Authorized Dealer Bank & Trade Finance'
    | 'Licensed Customs Broker (LCB / CHA)'
    | 'Environmental & Carbon Verifier'
    | 'Merchant of Record / Digital Tax Intermediary';
  name: string;
  isMandatory: boolean;
  legalMandate: string;
  roleDescription: string;
  formsProduced: string[];
  officialDirectoryUrl?: string;
  directoryName?: string;
}

export interface ThirdPartyDirectoryItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  summary: string;
  applicableFlows: Array<'Goods Import' | 'Goods Export' | 'Services Export' | 'Services Import' | 'Dual-Use & Export Control'>;
  keyStatutoryMandate: string;
  statuteCitation: string;
  whenMandatory: string[];
  whenOptionalOrSelf: string[];
  keyDocumentsAndForms: string[];
  typicalFeeRange: string;
  turnaroundTime: string;
  consequencesOfOmission: string;
  officialVerificationRegistry: {
    name: string;
    url: string;
    description: string;
  };
  stepByStepEngagementProtocol: string[];
}

export interface TradePermission {
  id: string;
  title: string;
  type: 'Goods Import' | 'Goods Export' | 'Services Export' | 'Services Import' | 'Dual-Use & Export Control';
  countryCode: string;
  countryName: string;
  jurisdictionScope: 'National' | 'Regional (EU)' | 'Global / Multilateral';
  issuingAuthority: string;
  authorityUrl: string;
  isMandatory: boolean;
  validity: string;
  processingTimeline: string;
  governmentFees: string;
  overview: string;
  stepByStepInstructions: string[];
  officialForms: Array<{
    formNumber: string;
    formName: string;
    officialFormUrl: string;
    submissionPortalName: string;
    submissionPortalUrl: string;
    filingMode: 'Online Electronic (Instant / Digital Signature)' | 'EDI / Broker Electronic Filing' | 'Manual Physical Submission with Bank/Auditor';
  }>;
  thirdPartyRequirements: {
    auditorRequired: boolean;
    auditorRoleDescription?: string;
    bankRequired: boolean;
    bankRoleDescription?: string;
    customsBrokerRequired: boolean;
    customsBrokerRoleDescription?: string;
    otherThirdParty?: string;
    entities?: ThirdPartyEntity[];
  };
  exemptions: string[];
  penaltiesForNonCompliance: string;
  statuteCitation: string;
}

export const TRADE_PERMISSIONS_DATABASE: TradePermission[] = [
  // =========================================================================
  // 1. UNITED STATES — GOODS IMPORT & EXPORT
  // =========================================================================
  {
    id: 'US_CBP_ACE_ENTRY',
    title: 'United States: Customs Import Clearance (CBP Form 7501 & Entry Summary)',
    type: 'Goods Import',
    countryCode: 'US',
    countryName: 'United States',
    jurisdictionScope: 'National',
    issuingAuthority: 'U.S. Customs and Border Protection (CBP) / Department of Homeland Security',
    authorityUrl: 'https://www.cbp.gov',
    isMandatory: true,
    validity: 'Per commercial shipment transaction',
    processingTimeline: 'Electronic pre-arrival release (1-24 hours); 10 business days for duty settlement',
    governmentFees: 'Merchandise Processing Fee (MPF) 0.3464% (Min $31.67, Max $614.35) + Harbor Maintenance Fee (HMF) 0.125% if sea vessel',
    overview: 'All commercial goods imported into the U.S. valued over $2,500 (formal entry) require electronic declaration through CBP’s Automated Commercial Environment (ACE). The Importer of Record (IOR) must declare Harmonized Tariff Schedule (HTSUS) codes, country of origin, customs value, and pay duties.',
    stepByStepInstructions: [
      '1. Obtain an Importer Number (IRS Employer Identification Number EIN for US companies, or CBP Assigned Number via Form 5106 for non-resident importers).',
      '2. Purchase a Customs Bond (Continuous Bond of $50,000+ or Single Entry Bond) through a Treasury-licensed surety bond company.',
      '3. Ensure Importer Security Filing (ISF "10+2") is submitted electronically at least 24 hours prior to maritime vessel loading at origin port.',
      '4. File CBP Form 3461 (Entry/Immediate Delivery) electronically in ACE upon cargo arrival or pre-arrival for physical release permission.',
      '5. File CBP Form 7501 (Entry Summary) and deposit estimated tariffs and MPF within 10 working days of release.',
      '6. Retain all commercial invoices, ocean bills of lading/airway bills, and origin packing lists for at least 5 years under 19 U.S.C. § 1508.'
    ],
    officialForms: [
      {
        formNumber: 'CBP Form 7501',
        formName: 'Entry Summary (Declaration of Customs Value, Duty & HTS)',
        officialFormUrl: 'https://www.cbp.gov/document/forms/form-7501-entry-summary',
        submissionPortalName: 'ACE (Automated Commercial Environment) Secure Data Portal',
        submissionPortalUrl: 'https://www.cbp.gov/trade/automated',
        filingMode: 'EDI / Broker Electronic Filing'
      },
      {
        formNumber: 'CBP Form 5106',
        formName: 'Create/Update Importer Identity Form',
        officialFormUrl: 'https://www.cbp.gov/document/forms/form-5106-createupdate-importer-identity-form',
        submissionPortalName: 'ACE Portal / CBP Revenue Division',
        submissionPortalUrl: 'https://www.cbp.gov/trade/automated',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'CBP Form 301',
        formName: 'Customs Bond Application (Continuous or Single Transaction)',
        officialFormUrl: 'https://www.cbp.gov/document/forms/form-301-customs-bond',
        submissionPortalName: 'Surety Company / CBP Bond Centralization Program',
        submissionPortalUrl: 'https://www.cbp.gov/trade/priority-issues/revenue/bonds',
        filingMode: 'EDI / Broker Electronic Filing'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Independent CPA recommended if filing under First Sale Rule or post-entry Prior Disclosure under 19 U.S.C. § 1592.',
      bankRequired: true,
      bankRoleDescription: 'Automated Clearinghouse (ACH) debit account authorization via CBP Form 400 with a US commercial bank for daily statement duty debits.',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'A Licensed U.S. Customs Broker (LCB) with CBP power of attorney is legally authorized to classify goods, calculate ad-valorem duties, file ACE EDI transmissions, and underwrite bonds on behalf of importers.',
      otherThirdParty: 'Treasury-approved Surety Bond Underwriter to issue continuous customs bond.'
    },
    exemptions: [
      'Section 321 De Minimis: Commercial shipments valued at $800 USD or less imported by one person on one day enter duty-free without formal entry (except goods subject to Partner Government Agencies PGA like FDA, EPA).',
      'Informal Entry (commercial shipments between $800 and $2,500) allows simplified clearance without continuous bond.'
    ],
    penaltiesForNonCompliance: 'Fines up to domestic value of merchandise for fraud or gross negligence under 19 U.S.C. § 1592; cargo seizure, liquidation with 100% penalty, and revocation of import privileges.',
    statuteCitation: 'Tariff Act of 1930 (19 U.S.C. § 1484, § 1505) and Title 19 Code of Federal Regulations (19 CFR Parts 141-144).'
  },
  {
    id: 'US_BIS_SNAP_R_EXPORT',
    title: 'United States: Export Licensing & BIS SNAP-R (Dual-Use / EAR Compliance)',
    type: 'Dual-Use & Export Control',
    countryCode: 'US',
    countryName: 'United States',
    jurisdictionScope: 'National',
    issuingAuthority: 'Bureau of Industry and Security (BIS) / U.S. Department of Commerce',
    authorityUrl: 'https://www.bis.doc.gov',
    isMandatory: true,
    validity: 'Up to 4 years for valid BIS licenses, or transaction-specific',
    processingTimeline: '30 to 45 business days for interagency review (State/DoD/Energy)',
    governmentFees: 'Free of charge (Government processing fee is $0)',
    overview: 'Under the Export Administration Regulations (EAR), exports, re-exports, or deemed exports of dual-use hardware, software (source code/binaries), and technology listed on the Commerce Control List (CCL) with an Export Control Classification Number (ECCN) require a license or license exception before cross-border transfer.',
    stepByStepInstructions: [
      '1. Determine the ECCN (Export Control Classification Number) of the hardware, software, or technology (or verify EAR99 designation).',
      '2. Screen all foreign counterparties, ultimate consignees, and intermediaries against the U.S. Consolidated Screening List (Denied Persons, Entity List, Unverified List, SDN).',
      '3. Register the exporting enterprise with BIS to receive a Company Identification Number (CIN) for SNAP-R access.',
      '4. Complete BIS-748P (Multipurpose Application) online within the SNAP-R portal detailing destination country, end-user profile, and technical specifications.',
      '5. Obtain and upload End-User Statement (Form BIS-711 or company letterhead) from the foreign customer certifying non-military, non-proliferation use.',
      '6. File Electronic Export Information (EEI) in the Automated Export System (AES) via ACE before vessel/aircraft departure, citing the License Number or License Exception symbol (e.g. ENC, STA, CIV).'
    ],
    officialForms: [
      {
        formNumber: 'BIS-748P',
        formName: 'Multipurpose Application for Export License / Commodity Classification (CCATS)',
        officialFormUrl: 'https://www.bis.doc.gov/index.php/licensing/simplified-network-application-process-redesign-snap-r',
        submissionPortalName: 'SNAP-R (Simplified Network Application Process - Redesign)',
        submissionPortalUrl: 'https://snapr.bis.doc.gov',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'BIS-711',
        formName: 'Statement by Ultimate Consignee and Purchaser',
        officialFormUrl: 'https://www.bis.doc.gov/index.php/documents/forms-documents/631-bis-711-statement-by-ultimate-consignee-and-purchaser/file',
        submissionPortalName: 'SNAP-R Attachment Upload',
        submissionPortalUrl: 'https://snapr.bis.doc.gov',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Export compliance legal audit recommended for companies exporting encryption software, semiconductor equipment, or AI accelerators.',
      bankRequired: true,
      bankRoleDescription: 'Commercial banks verify export letter of credit terms to prevent financing prohibited parties on OFAC and Entity Lists.',
      customsBrokerRequired: false,
      customsBrokerRoleDescription: 'Freight forwarder / AES filer submits EEI Internal Transaction Number (ITN) through ACE prior to cargo movement.',
      otherThirdParty: 'Legal counsel specializing in ITAR/EAR compliance for commodity jurisdiction (CJ) determinations.'
    },
    exemptions: [
      'Items classified as EAR99 do not require a license unless shipping to an embargoed country (Cuba, Iran, North Korea, Syria, Crimea) or restricted end-user/end-use.',
      'License Exception ENC (15 CFR § 740.17) for mass-market commercial encryption hardware/software with self-classification report.'
    ],
    penaltiesForNonCompliance: 'Criminal penalties up to 20 years imprisonment and $1,000,000 fine per violation under Export Control Reform Act (ECRA); civil fines exceeding $350,000 per violation; denial of export privileges.',
    statuteCitation: 'Export Control Reform Act of 2018 (50 U.S.C. §§ 4801-4852) and Export Administration Regulations (15 CFR Parts 730-774).'
  },

  // =========================================================================
  // 2. INDIA — GOODS & SERVICES (DGFT, RBI, TAX AUDITOR)
  // =========================================================================
  {
    id: 'IN_DGFT_IEC_AD_CODE',
    title: 'India: Importer-Exporter Code (IEC), AD Code Linkage & ICEGATE Customs Registration',
    type: 'Goods Import',
    countryCode: 'IN',
    countryName: 'India',
    jurisdictionScope: 'National',
    issuingAuthority: 'Directorate General of Foreign Trade (DGFT) / Ministry of Commerce & Industry, CBIC, and RBI',
    authorityUrl: 'https://www.dgft.gov.in',
    isMandatory: true,
    validity: 'Lifetime validity (Mandatory annual online re-validation between April and June every year)',
    processingTimeline: '1-2 business days for IEC; 3-5 days for Bank AD Code approval on ICEGATE',
    governmentFees: '₹500 INR (~$6 USD) online statutory application fee',
    overview: 'No business entity in India can import or export physical goods or receive commercial export payments without an active 10-digit Importer-Exporter Code (IEC) issued by the DGFT. In addition, the business must obtain an Authorized Dealer (AD) Code letter from their bank and register it with Indian Customs (ICEGATE) at every port of clearance.',
    stepByStepInstructions: [
      '1. Prepare entity PAN (Permanent Account Number), active business bank current account, and Class 3 Digital Signature Certificate (DSC) or Aadhaar e-Sign.',
      '2. Navigate to DGFT Online Portal and file Application for Grant of IEC (Form ANF-2A) paying ₹500 via Bharatkosh.',
      '3. Download the computer-generated e-IEC certificate containing QR code verification.',
      '4. Request a physical 14-digit Authorized Dealer (AD) Code Authorization Letter in prescribed Annexure-A format on official bank letterhead from your Authorized Dealer Bank.',
      '5. Log in to ICEGATE (Indian Customs EDI System) and register the IEC and AD Code against each Customs Port of export/import (e.g., INNSA1 Nhava Sheva, INDEL4 Delhi Air Cargo).',
      '6. Customs officer approves the bank account linkage on the Indian Customs Electronic System, enabling automated duty drawback and IGST refunds.'
    ],
    officialForms: [
      {
        formNumber: 'ANF-2A',
        formName: 'Application Form for Issue / Amendment of Importer Exporter Code (IEC)',
        officialFormUrl: 'https://www.dgft.gov.in/CP/?opt=iec-service',
        submissionPortalName: 'DGFT Unified Digital Trade Portal',
        submissionPortalUrl: 'https://www.dgft.gov.in',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'Customs Annexure-A',
        formName: 'Bank Authorized Dealer (AD) Code Registration Letter Format',
        officialFormUrl: 'https://www.icegate.gov.in/Download/AD_Code_Advisory.pdf',
        submissionPortalName: 'ICEGATE Financial Services Bank Account Module',
        submissionPortalUrl: 'https://www.icegate.gov.in',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Chartered Accountant (CA) net-worth certificate required if applying for Status Holder export incentives or Advance Authorization schemes.',
      bankRequired: true,
      bankRoleDescription: 'Authorized Dealer Category-I Bank (e.g. SBI, HDFC, ICICI) must issue the formal 14-digit AD Code Certificate verifying business current account details and linkage to RBI Export Data Processing and Monitoring System (EDPMS).',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'A Customs Broker licensed under Customs Brokers Licensing Regulations (CBLR 2018) files the electronic Bill of Entry (imports) or Shipping Bill (exports) on ICEGATE using DSC.',
      otherThirdParty: 'Certifying Authority (e-Mudhra, Capricorn, VSign) for Class 3 Digital Signature Certificate (DSC).'
    },
    exemptions: [
      'Import/export for personal use not connected with trade, manufacture, or agriculture.',
      'Ministries/Departments of Central or State Government, and persons importing/exporting goods from/to Nepal and Myanmar through Indo-Nepal/Indo-Myanmar borders with CIF value <= ₹25,000.'
    ],
    penaltiesForNonCompliance: 'Goods confiscated under Section 111 of Customs Act 1962; penalty up to 5 times value of goods under Foreign Trade (Development and Regulation) Act 1992.',
    statuteCitation: 'Foreign Trade (Development and Regulation) Act 1992 (Section 7) and Foreign Trade Policy (FTP 2023).'
  },
  {
    id: 'IN_SERVICES_FORM_15CA_15CB',
    title: 'India: Cross-Border Foreign Remittance for Services & Form 15CA / 15CB (Chartered Accountant Certification)',
    type: 'Services Import',
    countryCode: 'IN',
    countryName: 'India',
    jurisdictionScope: 'National',
    issuingAuthority: 'Income Tax Department of India (CBDT) & Reserve Bank of India (RBI)',
    authorityUrl: 'https://www.incometax.gov.in',
    isMandatory: true,
    validity: 'Per cross-border outward remittance transaction',
    processingTimeline: '1-3 business days (Chartered Accountant audit + online filing)',
    governmentFees: '₹0 government portal fee; Chartered Accountant professional fee applies (~₹2,500 - ₹15,000 depending on volume)',
    overview: 'Before any Indian resident or enterprise can remit funds outside India to a foreign vendor for imported services, software licenses, SaaS subscriptions, cloud hosting (AWS/GCP), or technical consulting, Section 195 of the Income-tax Act requires proof of tax withholding. If remittances exceed ₹5 Lakhs (~$6,000) or claim Double Taxation Avoidance Agreement (DTAA) treaty relief, a certified Chartered Accountant must audit the transaction and upload Form 15CB.',
    stepByStepInstructions: [
      '1. Receive the foreign supplier’s commercial invoice, Tax Residency Certificate (TRC) issued by their home government, and Form 10F.',
      '2. Engage an independent Chartered Accountant (CA) holding a valid Certificate of Practice (COP).',
      '3. The CA examines the agreement, invoice nature (Fee for Technical Services FTS vs Royalty vs Business Profits), and applicable DTAA treaty rates.',
      '4. The CA digitally signs and submits Form 15CB on the Income Tax Department e-Filing portal using their CA Digital Signature, generating a Unique Document Identification Number (UDIN).',
      '5. The remitter logs in to the e-Filing portal, accesses Form 15CA (Part C), links the CA’s Form 15CB acknowledgment number, and submits.',
      '6. Download the system-generated Form 15CA acknowledgment and Form 15CB, and submit along with RBI Form A2 to the Authorized Dealer Bank to initiate the SWIFT outward wire.'
    ],
    officialForms: [
      {
        formNumber: 'Form 15CB',
        formName: 'Certificate of an Accountant for Payments to Non-Resident',
        officialFormUrl: 'https://www.incometax.gov.in/iec/foportal/help/statutory-forms/form15cb',
        submissionPortalName: 'Income Tax e-Filing Portal (CA Dedicated Workspace)',
        submissionPortalUrl: 'https://www.incometax.gov.in',
        filingMode: 'Manual Physical Submission with Bank/Auditor'
      },
      {
        formNumber: 'Form 15CA',
        formName: 'Information to be Furnished for Payments, to a Non-Resident (Part A/B/C/D)',
        officialFormUrl: 'https://www.incometax.gov.in/iec/foportal/help/statutory-forms/form15ca',
        submissionPortalName: 'Income Tax Department Taxpayer Portal',
        submissionPortalUrl: 'https://www.incometax.gov.in',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'RBI Form A2',
        formName: 'Application cum Declaration for Purchase of Foreign Exchange under LRS / Commercial Trade',
        officialFormUrl: 'https://rbidocs.rbi.org.in/rdocs/Forms/PDFs/A2FOR140217.PDF',
        submissionPortalName: 'Authorized Dealer Commercial Bank Trade Desk',
        submissionPortalUrl: 'https://www.rbi.org.in',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: true,
      auditorRoleDescription: 'A practicing Chartered Accountant (Fellow or Associate of ICAI) MUST audit the invoice, determine whether the payment is taxable in India under Section 195 or DTAA, compute the exact withholding tax (TDS), and sign Form 15CB with an official ICAI UDIN number.',
      bankRequired: true,
      bankRoleDescription: 'The Authorized Dealer (AD) Category-I Bank validates Form 15CA acknowledgment and Form 15CB UDIN before processing the outward SWIFT wire and filing reporting under RBI Foreign Exchange Management Act (FEMA).',
      customsBrokerRequired: false,
      otherThirdParty: 'Institute of Chartered Accountants of India (ICAI) UDIN portal for verification.'
    },
    exemptions: [
      'Remittances where payment is not chargeable to tax under the Income-tax Act and aggregate amount does not exceed ₹5 Lakhs in the financial year (Form 15CA Part A filed without Form 15CB).',
      'Specified list of 33 exempt payment codes under Rule 37BB (e.g. Indian students tuition fees abroad, personal travel expenses).'
    ],
    penaltiesForNonCompliance: 'Penalty of ₹100,000 INR per default under Section 271-I for failure to furnish Form 15CA/15CB; disallowance of the entire service expense under Section 40(a)(i); bank wire blocked.',
    statuteCitation: 'Section 195 and Section 285BA of Income-tax Act 1961, read with Rule 37BB of Income-tax Rules 1962, and FEMA 1999.'
  },
  {
    id: 'IN_SAAS_GST_LUT_SOFTEX',
    title: 'India: SaaS & IT Services Export (GST Letter of Undertaking LUT & SOFTEX Form)',
    type: 'Services Export',
    countryCode: 'IN',
    countryName: 'India',
    jurisdictionScope: 'National',
    issuingAuthority: 'Central Board of Indirect Taxes and Customs (CBIC) & Software Technology Parks of India (STPI) / RBI',
    authorityUrl: 'https://cbic-gst.gov.in',
    isMandatory: true,
    validity: 'LUT valid for one financial year (April 1 to March 31); SOFTEX filed within 30 days of invoice',
    processingTimeline: 'LUT is approved instantly online (same minute); SOFTEX approved within 15-30 days by STPI',
    governmentFees: '₹0 for GST LUT; Nominal STPI annual service charge based on export turnover slab',
    overview: 'Exports of software, SaaS subscriptions, digital services, and IT consulting from India are classified as "Zero-Rated Supplies" under Section 16 of the Integrated Goods and Services Tax (IGST) Act. By filing a Letter of Undertaking (LUT) online, exporters can export services without upfront payment of 18% IGST. Furthermore, under RBI regulations, computer software exports through data transmission must be declared in Form SOFTEX to STPI to obtain foreign remittance realization certificates (e-BRC).',
    stepByStepInstructions: [
      '1. Hold an active GSTIN registration and Importer Exporter Code (IEC).',
      '2. Log in to the GST Portal (gst.gov.in) -> Services -> User Services -> Furnish Letter of Undertaking (LUT).',
      '3. Select the Financial Year and provide two independent witnesses with identity details, then submit via DSC or EVC for instant approval.',
      '4. Generate clean zero-rated commercial export invoices mentioning: "SUPPLY MEANT FOR EXPORT OF SERVICES UNDER LETTER OF UNDERTAKING WITHOUT PAYMENT OF INTEGRATED TAX".',
      '5. Register as an Non-STP Unit with the regional Software Technology Parks of India (STPI) center if billing cross-border software/SaaS services.',
      '6. Submit electronic Form SOFTEX on the STPI portal within 30 days of invoice issuance along with copy of client service agreement and invoice.',
      '7. Once STPI certifies the SOFTEX, provide the certified copy to your Authorized Dealer Bank to clear the export entry in RBI EDPMS and generate electronic Bank Realisation Certificate (e-BRC).'
    ],
    officialForms: [
      {
        formNumber: 'Form GST RFD-11',
        formName: 'Letter of Undertaking (LUT) for Export of Goods or Services Without Payment of IGST',
        officialFormUrl: 'https://www.gst.gov.in',
        submissionPortalName: 'Goods and Services Tax (GST) Common Portal',
        submissionPortalUrl: 'https://services.gst.gov.in/services/login',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'Form SOFTEX',
        formName: 'Declaration of Export of Software (Data Communication / Internet)',
        officialFormUrl: 'https://stpi.in/en/softex-guidelines',
        submissionPortalName: 'STPI Portal / RBI EDPMS System',
        submissionPortalUrl: 'https://stpi.in',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Chartered Accountant certification required if claiming unutilized Input Tax Credit (ITC) refund under Form GST RFD-01.',
      bankRequired: true,
      bankRoleDescription: 'The exporter’s AD Bank receives foreign inward remittances via SWIFT Nostro account, issues Foreign Inward Remittance Statement (FIRS) / e-BRC, and marks export realization in RBI EDPMS.',
      customsBrokerRequired: false,
      otherThirdParty: 'STPI (Software Technology Parks of India) designated officer to scrutinize and certify SOFTEX declarations.'
    },
    exemptions: [
      'If export value is received within statutory RBI timelines (currently 9 months from invoice date) in convertible foreign exchange (or permitted INR through Vostro accounts).'
    ],
    penaltiesForNonCompliance: 'If LUT conditions violated or payment not received within 9 months, exporter is liable to pay 18% IGST plus 18% annual interest from invoice date under Rule 96A; export proceeds barred under FEMA.',
    statuteCitation: 'Section 16 of IGST Act 2017, Rule 96A of CGST Rules 2017, and RBI Master Direction on Export of Goods and Services (FED Master Direction No. 16/2015-16).'
  },

  // =========================================================================
  // 3. EUROPEAN UNION — EORI, TARIC, SAD & DIGITAL SERVICES
  // =========================================================================
  {
    id: 'EU_EORI_SAD_IMPORT',
    title: 'European Union: Economic Operators Registration and Identification (EORI) & Single Administrative Document (SAD)',
    type: 'Goods Import',
    countryCode: 'EU',
    countryName: 'European Union (All 27 Member States)',
    jurisdictionScope: 'Regional (EU)',
    issuingAuthority: 'National Customs Administration of Member State (e.g. Zoll DE, Douane FR, Belastingdienst NL) & DG TAXUD',
    authorityUrl: 'https://taxation-customs.ec.europa.eu',
    isMandatory: true,
    validity: 'Lifetime (valid across all 27 EU member states simultaneously)',
    processingTimeline: '1 to 5 business days depending on the EU member state authority',
    governmentFees: '€0 (Issued free of charge by EU customs authorities)',
    overview: 'Any enterprise intending to import or export commercial goods into or out of the European Union Customs Union must hold an active EORI number (e.g., DE1234567890, NL987654321). The customs declaration is submitted electronically via the National Import System using the Single Administrative Document (SAD / document administratif unique DAU) format.',
    stepByStepInstructions: [
      '1. EU-established businesses must register with the customs authority of the EU country where they are established.',
      '2. Non-EU established businesses must register with the customs authority of the first EU member state where they plan to lodge an import/export customs declaration.',
      '3. Verify that the EORI number is validated on the European Commission EOS-EORI validation database.',
      '4. File an Entry Summary Declaration (ENS) in the Import Control System 2 (ICS2) before goods arrive at the EU border (mandatory air/maritime safety pre-arrival).',
      '5. Lodge the electronic customs declaration (SAD / H1 declaration under Union Customs Code) in the member state’s customs EDI portal (e.g. ATLAS in Germany, DELTA in France, AGS/DMS in Netherlands).',
      '6. Pay or defer customs duty and import VAT (or claim Article 23 import VAT deferment in Netherlands/Belgium).'
    ],
    officialForms: [
      {
        formNumber: 'EU SAD / UCC Annex B',
        formName: 'Single Administrative Document (Customs Declaration for Import / Export)',
        officialFormUrl: 'https://taxation-customs.ec.europa.eu/customs-4/customs-procedures-import-and-export-0/what-single-administrative-document-sad_en',
        submissionPortalName: 'National Customs IT Systems (ATLAS, DELTA-IE, DMS, AIDA)',
        submissionPortalUrl: 'https://taxation-customs.ec.europa.eu',
        filingMode: 'EDI / Broker Electronic Filing'
      },
      {
        formNumber: 'EORI Application',
        formName: 'Application for Economic Operators Registration and Identification Number',
        officialFormUrl: 'https://taxation-customs.ec.europa.eu/customs-4/customs-security-0/economic-operators-registration-and-identification-number-eori_en',
        submissionPortalName: 'National Member State Customs Portal',
        submissionPortalUrl: 'https://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Independent auditor review required if seeking Authorized Economic Operator (AEO-C / AEO-S) status.',
      bankRequired: true,
      bankRoleDescription: 'A direct debit mandate or comprehensive customs guarantee (bank guarantee) is required with a registered EU financial institution if utilizing duty deferment accounts.',
      customsBrokerRequired: false,
      customsBrokerRoleDescription: 'Non-EU businesses that do not have an established entity in the EU Customs Territory MUST appoint an EU-established Indirect Customs Representative (Customs Broker) who is jointly and severally liable for customs debt.',
      otherThirdParty: 'European Commission EOS database for real-time validation.'
    },
    exemptions: [
      'Goods valued under €150 are exempt from customs duties (though import VAT remains mandatory under EU IOSS).',
      'Private individuals importing non-commercial personal property.'
    ],
    penaltiesForNonCompliance: 'Consignment blocked at customs border; demurrage charges; administrative fines up to double customs value under member state customs penalty laws.',
    statuteCitation: 'Union Customs Code (Regulation (EU) No 952/2013) Articles 9, 77, 158 and Commission Delegated Regulation (EU) 2015/2446.'
  },
  {
    id: 'EU_OSS_DIGITAL_SERVICES',
    title: 'European Union: One-Stop Shop (OSS / Non-Union OSS) for B2C Digital Services & SaaS',
    type: 'Services Export',
    countryCode: 'EU',
    countryName: 'European Union (All 27 Member States)',
    jurisdictionScope: 'Regional (EU)',
    issuingAuthority: 'European Commission Directorate-General for Taxation and Customs Union (DG TAXUD) & Member State Tax Authorities',
    authorityUrl: 'https://vat-one-stop-shop.ec.europa.eu',
    isMandatory: true,
    validity: 'Continuous until revoked or deregistered',
    processingTimeline: '1-3 business days upon online application',
    governmentFees: '€0 (Free online registration)',
    overview: 'Non-EU suppliers providing electronically supplied services (SaaS, cloud storage, website hosting, downloadable software, streaming, mobile apps) to EU consumers (B2C) must charge VAT at the rate of the consumer’s country of residence (ranging from 17% in Luxembourg to 27% in Hungary). Instead of registering for VAT in all 27 EU nations separately, foreign suppliers can register in the Non-Union One-Stop Shop (OSS) in a single member state to file one quarterly return covering all 27 countries.',
    stepByStepInstructions: [
      '1. Choose an EU Member State of Identification (e.g. Ireland, Netherlands, or Germany) where the non-EU supplier has no establishment.',
      '2. Complete the Non-Union OSS electronic registration form on that member state tax portal providing legal business name, tax identification, and website URL.',
      '3. Receive an EU VAT identification number starting with "EU" (e.g., EU372000001).',
      '4. Implement geolocation IP address / billing address / payment card country verification at checkout to detect each consumer’s EU destination country.',
      '5. Apply the exact standard destination VAT rate (e.g., 19% DE, 20% FR, 21% ES, 22% IT, 27% HU) on all B2C digital sales.',
      '6. File one consolidated quarterly OSS VAT return online by the end of the month following the quarter, and remit total collected VAT to the Member State of Identification in Euros.',
      '7. Retain electronic transaction logs, customer country evidence, and digital invoices for 10 years.'
    ],
    officialForms: [
      {
        formNumber: 'Non-Union OSS Form',
        formName: 'Registration for Non-Union VAT One-Stop Shop (Electronic Services)',
        officialFormUrl: 'https://vat-one-stop-shop.ec.europa.eu/index_en',
        submissionPortalName: 'Member State of Identification OSS Portal (e.g. Irish Revenue ROS / German BZSt Online Portal BOP)',
        submissionPortalUrl: 'https://vat-one-stop-shop.ec.europa.eu',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'VAT compliance firm or European tax advisor recommended to maintain quarterly filing schedules.',
      bankRequired: true,
      bankRoleDescription: 'SEPA Euro bank account or international wire capability to remit quarterly consolidated VAT in Euros.',
      customsBrokerRequired: false,
      otherThirdParty: 'European Commission VIES (VAT Information Exchange System) API for real-time B2B customer VAT number validation.'
    },
    exemptions: [
      'B2B transactions where the EU business customer provides a valid EU VIES VAT number: zero-rated under destination reverse charge (Article 196 VAT Directive).',
      'Non-digital physical services performed completely outside the European Union.'
    ],
    penaltiesForNonCompliance: 'Automatic exclusion from OSS scheme; mandatory 27 individual country VAT registrations; interest penalties up to 20% plus back-taxes assessed by each member state.',
    statuteCitation: 'Council Directive 2006/112/EC (EU VAT Directive) Articles 358 to 369 and Council Implementing Regulation (EU) No 282/2011.'
  },

  // =========================================================================
  // 4. UNITED KINGDOM — CDS, EORI, CHIEF & EXPORT LICENSING
  // =========================================================================
  {
    id: 'GB_HMRC_CDS_CLEARANCE',
    title: 'United Kingdom: Customs Declaration Service (CDS) Import/Export Entry & GB EORI',
    type: 'Goods Import',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    jurisdictionScope: 'National',
    issuingAuthority: 'HM Revenue & Customs (HMRC) & UK Border Force',
    authorityUrl: 'https://www.gov.uk/government/organisations/hm-revenue-customs',
    isMandatory: true,
    validity: 'Lifetime GB EORI; entry declarations per commercial consignment',
    processingTimeline: 'GB EORI issued immediately to 48 hours; CDS electronic declaration cleared in minutes',
    governmentFees: '£0 for EORI and CDS access; customs duties and import VAT calculated according to UK Integrated Online Tariff',
    overview: 'Following the migration from legacy CHIEF to the modern Customs Declaration Service (CDS), all imports and exports across Great Britain borders require a GB EORI number and electronic customs declarations submitted using Declaration Unique Consignment Reference (DUCR) numbers.',
    stepByStepInstructions: [
      '1. Apply online for a GB EORI number via HMRC using a Government Gateway user ID.',
      '2. Set up a Customs Declaration Service (CDS) Financial Account with HMRC to configure Duty Deferment, Cash Account, or Immediate Payment.',
      '3. Classify goods using the UK Integrated Online Tariff (10-digit Commodity Code) to identify MFN duties and preferential rules of origin under trade deals.',
      '4. Compile commercial invoice, bill of lading/CMR, packing list, and GSP/preferential certificate of origin.',
      '5. Lodge electronic CDS Import Declaration (C88 / Single Administrative Document format) via trade software or customs broker.',
      '6. If UK VAT registered, utilize Postponed VAT Accounting (PVA) to account for import VAT on the periodic VAT return rather than paying upfront at the port.'
    ],
    officialForms: [
      {
        formNumber: 'CDS C88',
        formName: 'Customs Declaration Service Full Import / Export Declaration',
        officialFormUrl: 'https://www.gov.uk/guidance/how-to-make-a-customs-declaration-using-the-customs-declaration-service',
        submissionPortalName: 'HMRC CDS Online Portal / Third-Party Community System Provider (CSP)',
        submissionPortalUrl: 'https://www.gov.uk/guidance/using-the-customs-declaration-service',
        filingMode: 'EDI / Broker Electronic Filing'
      },
      {
        formNumber: 'Form C185',
        formName: 'Application for Authority to use a Deferment Approval Number (DAN)',
        officialFormUrl: 'https://www.gov.uk/guidance/setting-up-a-duty-deferment-account',
        submissionPortalName: 'HMRC Financial Services',
        submissionPortalUrl: 'https://www.gov.uk',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Chartered tax advisor for UK customs valuation and transfer pricing audits.',
      bankRequired: true,
      bankRoleDescription: 'UK bank account with Direct Debit mandate setup with HMRC for CDS Cash Account or Duty Deferment guarantee.',
      customsBrokerRequired: false,
      customsBrokerRoleDescription: 'A Fast Parcel Operator (FPO) or Freight Forwarder / Customs Clearance Agent can act as direct or indirect representative.',
      otherThirdParty: 'Community System Providers (CSPs like Destin8, CNS, Pentant) providing port inventory linking.'
    },
    exemptions: [
      'Goods sent from abroad to the UK with value of £135 or less: import VAT is collected at the point of sale by the seller/marketplace under UK eCommerce VAT rules, and no customs duty is due.'
    ],
    penaltiesForNonCompliance: 'Civil penalty under Customs (Contravention of a Relevant Rule) Regulations 2003 up to £2,500 per contravention; compound interest and seizure of merchandise under CEMA 1979.',
    statuteCitation: 'Taxation (Cross-border Trade) Act 2018 (TCTA 2018) and Customs and Excise Management Act 1979 (CEMA 1979).'
  },

  // =========================================================================
  // 5. GLOBAL / CROSS-BORDER SAAS & SERVICES TAX WITHHOLDING (W-8BEN-E, TRC)
  // =========================================================================
  {
    id: 'GLOBAL_IRS_FORM_W8BENE',
    title: 'United States & Global: IRS Form W-8BEN-E (Certificate of Status of Beneficial Owner for Foreign Entities)',
    type: 'Services Export',
    countryCode: 'US',
    countryName: 'United States (Cross-Border Counterparties)',
    jurisdictionScope: 'Global / Multilateral',
    issuingAuthority: 'Internal Revenue Service (IRS) / U.S. Department of the Treasury',
    authorityUrl: 'https://www.irs.gov',
    isMandatory: true,
    validity: 'Valid for three full calendar years after the year signed (e.g. signed Oct 2024 is valid until Dec 31, 2027)',
    processingTimeline: 'Self-executed by foreign entity legal officer; submitted directly to withholding agent/client',
    governmentFees: 'Free ($0 IRS filing fee)',
    overview: 'Under Chapters 3 and 4 (FATCA) of the U.S. Internal Revenue Code, any U.S. corporation paying foreign companies for SaaS subscriptions, digital services, technical support, royalties, or independent services must withhold 30% gross tax unless the foreign entity provides a valid IRS Form W-8BEN-E claiming Double Tax Treaty (DTAA) benefits or zero-withholding under business profits (Article 7).',
    stepByStepInstructions: [
      '1. Part I (General Information): Provide full legal name of foreign entity, country of incorporation, Chapter 3 entity classification (Corporation, Partnership), and Chapter 4 FATCA status (usually Active NFFE or Passive NFFE).',
      '2. Part I Line 9b: Enter Foreign Tax Identification Number (FTIN) issued by home country tax department (e.g., Indian PAN, UK UTR, German Steuernummer, Australian ABN).',
      '3. Part III (Claim of Tax Treaty Benefits): Check Box 14a certifying the beneficial owner is a tax resident of a treaty partner country.',
      '4. Part III Line 14b: Check appropriate limitation on benefits (LOB) provision (e.g., Active trade or business test, Publicly traded company test, Ownership and base erosion test).',
      '5. Part III Line 15 (Special Rates and Conditions): Specify Article number (e.g. "Article 7 - Business Profits: 0% withholding rate on Software as a Service SaaS since foreign company has no Permanent Establishment in the US").',
      '6. Sign Part XXX (Certification) under penalties of perjury by an authorized officer, affix date and capacity, and transmit PDF to the U.S. paying client or payment processor (Stripe, PayPal, Google, Apple).'
    ],
    officialForms: [
      {
        formNumber: 'Form W-8BEN-E',
        formName: 'Certificate of Status of Beneficial Owner for United States Tax Withholding and Reporting (Entities)',
        officialFormUrl: 'https://www.irs.gov/pub/irs-pdf/fw8bene.pdf',
        submissionPortalName: 'U.S. Counterparty / Withholding Agent Accounts Payable System (e.g. Tipalti, Coupa, bill.com)',
        submissionPortalUrl: 'https://www.irs.gov/forms-pubs/about-form-w-8-ben-e',
        filingMode: 'Manual Physical Submission with Bank/Auditor'
      },
      {
        formNumber: 'Instructions W-8BEN-E',
        formName: 'IRS Official Instructions for Form W-8BEN-E (Detailed Line-by-Line Guide)',
        officialFormUrl: 'https://www.irs.gov/pub/irs-pdf/iw8bene.pdf',
        submissionPortalName: 'IRS Official Tax Publications',
        submissionPortalUrl: 'https://www.irs.gov',
        filingMode: 'Manual Physical Submission with Bank/Auditor'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'International tax CPA or attorney review recommended for complex Chapter 4 FATCA status determinations (e.g., FFI vs NFFE) and Limitation on Benefits (LOB) clauses.',
      bankRequired: false,
      bankRoleDescription: 'U.S. withholding agent’s bank cross-checks W-8BEN-E before releasing full unwithheld invoice funds.',
      customsBrokerRequired: false,
      otherThirdParty: 'Tax Residency Certificate (TRC) issued by home country revenue ministry to corroborate treaty claim.'
    },
    exemptions: [
      'Individuals complete Form W-8BEN (not W-8BEN-E).',
      'Foreign governments, international organizations, and foreign central banks use Form W-8EXP.',
      'Foreign entities with effectively connected income (ECI) to a U.S. branch use Form W-8ECI.'
    ],
    penaltiesForNonCompliance: 'Mandatory 30% flat withholding deducted from gross invoice payment; withholding agent is personally liable under IRC § 1461 for unpaid taxes plus penalties.',
    statuteCitation: 'Internal Revenue Code (Title 26 U.S.C.) Sections 1441, 1442, 1471, 1472 and Treasury Regulations § 1.1441-1 through § 1.1441-7.'
  },
  {
    id: 'GLOBAL_TAX_RESIDENCY_CERT',
    title: 'Global: Tax Residency Certificate (TRC) & Treaty Relief Certification (Form 10F / DTAA Protection)',
    type: 'Services Export',
    countryCode: 'GLOBAL',
    countryName: 'Worldwide (All Sovereign Nations with DTAA Treaties)',
    jurisdictionScope: 'Global / Multilateral',
    issuingAuthority: 'Sovereign National Revenue Authority (IRS in US, HMRC in UK, CBDT in India, CRA in Canada, FTA in France)',
    authorityUrl: 'https://www.oecd.org/tax/beps/',
    isMandatory: true,
    validity: 'Valid for the tax year or financial year for which it is issued (annual issuance)',
    processingTimeline: '1 to 4 weeks depending on national revenue service issuance speed',
    governmentFees: 'Nominal or free depending on country (e.g. $85 IRS Form 8802/6166 fee; £0 for HMRC certificate)',
    overview: 'Whenever an enterprise exports services cross-border and wishes to avoid foreign withholding tax in the client’s country under a bilateral Double Taxation Avoidance Agreement (DTAA), the client’s tax authorities require a government-issued Tax Residency Certificate (TRC). In jurisdictions like India, an electronic Form 10F self-declaration must also be filed on the national tax portal alongside the TRC.',
    stepByStepInstructions: [
      '1. File an application with your domestic tax authority for a Tax Residency Certificate covering the specified tax year (e.g., IRS Form 8802 in the US to obtain Form 6166, or HMRC online portal in the UK).',
      '2. Specify the counterparty treaty country (e.g. India, Germany, Japan, Singapore) and certify that your entity is a resident liable to tax in your home country.',
      '3. Receive the certified TRC bearing the official stamp, QR code, or digital cryptographic signature of the revenue authority.',
      '4. If transacting with Indian clients: log in to the Indian Income Tax Portal (e-Filing) under non-PAN / PAN non-resident category, upload TRC, and generate electronic Form 10F.',
      '5. Transmit the official TRC, Form 10F, and No Permanent Establishment (No-PE) declaration letter to the overseas client’s accounts payable department before invoice payment.',
      '6. Client’s bank applies 0% or reduced withholding tax (e.g., 5-10% treaty rate instead of 20-30% statutory domestic rate).'
    ],
    officialForms: [
      {
        formNumber: 'IRS Form 8802 / 6166',
        formName: 'Application for United States Residency Certification (Form 6166)',
        officialFormUrl: 'https://www.irs.gov/forms-pubs/about-form-8802',
        submissionPortalName: 'IRS Philadelphia Processing Center / Pay.gov',
        submissionPortalUrl: 'https://www.pay.gov',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'Indian Form 10F',
        formName: 'Information to be Furnished for Availing Relief under DTAA (Section 90/90A)',
        officialFormUrl: 'https://www.incometax.gov.in/iec/foportal/help/statutory-forms/form-10f',
        submissionPortalName: 'Income Tax Department India e-Filing Portal',
        submissionPortalUrl: 'https://www.incometax.gov.in',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Chartered Accountant or CPA verification if financial accounts need to be submitted with residency petition.',
      bankRequired: true,
      bankRoleDescription: 'Client’s Authorized Dealer bank inspects TRC authenticity before permitting outbound wire without statutory withholding tax.',
      customsBrokerRequired: false,
      otherThirdParty: 'Embassy / Apostille legalisation may be required if treaty countries are non-Hague Apostille convention signatories.'
    },
    exemptions: [
      'Domestic transactions within the same country.',
      'Transactions where statutory domestic withholding is 0% (e.g., EU Interest & Royalties Directive for qualified associated companies).'
    ],
    penaltiesForNonCompliance: 'Client is legally compelled by domestic law to deduct full 20% to 30% withholding tax; cash flow lost for months/years until claiming foreign tax credit (FTC).',
    statuteCitation: 'OECD Model Tax Convention on Income and on Capital (Article 4 - Resident) and bilateral Double Taxation Treaties.'
  },

  // =========================================================================
  // 6. UNITED STATES — FDA PRIOR NOTICE & FOOD FACILITY REGISTRATION
  // =========================================================================
  {
    id: 'US_FDA_PRIOR_NOTICE',
    title: 'United States: FDA Prior Notice of Imported Food & Foreign Facility Registration',
    type: 'Goods Import',
    countryCode: 'US',
    countryName: 'United States',
    jurisdictionScope: 'National',
    issuingAuthority: 'U.S. Food and Drug Administration (FDA) / Department of Health and Human Services',
    authorityUrl: 'https://www.fda.gov',
    isMandatory: true,
    validity: 'Prior Notice per shipment; Facility registration biennial renewal (even-numbered years)',
    processingTimeline: 'Electronic instant receipt (Confirmation Number PN issued in seconds); submitted 2 to 8 hours prior to port arrival',
    governmentFees: '$0 FDA filing fee (No fee for registration or Prior Notice submission)',
    overview: 'Under the Public Health Security and Bioterrorism Preparedness and Response Act of 2002 and the Food Safety Modernization Act (FSMA), all food, beverages, dietary supplements, and animal feed imported into the U.S. require electronic Prior Notice before arrival at the border, plus valid FDA Foreign Food Facility Registration Number (FFRN) and Unique Facility Identifier (UFI / DUNS Number).',
    stepByStepInstructions: [
      '1. Obtain a DUNS Number (Data Universal Numbering System) from Dun & Bradstreet corresponding to the exact foreign manufacturing facility address.',
      '2. Appoint a U.S. Agent (person or entity located in the US who serves as communication link with FDA).',
      '3. Complete the FDA Food Facility Registration (FFR) online on the FDA Unified Registration and Listing Systems (FURLS).',
      '4. Prior to physical shipment arrival (at least 2 hours before arrival by land, 4 hours by air/rail, or 8 hours by water vessel), submit Prior Notice via FDA Prior Notice System Interface (PNSI) or CBP Automated Broker Interface (ABI).',
      '5. Receive the 12-digit Prior Notice (PN) Confirmation Number from FDA.',
      '6. Transmit the PN Confirmation Number to the carrier or shipping line to print on shipping documents and manifest.'
    ],
    officialForms: [
      {
        formNumber: 'FDA Form 3537',
        formName: 'Food Facility Registration Form',
        officialFormUrl: 'https://www.fda.gov/food/guidance-regulation-food-and-dietary-supplements/food-facility-registration-user-guide-step-step-instructions',
        submissionPortalName: 'FDA Industry Systems (FURLS / FIS Portal)',
        submissionPortalUrl: 'https://www.access.fda.gov',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'Prior Notice PNSI',
        formName: 'Electronic Prior Notice of Imported Food Confirmation Filing',
        officialFormUrl: 'https://www.fda.gov/food/importing-food-products-united-states/prior-notice-imported-foods',
        submissionPortalName: 'FDA PNSI Portal / CBP ACE ABI',
        submissionPortalUrl: 'https://www.access.fda.gov',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Qualified Food Safety Auditor required for Foreign Supplier Verification Programs (FSVP) audits under 21 CFR Part 1 Subpart L.',
      bankRequired: false,
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'Licensed Customs Broker transmits FDA Partner Government Agency (PGA) dataset concurrently through CBP ACE.',
      otherThirdParty: 'Mandatory U.S. Agent residing in the United States or maintaining a business establishment in the U.S. to receive official FDA inspectoral notices.'
    },
    exemptions: [
      'Food carried by an individual for personal consumption in personal baggage.',
      'Meat, poultry, and egg products exclusively under USDA Food Safety and Inspection Service (FSIS) jurisdiction (cleared via USDA e-Recall/PHIS).'
    ],
    penaltiesForNonCompliance: 'Immediate refusal of admission at the port of entry; goods held at border storage at importer expense; civil injunctions and criminal prosecution under Section 301 of FD&C Act.',
    statuteCitation: 'Federal Food, Drug, and Cosmetic Act (21 U.S.C. §§ 381, 350d) and Title 21 Code of Federal Regulations (21 CFR Part 1 Subpart H & I).'
  },

  // =========================================================================
  // 7. EUROPEAN UNION — CE CONFORMITY & DECLARATION OF CONFORMITY (DOC)
  // =========================================================================
  {
    id: 'EU_CE_CONFORMITY_DOC',
    title: 'European Union: CE Marking Conformity & EU Declaration of Conformity (DoC)',
    type: 'Goods Import',
    countryCode: 'EU',
    countryName: 'European Union',
    jurisdictionScope: 'Regional (EU)',
    issuingAuthority: 'European Commission (DG GROW) & EU Market Surveillance Authorities',
    authorityUrl: 'https://single-market-economy.ec.europa.eu/single-market/ce-marking_en',
    isMandatory: true,
    validity: 'Valid as long as product design and referenced harmonized standards remain unchanged (up to 10 years technical dossier retention)',
    processingTimeline: '1 to 6 weeks depending on product testing and Notified Body involvement',
    governmentFees: '€0 European Commission fee; accredited testing laboratory / Notified Body fees apply',
    overview: 'Industrial products, electronics, electrical equipment (LVD/EMC/RoHS), telecommunications/radio equipment (RED), machinery, toys, and medical devices imported into the European Single Market must meet essential safety and environmental requirements, bear the CE Mark, and be accompanied by an EU Declaration of Conformity signed by the manufacturer or their EU Authorized Representative.',
    stepByStepInstructions: [
      '1. Identify the applicable EU Directives / Regulations (e.g., Low Voltage Directive 2014/35/EU, EMC Directive 2014/30/EU, Radio Equipment Directive 2014/53/EU, RoHS 2011/65/EU).',
      '2. Verify product-specific requirements and identify the applicable European Harmonized Standards (EN standards) published in the Official Journal of the EU.',
      '3. Determine whether an independent conformity assessment by an accredited EU Notified Body is required (mandatory for high-risk equipment, medical devices, wireless RF transmitter modules).',
      '4. Compile the comprehensive Technical File (Technical Documentation) including circuit schematics, bill of materials, test reports, and risk assessments.',
      '5. Draft and sign the official EU Declaration of Conformity (DoC) stating conformity with all applied directives and standards.',
      '6. Affix the CE Mark visibly, legibly, and indelibly to the product or its data plate (minimum height 5 mm), accompanied by the 4-digit Notified Body ID if applicable.',
      '7. Appoint an EU Authorized Economic Operator (EU Responsible Person under Market Surveillance Regulation (EU) 2019/1020) whose name and EU address appear on the packaging.'
    ],
    officialForms: [
      {
        formNumber: 'EU DoC Model',
        formName: 'EU Declaration of Conformity Model Template (Annex III Decision 768/2008/EC)',
        officialFormUrl: 'https://single-market-economy.ec.europa.eu/single-market/ce-marking/manufacturers_en',
        submissionPortalName: 'Manufacturer Technical Dossier / ICSMS Market Surveillance Portal',
        submissionPortalUrl: 'https://ec.europa.eu/growth/tools-databases/nando/',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Quality management system auditor (ISO 9001 / ISO 13485) required for Module D/E production quality assurance.',
      bankRequired: false,
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'Customs agent inputs TARIC conformity certificates and CE documentation indicator codes in SAD Box 44.',
      otherThirdParty: 'Accredited EU Notified Body (listed on European Commission NANDO database) for third-party type examination certificates, and mandatory EU Responsible Person established in the EU.'
    },
    exemptions: [
      'Products not covered by any EU CE marking directives (e.g. basic textiles, raw commodities, books).',
      'Prototypes and unmarketed trade-fair exhibition units with clear labeling indicating not for commercial sale.'
    ],
    penaltiesForNonCompliance: 'Border customs seizure; mandatory EU-wide recall published on Safety Gate (RAPEX); destruction of goods; fines up to €500,000 per violation under national member state legislation (e.g. ProdSG in Germany).',
    statuteCitation: 'Regulation (EC) No 765/2008, Decision No 768/2008/EC, and Regulation (EU) 2019/1020 on market surveillance and compliance of products.'
  },

  // =========================================================================
  // 8. EUROPEAN UNION — CBAM CARBON BORDER ADJUSTMENT MECHANISM
  // =========================================================================
  {
    id: 'EU_CBAM_TRANSITIONAL_REGISTRY',
    title: 'European Union: Carbon Border Adjustment Mechanism (CBAM) Registry Clearance',
    type: 'Goods Import',
    countryCode: 'EU',
    countryName: 'European Union',
    jurisdictionScope: 'Regional (EU)',
    issuingAuthority: 'European Commission (DG CLIMA) & Member State National Competent Authorities (NCAs)',
    authorityUrl: 'https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en',
    isMandatory: true,
    validity: 'Quarterly compliance filing during transitional period (full financial obligation begins 2026)',
    processingTimeline: 'Quarterly report due within 1 month after end of each calendar quarter',
    governmentFees: '€0 during transitional phase; CBAM certificates surrender fee begins 2026 based on EU ETS carbon price',
    overview: 'Under Regulation (EU) 2023/956, importers of carbon-intensive goods in six target sectors—Iron & Steel, Aluminium, Cement, Fertilizers, Hydrogen, and Electricity—must register in the CBAM Transitional Registry and report embedded direct and indirect greenhouse gas emissions incorporated in imported products.',
    stepByStepInstructions: [
      '1. Verify if the imported product’s 8-digit CN / HS code falls under Annex I of Regulation (EU) 2023/956 (e.g. 7208-7229 Steel, 7601-7608 Aluminium).',
      '2. Apply for access to the CBAM Transitional Registry through the National Competent Authority (NCA) of the EU Member State of establishment.',
      '3. Collect verified emissions data from the overseas manufacturing installation (using the official European Commission CBAM Communication Template).',
      '4. Compile direct emissions (Scope 1) and indirect emissions (Scope 2 from electricity consumed during production) in tonnes of CO2 equivalent per tonne of product.',
      '5. Submit the electronic quarterly CBAM report on the European Commission CBAM Registry by the last day of the month following the quarter.',
      '6. Prepare for full regime (2026 onwards): purchase and surrender CBAM certificates matching embedded carbon emissions minus carbon price already paid in country of origin.'
    ],
    officialForms: [
      {
        formNumber: 'CBAM Quarterly Report',
        formName: 'CBAM Transitional Electronic Declaration',
        officialFormUrl: 'https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en',
        submissionPortalName: 'European Commission CBAM Transitional Registry Portal',
        submissionPortalUrl: 'https://cbam.ec.europa.eu',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: true,
      auditorRoleDescription: 'Accredited Environmental Verifier (under EU ETS rules) mandatory starting 2026 to verify emission reports.',
      bankRequired: false,
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'Indirect Customs Representative must act as the reporting declarant if importer is non-EU established.',
      otherThirdParty: 'Installation operator in country of origin providing primary industrial greenhouse gas data.'
    },
    exemptions: [
      'Consignments with an intrinsic value not exceeding €150 per consignment.',
      'Goods originating in Iceland, Liechtenstein, Norway, or Switzerland (covered by EU ETS or linked systems).'
    ],
    penaltiesForNonCompliance: 'Penalties between €10 and €50 per tonne of unreported emissions under Article 16 of Regulation (EU) 2023/956; revocation of import clearance authorization.',
    statuteCitation: 'Regulation (EU) 2023/956 of the European Parliament and of the Council and Commission Implementing Regulation (EU) 2023/1773.'
  },

  // =========================================================================
  // 9. INDIA — BIS COMPULSORY REGISTRATION SCHEME (CRS)
  // =========================================================================
  {
    id: 'IN_BIS_CRS_REGISTRATION',
    title: 'India: BIS Compulsory Registration Scheme (CRS) for Electronics & IT Products',
    type: 'Goods Import',
    countryCode: 'IN',
    countryName: 'India',
    jurisdictionScope: 'National',
    issuingAuthority: 'Bureau of Indian Standards (BIS) / Ministry of Consumer Affairs, Food & Public Distribution',
    authorityUrl: 'https://www.crsbis.in',
    isMandatory: true,
    validity: 'Valid for 2 years (renewable indefinitely in 2 to 5 year blocks)',
    processingTimeline: '15 to 20 business days upon receipt of accredited lab test report',
    governmentFees: '₹53,000 INR (~$640 USD) statutory application fee per manufacturing location per product category',
    overview: 'Under the Electronics and Information Technology Goods (Requirements for Compulsory Registration) Order, manufacturers and importers of electronic goods, laptops, tablets, mobile phones, servers, power adapters, LED luminaires, and lithium-ion batteries cannot clear Indian customs without a valid BIS Registration Number and Standard Mark printed on the product packaging.',
    stepByStepInstructions: [
      '1. Foreign manufacturers must appoint an Authorized Indian Representative (AIR) who is an Indian resident or an incorporated Indian subsidiary.',
      '2. Submit test samples of the product to a BIS-recognized testing laboratory in India (e.g. NABL-accredited test lab).',
      '3. The laboratory conducts electrical safety and electromagnetic compliance testing against Indian Standards (e.g. IS 13252 Part 1 for IT equipment, IS 16046 for batteries) and issues a Test Report.',
      '4. Create an account on the BIS CRS portal (crsbis.in) using the AIR digital signature.',
      '5. Upload the formal Test Report, manufacturing facility business license, ISO 9001 certificate, AIR undertaking, and pay statutory fees.',
      '6. BIS reviews the application and grants an R-number (Registration Number, e.g. R-41000000).',
      '7. Print the official BIS Standard Mark and R-number on the product rating plate and packaging before customs clearance.'
    ],
    officialForms: [
      {
        formNumber: 'Form VI (CRS Application)',
        formName: 'Application for Grant of Licence / Registration under Compulsory Registration Scheme',
        officialFormUrl: 'https://www.crsbis.in/BIS/app-process.do',
        submissionPortalName: 'BIS Compulsory Registration Portal (crsbis.in)',
        submissionPortalUrl: 'https://www.crsbis.in',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      bankRequired: true,
      bankRoleDescription: 'Online payment gateway or NEFT/RTGS to Bureau of Indian Standards account.',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'Customs broker declares BIS Registration R-number in Bill of Entry on ICEGATE.',
      otherThirdParty: 'NABL-accredited and BIS-recognized Testing Laboratory in India to conduct product safety testing; Authorized Indian Representative (AIR).'
    },
    exemptions: [
      'Samples imported for testing and evaluation purposes (up to 100 units per model) under DGFT sample exemption with customs bond.',
      'Defense and aerospace equipment exclusively imported for Ministry of Defence.'
    ],
    penaltiesForNonCompliance: 'Customs border detention under Section 11 of Customs Act 1962; mandatory re-export or destruction at importer expense; prosecution under Section 29 of BIS Act 2016.',
    statuteCitation: 'Bureau of Indian Standards Act 2016 (Section 16, 17) and CRO Orders under MeitY / Ministry of Power.'
  },

  // =========================================================================
  // 10. UNITED STATES & MARITIME — ISF (10+2) & OCEAN FREIGHT FORWARDER
  // =========================================================================
  {
    id: 'US_CBP_ISF_FREIGHT_FORWARDER',
    title: 'United States & Maritime: Importer Security Filing (ISF "10+2") & Ocean Bill of Lading (B/L)',
    type: 'Goods Import',
    countryCode: 'US',
    countryName: 'United States',
    jurisdictionScope: 'National',
    issuingAuthority: 'U.S. Customs and Border Protection (CBP) / National Targeting Center',
    authorityUrl: 'https://www.cbp.gov/border-security/ports-entry/cargo-security/importer-security-filing-102',
    isMandatory: true,
    validity: 'Per maritime vessel container shipment',
    processingTimeline: 'Must be filed at least 24 hours BEFORE cargo is laden aboard the vessel at foreign port',
    governmentFees: '$0 statutory filing fee; Freight forwarder / filer transmission fee applies ($35 - $75 USD)',
    overview: 'Under Section 203 of the SAFE Port Act and 19 CFR Part 149, maritime cargo destined for the United States cannot be physically loaded aboard a container vessel without an electronic Importer Security Filing (ISF "10+2") lodged with CBP. Ten data elements are submitted by the importer/forwarder and two by the ocean carrier (Vessel Stow Plan & Container Status Messages).',
    stepByStepInstructions: [
      '1. Coordinate with foreign manufacturer/supplier to obtain: Seller, Buyer, Importer of Record Number, Consignee Number, Manufacturer/Supplier, Ship to Party, Country of Origin, and Commodity HTS-6 Code.',
      '2. Coordinate with ocean freight forwarder / NVOCC to obtain: Container Stuffing Location and Consolidator (Stuffer) Name/Address.',
      '3. Transmit the 10 data elements electronically through the Automated Broker Interface (ABI) or Vessel Automated Manifest System (AMS) at least 24 hours prior to container vessel loading.',
      '4. Obtain the CBP ISF Transaction Number and Match Status against the carrier’s Bill of Lading (AMS Bill Number).',
      '5. Ocean carrier verifies ISF match confirmation before issuing clearance to crane operators to load the container aboard.',
      '6. Retain ISF transmission timestamp confirmation for 5 years under 19 CFR § 149.5.'
    ],
    officialForms: [
      {
        formNumber: 'CBP ISF-10',
        formName: 'Importer Security Filing (10 Data Elements Electronic Transmission)',
        officialFormUrl: 'https://www.cbp.gov/document/guidance/isf-10-instructions',
        submissionPortalName: 'CBP Automated Broker Interface (ABI) / ACE',
        submissionPortalUrl: 'https://www.cbp.gov/trade/automated',
        filingMode: 'EDI / Broker Electronic Filing'
      },
      {
        formNumber: 'Ocean Bill of Lading',
        formName: 'Master / House Ocean Bill of Lading (B/L or Sea Waybill)',
        officialFormUrl: 'https://www.fmc.gov',
        submissionPortalName: 'Carrier Automated Manifest System (AMS)',
        submissionPortalUrl: 'https://www.cbp.gov/trade/ace',
        filingMode: 'EDI / Broker Electronic Filing'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      bankRequired: false,
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'Licensed Customs Broker or certified ISF service center transmits ISF-10 into CBP ACE ABI.',
      otherThirdParty: 'Ocean Freight Forwarder / NVOCC (Non-Vessel Operating Common Carrier) licensed by Federal Maritime Commission (FMC); Ocean Carrier lodging 2 carrier manifest elements.',
      entities: [
        {
          category: 'Freight Forwarder & Carrier (NVOCC)',
          name: 'FMC-Licensed Ocean Freight Forwarder / NVOCC & Container Carrier',
          isMandatory: true,
          legalMandate: 'SAFE Port Act of 2006 (6 U.S.C. § 943) and 19 CFR Part 149 (Importer Security Filing)',
          roleDescription: 'Transmits House Bill of Lading, validates container stuffing location, provides AMS bill number, and files Container Status Messages with CBP.',
          formsProduced: ['Master Bill of Lading (MBL)', 'House Bill of Lading (HBL)', 'ISF Confirmation Receipt with CBP Matching Code'],
          officialDirectoryUrl: 'https://www.fmc.gov/resources-services/oti-list/',
          directoryName: 'Federal Maritime Commission (FMC) Ocean Transportation Intermediaries Directory'
        },
        {
          category: 'Surety Bond Underwriter & Trade Insurer',
          name: 'Treasury-Approved Surety Bond Company',
          isMandatory: true,
          legalMandate: '19 CFR § 149.2 and 19 CFR Part 113 (Appendix D - ISF Bond)',
          roleDescription: 'Underwrites the continuous customs bond (or standalone ISF Single Transaction Bond) guaranteeing CBP against $5,000 liquidated damages per violation.',
          formsProduced: ['CBP Form 301 (Continuous Customs Bond)', 'Appendix D ISF Bond Rider'],
          officialDirectoryUrl: 'https://www.fiscal.treasury.gov/surety-bonds/list-certified-companies.html',
          directoryName: 'U.S. Bureau of the Fiscal Service Circular 570 (Companies Holding Certificates of Authority)'
        }
      ]
    },
    exemptions: [
      'Cargo arriving by air, rail, or truck (only maritime sea vessel cargo is subject to ISF 10+2).',
      'U.S. military cargo and bulk commodities (e.g. oil tankers, grain bulk carriers) exempt from 24-hour advance container filing.'
    ],
    penaltiesForNonCompliance: 'Liquidated damages of $5,000 USD per violation up to $10,000 per shipment under 19 CFR § 149.6; "Do Not Load" (DNL) order issued to foreign port container terminal; physical cargo seizure at destination.',
    statuteCitation: 'Security and Accountability For Every Port Act of 2006 (SAFE Port Act, P.L. 109-347) and 19 CFR Part 149.'
  },

  // =========================================================================
  // 11. GLOBAL — CHAMBER OF COMMERCE CERTIFICATE OF ORIGIN (COO)
  // =========================================================================
  {
    id: 'GLOBAL_CHAMBER_CERTIFICATE_ORIGIN',
    title: 'Global & Bilateral FTAs: Certificate of Origin (COO) & Chamber of Commerce Legalization',
    type: 'Goods Export',
    countryCode: 'GLOBAL',
    countryName: 'Worldwide (All Sovereign Nations & Free Trade Agreements)',
    jurisdictionScope: 'Global / Multilateral',
    issuingAuthority: 'National Chamber of Commerce & Industry / Designated Export Promotion Agency / Customs Administration',
    authorityUrl: 'https://iccwbo.org/business-solutions/certificates-of-origin/',
    isMandatory: true,
    validity: 'Per commercial export consignment (valid 12 months from issuance date for customs entry)',
    processingTimeline: 'Same-day to 48 hours via electronic e-COO systems',
    governmentFees: '$15 - $75 USD per certificate depending on chamber membership and legalization tier',
    overview: 'Under WTO Agreement on Rules of Origin and bilateral/multilateral Free Trade Agreements (e.g. USMCA, CPTPP, RCEP, EU-UK TCA, ASEAN FTA, India-UAE CEPA), importing customs authorities require a certified Certificate of Origin to grant preferential 0% or reduced tariff treatment, or to verify country of origin for anti-dumping and quota enforcement.',
    stepByStepInstructions: [
      '1. Determine whether the goods qualify as "Wholly Obtained" or satisfy the "Substantial Transformation" / Product-Specific Rule of Origin (PSR) (Change in Tariff Classification CTC or Regional Value Content RVC calculation).',
      '2. Compile bill of materials (BOM), commercial export invoice, and supplier declarations verifying origin percentages.',
      '3. Submit application online to an authorized local Chamber of Commerce (or designated government agency like DGFT in India, Trade Remedies Authority in UK, DIHK in Germany).',
      '4. The Chamber reviews manufacturing breakdown and stamps the Certificate of Origin with official holographic seal, QR verification code, and signature.',
      '5. For non-Hague Apostille destinations (e.g. UAE, Egypt, Qatar): submit COO to the destination country’s Embassy / Consulate for commercial invoice and COO legalization.',
      '6. Transmit the original certified COO to the foreign importer to claim preferential tariff relief during customs clearance.'
    ],
    officialForms: [
      {
        formNumber: 'ICC International COO',
        formName: 'Standard International Certificate of Origin (Non-Preferential / Preferential Template)',
        officialFormUrl: 'https://iccwbo.org/business-solutions/certificates-of-origin/certificates-of-origin-verification/',
        submissionPortalName: 'ICC World Chambers Federation (WCF) Origin Verification Chain',
        submissionPortalUrl: 'https://certification.iccwbo.org',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'Bilateral FTA COO',
        formName: 'Preferential Certificate of Origin (e.g. Form A-1, CEPA COO, Form E for ASEAN)',
        officialFormUrl: 'https://www.wto.org/english/tratop_e/roi_e/roi_e.htm',
        submissionPortalName: 'National Chamber of Commerce / DGFT e-COO Portal',
        submissionPortalUrl: 'https://coo.dgft.gov.in',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Cost accountant / CA certificate required for complex Regional Value Content (RVC) value-addition calculations under FTAs.',
      bankRequired: false,
      bankRoleDescription: 'Required if Letter of Credit (LC) stipulates original Chamber of Commerce stamped COO in presentation documents.',
      customsBrokerRequired: false,
      otherThirdParty: 'Accredited Chamber of Commerce & Industry; Consular Embassy / Notary Public for legalization in non-Apostille countries.',
      entities: [
        {
          category: 'Chamber of Commerce & Consular Legalization',
          name: 'Authorized Chamber of Commerce & Industry (ICC WCF Accredited)',
          isMandatory: true,
          legalMandate: '1923 Geneva Convention on Simplification of Customs Formalities and WTO Agreement on Rules of Origin',
          roleDescription: 'Certifies the legal origin of manufactured goods, authenticates manufacturer cost declarations, and issues official embossed or digitally signed e-COOs.',
          formsProduced: ['Non-Preferential Certificate of Origin', 'Preferential FTA Certificate of Origin', 'Electronic Certificate of Origin (e-COO) with QR code'],
          officialDirectoryUrl: 'https://iccwbo.org/business-solutions/certificates-of-origin/certificates-of-origin-verification/',
          directoryName: 'ICC World Chambers Federation Certificate of Origin Verification Chain'
        }
      ]
    },
    exemptions: [
      'Commercial consignments valued under low-value thresholds (e.g., $1,000 USD under USMCA where simple invoice origin certification suffices).',
      'Self-certification of origin under modern FTAs (e.g. CPTPP, USMCA, EU-UK TCA) by authorized registered exporters (REX system).'
    ],
    penaltiesForNonCompliance: 'Denial of preferential 0% duty treatment; retroactive assessment of full MFN tariffs plus punitive anti-dumping duties; fine up to 300% of unpaid duties for false origin claims.',
    statuteCitation: 'WTO Agreement on Rules of Origin and 19 U.S.C. § 4531 (USMCA) / Regulation (EU) 2015/2447 (UCC Rules of Origin).'
  },

  // =========================================================================
  // 12. MIDDLE EAST & AFRICA — PRE-SHIPMENT INSPECTION & SASO/SABER (TIC LABS)
  // =========================================================================
  {
    id: 'GLOBAL_PRE_SHIPMENT_INSPECTION_SABER',
    title: 'Middle East & Africa: Pre-Shipment Inspection (PSI) & SASO/SABER Product / Shipment Certificate of Conformity',
    type: 'Goods Export',
    countryCode: 'SA',
    countryName: 'Saudi Arabia & Gulf Cooperation Council (GCC)',
    jurisdictionScope: 'Regional (EU)',
    issuingAuthority: 'Saudi Standards, Metrology and Quality Organization (SASO) & GCC Standardization Organization (GSO)',
    authorityUrl: 'https://saber.sa',
    isMandatory: true,
    validity: 'Product Certificate valid 1 year; Shipment Certificate valid per consignment',
    processingTimeline: '3 to 10 business days including laboratory testing and physical container inspection',
    governmentFees: '500 SAR (~$133 USD) for Product Certificate + 350 SAR (~$93 USD) for Shipment Certificate + Inspection Lab fee',
    overview: 'Under the Saudi Product Safety Program (SALEEM), any enterprise exporting consumer goods, electronics, chemicals, building materials, or auto parts to Saudi Arabia must process conformity through the SABER electronic portal. A mandatory third-party Accredited Conformity Assessment Body (CAB) must test the product, audit the technical file, and issue a Certificate of Conformity (PCoC and SCoC) without which Saudi Customs (ZATCA) will refuse entry.',
    stepByStepInstructions: [
      '1. Importer registers the product on SABER (saber.sa) with 8-digit Saudi HS code and selects an accredited Conformity Assessment Body (e.g. SGS, Intertek, Bureau Veritas, TÜV Rheinland).',
      '2. Exporter submits product test reports from an ISO/IEC 17025 accredited laboratory proving conformity with SASO Technical Regulations.',
      '3. The appointed Conformity Assessment Body reviews test results, inspects factory quality certificates, and issues the electronic Product Certificate of Conformity (PCoC) via SABER.',
      '4. Once shipment is packed, exporter submits commercial invoice, packing list, and bill of lading on SABER to request the Shipment Certificate of Conformity (SCoC).',
      '5. The Conformity Assessment Body conducts pre-shipment physical inspection or container seal verification if mandated.',
      '6. SABER automatically transmits the approved SCoC to Saudi Customs Fasah EDI platform, unlocking port clearance.'
    ],
    officialForms: [
      {
        formNumber: 'SABER PCoC',
        formName: 'Product Certificate of Conformity (PCoC via SABER)',
        officialFormUrl: 'https://saber.sa/home/about',
        submissionPortalName: 'SABER Electronic Platform (saber.sa)',
        submissionPortalUrl: 'https://saber.sa',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'SABER SCoC',
        formName: 'Shipment Certificate of Conformity (SCoC for Customs Port Release)',
        officialFormUrl: 'https://saber.sa',
        submissionPortalName: 'Fasah Saudi Customs Unified Window',
        submissionPortalUrl: 'https://www.fasah.sa',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      bankRequired: true,
      bankRoleDescription: 'Payment via MADA / SADAD Saudi banking system for SABER government fee settlement.',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'Licensed Saudi Customs Broker clears consignment on Fasah customs portal using SABER SCoC barcode.',
      otherThirdParty: 'Mandatory Accredited Conformity Assessment Body (CAB / TIC Inspection Agency: SGS, Intertek, Bureau Veritas, TÜV SÜD) accredited by SASO.',
      entities: [
        {
          category: 'Accredited Testing Lab / Notified Body (TIC)',
          name: 'SASO-Accredited Conformity Assessment Body (CAB) / TIC Inspection Agency (e.g. SGS, Intertek, Bureau Veritas, TÜV)',
          isMandatory: true,
          legalMandate: 'Saudi Product Safety Program (SALEEM) and SASO Technical Regulations',
          roleDescription: 'Conducts laboratory testing against Saudi national standards (SASO/GSO), performs factory audit, inspects container packing, and digitally approves PCoC and SCoC on SABER.',
          formsProduced: ['Product Certificate of Conformity (PCoC)', 'Shipment Certificate of Conformity (SCoC)', 'ISO/IEC 17025 Accredited Test Report'],
          officialDirectoryUrl: 'https://saber.sa',
          directoryName: 'SABER List of Authorized Conformity Assessment Bodies'
        }
      ]
    },
    exemptions: [
      'Non-regulated products (general consumer goods without specific technical regulation) can obtain a self-declaration on SABER without lab testing.',
      'Personal effects, diplomatic cargo, and transit goods passing through Saudi ports.'
    ],
    penaltiesForNonCompliance: 'Complete rejection and re-export of goods at exporter expense; customs fine of 50,000 SAR (~$13,300 USD); permanent blacklisting of foreign manufacturer on SABER.',
    statuteCitation: 'Saudi Royal Decree No. M/14 on Metrology and Quality and SASO SALEEM Technical Regulations.'
  },

  // =========================================================================
  // 13. GLOBAL & SERVICES — TRANSFER PRICING & STATUTORY TAX AUDIT (FORM 3CEB)
  // =========================================================================
  {
    id: 'GLOBAL_TRANSFER_PRICING_AUDITOR',
    title: 'Global & Services: Cross-Border Related-Party Transfer Pricing & Statutory Audit (Form 3CEB / OECD BEPS)',
    type: 'Services Export',
    countryCode: 'GLOBAL',
    countryName: 'Worldwide (OECD BEPS Action 13 & Bilateral Transfer Pricing Regimes)',
    jurisdictionScope: 'Global / Multilateral',
    issuingAuthority: 'Sovereign Tax Authority (IRS in US, CBDT in India, HMRC in UK, CRA in Canada, ATO in Australia)',
    authorityUrl: 'https://www.oecd.org/tax/beps/beps-actions/action13/',
    isMandatory: true,
    validity: 'Annual statutory audit and filing for every financial/tax year',
    processingTimeline: '1 to 2 months for transfer pricing study, benchmarking search, and accountant audit',
    governmentFees: '$0 government fee; Independent accounting firm audit fees apply ($3,000 - $25,000 USD)',
    overview: 'Under OECD Transfer Pricing Guidelines and domestic tax statutes (e.g. Section 92E of the Indian Income-tax Act, IRC § 482 / § 6662(e) in the U.S., Part 4 TIOPA 2010 in the UK), any cross-border export or import of software, SaaS, management fees, intellectual property (IP), or technical services between associated enterprises (subsidiaries, parent companies, sister entities) must comply with the Arm’s Length Principle and be audited by an independent Chartered Accountant / CPA.',
    stepByStepInstructions: [
      '1. Identify all cross-border related-party international transactions (e.g. software development fees, SaaS revenue sharing, royalties, cost-contribution arrangements).',
      '2. Select the most appropriate Transfer Pricing Method (TNMM, CUP, Cost Plus, Resale Price, or Profit Split Method) under OECD Guidelines.',
      '3. Conduct an economic benchmarking study using commercial databases (Prowess, Capitaline, Orbis, Compustat) to establish the arm’s length operating margin range (interquartile range 35th to 65th percentile).',
      '4. Compile the statutory Transfer Pricing Local File and Group Master File detailing the multinational group structure and value chain.',
      '5. Engage an independent Chartered Accountant (CA) or Certified Public Accountant (CPA) holding no conflict of interest.',
      '6. The CA audits the transaction contracts, invoices, and foreign exchange receipts, digitally signs Form 3CEB (or domestic TP return) generating an official UDIN, and submits to the revenue authority.',
      '7. Retain transfer pricing documentation for 8 years from the end of the relevant assessment year.'
    ],
    officialForms: [
      {
        formNumber: 'Form 3CEB',
        formName: 'Report from an Accountant Relating to International Transactions and Specified Domestic Transactions',
        officialFormUrl: 'https://www.incometax.gov.in/iec/foportal/help/statutory-forms/form-3ceb',
        submissionPortalName: 'Income Tax e-Filing Portal (Accountant Workspace)',
        submissionPortalUrl: 'https://www.incometax.gov.in',
        filingMode: 'Manual Physical Submission with Bank/Auditor'
      },
      {
        formNumber: 'OECD Local File / Form 5472',
        formName: 'Information Return of a 25% Foreign-Owned U.S. Corporation or Foreign Corporation (IRS Form 5472)',
        officialFormUrl: 'https://www.irs.gov/forms-pubs/about-form-5472',
        submissionPortalName: 'IRS Modernized e-File (MeF) / Corporate Tax Return',
        submissionPortalUrl: 'https://www.irs.gov',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: true,
      auditorRoleDescription: 'A practicing Chartered Accountant / CPA MUST independently audit related-party pricing, verify the economic benchmarking search, compute arm’s length markups, and digitally sign the statutory compliance report with an official professional license / UDIN number.',
      bankRequired: true,
      bankRoleDescription: 'Bank records and inward/outward SWIFT remittance advices must be audited to verify transaction realization matches declared transfer pricing values.',
      customsBrokerRequired: false,
      otherThirdParty: 'Benchmarking Database Providers (Bureau van Dijk Orbis, S&P Capital IQ) for arm’s length comparability data.',
      entities: [
        {
          category: 'Chartered Accountant / Auditor / CPA',
          name: 'Independent Chartered Accountant / Certified Public Accountant (Fellow of ICAI / AICPA)',
          isMandatory: true,
          legalMandate: 'Section 92E of Income-tax Act 1961, IRC § 482, and OECD BEPS Action 13',
          roleDescription: 'Performs functional, asset, and risk (FAR) analysis, audits economic margins against comparable independent companies, and issues statutory audit certification.',
          formsProduced: ['Form 3CEB Audit Report with UDIN', 'Transfer Pricing Study Local File', 'Economic Benchmarking Search Matrix'],
          officialDirectoryUrl: 'https://udin.icai.org',
          directoryName: 'ICAI Unique Document Identification Number (UDIN) Verification Portal'
        }
      ]
    },
    exemptions: [
      'Transactions between completely unrelated independent third-party commercial enterprises (arm’s length by definition).',
      'Small enterprises with international transactions below statutory thresholds (e.g., ₹1 Crore INR in India, or safe harbour rules under OECD/IRS).'
    ],
    penaltiesForNonCompliance: 'Penalty of ₹100,000 INR under Section 271BA for failure to furnish report; penalty of 2% of the value of international transactions under Section 271AA for failure to maintain TP documentation; 20% to 40% transfer pricing penalty on unpaid tax adjustments under IRC § 6662 in U.S.',
    statuteCitation: 'Section 92C, 92D, 92E of Income-tax Act 1961, 26 U.S. Code § 482, and OECD Transfer Pricing Guidelines for Multinational Enterprises.'
  },

  // =========================================================================
  // 14. CHINA — GACC CIFER SINGLE WINDOW (GOODS IMPORT)
  // =========================================================================
  {
    id: 'CN_GACC_CIFER_SINGLE_WINDOW',
    title: 'China: GACC Decree 248/249 Foreign Facility & Product Registration via CIFER Single Window (海关总署境外生产企业注册)',
    type: 'Goods Import',
    countryCode: 'CN',
    countryName: 'China',
    jurisdictionScope: 'National',
    issuingAuthority: 'General Administration of Customs of the People’s Republic of China (GACC / 中华人民共和国海关总署)',
    authorityUrl: 'http://www.customs.gov.cn',
    isMandatory: true,
    validity: '5 years per approved facility / product registration certificate',
    processingTimeline: '30 to 90 business days depending on competent authority verification',
    governmentFees: 'Free statutory application fee ($0 GACC charge); local verification agency fees may apply',
    overview: 'Under GACC Decrees No. 248 and No. 249, all overseas manufacturing, processing, and storage facilities exporting food, agricultural products, cosmetics, and designated high-risk consumer goods to Mainland China must be formally registered and approved in the China Import Food Enterprise Registration (CIFER) system under the China International Trade Single Window before cargo shipment.',
    stepByStepInstructions: [
      '1. Determine registration category: Category 1 (18 high-risk categories requiring home-country competent authority recommendation, e.g., meat, dairy, seafood) or Category 2 (self-application via CIFER).',
      '2. Create an enterprise user account on the China International Trade Single Window CIFER Portal (cifer.singlewindow.cn).',
      '3. Complete the online overseas manufacturing facility profile, detailing plant layout, HACCP/ISO certifications, water quality reports, and annual production capacity.',
      '4. Upload bilingual (English/Chinese) documentation and receive a unique GACC 18-character Registration Number (中国境内注册编号).',
      '5. Print the approved GACC Registration Number on both the inner packaging and outer shipping cartons of all export merchandise.',
      '6. Transmit the China Customs Import Goods Declaration (进口货物报关单) via the China E-Port / Single Window EDI system citing the valid facility registration code prior to port arrival.'
    ],
    officialForms: [
      {
        formNumber: 'GACC Decree 248 Form',
        formName: 'Application for Registration of Overseas Manufacturer of Imported Food & Goods (境外生产企业注册申请表)',
        officialFormUrl: 'http://www.customs.gov.cn/customs/302249/302266/302267/3622437/index.html',
        submissionPortalName: 'China Import Food Enterprise Registration (CIFER) Portal',
        submissionPortalUrl: 'https://cifer.singlewindow.cn',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'Customs Form 0100',
        formName: 'China Customs Declaration Form for Imported Goods (中华人民共和国海关进口货物报关单)',
        officialFormUrl: 'http://www.customs.gov.cn/customs/302249/302266/302267/index.html',
        submissionPortalName: 'China International Trade Single Window (中国国际贸易单一窗口)',
        submissionPortalUrl: 'https://swapp.singlewindow.cn',
        filingMode: 'EDI / Broker Electronic Filing'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Independent food safety / ISO 22000 auditor certification recommended for Category 1 factory audit dossiers.',
      bankRequired: true,
      bankRoleDescription: 'SAFE-authorized settlement bank verifies cross-border foreign exchange receipts under Enterprise Foreign Exchange Directory (货物贸易外汇收支名录).',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'A licensed Chinese Customs Broker (报关企业) registered on China E-Port with a Customs Declaration Corporate Seal is mandatory to submit the Single Window entry declaration.',
      otherThirdParty: 'CCIC (China Inspection & Certification Group) or GACC-accredited laboratory for pre-shipment quality and quarantine certification.',
      entities: [
        {
          category: 'Licensed Customs Broker (LCB / CHA)',
          name: 'Licensed Chinese Customs Clearance Agent (报关行)',
          isMandatory: true,
          legalMandate: 'Customs Law of the People’s Republic of China (中华人民共和国海关法) Article 10',
          roleDescription: 'Must possess registered customs broker seal and China E-Port IC Card to lodge electronic customs entries.',
          formsProduced: ['China Customs Import Declaration Form (进口货物报关单)', 'Customs Duty & VAT Payment Voucher (海关专用缴款书)'],
          officialDirectoryUrl: 'http://credit.customs.gov.cn',
          directoryName: 'China Customs Enterprise Credit Information Disclosure Platform'
        },
        {
          category: 'In-Country Legal Representative / Resident Agent',
          name: 'Chinese Domestic Consignee / In-Country Agent (境内收货人 / 代理商)',
          isMandatory: true,
          legalMandate: 'GACC Decree No. 249 Article 8 and Food Safety Law Article 94',
          roleDescription: 'Foreign manufacturers without a legal subsidiary in China must appoint a registered domestic commercial consignee to assume legal product liability.',
          formsProduced: ['Domestic Consignee Record-Filing Certificate (收发货人备案证明)', 'Bilingual Label Compliance Attestation'],
          officialDirectoryUrl: 'http://www.customs.gov.cn',
          directoryName: 'GACC Domestic Consignee & Importer Registry'
        }
      ]
    },
    exemptions: [
      'Commercial sample shipments valued under 5,000 RMB without commercial sale intention.',
      'Diplomatic cargo and personal unaccompanied baggage.'
    ],
    penaltiesForNonCompliance: 'Immediate border rejection, mandatory return of cargo or destruction at border customs, confiscation of illegal gains, and fines up to 10 times the consignment value under the PRC Food Safety Law.',
    statuteCitation: 'GACC Decree No. 248 (Provisions on Registration and Administration of Overseas Manufacturers of Imported Food) and Decree No. 249 (Administrative Measures on Import and Export Food Safety).'
  },

  // =========================================================================
  // 15. CHINA — MOFCOM DUAL-USE & SAFE REGISTRY (EXPORT & SERVICES)
  // =========================================================================
  {
    id: 'CN_MOFCOM_DUAL_USE_EXPORT',
    title: 'China: MOFCOM Dual-Use & Strategic Technologies Export License & SAFE Directory Registration (商务部两用物项许可证 / 外汇名录)',
    type: 'Dual-Use & Export Control',
    countryCode: 'CN',
    countryName: 'China',
    jurisdictionScope: 'National',
    issuingAuthority: 'Ministry of Commerce of the PRC (MOFCOM / 商务部) & State Administration of Foreign Exchange (SAFE / 外汇局)',
    authorityUrl: 'http://www.mofcom.gov.cn',
    isMandatory: true,
    validity: 'Up to 1 year for specific export contract licenses, or single shipment clearance',
    processingTimeline: '15 to 45 business days for inter-departmental technical committee review',
    governmentFees: 'Free statutory licensing fee ($0 MOFCOM charge)',
    overview: 'Under the PRC Export Control Law, any cross-border export of dual-use goods, advanced software, artificial intelligence algorithms, supercomputing hardware, rare earths, or cryptographic technology from Mainland China requires an individual Export License issued by MOFCOM. Furthermore, foreign exchange payments can only be settled if the entity is registered in the SAFE Directory of Enterprises with Foreign Exchange Receipts and Payments.',
    stepByStepInstructions: [
      '1. Classify technical parameters of goods/software against the MOFCOM Dual-Use Goods and Technologies Export Control Catalogue (两用物项和技术出口许可证管理目录).',
      '2. Screen destination jurisdiction, foreign buyer, and end-user against China’s Export Control Control List / Unreliable Entity List (不可靠实体清单).',
      '3. Obtain an authentic End-User and End-Use Certificate (最终用户和最终用途证明 - EUC) certified by the destination government or certified notary.',
      '4. File online application via the MOFCOM Unified Administrative Licensing Platform attaching technical specifications and supply contract.',
      '5. Upon inter-ministerial security clearance, download the electronic MOFCOM Dual-Use Export License.',
      '6. Verify that the enterprise holds active Class A rating in the SAFE ASOne system for foreign currency cross-border bank receipts.',
      '7. Submit the Export License Number in the Single Window export customs declaration before cargo loading.'
    ],
    officialForms: [
      {
        formNumber: 'MOFCOM-EXP-01',
        formName: 'Application for Dual-Use Items and Technologies Export License (两用物项和技术出口申请表)',
        officialFormUrl: 'http://egov.mofcom.gov.cn/gzdt/202101/t20210118_3647161.html',
        submissionPortalName: 'MOFCOM Unified Administrative Licensing System',
        submissionPortalUrl: 'http://licenceapp.ec.com.cn',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'SAFE Form 01',
        formName: 'Application for Registration in the Directory of Enterprises with Foreign Exchange Receipts and Payments (货物贸易外汇收支企业名录登记申请表)',
        officialFormUrl: 'http://www.safe.gov.cn/safe/2020/0529/16301.html',
        submissionPortalName: 'SAFE ASOne Cross-Border Capital & Trade Foreign Exchange Platform',
        submissionPortalUrl: 'https://asone.safe.gov.cn',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Statutory audit of export revenue and export VAT refund (出口退税) filings by a Certified Public Accountant (CICPA).',
      bankRequired: true,
      bankRoleDescription: 'Designated Foreign Exchange Authorized Bank conducts electronic verification on SAFE ASOne platform before releasing USD/EUR/CNY funds into corporate account.',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'Customs broker validates MOFCOM License number against electronic single window gateway.',
      otherThirdParty: 'Accredited legal counsel specializing in PRC Export Control Law for commodity jurisdiction.'
    },
    exemptions: [
      'Commercial items not cataloged under the Dual-Use Control List and not destined for embargoed entities.',
      'Temporary overseas exhibition goods under ATA Carnet with re-import guarantee.'
    ],
    penaltiesForNonCompliance: 'Fines up to 20 times the illegal business turnover under PRC Export Control Law Article 34; confiscation of goods; revocation of foreign trade business qualifications; criminal liability for illegal operations.',
    statuteCitation: 'Export Control Law of the People’s Republic of China (中华人民共和国出口管制法) and Regulations on Administration of Export of Dual-Use Items.'
  },

  // =========================================================================
  // 16. JAPAN — NACCS CUSTOMS ENTRY & TARIFF CLEARANCE (GOODS IMPORT)
  // =========================================================================
  {
    id: 'JP_CUSTOMS_NACCS_ENTRY',
    title: 'Japan: Customs NACCS Import/Export Declaration & Tariff Classification (輸入申告書 / 通関手続き)',
    type: 'Goods Import',
    countryCode: 'JP',
    countryName: 'Japan',
    jurisdictionScope: 'National',
    issuingAuthority: 'Japan Customs / Ministry of Finance (財務省関税局) & NACCS Center',
    authorityUrl: 'https://www.customs.go.jp',
    isMandatory: true,
    validity: 'Transaction-specific import clearance permit (輸入許可書 - Yunyu Kyokasho)',
    processingTimeline: 'Immediate automated release (Class 1) to 2-3 business days for document audit/inspection (Class 2/3)',
    governmentFees: 'Standard customs duty according to Japan Customs Tariff Schedule + 10% Consumption Tax (JCT)',
    overview: 'Under the Japanese Customs Act (関税法), any business importing merchandise into Japan must lodge an electronic Import Declaration (輸入申告書) through NACCS (Nippon Automated Cargo and Port Consolidated System). If the importer is a foreign entity without a physical office in Japan, they are legally required under Customs Act Article 95 to appoint an Attorney for Customs Procedures (ACP / 税関事務管理人) to take legal responsibility for duty payments.',
    stepByStepInstructions: [
      '1. Obtain a Japan Customs Corporate Number (税関企業コード) or Japanese Corporate Number (法人番号) from the National Tax Agency.',
      '2. If non-resident foreign enterprise: Formally appoint a Japanese resident Attorney for Customs Procedures (ACP) and file Notification of ACP (税関事務管理人届出書) with the Regional Customs Office.',
      '3. Classify goods according to Japan Harmonized Tariff Schedule (実行関税率表) and verify import restrictions under the Foreign Exchange and Foreign Trade Act.',
      '4. Comply with domestic safety laws: Food Sanitation Act (食品衛生法) notification with Ministry of Health (MHLW) or Electrical Appliance and Material Safety Act (PSE mark) with METI.',
      '5. Engage a licensed Japanese Customs Broker (通関業者) to transmit Form C-5020 (Import Declaration) into NACCS.',
      '6. Remit customs duty, import Consumption Tax (10%), and local consumption tax via Multi-Payment Network or automated bank debits.',
      '7. Customs generates the electronic Import Permit (輸入許可書), releasing cargo from the bonded warehouse (保税蔵置場).'
    ],
    officialForms: [
      {
        formNumber: 'Form C-5020',
        formName: 'Japan Customs Import Declaration Form (輸入申告書 - Yunyu Shinkokusho)',
        officialFormUrl: 'https://www.customs.go.jp/kaigairyoko/c5020.pdf',
        submissionPortalName: 'NACCS (Nippon Automated Cargo and Port Consolidated System)',
        submissionPortalUrl: 'https://www.naccs.jp',
        filingMode: 'EDI / Broker Electronic Filing'
      },
      {
        formNumber: 'Customs Form C-1010',
        formName: 'Notification of Attorney for Customs Procedures (税関事務管理人届出書 - ACP Notification)',
        officialFormUrl: 'https://www.customs.go.jp/zeikan/seido/kaisei_r05/01.pdf',
        submissionPortalName: 'Regional Customs Office (Tokyo/Yokohama/Kobe/Osaka Customs)',
        submissionPortalUrl: 'https://www.customs.go.jp',
        filingMode: 'Manual Physical Submission with Bank/Auditor'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Certified Public Tax Accountant (税理士 - Zeirishi) required for Consumption Tax return filing and tax agent appointment.',
      bankRequired: true,
      bankRoleDescription: 'Authorized foreign exchange bank in Japan settles customs duties and import consumption taxes electronically via Multi-Payment Network (Pay-easy).',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'A licensed Japanese Customs Broker (通関業者) authorized by the Minister of Finance under the Customs Brokerage Act (通関業法) is mandatory for electronic NACCS clearance.',
      otherThirdParty: 'Attorney for Customs Procedures (ACP / 税関事務管理人) legally mandatory for all non-resident importers under Customs Act Article 95.',
      entities: [
        {
          category: 'Licensed Customs Broker (LCB / CHA)',
          name: 'Licensed Japanese Customs Broker (通関業者 - Tsuukan Gyousha)',
          isMandatory: true,
          legalMandate: 'Customs Brokerage Act (通関業法 Act No. 122 of 1965)',
          roleDescription: 'Licensed customs specialist (通関士) verifies classification and transmits import/export declaration in NACCS.',
          formsProduced: ['NACCS Electronic Import Declaration', 'Customs Tax Payment Receipt (納付書)'],
          officialDirectoryUrl: 'https://www.customs.go.jp/zeikan/seido/tsukangyo.htm',
          directoryName: 'Japan Customs Licensed Broker Directory'
        },
        {
          category: 'In-Country Legal Representative / Resident Agent',
          name: 'Attorney for Customs Procedures (ACP / 税関事務管理人)',
          isMandatory: true,
          legalMandate: 'Japan Customs Act (関税法) Article 95',
          roleDescription: 'Legally mandatory resident representative who interfaces with Japan Customs, retains import records, and handles duty assessments on behalf of non-resident importers.',
          formsProduced: ['Form C-1010 (ACP Notification)', 'Customs Audit Response Dossier'],
          officialDirectoryUrl: 'https://www.customs.go.jp',
          directoryName: 'Japan Customs ACP Administration Registry'
        }
      ]
    },
    exemptions: [
      'Low-value consignments with total customs value not exceeding 10,000 JPY (exempt from customs duty and consumption tax under Customs Tariff Act Article 14).',
      'Samples of no commercial value clearly marked as such.'
    ],
    penaltiesForNonCompliance: 'Penalties under Customs Act Article 110: imprisonment up to 10 years or fines up to 10 million JPY (or up to 5 times duty evaded); seizure and forfeiture of undeclared cargo.',
    statuteCitation: 'Japan Customs Act (Act No. 61 of 1954), Customs Tariff Act (Act No. 54 of 1910), and Customs Brokerage Act.'
  },

  // =========================================================================
  // 17. JAPAN — METI SECURITY EXPORT CONTROL (DUAL-USE & SERVICES)
  // =========================================================================
  {
    id: 'JP_METI_SECURITY_EXPORT_CONTROL',
    title: 'Japan: METI Security Export Control License under FEFTA (経済産業省 安全保障貿易管理 / 外為法)',
    type: 'Dual-Use & Export Control',
    countryCode: 'JP',
    countryName: 'Japan',
    jurisdictionScope: 'National',
    issuingAuthority: 'Ministry of Economy, Trade and Industry (METI / 経済産業省) - Security Export Control Policy Division',
    authorityUrl: 'https://www.meti.go.jp/policy/external_economy/trade_control/',
    isMandatory: true,
    validity: 'Single export license: up to 1 year; General Bulk License (一般包括許可): up to 3 years',
    processingTimeline: '3 to 6 weeks for individual license evaluation',
    governmentFees: 'Free of charge ($0 METI statutory filing fee)',
    overview: 'Under the Foreign Exchange and Foreign Trade Act (FEFTA / 外国為替及び外国貿易法), Japan enforces strict export controls over sensitive goods (List Control based on Wassenaar Arrangement) and catch-all controls for dual-use technology, software, and advanced services (e.g. cloud computing, cryptography, semiconductor designs, biotechnology). Transfers to non-residents (including deemed exports within Japan) require METI authorization.',
    stepByStepInstructions: [
      '1. Conduct item classification (該非判定 - Gaihi Hantei) using CISTEC Parameter Sheets against Export Control Order Appended Tables 1 & 2.',
      '2. Verify whether destination country is a Group A country (Whitelisted favored trade nation, e.g., US, UK, Germany, France) or Subject Country.',
      '3. Perform Catch-All End-Use and End-User Screening against METI Foreign End-User List (外国ユーザーリスト).',
      '4. If item falls under List Control or fails catch-all screening, prepare End-Use Certificate (用途確認書) signed by foreign recipient.',
      '5. Lodge electronic license application through the NACCS / METI Security Export Control Electronic Application System.',
      '6. Undergo examination by METI Trade Control Department and receive the Official Export License (輸出許可証).',
      '7. Input Export License Number in customs export declaration before port departure.'
    ],
    officialForms: [
      {
        formNumber: 'METI-EXP-7010',
        formName: 'Application for Export License under Foreign Exchange and Foreign Trade Act (輸出許可・役務取引許可申請書)',
        officialFormUrl: 'https://www.meti.go.jp/policy/external_economy/trade_control/01_seian/04_shinsakijun/shinsa_top.html',
        submissionPortalName: 'NACCS / METI Electronic Trade Application Gateway',
        submissionPortalUrl: 'https://www.naccs.jp',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'CISTEC Parameter Sheet',
        formName: 'Item Classification & Technical Specification Matrix (項目別対比表・パラメータシート)',
        officialFormUrl: 'https://www.cistec.or.jp/service/parameter/',
        submissionPortalName: 'CISTEC Export Control Documentation Service',
        submissionPortalUrl: 'https://www.cistec.or.jp',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Annual internal export control compliance program (CP) audit recommended under METI guidelines.',
      bankRequired: true,
      bankRoleDescription: 'Authorized foreign exchange bank verifies that trade payments do not violate Japan Ministry of Finance sanctions or asset freeze orders.',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'Customs broker cross-checks METI license against physical export manifest.',
      otherThirdParty: 'CISTEC (Center for Information on Security Trade Control) certified compliance specialist for technical parameter classification.'
    },
    exemptions: [
      'Exports to Group A whitelisted countries for non-sensitive commercial equipment under General Bulk License.',
      'Standard mass-market commercial software with public encryption algorithms.'
    ],
    penaltiesForNonCompliance: 'Imprisonment up to 10 years or fines up to 1 billion JPY (or up to 5 times export turnover) under FEFTA Article 69-6; administrative ban on exports up to 3 years.',
    statuteCitation: 'Foreign Exchange and Foreign Trade Act (Act No. 228 of 1949) Articles 25 and 48; Export Trade Control Order (Cabinet Order No. 378 of 1949).'
  },

  // =========================================================================
  // 18. CANADA — CBSA CARM PORTAL & COMMERCIAL ACCOUNTING (GOODS IMPORT)
  // =========================================================================
  {
    id: 'CA_CBSA_CARM_CAD_IMPORT',
    title: 'Canada: CBSA CARM Client Portal, BN9/RM Account & Commercial Accounting Declaration (CAD replaces Form B3)',
    type: 'Goods Import',
    countryCode: 'CA',
    countryName: 'Canada',
    jurisdictionScope: 'National',
    issuingAuthority: 'Canada Border Services Agency (CBSA / ASFC) & Canada Revenue Agency (CRA)',
    authorityUrl: 'https://www.cbsa-asfc.gc.ca',
    isMandatory: true,
    validity: 'Continuous registration on CARM Client Portal with active BN15 import account',
    processingTimeline: 'Instant account setup online; 3 to 10 business days for surety bond posting',
    governmentFees: 'Free CARM portal onboarding ($0 fee); customs duties and 5% federal GST apply at clearance',
    overview: 'Under the CBSA Assessment and Revenue Management (CARM) system, all Canadian resident and Non-Resident Importers (NRI) must register on the CARM Client Portal (CCP) and obtain a 9-digit Business Number with an import/export program identifier (BN9-RM0001). Under CARM Release 2, the historical Form B3-3 is replaced by the electronic Commercial Accounting Declaration (CAD). Importers must post financial security (customs surety bond) to participate in the Release Prior to Payment (RPP) program.',
    stepByStepInstructions: [
      '1. Obtain a CRA 9-digit Business Number (BN9) and register the RM0001 import/export program account.',
      '2. Create a CARM Client Portal (CCP) user account using GCKey or Sign-In Partner at ccp-pcc.cbsa-asfc.gc.ca.',
      '3. Link your individual account to the corporate Business Number and configure Business Account Manager permissions.',
      '4. If utilizing a Canadian Customs Broker: Delegate electronic authority to the broker within the CARM portal.',
      '5. Post financial security for Release Prior to Payment (RPP): obtain a continuous customs bond ($25,000 CAD minimum) or post cash security.',
      '6. File electronic Cargo Release (EDI) prior to border arrival using the Cargo Control Number (CCN) and Transaction Number.',
      '7. Submit the electronic Commercial Accounting Declaration (CAD) within statutory monthly billing cycles and remit duties/GST directly to CBSA.'
    ],
    officialForms: [
      {
        formNumber: 'CBSA CAD',
        formName: 'Commercial Accounting Declaration (CAD - electronic replacement for Form B3-3)',
        officialFormUrl: 'https://www.cbsa-asfc.gc.ca/prog/carm-gcra/menu-eng.html',
        submissionPortalName: 'CARM Client Portal (Portail client de la GCRA)',
        submissionPortalUrl: 'https://ccp-pcc.cbsa-asfc.gc.ca',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'Form BSF844',
        formName: 'Agreement to Maintain Records Elsewhere than in Canada by Non-Resident Importers (NRI)',
        officialFormUrl: 'https://www.cbsa-asfc.gc.ca/publications/forms-formulaires/bsf844-eng.html',
        submissionPortalName: 'CBSA Trade Operations Division',
        submissionPortalUrl: 'https://www.cbsa-asfc.gc.ca',
        filingMode: 'Manual Physical Submission with Bank/Auditor'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Chartered Professional Accountant (CPA Canada) recommended for post-clearance trade compliance audits.',
      bankRequired: true,
      bankRoleDescription: 'Canadian chartered financial institution facilitates direct electronic Pre-Authorized Debit (PAD) for CBSA monthly statement of account.',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'Licensed Canadian Customs Broker authorized via CARM portal to classify Canadian Tariff codes and submit CAD declarations.',
      otherThirdParty: 'Treasury-licensed Canadian Surety Bond Company for RPP continuous financial guarantee ($25,000+ CAD).',
      entities: [
        {
          category: 'Licensed Customs Broker (LCB / CHA)',
          name: 'Licensed Canadian Customs Broker (Courtier en douane)',
          isMandatory: false,
          legalMandate: 'Customs Act (R.S.C., 1985, c. 1 (2nd Supp.)) Section 9 and Customs Brokers Licensing Regulations',
          roleDescription: 'Handles tariff classification under Canadian Customs Tariff and transmits EDI release and CAD entries in CARM.',
          formsProduced: ['Commercial Accounting Declaration (CAD)', 'Cargo Control Document'],
          officialDirectoryUrl: 'https://www.cbsa-asfc.gc.ca/services/cb-cd/cb-list-eng.html',
          directoryName: 'CBSA Licensed Customs Brokers Directory'
        },
        {
          category: 'Surety Bond Underwriter & Trade Insurer',
          name: 'Canadian Surety Association Approved Bonding Underwriter',
          isMandatory: true,
          legalMandate: 'Customs Act Section 17 & CARM Financial Security Rules',
          roleDescription: 'Issues mandatory electronic customs surety bond (minimum $25,000 CAD or 50% of highest monthly duties/taxes) uploaded directly to CARM.',
          formsProduced: ['Electronic Financial Security Agreement (CARM Bond Form)', 'Surety Bond Rider'],
          officialDirectoryUrl: 'https://www.suretycanada.com',
          directoryName: 'Surety Association of Canada Directory'
        }
      ]
    },
    exemptions: [
      'Casual goods or commercial goods valued under $3,300 CAD under the Low Value Shipment (LVS) courier stream (customs duties may still apply).',
      'Duty-free personal exemptions under Customs Tariff Chapter 98.'
    ],
    penaltiesForNonCompliance: 'Administrative Monetary Penalty System (AMPS) penalties ranging from $150 to $25,000 CAD per infraction under Customs Act; revocation of Release Prior to Payment privileges; shipment seizure.',
    statuteCitation: 'Customs Act (R.S.C., 1985, c. 1 (2nd Supp.)), Customs Tariff (S.C. 1997, c. 36), and CARM Regulations.'
  },

  // =========================================================================
  // 19. CANADA — CRA SIMPLIFIED GST/HST FOR DIGITAL SERVICES & SAAS (SERVICES EXPORT)
  // =========================================================================
  {
    id: 'CA_CRA_NON_RESIDENT_GST_HST',
    title: 'Canada: CRA Simplified Non-Resident GST/HST for Cross-Border Digital Services & SaaS (Excise Tax Act Part IX)',
    type: 'Services Export',
    countryCode: 'CA',
    countryName: 'Canada',
    jurisdictionScope: 'National',
    issuingAuthority: 'Canada Revenue Agency (CRA / Agence du revenu du Canada)',
    authorityUrl: 'https://www.canada.ca/en/revenue-agency.html',
    isMandatory: true,
    validity: 'Continuous registration upon crossing $30,000 CAD annual Canadian sales threshold',
    processingTimeline: '1 to 5 business days for online simplified digital economy registration',
    governmentFees: 'Free registration ($0 CRA fee); remits 5% federal GST + provincial components (up to 15% HST)',
    overview: 'Under Part IX of the Excise Tax Act, non-resident businesses that sell digital products, SaaS subscriptions, cloud software, streaming media, or remote consulting services to Canadian retail consumers (B2C) must register under the CRA Simplified GST/HST System if their taxable sales to Canadian consumers exceed $30,000 CAD over any rolling 12-month period.',
    stepByStepInstructions: [
      '1. Track B2C revenue from Canadian subscribers and determine when cumulative sales reach $30,000 CAD.',
      '2. Navigate to the CRA Digital Economy Business Registration Portal at canada.ca.',
      '3. Complete Form GST74 online without needing a Canadian domestic permanent establishment or domestic bank account.',
      '4. Receive a unique Non-Resident Digital Economy Business Number (format: 999999999RT0001).',
      '5. Configure your billing and payment gateway (Stripe/PayPal/Adyen) to collect provincial GST/HST rates based on the customer’s Canadian billing address (5% GST in AB/BC/SK/MB/QC/Territories, 13% HST in ON, 15% HST in NB/NL/NS/PE).',
      '6. File quarterly simplified GST/HST returns online via CRA My Business Account and remit collected tax in CAD or USD.',
      '7. Retain digital transaction records and customer address verification logs for 6 years.'
    ],
    officialForms: [
      {
        formNumber: 'Form GST74',
        formName: 'Application for Simplified Registration for Non-Resident Businesses Making Supplies of Digital Products or Services',
        officialFormUrl: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/digital-economy.html',
        submissionPortalName: 'CRA Non-Resident Digital Economy Registration Portal',
        submissionPortalUrl: 'https://www.canada.ca/en/revenue-agency/services/e-services/digital-economy.html',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'Form GST59',
        formName: 'GST/HST Return for Non-Resident Suppliers of Digital Products and Services',
        officialFormUrl: 'https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/gst59.html',
        submissionPortalName: 'CRA Simplified Digital Economy e-Filing Portal',
        submissionPortalUrl: 'https://www.canada.ca',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Chartered Professional Accountant (CPA) recommended for annual Canadian tax reconciliation.',
      bankRequired: true,
      bankRoleDescription: 'Foreign bank or payment processor transmits international wire / Swift payment directly to CRA account.',
      customsBrokerRequired: false,
      customsBrokerRoleDescription: 'Not applicable for intangible cross-border software and services.',
      otherThirdParty: 'Merchant of Record (MoR) platform can serve as legal intermediary to assume Canadian GST/HST collection obligations.'
    },
    exemptions: [
      'Supplies made exclusively to Canadian GST/HST-registered business customers (B2B) where the customer provides their valid GST/HST registration number.',
      'Total annual taxable supplies to Canadian non-registered consumers below $30,000 CAD threshold.'
    ],
    penaltiesForNonCompliance: 'Failure to register penalty under Excise Tax Act Section 280; interest compounded daily on uncollected taxes; statutory penalty of 25% of unremitted tax.',
    statuteCitation: 'Excise Tax Act (R.S.C., 1985, c. E-15), Part IX, Division II and Subdivision e (Cross-Border Digital Economy Measures).'
  },

  // =========================================================================
  // 20. AUSTRALIA — ABF INTEGRATED CARGO SYSTEM & BICON (GOODS IMPORT)
  // =========================================================================
  {
    id: 'AU_ABF_ICS_BICON_IMPORT',
    title: 'Australia: Australian Border Force (ABF) Integrated Cargo System (ICS) Import Declaration (N10) & BICON Biosecurity Clearance',
    type: 'Goods Import',
    countryCode: 'AU',
    countryName: 'Australia',
    jurisdictionScope: 'National',
    issuingAuthority: 'Australian Border Force (ABF) & Department of Agriculture, Fisheries and Forestry (DAFF)',
    authorityUrl: 'https://www.abf.gov.au',
    isMandatory: true,
    validity: 'Transaction-specific import clearance permit (Customs Delivery Order / Nature 10 Entry)',
    processingTimeline: '1-3 business days for electronic assessment; 5-10 days if biosecurity inspection required',
    governmentFees: 'Import Processing Charge ($50 - $202 AUD depending on consignment value and declaration mode) + 5% duty + 10% GST',
    overview: 'All commercial goods imported into Australia with a customs value exceeding $1,000 AUD must be declared to the Australian Border Force (ABF) on an electronic Full Import Declaration (FID / Nature 10 entry) via the Integrated Cargo System (ICS). In addition, all consignments must comply with the Biosecurity Act 2015 and be checked against the Department of Agriculture BICON system to prevent the entry of biological pests.',
    stepByStepInstructions: [
      '1. Obtain an Australian Business Number (ABN) or Australian Customs Client Identifier (CCID) from the ABF.',
      '2. Query the BICON database (bicon.agriculture.gov.au) for your specific HS code to identify biosecurity import conditions, treatment requirements, or import permits.',
      '3. If wooden packaging or plant/animal content is included, secure an ISPM 15 Treatment Certificate or Manufacturer Biosecurity Declaration.',
      '4. Engage a licensed Australian Customs Broker to lodge the Full Import Declaration (FID - Form B650 / N10 entry) into the Integrated Cargo System (ICS).',
      '5. Pay calculated Customs Duty, 10% Goods and Services Tax (GST), and ABF Import Processing Charge via electronic funds transfer (EFT).',
      '6. If DAFF issues a Biosecurity Direction, transfer cargo to an Approved Arrangement (AA) depot for physical inspection or fumigation.',
      '7. ABF and DAFF grant electronic border clearance, generating the customs release authority for wharf/terminal collection.'
    ],
    officialForms: [
      {
        formNumber: 'Form B650',
        formName: 'Import Declaration (N10 - Full Import Declaration)',
        officialFormUrl: 'https://www.abf.gov.au/importing-exporting-and-manufacturing/importing/how-to-import/import-declaration',
        submissionPortalName: 'Integrated Cargo System (ICS) / Cargo Online Portal',
        submissionPortalUrl: 'https://www.ccf.customs.gov.au',
        filingMode: 'EDI / Broker Electronic Filing'
      },
      {
        formNumber: 'Form B319',
        formName: 'Customs Client Identifier (CCID) Registration Application',
        officialFormUrl: 'https://www.abf.gov.au/form-listing/forms/b319.pdf',
        submissionPortalName: 'ABF Client Services Cargo Support',
        submissionPortalUrl: 'https://www.abf.gov.au',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Australian Registered Tax Agent manages business GST claiming on the Business Activity Statement (BAS).',
      bankRequired: true,
      bankRoleDescription: 'Commercial bank facilitates Direct Debit or EFT for ABF customs duty and Import Processing Charge.',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'A licensed Australian Customs Broker holding a digital certificate (PKI / Gatekeeper) is required to lodge electronic entries in ICS.',
      otherThirdParty: 'DAFF-accredited fumigation provider or Approved Arrangement (AA) Depot for biosecurity cargo treatments.',
      entities: [
        {
          category: 'Licensed Customs Broker (LCB / CHA)',
          name: 'Licensed Australian Customs Broker (CBFCA / FTA Accredited)',
          isMandatory: true,
          legalMandate: 'Customs Act 1901 (Cth) Part XI Section 181',
          roleDescription: 'Legally authorized customs broker who determines Australian Harmonized Export/Import Tariff codes and lodges N10 FIDs.',
          formsProduced: ['Full Import Declaration (FID N10)', 'ABF Customs Entry Summary Receipt'],
          officialDirectoryUrl: 'https://www.abf.gov.au/importing-exporting-and-manufacturing/customs-brokers',
          directoryName: 'Australian Border Force Register of Licensed Customs Brokers'
        }
      ]
    },
    exemptions: [
      'Consignments with a customs value equal to or less than $1,000 AUD (cleared via Self-Assessed Clearance - SAC declaration, free of duty and GST unless alcohol/tobacco).',
      'Goods imported under ATA Carnet for temporary educational, scientific, or trade exhibition use.'
    ],
    penaltiesForNonCompliance: 'Strict liability infringement notices under Customs Act 1901 Section 243T (up to $13,750 AUD per incorrect entry); cargo seizure; criminal penalties up to 10 years imprisonment for prohibited imports.',
    statuteCitation: 'Customs Act 1901 (Cth), Customs Tariff Act 1995 (Cth), and Biosecurity Act 2015 (Cth).'
  },

  // =========================================================================
  // 21. AUSTRALIA — ATO SIMPLIFIED GST FOR CROSS-BORDER SERVICES (SERVICES EXPORT)
  // =========================================================================
  {
    id: 'AU_ATO_SIMPLIFIED_GST_CROSSBORDER',
    title: 'Australia: ATO Simplified GST for Non-Resident Cross-Border Digital Services & SaaS (A New Tax System Act 1999)',
    type: 'Services Export',
    countryCode: 'AU',
    countryName: 'Australia',
    jurisdictionScope: 'National',
    issuingAuthority: 'Australian Taxation Office (ATO)',
    authorityUrl: 'https://www.ato.gov.au',
    isMandatory: true,
    validity: 'Continuous registration upon exceeding $75,000 AUD gross Australian annual turnover',
    processingTimeline: '1-3 business days for electronic ARN issuance',
    governmentFees: 'Free registration ($0 ATO fee); remits 10% statutory Australian GST on sales',
    overview: 'Under A New Tax System (Goods and Services Tax) Act 1999, non-resident businesses that sell digital services, cloud software (SaaS), mobile apps, online media, or remote consulting services to Australian consumers must register for Australian GST if their annual taxable sales to Australian consumers equal or exceed $75,000 AUD. The ATO offers a streamlined "Simplified GST for Non-Residents" system with an Australian Reference Number (ARN).',
    stepByStepInstructions: [
      '1. Calculate gross sales to Australian retail consumers over any rolling 12-month period to verify crossing the $75,000 AUD threshold.',
      '2. Apply online for Simplified GST for Non-Residents via the ATO portal to receive an Australian Reference Number (ARN - format: 12-digit number starting with 84).',
      '3. Update checkout pricing to add 10% Australian GST for all Australian consumer sales.',
      '4. If selling to Australian GST-registered businesses (B2B): Request their Australian Business Number (ABN) and a statement that they are registered for GST; B2B sales are reverse-charged and exempt from GST collection.',
      '5. Lodge quarterly simplified GST returns online using the ATO Business Portal.',
      '6. Remit collected 10% GST to the ATO in Australian Dollars via SWIFT or international credit card.'
    ],
    officialForms: [
      {
        formNumber: 'Form ATO-ARN',
        formName: 'Application for Australian Reference Number (Simplified GST for Non-Residents)',
        officialFormUrl: 'https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/in-detail/rules-for-specific-transactions/international-transactions/gst-cross-border-transactions-between-businesses',
        submissionPortalName: 'ATO Non-Resident Online Registration Portal',
        submissionPortalUrl: 'https://bp.ato.gov.au',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'ATO Simplified BAS',
        formName: 'Simplified GST Return for Non-Residents (Quarterly Electronic Return)',
        officialFormUrl: 'https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/in-detail/rules-for-specific-transactions/international-transactions/inbound-transactions/simplified-gst-system-for-non-residents',
        submissionPortalName: 'ATO Online Services for Non-Residents',
        submissionPortalUrl: 'https://bp.ato.gov.au',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Australian Registered Tax Agent can prepare quarterly simplified GST returns on behalf of foreign entity.',
      bankRequired: true,
      bankRoleDescription: 'Commercial bank or payment provider converts and transfers AUD payment directly to Reserve Bank of Australia / ATO account.',
      customsBrokerRequired: false,
      customsBrokerRoleDescription: 'Not applicable for intangible software/services transactions.',
      otherThirdParty: 'Electronic distribution platform / Merchant of Record (MoR) can be legally deemed the supplier and handle GST obligations.'
    },
    exemptions: [
      'Supplies made to Australian GST-registered businesses for business use (B2B reverse-charge exemption under Section 84-100).',
      'Total annual Australian consumer turnover below $75,000 AUD threshold.'
    ],
    penaltiesForNonCompliance: 'Failure to register penalties under Taxation Administration Act 1953; administrative penalty of 75% of tax shortfall for intentional disregard; interest compounding under General Interest Charge (GIC).',
    statuteCitation: 'A New Tax System (Goods and Services Tax) Act 1999 (Cth) Subdivision 84-D (Inbound Intangible Consumer Supplies).'
  },

  // =========================================================================
  // 22. SINGAPORE — TRADENET CUSTOMS PERMIT & STRATEGIC GOODS (GOODS IMPORT)
  // =========================================================================
  {
    id: 'SG_CUSTOMS_TRADENET_PERMIT',
    title: 'Singapore: Customs TradeNet Inward/Outward Permit, UEN Activation & Strategic Goods (SGCA) Clearance',
    type: 'Goods Import',
    countryCode: 'SG',
    countryName: 'Singapore',
    jurisdictionScope: 'National',
    issuingAuthority: 'Singapore Customs & Ministry of Trade and Industry',
    authorityUrl: 'https://www.customs.gov.sg',
    isMandatory: true,
    validity: 'Transaction-specific Customs Inward Payment Permit (INP) / Outward Permit (OUT)',
    processingTimeline: '10 minutes via automated TradeNet EDI; 1-2 days for strategic goods or controlled items',
    governmentFees: '$2.88 SGD TradeNet processing fee per permit + customs duties + 9% Singapore GST',
    overview: 'Under the Singapore Customs Act and Regulation of Imports and Exports Act (RIEA), all commercial imports and exports must have a valid Customs Permit obtained through Singapore’s national single window, TradeNet, prior to the arrival or departure of cargo. An entity must activate its Unique Entity Number (UEN) with Singapore Customs and set up an Inter-Bank GIRO (IBG) account for automated GST payments.',
    stepByStepInstructions: [
      '1. Register a business entity with ACRA (Accounting and Corporate Regulatory Authority) to obtain a 9 or 10-digit Unique Entity Number (UEN).',
      '2. Activate the UEN with Singapore Customs via customs.gov.sg.',
      '3. Submit Form SC-A-001 to set up an Inter-Bank GIRO (IBG) account with an approved Singapore bank for payment of duties and 9% Goods and Services Tax (GST).',
      '4. If importing controlled goods (telecoms, pharmaceuticals, food), verify approving Controlling Agency requirements (IMDA, HSA, SFA).',
      '5. If importing/exporting dual-use goods: Check the Strategic Goods (Control) Act (SGCA) list and apply for a Strategic Goods Permit via TradeNet.',
      '6. Appoint a licensed Declaring Agent (Customs Broker / Freight Forwarder) to submit the Inward Payment Permit (INP) application in TradeNet.',
      '7. Print the approved TradeNet Customs Permit containing the valid permit number and QR code for port terminal clearance.'
    ],
    officialForms: [
      {
        formNumber: 'TradeNet INP/OUT',
        formName: 'Customs Import / Export Declaration (Inward Payment Permit / Outward Non-Payment Permit)',
        officialFormUrl: 'https://www.customs.go.sg/businesses/national-single-window/tradenet',
        submissionPortalName: 'TradeNet National Single Window for Trade Clearance',
        submissionPortalUrl: 'https://www.tradenet.gov.sg',
        filingMode: 'EDI / Broker Electronic Filing'
      },
      {
        formNumber: 'Form SC-A-001',
        formName: 'Application for Inter-Bank GIRO (IBG) for Singapore Customs Duties & GST',
        officialFormUrl: 'https://www.customs.gov.sg/forms/business/application-for-inter-bank-giro.pdf',
        submissionPortalName: 'Singapore Customs Account Registration Division',
        submissionPortalUrl: 'https://www.customs.gov.sg',
        filingMode: 'Manual Physical Submission with Bank/Auditor'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Public Accountant (ISCA) audits annual GST filings and Major Exporter Scheme (MES) renewals.',
      bankRequired: true,
      bankRoleDescription: 'Participating Singapore commercial bank (DBS, OCBC, UOB) authorizes automated Inter-Bank GIRO (IBG) debits for customs duties and GST.',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'A registered Declaring Agent authorized in TradeNet is mandatory to transmit permit applications.',
      otherThirdParty: 'Air/Ocean freight forwarder or terminal operator (PSA / Jurong Port / SATS) cross-checks permit number before cargo gate-out.',
      entities: [
        {
          category: 'Licensed Customs Broker (LCB / CHA)',
          name: 'Singapore Registered Declaring Agent (Customs Clearing Broker)',
          isMandatory: true,
          legalMandate: 'Customs Act (Chapter 70) and Regulation of Imports and Exports Regulations',
          roleDescription: 'Maintains active TradeNet user ID and Declaring Agent license to lodge import/export permits.',
          formsProduced: ['TradeNet Inward Payment Permit (INP)', 'Outward Non-Payment Permit (OUT)'],
          officialDirectoryUrl: 'https://www.customs.gov.sg/businesses/services-for-businesses/register-as-declaring-agent',
          directoryName: 'Singapore Customs Declaring Agent Registry'
        },
        {
          category: 'Authorized Dealer Bank & Trade Finance',
          name: 'Singapore Inter-Bank GIRO Participating Bank',
          isMandatory: true,
          legalMandate: 'Customs Regulations Regulation 88',
          roleDescription: 'Validates automated electronic direct debit authorization for customs taxes.',
          formsProduced: ['Form SC-A-001 Bank GIRO Authorization Seal', 'Monthly GST Payment Statement'],
          officialDirectoryUrl: 'https://www.abs.org.sg',
          directoryName: 'Association of Banks in Singapore (ABS)'
        }
      ]
    },
    exemptions: [
      'Trade samples of non-controlled items valued under $400 SGD imported via parcel post (GST exemption).',
      'Goods approved under the Major Exporter Scheme (MES) where import GST is suspended at point of importation.'
    ],
    penaltiesForNonCompliance: 'Fines up to $10,000 SGD or three times duty/tax payable (whichever is greater), and up to 12 months imprisonment under Customs Act Section 128; forfeiture of goods.',
    statuteCitation: 'Customs Act (Cap. 70), Regulation of Imports and Exports Act (Cap. 272A), and Strategic Goods (Control) Act (Cap. 300).'
  },

  // =========================================================================
  // 23. SINGAPORE — IRAS OVR SIMPLIFIED GST REGIME FOR SAAS (SERVICES EXPORT)
  // =========================================================================
  {
    id: 'SG_IRAS_OVR_DIGITAL_SERVICES',
    title: 'Singapore: IRAS Overseas Vendor Registration (OVR) Simplified GST Regime for B2C SaaS & Digital Services',
    type: 'Services Export',
    countryCode: 'SG',
    countryName: 'Singapore',
    jurisdictionScope: 'National',
    issuingAuthority: 'Inland Revenue Authority of Singapore (IRAS)',
    authorityUrl: 'https://www.iras.gov.sg',
    isMandatory: true,
    validity: 'Continuous registration upon meeting global ($1M SGD) and Singapore B2C ($100k SGD) thresholds',
    processingTimeline: '5 to 10 business days for electronic OVR GST registration number issuance',
    governmentFees: 'Free registration ($0 IRAS fee); remits 9% standard Singapore GST on B2C sales',
    overview: 'Under Singapore’s Overseas Vendor Registration (OVR) regime under the GST Act, overseas suppliers and electronic marketplace operators that sell digital services, cloud software (SaaS), mobile apps, or low-value imported goods to non-GST registered persons (consumers) in Singapore must register for GST under the simplified pay-only OVR regime if: (1) their annual global turnover exceeds $1,000,000 SGD, and (2) their sales of digital services to customers in Singapore exceed $100,000 SGD.',
    stepByStepInstructions: [
      '1. Review annual global turnover and Singapore B2C revenues against statutory dual thresholds ($1,000,000 SGD global + $100,000 SGD Singapore).',
      '2. Navigate to IRAS myTax Portal and submit the simplified Overseas Vendor Registration application.',
      '3. IRAS issues an OVR GST Registration Number (prefixed with "M").',
      '4. Configure checkout billing engine to charge 9% Singapore GST on all digital service sales to Singapore retail customers.',
      '5. Validate business customers: If a Singapore customer provides a valid GST registration number, do not charge GST (B2B reverse charge applies).',
      '6. File quarterly Form GST F5 (Overseas Vendor GST Return) electronically via myTax Portal.',
      '7. Remit 9% GST payment to IRAS in SGD or approved foreign currencies (USD, EUR, GBP) via telegraphic transfer or credit card.'
    ],
    officialForms: [
      {
        formNumber: 'Form GST-OVR',
        formName: 'Application for Overseas Vendor Registration under Pay-Only Simplified GST',
        officialFormUrl: 'https://www.iras.gov.sg/taxes/goods-services-tax-(gst)/gst-and-digital-economy/overseas-vendor-registration-(ovr)',
        submissionPortalName: 'myTax Portal (IRAS Non-Resident Corporate Services)',
        submissionPortalUrl: 'https://mytax.iras.gov.sg',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'Form GST F5',
        formName: 'Overseas Vendor Goods and Services Tax Return',
        officialFormUrl: 'https://www.iras.gov.sg/taxes/goods-services-tax-(gst)/filing-gst/gst-returns',
        submissionPortalName: 'IRAS myTax Portal e-Filing Gateway',
        submissionPortalUrl: 'https://mytax.iras.gov.sg',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Accredited Tax Advisor (SCTP) recommended for Singapore cross-border tax treaty and permanent establishment advice.',
      bankRequired: true,
      bankRoleDescription: 'Commercial bank executes telegraphic wire transfer directly into IRAS government tax collection account.',
      customsBrokerRequired: false,
      customsBrokerRoleDescription: 'Not applicable for intangible cloud software/services.',
      otherThirdParty: 'Merchant of Record (MoR) / Electronic Marketplace Operator can be legally responsible for collecting and remitting OVR GST on behalf of foreign suppliers.'
    },
    exemptions: [
      'Supplies made to Singapore GST-registered businesses (B2B) where the buyer provides their valid GST registration number.',
      'Suppliers below either the $1,000,000 SGD global turnover or $100,000 SGD Singapore digital services threshold.'
    ],
    penaltiesForNonCompliance: 'Penalties under GST Act Section 59 for failure to register (5% late payment penalty + 1% per month up to 12%); fine up to $10,000 SGD; civil recovery action.',
    statuteCitation: 'Goods and Services Tax Act 1993 (Cap. 117A) Section 14A and Part IVB (Supplies by Overseas Vendors).'
  },

  // =========================================================================
  // 24. UNITED ARAB EMIRATES — DUBAI CUSTOMS MERSAL-2 & MOIAT ECAS (GOODS IMPORT)
  // =========================================================================
  {
    id: 'AE_DUBAI_CUSTOMS_MERSAL',
    title: 'United Arab Emirates: Dubai Customs MERSAL-2 Import Declaration, Importer Code & MoIAT ECAS Certificate',
    type: 'Goods Import',
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    jurisdictionScope: 'National',
    issuingAuthority: 'Dubai Customs & Ministry of Industry and Advanced Technology (MoIAT)',
    authorityUrl: 'https://www.dubaicustoms.gov.ae',
    isMandatory: true,
    validity: 'Customs Importer Code requires annual renewal; MERSAL declaration is transaction-specific',
    processingTimeline: '1-2 business days for MERSAL electronic clearance; 3-5 days for MoIAT ECAS certificate',
    governmentFees: '100 AED customs declaration fee + 5% standard GCC unified customs tariff + 5% UAE VAT',
    overview: 'Under the GCC Common Customs Law and UAE Federal Decree, any commercial entity importing merchandise into Dubai or the UAE must possess an active Commercial Trade License, obtain a Customs Importer Code registered with Dubai Customs via the Dubai Trade Portal (MERSAL 2), and submit an electronic Customs Declaration. Regulated products (electrical, cosmetics, toys, automotive) must hold an Emirates Conformity Assessment Scheme (ECAS) Certificate issued by MoIAT.',
    stepByStepInstructions: [
      '1. Secure a valid UAE Trade License issued by the Department of Economy and Tourism (DET) or an approved UAE Free Zone Authority (e.g. JAFZA, DAFZA).',
      '2. Register on Dubai Trade (dubaitrade.ae) and apply for a Dubai Customs Client Importer/Exporter Code.',
      '3. If importing regulated merchandise: Submit product test reports from an ISO/IEC 17025 accredited laboratory to MoIAT to obtain an ECAS Certificate of Conformity.',
      '4. Engage a licensed UAE customs clearing agent or lodge the electronic Import Declaration directly into MERSAL 2.',
      '5. Upload shipping documents: Bill of Lading / Air Waybill, Commercial Invoice, Certificate of Origin legalized by Chamber of Commerce, and Packing List.',
      '6. Settle customs duty (5% GCC unified tariff) and 5% UAE VAT through Dubai Trade Mirsal account or online payment gateway.',
      '7. Receive Customs Clearance Exit Order allowing physical release of cargo from Jebel Ali Port or Dubai International Airport cargo terminal.'
    ],
    officialForms: [
      {
        formNumber: 'MERSAL-2 Import Declaration',
        formName: 'Dubai Customs Electronic Import Declaration (Customs Bill of Entry)',
        officialFormUrl: 'https://www.dubaitrade.ae/en/customs-services/customs-declarations',
        submissionPortalName: 'Dubai Trade Single Window (MERSAL 2 Customs Portal)',
        submissionPortalUrl: 'https://www.dubaitrade.ae',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'MoIAT ECAS Form',
        formName: 'Application for Emirates Conformity Assessment Scheme (ECAS) Certificate of Conformity',
        officialFormUrl: 'https://moiat.gov.ae/en/services/issue-conformity-certificate-ecas',
        submissionPortalName: 'Ministry of Industry and Advanced Technology Conformity Portal',
        submissionPortalUrl: 'https://moiat.gov.ae',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'UAE Registered Tax Auditor manages corporate Corporate Tax and Federal Tax Authority (FTA) VAT return filings.',
      bankRequired: true,
      bankRoleDescription: 'UAE Central Bank licensed commercial bank provides electronic direct debit or customs standing bank guarantee.',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'Licensed UAE Customs Broker / Freight Clearing Agent registered on Dubai Trade is mandatory for customs clearing.',
      otherThirdParty: 'MoIAT-Notified Conformity Assessment Body (TIC body) for issuing product safety certificates of conformity.',
      entities: [
        {
          category: 'Licensed Customs Broker (LCB / CHA)',
          name: 'Licensed UAE Customs Clearing Agent (مخلص جمركي)',
          isMandatory: true,
          legalMandate: 'GCC Common Customs Law Article 107',
          roleDescription: 'Licensed customs agent authorized to lodge import manifests and inspect cargo at UAE customs checkpoints.',
          formsProduced: ['MERSAL-2 Customs Bill of Entry', 'Customs Inspection Release Notice'],
          officialDirectoryUrl: 'https://www.dubaitrade.ae',
          directoryName: 'Dubai Trade Clearing Agents Directory'
        },
        {
          category: 'Accredited Testing Lab / Notified Body (TIC)',
          name: 'MoIAT Notified Conformity Assessment Body (TIC)',
          isMandatory: true,
          legalMandate: 'Federal Law No. 28 of 2001 on Standards and Metrology & ECAS Regulations',
          roleDescription: 'Independent laboratory that tests product samples and issues mandatory ECAS Certificate of Conformity.',
          formsProduced: ['ECAS Certificate of Conformity', 'ISO/IEC 17025 Test Report'],
          officialDirectoryUrl: 'https://moiat.gov.ae/en/services/issue-conformity-certificate-ecas',
          directoryName: 'MoIAT Notified Bodies Directory'
        }
      ]
    },
    exemptions: [
      'Goods imported into UAE Designated Free Zones (e.g. JAFZA) with customs duty and VAT suspended until entry into the domestic mainland market.',
      'Diplomatic and military cargo.'
    ],
    penaltiesForNonCompliance: 'Customs fines up to three times duty evaded under GCC Common Customs Law; confiscation of goods; detention of carrier; closure of trade license.',
    statuteCitation: 'GCC Common Customs Law (Federal Decree No. 85 of 2007) and UAE Federal Decree-Law No. 8 of 2017 on Value Added Tax.'
  },

  // =========================================================================
  // 25. BRAZIL — PORTAL ÚNICO SISCOMEX RADAR & DUIMP (GOODS IMPORT)
  // =========================================================================
  {
    id: 'BR_SISCOMEX_RADAR_DUIMP',
    title: 'Brazil: Receita Federal / SECEX Portal Único Siscomex, RADAR License & DUIMP Declaration (Habilitação no Siscomex)',
    type: 'Goods Import',
    countryCode: 'BR',
    countryName: 'Brazil',
    jurisdictionScope: 'National',
    issuingAuthority: 'Secretaria da Receita Federal do Brasil (RFB) & Secretaria de Comércio Exterior (SECEX)',
    authorityUrl: 'https://www.gov.br/receitafederal',
    isMandatory: true,
    validity: 'RADAR license valid continuously, subject to maintaining operational financial capacity',
    processingTimeline: '1 to 10 business days for RADAR approval; 2-5 days for DUIMP clearance',
    governmentFees: 'Taxa de Utilização do Siscomex (~$200 BRL per DUIMP) + II (Import Duty) + IPI + PIS/COFINS + ICMS',
    overview: 'Under Brazilian Customs Law (Regulamento Aduaneiro), no business can import or export physical goods without prior registration and authorization in the RADAR system (Ambiente de Registro e Rastreamento da Atuação dos Intervenientes Aduaneiros) managed by the Federal Revenue of Brazil (Receita Federal). Once enabled in Siscomex, all imports are declared electronically via the Portal Único de Comércio Exterior using the Single Import Declaration (DUIMP - Declaração Única de Importação).',
    stepByStepInstructions: [
      '1. Obtain an active CNPJ (Cadastro Nacional da Pessoa Jurídica) and acquire an ICP-Brasil e-CNPJ digital certificate for the legal representative.',
      '2. Access the Portal Único Siscomex and file the application for Habilitação no Siscomex (RADAR modality: Express up to $50k USD, Limited up to $150k USD, or Unlimited based on tax capacity).',
      '3. Receita Federal evaluates the enterprise’s financial capability and grants RADAR clearance.',
      '4. Formally accredit a licensed Brazilian Customs Broker (Despachante Aduaneiro) in the Siscomex Intervenientes module.',
      '5. Check product NCM (Nomenclatura Comum do Mercosul) code in Siscomex to determine if an Import License (Licença de Importação - LI) is required from consenting agencies (ANVISA, MAPA, INMETRO).',
      '6. Register the Single Import Declaration (DUIMP) via Portal Único Siscomex attaching commercial invoice, bill of lading (Conhecimento de Embarque), and packing list.',
      '7. Automatic tax debit of federal duties (II, IPI, PIS/COFINS-Importação) via SISBACEN bank account, followed by state ICMS settlement and issuance of the Customs Clearance Receipt (Comprovante de Importação - CI).'
    ],
    officialForms: [
      {
        formNumber: 'Siscomex RADAR Request',
        formName: 'Requerimento de Habilitação de Usuário no Siscomex (RADAR Express / Limited / Unlimited)',
        officialFormUrl: 'https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/importacao-e-exportacao/radar',
        submissionPortalName: 'Portal Único de Comércio Exterior (Habilitação Siscomex)',
        submissionPortalUrl: 'https://portalunico.siscomex.gov.br',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      },
      {
        formNumber: 'Siscomex DUIMP',
        formName: 'Declaração Única de Importação (DUIMP - Single Import Declaration)',
        officialFormUrl: 'https://www.gov.br/siscomex/pt-br/informacoes/duimp',
        submissionPortalName: 'Portal Único Siscomex Módulo Importação',
        submissionPortalUrl: 'https://portalunico.siscomex.gov.br',
        filingMode: 'Online Electronic (Instant / Digital Signature)'
      }
    ],
    thirdPartyRequirements: {
      auditorRequired: false,
      auditorRoleDescription: 'Contador (Certified Brazilian Accountant - CRC) is essential to demonstrate financial solvency and calculate complex cascaded PIS/COFINS and ICMS import taxes.',
      bankRequired: true,
      bankRoleDescription: 'Commercial bank authorized by Banco Central do Brasil (BACEN) executes foreign exchange contract (Contrato de Câmbio) and links payment to Siscomex.',
      customsBrokerRequired: true,
      customsBrokerRoleDescription: 'A certified Despachante Aduaneiro registered with the Receita Federal is mandatory by law to lodge customs declarations in Siscomex.',
      otherThirdParty: 'ICP-Brasil accredited digital certification authority (Certisign, Serasa) for e-CNPJ digital signature certificate.',
      entities: [
        {
          category: 'Licensed Customs Broker (LCB / CHA)',
          name: 'Licensed Brazilian Customs Broker (Despachante Aduaneiro Credenciado)',
          isMandatory: true,
          legalMandate: 'Decreto Federal nº 6.759/2009 (Regulamento Aduaneiro) Article 809',
          roleDescription: 'Exclusive professional legally licensed to represent the importer before Receita Federal, prepare DUIMP, and manage customs clearance channels (Verde/Amarelo/Vermelho/Cinza).',
          formsProduced: ['Extrato da DUIMP', 'Comprovante de Importação (CI)'],
          officialDirectoryUrl: 'https://www.gov.br/receitafederal',
          directoryName: 'Receita Federal Cadastro de Despachantes Aduaneiros'
        },
        {
          category: 'Authorized Dealer Bank & Trade Finance',
          name: 'BACEN-Authorized Foreign Exchange Bank (Banco de Câmbio)',
          isMandatory: true,
          legalMandate: 'Lei nº 14.286/2021 (Novo Marco Cambial Brasileiro)',
          roleDescription: 'Registers cross-border currency remittance (Contrato de Câmbio de Importação) and validates foreign supplier payment.',
          formsProduced: ['Contrato de Câmbio Registrado no BACEN', 'Comprovante de Liquidação de Câmbio'],
          officialDirectoryUrl: 'https://www.bcb.gov.br',
          directoryName: 'Banco Central do Brasil Instituições Autorizadas'
        }
      ]
    },
    exemptions: [
      'Postal and courier consignments valued under $50 USD imported by individuals under Remessa Conforme program.',
      'Diplomatic cargo and temporary cultural exhibits under Termo de Responsabilidade.'
    ],
    penaltiesForNonCompliance: 'Seizure and forfeiture of goods (Pena de Perdimento) under Regulamento Aduaneiro Article 689; tax fraud penalty of 150% of evaded duties; suspension of RADAR license.',
    statuteCitation: 'Decreto nº 6.759/2009 (Regulamento Aduaneiro), Instrução Normativa RFB nº 1.984/2020 (RADAR), and Portaria SECEX nº 249/2023.'
  }
];

// =============================================================================
// COMPREHENSIVE DIRECTORY OF ALL 10 THIRD-PARTY ROLES IN GLOBAL TRADE & SERVICES
// =============================================================================
export const ALL_TRADE_THIRD_PARTIES_DIRECTORY: ThirdPartyDirectoryItem[] = [
  {
    id: 'FREIGHT_FORWARDER',
    title: 'Freight Forwarders & Multimodal Transport Carriers (NVOCCs)',
    category: 'Logistics & Cargo Custody',
    badge: 'Mandatory for Physical Freight',
    summary: 'Licenses transport intermediaries who take custody of international freight, book cargo vessel/aircraft capacity, issue negotiable Bills of Lading, and file advance security manifests with customs border targeting systems.',
    applicableFlows: ['Goods Import', 'Goods Export'],
    keyStatutoryMandate: 'SAFE Port Act of 2006 (6 U.S.C. § 943), 19 CFR Part 149 (ISF 10+2), 15 CFR Part 30 (AES EEI), and Hague-Visby / Montreal Maritime & Air Conventions.',
    statuteCitation: 'Title 46 U.S. Code §§ 40901-40904 (FMC Licensing) and International Maritime Organization (IMO) SOLAS VGM.',
    whenMandatory: [
      'Mandatory for all containerized ocean shipments destined for the U.S. (submitting ISF 10+2 data at least 24 hours prior to foreign vessel loading).',
      'Mandatory for issuing Master and House Bills of Lading (B/L) and Air Waybills (AWB) required for border clearance and bank Letter of Credit presentation.',
      'Mandatory for filing Electronic Export Information (EEI) in the Automated Export System (AES) for exports over $2,500 per Schedule B.'
    ],
    whenOptionalOrSelf: [
      'Not required for digital services, SaaS exports, or remote professional services.',
      'Optional for small parcels handled directly by integrated express couriers (FedEx, DHL, UPS) acting as carrier.'
    ],
    keyDocumentsAndForms: [
      'Master Bill of Lading (MBL) & House Bill of Lading (HBL)',
      'Air Waybill (AWB)',
      'Importer Security Filing (CBP ISF-10)',
      'Automated Export System (AES) Internal Transaction Number (ITN)',
      'Verified Gross Mass (VGM) Certificate under IMO SOLAS'
    ],
    typicalFeeRange: '$35 - $150 per electronic filing (ISF/EEI) + freight booking commissions ($250 - $1,500 depending on route)',
    turnaroundTime: '24 hours advance pre-loading filing; same-day electronic booking',
    consequencesOfOmission: 'Carrier will refuse to load container onto vessel; $5,000 - $10,000 CBP liquidated damages per missing ISF; container grounded at origin port.',
    officialVerificationRegistry: {
      name: 'U.S. Federal Maritime Commission (FMC) Ocean Transportation Intermediaries (OTI) List',
      url: 'https://www.fmc.gov/resources-services/oti-list/',
      description: 'Official U.S. government register of licensed ocean freight forwarders and NVOCCs bonded under 46 CFR Part 515.'
    },
    stepByStepEngagementProtocol: [
      'Verify the freight forwarder holds an active FMC license number (U.S.) or FIATA registration.',
      'Request forwarder’s Standard Trading Conditions (STC) and marine cargo insurance policy.',
      'Provide commercial invoice, packing list, and HTS codes at least 72 hours before vessel cut-off.',
      'Obtain written confirmation of the ISF Transaction Number and ITN before cargo gates in at the terminal.'
    ]
  },
  {
    id: 'TESTING_TIC_NOTIFIED_BODY',
    title: 'Accredited Testing, Inspection & Certification (TIC) Laboratories & Notified Bodies',
    category: 'Product Safety & Technical Conformity',
    badge: 'Mandatory for Regulated Goods',
    summary: 'Independent third-party conformity assessment bodies accredited under ISO/IEC 17020 and ISO/IEC 17025 to test physical goods, inspect factory quality management systems, and issue statutory Certificates of Conformity.',
    applicableFlows: ['Goods Import', 'Goods Export'],
    keyStatutoryMandate: 'EU Regulation (EC) No 765/2008 & Decision 768/2008/EC (CE Marking Notified Bodies), Bureau of Indian Standards Act 2016, and Saudi SASO SALEEM Program.',
    statuteCitation: 'Regulation (EU) 2019/1020 on market surveillance and compliance of products.',
    whenMandatory: [
      'Mandatory for EU imports of high-risk electronics, medical devices, wireless RF transmitters (RED), and machinery requiring Notified Body type examination.',
      'Mandatory for electronics imported into India under BIS Compulsory Registration Scheme (CRS) requiring testing at a NABL-accredited BIS lab.',
      'Mandatory for exports to Saudi Arabia, Nigeria, Kenya, Egypt, and Algeria requiring Pre-Shipment Inspection (PSI) and Certificates of Conformity (CoC).'
    ],
    whenOptionalOrSelf: [
      'Optional for low-risk products where standard directives permit manufacturer self-declaration of conformity (Module A internal production control).',
      'Not required for software, SaaS, or non-technical services.'
    ],
    keyDocumentsAndForms: [
      'ISO/IEC 17025 Accredited Laboratory Test Report',
      'EU Type Examination Certificate (issued by EU Notified Body with 4-digit ID)',
      'SASO SABER Product Certificate of Conformity (PCoC) & Shipment CoC (SCoC)',
      'Pre-Shipment Inspection (PSI) Certificate / Clean Report of Findings (CRF)'
    ],
    typicalFeeRange: '$500 - $12,000 USD depending on product testing scope, safety standards, and factory inspection requirements',
    turnaroundTime: '5 business days for standard safety testing; 3 to 6 weeks for complex RF/EMC or medical device trials',
    consequencesOfOmission: 'Immediate customs border rejection; cargo destruction or mandatory re-export at manufacturer expense; European Safety Gate (RAPEX) product recall.',
    officialVerificationRegistry: {
      name: 'European Commission NANDO (New Approach Notified and Designated Organisations) Database',
      url: 'https://ec.europa.eu/growth/tools-databases/nando/',
      description: 'Official EU database of all accredited Notified Bodies authorized to perform CE conformity assessments.'
    },
    stepByStepEngagementProtocol: [
      'Identify applicable harmonized standards (EN standards, ISO, IEC, IS) for your specific HS/product category.',
      'Search NANDO or NABL directory to find a laboratory accredited specifically for that exact standard.',
      'Ship pre-production or production samples to the testing lab with full technical schematics and user manuals.',
      'Obtain the signed test report and reference the lab’s accreditation number in your Declaration of Conformity.'
    ]
  },
  {
    id: 'SURETY_BOND_UNDERWRITER',
    title: 'Treasury-Approved Surety Bond Underwriters & Trade Credit Insurers',
    category: 'Financial Guarantee & Credit Protection',
    badge: 'Mandatory for US Commercial Entry',
    summary: 'Financial institutions licensed by national governments to underwrite surety bonds that legally guarantee payment of customs duties, taxes, and fines to border revenue authorities, or insure cross-border receivables against foreign buyer default.',
    applicableFlows: ['Goods Import', 'Goods Export'],
    keyStatutoryMandate: 'Tariff Act of 1930 (19 U.S.C. § 1623), 19 CFR Part 113, and 31 CFR Part 223 (Treasury Circular 570).',
    statuteCitation: 'Title 31 U.S. Code § 9304 (Surety Corporations) and Export-Import Bank Act of 1945.',
    whenMandatory: [
      'Mandatory for all formal commercial entries into the United States valued over $2,500 (requiring a continuous $50,000+ bond or single transaction bond on CBP Form 301).',
      'Mandatory for participating in duty deferment accounts or bonded warehouse storage in the UK and European Union.',
      'Mandatory when importing goods under temporary admission (carnet or provisional bond).'
    ],
    whenOptionalOrSelf: [
      'Trade credit insurance is optional (but strongly recommended) for exporters selling on open account (Net 30/60/90) to manage cross-border non-payment risk.',
      'Not required for de minimis shipments under $800 USD entering the U.S. under Section 321.'
    ],
    keyDocumentsAndForms: [
      'CBP Form 301 (Customs Bond Application)',
      'Continuous Bond Rider (Activity Code 1 - Importer or Broker)',
      'ISF Bond Rider (Appendix D to 19 CFR Part 113)',
      'Export Credit Insurance Policy (EXIM Bank / ECGC / Euler Hermes)'
    ],
    typicalFeeRange: '$350 - $600 USD per year for a standard $50,000 U.S. continuous customs bond; Single Transaction Bonds cost $5 per $1,000 valuation',
    turnaroundTime: '24 to 48 hours for automated electronic bond issuance',
    consequencesOfOmission: 'CBP will block formal entry clearance; goods cannot leave the marine terminal; demurrage storage fines accrue at $150 - $400/day.',
    officialVerificationRegistry: {
      name: 'U.S. Bureau of the Fiscal Service Circular 570 (Treasury Approved Sureties)',
      url: 'https://www.fiscal.treasury.gov/surety-bonds/list-certified-companies.html',
      description: 'Official U.S. Department of the Treasury list of companies holding Certificates of Authority to underwrite federal bonds.'
    },
    stepByStepEngagementProtocol: [
      'Estimate annual imported merchandise value and duty liability to determine required bond amount (minimum $50,000).',
      'Work with a licensed customs broker or direct surety underwriter to submit entity tax ID and financial statements.',
      'The surety files the electronic bond directly with CBP Revenue Division via the Electronic Bond System (eBond).',
      'Receive CBP-assigned Bond Number for quotation on every entry summary.'
    ]
  },
  {
    id: 'CHAMBER_COMMERCE_CONSULAR',
    title: 'Chambers of Commerce & Consular Apostille / Legalization Authorities',
    category: 'Document Authentication & Origin Certification',
    badge: 'Mandatory for Tariff Reductions & Non-Apostille Countries',
    summary: 'Statutory chambers of commerce, trade ministries, and foreign diplomatic missions (embassies/consulates) that legally authenticate commercial invoices, inspect bills of materials, and certify certificates of origin.',
    applicableFlows: ['Goods Export'],
    keyStatutoryMandate: '1923 Geneva Convention on Simplification of Customs Formalities, 1961 Hague Apostille Convention, and WTO Agreement on Rules of Origin.',
    statuteCitation: 'Hague Convention of 5 October 1961 Abolishing the Requirement of Legalisation for Foreign Public Documents.',
    whenMandatory: [
      'Mandatory whenever the importer claims preferential 0% or reduced customs duties under bilateral/multilateral Free Trade Agreements.',
      'Mandatory for exports to Middle Eastern countries (e.g. UAE, Qatar, Egypt, Kuwait) requiring embassy consular stamps on invoices and COOs.',
      'Mandatory when international Letters of Credit (LC) require a Chamber-authenticated Certificate of Origin.'
    ],
    whenOptionalOrSelf: [
      'Optional under modern FTAs (e.g. USMCA, CPTPP) that permit self-certification of origin by authorized registered exporters (REX system).',
      'Not required for domestic trade or intra-EU trade within the European Single Market.'
    ],
    keyDocumentsAndForms: [
      'Non-Preferential Certificate of Origin (COO)',
      'Preferential FTA Certificate of Origin (e.g. Form A-1, ASEAN Form E, CEPA COO)',
      'Electronic Certificate of Origin (e-COO) with ICC verification chain',
      'Hague Apostille Certificate / Consular Embassy Stamp'
    ],
    typicalFeeRange: '$15 - $75 USD for Chamber COO issuance; $50 - $250 USD per document for Embassy consular legalization',
    turnaroundTime: '1 to 2 business days for electronic e-COO; 5 to 10 days for physical consular embassy legalization',
    consequencesOfOmission: 'Foreign customs rejects preferential tariff claim; importer forced to pay full MFN customs tariff plus deposit; cargo clearance delays.',
    officialVerificationRegistry: {
      name: 'International Chamber of Commerce (ICC) World Chambers Federation e-COO Verification Portal',
      url: 'https://iccwbo.org/business-solutions/certificates-of-origin/certificates-of-origin-verification/',
      description: 'Global verification chain established by ICC to authenticate genuine certificates of origin issued by accredited chambers.'
    },
    stepByStepEngagementProtocol: [
      'Prepare product bill of materials and calculate local value addition (RVC / CTC criteria).',
      'Create account on local Chamber of Commerce digital portal or national e-COO platform.',
      'Upload commercial invoice, packing list, and manufacturing cost sheet.',
      'Download digitally signed e-COO containing verification QR code and transmit to destination consignee.'
    ]
  },
  {
    id: 'IN_COUNTRY_REPRESENTATIVE',
    title: 'In-Country Legal & Regulatory Representatives (Resident Agents)',
    category: 'Jurisdictional Representation & Regulatory Notice',
    badge: 'Mandatory for Foreign Manufacturers',
    summary: 'Resident individuals or incorporated entities physically located in the destination country who legally agree to act as the liaison between the foreign manufacturer and sovereign market surveillance or health authorities.',
    applicableFlows: ['Goods Import', 'Goods Export'],
    keyStatutoryMandate: '21 CFR § 1.227 (U.S. FDA Agent), Regulation (EU) 2019/1020 Article 4 (EU Authorized Representative), and BIS CRS Regulations (Authorized Indian Representative AIR).',
    statuteCitation: 'EU Market Surveillance Regulation (EU) 2019/1020 and U.S. Food Safety Modernization Act (FSMA).',
    whenMandatory: [
      'Mandatory for all foreign food, drug, medical device, and cosmetic facilities registering with the U.S. FDA (must name a U.S. Agent located in the USA).',
      'Mandatory for non-EU manufacturers placing CE-marked goods on the European market (must appoint an EU Authorized Representative whose name/address appears on packaging).',
      'Mandatory for foreign electronics manufacturers applying for India BIS Compulsory Registration Scheme (must appoint an Authorized Indian Representative AIR).'
    ],
    whenOptionalOrSelf: [
      'Not required if the manufacturing company already has a physical registered subsidiary or branch office with resident staff in the destination territory.',
      'Not required for non-regulated general commodities (e.g. bulk raw minerals, unprinted paper).'
    ],
    keyDocumentsAndForms: [
      'U.S. Agent Designation Agreement & FDA Facility Registration Confirmation',
      'EU Authorized Representative (EC-REP) Mandate Agreement under Regulation (EU) 2019/1020',
      'Authorized Indian Representative (AIR) Undertaking & Power of Attorney',
      'Product Packaging Labeling displaying In-Country Representative Name & Address'
    ],
    typicalFeeRange: '$900 - $3,500 USD per year for professional regulatory representative retainer services',
    turnaroundTime: '2 to 5 business days to draft representation agreement and lodge formal designation',
    consequencesOfOmission: 'U.S. FDA automatically cancels facility registration and issues Import Alert; EU customs blocks entry at border for missing Article 4 responsible person; BIS application rejected.',
    officialVerificationRegistry: {
      name: 'U.S. FDA Food Facility Registration (FURLS / PNSI) & DUNS Verification',
      url: 'https://www.access.fda.gov',
      description: 'Official U.S. FDA directory where foreign facility records and appointed U.S. Agents are confirmed.'
    },
    stepByStepEngagementProtocol: [
      'Retain a specialized regulatory compliance firm with physical corporate presence in destination jurisdiction.',
      'Execute formal bilateral Representation Agreement detailing responsibilities for receiving inspection notices and technical files.',
      'Enter the representative’s legal name, physical address, and DUNS number into sovereign portal (FDA FURLS, EU ICSMS, or BIS CRS).',
      'Update product packaging artwork to clearly display the representative’s contact details before mass production.'
    ]
  },
  {
    id: 'STATUTORY_AUDITOR_CPA',
    title: 'Statutory Tax Auditors, Chartered Accountants (CAs) & Transfer Pricing Specialists',
    category: 'Tax Governance, Audit & Cross-Border Withholding',
    badge: 'Mandatory for Remittances, R&D & Related Parties',
    summary: 'Licensed accounting and tax practitioners (Fellows of ICAI, AICPA, ICAEW) holding statutory powers to audit cross-border transactions, certify withholding tax liability (Form 15CB), conduct transfer pricing studies, and certify financial net-worth.',
    applicableFlows: ['Services Import', 'Services Export', 'Goods Import', 'Goods Export'],
    keyStatutoryMandate: 'Section 195 & 92E of the Indian Income-tax Act 1961, IRC § 482 / § 6662, and OECD BEPS Action 13 (Transfer Pricing Documentation).',
    statuteCitation: 'Rule 37BB of Income-tax Rules 1962 and Part 4 Taxation (International and Other Provisions) Act 2010 (UK).',
    whenMandatory: [
      'Mandatory in India before any enterprise can remit outbound funds over ₹5 Lakhs for foreign services/SaaS (Chartered Accountant must audit invoice and sign Form 15CB with UDIN).',
      'Mandatory for all multinational enterprises conducting cross-border transactions between related subsidiaries (Transfer Pricing audit & Form 3CEB certification).',
      'Mandatory when claiming export incentive status (e.g. DGFT Status Holder net-worth certificates).',
      'Mandatory when filing post-entry Prior Disclosure under customs valuation or First Sale Rule.'
    ],
    whenOptionalOrSelf: [
      'Not required for simple domestic sales or outbound remittances specifically listed on statutory exemption lists (e.g. personal gifts under statutory limits).',
      'Transfer pricing audit not required for independent unrelated commercial parties.'
    ],
    keyDocumentsAndForms: [
      'Form 15CB (Accountant Certificate for Outward Foreign Remittances with UDIN)',
      'Form 3CEB (Statutory Transfer Pricing Audit Report under Section 92E)',
      'Transfer Pricing Local File & Master File (OECD BEPS Action 13)',
      'Chartered Accountant Net-Worth & Export Realization Certificate'
    ],
    typicalFeeRange: '$50 - $200 USD per Form 15CB certificate; $3,000 - $25,000 USD for complete annual Transfer Pricing study & audit',
    turnaroundTime: '1 to 3 business days for Form 15CB remittance audit; 3 to 6 weeks for comprehensive transfer pricing benchmarking',
    consequencesOfOmission: 'Authorized Dealer bank refuses to process outward SWIFT wire; penalty of ₹100,000 under Section 271-I; disallowance of entire service expense; 20-40% IRS transfer pricing penalty.',
    officialVerificationRegistry: {
      name: 'Institute of Chartered Accountants of India (ICAI) UDIN Verification Portal',
      url: 'https://udin.icai.org',
      description: 'Official government-backed cryptographic verification portal for every certificate signed by practicing Chartered Accountants.'
    },
    stepByStepEngagementProtocol: [
      'Compile supplier invoice, contract, Tax Residency Certificate (TRC), and Form 10F/W-8BEN-E.',
      'Engage an independent practicing Chartered Accountant / CPA.',
      'The auditor analyzes whether the fee constitutes Royalty, Fees for Technical Services (FTS), or Business Profits under DTAA treaty.',
      'The CA digitally signs Form 15CB or Form 3CEB, attaches the generated UDIN, and submits to the national revenue portal.'
    ]
  },
  {
    id: 'AUTHORIZED_DEALER_BANK',
    title: 'Authorized Dealer Banks & Trade Finance Desks',
    category: 'Foreign Exchange, Settlement & Regulatory Reporting',
    badge: 'Mandatory for All Cross-Border Money Flows',
    summary: 'Commercial banks holding Category-I foreign exchange licenses from national central banks (Federal Reserve, RBI, Bank of England, ECB) authorized to settle cross-border wires, issue Letters of Credit, and report exports to balance-of-payments monitoring systems.',
    applicableFlows: ['Goods Import', 'Goods Export', 'Services Import', 'Services Export'],
    keyStatutoryMandate: 'Foreign Exchange Management Act 1999 (FEMA), RBI Master Directions on Export/Import of Goods and Services, UCP 600 (Uniform Customs and Practice for Documentary Credits).',
    statuteCitation: 'FEMA 1999 Section 10 and Bank Secrecy Act / USA PATRIOT Act (31 CFR Chapter X).',
    whenMandatory: [
      'Mandatory for all cross-border commercial transactions: issuing AD Code certificates for customs port linkage (ICEGATE).',
      'Mandatory for processing international SWIFT wires, validating Form 15CA/CB before remittance, and executing RBI Form A2 foreign exchange declarations.',
      'Mandatory for closing export bills in central bank tracking systems (RBI EDPMS / IDPMS) and generating electronic Bank Realisation Certificates (e-BRC).',
      'Mandatory when trade contracts require documentary Letters of Credit (LC) or performance bank guarantees.'
    ],
    whenOptionalOrSelf: [
      'Self-banking online portals can initiate standard wires, but the underlying compliance review and EDPMS reconciliation are non-negotiable bank duties.',
      'Personal small remittances under LRS limits follow simplified declarations.'
    ],
    keyDocumentsAndForms: [
      'Authorized Dealer (AD) Code 14-Digit Letter (Annexure-A for Customs)',
      'RBI Form A2 (Foreign Exchange Purchase / Remittance Application)',
      'Electronic Bank Realisation Certificate (e-BRC) / Foreign Inward Remittance Statement (FIRS)',
      'Documentary Letter of Credit (LC under UCP 600 rules)',
      'Duty Deferment Direct Debit Guarantee Mandate'
    ],
    typicalFeeRange: '$15 - $50 per international wire + FX conversion spread (0.25% - 2%) + Letter of Credit opening fee (0.5% - 1.5% per annum)',
    turnaroundTime: '1 to 2 business days for wire settlement; 3 to 5 days for AD Code registration at customs ports',
    consequencesOfOmission: 'Without AD Code, customs will not generate Shipping Bills; without e-BRC, export proceeds treated as FEMA violation with bank freezing accounts; GST export refunds blocked.',
    officialVerificationRegistry: {
      name: 'Reserve Bank of India (RBI) Authorized Dealer Category-I Banks List',
      url: 'https://www.rbi.org.in/scripts/Fema.aspx',
      description: 'Official directory of banks authorized by the central bank to handle foreign currency trade transactions.'
    },
    stepByStepEngagementProtocol: [
      'Open a dedicated business current account with an Authorized Dealer Category-I bank.',
      'Request the physical 14-digit AD Code authorization letter on official bank letterhead with branch seal.',
      'Upload the AD Code onto ICEGATE / national customs portal and link to relevant ports of export/import.',
      'Ensure every foreign inward remittance is mapped to the corresponding Shipping Bill or SOFTEX number to generate e-BRC.'
    ]
  },
  {
    id: 'LICENSED_CUSTOMS_BROKER',
    title: 'Licensed Customs Brokers (LCBs) & Customs House Agents (CHAs)',
    category: 'Customs Valuation, Classification & Border Release',
    badge: 'Mandatory / Highly Recommended for Commercial Entry',
    summary: 'Professionals examined, licensed, and regulated by national customs administrations holding legal powers of attorney to classify goods, calculate ad-valorem tariffs, lodge EDI entry summaries, and represent importers before customs officers.',
    applicableFlows: ['Goods Import', 'Goods Export'],
    keyStatutoryMandate: '19 U.S.C. § 1641 and 19 CFR Part 111 (U.S. Customs Brokers), Indian Customs Brokers Licensing Regulations (CBLR 2018), and Union Customs Code (Regulation (EU) No 952/2013 Article 18).',
    statuteCitation: '19 U.S. Code § 1641 (Customs Brokers Licensing and Responsibilities).',
    whenMandatory: [
      'Mandatory in the EU for non-EU established companies (must appoint an Indirect Customs Representative who assumes joint and several liability for customs debt).',
      'Practically essential for commercial formal imports into the U.S. ($2,500+) unless the importer has direct ACE portal self-filing certification and dedicated EDI software.',
      'Mandatory for physical cargo examination, bonded warehouse entries, and complex tariff classification protests.'
    ],
    whenOptionalOrSelf: [
      'Self-filing is legally permitted in the U.S. for Importers of Record who complete CBP ACE portal certification.',
      'Not required for digital services, cross-border SaaS, or software downloads.'
    ],
    keyDocumentsAndForms: [
      'Customs Power of Attorney (CBP Form 5297 / Form 5106)',
      'CBP Form 7501 (Entry Summary) & Form 3461 (Immediate Delivery)',
      'Indian Customs Bill of Entry (Imports) & Shipping Bill (Exports) on ICEGATE',
      'UK CDS C88 Single Administrative Document (SAD)'
    ],
    typicalFeeRange: '$125 - $275 USD per entry declaration + PGA clearance handling ($25 - $50 for FDA, EPA, USDA)',
    turnaroundTime: 'Immediate pre-arrival electronic clearance (1 to 24 hours)',
    consequencesOfOmission: 'Misclassification errors result in retroactive duty clawback, cargo seizure, and negligence penalties up to the domestic value of goods under 19 U.S.C. § 1592.',
    officialVerificationRegistry: {
      name: 'U.S. Customs and Border Protection Licensed Customs Broker Directory',
      url: 'https://www.cbp.gov/trade/programs-administration/customs-brokers',
      description: 'Official CBP directory to verify active licenses and ports of operation for licensed customs brokers.'
    },
    stepByStepEngagementProtocol: [
      'Execute a bilateral Customs Power of Attorney (POA) with the licensed customs broker.',
      'Provide commercial invoice, packing list, bill of lading, and manufacturer origin details.',
      'Broker reviews product specifications and verifies exact 10-digit HTS commodity code.',
      'Broker transmits electronic entry summary into ACE / CDS / ICEGATE and monitors automated release status.'
    ]
  },
  {
    id: 'ENVIRONMENTAL_CARBON_VERIFIER',
    title: 'Accredited Environmental & Carbon Emissions Verifiers (CBAM & ESG)',
    category: 'Carbon Auditing & Climate Border Tariffs',
    badge: 'Mandatory for EU CBAM Goods',
    summary: 'Independent environmental auditing bodies accredited under ISO 14065 and the EU Emissions Trading System (EU ETS) empowered to audit industrial manufacturing facilities, verify direct (Scope 1) and indirect (Scope 2) greenhouse gas calculations, and certify carbon declarations.',
    applicableFlows: ['Goods Import'],
    keyStatutoryMandate: 'Regulation (EU) 2023/956 of the European Parliament and Council (Carbon Border Adjustment Mechanism CBAM) and Commission Implementing Regulation (EU) 2023/1773.',
    statuteCitation: 'Articles 8 and 18 of Regulation (EU) 2023/956 on the verification of emissions data.',
    whenMandatory: [
      'Mandatory starting 2026 for all imports of iron, steel, aluminium, cement, fertilizers, hydrogen, and electricity into the European Union.',
      'Mandatory for non-EU overseas installations wishing to prove actual emissions are lower than default standard benchmark values to reduce CBAM certificate surcharges.'
    ],
    whenOptionalOrSelf: [
      'During the transitional phase (2023-2025), default values and installation estimates can be reported quarterly without full independent verifier sign-off.',
      'Not applicable to commodities outside the six CBAM sectors (e.g. textiles, consumer electronics).'
    ],
    keyDocumentsAndForms: [
      'EU CBAM Verification Report (Accredited Verifier Signed)',
      'Installation-Level Greenhouse Gas Monitoring Methodology Plan (MMP)',
      'Specific Embedded Emissions Calculation Sheet (Scope 1 direct + Scope 2 electricity)'
    ],
    typicalFeeRange: '$4,000 - $18,000 USD per manufacturing installation audit depending on complexity and energy sources',
    turnaroundTime: '2 to 4 weeks for installation data audit and verification report generation',
    consequencesOfOmission: 'Importers will be subjected to the highest penal default emissions benchmarks, multiplying carbon tax costs; authorization to import CBAM goods revoked.',
    officialVerificationRegistry: {
      name: 'European Commission National Accreditation Bodies (NAB) Verifier Registry',
      url: 'https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en',
      description: 'Official EU database of verifiers accredited under ISO 14065 and Regulation (EU) 2018/2067.'
    },
    stepByStepEngagementProtocol: [
      'Identify whether the imported goods fall under Annex I of CBAM Regulation (e.g. HS 7208-7229, 7601-7608).',
      'Engage an ISO 14065 accredited verifier to audit primary manufacturing site energy balances.',
      'The verifier calculates verified emissions per metric tonne of finished product.',
      'Upload the verification report into the EU CBAM Transitional Registry portal.'
    ]
  },
  {
    id: 'MERCHANT_OF_RECORD',
    title: 'Merchants of Record (MoRs) & Global Digital Services Tax Intermediaries',
    category: 'SaaS Reseller & Multi-Jurisdiction Digital VAT Shield',
    badge: 'Strategic Alternative for Global SaaS',
    summary: 'Specialized legal and financial intermediaries (e.g., Paddle, FastSpring, Lemon Squeezy, Stripe Tax) that act as the legal reseller of software, SaaS subscriptions, and digital services, assuming 100% statutory liability for calculating, collecting, and remitting B2C VAT/GST/sales tax across 100+ countries.',
    applicableFlows: ['Services Export'],
    keyStatutoryMandate: 'EU Council Directive 2006/112/EC (Article 9a on deemed suppliers), U.S. Wayfair Economic Nexus Laws, and international Marketplace Facilitator statutes.',
    statuteCitation: 'Council Implementing Regulation (EU) No 282/2011 Article 9a.',
    whenMandatory: [
      'Voluntary strategic option: If a SaaS exporter does NOT want to register for VAT in all 27 EU nations (via OSS), all 50 U.S. states, UK, Canada, Australia, Japan, etc., appointing an MoR transfers all statutory tax collection and remittance liability to the MoR.',
      'Mandatory when selling via major app stores (Apple App Store, Google Play) which act as statutory deemed suppliers under global tax law.'
    ],
    whenOptionalOrSelf: [
      'If the SaaS company directly registers for EU Non-Union OSS, UK VAT, and state sales taxes, it does not need an MoR and can process payments directly via Stripe/Adyen.',
      'Not required for pure B2B cross-border contracts where reverse charge mechanism applies.'
    ],
    keyDocumentsAndForms: [
      'Merchant of Record Reseller Agreement',
      'Consolidated Periodic Payout & Global Tax Remittance Statements',
      'B2C Destination-Tax-Compliant Invoices Issued in MoR’s Legal Name'
    ],
    typicalFeeRange: '5% + $0.50 per transaction (all-inclusive covers payment processing, chargebacks, foreign exchange, and 100+ country tax filings)',
    turnaroundTime: 'Instant onboarding (1 to 2 business days to integrate checkout SDK)',
    consequencesOfOmission: 'If self-operating without MoR or direct VAT registrations: severe back-tax assessments, interest penalties up to 20%, and sales blocks from foreign revenue departments.',
    officialVerificationRegistry: {
      name: 'European Commission VAT Information Exchange System (VIES) & Marketplace Facilitator Rules',
      url: 'https://ec.europa.eu/taxation_customs/vies/',
      description: 'Official EU database verifying valid VAT numbers of licensed digital resellers and marketplaces.'
    },
    stepByStepEngagementProtocol: [
      'Assess whether B2C SaaS sales volume justifies direct tax registration in 50+ countries vs engaging an MoR.',
      'Integrate the MoR’s checkout SDK onto your SaaS pricing and checkout page.',
      'MoR automatically applies destination tax rates (e.g. 19% DE, 20% FR, 27% HU) based on buyer IP and billing card country.',
      'MoR files statutory tax returns in its own name with global tax authorities and remits net subscription revenue to you.'
    ]
  }
];


