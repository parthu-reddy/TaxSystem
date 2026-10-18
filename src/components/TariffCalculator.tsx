import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  calculateTariffsAndTaxes,
  resolveExchangeRate,
  COUNTRY_DEFAULT_CURRENCY,
  HS_CODE_TARIFF_RATES,
  FREE_TRADE_AGREEMENTS,
  SUBDIVISION_TAX_RATES,
} from '../utils/tariffCalculator.ts';
import { GLOBAL_TAX_DATABASE } from '../data/taxDatabase.ts';
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  FileText,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
  ExternalLink,
  CheckCircle2,
  BookOpen,
  RefreshCw,
  ArrowRightLeft,
  Globe,
  MapPin,
} from 'lucide-react';

import { ALL_WORLD_CURRENCIES, CURRENCY_MAP } from '../data/currenciesDatabase.ts';
import { StateTaxNexusMap } from './StateTaxNexusMap.tsx';
import { RiskMonitor } from './RiskMonitor.tsx';

interface TariffCalculatorProps {
  initialHsCode?: string;
  initialDescription?: string;
  initialDuty?: number;
  onOpenHsExplorer?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToPermissions?: () => void;
}

export const TariffCalculator: React.FC<TariffCalculatorProps> = ({
  initialHsCode,
  initialDescription,
  initialDuty,
  onOpenHsExplorer,
  onNavigateToServices,
  onNavigateToPermissions,
}) => {
  // Input states
  const [tradeMode, setTradeMode] = useState<'international' | 'interstate'>('international');
  const [originCountry, setOriginCountry] = useState<string>('US');
  const [originState, setOriginState] = useState<string>('CA');
  const [destinationCountry, setDestinationCountry] = useState<string>('DE');
  const [destinationState, setDestinationState] = useState<string>('');
  const [selectedHsCode, setSelectedHsCode] = useState<string>(initialHsCode || '8471.30');
  const [customHsInput, setCustomHsInput] = useState<string>('');
  const [useCustomHs, setUseCustomHs] = useState<boolean>(false);
  const [customsValue, setCustomsValue] = useState<number>(25000);
  const [shippingInsurance, setShippingInsurance] = useState<number>(1200);
  const [currency, setCurrency] = useState<string>('USD');
  const [reportingCurrency, setReportingCurrency] = useState<string>('EUR');
  const [autoSyncDestCurrency, setAutoSyncDestCurrency] = useState<boolean>(true);
  const [customExchangeRateInput, setCustomExchangeRateInput] = useState<string>('');
  const [liveRates, setLiveRates] = useState<Record<string, number> | null>(null);
  const [liveFxUpdatedUtc, setLiveFxUpdatedUtc] = useState<string | null>(null);
  const [isFetchingFx, setIsFetchingFx] = useState<boolean>(false);
  const [fxFetchError, setFxFetchError] = useState<string | null>(null);
  const [selectedTradeAgreement, setSelectedTradeAgreement] = useState<string>('');
  const [showLaymanOnly, setShowLaymanOnly] = useState<boolean>(false);
  const [showDomesticMap, setShowDomesticMap] = useState<boolean>(false);

  // Fetch real-time exchange rates from free ExchangeRate-API (open.er-api.com) with Frankfurter fallback
  const fetchLiveExchangeRates = useCallback(async (baseCode: string) => {
    setIsFetchingFx(true);
    setFxFetchError(null);
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(baseCode)}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data && data.rates && typeof data.rates === 'object') {
        setLiveRates({ ...data.rates, [baseCode]: 1.0 });
        setLiveFxUpdatedUtc(
          data.time_last_update_utc
            ? new Date(data.time_last_update_utc).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Live Spot'
        );
        setIsFetchingFx(false);
        return;
      }
      throw new Error('Invalid exchange rate payload');
    } catch {
      try {
        const fallbackResp = await fetch(`https://api.frankfurter.app/latest?from=${encodeURIComponent(baseCode)}`);
        if (fallbackResp.ok) {
          const fallbackData = await fallbackResp.json();
          if (fallbackData && fallbackData.rates) {
            setLiveRates({ ...fallbackData.rates, [baseCode]: 1.0 });
            setLiveFxUpdatedUtc(fallbackData.date || 'ECB Spot');
            setIsFetchingFx(false);
            return;
          }
        }
      } catch {
        // Ignore secondary failure and use deterministic benchmark fallback
      }
      setFxFetchError('Using verified WTO/ISO benchmark rates (offline mode)');
      setIsFetchingFx(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveExchangeRates(currency);
  }, [currency, fetchLiveExchangeRates]);

  // Dynamic tariff rates map that includes any dynamically passed code from AI classifier or WCO explorer
  const [dynamicTariffRates, setDynamicTariffRates] = useState<
    Record<string, { desc: string; defaultDuty: number; antiDumping?: number }>
  >(() => {
    const base = { ...HS_CODE_TARIFF_RATES };
    if (initialHsCode) {
      base[initialHsCode] = {
        desc: initialDescription || base[initialHsCode]?.desc || 'Classified Commodity',
        defaultDuty: initialDuty !== undefined ? initialDuty : (base[initialHsCode]?.defaultDuty ?? 0.0),
      };
    }
    return base;
  });

  // Synchronize when initialHsCode changes
  useEffect(() => {
    if (initialHsCode) {
      setSelectedHsCode(initialHsCode);
      setUseCustomHs(false);
      setDynamicTariffRates((prev) => ({
        ...prev,
        [initialHsCode]: {
          desc: initialDescription || prev[initialHsCode]?.desc || 'Classified Commodity',
          defaultDuty: initialDuty !== undefined ? initialDuty : (prev[initialHsCode]?.defaultDuty ?? 0.0),
        },
      }));
    }
  }, [initialHsCode, initialDescription, initialDuty]);

  const getDefaultInterstateSubdivisions = useCallback((countryCode: string) => {
    const countryObj = GLOBAL_TAX_DATABASE.find((c) => c.code === countryCode);
    const subs = countryObj?.subdivisions || [];
    if (countryCode === 'US') return { origin: 'CA', dest: 'TX' };
    if (countryCode === 'IN') return { origin: 'MH', dest: 'KA' };
    if (countryCode === 'CA') return { origin: 'ON', dest: 'BC' };
    if (countryCode === 'AU') return { origin: 'NSW', dest: 'VIC' };
    if (countryCode === 'BR') return { origin: 'SP', dest: 'RJ' };
    if (subs.length >= 2) return { origin: subs[0].code, dest: subs[1].code };
    if (subs.length === 1) return { origin: subs[0].code, dest: subs[0].code };
    return { origin: '', dest: '' };
  }, []);

  // Switch between interstate and international mode
  const handleModeChange = (mode: 'international' | 'interstate') => {
    setTradeMode(mode);
    if (mode === 'interstate') {
      setShowDomesticMap(true);
      const targetCountry = originCountry || 'US';
      const defaults = getDefaultInterstateSubdivisions(targetCountry);
      setOriginCountry(targetCountry);
      setDestinationCountry(targetCountry);
      setOriginState(defaults.origin);
      setDestinationState(defaults.dest);
      setSelectedTradeAgreement('');
      if (autoSyncDestCurrency) {
        const nextCurr = COUNTRY_DEFAULT_CURRENCY[targetCountry] || 'USD';
        setReportingCurrency(nextCurr);
      }
    } else {
      const nextDest = originCountry === 'DE' ? 'US' : 'DE';
      setOriginState('');
      setDestinationCountry(nextDest);
      setDestinationState('');
      if (autoSyncDestCurrency) {
        setReportingCurrency(COUNTRY_DEFAULT_CURRENCY[nextDest] || 'EUR');
      }
    }
  };

  // Get available subdivisions for origin and destination
  const originCountryData = useMemo(
    () => GLOBAL_TAX_DATABASE.find((c) => c.code === originCountry),
    [originCountry]
  );
  const destCountryData = useMemo(
    () => GLOBAL_TAX_DATABASE.find((c) => c.code === destinationCountry),
    [destinationCountry]
  );

  const destDefaultCurrency = COUNTRY_DEFAULT_CURRENCY[destinationCountry] || destCountryData?.currencyCode || 'USD';

  // Resolve active exchange rate (custom override -> live API -> benchmark fallback)
  const parsedCustomRate = useMemo(() => {
    const val = parseFloat(customExchangeRateInput);
    return Number.isFinite(val) && val > 0 ? val : null;
  }, [customExchangeRateInput]);

  const resolvedFx = useMemo(
    () => resolveExchangeRate(currency, reportingCurrency, liveRates, parsedCustomRate),
    [currency, reportingCurrency, liveRates, parsedCustomRate]
  );

  const isDualCurrency = reportingCurrency !== currency;

  const formatAmt = useCallback((amount: number, code: string) => {
    const c = CURRENCY_MAP.get(code);
    const digits = c ? c.decimalDigits : 2;
    return `${code} ${amount.toLocaleString('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })}`;
  }, []);

  const calculationInput = useMemo(() => {
    const selectedItem = dynamicTariffRates[selectedHsCode];
    return {
      originCountry,
      originSubdivision: originState || undefined,
      destinationCountry,
      destinationSubdivision: destinationState || undefined,
      hsCode: selectedHsCode,
      productDescription: selectedItem?.desc || initialDescription || 'General Merchandise',
      customsValue,
      currency,
      shippingInsuranceCost: shippingInsurance,
      tradeAgreementApplied: selectedTradeAgreement || undefined,
      customTariffRate: selectedItem?.defaultDuty,
      reportingCurrency,
      exchangeRate: resolvedFx.rate,
    };
  }, [
    originCountry,
    originState,
    destinationCountry,
    destinationState,
    selectedHsCode,
    dynamicTariffRates,
    initialDescription,
    customsValue,
    shippingInsurance,
    currency,
    selectedTradeAgreement,
    reportingCurrency,
    resolvedFx.rate,
  ]);

  // Compute calculation
  const result = useMemo(
    () => calculateTariffsAndTaxes(calculationInput),
    [calculationInput]
  );

  return (
    <div className="space-y-6">
      {/* Header and Mode Segmented Control */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Cross-Border & Interstate Tariff & Liability Engine
          </h2>
          <p className="text-xs text-slate-500">
            Calculates customs duties, preferential trade agreement discounts, import VAT/GST, and destination state taxes
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Interstate vs International Tab Buttons */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => handleModeChange('international')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                tradeMode === 'international'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cross-Border (Global)
            </button>
            <button
              onClick={() => handleModeChange('interstate')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                tradeMode === 'interstate'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interstate / Domestic
            </button>
          </div>

          {/* Interactive State Tax & Nexus Map Toggle */}
          <button
            type="button"
            onClick={() => setShowDomesticMap((prev) => !prev)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showDomesticMap
                ? 'bg-indigo-600 border-indigo-600 text-white font-semibold shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{showDomesticMap ? 'Hide State Nexus Map' : 'State Tax & Nexus Map'}</span>
          </button>

          {/* Layman Switch */}
          <button
            onClick={() => setShowLaymanOnly(!showLaymanOnly)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              showLaymanOnly
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-indigo-600" />
            <span>Layman Mode {showLaymanOnly ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Domestic Fiscal & Nexus Map */}
      {showDomesticMap && (
        <StateTaxNexusMap
          selectedCountryCode={originCountry}
          onSelectCountryCode={(nextCountry) => {
            setOriginCountry(nextCountry);
            if (tradeMode === 'interstate') {
              setDestinationCountry(nextCountry);
              const defaults = getDefaultInterstateSubdivisions(nextCountry);
              setOriginState(defaults.origin);
              setDestinationState(defaults.dest);
              if (autoSyncDestCurrency) {
                const nextCurr = COUNTRY_DEFAULT_CURRENCY[nextCountry];
                if (nextCurr) {
                  setReportingCurrency(nextCurr);
                  setCustomExchangeRateInput('');
                }
              }
            }
          }}
          originStateCode={originState}
          destinationStateCode={destinationState}
          onSelectRouteStates={(countryCode, origState, destState) => {
            setTradeMode('interstate');
            setOriginCountry(countryCode);
            setDestinationCountry(countryCode);
            setOriginState(origState);
            setDestinationState(destState);
            setSelectedTradeAgreement('');
            if (autoSyncDestCurrency) {
              const nextCurr = COUNTRY_DEFAULT_CURRENCY[countryCode];
              if (nextCurr) {
                setReportingCurrency(nextCurr);
                setCustomExchangeRateInput('');
              }
            }
          }}
        />
      )}

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Shipment Parameters & Trade Route
          </h3>

          {/* Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {tradeMode === 'interstate' ? 'Domestic Country / Jurisdiction' : 'Origin Country'}
              </label>
              <select
                aria-label="Origin Country"
                value={originCountry}
                onChange={(e) => {
                  const nextCountry = e.target.value;
                  setOriginCountry(nextCountry);
                  if (tradeMode === 'interstate') {
                    setDestinationCountry(nextCountry);
                    const defaults = getDefaultInterstateSubdivisions(nextCountry);
                    setOriginState(defaults.origin);
                    setDestinationState(defaults.dest);
                    if (autoSyncDestCurrency) {
                      const nextCurr = COUNTRY_DEFAULT_CURRENCY[nextCountry];
                      if (nextCurr) {
                        setReportingCurrency(nextCurr);
                        setCustomExchangeRateInput('');
                      }
                    }
                  } else {
                    setOriginState('');
                  }
                }}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {GLOBAL_TAX_DATABASE.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Origin State if available */}
            {originCountryData?.subdivisions && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Origin State / Prov.
                </label>
                <select
                  aria-label="Origin State / Prov."
                  value={originState}
                  onChange={(e) => setOriginState(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">None / Federal only</option>
                  {originCountryData.subdivisions.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {tradeMode === 'interstate' ? 'Destination Country (Same)' : 'Destination Country'}
              </label>
              <select
                aria-label="Destination Country"
                value={destinationCountry}
                disabled={tradeMode === 'interstate'}
                onChange={(e) => {
                  const nextDest = e.target.value;
                  setDestinationCountry(nextDest);
                  setDestinationState('');
                  if (autoSyncDestCurrency) {
                    const nextCurr = COUNTRY_DEFAULT_CURRENCY[nextDest];
                    if (nextCurr) {
                      setReportingCurrency(nextCurr);
                      setCustomExchangeRateInput('');
                    }
                  }
                }}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
              >
                {GLOBAL_TAX_DATABASE.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination State */}
            {destCountryData?.subdivisions && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Destination State / Prov.
                </label>
                <select
                  aria-label="Destination State / Prov."
                  value={destinationState}
                  onChange={(e) => setDestinationState(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">
                    {tradeMode === 'interstate' ? 'National / Federal Rate' : 'None / Direct Import'}
                  </option>
                  {destCountryData.subdivisions.map((s) => {
                    const effectiveRate =
                      SUBDIVISION_TAX_RATES[destinationCountry]?.[s.code]?.rate ??
                      s.avgCombinedSalesTaxRate ??
                      s.salesTaxRate;
                    return (
                      <option key={s.code} value={s.code}>
                        {s.name} ({s.code}) — {effectiveRate}%
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>

          {/* Product Commodity / HS Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-700">
                Harmonized Commodity Code (HS Tariff)
              </label>
              {onOpenHsExplorer && (
                <button
                  type="button"
                  onClick={onOpenHsExplorer}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Browse All 97 WCO Chapters / AI Lookup &rarr;</span>
                </button>
              )}
            </div>

            {/* Applied from AI / WCO Banner */}
            {initialHsCode && selectedHsCode === initialHsCode && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900 animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong className="font-semibold">Applied from WCO Classifier:</strong> HS {selectedHsCode} — {dynamicTariffRates[selectedHsCode]?.desc || 'Commodity'}
                  </span>
                </div>
                <span className="font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 shrink-0">
                  {tradeMode === 'interstate'
                    ? '0% Domestic Duty'
                    : `${dynamicTariffRates[selectedHsCode]?.defaultDuty ?? 0}% MFN Duty`}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 min-w-0 w-full">
              <select
                value={selectedHsCode}
                onChange={(e) => {
                  setSelectedHsCode(e.target.value);
                  setUseCustomHs(false);
                }}
                className="flex-1 min-w-0 w-full truncate text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              >
                {Object.entries(dynamicTariffRates).map(([code, item]) => (
                  <option key={code} value={code}>
                    {code} - {item.desc} ({tradeMode === 'interstate' ? '0% Domestic Duty' : `${item.defaultDuty}% Duty`})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setUseCustomHs(!useCustomHs)}
                className="px-2.5 py-2 text-xs border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-slate-700 shrink-0 font-medium"
              >
                {useCustomHs ? 'Presets' : 'Type Code'}
              </button>
            </div>

            {useCustomHs && (
              <div className="pt-1">
                <input
                  type="text"
                  value={customHsInput}
                  onChange={(e) => {
                    setCustomHsInput(e.target.value);
                    if (e.target.value.trim().length >= 4) {
                      const trimmed = e.target.value.trim();
                      setSelectedHsCode(trimmed);
                      setDynamicTariffRates((prev) => ({
                        ...prev,
                        [trimmed]: prev[trimmed] || { desc: 'Custom User HS Code', defaultDuty: 5.0 },
                      }));
                    }
                  }}
                  placeholder="Enter any 4 or 6-digit HS code (e.g., 5201.00, 8507.60, 2709.00)..."
                  className="w-full text-xs font-mono border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Values & Freight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Declared Customs Value
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                  {currency}
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={customsValue}
                  onChange={(e) => setCustomsValue(parseFloat(e.target.value) || 0)}
                  className="w-full pl-12 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Freight & Insurance (CIF)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                  {currency}
                </span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={shippingInsurance}
                  onChange={(e) => setShippingInsurance(parseFloat(e.target.value) || 0)}
                  className="w-full pl-12 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Real-Time Currency Conversion & Reporting Currency Panel */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide truncate">
                  Real-Time FX Conversion
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${
                    resolvedFx.source === 'custom'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : resolvedFx.source === 'live_api'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {resolvedFx.source === 'custom'
                    ? 'Custom Lock-In FX'
                    : resolvedFx.source === 'live_api'
                    ? `Live FX (${liveFxUpdatedUtc || 'Spot'})`
                    : 'WTO Benchmark FX'}
                </span>
                <button
                  type="button"
                  onClick={() => fetchLiveExchangeRates(currency)}
                  disabled={isFetchingFx}
                  aria-label="Refresh Live Exchange Rates"
                  title="Refresh live exchange rates from ExchangeRate-API"
                  className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingFx ? 'animate-spin text-indigo-600' : ''}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-end">
              <div className="sm:col-span-5">
                <label htmlFor="invoice-currency-select" className="block text-[11px] font-medium text-slate-700 mb-1">
                  Invoice Currency (Declared)
                </label>
                <select
                  id="invoice-currency-select"
                  aria-label="Invoice Currency (Declared)"
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    setCustomExchangeRateInput('');
                  }}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                >
                  {ALL_WORLD_CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol}) - {curr.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-1 flex justify-center pb-0.5">
                <button
                  type="button"
                  onClick={() => {
                    const prevInvoice = currency;
                    setCurrency(reportingCurrency);
                    setReportingCurrency(prevInvoice);
                    setAutoSyncDestCurrency(false);
                    setCustomExchangeRateInput('');
                  }}
                  aria-label="Swap Invoice and Reporting Currencies"
                  title="Swap Invoice and Reporting Currencies"
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="sm:col-span-5">
                <label htmlFor="reporting-currency-select" className="block text-[11px] font-medium text-slate-700 mb-1">
                  Reporting / Duty Currency
                </label>
                <select
                  id="reporting-currency-select"
                  aria-label="Reporting / Duty Currency"
                  value={reportingCurrency}
                  onChange={(e) => {
                    setReportingCurrency(e.target.value);
                    setAutoSyncDestCurrency(false);
                    setCustomExchangeRateInput('');
                  }}
                  className="w-full text-xs border border-indigo-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-semibold text-indigo-950"
                >
                  {ALL_WORLD_CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol}) - {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Exchange Rate Readout & Custom Rate Override */}
            <div className="pt-1 border-t border-slate-200/80 flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="font-mono text-slate-700">
                  <span className="font-semibold text-slate-900">1 {currency}</span> ={' '}
                  <span className="font-bold text-indigo-700">
                    {resolvedFx.rate.toFixed(4)} {reportingCurrency}
                  </span>
                  {isDualCurrency && resolvedFx.rate > 0 && (
                    <span className="text-slate-400 ml-1.5">
                      (1 {reportingCurrency} = {(1 / resolvedFx.rate).toFixed(4)} {currency})
                    </span>
                  )}
                </div>

                {reportingCurrency !== destDefaultCurrency && (
                  <button
                    type="button"
                    onClick={() => {
                      setReportingCurrency(destDefaultCurrency);
                      setAutoSyncDestCurrency(true);
                      setCustomExchangeRateInput('');
                    }}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                  >
                    Match {destinationCountry} Currency ({destDefaultCurrency})
                  </button>
                )}
              </div>

              {isDualCurrency && (
                <div className="flex items-center gap-2">
                  <label htmlFor="custom-fx-rate-input" className="text-[11px] text-slate-600 shrink-0">
                    Customs FX Override:
                  </label>
                  <input
                    id="custom-fx-rate-input"
                    aria-label="Customs FX Override Rate"
                    type="number"
                    min="0"
                    step="0.0001"
                    value={customExchangeRateInput}
                    onChange={(e) => setCustomExchangeRateInput(e.target.value)}
                    placeholder={`Live: ${resolvedFx.rate.toFixed(4)}`}
                    className="flex-1 px-2.5 py-1 text-xs font-mono border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {customExchangeRateInput && (
                    <button
                      type="button"
                      onClick={() => setCustomExchangeRateInput('')}
                      className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md"
                    >
                      Use Live API
                    </button>
                  )}
                </div>
              )}

              {fxFetchError && (
                <div className="text-[10px] text-amber-700 font-medium">
                  {fxFetchError}
                </div>
              )}
            </div>
          </div>

          {/* Trade Agreement or Domestic Status */}
          {tradeMode === 'interstate' ? (
            <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">
                  Domestic / Interstate Movement ({originCountryData?.name || originCountry})
                </span>
                <span className="text-[11px] text-emerald-800">
                  0% Border Customs Duty &bull; Governed by internal {result.domesticTaxLabel || 'Domestic Tax'}
                  {originState && destinationState ? ` (${originState} → ${destinationState})` : ''}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Trade Agreement / Preferential Pact
              </label>
              <select
                value={selectedTradeAgreement}
                onChange={(e) => setSelectedTradeAgreement(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Auto-Detect Eligible FTA</option>
                {FREE_TRADE_AGREEMENTS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right Outputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Layman Box Banner */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 space-y-2">
            <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Layman Trade & Tax Summary (Plain English)</span>
            </div>
            <p className="text-xs text-indigo-950 leading-relaxed font-normal">
              {result.laymanSummary}
            </p>
          </div>

          {/* Cross-Border & Domestic Compliance Risk Monitor with Actionable Warning Badges */}
          <RiskMonitor
            calculationInput={calculationInput}
            calculationResult={result}
            onApplyFta={(ftaId) => setSelectedTradeAgreement(ftaId)}
            onSetBenchmarkFreight={(freightAmount) => setShippingInsurance(freightAmount)}
            onOpenPermissions={onNavigateToPermissions}
            onTriggerScenario={(scenario) => {
              setTradeMode('international');
              setOriginCountry(scenario.originCountry);
              setOriginState('');
              setDestinationCountry(scenario.destinationCountry);
              setDestinationState('');
              setSelectedHsCode(scenario.hsCode);
              setUseCustomHs(false);
              setShippingInsurance(scenario.shippingInsurance);
              setSelectedTradeAgreement(scenario.tradeAgreement);
              if (autoSyncDestCurrency) {
                const nextCurr = COUNTRY_DEFAULT_CURRENCY[scenario.destinationCountry];
                if (nextCurr) {
                  setReportingCurrency(nextCurr);
                  setCustomExchangeRateInput('');
                }
              }
            }}
          />

          {/* Calculation Ledger (Only if not hidden) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Itemized Tariff & Tax Liability Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  WTO Valuation Agreement & Destination Jurisdiction Ledger
                  {isDualCurrency && (
                    <span className="ml-1.5 font-mono text-indigo-700 font-semibold">
                      • Reporting in {reportingCurrency} (1 {currency} = {resolvedFx.rate.toFixed(4)} {reportingCurrency})
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isDualCurrency && (
                  <span className="font-mono text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-sm">
                    {currency} &rarr; {reportingCurrency}
                  </span>
                )}
                <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                  HS {selectedHsCode}
                </span>
              </div>
            </div>

            {/* Line-by-line itemization with tabular numbers */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Base Customs Goods Value:</span>
                <div className="text-right font-mono">
                  <div className="text-slate-900 font-semibold">
                    {formatAmt(result.reportingAmounts.customsValue, reportingCurrency)}
                  </div>
                  {isDualCurrency && (
                    <div className="text-[11px] text-slate-400">
                      Invoice: {formatAmt(result.customsValue, currency)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">Freight & Insurance (CIF Cost Basis):</span>
                <div className="text-right font-mono">
                  <div className="text-slate-900 font-semibold">
                    {formatAmt(result.reportingAmounts.cifValue, reportingCurrency)}
                  </div>
                  {isDualCurrency && (
                    <div className="text-[11px] text-slate-400">
                      Invoice: {formatAmt(result.cifValue, currency)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <div className="space-y-0.5">
                  <div className="text-slate-900 font-medium">
                    Customs Duty ({result.effectiveTariffRate.toFixed(1)}%):
                  </div>
                  {result.tradeAgreementApplied && (
                    <div className="text-[11px] text-emerald-600">
                      Reduced via {result.tradeAgreementApplied} (Saved{' '}
                      {formatAmt(result.reportingAmounts.tradeAgreementSavings, reportingCurrency)})
                    </div>
                  )}
                </div>
                <div className="text-right font-mono">
                  <div className="font-semibold text-slate-900">
                    {formatAmt(result.reportingAmounts.customsDuty, reportingCurrency)}
                  </div>
                  {isDualCurrency && (
                    <div className="text-[11px] text-slate-400">
                      Invoice: {formatAmt(result.customsDuty, currency)}
                    </div>
                  )}
                </div>
              </div>

              {result.antiDumpingDuty > 0 && (
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-rose-700">Trade Remedy Anti-Dumping Duty:</span>
                  <div className="text-right font-mono">
                    <div className="font-semibold text-rose-700">
                      +{formatAmt(result.reportingAmounts.antiDumpingDuty, reportingCurrency)}
                    </div>
                    {isDualCurrency && (
                      <div className="text-[11px] text-rose-400">
                        Invoice: +{formatAmt(result.antiDumpingDuty, currency)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.customsProcessingFee > 0 && (
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Customs Port & Entry Processing Fee:</span>
                  <div className="text-right font-mono">
                    <div className="text-slate-900 font-medium">
                      {formatAmt(result.reportingAmounts.customsProcessingFee, reportingCurrency)}
                    </div>
                    {isDualCurrency && (
                      <div className="text-[11px] text-slate-400">
                        Invoice: {formatAmt(result.customsProcessingFee, currency)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.importVatGstAmount > 0 && (
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <div className="space-y-0.5">
                    <span className="text-slate-900 font-medium">
                      Import VAT / GST ({result.importVatGstRate}%):
                    </span>
                    <div className="text-[11px] text-slate-500">
                      Assessed on CIF + Customs Duty
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-semibold text-slate-900">
                      {formatAmt(result.reportingAmounts.importVatGstAmount, reportingCurrency)}
                    </div>
                    {isDualCurrency && (
                      <div className="text-[11px] text-slate-400">
                        Invoice: {formatAmt(result.importVatGstAmount, currency)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.subdivisionSalesTaxAmount > 0 && (
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <div className="space-y-0.5">
                    <span className="text-slate-900 font-medium">
                      {result.domesticTaxLabel || 'Destination State/Province Sales Tax'} ({result.subdivisionSalesTaxRate}%):
                    </span>
                    <div className="text-[11px] text-slate-500">
                      {destinationState
                        ? `Applied in ${originState && result.isInterstateOnly ? `${originState} → ` : ''}${destinationState}`
                        : `National Domestic Rate (${destinationCountry})`}
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-semibold text-slate-900">
                      {formatAmt(result.reportingAmounts.subdivisionSalesTaxAmount, reportingCurrency)}
                    </div>
                    {isDualCurrency && (
                      <div className="text-[11px] text-slate-400">
                        Invoice: {formatAmt(result.subdivisionSalesTaxAmount, currency)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Total Highlight */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400 font-medium">
                  {result.isInterstateOnly
                    ? `Total Interstate / Domestic Taxes (${reportingCurrency})`
                    : `Total Border Duties & Taxes (${reportingCurrency})`}
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {formatAmt(result.reportingAmounts.totalTaxesAndTariffs, reportingCurrency)}
                </div>
                {isDualCurrency && (
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Invoice Basis: {formatAmt(result.totalTaxesAndTariffs, currency)}
                  </div>
                )}
              </div>
              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                <div className="text-xs text-slate-400 font-medium">
                  Total Landed Cost ({result.isInterstateOnly ? 'Goods + Freight + Domestic Tax' : `CIF + Taxes in ${reportingCurrency}`})
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  {formatAmt(result.reportingAmounts.totalLandedCost, reportingCurrency)}
                </div>
                {isDualCurrency && (
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Invoice Basis: {formatAmt(result.totalLandedCost, currency)}
                  </div>
                )}
              </div>
            </div>

            {/* Required Documentation */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Required Trade & Clearance Documents
                </h4>
                {onNavigateToPermissions && (
                  <button
                    type="button"
                    onClick={onNavigateToPermissions}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                  >
                    <span>View Govt Forms & Bank/Auditor Rules &rarr;</span>
                  </button>
                )}
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.requiredDocuments.map((doc, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verified Statutory Sources & Official Government Evidence */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Statutory Evidence & Official Government Sources</span>
                </h4>
                <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  Official Verification Data
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-700">Destination Legal Statute: </span>
                  <span className="font-mono text-[11px] text-slate-800">
                    {destCountryData?.statuteReference || 'Harmonized Tariff Schedule & Customs Act'}
                  </span>
                </div>

                {destCountryData?.officialEvidenceNote && (
                  <div className="p-2.5 rounded bg-white border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-900 block mb-0.5">Official Evidence Note:</span>
                    {destCountryData.officialEvidenceNote}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {destCountryData?.authorityWebsite && (
                    <a
                      href={destCountryData.authorityWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md font-semibold text-xs transition-colors"
                    >
                      <span>Destination Ministry / Customs Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {destCountryData?.legalGazetteUrl && (
                    <a
                      href={destCountryData.legalGazetteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-md font-semibold text-xs transition-colors"
                    >
                      <span>National Gazette Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {originCountryData?.authorityWebsite && originCountry !== destinationCountry && (
                    <a
                      href={originCountryData.authorityWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-xs transition-colors"
                    >
                      <span>Origin Authority ({originCountryData.code})</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Quick Jump to Services Tax if applicable */}
              {onNavigateToServices && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Need to calculate tax on SaaS, IT, or remote consulting?</span>
                  <button
                    type="button"
                    onClick={onNavigateToServices}
                    className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                  >
                    <span>Open Services & SaaS Tax Engine &rarr;</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
