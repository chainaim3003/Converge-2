'use client'

import { useState } from 'react'
import Link from 'next/link'

interface EscrowDeal {
  id: string
  title: string
  buyer: string
  seller: string
  amount: number
  currency: string
  status: 'pending' | 'funded' | 'shipped' | 'delivered' | 'completed' | 'disputed'
  createdAt: string
  deadline: string
}

export default function NewEscrowPage() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'mydeals' | 'create'>('marketplace')
  const [deals] = useState<EscrowDeal[]>([
    {
      id: 'ESC-001',
      title: 'Electronics Shipment to New York',
      buyer: 'TechImports LLC',
      seller: 'GlobalElectronics Co',
      amount: 45000,
      currency: 'USDC',
      status: 'funded',
      createdAt: '2024-11-15',
      deadline: '2024-12-15'
    },
    {
      id: 'ESC-002',
      title: 'Textile Order - Premium Cotton',
      buyer: 'Fashion Distributors',
      seller: 'Quality Textiles Ltd',
      amount: 28000,
      currency: 'ALGO',
      status: 'shipped',
      createdAt: '2024-11-10',
      deadline: '2024-12-01'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700'
      case 'funded': return 'bg-blue-100 text-blue-700'
      case 'shipped': return 'bg-purple-100 text-purple-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'completed': return 'bg-emerald-100 text-emerald-700'
      case 'disputed': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="inline-block mb-4 text-blue-600 hover:text-blue-700">
          ← Back to Home
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="text-5xl">💰</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">NewEscrow Marketplace</h1>
                <p className="text-gray-600">Secure smart contract escrow for trade finance</p>
              </div>
            </div>
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              + Create New Deal
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-teal-50 rounded-lg p-6 border-2 border-teal-200">
              <h3 className="font-bold text-teal-900 mb-2">Active Escrows</h3>
              <p className="text-3xl font-bold text-teal-600">24</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">Total Value</h3>
              <p className="text-3xl font-bold text-blue-600">$3.2M</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <h3 className="font-bold text-green-900 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">187</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">Success Rate</h3>
              <p className="text-3xl font-bold text-purple-600">98.5%</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'marketplace'
                  ? 'border-b-4 border-teal-600 text-teal-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏪 Marketplace
            </button>
            <button
              onClick={() => setActiveTab('mydeals')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'mydeals'
                  ? 'border-b-4 border-teal-600 text-teal-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 My Deals
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'create'
                  ? 'border-b-4 border-teal-600 text-teal-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ➕ Create Deal
            </button>
          </div>

          {/* Content Area */}
          <div className="space-y-4">
            {activeTab === 'marketplace' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available Escrow Opportunities</h2>
                {deals.map((deal) => (
                  <div key={deal.id} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-6 mb-4 border-2 border-slate-200 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{deal.title}</h3>
                        <p className="text-sm text-gray-600">{deal.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(deal.status)}`}>
                        {deal.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600">Buyer</p>
                        <p className="font-semibold text-sm">{deal.buyer}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Seller</p>
                        <p className="font-semibold text-sm">{deal.seller}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Amount</p>
                        <p className="font-semibold text-sm">{deal.amount.toLocaleString()} {deal.currency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Deadline</p>
                        <p className="font-semibold text-sm">{deal.deadline}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        View Details
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        Participate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'mydeals' && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">You have no active escrow deals</p>
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Create Your First Deal
                </button>
              </div>
            )}

            {activeTab === 'create' && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Escrow Deal</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deal Title</label>
                    <input type="text" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none" placeholder="e.g., Electronics Shipment" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                      <input type="number" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                      <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none">
                        <option>USDC</option>
                        <option>ALGO</option>
                        <option>USD</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Counterparty Address</label>
                    <input type="text" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none" placeholder="Enter wallet address" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
                    <input type="date" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Terms & Conditions</label>
                    <textarea rows={4} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none" placeholder="Describe the terms of this escrow deal..."></textarea>
                  </div>
                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Create Escrow Deal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Feature Highlights */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">NewEscrow Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
                <h4 className="font-semibold text-teal-900 mb-2">🔐 Smart Contract Security</h4>
                <p className="text-sm text-teal-700">Funds held securely on Stellar blockchain</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">⚡ Instant Settlement</h4>
                <p className="text-sm text-blue-700">Automated release upon delivery confirmation</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">🛡️ Dispute Resolution</h4>
                <p className="text-sm text-purple-700">Built-in arbitration and mediation system</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
