import React, { useState } from 'react';
import { REGULATORY_SOURCES_DIRECTORY } from '../data/regulatorySources.ts';
import {
  FileCheck2,
  Download,
  Printer,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export const ComplianceAudit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit_report' | 'regulatory_sources'>('audit_report');
  const [selectedJurisdictionFilter, setSelectedJurisdictionFilter] = useState<string>('All');

  const filteredSources = REGULATORY_SOURCES_DIRECTORY.filter((src) => {
    return selectedJurisdictionFilter === 'All' || src.jurisdictionLevel === selectedJurisdictionFilter;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Audit Item,Regulatory Code,Jurisdiction,Status,Readiness Score,Action Deadline',
        'Transfer Pricing Master File,OECD Action 13 / IRC § 6662,United States & Global,Compliant,98%,2026-12-31',
        'USMCA Preferential Origin Proof,Customs 19 CFR Part 182,North America,Compliant,100%,2026-10-31',
        'EU CBAM Carbon Declarant Filing,EU Regulation 2023/956,European Union,Review Pending,85%,2026-11-15',
        'State Sales Tax Economic Nexus,South Dakota v. Wayfair,United States (45 States),Compliant,97%,2026-10-20',
        'Withholding Tax Certificates (W-8BEN-E),IRC Chapter 3 & 4 (FATCA),Global Counterparties,Compliant,99%,2026-12-31',
        'UK HMRC PEPPOL E-Invoicing,Finance Act 2024 / CTC,United Kingdom,Compliant,95%,2026-11-01',
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `omnitax_statutory_compliance_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Compliance Tracking & Official Regulatory Sources
          </h2>
          <p className="text-xs text-slate-500">
            Automated statutory audit verification, downloadable compliance reports, and government tax authority records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('audit_report')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'audit_report'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audit Report & Readiness
            </button>
            <button
              onClick={() => setActiveTab('regulatory_sources')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'regulatory_sources'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recorded Regulatory Sources
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Report</span>
          </button>
        </div>
      </div>

      {activeTab === 'audit_report' ? (
        <div className="space-y-6">
          {/* Executive Readiness Card */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs text-slate-500 font-medium">
                  Statutory Audit Certificate <span aria-hidden="true">·</span> Period: FY 2026-Q4 <span aria-hidden="true">·</span> Verified: Today
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display mt-0.5">
                  Multinational Enterprise Compliance Health Status
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Overall Audit Readiness</div>
                  <div className="text-2xl font-bold font-mono text-emerald-600">98.4%</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Plain English Layman Section */}
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 space-y-1">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                Layman Compliance Summary
              </span>
              <p className="text-xs text-indigo-950 leading-relaxed font-normal">
                All international trade documents, origin certificates, and cross-border invoices are safely logged in the secure vault. You currently have NO high-risk customs clearance holds or overdue tax filings. Only 1 routine task is approaching: updating your European CBAM emissions filing before November 15.
              </p>
            </div>
          </div>

          {/* Detailed Audit Verification Ledger */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Statutory Compliance Tracking Ledger
              </h3>
              <span className="text-xs text-slate-500">6 Active Audit Verticals</span>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                {
                  area: 'Transfer Pricing Master File & Local File',
                  code: 'OECD BEPS Action 13 / IRC § 6662',
                  jurisdiction: 'United States, EU, Singapore',
                  status: 'Fully Compliant',
                  score: '98%',
                  deadline: 'Dec 31, 2026',
                  details: 'Contemporaneous benchmarking study for intercompany distribution and IP royalties completed with TNMM arm’s length margins.',
                },
                {
                  area: 'USMCA Preferential Origin Proofs',
                  code: '19 CFR Part 182 / Annex 5-A',
                  jurisdiction: 'USA, Canada, Mexico',
                  status: 'Fully Compliant',
                  score: '100%',
                  deadline: 'Rolling (Annual)',
                  details: 'Manufacturer origin certifications for automotive and industrial goods verified. Saved $142,000 in MFN tariffs this quarter.',
                },
                {
                  area: 'EU Carbon Border Adjustment Mechanism (CBAM)',
                  code: 'EU Regulation 2023/956',
                  jurisdiction: 'European Union (All 27 Members)',
                  status: 'Action Pending',
                  score: '85%',
                  deadline: 'Nov 15, 2026',
                  details: 'Quarterly embedded emissions report generated for metals and aluminum imports; supplier carbon certificates awaiting final auditor validation.',
                },
                {
                  area: 'Interstate Sales Tax Nexus (Wayfair)',
                  code: 'South Dakota v. Wayfair / State Tax Codes',
                  jurisdiction: '45 US States',
                  status: 'Fully Compliant',
                  score: '97%',
                  deadline: 'Monthly / Quarterly',
                  details: 'Automated revenue threshold monitoring active. California, Texas, and New York economic nexus filings reconciled without discrepancy.',
                },
                {
                  area: 'Foreign Withholding Tax (W-8BEN-E & 1042-S)',
                  code: 'IRC § 1441, 1442 & 1446',
                  jurisdiction: 'Cross-Border Vendors',
                  status: 'Fully Compliant',
                  score: '99%',
                  deadline: 'Dec 31, 2026',
                  details: 'All foreign payee certificates of beneficial ownership verified against Bilateral Double Tax Treaties.',
                },
                {
                  area: 'UK HMRC Real-Time PEPPOL E-Invoicing',
                  code: 'Finance Act 2024 / HMRC Notice 700',
                  jurisdiction: 'United Kingdom',
                  status: 'Fully Compliant',
                  score: '95%',
                  deadline: 'Nov 01, 2026',
                  details: 'Cryptographic invoice validation tokens authenticated via direct government gateway.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{item.area}</span>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {item.code} <span aria-hidden="true">·</span> {item.jurisdiction}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          item.status === 'Fully Compliant' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {item.status === 'Fully Compliant' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        {item.status} ({item.score})
                      </span>
                      <span className="font-mono text-slate-500 text-[11px]">
                        Due: {item.deadline}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Regulatory Sources Directory */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Recorded Regulatory Information Sources & Government Gazettes
              </h3>
              <p className="text-xs text-slate-500">
                Official statutory revenue departments, customs bodies, and legal registries monitored in real-time
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
              {['All', 'Federal', 'National', 'International'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedJurisdictionFilter(lvl)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedJurisdictionFilter === lvl
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Jurisdiction & Agency</th>
                  <th className="py-2.5 px-3">Official Portal</th>
                  <th className="py-2.5 px-3">Statutory Legal Code Citation</th>
                  <th className="py-2.5 px-3">Sync Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSources.map((source) => (
                  <tr key={source.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">
                        {source.country} <span className="font-mono text-slate-400">({source.countryCode})</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{source.agencyName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <a
                        href={source.officialPortal}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <span>Official Ministry</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <div className="text-[11px] text-slate-400">
                        <a
                          href={source.legalGazetteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          Gazette Publication &rarr;
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-slate-700 text-[11px] max-w-md">
                        {source.taxCodeCitation}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{source.status}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Verified {source.lastVerifiedDate}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
