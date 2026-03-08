'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Agent {
  id: string
  name: string
  role: string
  status: 'active' | 'idle' | 'offline'
  capabilities: string[]
  trustScore: number
}

export default function AgentExchangePage() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'AG-001',
      name: 'Procurement Agent Alpha',
      role: 'Buyer',
      status: 'active',
      capabilities: ['Price Negotiation', 'Vendor Verification', 'Contract Review'],
      trustScore: 98
    },
    {
      id: 'AG-002',
      name: 'Sales Agent Beta',
      role: 'Seller',
      status: 'active',
      capabilities: ['Product Listing', 'Order Processing', 'Customer Support'],
      trustScore: 95
    },
    {
      id: 'AG-003',
      name: 'Logistics Agent Gamma',
      role: 'Carrier',
      status: 'idle',
      capabilities: ['Route Optimization', 'Shipment Tracking', 'Delivery Confirmation'],
      trustScore: 92
    },
    {
      id: 'AG-004',
      name: 'Financial Agent Delta',
      role: 'Financier',
      status: 'active',
      capabilities: ['Payment Processing', 'Credit Analysis', 'Risk Assessment'],
      trustScore: 97
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'idle': return 'bg-yellow-100 text-yellow-700'
      case 'offline': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 85) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agent Exchange</h1>
              <p className="text-gray-600 mt-1">Discover and connect with AI agents on the network</p>
            </div>
            <Link href="/agenticflow">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                🔄 Go to AgenticFlow
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Agents</p>
                <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                ✅
              </div>
              <div>
                <p className="text-gray-600 text-sm">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {agents.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                🔗
              </div>
              <div>
                <p className="text-gray-600 text-sm">Connections</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <p className="text-gray-600 text-sm">Avg Trust Score</p>
                <p className="text-2xl font-bold text-gray-900">95.5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
            <h2 className="text-xl font-bold text-gray-900">Available Agents</h2>
            <p className="text-gray-600 text-sm mt-1">Browse and connect with verified AI agents</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <div key={agent.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-400 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-600">{agent.role}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">ID: {agent.id}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Trust Score:</span>
                      <span className={`text-lg font-bold ${getTrustScoreColor(agent.trustScore)}`}>
                        {agent.trustScore}%
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Capabilities:</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.capabilities.map((cap, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-200">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                      Connect
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-300 hover:border-indigo-400 text-gray-700 rounded-lg font-medium transition-colors text-sm">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            About Agent Exchange
          </h3>
          <p className="text-gray-700 leading-relaxed">
            The Agent Exchange is a marketplace for AI agents powered by vLEI credentials and verified through the Algorand blockchain. 
            Each agent is cryptographically verified and has delegated authorities that can be independently confirmed. 
            Connect with agents to automate trade processes, verify credentials, and establish trusted business relationships.
          </p>
        </div>
      </div>
    </div>
  )
}
