import React, { useState, useMemo } from 'react';
import {
  SERVICE_CATEGORIES,
  GLOBAL_DST_REGIMES,
  ServiceCategoryDefinition,
} from '../data/servicesTaxDatabase.ts';
import { US_STATES_DATABASE, CANADIAN_PROVINCES_DATABASE, INDIAN_STATES_DATABASE } from '../data/statesDatabase.ts';
import { ALL_WORLD_CURRENCIES, formatCurrencyAmount } from '../data/currenciesDatabase.ts';
import { calculateServicesTax } from '../utils/servicesTaxCalculator.ts';
import { GLOBAL_TAX_DATABASE } from '../data/taxDatabase.ts';
import {
  Cloud,
  Layers,
  Calculator,
  ShieldCheck,
  Building2,
  ExternalLink,
  Search,
  FileText,
  Percent,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  DollarSign,
  HelpCircle,
  BookOpen,
  Filter,
} from 'lucide-react';

interface ServicesTaxEngineProps {
  onNavigateToPermissions?: () => void;
}

export const ServicesTaxEngine: React.FC<ServicesTaxEngineProps> = ({
  onNavigateToPermissions,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'calculator' | 'us_states_matrix' | 'dst_directory'>('calculator');

  // Calculator inputs
  const [serviceCategory, setServiceCategory] = useState<ServiceCategoryDefinition['id']>('saas');
  const [contractValue, setContractValue] = useState<number>(50000);
  const [currency, setCurrency] = useState<string>('USD');
  const [clientType, setClientType] = useState<'B2B' | 'B2C'>('B2B');
  const [providerCountry, setProviderCountry] = useState<string>('US');
  const [providerSubdivision, setProviderSubdivision] = useState<string>('CA');
  const [clientCountry, setClientCountry] = useState<string>('GB');
  const [clientSubdivision, setClientSubdivision] = useState<string>('');
  const [hasDtaaTreaty, setHasDtaaTreaty] = useState<boolean>(true);
  const [hasTaxResidencyCert, setHasTaxResidencyCert] = useState<boolean>(true);

  // States Matrix filters
  const [matrixSearch, setMatrixSearch] = useState<string>('');
  const [matrixFilter, setMatrixFilter] = useState<'All' | 'Taxable' | 'Exempt' | 'Partial'>('All');

  // Selected Category Meta
  const activeCategoryMeta = useMemo(
    () => SERVICE_CATEGORIES.find((c) => c.id === serviceCategory) || SERVICE_CATEGORIES[0],
    [serviceCategory]
  );

  // Available subdivisions
  const clientCountryObj = useMemo(
    () => GLOBAL_TAX_DATABASE.find((c) => c.code === clientCountry),
    [clientCountry]
  );

  const availableClientSubdivisions = useMemo(() => {
    if (clientCountry === 'US') return US_STATES_DATABASE;
    if (clientCountry === 'CA') return CANADIAN_PROVINCES_DATABASE;
    if (clientCountry === 'IN') return INDIAN_STATES_DATABASE;
    return clientCountryObj?.subdivisions || [];
  }, [clientCountry, clientCountryObj]);

  // Compute Calculation
  const calculation = useMemo(() => {
    return calculateServicesTax({
      serviceCategory,
      serviceName: activeCategoryMeta.title,
      contractValue,
      currency,
      clientType,
      providerCountry,
      providerSubdivision,
      clientCountry,
      clientSubdivision,
      hasDtaaTreaty,
      hasTaxResidencyCert,
    });
  }, [
    serviceCategory,
    activeCategoryMeta,
    contractValue,
    currency,
    clientType,
    providerCountry,
    providerSubdivision,
    clientCountry,
    clientSubdivision,
    hasDtaaTreaty,
    hasTaxResidencyCert,
  ]);

  // Filtered US States
  const filteredStates = useMemo(() => {
    return US_STATES_DATABASE.filter((state) => {
      const matchesSearch =
        state.name.toLowerCase().includes(matrixSearch.toLowerCase()) ||
        state.code.toLowerCase().includes(matrixSearch.toLowerCase()) ||
        (state.stateAuthority && state.stateAuthority.toLowerCase().includes(matrixSearch.toLowerCase()));

      let matchesFilter = true;
      if (matrixFilter === 'Taxable') {
        matchesFilter = state.saasTaxable === true;
      } else if (matrixFilter === 'Exempt') {
        matchesFilter = state.saasTaxable === false;
      } else if (matrixFilter === 'Partial') {
        matchesFilter = state.saasTaxable === 'Partially Taxable';
      }

      return matchesSearch && matchesFilter;
    });
  }, [matrixSearch, matrixFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Tax on Services, SaaS & Cross-Border Digital Economy
            </h2>
            <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-200 font-semibold">
              UN CPC & SAC 99 Standardized
            </span>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
              50 US States + 210+ Sovereign Regimes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Calculate cross-border VAT/GST, Reverse Charge Mechanism (RCM), Withholding Tax (FTS) treaty relief, Digital Services Taxes (DST), and 50-state SaaS taxability with verified statutory links.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveSubTab('calculator')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'calculator'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-600" />
            <span>Services Tax Engine</span>
          </button>
          <button
            onClick={() => setActiveSubTab('us_states_matrix')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'us_states_matrix'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>US 50-State SaaS Matrix</span>
          </button>
          <button
            onClick={() => setActiveSubTab('dst_directory')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'dst_directory'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Global DST Regimes ({GLOBAL_DST_REGIMES.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: SERVICES & SAAS TAX CALCULATOR */}
      {/* ========================================================= */}
      {activeSubTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Inputs Column (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Service Contract & Transaction Parameters
              </h3>
              <p className="text-xs text-slate-500">
                Configure service classification, counterparty jurisdictions, and treaty documentation
              </p>
            </div>

            {/* Service Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Service Classification
              </label>
              <select
                value={serviceCategory}
                onChange={(e) => setServiceCategory(e.target.value as ServiceCategoryDefinition['id'])}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
              <div className="mt-1.5 p-2 rounded-md bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-0.5">
                <div className="font-mono text-indigo-700 font-semibold">{activeCategoryMeta.sacCode} · {activeCategoryMeta.unCpcCode}</div>
                <div>{activeCategoryMeta.description}</div>
              </div>
            </div>

            {/* B2B vs B2C */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Counterparty Client Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setClientType('B2B')}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-all text-left ${
                    clientType === 'B2B'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-1 ring-indigo-500 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="font-bold">B2B (Business Entity)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">VAT/Tax registered; Reverse Charge general rule</div>
                </button>
                <button
                  type="button"
                  onClick={() => setClientType('B2C')}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-all text-left ${
                    clientType === 'B2C'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-1 ring-indigo-500 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="font-bold">B2C (Consumer / Non-VAT)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Foreign supplier collected; destination VAT/sales tax</div>
                </button>
              </div>
            </div>

            {/* Value & Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contract / Invoice Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={contractValue}
                    onChange={(e) => setContractValue(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Currency (All ISO 4217)
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-semibold text-slate-800"
                >
                  {ALL_WORLD_CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol}) - {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Provider (Origin) Jurisdictions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Provider Country
                </label>
                <select
                  value={providerCountry}
                  onChange={(e) => setProviderCountry(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {GLOBAL_TAX_DATABASE.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} [{c.code}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Provider State / Prov.
                </label>
                <select
                  value={providerSubdivision}
                  onChange={(e) => setProviderSubdivision(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Federal / Direct</option>
                  {US_STATES_DATABASE.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client (Destination) Jurisdictions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client / Customer Country
                </label>
                <select
                  value={clientCountry}
                  onChange={(e) => {
                    setClientCountry(e.target.value);
                    setClientSubdivision('');
                  }}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {GLOBAL_TAX_DATABASE.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} [{c.code}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client State / Prov.
                </label>
                <select
                  value={clientSubdivision}
                  onChange={(e) => setClientSubdivision(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">National / Direct</option>
                  {availableClientSubdivisions.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Treaty & Documentation Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDtaaTreaty}
                  onChange={(e) => setHasDtaaTreaty(e.target.checked)}
                  className="rounded-xs border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Double Tax Avoidance Agreement (DTAA Treaty) Active</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTaxResidencyCert}
                  onChange={(e) => setHasTaxResidencyCert(e.target.checked)}
                  className="rounded-xs border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Tax Residency Certificate (TRC) & Form 10F / W-8BEN-E on File</span>
              </label>
            </div>
          </div>

          {/* Outputs Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Net Remittance Banner */}
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider">
                    Net Cash Remittance to Supplier
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-0.5">
                    {formatCurrencyAmount(calculation.netRemittanceToSupplier, currency)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Total Tax Burden</div>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {formatCurrencyAmount(calculation.totalTaxComplianceBurden, currency)}
                  </div>
                </div>
              </div>

              {/* Breakdown Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Destination VAT/Sales Tax</span>
                  <span className="font-bold font-mono text-white text-sm">
                    {calculation.destinationTaxRate}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {formatCurrencyAmount(calculation.destinationTaxAmount, currency)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Mechanism</span>
                  <span className="font-bold text-indigo-300 text-xs line-clamp-1">
                    {calculation.taxMechanism.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {calculation.taxMechanism.includes('Reverse') ? 'Buyer Self-Assesses' : 'Vendor Collects'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Withholding Tax (WHT)</span>
                  <span className="font-bold font-mono text-amber-300 text-sm">
                    {calculation.effectiveWhtRate}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {formatCurrencyAmount(calculation.whtAmount, currency)}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Digital Services Tax</span>
                  <span className="font-bold font-mono text-purple-300 text-sm">
                    {calculation.dstRate > 0 ? `${calculation.dstRate}%` : '0%'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {calculation.dstAmount > 0 ? formatCurrencyAmount(calculation.dstAmount, currency) : 'Exempt'}
                  </span>
                </div>
              </div>

              {/* Treaty savings badge if applied */}
              {calculation.whtSavings > 0 && (
                <div className="p-2 rounded-md bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>DTAA Treaty Relief Saved: {formatCurrencyAmount(calculation.whtSavings, currency)}</span>
                  </span>
                  <span className="font-mono text-[11px]">
                    Reduced from {calculation.statutoryWhtRate}% &rarr; {calculation.effectiveWhtRate}%
                  </span>
                </div>
              )}
            </div>

            {/* Plain English Layman Explanation */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Executive Statutory Summary</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {calculation.laymanExplanation}
              </p>
            </div>

            {/* Verified Statutory Sources & Government Links */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Legal Evidence & Government Sources</span>
                </h4>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                  Official Statutory Reference
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Governing Tax Statute / Circular:</span>
                  <span className="text-slate-900 font-mono text-[11px] font-semibold block mt-0.5">
                    {calculation.statuteCitation}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/60">
                  <a
                    href={calculation.authorityEvidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md font-semibold text-xs transition-colors"
                  >
                    <span>Official Ministry / Department Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {clientCountryObj?.legalGazetteUrl && (
                    <a
                      href={clientCountryObj.legalGazetteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-semibold text-xs transition-colors"
                    >
                      <span>National Gazette Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Compliance Checklist & Mandatory Documents */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">
                    Mandatory Invoicing Clauses & Required Documentation:
                  </span>
                  {onNavigateToPermissions && (
                    <button
                      type="button"
                      onClick={onNavigateToPermissions}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                    >
                      <span>Forms & Bank/Auditor Rules &rarr;</span>
                    </button>
                  )}
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {calculation.complianceChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                  {calculation.requiredDocuments.map((doc, idx) => (
                    <li key={`doc-${idx}`} className="flex items-start gap-2 font-medium text-slate-800">
                      <FileText className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>

                {onNavigateToPermissions && (
                  <div className="mt-3 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                    <span className="text-[11px] text-indigo-900 font-medium">
                      Need official forms (Form W-8BEN-E, Form 15CA/15CB, TRC) or bank certification?
                    </span>
                    <button
                      type="button"
                      onClick={onNavigateToPermissions}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded shadow-xs transition-colors flex items-center gap-1"
                    >
                      <span>Inspect Forms & Bank Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: US 50 STATES (+DC & PR) SAAS & SERVICES MATRIX */}
      {/* ========================================================= */}
      {activeSubTab === 'us_states_matrix' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                United States 50-State SaaS & Digital Services Taxability Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Complete post-Wayfair economic nexus thresholds, SaaS sales taxability, and official Department of Revenue evidence links for all 50 states, DC, and Puerto Rico.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={matrixSearch}
                  onChange={(e) => setMatrixSearch(e.target.value)}
                  placeholder="Search state name, code, or DOR..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs">
                {(['All', 'Taxable', 'Exempt', 'Partial'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setMatrixFilter(filter)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      matrixFilter === filter
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter === 'All' ? 'All States' : filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 50 States Table */}
          <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-[640px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3">State / Jurisdiction</th>
                  <th className="py-2.5 px-3 text-right">State Rate</th>
                  <th className="py-2.5 px-3 text-right">Avg Combined</th>
                  <th className="py-2.5 px-3">SaaS Taxable?</th>
                  <th className="py-2.5 px-3">Digital Goods</th>
                  <th className="py-2.5 px-3">Wayfair Nexus Threshold</th>
                  <th className="py-2.5 px-3">Governing Legal Statute</th>
                  <th className="py-2.5 px-3 text-right">Official DOR Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStates.map((st) => (
                  <tr key={st.code} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{st.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{st.code} · {st.stateAuthority}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                      {st.salesTaxRate}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {st.avgCombinedSalesTaxRate !== undefined ? `${st.avgCombinedSalesTaxRate}%` : '—'}
                    </td>
                    <td className="py-2.5 px-3">
                      {st.saasTaxable === true ? (
                        <span className="px-2 py-0.5 rounded-sm bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[11px]">
                          Taxable
                        </span>
                      ) : st.saasTaxable === 'Partially Taxable' ? (
                        <span className="px-2 py-0.5 rounded-sm bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
                          Partial ({st.saasTaxRate}%)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                          Exempt
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {st.digitalGoodsTaxable ? (
                        <span className="text-slate-700">Taxable</span>
                      ) : (
                        <span className="text-slate-400">Exempt</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {st.economicNexusThreshold
                        ? `$${(st.economicNexusThreshold.revenue / 1000).toFixed(0)}k${
                            st.economicNexusThreshold.transactions ? ` / ${st.economicNexusThreshold.transactions} txns` : ''
                          }`
                        : 'None'}
                    </td>
                    <td className="py-2.5 px-3 max-w-xs text-[11px] font-mono text-slate-600 truncate" title={st.statuteCitation}>
                      {st.statuteCitation || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {st.evidenceUrl && (
                        <a
                          href={st.evidenceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                        >
                          <span>Gov Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: GLOBAL DIGITAL SERVICES TAX (DST) REGIMES */}
      {/* ========================================================= */}
      {activeSubTab === 'dst_directory' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Worldwide Digital Services Tax (DST) Regimes & Turnovers
            </h3>
            <p className="text-xs text-slate-500">
              Unilateral digital turnover taxes on digital advertising, online marketplaces, and data transmission pending OECD Pillar One multilateral treaty implementation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GLOBAL_DST_REGIMES.map((dst) => (
              <div
                key={dst.countryCode}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-xs text-slate-900">
                      {dst.country} <span className="font-mono text-slate-400">[{dst.countryCode}]</span>
                    </span>
                    <span className="text-sm font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {dst.rate}% DST
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-800 mt-2">{dst.taxName}</div>
                  <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">{dst.coveredActivities}</div>

                  <div className="mt-3 p-2 rounded-md bg-white border border-slate-200 text-[11px] space-y-1 font-mono">
                    <div>
                      <span className="text-slate-400">Global Threshold: </span>
                      <span className="text-slate-800 font-semibold">{dst.globalRevenueThreshold}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Domestic Threshold: </span>
                      <span className="text-slate-800 font-semibold">{dst.domesticRevenueThreshold}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-600">Statute: </span>
                    <span className="font-mono">{dst.statuteCitation}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <a
                    href={dst.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Official Ministry Guidance</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
