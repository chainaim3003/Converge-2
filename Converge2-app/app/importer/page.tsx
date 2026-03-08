'use client'

import Link from 'next/link'

export default function ImporterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="inline-block mb-4 text-blue-600 hover:text-blue-700">
          ← Back to Home
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">🏪</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Importer Dashboard</h1>
              <p className="text-gray-600">Manage your import operations and orders</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <h3 className="font-bold text-green-900 mb-2">Pending Orders</h3>
              <p className="text-3xl font-bold text-green-600">18</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">In Transit</h3>
              <p className="text-3xl font-bold text-blue-600">32</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">Received</h3>
              <p className="text-3xl font-bold text-purple-600">145</p>
            </div>
          </div>

          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-6 mb-6">
            <p className="text-yellow-800 font-semibold">🚧 This dashboard is under active development</p>
            <p className="text-yellow-700 text-sm mt-2">Will be mapped from: ImporterDashboard.tsx / ImporterDashboardEnhanced.tsx</p>
          </div>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">📋 Order Management</h4>
              <p className="text-sm text-slate-600">Track and manage import orders</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">📊 Customs Documentation</h4>
              <p className="text-sm text-slate-600">Handle customs and clearance</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">💰 Payment Processing</h4>
              <p className="text-sm text-slate-600">Manage payments and escrow</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">🚢 Shipment Tracking</h4>
              <p className="text-sm text-slate-600">Real-time shipment updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
