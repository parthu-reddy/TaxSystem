import React, { useState, useMemo } from 'react';
import { scaleLinear, max } from 'd3';
import {
  DOMESTIC_FEDERATIONS,
  getFederationFiscalDataset,
  getChoroplethTileStyle,
  type MapMetricKey,
  type EnrichedSubdivisionAnalytics,
} from '../utils/stateTaxMapAnalytics.ts';
import {
  MapPin,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Sliders,
  ExternalLink,
  Layers,
  Sparkles,
  Plus,
  X,
  TrendingUp,
  Building2,
} from 'lucide-react';

interface StateTaxNexusMapProps {
  selectedCountryCode?: string;
  onSelectCountryCode?: (code: string) => void;
  originStateCode?: string;
  destinationStateCode?: string;
  onSelectRouteStates?: (countryCode: string, originCode: string, destCode: string) => void;
  compactMode?: boolean;
}

const METRIC_OPTIONS: {
  key: MapMetricKey;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    key: 'combinedRate',
    label: 'Combined Sales / GST Rate',
    shortLabel: 'Combined Tax %',
    description: 'State base sales/GST rate plus average municipal/county surcharges',
  },
  {
    key: 'nexusThreshold',
    label: 'Economic Nexus Thresholds',
    shortLabel: 'Nexus Rules',
    description: 'Wayfair remote seller revenue ($100k–$500k) & transaction triggers',
  },
  {
    key: 'corporateRate',
    label: 'State Corporate / Franchise CIT',
    shortLabel: 'Corporate CIT %',
    description: 'Statutory state-level corporate income or gross receipts tax rate',
  },
  {
    key: 'saasRegime',
    label: 'SaaS & Digital Taxability',
    shortLabel: 'SaaS Regime',
    description: 'Taxability of B2B/B2C cloud software (SaaS) and digital goods',
  },
  {
    key: 'compositeBurden',
    label: 'Composite Fiscal Burden (0–100)',
    shortLabel: 'Burden Index',
    description: 'Weighted index of consumption tax, corporate rate, SaaS tax & nexus strictness',
  },
  {
    key: 'salesTaxRate',
    label: 'Base State Sales / GST Rate',
    shortLabel: 'State Rate %',
    description: 'Statutory state-level sales, GST, HST, or ICMS rate excluding local surcharges',
  },
];

