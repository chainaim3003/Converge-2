'use client'

import Link from 'next/link'

export default function RegulatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="inline-block mb-4 text-blue-600 hover:text-blue-700">
          ← Back to Home
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">🛡️</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Regulator Dashboard</h1>
              <p className="text-gray-600">Compliance monitoring and oversight</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              <h3 className="font-bold text-red-900 mb-2">Active Trades</h3>
              <p className="text-3xl font-bold text-red-600">127</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-2">Pending Review</h3>
              <p className="text-3xl font-bold text-yellow-600">8</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <h3 className="font-bold text-green-900 mb-2">Compliant</h3>
              <p className="text-3xl font-bold text-green-600">98.5%</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">Audits</h3>
              <p className="text-3xl font-bold text-blue-600">45</p>
            </div>
          </div>

          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-6 mb-6">
            <p className="text-yellow-800 font-semibold">🚧 This dashboard is under active development</p>
            <p className="text-yellow-700 text-sm mt-2">Will be mapped from: RegulatorDashboard.tsx</p>
          </div>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">🔍 Trade Monitoring</h4>
              <p className="text-sm text-slate-600">Real-time oversight of all trade activities</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">📋 Compliance Checks</h4>
              <p className="text-sm text-slate-600">Automated verification and validation</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">📊 Audit Reports</h4>
              <p className="text-sm text-slate-600">Generate comprehensive audit trails</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="font-semibold text-slate-800 mb-2">⚠️ Alert System</h4>
              <p className="text-sm text-slate-600">Notifications for compliance issues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
