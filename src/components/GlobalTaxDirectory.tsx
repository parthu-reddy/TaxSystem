import React, { useState } from 'react';
import { CountryTaxInfo } from '../types/tax.ts';
import { GLOBAL_TAX_DATABASE } from '../data/taxDatabase.ts';
import { StateTaxNexusMap } from './StateTaxNexusMap.tsx';
import {
  Search,
  ExternalLink,
  Building2,
  FileText,
  Percent,
  Check,
  X,
  ChevronRight,
  ShieldAlert,
  MapPin,
} from 'lucide-react';

export const GlobalTaxDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [filterPillarTwo, setFilterPillarTwo] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryTaxInfo | null>(GLOBAL_TAX_DATABASE[0]);
  const [showStateMap, setShowStateMap] = useState<boolean>(true);

  const filteredCountries = GLOBAL_TAX_DATABASE.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.statutoryAuthority.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
    const matchesPillarTwo = !filterPillarTwo || c.hasPillarTwo;
    return matchesSearch && matchesRegion && matchesPillarTwo;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Worldwide Sovereign Tax Regimes & Statutory Directory
            </h2>
            <p className="text-xs text-slate-500">
              Verified corporate CIT, standard VAT/GST, withholding rates, interactive domestic state nexus maps, and official government authorities
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowStateMap((prev) => !prev)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
                showStateMap
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{showStateMap ? 'Hide State Tax & Nexus Map' : 'Interactive State Tax & Nexus Map'}</span>
            </button>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by country, code or authority..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Region & Feature Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {['All', 'Americas', 'Europe', 'Asia-Pacific', 'Middle East', 'Africa'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedRegion === reg
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filterPillarTwo}
              onChange={(e) => setFilterPillarTwo(e.target.checked)}
              className="rounded-xs border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>OECD Pillar Two (15% Minimum Floor) Only</span>
          </label>
        </div>
      </div>

      {/* Interactive State-Specific Tax Burden & Economic Nexus Visualization */}
      {showStateMap && (
        <StateTaxNexusMap
          selectedCountryCode={selectedCountry?.code}
          onSelectCountryCode={(code) => {
            const match = GLOBAL_TAX_DATABASE.find((c) => c.code === code);
            if (match) setSelectedCountry(match);
          }}
        />
      )}

      {/* 2-Column Split: Country List on Left, Deep Dive Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Country List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 flex items-center justify-between">
            <span>Jurisdiction ({filteredCountries.length})</span>
            <span>Corporate / VAT</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredCountries.map((c) => {
              const isSelected = selectedCountry?.code === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => setSelectedCountry(c)}
                  className={`w-full text-left p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    isSelected ? 'bg-indigo-50/60 border-l-2 border-indigo-600' : ''
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{c.name}</span>
                      <span className="font-mono text-[11px] text-slate-500">[{c.code}]</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">
                      {c.statutoryAuthority}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-mono font-semibold text-slate-900">
                        {c.corporateTaxRate}% CIT
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {c.vatGstRate}% VAT
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>
              );
            })}

            {filteredCountries.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                No matching country tax regimes found for your query.
              </div>
            )}
          </div>
        </div>

        {/* Selected Country Deep Dive (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedCountry ? (
            <>
              {/* Country Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 font-medium">
                    {selectedCountry.region} <span aria-hidden="true">·</span> Currency: {selectedCountry.currency} ({selectedCountry.currencySymbol}) <span aria-hidden="true">·</span> Tax Year-End: {selectedCountry.taxYearEnd}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-display mt-0.5">
                    {selectedCountry.name}
                  </h3>
                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedCountry.statutoryAuthority}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href={selectedCountry.authorityWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Official Ministry Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {selectedCountry.legalGazetteUrl && (
                    <a
                      href={selectedCountry.legalGazetteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5 border border-slate-200"
                    >
                      <span>National Gazette</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Official Evidence Verification Note */}
              {selectedCountry.officialEvidenceNote && (
                <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 uppercase tracking-wide text-[10px]">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Statutory Evidence & Legal Gazette Record</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-900/90 font-sans">
                    {selectedCountry.officialEvidenceNote}
                  </p>
                </div>
              )}

              {/* Services & SaaS Tax Regime if available */}
              {selectedCountry.servicesTaxInfo && (
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Tax on Services & SaaS Regime
                      </span>
                      <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30">
                        {selectedCountry.servicesTaxInfo.b2bRule}
                      </span>
                    </div>
                    {selectedCountry.servicesTaxInfo.servicesEvidenceUrl && (
                      <a
                        href={selectedCountry.servicesTaxInfo.servicesEvidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
                      >
                        <span>Services Tax Guidance</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">VAT/GST on Services</span>
                      <span className="font-mono font-bold text-white text-sm">
                        {selectedCountry.servicesTaxInfo.vatGstOnServices}%
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">B2B Rule</span>
                      <span className="font-semibold text-indigo-300 text-xs">
                        {selectedCountry.servicesTaxInfo.reverseChargeApplies ? 'Reverse Charge' : 'Destination'}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">WHT on Services (FTS)</span>
                      <span className="font-mono font-bold text-amber-300 text-sm">
                        {selectedCountry.servicesTaxInfo.withholdingTaxOnServices}%
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">Digital Services Tax</span>
                      <span className="font-mono font-bold text-purple-300 text-sm">
                        {selectedCountry.servicesTaxInfo.digitalServicesTaxRate ? `${selectedCountry.servicesTaxInfo.digitalServicesTaxRate}%` : '0%'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans pt-1">
                    {selectedCountry.servicesTaxInfo.servicesStatuteNote}
                  </p>
                </div>
              )}

              {/* Tax Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Standard Corporate CIT</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {selectedCountry.corporateTaxRate}%
                  </div>
                  {selectedCountry.smallBusinessTaxRate !== undefined && (
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Small biz: {selectedCountry.smallBusinessTaxRate}%
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Standard VAT / GST</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {selectedCountry.vatGstRate}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {selectedCountry.reducedVatRates?.length
                      ? `Reduced: ${selectedCountry.reducedVatRates.join('%, ')}%`
                      : 'Standard rate only'}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Dividends Withholding</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {selectedCountry.withholdingDividends}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Subject to treaty relief</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Royalties Withholding</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {selectedCountry.withholdingRoyalties}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Cross-border IP licenses</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Interest Withholding</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {selectedCountry.withholdingInterest}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Intercompany debt</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Pillar Two GloBE</div>
                  <div className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    {selectedCountry.hasPillarTwo ? (
                      <span className="text-indigo-600 flex items-center gap-1 text-sm">
                        <Check className="w-4 h-4 text-emerald-600" /> 15% Enacted
                      </span>
                    ) : (
                      <span className="text-slate-500 text-sm">Pending</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">€750M MNE turnover</div>
                </div>
              </div>

              {/* Legal Statute Citation */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700 block mb-0.5">Governing Legal Statute:</span>
                <span className="text-slate-600 font-mono text-[11px]">{selectedCountry.statuteReference}</span>
              </div>

              {/* Sub-divisions (States/Provinces) if available */}
              {selectedCountry.subdivisions && selectedCountry.subdivisions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Sub-Division & Interstate Tax Schedules ({selectedCountry.subdivisions.length} States/Provinces)
                    </h4>
                    <span className="text-[11px] text-slate-500">Wayfair Economic Nexus Active</span>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                          <th className="py-2 px-3">State / Sub-division</th>
                          <th className="py-2 px-3 text-right">Sales Tax</th>
                          <th className="py-2 px-3">SaaS Taxable?</th>
                          <th className="py-2 px-3">Nexus Threshold</th>
                          <th className="py-2 px-3 text-right">Official DOR Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedCountry.subdivisions.map((s) => (
                          <tr key={s.code} className="hover:bg-slate-50">
                            <td className="py-2 px-3">
                              <span className="font-medium text-slate-900">{s.name}</span>{' '}
                              <span className="font-mono text-slate-400">({s.code})</span>
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-semibold text-slate-800">
                              {s.salesTaxRate}%
                            </td>
                            <td className="py-2 px-3">
                              {s.saasTaxable === true ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                  Taxable
                                </span>
                              ) : s.saasTaxable === 'Partially Taxable' ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                  Partial
                                </span>
                              ) : s.saasTaxable === false ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Exempt
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                              {s.economicNexusThreshold
                                ? `$${(s.economicNexusThreshold.revenue / 1000).toFixed(0)}k rev`
                                : 'None'}
                            </td>
                            <td className="py-2 px-3 text-right">
                              {s.evidenceUrl ? (
                                <a
                                  href={s.evidenceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900"
                                >
                                  <span>Gov Site</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Trade Agreements */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">
                  Recognized Free Trade Agreements & Treaties
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedCountry.tradeAgreements.map((ta) => (
                    <span
                      key={ta}
                      className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-medium"
                    >
                      {ta}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              Select a country from the left directory to inspect its complete sovereign tax schedule.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
