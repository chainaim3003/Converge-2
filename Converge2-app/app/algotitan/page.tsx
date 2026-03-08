'use client';

import React, { useState } from 'react';

type TabType = 
  | 'home' 
  | 'exporter' 
  | 'carrier' 
  | 'importer' 
  | 'financier' 
  | 'marketplace' 
  | 'escrow-marketplace' 
  | 'regulator' 
  | 'admin' 
  | 'about'
  | 'new-market'    // ✨ NEW TAB
  | 'new-escrow';   // ✨ NEW TAB

export default function AlgoTITANPage() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Placeholder components for existing tabs
  const HomePage = () => <div className="p-8"><h2 className="text-2xl font-bold">Home Page</h2><p className="mt-4">CRE components will be copied here</p></div>;
  const ExporterDashboard = () => <div className="p-8"><h2 className="text-2xl font-bold">Exporter Dashboard</h2></div>;
  const CarrierDashboard = () => <div className="p-8"><h2 className="text-2xl font-bold">Carrier Dashboard</h2></div>;
  const ImporterDashboard = () => <div className="p-8"><h2 className="text-2xl font-bold">Importer Dashboard</h2></div>;
  const FinancierDashboard = () => <div className="p-8"><h2 className="text-2xl font-bold">Financier Dashboard</h2></div>;
  const MarketplaceDashboard = () => <div className="p-8"><h2 className="text-2xl font-bold">Marketplace Dashboard</h2></div>;
  const EscrowMarketplace = () => <div className="p-8"><h2 className="text-2xl font-bold">Escrow Marketplace</h2></div>;
  const RegulatorDashboard = () => <div className="p-8"><h2 className="text-2xl font-bold">Regulator Dashboard</h2></div>;
  const AdminDashboard = () => <div className="p-8"><h2 className="text-2xl font-bold">Admin Dashboard</h2></div>;
  const AboutPage = () => <div className="p-8"><h2 className="text-2xl font-bold">About</h2></div>;

  // ✨ NEW TAB COMPONENTS
  const NewMarketPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white rounded-lg shadow-xl p-12 max-w-2xl">
        <div className="text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">New Market</h1>
          <div className="inline-block bg-yellow-100 border-2 border-yellow-400 rounded-lg px-6 py-3 mb-4">
            <p className="text-xl font-semibold text-yellow-800">🚧 This is being developed</p>
          </div>
          <p className="text-gray-600 mt-4">
            Enhanced marketplace features coming soon...
          </p>
        </div>
      </div>
    </div>
  );

  const NewEscrowPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="bg-white rounded-lg shadow-xl p-12 max-w-2xl">
        <div className="text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">New Escrow</h1>
          <div className="inline-block bg-yellow-100 border-2 border-yellow-400 rounded-lg px-6 py-3 mb-4">
            <p className="text-xl font-semibold text-yellow-800">🚧 This is being developed</p>
          </div>
          <p className="text-gray-600 mt-4">
            Advanced escrow functionality coming soon...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-800"><span className="text-blue-600">CRE</span> Unified Platform</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            <TabButton label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <TabButton label="Exporter" active={activeTab === 'exporter'} onClick={() => setActiveTab('exporter')} />
            <TabButton label="Carrier" active={activeTab === 'carrier'} onClick={() => setActiveTab('carrier')} />
            <TabButton label="Importer" active={activeTab === 'importer'} onClick={() => setActiveTab('importer')} />
            <TabButton label="Financier" active={activeTab === 'financier'} onClick={() => setActiveTab('financier')} />
            <TabButton label="Marketplace" active={activeTab === 'marketplace'} onClick={() => setActiveTab('marketplace')} />
            <TabButton label="Escrow" active={activeTab === 'escrow-marketplace'} onClick={() => setActiveTab('escrow-marketplace')} />
            
            {/* ✨ NEW TABS */}
            <TabButton label="New Market ✨" active={activeTab === 'new-market'} onClick={() => setActiveTab('new-market')} highlight />
            <TabButton label="New Escrow ✨" active={activeTab === 'new-escrow'} onClick={() => setActiveTab('new-escrow')} highlight />
            
            <TabButton label="Regulator" active={activeTab === 'regulator'} onClick={() => setActiveTab('regulator')} />
            <TabButton label="Admin" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
            <TabButton label="About" active={activeTab === 'about'} onClick={() => setActiveTab('about')} />
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'exporter' && <ExporterDashboard />}
        {activeTab === 'carrier' && <CarrierDashboard />}
        {activeTab === 'importer' && <ImporterDashboard />}
        {activeTab === 'financier' && <FinancierDashboard />}
        {activeTab === 'marketplace' && <MarketplaceDashboard />}
        {activeTab === 'escrow-marketplace' && <EscrowMarketplace />}
        {activeTab === 'regulator' && <RegulatorDashboard />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'about' && <AboutPage />}
        
        {/* ✨ NEW TAB CONTENT */}
        {activeTab === 'new-market' && <NewMarketPage />}
        {activeTab === 'new-escrow' && <NewEscrowPage />}
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ 
  label, 
  active, 
  onClick, 
  highlight = false 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors
        ${active 
          ? 'border-b-2 border-blue-600 text-blue-600' 
          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
        }
        ${highlight ? 'bg-yellow-50 hover:bg-yellow-100' : ''}
      `}
    >
      {label}
    </button>
  );
}
