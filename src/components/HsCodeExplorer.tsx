import React, { useState } from 'react';
import { WCO_HS_SECTIONS, WcoSection, HsSubheading } from '../data/hsCodesDatabase.ts';
import {
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Leaf,
  HelpCircle,
  FileText,
  Percent,
  CheckCircle2,
  ShieldAlert,
  ChevronDown,
  LayoutGrid,
  ListFilter,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface HsCodeExplorerProps {
  onSelectHsCodeForCalculation: (code: string, description: string, duty?: number) => void;
  language?: string;
}

export const HsCodeExplorer: React.FC<HsCodeExplorerProps> = ({
  onSelectHsCodeForCalculation,
  language = 'English',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  // 0 means "All 21 Sections"
  const [selectedSectionId, setSelectedSectionId] = useState<number>(3); // Default to Section III to directly answer the user's focus, or user can click any!
  const [showGridOverview, setShowGridOverview] = useState<boolean>(false);

  // AI Classification state
  const [aiProductQuery, setAiProductQuery] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiClassificationResult, setAiClassificationResult] = useState<{
    hsCode: string;
    heading: string;
    chapter: string;
    section: string;
    officialDescription: string;
    estimatedMfnDuty: number;
    dutyType: string;
    cbamRequired: boolean;
    antiDumpingRisk: string;
    exportControl: string;
    requiredCertifications: string[];
    laymanExplanation: string;
  } | null>(null);

  // Flatten all subheadings with section and chapter metadata
  const allSubheadings = WCO_HS_SECTIONS.flatMap((s) =>
    s.chapters.flatMap((c) =>
      c.commonSubheadings.map((sub) => ({
        ...sub,
        sectionId: s.id,
        sectionRoman: s.romanNumeral,
        sectionTitle: s.title,
        chapterCode: c.chapterCode,
        chapterTitle: c.title,
      }))
    )
  );

  // Filter logic
  const filteredSubheadings = allSubheadings.filter((sub) => {
    // If a search query exists, search across all 21 sections
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sub.code.toLowerCase().includes(q) ||
        sub.description.toLowerCase().includes(q) ||
        sub.chapterTitle.toLowerCase().includes(q) ||
        sub.sectionTitle.toLowerCase().includes(q) ||
        sub.sectionRoman.toLowerCase().includes(q) ||
        (sub.wcoSourceNotes && sub.wcoSourceNotes.toLowerCase().includes(q))
      );
    }

    // If "All Sections" (id === 0) is selected
    if (selectedSectionId === 0) {
      return true;
    }

    // Filter by specific section ID
    return sub.sectionId === selectedSectionId;
  });

  const activeSection = WCO_HS_SECTIONS.find((s) => s.id === selectedSectionId);

  const handleAiClassify = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery || aiProductQuery;
    if (!queryToUse.trim()) return;

    try {
      setIsAiLoading(true);
      const res = await fetch('/api/tax-ai/hs-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToUse, language }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiClassificationResult(data);
      }
    } catch (err) {
      console.error('Failed to classify product with AI:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const sampleQueries = [
    'Extra virgin olive oil in glass bottles',
    'Industrial lithium-ion battery cells',
    'Commercial passenger aircraft Boeing 777',
    'Cotton denim blue jeans',
    'Raw crude palm oil for food processing',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              WCO Harmonized Commodity Nomenclature (HS) Universal Directory
            </h2>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-sm border border-emerald-200 font-semibold">
              All 21 WCO Sections Indexed
            </span>
            <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-100">
              Chapters 01 – 97
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official statutory 6-digit Harmonized System nomenclature, standard WTO MFN tariff rates, statutory units, trade remedy risks, and official regulatory evidence notes.
          </p>
        </div>

        {/* Global HS Search Input */}
        <div className="relative w-full md:w-88">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 21 sections by 6-digit code or commodity..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* AI Instant Product Classifier Box */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Universal HS Code Classifier & Tariff Analyzer</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Powered by Gemini AI · Resolves any commercial goods into exact 6-digit WCO codes
          </span>
        </div>

        <form onSubmit={(e) => handleAiClassify(e)} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={aiProductQuery}
            onChange={(e) => setAiProductQuery(e.target.value)}
            placeholder="e.g. 'extra virgin olive oil cold pressed', 'lithium iron phosphate battery pack', or 'frozen Atlantic salmon fillets'..."
            className="flex-1 px-3.5 py-2.5 text-xs rounded-lg bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={isAiLoading || !aiProductQuery.trim()}
            className="px-4 py-2.5 text-xs font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 shrink-0 flex items-center justify-center gap-1.5"
          >
            {isAiLoading ? (
              <span>Analyzing WCO Tariff Schedule...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Classify Any Commodity</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Prompts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
          <span className="text-slate-400 mr-1">Quick examples:</span>
          {sampleQueries.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setAiProductQuery(sample);
                handleAiClassify(undefined, sample);
              }}
              className="px-2 py-0.5 rounded-sm bg-slate-800/80 hover:bg-indigo-900/60 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* AI Result Card */}
        {aiClassificationResult && (
          <div className="p-4 rounded-lg bg-slate-800/95 border border-slate-700 space-y-3 text-xs animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-700/80">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-emerald-400">
                  HS {aiClassificationResult.hsCode}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-300 font-medium">
                  {aiClassificationResult.chapter}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-indigo-300 font-medium">
                  {aiClassificationResult.section}
                </span>
              </div>
              <button
                onClick={() =>
                  onSelectHsCodeForCalculation(
                    aiClassificationResult.hsCode,
                    aiClassificationResult.officialDescription,
                    aiClassificationResult.estimatedMfnDuty
                  )
                }
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-semibold text-xs transition-colors flex items-center gap-1 self-start sm:self-auto shadow-xs"
              >
                <span>Apply in Tariff Calculator</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-slate-200 leading-relaxed">
              <span className="font-semibold text-slate-400">Official Statutory Nomenclature: </span>
              {aiClassificationResult.officialDescription}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-md bg-slate-900/60 border border-slate-700/60">
                <span className="text-slate-400 block">Est. Global MFN Duty</span>
                <span className="font-mono font-bold text-white text-xs">
                  {aiClassificationResult.estimatedMfnDuty}% ({aiClassificationResult.dutyType})
                </span>
              </div>
              <div className="p-2 rounded-md bg-slate-900/60 border border-slate-700/60">
                <span className="text-slate-400 block">EU CBAM Carbon Tax</span>
                <span className="font-semibold text-xs text-white">
                  {aiClassificationResult.cbamRequired ? (
                    <span className="text-rose-400 flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> Required
                    </span>
                  ) : (
                    <span className="text-slate-400">Exempt</span>
                  )}
                </span>
              </div>
              <div className="p-2 rounded-md bg-slate-900/60 border border-slate-700/60">
                <span className="text-slate-400 block">Trade Remedy Anti-Dumping</span>
                <span className="font-semibold text-xs text-amber-400">
                  {aiClassificationResult.antiDumpingRisk} Risk
                </span>
              </div>
              <div className="p-2 rounded-md bg-slate-900/60 border border-slate-700/60">
                <span className="text-slate-400 block">Export Control Status</span>
                <span className="font-mono text-xs text-indigo-300">
                  {aiClassificationResult.exportControl}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-md bg-indigo-950/70 border border-indigo-800/60 text-indigo-200">
              <span className="font-semibold text-indigo-100 block mb-0.5">Plain English Summary:</span>
              <p className="leading-relaxed">{aiClassificationResult.laymanExplanation}</p>
            </div>
          </div>
        )}
      </div>

      {/* ALL 21 WCO SECTIONS CONTROLS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 font-display">
              <Layers className="w-4 h-4 text-indigo-600" />
              All 21 WCO Sections Directory
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              (Covering 100% of Chapters 01 through 97)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct dropdown jump to any section */}
            <select
              value={selectedSectionId}
              onChange={(e) => {
                setSelectedSectionId(Number(e.target.value));
                setSearchQuery('');
              }}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={0}>View All 21 WCO Sections Simultaneously</option>
              {WCO_HS_SECTIONS.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.romanNumeral}: {sec.shortTitle} ({sec.chaptersRange})
                </option>
              ))}
            </select>

            {/* Toggle Full Grid View */}
            <button
              type="button"
              onClick={() => setShowGridOverview(!showGridOverview)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border ${
                showGridOverview
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{showGridOverview ? 'Hide Grid' : 'Browse 21 Grid'}</span>
            </button>
          </div>
        </div>

        {/* 21 Sections Horizontal Quick Buttons */}
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          <button
            onClick={() => {
              setSelectedSectionId(0);
              setSearchQuery('');
            }}
            className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors shrink-0 font-medium ${
              selectedSectionId === 0 && !searchQuery.trim()
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All 21 Sections
          </button>

          {WCO_HS_SECTIONS.map((sec) => {
            const isSelected = selectedSectionId === sec.id && !searchQuery.trim();
            const isSection3 = sec.id === 3; // Section III Animal or Vegetable Fats and Oils
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setSelectedSectionId(sec.id);
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors shrink-0 font-medium flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : isSection3
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{sec.romanNumeral}</span>
                <span className="hidden sm:inline">· {sec.shortTitle}</span>
                {isSection3 && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Section III Requested" />
                )}
              </button>
            );
          })}
        </div>

        {/* Optional 21-Section Interactive Grid View */}
        {showGridOverview && (
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 animate-in fade-in duration-150">
            {WCO_HS_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setSelectedSectionId(sec.id);
                  setShowGridOverview(false);
                  setSearchQuery('');
                }}
                className={`text-left p-2.5 rounded-lg border transition-all text-xs ${
                  selectedSectionId === sec.id
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                    : sec.id === 3
                    ? 'border-amber-300 bg-amber-50/40 hover:bg-amber-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between font-mono font-semibold text-slate-900">
                  <span className={sec.id === 3 ? 'text-amber-800' : 'text-indigo-700'}>
                    {sec.romanNumeral}
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans font-normal">
                    {sec.chaptersRange}
                  </span>
                </div>
                <div className="font-medium text-slate-800 mt-0.5 line-clamp-1">{sec.title}</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {sec.chapters.map((c) => `Ch.${c.chapterCode} ${c.title}`).join('; ')}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Table / Directory of HS Subheadings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 font-display text-sm">
                {searchQuery.trim()
                  ? `Search Results for "${searchQuery}"`
                  : selectedSectionId === 0
                  ? 'All 21 WCO Universal Sections (Chapters 01 – 97)'
                  : `${activeSection?.romanNumeral}: ${activeSection?.title} (${activeSection?.chaptersRange})`}
              </h3>
              {selectedSectionId === 3 && !searchQuery.trim() && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-medium rounded-sm text-[11px] border border-amber-200">
                  Chapter 15: Animal or Vegetable Fats, Oils & Waxes
                </span>
              )}
            </div>
            <p className="text-slate-500 mt-0.5">
              Official World Customs Organization 6-digit classification with MFN baseline duties, statutory units & legal sources
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-600 font-semibold bg-white px-2.5 py-1 rounded-md border border-slate-200">
              {filteredSubheadings.length} subheadings indexed
            </span>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">HS 6-Digit Code</th>
                <th className="py-2.5 px-3">WCO Section & Chapter</th>
                <th className="py-2.5 px-3">Official Statutory Description</th>
                <th className="py-2.5 px-3 text-right">Standard MFN Duty</th>
                <th className="py-2.5 px-3 text-center">Duty Type</th>
                <th className="py-2.5 px-3">Statutory Unit</th>
                <th className="py-2.5 px-3 text-center">CBAM / Trade Remedy</th>
                <th className="py-2.5 px-3">Official Regulatory Notes & Evidence</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubheadings.map((sub) => (
                <tr key={`${sub.sectionRoman}-${sub.code}`} className="hover:bg-slate-50 transition-colors">
                  {/* Code */}
                  <td className="py-3 px-3 font-mono font-bold text-indigo-700 whitespace-nowrap">
                    {sub.code}
                  </td>

                  {/* Section & Chapter */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-[11px] font-mono font-medium text-slate-600 block">
                      {sub.sectionRoman} · Ch.{sub.chapterCode}
                    </span>
                    <span className="text-[10px] text-slate-400 max-w-[140px] truncate block" title={sub.chapterTitle}>
                      {sub.chapterTitle}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-3 px-3 max-w-xs md:max-w-md">
                    <div className="font-medium text-slate-900 leading-snug">{sub.description}</div>
                  </td>

                  {/* Standard MFN Duty */}
                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                    {sub.defaultDuty.toFixed(1)}%
                  </td>

                  {/* Duty Type */}
                  <td className="py-3 px-3 text-center text-slate-600 whitespace-nowrap">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-sm ${
                        sub.dutyType === 'Duty-Free'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {sub.dutyType}
                    </span>
                  </td>

                  {/* Statutory Unit */}
                  <td className="py-3 px-3 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                    {sub.statutoryUnit}
                  </td>

                  {/* CBAM / Trade Remedy */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 text-[11px]">
                      {sub.cbamRequired && (
                        <span className="text-rose-700 font-medium bg-rose-50 px-1.5 py-0.5 rounded-xs border border-rose-100" title="EU Carbon Border Adjustment Mechanism applicable">
                          CBAM
                        </span>
                      )}
                      {sub.antiDumpingRisk && (
                        <span className="text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded-xs border border-amber-100" title="Trade remedy / anti-dumping duties active in key markets">
                          Anti-Dump
                        </span>
                      )}
                      {sub.exportControlRisk && sub.exportControlRisk !== 'Low' && (
                        <span className="text-purple-700 font-medium bg-purple-50 px-1.5 py-0.5 rounded-xs border border-purple-100" title={sub.exportControlRisk}>
                          Export Lic.
                        </span>
                      )}
                      {!sub.cbamRequired && !sub.antiDumpingRisk && (!sub.exportControlRisk || sub.exportControlRisk === 'Low') && (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                  </td>

                  {/* Statutory Notes & Regulatory Evidence */}
                  <td className="py-3 px-3 text-[11px] text-slate-500 max-w-xs">
                    {sub.wcoSourceNotes ? (
                      <span className="text-slate-700 leading-tight block">
                        {sub.wcoSourceNotes}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">
                        WCO Harmonized System 2026 Nomenclature standard MFN baseline
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectHsCodeForCalculation(sub.code, sub.description, sub.defaultDuty)}
                      className="px-2.5 py-1.5 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-md font-semibold transition-colors flex items-center gap-1 ml-auto"
                    >
                      <span>Calculate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSubheadings.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-2">
                      <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="font-semibold text-slate-700">No matching Harmonized Commodity codes found</p>
                      <p className="text-xs text-slate-500">
                        Try entering a product description in the AI Classifier above or select a different section from Section I through XXI.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
