'use client'

import Link from 'next/link'

export default function FinancierPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="inline-block mb-4 text-blue-600 hover:text-blue-700">
          ← Back to Home
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">💰</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Financier Dashboard</h1>
              <p className="text-gray-600">Investment opportunities and trade finance</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-2">Active Investments</h3>
              <p className="text-3xl font-bold text-yellow-600">12</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <h3 className="font-bold text-green-900 mb-2">Total Invested</h3>
              <p className="text-3xl font-bold text-green-600">$1.8M</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">Returns (YTD)</h3>
              <p className="text-3xl font-bold text-blue-600">8.5%</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">Opportunities</h3>
              <p className="text-3xl font-bold text-purple-600">28</p>
            </div>
          </div>

          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-6 mb-6">
            <p className="text-yellow-800 font-semibold">🚧 This dashboard is under active development</p>
            <p className="text-yellow-700 text-sm mt-2">Will be mapped from: InvestorDashboard.tsx</p>
          </div>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">📈 Investment Portfolio</h4>
              <p className="text-sm text-slate-600">View and manage your trade finance investments</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">🎯 RWA Opportunities</h4>
              <p className="text-sm text-slate-600">Browse fractional investment opportunities</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">📊 Performance Analytics</h4>
              <p className="text-sm text-slate-600">Track returns and risk metrics</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">💼 Due Diligence</h4>
              <p className="text-sm text-slate-600">Review trade documentation and risk</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
