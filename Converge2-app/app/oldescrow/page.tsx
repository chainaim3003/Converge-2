'use client'

export default function EscrowMarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-12 border-2 border-teal-200">
          <div className="text-center">
            <div className="text-6xl mb-6">🔒</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">New Escrow</h1>
            <div className="inline-block bg-yellow-100 border-2 border-yellow-400 rounded-lg px-8 py-4 mb-6">
              <p className="text-xl font-semibold text-yellow-800">🚧 Under Development</p>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Advanced escrow marketplace with smart contract integration, multi-party verification, 
              and automated dispute resolution coming soon.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-teal-50 rounded-lg p-6 border border-teal-200">
                <h3 className="font-bold text-teal-900 mb-2">Smart Escrow</h3>
                <p className="text-sm text-gray-700">Automated fund release based on conditions</p>
              </div>
              <div className="bg-teal-50 rounded-lg p-6 border border-teal-200">
                <h3 className="font-bold text-teal-900 mb-2">Multi-Party</h3>
                <p className="text-sm text-gray-700">Support for complex transactions</p>
              </div>
              <div className="bg-teal-50 rounded-lg p-6 border border-teal-200">
                <h3 className="font-bold text-teal-900 mb-2">Dispute Resolution</h3>
                <p className="text-sm text-gray-700">Automated arbitration system</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
