import React, { useState } from 'react';
import { FiscalPolicyUpdate } from '../types/tax.ts';
import { Sparkles, X, AlertTriangle, ArrowRight, CheckCircle2, BookOpen, Layers } from 'lucide-react';

interface AiImpactModalProps {
  update: FiscalPolicyUpdate | null;
  onClose: () => void;
  language: string;
}

export const AiImpactModal: React.FC<AiImpactModalProps> = ({ update, onClose, language }) => {
  const [isLaymanMode, setIsLaymanMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [aiData, setAiData] = useState<{
    executiveSummary?: string;
    cashFlowImpact?: string;
    supplyChainRisk?: string;
    mitigationSteps?: string[];
    laymanExplanation?: string;
  } | null>(null);

  React.useEffect(() => {
    if (!update) {
      setAiData(null);
      return;
    }

    // Initialize with provided data from verified update
    setAiData({
      executiveSummary: update.summary,
      cashFlowImpact: update.mneImpact.cashFlowImpact,
      supplyChainRisk: update.mneImpact.supplyChainRisk,
      mitigationSteps: [
        update.mneImpact.actionRequired,
        'Validate cross-border ERP tax determination keys and supplier master data.',
        'File statutory notifications in the corporate compliance vault.',
      ],
      laymanExplanation: update.mneImpact.laymanExplanation,
    });

    // Optionally request fresh deep-dive from server-side Gemini API
    const fetchDeepAi = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/tax-ai/impact-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: update.title,
            country: update.countryName,
            category: update.category,
            summary: update.summary,
            language,
          }),
        });
        if (res.ok) {
          const fresh = await res.json();
          if (fresh && fresh.executiveSummary) {
            setAiData(fresh);
          }
        }
      } catch (err) {
        console.warn('Using baseline fiscal data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeepAi();
  }, [update, language]);

  if (!update) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">
                {update.countryName} <span aria-hidden="true">·</span> {update.category} <span aria-hidden="true">·</span> Effective {update.effectiveDate}
              </div>
              <h2 className="text-base font-bold text-slate-900 font-display">
                Multinational Business Impact Assessment
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Toggle: Layman vs Technical */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Explanation Complexity</span>
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setIsLaymanMode(true)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                isLaymanMode
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Plain English (Layman Mode)
            </button>
            <button
              onClick={() => setIsLaymanMode(false)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                !isLaymanMode
                  ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Technical Legal & Accounting
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Policy Title Box */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">{update.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{update.summary}</p>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
              <span>Gazette: {update.officialGazette}</span>
              <span aria-hidden="true">·</span>
              <a
                href={update.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline font-medium"
              >
                View Official Statute &rarr;
              </a>
            </div>
          </div>

          {/* Dual Explanation View */}
          {isLaymanMode ? (
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
              <div className="flex items-center gap-2 text-indigo-950 font-semibold text-xs tracking-wide uppercase">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>What This Means in Plain English</span>
              </div>
              <p className="text-sm text-indigo-950 leading-relaxed font-normal">
                {aiData?.laymanExplanation || update.mneImpact.laymanExplanation}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  Executive Summary for CFO / Tax Counsel
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {aiData?.executiveSummary || update.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                  <div className="text-xs font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Cash Flow & Tax Provision Impact
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {aiData?.cashFlowImpact || update.mneImpact.cashFlowImpact}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                  <div className="text-xs font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Supply Chain & Customs Risk
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {aiData?.supplyChainRisk || update.mneImpact.supplyChainRisk}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Checklist */}
          <div>
            <h4 className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Recommended Immediate Actions for Accounting & Supply Chain
            </h4>
            <ul className="space-y-2">
              {(aiData?.mitigationSteps || [update.mneImpact.actionRequired]).map((step, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-700 flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <span className="text-slate-400 font-mono text-[11px] shrink-0 mt-0.5">
                    0{idx + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Official Source: {update.officialGazette}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
