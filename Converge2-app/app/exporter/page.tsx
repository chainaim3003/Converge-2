'use client'

export default function ExporterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">📦</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Exporter Dashboard</h1>
              <p className="text-gray-600">Manage your export operations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">Active Exports</h3>
              <p className="text-3xl font-bold text-blue-600">24</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <h3 className="font-bold text-green-900 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">156</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">Total Value</h3>
              <p className="text-3xl font-bold text-purple-600">$2.5M</p>
            </div>
          </div>

          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-6">
            <p className="text-yellow-800 font-semibold">🚧 This dashboard is under active development</p>
          </div>
        </div>
      </div>
    </div>
  )
}
