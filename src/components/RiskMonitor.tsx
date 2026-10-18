import React, { useState, useMemo } from 'react';
import type { TradeCalculationInput, TradeCalculationResult } from '../utils/tariffCalculator.ts';
import {
  evaluateShipmentComplianceRisks,
  type ComplianceRiskAlert,
  type RiskSeverity,
} from '../utils/complianceRiskMonitor.ts';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Wrench,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface RiskMonitorProps {
  calculationInput: TradeCalculationInput;
  calculationResult: TradeCalculationResult;
  onApplyFta: (ftaId: string) => void;
  onSetBenchmarkFreight: (freightAmount: number) => void;
  onOpenPermissions?: () => void;
  onTriggerScenario?: (scenario: {
    originCountry: string;
    destinationCountry: string;
    hsCode: string;
    shippingInsurance: number;
    tradeAgreement: string;
  }) => void;
}

export const RiskMonitor: React.FC<RiskMonitorProps> = ({
  calculationInput,
  calculationResult,
  onApplyFta,
  onSetBenchmarkFreight,
  onOpenPermissions,
  onTriggerScenario,
}) => {
  const [mitigatedIds, setMitigatedIds] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'mitigated'>('all');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [expandAllCards, setExpandAllCards] = useState<boolean>(false);

  const riskSummary = useMemo(
    () => evaluateShipmentComplianceRisks(calculationInput, calculationResult, mitigatedIds),
    [calculationInput, calculationResult, mitigatedIds]
  );

  const toggleMitigate = (alertId: string) => {
    setMitigatedIds((prev) =>
      prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]
    );
  };

  const handlePrimaryAction = (alert: ComplianceRiskAlert) => {
    if (alert.actionType === 'apply_fta' && alert.actionPayload !== undefined) {
      onApplyFta(String(alert.actionPayload));
      return;
    }
    if (alert.actionType === 'set_benchmark_freight' && alert.actionPayload !== undefined) {
      onSetBenchmarkFreight(Number(alert.actionPayload));
      return;
    }
    if (alert.actionType === 'open_permissions' && onOpenPermissions) {
      toggleMitigate(alert.id);
      onOpenPermissions();
      return;
    }
    toggleMitigate(alert.id);
  };

  const filteredAlerts = useMemo(() => {
    if (filterMode === 'active') {
      return riskSummary.alerts.filter((a) => !mitigatedIds.includes(a.id));
    }
    if (filterMode === 'mitigated') {
      return riskSummary.alerts.filter((a) => mitigatedIds.includes(a.id));
    }
    return riskSummary.alerts;
  }, [riskSummary.alerts, filterMode, mitigatedIds]);

  const displayedCards = useMemo(() => {
    if (expandAllCards) return filteredAlerts;
    const match =
      filteredAlerts.find((a) => a.id === selectedAlertId) ||
      filteredAlerts.find((a) => !mitigatedIds.includes(a.id)) ||
      filteredAlerts[0];
    return match ? [match] : [];
  }, [expandAllCards, filteredAlerts, selectedAlertId, mitigatedIds]);

  const getSeverityBadgeStyle = (severity: RiskSeverity, isMitigated: boolean) => {
    if (isMitigated) {
      return {
        pill: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
        cardBorder: 'border-emerald-200 bg-emerald-50/30',
        badgeBg: 'bg-emerald-600 text-white',
        actionBtn: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      };
    }
    switch (severity) {
      case 'Critical':
        return {
          pill: 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100',
          cardBorder: 'border-rose-200 bg-rose-50/30',
          badgeBg: 'bg-rose-600 text-white',
          actionBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
        };
      case 'High':
        return {
          pill: 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100',
          cardBorder: 'border-amber-200 bg-amber-50/30',
          badgeBg: 'bg-amber-600 text-white',
          actionBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      case 'Medium':
        return {
          pill: 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100',
          cardBorder: 'border-indigo-200 bg-indigo-50/20',
          badgeBg: 'bg-indigo-600 text-white',
          actionBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        };
      default:
        return {
          pill: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
          cardBorder: 'border-slate-200 bg-slate-50/50',
          badgeBg: 'bg-slate-700 text-white',
          actionBtn: 'bg-slate-800 hover:bg-slate-900 text-white',
        };
    }
  };

  return (
    <section
      aria-label="Cross-Border Compliance Risk Monitor"
      data-testid="compliance-risk-monitor"
      className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4"
    >
      {/* Top Header: Risk Monitor Title + Readiness Score & Overall Risk Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-900 text-white">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Risk Monitor</span>
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border ${
                riskSummary.overallRiskLevel === 'Critical'
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : riskSummary.overallRiskLevel === 'High'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : riskSummary.overallRiskLevel === 'Elevated'
                  ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              {riskSummary.overallRiskLevel === 'Compliant'
                ? '✓ Pre-Clearance Compliant'
                : `${riskSummary.overallRiskLevel} Compliance Risk (${riskSummary.activeAlertsCount} Open)`}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-display">
            Automated Cross-Border & Customs Compliance Violation Radar
          </h3>
          <p className="text-xs text-slate-500">
            Real-time screening of WTO valuation rules, EU CBAM carbon levies, ADD/CVD trade remedies, BIS dual-use export controls, and FTA origin protocols.
          </p>
        </div>

        {/* Compliance Readiness Gauge */}
        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Clearance Readiness
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span
                className={`text-lg font-bold font-mono ${
                  riskSummary.readinessScore >= 85
                    ? 'text-emerald-600'
                    : riskSummary.readinessScore >= 60
                    ? 'text-amber-600'
                    : 'text-rose-600'
                }`}
              >
                {riskSummary.readinessScore}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
            </div>
          </div>
          <div className="w-2.5 h-8 bg-slate-200 rounded-full overflow-hidden flex flex-col justify-end">
            <div
              style={{ height: `${riskSummary.readinessScore}%` }}
              className={`w-full transition-all ${
                riskSummary.readinessScore >= 85
                  ? 'bg-emerald-500'
                  : riskSummary.readinessScore >= 60
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Quick Compliance Violation Scenario Presets at Top for Immediate Testing */}
      {onTriggerScenario && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/80 text-[11px]">
          <span className="font-semibold text-slate-600">
            Simulate Cross-Border Violation Preset:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMitigatedIds([]);
                setSelectedAlertId('cif-freight-zero');
                onTriggerScenario({
                  originCountry: 'US',
                  destinationCountry: 'DE',
                  hsCode: '7601.10',
                  shippingInsurance: 0,
                  tradeAgreement: '',
                });
              }}
              className="px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-semibold cursor-pointer transition-colors"
            >
              EU CBAM Aluminum + Zero Freight
            </button>
            <button
              type="button"
              onClick={() => {
                setMitigatedIds([]);
                setSelectedAlertId('unclaimed-fta-USMCA');
                onTriggerScenario({
                  originCountry: 'US',
                  destinationCountry: 'CA',
                  hsCode: '8703.80',
                  shippingInsurance: 1500,
                  tradeAgreement: '',
                });
              }}
              className="px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold cursor-pointer transition-colors"
            >
              Uncertified USMCA EV Relief
            </button>
            <button
              type="button"
              onClick={() => {
                setMitigatedIds([]);
                setSelectedAlertId('dual-use-export-8542');
                onTriggerScenario({
                  originCountry: 'US',
                  destinationCountry: 'SG',
                  hsCode: '8542.31',
                  shippingInsurance: 850,
                  tradeAgreement: '',
                });
              }}
              className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold cursor-pointer transition-colors"
            >
              ECCN 3A090 Semiconductors
            </button>
          </div>
        </div>
      )}

      {/* Actionable Warning Badges Strip */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Actionable Warning Badges ({riskSummary.alerts.length} Detected)</span>
          </span>

          {/* Filter & Expand Controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'active', 'mitigated'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFilterMode(mode)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  filterMode === mode
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {mode === 'all'
                  ? `All (${riskSummary.alerts.length})`
                  : mode === 'active'
                  ? `Open (${riskSummary.activeAlertsCount})`
                  : `Mitigated (${mitigatedIds.length})`}
              </button>
            ))}

            {filteredAlerts.length > 1 && (
              <button
                type="button"
                onClick={() => setExpandAllCards((prev) => !prev)}
                className="px-2 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 inline-flex items-center gap-1 cursor-pointer"
              >
                {expandAllCards ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    <span>Compact View</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    <span>Expand All ({filteredAlerts.length})</span>
                  </>
                )}
              </button>
            )}

            {mitigatedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setMitigatedIds([])}
                className="px-2 py-1 rounded-md text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 inline-flex items-center gap-1 cursor-pointer"
                aria-label="Reset mitigated compliance alerts"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Clickable Actionable Warning Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {riskSummary.alerts.map((alert) => {
            const isMitigated = mitigatedIds.includes(alert.id);
            const isSelected = displayedCards.some((c) => c.id === alert.id);
            const style = getSeverityBadgeStyle(alert.severity, isMitigated);
            return (
              <div
                key={`badge-${alert.id}`}
                className={`inline-flex items-center rounded-lg border text-xs font-semibold transition-all shadow-2xs overflow-hidden ${style.pill} ${
                  isSelected ? 'ring-2 ring-indigo-500/40' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedAlertId(alert.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer text-left"
                >
                  {isMitigated ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : alert.severity === 'Critical' ? (
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  )}
                  <span>{alert.badgeLabel}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePrimaryAction(alert)}
                  aria-label={`${alert.badgeLabel}: ${alert.actionLabel}`}
                  className={`px-2 py-1.5 text-[10px] font-mono font-bold cursor-pointer border-l border-black/10 transition-opacity hover:opacity-90 ${style.badgeBg}`}
                >
                  {isMitigated
                    ? '✓ Mitigated'
                    : alert.actionType === 'apply_fta'
                    ? 'Lock In FTA'
                    : alert.actionType === 'set_benchmark_freight'
                    ? 'Fix Freight'
                    : `${alert.severity} · Fix`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focused or Expanded Actionable Violation Card(s) */}
      <div className="space-y-2.5 pt-1">
        {displayedCards.map((alert) => {
          const isMitigated = mitigatedIds.includes(alert.id);
          const style = getSeverityBadgeStyle(alert.severity, isMitigated);

          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border transition-all space-y-2 ${style.cardBorder}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${style.badgeBg}`}
                    >
                      {isMitigated ? '✓ Mitigated' : alert.severity}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                      {alert.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {alert.statutoryCitation}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {alert.title}
                  </h4>
                </div>

                {/* Primary Remediation / Attestation Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePrimaryAction(alert)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${style.actionBtn}`}
                  >
                    {isMitigated ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Attested (Click to Undo)</span>
                      </>
                    ) : (
                      <>
                        <Wrench className="w-3.5 h-3.5" />
                        <span>{alert.actionLabel}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {alert.violationSummary}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1.5 border-t border-slate-200/70 text-[11px]">
                <span className="font-medium text-slate-800">
                  <strong className="font-semibold text-slate-900">Enforcement Exposure:</strong>{' '}
                  {alert.financialExposureNote}
                </span>

                {onOpenPermissions && alert.actionType !== 'open_permissions' && (
                  <button
                    type="button"
                    onClick={onOpenPermissions}
                    className="text-indigo-700 hover:text-indigo-900 font-semibold inline-flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>Govt Permits & Forms</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {displayedCards.length === 0 && (
          <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center space-y-1">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto" />
            <div className="text-xs font-bold text-emerald-950">
              All Triggered Compliance Violations Resolved or Mitigated
            </div>
            <p className="text-[11px] text-emerald-800">
              Your shipment parameters and attested clearance documents satisfy current border screening rules.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
