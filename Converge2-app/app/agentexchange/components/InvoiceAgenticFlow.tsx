"use client"

import { useState } from "react"
import { Check, FileText, Send, CreditCard, Sparkles, ShieldCheck, FileSearch, MessageSquare } from "lucide-react"

interface InvoiceAgenticFlowProps {
  currentStep?: string
  invoiceData?: {
    invoiceId?: string
    amount?: string
    transactionId?: string
    blockExplorerUrl?: string
  }
}

interface FlowStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'complete' | 'active' | 'pending'
  agent?: 'seller' | 'buyer' | 'system'
  processName?: string
  color: string
  bgColor: string
  borderColor: string
  avatarGradient: string
}

export function InvoiceAgenticFlow({ currentStep = 'idle', invoiceData = {} }: InvoiceAgenticFlowProps) {
  // Changed: hoveredStep now stays until another icon is hovered
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  
  const getStepStatus = (stepId: string): 'complete' | 'active' | 'pending' => {
    const stepOrder = [
      'creating-invoice', 
      'invoice-created', 
      'sending-to-buyer', 
      'buyer-verifying', 
      'validating-invoice',
      'payment-processing', 
      'payment-confirmed', 
      'complete'
    ]
    const currentIndex = stepOrder.indexOf(currentStep)
    
    if (currentStep === 'idle') return 'pending'
    if (currentStep === 'complete') return 'complete'
    
    switch (stepId) {
      case 'create-invoice':
        if (currentIndex >= stepOrder.indexOf('invoice-created')) return 'complete'
        if (currentStep === 'creating-invoice') return 'active'
        return 'pending'
      
      case 'send-to-buyer':
        if (currentIndex >= stepOrder.indexOf('buyer-verifying')) return 'complete'
        if (currentStep === 'sending-to-buyer') return 'active'
        return 'pending'
      
      case 'verify-seller':
        if (currentIndex >= stepOrder.indexOf('validating-invoice')) return 'complete'
        if (currentStep === 'buyer-verifying') return 'active'
        return 'pending'

      case 'validate-invoice':
        if (currentIndex >= stepOrder.indexOf('payment-processing')) return 'complete'
        if (currentStep === 'validating-invoice') return 'active'
        return 'pending'
      
      case 'payment-processing':
        if (currentIndex >= stepOrder.indexOf('payment-confirmed')) return 'complete'
        if (currentStep === 'payment-processing') return 'active'
        return 'pending'
      
      case 'respond-to-seller':
        if (currentStep === 'complete') return 'complete'
        if (currentStep === 'payment-confirmed') return 'active'
        return 'pending'
      
      default:
        return 'pending'
    }
  }

  const flowSteps: FlowStep[] = [
    {
      id: 'create-invoice',
      title: 'Creating Invoice',
      description: '',
      icon: <FileText className="w-5 h-5" />,
      status: getStepStatus('create-invoice'),
      agent: 'seller',
      processName: 'Invoice Creation',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      avatarGradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'send-to-buyer',
      title: 'Sending to Buyer Agent',
      description: '',
      icon: <Send className="w-5 h-5" />,
      status: getStepStatus('send-to-buyer'),
      agent: 'seller',
      processName: 'Sending Invoice',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-400',
      avatarGradient: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'verify-seller',
      title: 'Buyer Verifying Seller',
      description: '',
      icon: <ShieldCheck className="w-5 h-5" />,
      status: getStepStatus('verify-seller'),
      agent: 'buyer',
      processName: 'Verification',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-400',
      avatarGradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'validate-invoice',
      title: 'Validating Invoice',
      description: '',
      icon: <FileSearch className="w-5 h-5" />,
      status: getStepStatus('validate-invoice'),
      agent: 'buyer',
      processName: 'Validating Invoice',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-400',
      avatarGradient: 'from-pink-500 to-pink-600'
    },
    {
      id: 'payment-processing',
      title: 'Payment Processing',
      description: '',
      icon: <CreditCard className="w-5 h-5" />,
      status: getStepStatus('payment-processing'),
      agent: 'system',
      processName: 'Payment Processing',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-400',
      avatarGradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 'respond-to-seller',
      title: 'Respond to Seller',
      description: '',
      icon: <MessageSquare className="w-5 h-5" />,
      status: getStepStatus('respond-to-seller'),
      agent: 'buyer',
      processName: 'Respond to Seller',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      avatarGradient: 'from-green-500 to-green-600'
    }
  ]

  const isFlowComplete = currentStep === 'complete'

  // Get the currently selected step data
  const selectedStepData = flowSteps.find(s => s.id === selectedStep)

  const getPopupContent = (step: FlowStep) => {
    const statusText = step.status === 'complete' ? 'Complete ✓' : step.status === 'active' ? 'In Progress...' : 'Pending'
    
    const mockInvoiceId = invoiceData.invoiceId || 'INV-MI1YD14G'
    const mockAmount = invoiceData.amount || '5,000.00 USD'
    const mockTxId = invoiceData.transactionId || 'TXMI1YD5DO'
    const txLink = invoiceData.blockExplorerUrl || `https://testnet.xrpl.org/transactions/${mockTxId}`
    
    switch (step.id) {
      case 'create-invoice':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">✅</span>
              <span className="font-semibold text-sm">Status: {statusText}</span>
            </div>
            <div className="flex items-center gap-2"><span className="text-sm">📋</span> <span className="text-xs">ID: {mockInvoiceId}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm">💰</span> <span className="text-xs">Amount: {mockAmount}</span></div>
          </div>
        )
      
      case 'send-to-buyer':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">✅</span>
              <span className="font-semibold text-sm">Status: {statusText}</span>
            </div>
            <div className="flex items-center gap-2"><span className="text-sm">📤</span> <span className="text-xs">Protocol: A2A v2.0</span></div>
            <div className="flex items-center gap-2"><span className="text-sm">🎯</span> <span className="text-xs">To: Tommy Hilfiger Agent</span></div>
            <div className="flex items-center gap-2"><span className="text-sm">💰</span> <span className="text-xs">Amount: {mockAmount}</span></div>
          </div>
        )
      
      case 'verify-seller':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">✅</span>
              <span className="font-semibold text-sm">Status: {statusText}</span>
            </div>
            <div className="flex items-center gap-2"><span className="text-sm">🔐</span> <span className="text-xs">vLEI: Verified ✓</span></div>
            <div className="flex items-center gap-2"><span className="text-sm">👤</span> <span className="text-xs">Seller: Jupiter Knitting</span></div>
          </div>
        )
      
      case 'validate-invoice':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">✅</span>
              <span className="font-semibold text-sm">Status: {statusText}</span>
            </div>
            <div className="flex items-center gap-2"><span className="text-sm">📋</span> <span className="text-xs">ID: {mockInvoiceId}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm">💰</span> <span className="text-xs">Amount: Confirmed ✓</span></div>
            <div className="flex items-center gap-2"><span className="text-sm">🔏</span> <span className="text-xs">Signature: Valid ✓</span></div>
          </div>
        )
      
      case 'payment-processing':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">✅</span>
              <span className="font-semibold text-sm">Status: {statusText}</span>
            </div>
            <div className="flex items-center gap-2"><span className="text-sm">💳</span> <span className="text-xs">TX: {mockTxId}</span></div>
            <div className="flex items-center gap-2"><span className="text-sm">💰</span> <span className="text-xs">Amount: {mockAmount}</span></div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🔗</span> 
              <a href={txLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline cursor-pointer">
                View on Explorer →
              </a>
            </div>
          </div>
        )
      
      case 'respond-to-seller':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">✅</span>
              <span className="font-semibold text-sm">Status: {statusText}</span>
            </div>
            <div className="flex items-center gap-2"><span className="text-sm">💰</span> <span className="text-xs">Settled: {mockAmount}</span></div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🔗</span> 
              <a href={txLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline cursor-pointer">
                View Transaction →
              </a>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  const getCircularPosition = (index: number, total: number, radius: number) => {
    const angle = (index * (360 / total) - 90) * (Math.PI / 180)
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    return { x, y, angle: angle * (180 / Math.PI) }
  }

  // Responsive sizing - smaller for mobile/container fit
  const radius = 100
  const centerX = 150
  const centerY = 150
  const containerSize = 300

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-3 border border-purple-200 w-full overflow-visible">
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-purple-600 p-1.5 rounded-lg animate-pulse">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Invoice Agentic Flow</h3>
        </div>
        <p className="text-[10px] text-gray-600 ml-7">Real-time agent-to-agent communication via A2A protocol</p>
      </div>

      {/* Centered container for the circular flow */}
      <div className="flex justify-center items-center w-full overflow-visible">
        <div className="relative" style={{ width: `${containerSize}px`, height: `${containerSize}px` }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="url(#gradientInvoice)"
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity="0.3"
            />
            
            <defs>
              <linearGradient id="gradientInvoice" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="16%" stopColor="#6366f1" />
                <stop offset="33%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="66%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {flowSteps.map((step, index) => {
              const nextIndex = (index + 1) % flowSteps.length
              const pos1 = getCircularPosition(index, flowSteps.length, radius)
              const pos2 = getCircularPosition(nextIndex, flowSteps.length, radius)
              
              const x1 = centerX + pos1.x
              const y1 = centerY + pos1.y
              const x2 = centerX + pos2.x
              const y2 = centerY + pos2.y

              const angle = Math.atan2(y2 - y1, x2 - x1)
              const arrowSize = 8
              
              return (
                <g key={`arrow-${index}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={step.status === 'complete' ? '#10b981' : step.status === 'active' ? '#fbbf24' : '#d1d5db'}
                    strokeWidth={step.status === 'complete' || step.status === 'active' ? '2' : '1.5'}
                    opacity={step.status === 'pending' ? '0.3' : '0.8'}
                    className={step.status === 'active' ? 'animate-pulse' : ''}
                  />
                  
                  <polygon
                    points={`${x2},${y2} ${x2 - arrowSize * Math.cos(angle - Math.PI / 6)},${y2 - arrowSize * Math.sin(angle - Math.PI / 6)} ${x2 - arrowSize * Math.cos(angle + Math.PI / 6)},${y2 - arrowSize * Math.sin(angle + Math.PI / 6)}`}
                    fill={step.status === 'complete' ? '#10b981' : step.status === 'active' ? '#fbbf24' : '#d1d5db'}
                    opacity={step.status === 'pending' ? '0.3' : '0.8'}
                  />
                </g>
              )
            })}
          </svg>

          {/* CENTER POPUP - Shows selected step details */}
          <div 
            className="absolute z-50 flex items-center justify-center"
            style={{ 
              left: `${centerX - 55}px`, 
              top: `${centerY - 10}px`,
              width: '110px',
              height: '20px'
            }}
          >
            {selectedStepData ? (
              // Show popup content when a step is selected
              <div 
                className={`w-full bg-white shadow-md border ${selectedStepData.borderColor} rounded p-0.5 transition-all duration-300 animate-fade-in`}
              >
                <div className={`font-bold ${selectedStepData.color} truncate`} style={{ fontSize: '1px' }}>
                  {selectedStepData.processName}
                </div>
                <div className="text-gray-600 leading-none" style={{ fontSize: '1px' }}>
                  {getPopupContent(selectedStepData)}
                </div>
              </div>
            ) : (
              // Show default center status when no step is selected
              <div className={`w-6 h-6 rounded-full flex flex-col items-center justify-center transition-all shadow-lg ${
                isFlowComplete ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-purple-400 to-indigo-600 animate-pulse'
              }`}>
                {isFlowComplete ? (
                  <>
                    <Check className="w-2 h-2 text-white" />
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin" />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Step Icons */}
          {flowSteps.map((step, index) => {
            const pos = getCircularPosition(index, flowSteps.length, radius)
            const x = centerX + pos.x - 24
            const y = centerY + pos.y - 30

            return (
              <div
                key={step.id}
                className="absolute transition-all duration-300"
                style={{ 
                  left: `${x}px`, 
                  top: `${y}px`,
                  zIndex: selectedStep === step.id ? 60 : (step.status === 'active' ? 20 : 10)
                }}
              >
                <div className="flex flex-col items-center w-12">
                  <div 
                    className="mb-1 relative cursor-pointer"
                    onMouseEnter={() => {
                      // Only allow hover popup for completed steps
                      if (step.status === 'complete') {
                        setSelectedStep(step.id)
                      }
                    }}
                    // No onMouseLeave - popup stays until another is hovered
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.avatarGradient} flex items-center justify-center shadow-md transition-all duration-300 ${
                      step.status === 'active' ? 'animate-bounce scale-110' : 
                      step.status === 'complete' ? 'scale-100' : 'scale-90 opacity-50'
                    } ${selectedStep === step.id ? 'ring-4 ring-white ring-offset-2 ring-offset-purple-200 scale-110' : ''}`}>
                      <div className="text-white">
                        {step.icon}
                      </div>
                    </div>
                    
                    {step.status === 'active' && (
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.avatarGradient} opacity-30 animate-ping`} />
                    )}

                    {step.status === 'complete' && (
                      <div className={`absolute -top-1 -right-1 bg-gradient-to-br ${step.avatarGradient} rounded-full p-0.5 shadow`}>
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}

                    {step.status === 'active' && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5 shadow">
                        <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className={`text-[9px] font-semibold text-center leading-tight ${step.color} ${
                    step.status === 'active' ? 'animate-pulse' : ''
                  } ${step.status === 'pending' ? 'opacity-50' : ''}`} style={{ maxWidth: '60px' }}>
                    {step.processName}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status Summary */}
      <div className={`mt-3 flex items-center justify-between bg-white rounded-lg p-2 border-2 transition-all ${
        isFlowComplete ? 'border-green-400 shadow-md' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-1 transition-all ${
            isFlowComplete ? 'bg-green-500' : 'bg-gray-400 animate-pulse'
          }`}>
            {isFlowComplete ? (
              <Check className="w-3 h-3 text-white" />
            ) : (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <div>
            <div className={`font-semibold text-[10px] transition-all ${
              isFlowComplete ? 'text-green-900' : 'text-gray-900'
            }`}>
              {isFlowComplete ? '🎉 Flow Complete!' : '⏳ Processing...'}
            </div>
            <div className="text-[9px] text-gray-600">
              {isFlowComplete ? 'All steps verified' : 'A2A communication in progress'}
            </div>
          </div>
        </div>
        <div className="text-[9px] text-gray-500">
          {selectedStep ? 'Hover icons to see details' : (isFlowComplete ? 'Done' : 'Running')}
        </div>
      </div>

      {/* Transaction Link - Shows only when flow is complete */}
      {isFlowComplete && (
        <div className="mt-2 flex justify-center">
          <a 
            href={invoiceData.blockExplorerUrl || `https://testnet.xrpl.org/transactions/${invoiceData.transactionId || 'TXMI1YD5DO'}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
          >
            🔗 View Transaction on Explorer →
          </a>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-in-out;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
