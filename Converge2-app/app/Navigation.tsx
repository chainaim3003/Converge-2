'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-3">
          {/* Title + Navigation + Wallet */}
          <div className="flex items-center gap-4">
            {/* Left: Title */}
            <Link href="/" className="text-3xl font-bold text-gray-900 whitespace-nowrap">
              <span className="text-blue-600">CRE</span>
            </Link>

            {/* Center: Main Navigation Tabs - Scrollable */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex space-x-2">
                {/* 1. Home */}
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-[15px] font-medium transition-colors whitespace-nowrap ${
                    isActive('/')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🏠 Home
                </Link>

                {/* 2. NewMarket */}
                <Link
                  href="/newmarket"
                  className={`px-3 py-2 rounded-md text-[15px] font-medium transition-colors whitespace-nowrap ${
                    isActive('/newmarket')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🏬 NewMarket
                </Link>

                {/* 3. AgentExchange */}
                <Link
                  href="/agentexchange"
                  className={`px-3 py-2 rounded-md text-[15px] font-medium transition-colors whitespace-nowrap ${
                    isActive('/agentexchange')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🤖 AgentExchange
                </Link>

                {/* 4. AgenticFlow */}
                <Link
                  href="/agenticflow"
                  className={`px-3 py-2 rounded-md text-[15px] font-medium transition-colors whitespace-nowrap ${
                    isActive('/agenticflow')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🔄 AgenticFlow
                </Link>

                {/* 5. Exporter */}
                <Link
                  href="/exporter"
                  className={`px-3 py-2 rounded-md text-[15px] font-medium transition-colors whitespace-nowrap ${
                    isActive('/exporter')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📦 Exporter
                </Link>

                {/* 6. Importer */}
                <Link
                  href="/importer"
                  className={`px-3 py-2 rounded-md text-[15px] font-medium transition-colors whitespace-nowrap ${
                    isActive('/importer')
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🏪 Importer
                </Link>

                {/* 7. Financier */}
                <Link
                  href="/financier"
                  className={`px-3 py-2 rounded-md text-[15px] font-medium transition-colors whitespace-nowrap ${
                    isActive('/financier')
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  💰 Financier
                </Link>

                {/* 8. Regulator */}
                <Link
                  href="/regulator"
                  className={`px-3 py-2 rounded-md text-[15px] font-medium transition-colors whitespace-nowrap ${
                    isActive('/regulator')
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🛡️ Regulator
                </Link>

                {/* 9. ETH Test */}
                <Link
                  href="/xrp-test"
                  className={`px-3 py-2 rounded-md text-[15px] font-medium transition-colors whitespace-nowrap ${
                    isActive('/xrp-test')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  💎 ETH Test
                </Link>


              </div>
            </div>


          </div>
        </div>
      </div>
    </nav>
  )
}
