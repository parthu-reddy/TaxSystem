import React, { useState } from 'react';
import { VaultDocument } from '../types/tax.ts';
import { classifyTradeDocument } from '../utils/documentClassifier.ts';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Shield,
  Download,
  FolderLock,
  Plus,
  Trash2,
  FileCheck,
  Tag,
} from 'lucide-react';

const INITIAL_VAULT_DOCUMENTS: VaultDocument[] = [
  {
    id: 'DOC-2026-001',
    title: 'Commercial Invoice INV-2026-8819',
    fileName: 'commercial_invoice_apex_tech_8819.pdf',
    category: 'Commercial Invoice',
    uploadDate: '2026-10-14',
    fileSize: '412 KB',
    hsCodes: ['8471.30', '8517.13'],
    declaredValue: 48500,
    currency: 'USD',
    originCountry: 'US',
    destinationCountry: 'DE',
    complianceStatus: 'Verified',
    tags: ['Electronics', 'EU Import', 'CIF Rotterdam'],
  },
  {
    id: 'DOC-2026-002',
    title: 'Ocean Bill of Lading BOL-MSK-9021',
    fileName: 'ocean_bol_maersk_tokyo_9021.pdf',
    category: 'Bill of Lading',
    uploadDate: '2026-10-13',
    fileSize: '820 KB',
    hsCodes: ['8703.80'],
    declaredValue: 125000,
    currency: 'USD',
    originCountry: 'JP',
    destinationCountry: 'US',
    complianceStatus: 'Verified',
    tags: ['Automotive', 'Port of LA', 'Maersk Line'],
  },
  {
    id: 'DOC-2026-003',
    title: 'USMCA Certificate of Origin COO-2026-44',
    fileName: 'usmca_origin_certificate_batch44.pdf',
    category: 'Certificate of Origin',
    uploadDate: '2026-10-11',
    fileSize: '310 KB',
    hsCodes: ['8703.23'],
    declaredValue: 92000,
    currency: 'USD',
    originCountry: 'MX',
    destinationCountry: 'US',
    complianceStatus: 'Verified',
    tags: ['Preferential Tariff', 'USMCA Qualifying', 'Regional Value 75%'],
  },
  {
    id: 'DOC-2026-004',
    title: 'Form W-8BEN-E Foreign Entity Certificate',
    fileName: 'form_w8bene_beneficial_owner_signed.pdf',
    category: 'W-8BEN / Withholding Certificate',
    uploadDate: '2026-10-09',
    fileSize: '540 KB',
    declaredValue: 250000,
    currency: 'USD',
    originCountry: 'GB',
    destinationCountry: 'US',
    complianceStatus: 'Verified',
    tags: ['IRS Chapter 3', 'Treaty Benefit 0% Royalty', 'UK Entity'],
  },
  {
    id: 'DOC-2026-005',
    title: 'Single Administrative Document EU-SAD-1092',
    fileName: 'customs_entry_sad_rotterdam_1092.pdf',
    category: 'Customs Declaration (SAD)',
    uploadDate: '2026-10-08',
    fileSize: '650 KB',
    hsCodes: ['6109.10', '6203.42'],
    declaredValue: 34000,
    currency: 'EUR',
    originCountry: 'IN',
    destinationCountry: 'NL',
    complianceStatus: 'Attention Required',
    complianceIssues: ['EORI number requires renewal verification in EU VIES portal.'],
    tags: ['Customs Clearance', 'Audit Pending'],
  },
  {
    id: 'DOC-2026-006',
    title: 'Quarterly Intercompany Transfer Pricing Policy',
    fileName: 'global_transfer_pricing_master_file_2026.pdf',
    category: 'Transfer Pricing Policy',
    uploadDate: '2026-10-05',
    fileSize: '2.4 MB',
    currency: 'USD',
    originCountry: 'US',
    destinationCountry: 'SG',
    complianceStatus: 'Verified',
    tags: ['OECD Master File', 'TNMM Method', 'Intercompany Benchmark'],
  },
];

