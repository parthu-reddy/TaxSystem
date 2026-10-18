import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { DashboardOverview } from './components/DashboardOverview.tsx';
import { GlobalTaxDirectory } from './components/GlobalTaxDirectory.tsx';
import { TariffCalculator } from './components/TariffCalculator.tsx';
import { DocumentVault } from './components/DocumentVault.tsx';
import { ComplianceAudit } from './components/ComplianceAudit.tsx';
import { AiImpactModal } from './components/AiImpactModal.tsx';
import { HsCodeExplorer } from './components/HsCodeExplorer.tsx';
import { ServicesTaxEngine } from './components/ServicesTaxEngine.tsx';
import { PermissionsComplianceHub } from './components/PermissionsComplianceHub.tsx';
import { FiscalPolicyUpdate } from './types/tax.ts';
import { SupportedLanguage } from './utils/i18n.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'directory' | 'hscodes' | 'calculator' | 'services' | 'permissions' | 'vault' | 'audit' | 'sources'
  >('dashboard');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [selectedUpdateForAi, setSelectedUpdateForAi] = useState<FiscalPolicyUpdate | null>(null);
  const [chosenHsItem, setChosenHsItem] = useState<{ code: string; description?: string; duty?: number }>({
    code: '8471.30',
    description: 'Portable automatic data processing machines (Laptops, Tablets)',
    duty: 0.0,
  });

  const handleSelectHsCode = (code: string, description?: string, duty?: number) => {
    setChosenHsItem({ code, description, duty });
    setActiveTab('calculator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header complying with Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onQuickAction={() => setActiveTab('calculator')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            onSelectUpdate={(update) => setSelectedUpdateForAi(update)}
            onNavigateToCalculator={() => setActiveTab('calculator')}
            onNavigateToVault={() => setActiveTab('vault')}
            language={language}
          />
        )}

        {activeTab === 'directory' && <GlobalTaxDirectory />}

        {activeTab === 'hscodes' && (
          <HsCodeExplorer
            onSelectHsCodeForCalculation={handleSelectHsCode}
            language={language}
          />
        )}

        {activeTab === 'calculator' && (
          <TariffCalculator
            initialHsCode={chosenHsItem.code}
            initialDescription={chosenHsItem.description}
            initialDuty={chosenHsItem.duty}
            onOpenHsExplorer={() => setActiveTab('hscodes')}
            onNavigateToServices={() => setActiveTab('services')}
            onNavigateToPermissions={() => setActiveTab('permissions')}
          />
        )}

        {activeTab === 'services' && (
          <ServicesTaxEngine onNavigateToPermissions={() => setActiveTab('permissions')} />
        )}

        {activeTab === 'permissions' && <PermissionsComplianceHub />}

        {activeTab === 'vault' && <DocumentVault />}

        {activeTab === 'audit' && <ComplianceAudit />}

        {activeTab === 'sources' && <ComplianceAudit />}
      </main>

      {/* AI Multinational Impact Modal */}
      {selectedUpdateForAi && (
        <AiImpactModal
          update={selectedUpdateForAi}
          onClose={() => setSelectedUpdateForAi(null)}
          language={language}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 font-display">OmniTax Global</span>
            <span aria-hidden="true">·</span>
            <span>Worldwide Sovereign Fiscal Intelligence & Tariff Calculation System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>195+ National Revenue Authorities Monitored</span>
            <span aria-hidden="true">·</span>
            <span>WCO Harmonized System 2026</span>
            <span aria-hidden="true">·</span>
            <span>OECD Pillar Two Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
