import React, { useState } from 'react';
import { FiscalPolicyUpdate, CountryTaxInfo } from '../types/tax.ts';
import { FISCAL_POLICY_UPDATES } from '../data/fiscalPolicyUpdates.ts';
import { GLOBAL_TAX_DATABASE } from '../data/taxDatabase.ts';
import {
  TrendingUp,
  AlertOctagon,
  ShieldCheck,
  Globe2,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Filter,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface DashboardOverviewProps {
  onSelectUpdate: (update: FiscalPolicyUpdate) => void;
  onNavigateToCalculator: () => void;
  onNavigateToVault: () => void;
  language: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onSelectUpdate,
  onNavigateToCalculator,
  onNavigateToVault,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');

  // Filter updates
  const filteredUpdates = FISCAL_POLICY_UPDATES.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'All' || item.severity === selectedSeverity;
    return matchesCategory && matchesSeverity;
  });

  // Calculate quick stats
  const totalJurisdictions = GLOBAL_TAX_DATABASE.length;
  const pillarTwoCountries = GLOBAL_TAX_DATABASE.filter((c) => c.hasPillarTwo).length;
  const avgCorporateTax = (
    GLOBAL_TAX_DATABASE.reduce((sum, c) => sum + c.corporateTaxRate, 0) / totalJurisdictions
  ).toFixed(1);

  // Region breakdown for trend chart
  const regions = ['Americas', 'Europe', 'Asia-Pacific', 'Middle East', 'Africa'] as const;
  const regionAverages = regions.map((region) => {
    const subset = GLOBAL_TAX_DATABASE.filter((c) => c.region === region);
    const avg = subset.length > 0
      ? (subset.reduce((sum, c) => sum + c.corporateTaxRate, 0) / subset.length).toFixed(1)
      : '0.0';
    const vatAvg = subset.length > 0
      ? (subset.reduce((sum, c) => sum + c.vatGstRate, 0) / subset.length).toFixed(1)
      : '0.0';
    return { region, cit: parseFloat(avg), vat: parseFloat(vatAvg), count: subset.length };
  });

  return (
    <div className="space-y-8">
      {/* Hero Strip */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 tracking-wider uppercase">
            <span>Global Fiscal Command & Regulatory Intelligence</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
            Real-Time Global Tax Regimes, Trade Tariffs & Fiscal Policy Radar
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
            Directly monitoring 195+ revenue ministries, official legal gazettes, OECD Pillar Two global minimum tax standards, and cross-border tariff structures for multinational supply chain and accounting teams.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateToCalculator}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Launch Cross-Border Tariff Calculator</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onNavigateToVault}
              className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors inline-flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
              <span>Open Secure Document Vault</span>
            </button>
          </div>
        </div>

        {/* Subtle geometric graphic overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="160" stroke="white" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="200" cy="200" r="120" stroke="white" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="80" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M40 200 H360 M200 40 V360" stroke="white" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Jurisdictions Monitored</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">195+</span>
            <span className="text-xs text-slate-500">Live Gazettes</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>IRS, HMRC, BMF, SAT, CRA synced</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Global Corporate CIT Avg</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{avgCorporateTax}%</span>
            <span className="text-xs text-slate-500">Benchmark</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            <span>Range: 9.0% (UAE) to 34.0% (Brazil)</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Pillar Two Global Min. Tax</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-600">{pillarTwoCountries}</span>
            <span className="text-sm font-semibold text-slate-800">Jurisdictions</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            <span>15% Effective Floor Active</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Vault Audit Readiness</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-600">98.4%</span>
            <span className="text-xs text-slate-500">Verified</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            <span>Zero critical customs holds</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Tax Trends & Compliance Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-Time Fiscal Policy Updates Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Real-Time Fiscal Policy & Statutory Changes
              </h2>
              <p className="text-xs text-slate-500">
                Direct government gazette feeds with instant AI MNE impact summaries
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
              {['All', 'High', 'Medium'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    selectedSeverity === sev
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sev} Severity
                </button>
              ))}
            </div>
          </div>

          {/* Update Cards */}
          <div className="space-y-3">
            {filteredUpdates.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs space-y-3"
              >
                {/* Unboxed metadata row adhering to zero-pill discipline */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{item.countryName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{item.publishedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        item.severity === 'High'
                          ? 'text-rose-600'
                          : item.severity === 'Medium'
                          ? 'text-amber-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {item.severity} Impact
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Effective: {item.effectiveDate}</span>
                  </div>
                </div>

                {/* Title & summary */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Layman preview box */}
                <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
                  <span className="font-semibold text-indigo-700 shrink-0">Plain English:</span>
                  <span className="leading-relaxed">{item.mneImpact.laymanExplanation}</span>
                </div>

                {/* Action links */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-[11px] text-slate-500 truncate max-w-xs">
                    Gazette: {item.officialGazette}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Statute</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => onSelectUpdate(item)}
                      className="px-3 py-1.5 font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-300" />
                      <span>Full AI Impact Analysis</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Tax Trend Analytics & Risk Radar */}
        <div className="space-y-6">
          {/* Regional Rate Comparison */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Regional Tax Benchmark (CIT vs VAT)
              </h3>
              <p className="text-xs text-slate-500">
                Average corporate income tax and indirect VAT/GST by continent
              </p>
            </div>

            <div className="space-y-3.5">
              {regionAverages.map((item) => (
                <div key={item.region} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{item.region}</span>
                    <span className="font-mono text-slate-600">
                      CIT {item.cit}% <span className="text-slate-400">/</span> VAT {item.vat}%
                    </span>
                  </div>
                  {/* Visual Bar Indicator */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-slate-900 h-full"
                      style={{ width: `${(item.cit / 40) * 100}%` }}
                      title={`Corporate Tax: ${item.cit}%`}
                    />
                    <div
                      className="bg-indigo-400 h-full"
                      style={{ width: `${(item.vat / 40) * 100}%` }}
                      title={`VAT/GST: ${item.vat}%`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-slate-900 rounded-xs inline-block" /> Corporate CIT
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-indigo-400 rounded-xs inline-block" /> Indirect VAT/GST
              </span>
            </div>
          </div>

          {/* Compliance Risk Radar */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Compliance Risk Matrix
                </h3>
                <p className="text-xs text-slate-500">Audit exposure by regulatory vertical</p>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Transfer Pricing & BEPS</div>
                  <div className="text-[11px] text-slate-500">Arm’s length documentation scrutiny</div>
                </div>
                <span className="font-mono font-semibold text-amber-600">Elevated</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">CBAM Carbon Emissions</div>
                  <div className="text-[11px] text-slate-500">EU import certificate obligations</div>
                </div>
                <span className="font-mono font-semibold text-rose-600">Critical</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Interstate Wayfair Nexus</div>
                  <div className="text-[11px] text-slate-500">US State revenue thresholds</div>
                </div>
                <span className="font-mono font-semibold text-emerald-600">Managed</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Real-Time E-Invoicing</div>
                  <div className="text-[11px] text-slate-500">Continuous Transaction Controls</div>
                </div>
                <span className="font-mono font-semibold text-amber-600">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
