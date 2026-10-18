import React from 'react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../utils/i18n.ts';
import { Shield, Globe, FileText, Calculator, FileCheck, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'directory' | 'hscodes' | 'calculator' | 'services' | 'permissions' | 'vault' | 'audit' | 'sources';
  setActiveTab: (tab: 'dashboard' | 'directory' | 'hscodes' | 'calculator' | 'services' | 'permissions' | 'vault' | 'audit' | 'sources') => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onQuickAction: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onQuickAction,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold tracking-tight text-base shadow-sm">
              <Shield className="w-5 h-5 text-indigo-400" />
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left cursor-pointer focus:outline-none"
              aria-label="OmniTax Global Home"
            >
              <span className="text-lg font-bold tracking-tight text-slate-900 font-display block leading-none">
                {getTranslation(language, 'appTitle')}
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                Global Fiscal & Trade Intelligence
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'dashboard'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              {getTranslation(language, 'navDashboard')}
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'directory'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              {getTranslation(language, 'navTaxDirectory')}
            </button>
            <button
              onClick={() => setActiveTab('hscodes')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'hscodes'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              {getTranslation(language, 'navHsCodes')}
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'calculator'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              {getTranslation(language, 'navTariffCalculator')}
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'services'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Tax on Services (SaaS)
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'permissions'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              <span>Permits, Forms & Clearances</span>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                Govt Forms
              </span>
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'vault'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              {getTranslation(language, 'navDocumentVault')}
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'audit'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              {getTranslation(language, 'navComplianceAudit')}
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'sources'
                  ? 'border-indigo-600 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              {getTranslation(language, 'navSources')}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Language Selector */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language dropdown */}
            <div className="relative inline-block text-left">
              <label htmlFor="language-select" className="sr-only">
                Select Language
              </label>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 hover:bg-slate-100 transition-colors">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  className="bg-transparent text-slate-800 font-medium cursor-pointer focus:outline-none pr-1"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={onQuickAction}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm flex items-center gap-2"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'calculateNow')}</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 border-t border-slate-100 gap-4 text-xs font-medium text-slate-600 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
              activeTab === 'dashboard' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
            }`}
          >
            {getTranslation(language, 'navDashboard')}
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
              activeTab === 'directory' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
            }`}
          >
            {getTranslation(language, 'navTaxDirectory')}
          </button>
          <button
            onClick={() => setActiveTab('hscodes')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
              activeTab === 'hscodes' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
            }`}
          >
            {getTranslation(language, 'navHsCodes')}
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
              activeTab === 'calculator' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
            }`}
          >
            {getTranslation(language, 'navTariffCalculator')}
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
              activeTab === 'services' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
            }`}
          >
            Services Tax
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
              activeTab === 'permissions' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
            }`}
          >
            Permits & Forms
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
              activeTab === 'vault' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
            }`}
          >
            {getTranslation(language, 'navDocumentVault')}
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
              activeTab === 'audit' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
            }`}
          >
            {getTranslation(language, 'navComplianceAudit')}
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
              activeTab === 'sources' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
            }`}
          >
            {getTranslation(language, 'navSources')}
          </button>
        </div>
      </div>
    </header>
  );
};