export const StateTaxNexusMap: React.FC<StateTaxNexusMapProps> = ({
  selectedCountryCode,
  onSelectCountryCode,
  originStateCode,
  destinationStateCode,
  onSelectRouteStates,
  compactMode = false,
}) => {
  const activeFederationCode = useMemo(() => {
    if (selectedCountryCode && DOMESTIC_FEDERATIONS[selectedCountryCode]) {
      return selectedCountryCode;
    }
    return 'US';
  }, [selectedCountryCode]);

  const [internalCountry, setInternalCountry] = useState<string>(activeFederationCode);
  const federationCode =
    selectedCountryCode && DOMESTIC_FEDERATIONS[selectedCountryCode]
      ? selectedCountryCode
      : internalCountry;

  const [activeMetric, setActiveMetric] = useState<MapMetricKey>('combinedRate');
  const [simulatedRevenue, setSimulatedRevenue] = useState<number>(175000);
  const [simulatedTransactions, setSimulatedTransactions] = useState<number>(220);
  const [focusedStateCode, setFocusedStateCode] = useState<string>('CA');
  const [comparedCodes, setComparedCodes] = useState<string[]>(
    DOMESTIC_FEDERATIONS[federationCode]?.defaultComparedCodes || ['CA', 'TX', 'NY', 'DE']
  );
  const [filterNexusOnly, setFilterNexusOnly] = useState<boolean>(false);

  // Sync federation change
  const handleFederationChange = (nextCode: string) => {
    setInternalCountry(nextCode);
    if (onSelectCountryCode) {
      onSelectCountryCode(nextCode);
    }
    const defaults = DOMESTIC_FEDERATIONS[nextCode]?.defaultComparedCodes || [];
    setComparedCodes(defaults);
    if (defaults.length > 0) {
      setFocusedStateCode(defaults[0]);
    }
  };

  // Compute full enriched dataset using D3 analytics module
  const dataset = useMemo(
    () =>
      getFederationFiscalDataset(federationCode, {
        annualRevenue: simulatedRevenue,
        annualTransactions: simulatedTransactions,
        taxableProfitMarginPercent: 15,
      }),
    [federationCode, simulatedRevenue, simulatedTransactions]
  );

  // Ensure focusedStateCode is valid for current federation
  const activeFocusedState = useMemo(() => {
    const match = dataset.items.find((d) => d.code === focusedStateCode);
    return match || dataset.items[0] || null;
  }, [dataset.items, focusedStateCode]);

  // Ensure compared states belong to current federation
  const comparedItems = useMemo(() => {
    const valid = comparedCodes
      .map((code) => dataset.items.find((d) => d.code === code))
      .filter((d): d is EnrichedSubdivisionAnalytics => Boolean(d));
    if (valid.length > 0) return valid;
    return dataset.items.slice(0, 4);
  }, [comparedCodes, dataset.items]);

  const toggleComparedState = (code: string) => {
    setFocusedStateCode(code);
    setComparedCodes((prev) => {
      const validPrev = prev.filter((c) => dataset.items.some((i) => i.code === c));
      if (validPrev.includes(code)) {
        return validPrev.length > 1 ? validPrev.filter((c) => c !== code) : validPrev;
      }
      if (validPrev.length >= 4) {
        return [...validPrev.slice(1), code];
      }
      return [...validPrev, code];
    });
  };

  // SVG Choropleth Cartogram Geometry constants
  const tileSize = federationCode === 'US' ? 54 : 74;
  const tileGap = 8;
  const paddingX = 24;
  const paddingY = 24;
  const svgWidth =
    paddingX * 2 + dataset.config.gridCols * tileSize + (dataset.config.gridCols - 1) * tileGap;
  const svgHeight =
    paddingY * 2 + dataset.config.gridRows * tileSize + (dataset.config.gridRows - 1) * tileGap;

  // Origin & Destination items for trade corridor arc on the map
  const originItem = useMemo(
    () => (originStateCode ? dataset.items.find((d) => d.code === originStateCode) : null),
    [dataset.items, originStateCode]
  );
  const destItem = useMemo(
    () => (destinationStateCode ? dataset.items.find((d) => d.code === destinationStateCode) : null),
    [dataset.items, destinationStateCode]
  );

  // D3 horizontal scale for the Comparative Tax Burden chart
  const maxRateDomain = useMemo(() => {
    const m = max(dataset.items, (d) => Math.max(d.combinedRate, d.corporateRate)) ?? 25;
    return Math.max(15, m);
  }, [dataset.items]);

  const rateBarScale = useMemo(
    () => scaleLinear().domain([0, maxRateDomain]).range([0, 100]).clamp(true),
    [maxRateDomain]
  );

  const maxSimTaxDomain = useMemo(() => {
    const m = max(comparedItems, (d) => d.simulatedTotalTaxBurden) ?? 25000;
    return Math.max(1000, m);
  }, [comparedItems]);

  const simTaxBarScale = useMemo(
    () => scaleLinear().domain([0, maxSimTaxDomain]).range([0, 100]).clamp(true),
    [maxSimTaxDomain]
  );

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-6 p-5 sm:p-6"
      data-testid="state-tax-nexus-map"
    >
      {/* Top Header & Federation Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              Interactive Fiscal Choropleth
            </span>
            <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap">
              D3.js Multi-Metric Engine
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">
            State-Specific Tax Burden & Economic Nexus Visualization
          </h3>
          <p className="text-xs text-slate-500">
            Compare sub-national consumption taxes, local surcharges, corporate franchise rates, and remote-seller economic nexus thresholds across domestic federations.
          </p>
        </div>

        {/* Federation Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
          {Object.values(DOMESTIC_FEDERATIONS).map((fed) => {
            const isSelected = federationCode === fed.countryCode;
            return (
              <button
                key={fed.countryCode}
                type="button"
                onClick={() => handleFederationChange(fed.countryCode)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {fed.countryCode === 'US'
                  ? '🇺🇸 United States (52)'
                  : fed.countryCode === 'IN'
                  ? '🇮🇳 India GST (15)'
                  : fed.countryCode === 'CA'
                  ? '🇨🇦 Canada (13)'
                  : fed.countryCode === 'AU'
                  ? '🇦🇺 Australia (8)'
                  : '🇧🇷 Brazil ICMS (8)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Bar: Choropleth Metric Selector + Economic Nexus Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        {/* Metric Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Map Choropleth Layer</span>
            </label>
            <span className="text-[11px] text-slate-500">
              {METRIC_OPTIONS.find((m) => m.key === activeMetric)?.description}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {METRIC_OPTIONS.map((m) => {
              const active = activeMetric === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setActiveMetric(m.key)}
                  className={`px-2.5 py-2 rounded-lg text-left text-xs font-medium border transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <span className="block truncate">{m.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Economic Nexus Exposure Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-white p-3.5 rounded-lg border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Economic Nexus Simulator</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {dataset.stats.nexusTriggeredCount} / {dataset.items.length} States Triggered
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="nexus-sim-revenue"
                className="block text-[10px] font-semibold text-slate-500 uppercase"
              >
                Annual Domestic Sales ({dataset.config.currencySymbol})
              </label>
              <input
                id="nexus-sim-revenue"
                type="number"
                min={0}
                step={25000}
                value={simulatedRevenue}
                onChange={(e) => setSimulatedRevenue(Math.max(0, Number(e.target.value)))}
                className="mt-1 w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="nexus-sim-tx"
                className="block text-[10px] font-semibold text-slate-500 uppercase"
              >
                Annual Transactions (#)
              </label>
              <input
                id="nexus-sim-tx"
                type="number"
                min={0}
                step={25}
                value={simulatedTransactions}
                onChange={(e) => setSimulatedTransactions(Math.max(0, Number(e.target.value)))}
                className="mt-1 w-full px-2.5 py-1.5 text-xs font-mono font-bold border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={filterNexusOnly}
                onChange={(e) => setFilterNexusOnly(e.target.checked)}
                className="rounded-xs border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Highlight only states where Nexus is triggered</span>
            </label>
            <div className="flex items-center gap-1">
              {[75000, 150000, 600000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSimulatedRevenue(preset)}
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded border cursor-pointer ${
                    simulatedRevenue === preset
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {dataset.config.currencySymbol}
                  {preset / 1000}k
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Map + Active State Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Interactive SVG Cartogram Map */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl p-4 sm:p-5 text-white border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{dataset.config.countryName}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {dataset.config.nexusFrameworkName}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click any state tile to inspect statutory rules and add/remove from the multi-state comparator.
              </p>
            </div>

            {/* Dynamic Color Scale Legend */}
            <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono text-slate-300">
              {activeMetric === 'nexusThreshold' ? (
                <>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
                    No Tax (NOMAD)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-sky-400 inline-block" />
                    High ($250k–$500k)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500 inline-block" />
                    Standard ($100k / GST)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-rose-600 inline-block" />
                    Strict (100k or 200tx)
                  </span>
                </>
              ) : activeMetric === 'saasRegime' ? (
                <>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
                    SaaS Exempt
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
                    Partially Taxable
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block" />
                    SaaS Fully Taxable
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
                    0% / Exempt
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-blue-200 inline-block" />
                    Low
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-blue-400 inline-block" />
                    Med
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block" />
                    High
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-indigo-900 border border-indigo-400 inline-block" />
                    Peak
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Interactive SVG Map Canvas */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto max-h-[440px] select-none"
              role="img"
              aria-label={`Interactive ${dataset.config.countryName} state tax burden and economic nexus map`}
            >
              <defs>
                <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              {/* Background Grid Dots */}
              {Array.from({ length: dataset.config.gridRows }).map((_, r) =>
                Array.from({ length: dataset.config.gridCols }).map((__, c) => {
                  const cx = paddingX + c * (tileSize + tileGap) + tileSize / 2;
                  const cy = paddingY + r * (tileSize + tileGap) + tileSize / 2;
                  return (
                    <circle
                      key={`dot-${r}-${c}`}
                      cx={cx}
                      cy={cy}
                      r={1.5}
                      fill="#1e293b"
                    />
                  );
                })
              )}

              {/* Render State Tiles */}
              {dataset.items.map((item) => {
                const x = paddingX + item.grid.col * (tileSize + tileGap);
                const y = paddingY + item.grid.row * (tileSize + tileGap);
                const style = getChoroplethTileStyle(item, activeMetric, dataset.items);
                const isFocused = activeFocusedState?.code === item.code;
                const isCompared = comparedCodes.includes(item.code);
                const isOrigin = originStateCode === item.code;
                const isDest = destinationStateCode === item.code;
                const dimmed = filterNexusOnly && !item.nexusTriggered;

                return (
                  <g
                    key={item.code}
                    transform={`translate(${x}, ${y})`}
                    onClick={() => toggleComparedState(item.code)}
                    className="cursor-pointer transition-opacity"
                    style={{ opacity: dimmed ? 0.25 : 1 }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.name} (${item.code}): Combined tax ${item.combinedRate}%, Nexus ${item.nexusCategory}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleComparedState(item.code);
                      }
                    }}
                  >
                    {/* Outer selection glow for compared or active route states */}
                    {(isFocused || isCompared || isOrigin || isDest) && (
                      <rect
                        x={-3}
                        y={-3}
                        width={tileSize + 6}
                        height={tileSize + 6}
                        rx={10}
                        fill="none"
                        stroke={
                          isOrigin
                            ? '#38bdf8'
                            : isDest
                            ? '#f43f5e'
                            : isFocused
                            ? '#facc15'
                            : '#a5b4fc'
                        }
                        strokeWidth={isFocused || isOrigin || isDest ? 2.5 : 1.5}
                      />
                    )}

                    {/* Main Choropleth Tile */}
                    <rect
                      x={0}
                      y={0}
                      width={tileSize}
                      height={tileSize}
                      rx={8}
                      fill={style.fillHex}
                      stroke={item.nexusTriggered ? '#fbbf24' : '#0f172a'}
                      strokeWidth={item.nexusTriggered ? 1.5 : 1}
                    />

                    {/* State Code */}
                    <text
                      x={tileSize / 2}
                      y={tileSize * 0.42}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={style.textClass === 'text-white' ? '#ffffff' : '#0f172a'}
                      fontSize={federationCode === 'US' ? 13 : 15}
                      fontWeight="800"
                      fontFamily="monospace"
                    >
                      {item.code}
                    </text>

                    {/* Metric Value Sub-label */}
                    <text
                      x={tileSize / 2}
                      y={tileSize * 0.74}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={style.textClass === 'text-white' ? '#e2e8f0' : '#334155'}
                      fontSize={federationCode === 'US' ? 9.5 : 11}
                      fontWeight="600"
                      fontFamily="monospace"
                    >
                      {style.badgeText}
                    </text>

                    {/* Nexus Triggered Indicator Dot */}
                    {item.nexusTriggered && (
                      <circle
                        cx={tileSize - 7}
                        cy={7}
                        r={3.5}
                        fill="#f59e0b"
                        stroke="#0f172a"
                        strokeWidth={1}
                      />
                    )}

                    {/* Compared Checkmark Badge */}
                    {isCompared && (
                      <circle
                        cx={8}
                        cy={7}
                        r={3.5}
                        fill="#38bdf8"
                        stroke="#0f172a"
                        strokeWidth={1}
                      />
                    )}
                  </g>
                );
              })}

              {/* Interstate Route Corridor Arc when Origin and Destination are in this Federation */}
              {originItem && destItem && originItem.code !== destItem.code && (
                (() => {
                  const x1 =
                    paddingX + originItem.grid.col * (tileSize + tileGap) + tileSize / 2;
                  const y1 =
                    paddingY + originItem.grid.row * (tileSize + tileGap) + tileSize / 2;
                  const x2 =
                    paddingX + destItem.grid.col * (tileSize + tileGap) + tileSize / 2;
                  const y2 =
                    paddingY + destItem.grid.row * (tileSize + tileGap) + tileSize / 2;
                  const midX = (x1 + x2) / 2;
                  const midY = Math.min(y1, y2) - 42;
                  return (
                    <g pointerEvents="none">
                      <path
                        d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                        fill="none"
                        stroke="url(#corridorGrad)"
                        strokeWidth={3}
                        strokeDasharray="6 4"
                      />
                      <circle cx={x1} cy={y1} r={5} fill="#38bdf8" />
                      <circle cx={x2} cy={y2} r={5} fill="#f43f5e" />
                    </g>
                  );
                })()
              )}
            </svg>
          </div>

          {/* Quick Accessible State Selector Strip & Summary Footer */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex flex-wrap items-center gap-3">
              <span>
                Lowest Burden:{' '}
                <strong className="text-emerald-400 font-mono">
                  {dataset.stats.lowestBurdenState?.name} ({dataset.stats.lowestBurdenState?.combinedRate}%)
                </strong>
              </span>
              <span>·</span>
              <span>
                Highest Burden:{' '}
                <strong className="text-rose-400 font-mono">
                  {dataset.stats.highestBurdenState?.name} ({dataset.stats.highestBurdenState?.combinedRate}%)
                </strong>
              </span>
              <span>·</span>
              <span>
                Federation Avg:{' '}
                <strong className="text-indigo-300 font-mono">
                  {dataset.stats.avgCombinedRate}%
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Amber dot = Economic Nexus Triggered at {dataset.config.currencySymbol}{simulatedRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Focused State Deep-Dive & Route Assignment */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
          {activeFocusedState && (
            <>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-xs font-bold">
                      {activeFocusedState.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {activeFocusedState.subdivision.type} · {activeFocusedState.grid.regionGroup}
                    </span>
                    {activeFocusedState.grid.hubCity && (
                      <span className="text-[11px] text-slate-400">
                        ({activeFocusedState.grid.hubCity})
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 font-display mt-1">
                    {activeFocusedState.name} Fiscal Profile
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => toggleComparedState(activeFocusedState.code)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border cursor-pointer transition-colors ${
                    comparedCodes.includes(activeFocusedState.code)
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {comparedCodes.includes(activeFocusedState.code) ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>In Comparator</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Compare State</span>
                    </>
                  )}
                </button>
              </div>

              {/* 4 Key Metric Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                    State / Combined Tax
                  </span>
                  <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                    {activeFocusedState.salesTaxRate}%{' '}
                    <span className="text-xs font-normal text-slate-500">
                      ({activeFocusedState.combinedRate}% avg)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Local surcharge: +{activeFocusedState.localSurchargeRate}%
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                    Corporate / Franchise CIT
                  </span>
                  <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                    {activeFocusedState.corporateRate}%
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Burden Score: {activeFocusedState.compositeFiscalBurdenScore}/100
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                    Economic Nexus Threshold
                  </span>
                  <div className="text-xs font-bold font-mono text-slate-900 mt-1">
                    {activeFocusedState.nexusRevenueThreshold
                      ? `${dataset.config.currencySymbol}${activeFocusedState.nexusRevenueThreshold.toLocaleString()}`
                      : 'No Sales Tax'}
                    {activeFocusedState.nexusTransactionsThreshold
                      ? ` or ${activeFocusedState.nexusTransactionsThreshold} tx`
                      : ''}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {activeFocusedState.nexusCategory}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                    Digital & SaaS Regime
                  </span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        activeFocusedState.subdivision.saasTaxable === true
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : activeFocusedState.subdivision.saasTaxable === 'Partially Taxable'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      SaaS:{' '}
                      {activeFocusedState.subdivision.saasTaxable === true
                        ? 'Taxable'
                        : activeFocusedState.subdivision.saasTaxable === 'Partially Taxable'
                        ? 'Partial'
                        : 'Exempt'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Digital Goods:{' '}
                    {activeFocusedState.subdivision.digitalGoodsTaxable ? 'Taxable' : 'Exempt'}
                  </span>
                </div>
              </div>

              {/* Simulated Nexus Determination Banner */}
              <div
                className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                  activeFocusedState.nexusTriggered
                    ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>
                      {activeFocusedState.nexusTriggered
                        ? 'Economic Nexus TRIGGERED'
                        : 'Below Economic Nexus Threshold'}
                    </span>
                  </span>
                  <span className="font-mono">
                    Est. Tax: {dataset.config.currencySymbol}
                    {activeFocusedState.simulatedTotalTaxBurden.toLocaleString()}/yr
                  </span>
                </div>
                <p className="text-[11px] opacity-90">{activeFocusedState.nexusTriggerReason}</p>
              </div>

              {/* Statutory Citation & DOR Link */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[210px]">
                      {activeFocusedState.subdivision.stateAuthority || 'State Revenue Authority'}
                    </span>
                  </span>
                  {activeFocusedState.subdivision.evidenceUrl && (
                    <a
                      href={activeFocusedState.subdivision.evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {activeFocusedState.subdivision.statuteCitation && (
                  <p className="text-[11px] font-mono text-slate-500">
                    {activeFocusedState.subdivision.statuteCitation}
                  </p>
                )}
                {activeFocusedState.subdivision.notes && (
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {activeFocusedState.subdivision.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons to Set as Origin or Destination in Tariff Calculator */}
              {onSelectRouteStates && (
                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectRouteStates(
                        federationCode,
                        activeFocusedState.code,
                        destinationStateCode && destinationStateCode !== activeFocusedState.code
                          ? destinationStateCode
                          : dataset.items.find((i) => i.code !== activeFocusedState.code)?.code ||
                              activeFocusedState.code
                      )
                    }
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer text-center"
                  >
                    Set {activeFocusedState.code} as Origin State
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectRouteStates(
                        federationCode,
                        originStateCode && originStateCode !== activeFocusedState.code
                          ? originStateCode
                          : dataset.items.find((i) => i.code !== activeFocusedState.code)?.code ||
                              activeFocusedState.code,
                        activeFocusedState.code
                      )
                    }
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer text-center"
                  >
                    Set {activeFocusedState.code} as Destination
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Section: D3 Multi-State Fiscal Environment Comparator */}
      {!compactMode && (
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Side-by-Side Domestic Fiscal Environment Comparator ({comparedItems.length} Selected)</span>
              </h4>
              <p className="text-xs text-slate-500">
                D3-scaled comparative breakdown of state + local consumption tax, corporate CIT, economic nexus thresholds, and simulated annual liability.
              </p>
            </div>

            {/* Quick Add State Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="add-compare-state" className="text-xs font-medium text-slate-600">
                Inspect / Compare State:
              </label>
              <select
                id="add-compare-state"
                value={activeFocusedState?.code || ''}
                onChange={(e) => toggleComparedState(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {dataset.items.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name} ({item.code}) — {item.combinedRate}% Combined
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparative Cards & D3 Bar Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {comparedItems.map((item) => {
              const stateBarWidth = rateBarScale(item.salesTaxRate);
              const localBarWidth = rateBarScale(item.localSurchargeRate);
              const corpBarWidth = rateBarScale(item.corporateRate);
              const simBarWidth = simTaxBarScale(item.simulatedTotalTaxBurden);

              return (
                <div
                  key={item.code}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    activeFocusedState?.code === item.code
                      ? 'bg-indigo-50/40 border-indigo-300 shadow-xs'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                          {item.code}
                        </span>
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        Composite Burden Index: <strong>{item.compositeFiscalBurdenScore}/100</strong>
                      </span>
                    </div>
                    {comparedItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => toggleComparedState(item.code)}
                        aria-label={`Remove ${item.name} from comparison`}
                        className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* D3 Stacked Bar: Base Sales Tax + Local Surcharge */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600">Combined Sales/GST</span>
                      <span className="font-mono font-bold text-slate-900">
                        {item.combinedRate}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        style={{ width: `${stateBarWidth}%` }}
                        className="bg-indigo-600 h-full"
                        title={`Base State Rate: ${item.salesTaxRate}%`}
                      />
                      <div
                        style={{ width: `${localBarWidth}%` }}
                        className="bg-sky-400 h-full"
                        title={`Avg Local Surcharge: +${item.localSurchargeRate}%`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>State: {item.salesTaxRate}%</span>
                      <span>Local: +{item.localSurchargeRate}%</span>
                    </div>
                  </div>

                  {/* D3 Bar: Corporate / Franchise CIT */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600">Corporate CIT</span>
                      <span className="font-mono font-bold text-slate-900">
                        {item.corporateRate}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${corpBarWidth}%` }}
                        className="bg-purple-600 h-full"
                      />
                    </div>
                  </div>

                  {/* D3 Bar: Simulated Annual Tax Liability */}
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600">Est. Annual Tax</span>
                      <span className="font-mono font-bold text-indigo-700">
                        {dataset.config.currencySymbol}
                        {item.simulatedTotalTaxBurden.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${simBarWidth}%` }}
                        className={`h-full ${
                          item.nexusTriggered ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span
                        className={`font-semibold ${
                          item.nexusTriggered ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {item.nexusTriggered ? '⚡ Nexus Triggered' : '✓ Below Threshold'}
                      </span>
                      <span className="font-mono text-slate-500">
                        {item.nexusRevenueThreshold
                          ? `${dataset.config.currencySymbol}${Math.round(
                              item.nexusRevenueThreshold / 1000
                            )}k`
                          : '0% Tax'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
