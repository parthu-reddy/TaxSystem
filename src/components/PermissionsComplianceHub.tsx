import React, { useState, useMemo } from 'react';
import {
  TRADE_PERMISSIONS_DATABASE,
  ALL_TRADE_THIRD_PARTIES_DIRECTORY,
  TradePermission,
  ThirdPartyDirectoryItem
} from '../data/tradePermissionsDatabase.ts';
import {
  FileCheck2,
  ExternalLink,
  Search,
  Building,
  Landmark,
  UserCheck,
  Clock,
  DollarSign,
  AlertCircle,
  FileText,
  CheckCircle,
  Download,
  Filter,
  Layers,
  Briefcase,
  Globe2,
  Sparkles,
  Truck,
  ShieldCheck,
  Scale,
  Award,
  Check,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const PermissionsComplianceHub: React.FC = () => {
  // Navigation Tabs: 'permissions' | 'goodsvsservices' | 'thirdparties' | 'assessor'
  const [activeView, setActiveView] = useState<'permissions' | 'goodsvsservices' | 'thirdparties' | 'assessor'>('permissions');

  // Filters for Permissions List
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [macroFilter, setMacroFilter] = useState<'all' | 'goods' | 'services'>('all');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [filterThirdParty, setFilterThirdParty] = useState<
    'all' | 'auditor' | 'bank' | 'broker' | 'forwarder' | 'testing' | 'surety' | 'chamber' | 'agent'
  >('all');
  const [expandedId, setExpandedId] = useState<string>(TRADE_PERMISSIONS_DATABASE[0]?.id || '');

  // Filters for Third-Party Directory
  const [tpFlowFilter, setTpFlowFilter] = useState<string>('All');
  const [tpSearch, setTpSearch] = useState<string>('');
  const [expandedTpId, setExpandedTpId] = useState<string>(ALL_TRADE_THIRD_PARTIES_DIRECTORY[0]?.id || '');

  // Assessor State
  const [assessorTradeType, setAssessorTradeType] = useState<'Goods Import' | 'Goods Export' | 'Services Export' | 'Services Import'>('Goods Import');
  const [assessorDestination, setAssessorDestination] = useState<
    'US' | 'EU' | 'IN' | 'GB' | 'CN' | 'JP' | 'CA' | 'AU' | 'SG' | 'AE' | 'SA' | 'BR' | 'GLOBAL'
  >('US');
  const [isMaritimeOcean, setIsMaritimeOcean] = useState<boolean>(true);
  const [isRegulatedProduct, setIsRegulatedProduct] = useState<boolean>(false);
  const [isRelatedParty, setIsRelatedParty] = useState<boolean>(false);
  const [isClaimingFta, setIsClaimingFta] = useState<boolean>(true);
  const [isB2cConsumer, setIsB2cConsumer] = useState<boolean>(false);
  const [isHighValue, setIsHighValue] = useState<boolean>(true);

  // Dynamic Regime Counts
  const goodsRegimesCount = useMemo(() => {
    return TRADE_PERMISSIONS_DATABASE.filter(
      (p) => p.type === 'Goods Import' || p.type === 'Goods Export' || p.type === 'Dual-Use & Export Control'
    ).length;
  }, []);

  const servicesRegimesCount = useMemo(() => {
    return TRADE_PERMISSIONS_DATABASE.filter(
      (p) => p.type === 'Services Export' || p.type === 'Services Import'
    ).length;
  }, []);

  // Filtered Permissions List
  const filteredPermissions = useMemo(() => {
    return TRADE_PERMISSIONS_DATABASE.filter((perm) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        perm.title.toLowerCase().includes(q) ||
        perm.countryName.toLowerCase().includes(q) ||
        perm.issuingAuthority.toLowerCase().includes(q) ||
        perm.statuteCitation.toLowerCase().includes(q) ||
        perm.officialForms.some((f) => f.formNumber.toLowerCase().includes(q) || f.formName.toLowerCase().includes(q)) ||
        (perm.thirdPartyRequirements.auditorRoleDescription && perm.thirdPartyRequirements.auditorRoleDescription.toLowerCase().includes(q)) ||
        (perm.thirdPartyRequirements.bankRoleDescription && perm.thirdPartyRequirements.bankRoleDescription.toLowerCase().includes(q)) ||
        (perm.thirdPartyRequirements.entities &&
          perm.thirdPartyRequirements.entities.some(
            (e) => e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.roleDescription.toLowerCase().includes(q)
          ));

      const matchesMacro =
        macroFilter === 'all' ||
        (macroFilter === 'goods' && (perm.type === 'Goods Import' || perm.type === 'Goods Export' || perm.type === 'Dual-Use & Export Control')) ||
        (macroFilter === 'services' && (perm.type === 'Services Export' || perm.type === 'Services Import'));

      const matchesType = selectedType === 'All' || perm.type === selectedType;
      const matchesCountry =
        selectedCountry === 'All' ||
        perm.countryCode === selectedCountry ||
        (selectedCountry === 'GLOBAL' && perm.jurisdictionScope === 'Global / Multilateral');

      let matchesThirdParty = true;
      if (filterThirdParty === 'auditor') {
        matchesThirdParty = perm.thirdPartyRequirements.auditorRequired;
      } else if (filterThirdParty === 'bank') {
        matchesThirdParty = perm.thirdPartyRequirements.bankRequired;
      } else if (filterThirdParty === 'broker') {
        matchesThirdParty = perm.thirdPartyRequirements.customsBrokerRequired;
      } else if (filterThirdParty === 'forwarder') {
        matchesThirdParty =
          (perm.thirdPartyRequirements.otherThirdParty?.toLowerCase().includes('forwarder') ?? false) ||
          (perm.thirdPartyRequirements.entities?.some((e) => e.category.includes('Freight Forwarder')) ?? false);
      } else if (filterThirdParty === 'testing') {
        matchesThirdParty =
          (perm.thirdPartyRequirements.otherThirdParty?.toLowerCase().includes('notified body') ?? false) ||
          (perm.thirdPartyRequirements.otherThirdParty?.toLowerCase().includes('laboratory') ?? false) ||
          (perm.thirdPartyRequirements.entities?.some((e) => e.category.includes('Testing Lab')) ?? false);
      } else if (filterThirdParty === 'surety') {
        matchesThirdParty =
          (perm.thirdPartyRequirements.otherThirdParty?.toLowerCase().includes('surety') ?? false) ||
          (perm.thirdPartyRequirements.entities?.some((e) => e.category.includes('Surety')) ?? false);
      } else if (filterThirdParty === 'chamber') {
        matchesThirdParty =
          (perm.thirdPartyRequirements.otherThirdParty?.toLowerCase().includes('chamber') ?? false) ||
          (perm.thirdPartyRequirements.entities?.some((e) => e.category.includes('Chamber')) ?? false);
      } else if (filterThirdParty === 'agent') {
        matchesThirdParty =
          (perm.thirdPartyRequirements.otherThirdParty?.toLowerCase().includes('agent') ?? false) ||
          (perm.thirdPartyRequirements.otherThirdParty?.toLowerCase().includes('representative') ?? false) ||
          (perm.thirdPartyRequirements.entities?.some((e) => e.category.includes('Representative')) ?? false);
      }

      return matchesSearch && matchesType && matchesCountry && matchesThirdParty && matchesMacro;
    });
  }, [searchQuery, macroFilter, selectedType, selectedCountry, filterThirdParty]);

  const activePermission = useMemo(() => {
    return (
      TRADE_PERMISSIONS_DATABASE.find((p) => p.id === expandedId) ||
      filteredPermissions[0] ||
      TRADE_PERMISSIONS_DATABASE[0]
    );
  }, [expandedId, filteredPermissions]);

  // Filtered Third Parties Directory
  const filteredThirdParties = useMemo(() => {
    return ALL_TRADE_THIRD_PARTIES_DIRECTORY.filter((tp) => {
      const q = tpSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tp.title.toLowerCase().includes(q) ||
        tp.category.toLowerCase().includes(q) ||
        tp.summary.toLowerCase().includes(q) ||
        tp.keyStatutoryMandate.toLowerCase().includes(q) ||
        tp.keyDocumentsAndForms.some((doc) => doc.toLowerCase().includes(q));

      const matchesFlow = tpFlowFilter === 'All' || tp.applicableFlows.includes(tpFlowFilter as any);

      return matchesSearch && matchesFlow;
    });
  }, [tpSearch, tpFlowFilter]);

  const activeTp = useMemo(() => {
    return (
      ALL_TRADE_THIRD_PARTIES_DIRECTORY.find((t) => t.id === expandedTpId) ||
      filteredThirdParties[0] ||
      ALL_TRADE_THIRD_PARTIES_DIRECTORY[0]
    );
  }, [expandedTpId, filteredThirdParties]);

  // Assessor Evaluation Logic
  const assessedThirdParties = useMemo(() => {
    const mandatory: Array<{ title: string; category: string; mandate: string; reason: string; forms: string[]; registryUrl?: string }> = [];
    const conditional: Array<{ title: string; category: string; mandate: string; reason: string; forms: string[]; registryUrl?: string }> = [];
    const selfFiling: Array<{ title: string; tasks: string; portal: string }> = [];
    let estMinCost = 0;
    let estMaxCost = 0;
    let estLeadTime = '2 to 5 business days';

    // 1. Bank
    mandatory.push({
      title: 'Authorized Dealer (AD) Commercial Bank',
      category: 'Banking & Foreign Exchange',
      mandate: 'FEMA 1999 (Section 10) / USA PATRIOT Act & UCP 600',
      reason: 'Mandatory for foreign exchange settlement, AD Code customs port registration, SWIFT outward wire verification, and e-BRC / EDPMS realization.',
      forms: ['AD Code Authorization Letter', 'RBI Form A2 / SWIFT MT103', 'e-BRC / FIRS Statement'],
      registryUrl: 'https://www.rbi.org.in'
    });
    estMinCost += 50;
    estMaxCost += 200;

    // Goods Import Specifics
    if (assessorTradeType === 'Goods Import') {
      if (assessorDestination === 'US') {
        mandatory.push({
          title: 'Treasury-Approved Surety Bond Underwriter',
          category: 'Financial Guarantee',
          mandate: '19 U.S.C. § 1623 and 31 CFR Part 223 (Treasury Circular 570)',
          reason: 'Mandatory continuous $50,000+ customs bond (CBP Form 301) required for all formal commercial entries over $2,500.',
          forms: ['CBP Form 301 (Continuous Customs Bond)', 'ISF Bond Rider (Appendix D)'],
          registryUrl: 'https://www.fiscal.treasury.gov/surety-bonds/list-certified-companies.html'
        });
        estMinCost += 400;
        estMaxCost += 600;

        if (isMaritimeOcean) {
          mandatory.push({
            title: 'FMC-Licensed Ocean Freight Forwarder / NVOCC',
            category: 'Maritime Logistics',
            mandate: 'SAFE Port Act of 2006 (6 U.S.C. § 943) & 19 CFR Part 149',
            reason: 'Mandatory filing of Importer Security Filing (ISF 10+2) at least 24 hours prior to container vessel loading at foreign port.',
            forms: ['CBP ISF-10 Confirmation', 'Ocean Bill of Lading (B/L)'],
            registryUrl: 'https://www.fmc.gov/resources-services/oti-list/'
          });
          estMinCost += 50;
          estMaxCost += 150;
        }

        mandatory.push({
          title: 'Licensed U.S. Customs Broker (LCB)',
          category: 'Customs Clearance',
          mandate: '19 U.S.C. § 1641 and 19 CFR Part 111',
          reason: 'Customs Power of Attorney authorized to classify HTS codes, calculate ad-valorem MPF duties, and transmit ACE Entry Summaries.',
          forms: ['CBP Form 7501 (Entry Summary)', 'CBP Form 3461 (Release)'],
          registryUrl: 'https://www.cbp.gov/trade/programs-administration/customs-brokers'
        });
        estMinCost += 150;
        estMaxCost += 300;
      } else if (assessorDestination === 'EU') {
        mandatory.push({
          title: 'EU-Established Indirect Customs Representative (Broker)',
          category: 'Customs Clearance',
          mandate: 'Union Customs Code (Regulation (EU) No 952/2013 Article 18)',
          reason: 'Mandatory for non-EU established companies; the indirect representative is jointly and severally liable for customs debt.',
          forms: ['Single Administrative Document (SAD / DAU)', 'Entry Summary Declaration (ENS)'],
          registryUrl: 'https://taxation-customs.ec.europa.eu'
        });
        estMinCost += 120;
        estMaxCost += 280;
      } else if (assessorDestination === 'IN') {
        mandatory.push({
          title: 'Licensed Indian Customs Broker (CHA)',
          category: 'Customs Clearance',
          mandate: 'Customs Brokers Licensing Regulations (CBLR 2018) & Customs Act 1962',
          reason: 'Mandatory for filing electronic Bill of Entry on ICEGATE using Class 3 Digital Signature Certificate (DSC).',
          forms: ['ICEGATE Bill of Entry', 'Duty Payment Challan via Bharatkosh'],
          registryUrl: 'https://www.icegate.gov.in'
        });
        estMinCost += 80;
        estMaxCost += 200;
      } else if (assessorDestination === 'GB') {
        mandatory.push({
          title: 'Licensed UK Customs Declaration Service (CDS) Customs Agent',
          category: 'Customs Clearance',
          mandate: 'Taxation (Cross-border Trade) Act 2018 & Customs (Import Duty) Regulations 2018',
          reason: 'Mandatory representation for lodging electronic import declarations on CDS using a valid GB EORI number and handling Customs Duty and Import VAT.',
          forms: ['CDS Customs Declaration Entry', 'HMRC C79 Import VAT Certificate'],
          registryUrl: 'https://www.gov.uk/guidance/appoint-someone-to-deal-with-customs-on-your-behalf'
        });
        estMinCost += 75;
        estMaxCost += 220;
      } else if (assessorDestination === 'CN') {
        mandatory.push({
          title: 'Licensed Chinese Customs Broker (报关企业) & In-Country Consignee',
          category: 'Customs Clearance & Single Window',
          mandate: 'Customs Law of the PRC Article 10 & GACC Decree 249 Article 8',
          reason: 'Mandatory licensed broker holding China E-Port IC Card to lodge Single Window declaration; non-resident foreign manufacturers must appoint registered domestic consignee.',
          forms: ['China Customs Import Goods Declaration (进口货物报关单)', 'Domestic Consignee Record-Filing Certificate (收发货人备案)'],
          registryUrl: 'http://credit.customs.gov.cn'
        });
        estMinCost += 100;
        estMaxCost += 350;
      } else if (assessorDestination === 'JP') {
        mandatory.push({
          title: 'Attorney for Customs Procedures (ACP / 税関事務管理人) & Japanese Customs Broker',
          category: 'Customs Procedures Representative',
          mandate: 'Japan Customs Act (関税法) Article 95 & Customs Brokerage Act',
          reason: 'Legally compulsory resident representative for foreign non-resident importers to assume legal responsibility for NACCS entries, duty settlements, and customs audits.',
          forms: ['Form C-1010 (Notification of ACP)', 'NACCS Electronic Import Declaration (輸入申告書 Form C-5020)'],
          registryUrl: 'https://www.customs.go.jp'
        });
        estMinCost += 300;
        estMaxCost += 800;
      } else if (assessorDestination === 'CA') {
        mandatory.push({
          title: 'CARM Surety Bond Underwriter & Licensed Canadian Customs Broker',
          category: 'Customs Financial Security & Brokerage',
          mandate: 'Customs Act (R.S.C., 1985, c. 1 (2nd Supp.)) Section 17 & CARM RPP Rules',
          reason: 'Mandatory electronic customs surety bond (minimum $25,000 CAD) posted on CARM Client Portal to obtain Release Prior to Payment (RPP) privileges and transmit CAD.',
          forms: ['Electronic CARM Customs Bond Agreement', 'Commercial Accounting Declaration (CAD)'],
          registryUrl: 'https://ccp-pcc.cbsa-asfc.gc.ca'
        });
        estMinCost += 350;
        estMaxCost += 650;
      } else if (assessorDestination === 'AU') {
        mandatory.push({
          title: 'Licensed Australian Customs Broker (ABF Accredited)',
          category: 'Border Force Clearance',
          mandate: 'Customs Act 1901 (Cth) Section 181 & Biosecurity Act 2015',
          reason: 'Legally authorized customs broker holding Gatekeeper PKI digital certificate to lodge Nature 10 (N10) Full Import Declarations in the Integrated Cargo System (ICS).',
          forms: ['Form B650 (N10 Full Import Declaration)', 'ABF Customs Entry Summary Receipt'],
          registryUrl: 'https://www.abf.gov.au/importing-exporting-and-manufacturing/customs-brokers'
        });
        estMinCost += 120;
        estMaxCost += 280;
      } else if (assessorDestination === 'SG') {
        mandatory.push({
          title: 'Singapore Customs Registered Declaring Agent',
          category: 'TradeNet Customs Broker',
          mandate: 'Customs Act (Cap. 70) & Regulation of Imports and Exports Act',
          reason: 'Mandatory licensed Declaring Agent to lodge TradeNet Inward Payment Permit (INP) and debit duties/GST via bank Inter-Bank GIRO (IBG).',
          forms: ['TradeNet Inward Payment Permit (INP)', 'Form SC-A-001 (Bank GIRO Application)'],
          registryUrl: 'https://www.customs.gov.sg'
        });
        estMinCost += 40;
        estMaxCost += 120;
      } else if (assessorDestination === 'AE') {
        mandatory.push({
          title: 'Licensed UAE Customs Clearing Agent (Dubai Trade MERSAL-2)',
          category: 'Customs Clearance',
          mandate: 'GCC Common Customs Law Article 107 & Dubai Trade Procedures',
          reason: 'Mandatory licensed customs agent to lodge electronic import declarations in MERSAL-2 and process customs inspection exit orders.',
          forms: ['MERSAL-2 Import Declaration', 'Customs Inspection Exit Order'],
          registryUrl: 'https://www.dubaitrade.ae'
        });
        estMinCost += 80;
        estMaxCost += 220;
      } else if (assessorDestination === 'SA') {
        mandatory.push({
          title: 'SASO-Accredited Conformity Body & ZATCA Licensed Broker',
          category: 'Product Conformity & Customs',
          mandate: 'Saudi Product Safety Program (SALEEM) & ZATCA Customs Regulations',
          reason: 'Mandatory SABER Product (PCoC) and Shipment (SCoC) conformity certificates and Fasah single window declaration.',
          forms: ['SABER PCoC / SCoC Certificate', 'Fasah Customs Bayan Declaration'],
          registryUrl: 'https://saber.sa'
        });
        estMinCost += 500;
        estMaxCost += 1400;
      } else if (assessorDestination === 'BR') {
        mandatory.push({
          title: 'Licensed Brazilian Customs Broker (Despachante Aduaneiro Credenciado)',
          category: 'Customs Representation',
          mandate: 'Decreto Federal nº 6.759/2009 (Regulamento Aduaneiro) Article 809',
          reason: 'Exclusive legal intermediary authorized to represent the importer before Receita Federal, lodge DUIMP in Portal Único Siscomex, and process customs clearance channels.',
          forms: ['DUIMP (Declaração Única de Importação)', 'Comprovante de Importação (CI)'],
          registryUrl: 'https://www.gov.br/receitafederal'
        });
        estMinCost += 200;
        estMaxCost += 500;
      } else if (assessorDestination === 'GLOBAL') {
        mandatory.push({
          title: 'WCO-Accredited Local Customs Clearing Agent',
          category: 'International Customs Clearance',
          mandate: 'World Customs Organization (WCO) Revised Kyoto Convention (General Annex Chapter 3)',
          reason: 'In-country authorized customs broker to process national tariff declarations and customs debt.',
          forms: ['National Customs Import Declaration', 'Commercial Invoice & Packing List'],
          registryUrl: 'https://www.wcoomd.org'
        });
        estMinCost += 100;
        estMaxCost += 300;
      }

      if (isRegulatedProduct) {
        mandatory.push({
          title: 'Accredited Testing Laboratory / Notified Body (TIC)',
          category: 'Product Safety',
          mandate: 'ISO/IEC 17025 Accreditation & National Safety Directives (CE / BIS CRS / SASO / ECAS / PSE)',
          reason: 'Compulsory sample testing and type examination certification before border customs release.',
          forms: ['ISO/IEC 17025 Accredited Test Report', 'EU Type Examination Certificate / BIS R-Number / ECAS CoC'],
          registryUrl: 'https://ec.europa.eu/growth/tools-databases/nando/'
        });
        mandatory.push({
          title: 'In-Country Legal Representative / Resident Agent',
          category: 'Regulatory Notice',
          mandate: '21 CFR § 1.227 (FDA Agent) / EU Reg 2019/1020 Art 4 / Japan ACP / China Consignee',
          reason: 'Mandatory physical resident entity in destination territory legally responsible for receiving compliance notices.',
          forms: ['Resident Agent Designation Agreement', 'Packaging Label Display'],
          registryUrl: 'https://www.access.fda.gov'
        });
        estMinCost += 1500;
        estMaxCost += 5000;
        estLeadTime = '3 to 6 weeks (Lab Testing & Facility Registration)';
      }
    }

    // Goods Export Specifics
    if (assessorTradeType === 'Goods Export') {
      if (isClaimingFta) {
        mandatory.push({
          title: 'Authorized Chamber of Commerce & Industry (ICC WCF)',
          category: 'Origin Certification',
          mandate: 'WTO Agreement on Rules of Origin and Free Trade Agreement Rules',
          reason: 'Mandatory certification of Certificate of Origin (COO) verifying Regional Value Content (RVC) to grant 0% preferential duties.',
          forms: ['Preferential Certificate of Origin (COO)', 'Electronic e-COO with QR Verification'],
          registryUrl: 'https://iccwbo.org/business-solutions/certificates-of-origin/'
        });
        estMinCost += 25;
        estMaxCost += 100;
      }

      if (assessorDestination === 'SA') {
        mandatory.push({
          title: 'SASO-Accredited Conformity Assessment Body (SGS/Intertek/Bureau Veritas)',
          category: 'Pre-Shipment Inspection (PSI)',
          mandate: 'Saudi Product Safety Program (SALEEM) & Royal Decree M/14',
          reason: 'Mandatory testing, technical file audit, and issuance of Product (PCoC) and Shipment (SCoC) Certificates of Conformity via SABER.',
          forms: ['SABER PCoC', 'SABER SCoC'],
          registryUrl: 'https://saber.sa'
        });
        estMinCost += 600;
        estMaxCost += 1500;
      } else if (assessorDestination === 'CN') {
        mandatory.push({
          title: 'MOFCOM Dual-Use Classification Specialist & SAFE Bank',
          category: 'Export Control & Foreign Exchange',
          mandate: 'PRC Export Control Law & Regulations on Dual-Use Technologies',
          reason: 'Mandatory screening against Export Control Catalogue and SAFE Foreign Exchange Directory registration before foreign payments can be settled.',
          forms: ['MOFCOM Dual-Use Export License Application', 'SAFE Directory Registration Record'],
          registryUrl: 'http://licenceapp.ec.com.cn'
        });
        estMinCost += 200;
        estMaxCost += 600;
      } else if (assessorDestination === 'JP') {
        mandatory.push({
          title: 'CISTEC Certified Parameter Sheet Specialist (METI Export Control)',
          category: 'Security Export Control',
          mandate: 'Foreign Exchange and Foreign Trade Act (FEFTA) Articles 25 and 48',
          reason: 'Parameter sheet classification (該非判定) and End-Use Statement verification for advanced technology transfer.',
          forms: ['METI-EXP-7010 Application', 'CISTEC Parameter Sheet (項目別対比表)'],
          registryUrl: 'https://www.cistec.or.jp'
        });
        estMinCost += 150;
        estMaxCost += 500;
      }
    }

    // Services Import Specifics
    if (assessorTradeType === 'Services Import') {
      mandatory.push({
        title: 'Independent Practicing Chartered Accountant (CA) / CPA',
        category: 'Statutory Tax Audit',
        mandate: 'Section 195 & Rule 37BB Income-tax Act 1961 (Form 15CB)',
        reason: 'Mandatory statutory audit of invoice, treaty relief determination under DTAA, and digital signing of Form 15CB with official UDIN before bank allows outward remittance.',
        forms: ['Form 15CB (Accountant Certificate with UDIN)', 'Tax Residency Certificate (TRC) Validation'],
        registryUrl: 'https://udin.icai.org'
      });
      estMinCost += 50;
      estMaxCost += 250;
    }

    // Services Export Specifics (SaaS / Tech Consulting)
    if (assessorTradeType === 'Services Export') {
      if (isB2cConsumer) {
        conditional.push({
          title: 'Merchant of Record (MoR - Paddle, FastSpring, Stripe Tax)',
          category: 'Global Digital Tax Intermediary',
          mandate: 'EU Council Directive 2006/112/EC Art 9a & Wayfair Economic Nexus',
          reason: 'Strategic alternative: Transfers 100% legal responsibility for filing B2C digital services VAT/sales tax in 100+ countries to the reseller.',
          forms: ['Merchant of Record Reseller Agreement', 'Consolidated Tax Settlement Report'],
          registryUrl: 'https://ec.europa.eu/taxation_customs/vies/'
        });
      }

      if (assessorDestination === 'IN') {
        mandatory.push({
          title: 'Software Technology Parks of India (STPI) Designated Authority',
          category: 'Software Export Certification',
          mandate: 'RBI Master Direction No. 16/2015-16 & FEMA 1999',
          reason: 'Mandatory submission and government certification of Form SOFTEX within 30 days of software/SaaS export invoice to obtain foreign remittance e-BRC.',
          forms: ['Form SOFTEX Certified Copy', 'RBI EDPMS Export Realization Record'],
          registryUrl: 'https://stpi.in'
        });
        estMinCost += 40;
        estMaxCost += 150;
      } else if (assessorDestination === 'CA') {
        mandatory.push({
          title: 'Canada Revenue Agency (CRA) Simplified Digital Economy Registration',
          category: 'Non-Resident Digital GST/HST',
          mandate: 'Excise Tax Act Part IX (Cross-Border Digital Economy Measures)',
          reason: 'Mandatory simplified registration for non-resident digital service and SaaS providers selling over $30,000 CAD to Canadian retail consumers.',
          forms: ['Form GST74 Application', 'Form GST59 Quarterly Return'],
          registryUrl: 'https://www.canada.ca/en/revenue-agency/services/e-services/digital-economy.html'
        });
        estMinCost += 100;
        estMaxCost += 400;
      } else if (assessorDestination === 'AU') {
        mandatory.push({
          title: 'Australian Taxation Office (ATO) Simplified GST for Non-Residents',
          category: 'Inbound Intangible Consumer Supplies',
          mandate: 'A New Tax System (Goods and Services Tax) Act 1999 Subdivision 84-D',
          reason: 'Mandatory registration with Australian Reference Number (ARN) for foreign SaaS providers exceeding $75,000 AUD sales to Australian consumers.',
          forms: ['Form ATO-ARN', 'Simplified Non-Resident BAS Return'],
          registryUrl: 'https://bp.ato.gov.au'
        });
        estMinCost += 100;
        estMaxCost += 350;
      } else if (assessorDestination === 'SG') {
        mandatory.push({
          title: 'IRAS Overseas Vendor Registration (OVR) Simplified GST Regime',
          category: 'Pay-Only Simplified Digital GST',
          mandate: 'Singapore Goods and Services Tax Act 1993 Section 14A',
          reason: 'Mandatory pay-only registration for overseas digital service providers with global turnover > $1M SGD and Singapore consumer sales > $100k SGD.',
          forms: ['Form GST-OVR', 'Form GST F5 Return'],
          registryUrl: 'https://mytax.iras.gov.sg'
        });
        estMinCost += 100;
        estMaxCost += 300;
      } else if (assessorDestination === 'US') {
        mandatory.push({
          title: 'IRS Form W-8BEN-E & Withholding Tax Treaty Validation',
          category: 'U.S. Cross-Border Tax Treaty Relief',
          mandate: 'Internal Revenue Code 26 U.S.C. §§ 1441-1442 and Chapter 4 FATCA',
          reason: 'Mandatory certification of foreign status and treaty claim (0% business profits under Article 7) to prevent default 30% IRS backup withholding.',
          forms: ['Form W-8BEN-E Signed Certificate', 'Form 1042-S Annual Information Return'],
          registryUrl: 'https://www.irs.gov/forms-pubs/about-form-w-8-ben-e'
        });
        estMinCost += 50;
        estMaxCost += 200;
      }
    }

    // Related Party Transfer Pricing
    if (isRelatedParty) {
      mandatory.push({
        title: 'Statutory Transfer Pricing Auditor & Economic Benchmarking Specialist',
        category: 'Cross-Border Transfer Pricing',
        mandate: 'Section 92E Income-tax Act 1961, IRC § 482 & OECD BEPS Action 13',
        reason: 'Compulsory independent audit of related-party pricing, arm’s length markups, and statutory certification (Form 3CEB / OECD Local File).',
        forms: ['Form 3CEB Audit Report with UDIN', 'OECD Transfer Pricing Local & Master File'],
        registryUrl: 'https://udin.icai.org'
      });
      estMinCost += 3000;
      estMaxCost += 15000;
      estLeadTime = '3 to 8 weeks (Benchmarking Study & Audit)';
    }

    // Self-Filing permitted tasks
    selfFiling.push({
      title: 'Company Importer/Exporter Registration',
      tasks: 'Apply for DGFT IEC (India), GB EORI (UK), or IRS EIN / CBP Form 5106 (US).',
      portal: 'National Government Trade / Revenue Portals'
    });
    selfFiling.push({
      title: 'GST Letter of Undertaking (LUT)',
      tasks: 'Furnish Form GST RFD-11 online for instant 0% IGST export clearance.',
      portal: 'Goods and Services Tax (GST) Common Portal'
    });
    selfFiling.push({
      title: 'IRS Form W-8BEN-E Self-Certification',
      tasks: 'Self-execute Part I, Part III (Article 7 Business Profits 0% treaty), and Part XXX.',
      portal: 'Direct Transmission to U.S. Client Accounts Payable'
    });

    return {
      mandatory,
      conditional,
      selfFiling,
      estimatedBudget: `$${estMinCost.toLocaleString()} - $${estMaxCost.toLocaleString()} USD`,
      estimatedLeadTime: estLeadTime
    };
  }, [
    assessorTradeType,
    assessorDestination,
    isMaritimeOcean,
    isRegulatedProduct,
    isRelatedParty,
    isClaimingFta,
    isB2cConsumer,
    isHighValue
  ]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Trade Permissions, Statutory Forms & Third-Party Advisory Ecosystem
            </h2>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>100% Official Govt Evidence & Statutes</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Exhaustive legal permissions, step-by-step application instructions, downloadable government forms with submission portals, and a complete directory of all 10 third-party intermediaries (Banks, Auditors, Freight Forwarders, Testing Labs, Sureties, Chambers of Commerce, Regulatory Agents, and Customs Brokers).
          </p>
        </div>

        {/* Global Quick Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Statutory Regimes</span>
            <span className="text-base font-bold font-mono text-slate-900">{TRADE_PERMISSIONS_DATABASE.length} Clearances</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 text-right">
            <span className="text-[10px] text-indigo-700 block uppercase font-bold tracking-wider">Third-Party Roles</span>
            <span className="text-base font-bold font-mono text-indigo-900">10 Certified Roles</span>
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/80 rounded-xl max-w-fit text-xs font-medium">
        <button
          onClick={() => setActiveView('permissions')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeView === 'permissions'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>Regulatory Clearances & Forms ({TRADE_PERMISSIONS_DATABASE.length})</span>
        </button>

        <button
          onClick={() => setActiveView('goodsvsservices')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeView === 'goodsvsservices'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4 text-cyan-600" />
          <span>Goods vs. Services Forms Breakdown (Why Forms Differ)</span>
        </button>

        <button
          onClick={() => setActiveView('thirdparties')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeView === 'thirdparties'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4 text-amber-600" />
          <span>Third-Party Ecosystem & Advisory Matrix (10 Roles)</span>
        </button>

        <button
          onClick={() => setActiveView('assessor')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeView === 'assessor'
              ? 'bg-white text-slate-900 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Third-Party Mandate Assessor</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: REGULATORY CLEARANCES & OFFICIAL FORMS DOSSIER                    */}
      {/* ========================================================================= */}
      {activeView === 'permissions' && (
        <div className="space-y-6">
          {/* Goods vs Services Macro Paradigm Toggle */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-indigo-600" />
                <span>Trade Nature:</span>
              </span>
              <span className="text-slate-500 text-[11px] hidden md:inline">
                (Statutory forms, agencies & border checks diverge completely between physical goods and intangible services)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setMacroFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  macroFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Regimes ({TRADE_PERMISSIONS_DATABASE.length})
              </button>
              <button
                onClick={() => setMacroFilter('goods')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  macroFilter === 'goods'
                    ? 'bg-cyan-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Physical Goods ({goodsRegimesCount} Regimes)</span>
              </button>
              <button
                onClick={() => setMacroFilter('services')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  macroFilter === 'services'
                    ? 'bg-indigo-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>Services & SaaS ({servicesRegimesCount} Regimes)</span>
              </button>
            </div>
          </div>

          {/* Filters and Search Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by form number (e.g. 7501, 15CB, W-8BEN-E, EORI, ANF-2A, ISF-10, SABER), authority, or statute..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Third-Party Assistance Filter */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
                <span className="text-[11px] text-slate-500 font-medium px-2 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-slate-400" />
                  <span>Third-Party Filter:</span>
                </span>
                <button
                  onClick={() => setFilterThirdParty('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    filterThirdParty === 'all'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterThirdParty('auditor')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    filterThirdParty === 'auditor'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Briefcase className="w-3 h-3 text-amber-600" />
                  <span>Auditor / CA</span>
                </button>
                <button
                  onClick={() => setFilterThirdParty('bank')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    filterThirdParty === 'bank'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Landmark className="w-3 h-3 text-blue-600" />
                  <span>Bank / AD</span>
                </button>
                <button
                  onClick={() => setFilterThirdParty('broker')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    filterThirdParty === 'broker'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                  <span>Customs Broker</span>
                </button>
                <button
                  onClick={() => setFilterThirdParty('forwarder')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    filterThirdParty === 'forwarder'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Truck className="w-3 h-3 text-cyan-600" />
                  <span>Freight Forwarder</span>
                </button>
                <button
                  onClick={() => setFilterThirdParty('testing')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    filterThirdParty === 'testing'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Award className="w-3 h-3 text-purple-600" />
                  <span>TIC / Notified Body</span>
                </button>
              </div>
            </div>

            {/* Category & Jurisdiction buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 font-medium mr-1">Activity:</span>
                {['All', 'Goods Import', 'Goods Export', 'Services Export', 'Services Import', 'Dual-Use & Export Control'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      selectedType === t
                        ? 'bg-slate-900 text-white shadow-xs font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Country / Scope:</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Jurisdictions ({TRADE_PERMISSIONS_DATABASE.length})</option>
                  <option value="US">United States (US)</option>
                  <option value="EU">European Union (EU)</option>
                  <option value="GB">United Kingdom (GB)</option>
                  <option value="IN">India (IN)</option>
                  <option value="CN">China (CN)</option>
                  <option value="JP">Japan (JP)</option>
                  <option value="CA">Canada (CA)</option>
                  <option value="AU">Australia (AU)</option>
                  <option value="SG">Singapore (SG)</option>
                  <option value="AE">United Arab Emirates (AE)</option>
                  <option value="SA">Saudi Arabia & GCC (SA)</option>
                  <option value="BR">Brazil (BR)</option>
                  <option value="GLOBAL">Global / Bilateral Treaties (GLOBAL)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main 2-Column Split: Permissions List on Left, Comprehensive Step-by-Step Dossier on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: List of Permissions (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 flex items-center justify-between">
                <span>Regulatory Permissions ({filteredPermissions.length})</span>
                <span>Category / Scope</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[750px] overflow-y-auto">
                {filteredPermissions.map((perm) => {
                  const isSelected = activePermission?.id === perm.id;
                  return (
                    <button
                      key={perm.id}
                      onClick={() => setExpandedId(perm.id)}
                      className={`w-full text-left p-4 hover:bg-slate-50 transition-colors space-y-2 ${
                        isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                          {perm.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold shrink-0 ${
                            perm.isMandatory
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {perm.isMandatory ? 'Mandatory' : 'Conditional'}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{perm.issuingAuthority}</span>
                      </div>

                      {/* Badges for Third-Party Requirements */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                          {perm.type}
                        </span>
                        {perm.thirdPartyRequirements.auditorRequired && (
                          <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-semibold flex items-center gap-1">
                            <Briefcase className="w-2.5 h-2.5" />
                            <span>Auditor / CA</span>
                          </span>
                        )}
                        {perm.thirdPartyRequirements.bankRequired && (
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-semibold flex items-center gap-1">
                            <Landmark className="w-2.5 h-2.5" />
                            <span>Bank / AD</span>
                          </span>
                        )}
                        {perm.thirdPartyRequirements.customsBrokerRequired && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold flex items-center gap-1">
                            <UserCheck className="w-2.5 h-2.5" />
                            <span>Customs Broker</span>
                          </span>
                        )}
                        {perm.thirdPartyRequirements.entities && perm.thirdPartyRequirements.entities.length > 0 && (
                          <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded font-semibold flex items-center gap-1">
                            <Layers className="w-2.5 h-2.5" />
                            <span>+{perm.thirdPartyRequirements.entities.length} Third-Party Entities</span>
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {filteredPermissions.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No matching trade permissions found for your criteria.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Complete Step-by-Step Dossier with Form Downloads and Submission Portals (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
              {activePermission ? (
                <>
                  {/* Header */}
                  <div className="space-y-2 pb-4 border-b border-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                          {activePermission.type}
                        </span>
                        <span className="text-xs text-slate-500">
                          {activePermission.countryName} ({activePermission.jurisdictionScope})
                        </span>
                      </div>
                      <a
                        href={activePermission.authorityUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                      >
                        <span>Visit Official Govt Ministry Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 font-display">
                      {activePermission.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-800">{activePermission.issuingAuthority}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Timeline: <strong className="text-slate-800 font-semibold">{activePermission.processingTimeline}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        <span>Fee: <strong className="text-slate-800 font-semibold">{activePermission.governmentFees}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Legal Statute Citation with Evidence Badge */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900 uppercase tracking-wide text-[10px]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Statutory Authority & Official Legal Citation</span>
                      </div>
                      <span className="text-[10px] font-mono bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-semibold">
                        Legally Enacted Statute
                      </span>
                    </div>
                    <div className="font-mono text-xs font-bold text-emerald-950 pt-0.5">
                      {activePermission.statuteCitation}
                    </div>
                    <p className="text-[11px] text-emerald-900/90 leading-relaxed pt-1">
                      {activePermission.overview}
                    </p>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>Step-by-Step Instructions on How to Obtain This Permission</span>
                    </h4>

                    <div className="space-y-2">
                      {activePermission.stepByStepInstructions.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="flex-1 text-slate-800 font-sans">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Official Forms to be Filled & Where to Submit (DIRECT LINKS) */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>Official Government Forms & Where to Submit</span>
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        Official .gov / .eu Links
                      </span>
                    </div>

                    <div className="space-y-3">
                      {activePermission.officialForms.map((form, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-indigo-950 font-mono">
                                  {form.formNumber}
                                </span>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                  {form.filingMode}
                                </span>
                              </div>
                              <div className="text-xs font-medium text-slate-800 mt-0.5">
                                {form.formName}
                              </div>
                            </div>

                            {/* Action buttons with official evidence links */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              <a
                                href={form.officialFormUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1 border border-slate-300"
                              >
                                <Download className="w-3 h-3 text-slate-600" />
                                <span>Download Official Govt Form</span>
                              </a>

                              <a
                                href={form.submissionPortalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-md transition-colors inline-flex items-center gap-1 border border-indigo-200"
                              >
                                <span>Open Submission Portal ({form.submissionPortalName})</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <div className="p-2.5 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-semibold text-slate-700">Where to Submit: </span>
                              <span>{form.submissionPortalName}</span>
                            </div>
                            <span className="font-mono text-[10px] text-indigo-600 truncate max-w-xs">
                              {form.submissionPortalUrl}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Third-Party Assistance Required (Auditor, Bank, Broker, Forwarder, Testing Lab, etc.) */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-indigo-600" />
                        <span>Third-Party Professional & Banking Requirements</span>
                      </h4>
                      <button
                        onClick={() => setActiveView('thirdparties')}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <span>View All 10 Third-Party Roles</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Auditor / CA */}
                      <div
                        className={`p-3.5 rounded-xl border space-y-1.5 ${
                          activePermission.thirdPartyRequirements.auditorRequired
                            ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                            <span>Auditor / Chartered Accountant / CPA</span>
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              activePermission.thirdPartyRequirements.auditorRequired
                                ? 'bg-amber-200/80 text-amber-900'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {activePermission.thirdPartyRequirements.auditorRequired ? 'MANDATORY' : 'Optional / Self'}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          {activePermission.thirdPartyRequirements.auditorRoleDescription ||
                            'Not mandatory for this clearance; can be filed directly by enterprise officers.'}
                        </p>
                      </div>

                      {/* Bank / Authorized Dealer */}
                      <div
                        className={`p-3.5 rounded-xl border space-y-1.5 ${
                          activePermission.thirdPartyRequirements.bankRequired
                            ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5 text-blue-700" />
                            <span>Authorized Dealer Bank (AD Bank)</span>
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              activePermission.thirdPartyRequirements.bankRequired
                                ? 'bg-blue-200/80 text-blue-900'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {activePermission.thirdPartyRequirements.bankRequired ? 'MANDATORY' : 'Not Required'}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          {activePermission.thirdPartyRequirements.bankRoleDescription ||
                            'Direct bank intervention not required for filing; standard settlement rules apply.'}
                        </p>
                      </div>

                      {/* Customs Broker */}
                      <div
                        className={`p-3.5 rounded-xl border space-y-1.5 ${
                          activePermission.thirdPartyRequirements.customsBrokerRequired
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Licensed Customs Broker (LCB) / CHA</span>
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              activePermission.thirdPartyRequirements.customsBrokerRequired
                                ? 'bg-emerald-200/80 text-emerald-900'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {activePermission.thirdPartyRequirements.customsBrokerRequired ? 'REQUIRED' : 'Self-Filing Allowed'}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          {activePermission.thirdPartyRequirements.customsBrokerRoleDescription ||
                            'Self-filing permitted online without licensed customs broker.'}
                        </p>
                      </div>

                      {/* Other Third Party (General) */}
                      {activePermission.thirdPartyRequirements.otherThirdParty && (
                        <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 text-slate-800 space-y-1.5">
                          <span className="font-bold text-xs flex items-center gap-1.5">
                            <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Additional Regulated Intermediaries</span>
                          </span>
                          <p className="text-[11px] leading-relaxed text-slate-600">
                            {activePermission.thirdPartyRequirements.otherThirdParty}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Rich Specific Entities Array if present */}
                    {activePermission.thirdPartyRequirements.entities &&
                      activePermission.thirdPartyRequirements.entities.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            Directly Involved Regulatory Entities & Verification Registries:
                          </span>
                          <div className="grid grid-cols-1 gap-2.5">
                            {activePermission.thirdPartyRequirements.entities.map((ent, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200/80 space-y-2 text-xs"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-indigo-950 font-sans">
                                      {ent.name}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 text-indigo-800 font-semibold">
                                      {ent.category}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                      ent.isMandatory
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-slate-200 text-slate-700'
                                    }`}
                                  >
                                    {ent.isMandatory ? 'LEGALLY COMPULSORY' : 'CONDITIONAL'}
                                  </span>
                                </div>

                                <p className="text-[11px] text-slate-700 leading-relaxed">
                                  {ent.roleDescription}
                                </p>

                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] border-t border-indigo-100">
                                  <div className="text-slate-600">
                                    <strong className="text-slate-800">Legal Mandate: </strong>
                                    <span>{ent.legalMandate}</span>
                                  </div>

                                  {ent.officialDirectoryUrl && (
                                    <a
                                      href={ent.officialDirectoryUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold text-[11px]"
                                    >
                                      <span>Verify in Official Registry ({ent.directoryName || 'Directory'})</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Exemptions and Penalties */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                    {/* Exemptions */}
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Statutory Exemptions</span>
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                        {activePermission.exemptions.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Penalties */}
                    <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-200 space-y-1.5 text-rose-950">
                      <span className="font-bold flex items-center gap-1.5 text-rose-900">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Penalties for Non-Compliance</span>
                      </span>
                      <p className="text-[11px] leading-relaxed text-rose-900/90 font-sans">
                        {activePermission.penaltiesForNonCompliance}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-xs text-slate-500">
                  Select a trade permission from the left to view complete step-by-step instructions, official downloadable forms, and bank/auditor requirements.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: GOODS VS SERVICES STATUTORY FORMS BREAKDOWN & COMPARISON          */}
      {/* ========================================================================= */}
      {activeView === 'goodsvsservices' && (
        <div className="space-y-6">
          {/* Header Explanation Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-900 to-indigo-950 text-white shadow-lg space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">
                Fundamental Trade Compliance Axiom
              </span>
              <span className="text-xs text-cyan-200 font-mono">
                100% Divergence in Statutory Forms
              </span>
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              Do Forms Change Based on Goods or Services? Yes — Completely.
            </h3>
            <p className="text-xs text-cyan-100/90 leading-relaxed max-w-4xl font-sans">
              Physical goods cross tangible customs borders (Customs Territory), requiring tariff classification (HTS), container manifests (ISF 10+2, Bill of Lading), customs surety bonds, and physical safety marks (CE, BIS, FDA). Intangible services (SaaS, cloud hosting, technical consulting) cross digital networks with zero physical border entry; their regulatory compliance is governed entirely by <strong>Direct Tax Withholding (WHT), DTAA Treaties (Form 10F, W-8BEN-E), Accountant Remittance Certifications (Form 15CB with UDIN), and Central Bank Foreign Exchange Realization (FEMA, SOFTEX, e-BRC)</strong>.
            </p>
          </div>

          {/* Two Distinct Legal Paradigms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Card 1: Physical Goods Paradigm */}
            <div className="bg-white rounded-2xl border border-cyan-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-cyan-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Physical Goods Compliance Paradigm
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      The Border, Customs & Logistics Regime
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
                  Customs Enforced
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Triggered whenever tangible merchandise physically moves across a sovereign maritime, air, rail, or road border. Customs authorities physically inspect cargo to assess import tariffs, enforce security, prevent contraband, and enforce safety regulations.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide block">
                  Mandatory Statutory Forms:
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-900">CBP Form 7501 / EU SAD</span>
                    <span className="text-[10px] text-slate-500">Entry Summary & Tariff Calc</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-900">CBP ISF-10 / Bill of Lading</span>
                    <span className="text-[10px] text-slate-500">Ocean Security (24h Pre-Load)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-900">CBP Form 301</span>
                    <span className="text-[10px] text-slate-500">Continuous Customs Surety Bond</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-900">Certificate of Origin (COO)</span>
                    <span className="text-[10px] text-slate-500">Chamber of Commerce Preferential</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-900">CE DoC / BIS CRS / SASO CoC</span>
                    <span className="text-[10px] text-slate-500">Accredited Lab Safety Marks</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-100 text-xs space-y-1">
                <span className="font-bold text-cyan-950 block text-[11px]">Key Intermediaries Required:</span>
                <p className="text-[11px] text-cyan-900/90 leading-relaxed">
                  Licensed Customs Broker (LCB), Ocean Freight Forwarder (NVOCC), Treasury Surety Company, and Accredited Testing Labs / Notified Bodies.
                </p>
              </div>
            </div>

            {/* Card 2: Services & SaaS Paradigm */}
            <div className="bg-white rounded-2xl border border-indigo-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <Globe2 className="w-5 h-5 text-indigo-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      Services & SaaS Compliance Paradigm
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      The Tax Withholding, DTAA & Central Bank Regime
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold">
                  Revenue & Bank Enforced
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Triggered whenever cross-border software licenses, SaaS subscriptions, cloud hosting, or technical consulting services are invoiced. There is no physical container or port of entry; tax revenue departments and central banks enforce compliance at payment settlement.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide block">
                  Mandatory Statutory Forms:
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-900">Form 15CB (with UDIN)</span>
                    <span className="text-[10px] text-slate-500">Chartered Accountant Tax Audit</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-900">IRS Form W-8BEN-E / Form 10F</span>
                    <span className="text-[10px] text-slate-500">DTAA 0% Treaty Relief Claim</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-900">Tax Residency Certificate (TRC)</span>
                    <span className="text-[10px] text-slate-500">Sovereign Revenue Residence Proof</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-900">Form SOFTEX (STPI / RBI)</span>
                    <span className="text-[10px] text-slate-500">Software Export via Internet (e-BRC)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-900">GST LUT (Form GST RFD-11)</span>
                    <span className="text-[10px] text-slate-500">0% IGST Zero-Rated Export</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-1">
                <span className="font-bold text-indigo-950 block text-[11px]">Key Intermediaries Required:</span>
                <p className="text-[11px] text-indigo-900/90 leading-relaxed">
                  Independent Practicing Chartered Accountant (CA/CPA) with UDIN, Authorized Dealer Category-I Bank, and optional Merchant of Record (Paddle/Stripe Tax).
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Side-by-Side 8-Pillar Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 font-display">
                  8-Pillar Regulatory & Statutory Comparison: Goods vs. Services
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Detailed comparison of sovereign authorities, mandatory forms, and third-party requirements
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                Direct Side-by-Side Contrast
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-1/4">Compliance Dimension</th>
                    <th className="py-3 px-4 w-3/8 text-cyan-950 bg-cyan-50/50">Physical Goods Export / Import</th>
                    <th className="py-3 px-4 w-3/8 text-indigo-950 bg-indigo-50/50">Services, SaaS & Digital Intangibles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-sans">
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/60">
                      1. Enforcing Sovereign Authorities
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-cyan-50/20">
                      <strong>Customs & Border Administrations:</strong> U.S. CBP, EU National Customs (Zoll, Douane), Indian CBIC / ICEGATE, UK Border Force, Port Authorities.
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-indigo-50/20">
                      <strong>Direct Tax & Central Banks:</strong> U.S. IRS, Indian Income Tax Department (CBDT), Reserve Bank of India (RBI), HMRC, STPI.
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/60">
                      2. Primary Entry / Remittance Form
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-cyan-50/20 font-mono">
                      <strong>CBP Form 7501</strong> (Entry Summary), <strong>EU SAD</strong>, <strong>ICEGATE Bill of Entry</strong>, <strong>UK CDS C88</strong>.
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-indigo-50/20 font-mono">
                      <strong>Form 15CA & Form 15CB</strong> (Accountant Audit Certificate with UDIN), <strong>RBI Form A2</strong>, <strong>IRS Form W-8BEN-E</strong>.
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/60">
                      3. Origin & Preferential Rate Proof
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-cyan-50/20 font-mono">
                      <strong>Certificate of Origin (COO)</strong> stamped by an accredited Chamber of Commerce (or self-certification under USMCA/CPTPP REX).
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-indigo-50/20 font-mono">
                      <strong>Tax Residency Certificate (TRC)</strong> issued by home revenue ministry + <strong>Form 10F</strong> claiming DTAA Business Profits (0% WHT).
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/60">
                      4. Cargo Custody & Manifest Filing
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-cyan-50/20 font-mono">
                      <strong>CBP ISF-10</strong> (Importer Security Filing), <strong>Master & House Bill of Lading (B/L)</strong>, <strong>Air Waybill (AWB)</strong>.
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-indigo-50/20 font-mono">
                      <strong>Form SOFTEX</strong> (Declaration of Software Export via Data Transmission / Internet submitted to STPI to obtain e-BRC).
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/60">
                      5. Financial Guarantees & Bonds
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-cyan-50/20 font-mono">
                      <strong>CBP Form 301</strong> Continuous Customs Bond ($50,000+) underwritten by Treasury-approved surety; Duty Deferment Direct Debit.
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-indigo-50/20 font-mono">
                      <strong>Form GST RFD-11 (Letter of Undertaking LUT)</strong> allowing zero-rated export of services without paying upfront 18% IGST.
                    </td>
                  </tr>

                  {/* Row 6 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/60">
                      6. Mandatory Third-Party Intermediaries
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-cyan-50/20">
                      Licensed Customs Broker (LCB), Ocean Freight Forwarder (NVOCC), Treasury Surety Bond Underwriter, Testing Lab / Notified Body.
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-indigo-50/20">
                      Independent Practicing Chartered Accountant (CA) / CPA with UDIN, Authorized Dealer Category-I Bank, Transfer Pricing Specialist.
                    </td>
                  </tr>

                  {/* Row 7 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/60">
                      7. Indirect Tax & Tariff Mechanism
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-cyan-50/20">
                      Ad-valorem customs tariffs assessed against HTS commodity code + Import VAT/GST collected at port terminal.
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-indigo-50/20">
                      Destination Reverse Charge Mechanism (RCM) for B2B buyers; Non-Union One-Stop Shop (OSS) VAT or Merchant of Record (MoR) for B2C SaaS.
                    </td>
                  </tr>

                  {/* Row 8 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 bg-slate-50/60">
                      8. Consequences of Missing Form
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-cyan-50/20 text-rose-900">
                      Cargo detained at port terminal; $5,000 - $10,000 ISF liquidated damages; vessel container grounded; demurrage fines of $200+/day.
                    </td>
                    <td className="py-3.5 px-4 text-[11px] leading-relaxed bg-indigo-50/20 text-rose-900">
                      Mandatory 30% flat tax withheld from gross invoice; commercial bank wire blocked; ₹100,000 penalty under Section 271-I; FEMA violation notice.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Master Form Catalog Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Top Goods Forms */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-cyan-600" />
                  <span>Signature Physical Goods Forms & Portals</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Customs / Logistics</span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { code: 'CBP Form 7501', title: 'U.S. Entry Summary (Declaration of Duty & HTS)', url: 'https://www.cbp.gov/document/forms/form-7501-entry-summary', authority: 'U.S. Customs & Border Protection' },
                  { code: 'CBP Form 301', title: 'Customs Continuous Bond Application', url: 'https://www.cbp.gov/document/forms/form-301-customs-bond', authority: 'Treasury Approved Surety' },
                  { code: 'CBP ISF-10', title: 'Importer Security Filing (10+2 Advance Cargo)', url: 'https://www.cbp.gov/border-security/ports-entry/cargo-security/importer-security-filing-102', authority: 'CBP National Targeting Center' },
                  { code: 'EU SAD / DAU', title: 'Single Administrative Document (Import Declaration)', url: 'https://taxation-customs.ec.europa.eu', authority: 'EU DG TAXUD & Member States' },
                  { code: 'Ocean Bill of Lading', title: 'Master / House Bill of Lading (Carrier Custody)', url: 'https://www.fmc.gov', authority: 'Federal Maritime Commission' },
                  { code: 'Certificate of Origin', title: 'ICC International Certificate of Origin (COO)', url: 'https://iccwbo.org', authority: 'Chamber of Commerce' },
                  { code: 'EU CE DoC', title: 'Declaration of Conformity (Safety Directives)', url: 'https://single-market-economy.ec.europa.eu', authority: 'EU Notified Bodies' },
                  { code: 'SABER SCoC', title: 'SASO Shipment Certificate of Conformity', url: 'https://saber.sa', authority: 'Saudi Standards Organization' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 font-mono text-[11px]">{item.code}</div>
                      <div className="text-[11px] text-slate-600">{item.title}</div>
                      <div className="text-[10px] text-slate-500">{item.authority}</div>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded text-[11px] font-semibold inline-flex items-center gap-1 shrink-0"
                    >
                      <span>Form Link</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Services Forms */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-indigo-600" />
                  <span>Signature Services & SaaS Forms & Portals</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Tax / Remittance</span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { code: 'IRS Form W-8BEN-E', title: 'Certificate of Status of Beneficial Owner (0% Treaty)', url: 'https://www.irs.gov/pub/irs-pdf/fw8bene.pdf', authority: 'U.S. Internal Revenue Service (IRS)' },
                  { code: 'Indian Form 15CB', title: 'Accountant Certificate for Foreign Remittances (UDIN)', url: 'https://www.incometax.gov.in', authority: 'CBDT & Institute of Chartered Accountants' },
                  { code: 'Indian Form 15CA', title: 'Information on Outward Remittance (Part A/B/C/D)', url: 'https://www.incometax.gov.in', authority: 'Income Tax Department of India' },
                  { code: 'Tax Residency Cert', title: 'Sovereign Tax Residency Certificate (TRC)', url: 'https://www.oecd.org', authority: 'Home National Revenue Service' },
                  { code: 'Indian Form 10F', title: 'Electronic DTAA Relief Information Return', url: 'https://www.incometax.gov.in', authority: 'Income Tax Department India' },
                  { code: 'Form SOFTEX', title: 'Software Export Declaration via Data Transmission', url: 'https://stpi.in', authority: 'Software Technology Parks of India / RBI' },
                  { code: 'Form GST RFD-11', title: 'Letter of Undertaking (LUT) for 0% Export IGST', url: 'https://www.gst.gov.in', authority: 'Goods and Services Tax Network' },
                  { code: 'Form 3CEB', title: 'Transfer Pricing Report on International Transactions', url: 'https://www.incometax.gov.in', authority: 'Statutory International Tax Auditor' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 font-mono text-[11px]">{item.code}</div>
                      <div className="text-[11px] text-slate-600">{item.title}</div>
                      <div className="text-[10px] text-slate-500">{item.authority}</div>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded text-[11px] font-semibold inline-flex items-center gap-1 shrink-0"
                    >
                      <span>Form Link</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions: Goods vs Services Misconceptions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 font-display flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Common Cross-Border Compliance Misconceptions Explained</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block text-[11px]">
                  Q: Can an HS Commodity Code apply to software or SaaS?
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  <strong>A:</strong> No. SaaS, cloud access, downloadable software, and technical services transmitted electronically across the internet do NOT have HS codes and do not pass through customs checkpoints. Under the WTO Information Technology Agreement (ITA), electronic transmissions are exempt from customs duties. An HS code (e.g. HS 8523) only applies if software is permanently embedded on a physical medium (USB drive, DVD, or pre-loaded hardware).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block text-[11px]">
                  Q: Why will a commercial bank freeze a foreign services wire if only an invoice is provided?
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  <strong>A:</strong> Unlike domestic bank transfers, cross-border payments for services trigger sovereign withholding tax laws (Section 195 in India, Chapter 3 in the U.S.). The bank is held legally and financially liable if it releases gross payments without certified proof of withholding (Form 15CA/15CB signed by a Chartered Accountant with UDIN, or an IRS Form W-8BEN-E certifying treaty exemption).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block text-[11px]">
                  Q: Why is an Ocean Bill of Lading or Customs Broker completely useless for IT services?
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  <strong>A:</strong> Ocean bills of lading represent negotiable documents of title over physical cargo containers in the custody of maritime carriers. Because digital services do not physically occupy shipping containers or enter port boundaries, customs brokers and ocean freight forwarders possess zero legal jurisdiction over digital exports.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block text-[11px]">
                  Q: Why does India require Form SOFTEX instead of an ICEGATE Shipping Bill for software exports?
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  <strong>A:</strong> ICEGATE only generates Shipping Bills for physical cargo exiting via customs seaports or airports. To track export realizations under the Foreign Exchange Management Act (FEMA) for software transmitted via satellite or internet data links, the Reserve Bank of India designated the Software Technology Parks of India (STPI) to audit service contracts and certify Form SOFTEX to generate electronic Bank Realisation Certificates (e-BRC).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: COMPLETE THIRD-PARTY ECOSYSTEM & ADVISORY MATRIX (10 ROLES)       */}
      {/* ========================================================================= */}
      {activeView === 'thirdparties' && (
        <div className="space-y-6">
          {/* Explanation Banner */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
              <h3 className="font-bold text-sm text-amber-900">
                Are Any Other Third Parties Needed in Global Trade? Yes — Here is the Full Spectrum.
              </h3>
            </div>
            <p className="text-[11px] text-amber-900/90 leading-relaxed">
              In international trade of goods and cross-border services, companies frequently assume they only need their commercial bank or an accountant. In reality, sovereign border laws, maritime security acts, and technical safety standards legally compel businesses to engage <strong>up to 10 distinct third-party professional entities</strong> depending on cargo mode, destination, product regulation, and corporate affiliation.
            </p>
          </div>

          {/* Third-Party Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tpSearch}
                onChange={(e) => setTpSearch(e.target.value)}
                placeholder="Search third parties by role, document (B/L, 15CB, CoC, Form 301), or mandate..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-medium">Trade Flow:</span>
              {['All', 'Goods Import', 'Goods Export', 'Services Export', 'Services Import'].map((flow) => (
                <button
                  key={flow}
                  onClick={() => setTpFlowFilter(flow)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    tpFlowFilter === flow
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {flow}
                </button>
              ))}
            </div>
          </div>

          {/* Third-Party 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 4 Cols: Third-Party Role Selector */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Recognized Intermediaries ({filteredThirdParties.length})</span>
                <span>Category</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[720px] overflow-y-auto">
                {filteredThirdParties.map((tp) => {
                  const isSelected = activeTp.id === tp.id;
                  return (
                    <button
                      key={tp.id}
                      onClick={() => setExpandedTpId(tp.id)}
                      className={`w-full text-left p-4 hover:bg-slate-50 transition-colors space-y-1.5 ${
                        isSelected ? 'bg-amber-50/70 border-l-4 border-amber-600' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900 leading-snug">
                          {tp.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {tp.category}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                          {tp.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 8 Cols: Deep-Dive Entity Specification */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
              {activeTp ? (
                <>
                  {/* Top Details */}
                  <div className="space-y-3 pb-4 border-b border-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {activeTp.badge}
                        </span>
                        <span className="text-xs text-slate-500">
                          {activeTp.category}
                        </span>
                      </div>

                      <a
                        href={activeTp.officialVerificationRegistry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                      >
                        <span>Official Govt / Accreditation Registry</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 font-display">
                      {activeTp.title}
                    </h3>

                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {activeTp.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Turnaround: <strong className="text-slate-800 font-semibold">{activeTp.turnaroundTime}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        <span>Typical Cost: <strong className="text-slate-800 font-semibold">{activeTp.typicalFeeRange}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Statutory Legal Mandate */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Statutory Legal Mandate & Enacted Laws</span>
                      </span>
                      <span className="text-[10px] font-mono text-indigo-700 font-semibold">
                        Sovereign Law
                      </span>
                    </div>
                    <div className="font-mono text-xs font-bold text-slate-900">
                      {activeTp.statuteCitation}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                      {activeTp.keyStatutoryMandate}
                    </p>
                  </div>

                  {/* When Mandatory vs When Optional */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Mandatory Conditions */}
                    <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950 space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-rose-900">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>When Involving Them Is Strictly Compulsory</span>
                      </div>
                      <ul className="space-y-1.5 pl-4 list-disc text-[11px] text-rose-900/90 leading-relaxed">
                        {activeTp.whenMandatory.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Optional / Self-Filing */}
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>When You Can Self-File or Bypass</span>
                      </div>
                      <ul className="space-y-1.5 pl-4 list-disc text-[11px] text-emerald-900/90 leading-relaxed">
                        {activeTp.whenOptionalOrSelf.map((o, i) => (
                          <li key={i}>{o}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Documents & Forms Produced */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Official Documents & Legal Certificates Produced by This Entity</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {activeTp.keyDocumentsAndForms.map((doc, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 flex items-center gap-2"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Consequences of Omission */}
                  <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                      <span>Severe Consequences of Omitting This Third Party</span>
                    </span>
                    <p className="text-[11px] leading-relaxed text-amber-900/90 font-sans">
                      {activeTp.consequencesOfOmission}
                    </p>
                  </div>

                  {/* Official Verification Registry Box */}
                  <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-indigo-950 block">
                          Verified Official Registry: {activeTp.officialVerificationRegistry.name}
                        </span>
                        <p className="text-[11px] text-indigo-900/80 mt-0.5">
                          {activeTp.officialVerificationRegistry.description}
                        </p>
                      </div>
                      <a
                        href={activeTp.officialVerificationRegistry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 shrink-0"
                      >
                        <span>Search Accredited Directory</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Step-by-Step Engagement Protocol */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>Step-by-Step Engagement Protocol</span>
                    </span>

                    <div className="space-y-1.5">
                      {activeTp.stepByStepEngagementProtocol.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start gap-2"
                        >
                          <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="flex-1 text-[11px] leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-xs text-slate-500">
                  Select a third-party intermediary from the list to view legal mandates and registries.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: THIRD-PARTY REQUIREMENT ASSESSOR (SCENARIO CALCULATOR)            */}
      {/* ========================================================================= */}
      {activeView === 'assessor' && (
        <div className="space-y-6">
          {/* Explanation Header */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900 font-display">
                Interactive Third-Party Requirement Assessor
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Configure your specific cross-border transaction below. The engine cross-references international customs statutes, tax withholding laws, and product safety regulations to immediately evaluate <strong>every third party you must legally contract</strong> versus tasks your team can execute in-house.
            </p>
          </div>

          {/* Form Inputs Grid */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Activity Type */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Trade Activity Type</label>
              <select
                value={assessorTradeType}
                onChange={(e) => setAssessorTradeType(e.target.value as any)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 font-medium focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Goods Import">Goods Import (Physical Freight)</option>
                <option value="Goods Export">Goods Export (Manufactured Cargo)</option>
                <option value="Services Export">Services Export (SaaS / Tech / Consulting)</option>
                <option value="Services Import">Services Import (Foreign Software / Consulting)</option>
              </select>
            </div>

            {/* Destination Region */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Destination Jurisdiction</label>
              <select
                value={assessorDestination}
                onChange={(e) => setAssessorDestination(e.target.value as any)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 font-medium focus:ring-1 focus:ring-indigo-500"
              >
                <option value="US">United States (US)</option>
                <option value="EU">European Union (EU 27)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="IN">India (IN)</option>
                <option value="CN">China (CN)</option>
                <option value="JP">Japan (JP)</option>
                <option value="CA">Canada (CA)</option>
                <option value="AU">Australia (AU)</option>
                <option value="SG">Singapore (SG)</option>
                <option value="AE">United Arab Emirates (AE)</option>
                <option value="SA">Saudi Arabia & GCC (SA)</option>
                <option value="BR">Brazil (BR)</option>
                <option value="GLOBAL">Other Sovereign Treaty Nation (GLOBAL)</option>
              </select>
            </div>

            {/* Specific Checkbox Conditions */}
            <div className="space-y-2 lg:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-800 text-[11px] block uppercase tracking-wide">
                Transaction Profile Variables
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {(assessorTradeType === 'Goods Import' || assessorTradeType === 'Goods Export') && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isMaritimeOcean}
                        onChange={(e) => setIsMaritimeOcean(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Maritime Sea Container (Ocean Freight)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isRegulatedProduct}
                        onChange={(e) => setIsRegulatedProduct(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Regulated (Electronics / Food / Medical)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isClaimingFta}
                        onChange={(e) => setIsClaimingFta(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Claiming Preferential FTA Tariff (0% Duty)</span>
                    </label>
                  </>
                )}

                {assessorTradeType === 'Services Export' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isB2cConsumer}
                      onChange={(e) => setIsB2cConsumer(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>B2C Retail Consumers (Direct End-Users)</span>
                  </label>
                )}

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRelatedParty}
                    onChange={(e) => setIsRelatedParty(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Related Party (Subsidiary / Associated Enterprise)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Assessment Summary Box */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-md">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">
                Assessed Legal Conclusion
              </span>
              <div className="text-sm font-bold font-display mt-0.5">
                {assessedThirdParties.mandatory.length} Legally Compulsory Third Parties Required
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-right">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Est. External Fee Budget</span>
                <span className="text-sm font-mono font-bold text-amber-400">
                  {assessedThirdParties.estimatedBudget}
                </span>
              </div>
              <div className="border-l border-slate-700 pl-4">
                <span className="text-[10px] text-slate-400 block uppercase">Est. Onboarding Lead Time</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {assessedThirdParties.estimatedLeadTime}
                </span>
              </div>
            </div>
          </div>

          {/* Output 3 Cards: Mandatory, Conditional, Self-Filing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* 1. Mandatory Third Parties */}
            <div className="bg-white rounded-xl border border-rose-200 shadow-xs overflow-hidden">
              <div className="p-3.5 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
                <span className="font-bold text-xs text-rose-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Mandatory Intermediaries ({assessedThirdParties.mandatory.length})</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                  Legally Compulsory
                </span>
              </div>

              <div className="p-4 space-y-4 text-xs divide-y divide-slate-100">
                {assessedThirdParties.mandatory.map((item, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-3 space-y-1.5' : 'space-y-1.5'}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                      {item.reason}
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      <strong className="text-slate-700">Mandate: </strong>{item.mandate}
                    </div>

                    <div className="pt-1 flex flex-wrap gap-1">
                      {item.forms.map((f, i) => (
                        <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                          {f}
                        </span>
                      ))}
                    </div>

                    {item.registryUrl && (
                      <a
                        href={item.registryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 pt-1"
                      >
                        <span>Check Official Registry</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                ))}

                {assessedThirdParties.mandatory.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No compulsory third parties for this simple scenario.
                  </div>
                )}
              </div>
            </div>

            {/* 2. Conditional Third Parties */}
            <div className="bg-white rounded-xl border border-amber-200 shadow-xs overflow-hidden">
              <div className="p-3.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
                <span className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Conditional / Strategic Roles ({assessedThirdParties.conditional.length})</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                  Recommended
                </span>
              </div>

              <div className="p-4 space-y-4 text-xs divide-y divide-slate-100">
                {assessedThirdParties.conditional.map((item, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-3 space-y-1.5' : 'space-y-1.5'}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                      {item.reason}
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      <strong className="text-slate-700">Mandate: </strong>{item.mandate}
                    </div>

                    <div className="pt-1 flex flex-wrap gap-1">
                      {item.forms.map((f, i) => (
                        <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {assessedThirdParties.conditional.length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No optional or conditional third-party roles applicable.
                  </div>
                )}
              </div>
            </div>

            {/* 3. In-House / Self-Filing Permitted */}
            <div className="bg-white rounded-xl border border-emerald-200 shadow-xs overflow-hidden">
              <div className="p-3.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Tasks You Can Execute In-House</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Zero Intermediary
                </span>
              </div>

              <div className="p-4 space-y-4 text-xs divide-y divide-slate-100">
                {assessedThirdParties.selfFiling.map((item, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-3 space-y-1' : 'space-y-1'}>
                    <span className="font-bold text-slate-900 block">{item.title}</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {item.tasks}
                    </p>
                    <div className="text-[10px] text-indigo-700 font-semibold pt-0.5">
                      Portal: {item.portal}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