export const DocumentVault: React.FC = () => {
  const [documents, setDocuments] = useState<VaultDocument[]>(INITIAL_VAULT_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // Upload form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newFileName, setNewFileName] = useState<string>('commercial_invoice_2026_shipment.pdf');
  const [newContentSnippet, setNewContentSnippet] = useState<string>(
    'Commercial Invoice FOB Shanghai to Long Beach. Incoterm FOB. HS Code 8471.30. Value $62,000 USD. Tax ID TIN-9021-33.'
  );

  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || doc.complianceStatus === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle auto-categorized upload
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const analysis = classifyTradeDocument(newFileName, newContentSnippet);

    const newDoc: VaultDocument = {
      id: `DOC-2026-00${documents.length + 1}`,
      title: newTitle.trim() || newFileName.replace('.pdf', ''),
      fileName: newFileName,
      category: analysis.category,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: '480 KB',
      hsCodes: analysis.extractedHsCodes,
      declaredValue: analysis.declaredValue || 45000,
      currency: analysis.currency || 'USD',
      originCountry: 'US',
      destinationCountry: 'DE',
      complianceStatus: analysis.complianceStatus,
      complianceIssues: analysis.complianceIssues,
      tags: ['Auto-Categorized', analysis.category, 'Vault Stored'],
    };

    setDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
    setNewTitle('');
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  const handleDownloadPacket = () => {
    const manifest = {
      vaultVersion: '2026.4',
      generatedTimestamp: new Date().toISOString(),
      totalDocuments: documents.length,
      verifiedCount: documents.filter((d) => d.complianceStatus === 'Verified').length,
      documents: documents.map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        status: d.complianceStatus,
        declaredValue: d.declaredValue,
        currency: d.currency,
        hsCodes: d.hsCodes,
      })),
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnitax_vault_customs_manifest_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Supply Chain & Accounting Secure Document Vault
            </h2>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Encrypted Vault
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated document categorization, HS code extraction, and statutory audit compliance verification
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPacket}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Vault Manifest</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Trade Document</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, tags, HS codes..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
          />
        </div>

        {/* Category & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span className="font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Commercial Invoice">Commercial Invoice</option>
              <option value="Bill of Lading">Bill of Lading</option>
              <option value="Certificate of Origin">Certificate of Origin</option>
              <option value="Customs Declaration (SAD)">Customs Declaration (SAD)</option>
              <option value="W-8BEN / Withholding Certificate">W-8BEN / Withholding</option>
              <option value="Transfer Pricing Policy">Transfer Pricing Policy</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span className="font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="Attention Required">Attention Required</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const isVerified = doc.complianceStatus === 'Verified';
          return (
            <div
              key={doc.id}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                {/* Unboxed Metadata Header (Zero-Pill Discipline) */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-900">{doc.category}</span>
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <span>{doc.uploadDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.fileSize}</span>
                  </div>
                </div>

                {/* Title & File */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {doc.title}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">
                    {doc.fileName}
                  </div>
                </div>

                {/* Values & HS Codes */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-700">
                  {doc.declaredValue && (
                    <div>
                      <span className="text-[11px] text-slate-400 block">Declared Value</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {doc.currency} {doc.declaredValue.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {doc.hsCodes && doc.hsCodes.length > 0 && (
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">HS Codes</span>
                      <span className="font-mono text-indigo-700 font-medium">
                        {doc.hsCodes.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Compliance Status Notice */}
                <div
                  className={`p-2.5 rounded-lg text-xs flex items-start gap-2 border ${
                    isVerified
                      ? 'bg-emerald-50/60 border-emerald-100 text-emerald-900'
                      : 'bg-amber-50/70 border-amber-200 text-amber-900'
                  }`}
                >
                  {isVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <span className="font-semibold block">
                      {isVerified ? 'Audit Ready' : 'Compliance Attention Required'}
                    </span>
                    {doc.complianceIssues && doc.complianceIssues.length > 0 && (
                      <p className="text-[11px] leading-tight">
                        {doc.complianceIssues[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-slate-400">{doc.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
                    aria-label={`Delete ${doc.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      alert(`Document ${doc.title} decrypted and validated from secure vault.`);
                    }}
                    className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors"
                  >
                    View File
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600" />
                Upload Trade & Tax Document
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Document Title / Reference
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Commercial Invoice INV-2026-904"
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  File Preset / Name
                </label>
                <select
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="commercial_invoice_fob_shanghai_904.pdf">
                    Commercial Invoice (FOB Shanghai to Long Beach)
                  </option>
                  <option value="bill_of_lading_vessel_cma_cgm_4011.pdf">
                    Ocean Bill of Lading (Vessel CMA CGM Marco Polo)
                  </option>
                  <option value="certificate_of_origin_usmca_automotive.pdf">
                    Certificate of Origin (USMCA Qualifying)
                  </option>
                  <option value="customs_entry_form_7501_us_cbp.pdf">
                    Customs Entry Summary (CBP Form 7501)
                  </option>
                  <option value="form_w8ben_e_foreign_vendor.pdf">
                    W-8BEN-E Withholding Exemption Certificate
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Document Content / Metadata Snippet (for Automated Categorization)
                </label>
                <textarea
                  rows={3}
                  value={newContentSnippet}
                  onChange={(e) => setNewContentSnippet(e.target.value)}
                  placeholder="Paste invoice text, HS codes, VAT ID, or Incoterms for automated compliance classification..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-950">
                <span className="font-semibold block mb-0.5">Automated Intelligence:</span>
                The vault classifier will automatically identify the category, detect declared values and HS codes, and check required Incoterms and tax identifiers against customs regulations.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Analyze & Archive in Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
