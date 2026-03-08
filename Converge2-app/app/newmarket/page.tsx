'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Send,
  Building2,
  MapPin,
  CheckCircle,
  Loader2,
  ArrowRight,
  Factory,
  Sparkles,
  Globe,
  Shield,
  Award,
  MessageSquare,
  ExternalLink,
  Search,
} from 'lucide-react'
import marketplaceData from '@/data/marketplace-data.json'

interface MarketplaceSeller {
  id: string
  agentName: string
  organizationName: string
  lei: string
  address: string
  vLEIVerified: boolean
  lastVerificationTimestamp: string
  agentRegistry: string
  agentRegistryLink: string
  agentCardLink: string
  officialRole: string
  engagementRole: string
  capabilities: string[]
  certifications: string[]
  products: string[]
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function NewMarket() {
  const router = useRouter()
  const [sellers, setSellers] = useState<MarketplaceSeller[]>([])
  const [loading, setLoading] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [userInput, setUserInput] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [matchedSellers, setMatchedSellers] = useState<MarketplaceSeller[]>([])
  const [selectedSeller, setSelectedSeller] = useState<MarketplaceSeller | null>(null)

  // Load marketplace data and set default selection
  useEffect(() => {
    setSellers(marketplaceData.sellers || [])
    setLoading(false)
    
    // Default to Jupiter Knitting for demo
    const jupiter = marketplaceData.sellers.find((s: MarketplaceSeller) => 
      s.agentName === 'jupiterSellerAgent'
    )
    if (jupiter) {
      setMatchedSellers([jupiter])
      
      // Add welcome message with default selection
      setChatMessages([
        {
          role: 'assistant',
          content: `Welcome! I found **${marketplaceData.sellers.length} vLEI-verified sellers** in the marketplace.\n\nFor this demo, I've pre-selected **${jupiter.organizationName}** - a top textile manufacturer from India.\n\nYou can search for other sellers by typing queries like:\n• "organic cotton suppliers"\n• "vLEI verified textile sellers from India"\n• "sustainable fabric manufacturers"`,
          timestamp: new Date(),
        },
      ])
    }
  }, [])

  // Search function for matching sellers
  const searchSellers = (query: string) => {
    const lowerQuery = query.toLowerCase()
    const keywords = lowerQuery.split(' ').filter(k => k.length > 2)
    
    const matches = sellers.filter(seller => {
      const searchableText = [
        seller.organizationName,
        seller.address,
        ...seller.products,
        ...seller.capabilities,
        ...seller.certifications,
      ].join(' ').toLowerCase()
      
      return keywords.some(keyword => searchableText.includes(keyword))
    })
    
    return matches
  }

  const handleSendMessage = () => {
    if (!userInput.trim() || isSearching) return

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    }
    setChatMessages(prev => [...prev, userMessage])
    setUserInput('')
    setIsSearching(true)

    // Simulate search delay
    setTimeout(() => {
      const matches = searchSellers(userInput)
      setMatchedSellers(matches)

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: matches.length > 0
          ? `Found **${matches.length} seller${matches.length > 1 ? 's' : ''}** matching your query. Check the results below!`
          : `No sellers found matching "${userInput}". Try different keywords like "textile", "cotton", or "India".`,
        timestamp: new Date(),
      }
      setChatMessages(prev => [...prev, assistantMessage])
      setIsSearching(false)
    }, 1000)
  }

  const handleSelectSeller = (seller: MarketplaceSeller) => {
    setSelectedSeller(seller)

    // Add selection message
    const selectionMessage: ChatMessage = {
      role: 'assistant',
      content: `Great choice! Initiating delegation verification with **${seller.organizationName}**...\n\nRedirecting to Agentic Flow...`,
      timestamp: new Date(),
    }
    setChatMessages(prev => [...prev, selectionMessage])

    // Navigate to AgenticFlow after brief delay
    setTimeout(() => {
      // Store selected seller in localStorage for AgenticFlow to use
      localStorage.setItem('selectedSeller', JSON.stringify(seller))
      router.push('/agenticflow')
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            New Market Discovery
          </h1>
          <p className="text-slate-600 text-sm lg:text-base font-medium">
            Chat to find vLEI-verified sellers and connect
          </p>
        </div>

        <div className="grid lg:grid-cols-[350px_1fr] gap-6">
          {/* LEFT: CHAT INTERFACE */}
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-4 flex flex-col" style={{ height: '600px' }}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900">Search Chat</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isSearching && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-lg p-3">
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Search for sellers..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                disabled={isSearching}
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isSearching}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Example Queries */}
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-600 mb-2">Try searching for:</p>
              <div className="flex flex-wrap gap-1">
                {['textile sellers', 'organic cotton', 'India manufacturers'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setUserInput(example)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: SELLER RESULTS */}
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  Matched Sellers ({matchedSellers.length})
                </h2>
              </div>
              <div className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200 font-semibold">
                vLEI Verified
              </div>
            </div>

            {matchedSellers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-slate-100 p-6 rounded-full mb-4">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No sellers found</h3>
                <p className="text-slate-600 text-sm">
                  Try different search terms in the chat
                </p>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
                {matchedSellers.map((seller) => (
                  <div
                    key={seller.id}
                    className={`border-2 rounded-xl p-5 transition-all ${
                      selectedSeller?.id === seller.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-slate-900 text-lg">{seller.organizationName}</h3>
                        {seller.vLEIVerified && (
                          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                            <CheckCircle className="w-3 h-3" />
                            vLEI
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <span className="text-xs">LEI: {seller.lei}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{seller.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Factory className="w-4 h-4 text-slate-400" />
                          <span>{seller.officialRole}</span>
                        </div>
                      </div>

                      {/* Products */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-slate-700 mb-1">Products:</p>
                        <div className="flex flex-wrap gap-1">
                          {seller.products.slice(0, 3).map((product, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded"
                            >
                              {product}
                            </span>
                          ))}
                          {seller.products.length > 3 && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              +{seller.products.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Certifications */}
                      {seller.certifications.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-slate-700 mb-1">Certifications:</p>
                          <div className="flex flex-wrap gap-1">
                            {seller.certifications.slice(0, 2).map((cert, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded flex items-center gap-1"
                              >
                                <Award className="w-3 h-3" />
                                {cert}
                              </span>
                            ))}
                            {seller.certifications.length > 2 && (
                              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                +{seller.certifications.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Agent Card Link */}
                      <a
                        href={seller.agentCardLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        <Shield className="w-3 h-3" />
                        View Agent Card
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {selectedSeller?.id === seller.id ? (
                      <div className="bg-green-100 border border-green-300 rounded-lg p-3 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-900">Selected!</p>
                          <p className="text-xs text-green-700">
                            Navigating to Agentic Flow...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelectSeller(seller)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group"
                      >
                        Connect with {seller.agentName}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
