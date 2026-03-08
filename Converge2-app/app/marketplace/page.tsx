'use client'

import { useState } from 'react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  seller: string
  rating: number
  stock: number
  image: string
}

export default function MarketplacePage() {
  const [products] = useState<Product[]>([
    {
      id: 'PRD-001',
      name: 'Industrial Grade Steel Beams',
      category: 'Materials',
      price: 2500,
      seller: 'GlobalSteel Inc.',
      rating: 4.8,
      stock: 150,
      image: '🏗️'
    },
    {
      id: 'PRD-002',
      name: 'Electronic Components Bundle',
      category: 'Electronics',
      price: 1200,
      seller: 'TechSupply Co.',
      rating: 4.9,
      stock: 200,
      image: '🔌'
    },
    {
      id: 'PRD-003',
      name: 'Organic Cotton Textiles',
      category: 'Textiles',
      price: 850,
      seller: 'EcoFabrics Ltd.',
      rating: 4.7,
      stock: 500,
      image: '🧵'
    },
    {
      id: 'PRD-004',
      name: 'Precision Machinery Parts',
      category: 'Manufacturing',
      price: 3200,
      seller: 'PrecisionTech',
      rating: 4.9,
      stock: 75,
      image: '⚙️'
    }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">New Market ✨</h1>
              <p className="text-gray-600 mt-1">Browse and trade products on the blockchain</p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              List Product
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Under Development Banner */}
        <div className="mb-8 bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🚧</span>
            <div>
              <h2 className="text-2xl font-bold text-yellow-900 mb-2">Under Development</h2>
              <p className="text-yellow-800">
                This enhanced marketplace is currently being developed with advanced features including 
                AI-powered recommendations, smart contract escrow, and cross-chain settlements.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-2">📦</div>
            <p className="text-gray-600 text-sm">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">1,234</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-2">🏪</div>
            <p className="text-gray-600 text-sm">Active Sellers</p>
            <p className="text-2xl font-bold text-gray-900">456</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-gray-600 text-sm">Total Volume</p>
            <p className="text-2xl font-bold text-gray-900">$2.5M</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-2">🔄</div>
            <p className="text-gray-600 text-sm">Transactions</p>
            <p className="text-2xl font-bold text-gray-900">8,901</p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-400 hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 h-40 flex items-center justify-center text-6xl">
                    {product.image}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">Category: {product.category}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-2xl font-bold text-purple-600">${product.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">per unit</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                        <p className="text-sm text-yellow-600">⭐ {product.rating}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-3">Seller: {product.seller}</p>

                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
