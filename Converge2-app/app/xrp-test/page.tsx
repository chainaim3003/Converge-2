'use client'

/**
 * ETH Wallet Test Page
 * MetaMask + cvUSD balance reader for Ethereum Sepolia.
 * ethers v6: https://docs.ethers.org/v6/
 */

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const ETH_RPC_URL = process.env.NEXT_PUBLIC_ETH_RPC_URL || 'https://rpc.sepolia.org'
const CVUSD_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CVUSD_CONTRACT_ADDRESS || ''
const SEPOLIA_EXPLORER = process.env.NEXT_PUBLIC_SEPOLIA_EXPLORER || 'https://sepolia.etherscan.io'
const SEPOLIA_CHAIN_ID = 11155111

// Minimal ERC-20 ABI — EIP-20: https://eips.ethereum.org/EIPS/eip-20
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 amount) returns (bool)',
]

export default function ETHTestPage() {
  const [status, setStatus] = useState('Not connected')
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [ethBalance, setEthBalance] = useState<string | null>(null)
  const [cvUSDBalance, setCvUSDBalance] = useState<string | null>(null)
  const [loadingBalance, setLoadingBalance] = useState(false)

  const [transferTo, setTransferTo] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [lastTxHash, setLastTxHash] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const connectMetaMask = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setStatus('❌ MetaMask not found — install from https://metamask.io')
      return
    }
    setStatus('🔄 Connecting MetaMask...')
    try {
      // eth_requestAccounts: https://docs.metamask.io/wallet/reference/eth_requestaccounts/
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const accounts: string[] = await provider.send('eth_requestAccounts', [])
      const network = await provider.getNetwork()
      setAccount(accounts[0])
      setChainId(Number(network.chainId))
      setStatus(`✅ Connected: ${accounts[0].slice(0, 10)}... on chain ${network.chainId}`)
    } catch (error) {
      setStatus(`❌ Connection failed: ${error instanceof Error ? error.message : error}`)
    }
  }

  const fetchBalances = async () => {
    if (!account) return
    setLoadingBalance(true)
    setStatus('🔄 Fetching balances...')
    try {
      // Read-only provider — no MetaMask required for reads
      const provider = new ethers.JsonRpcProvider(ETH_RPC_URL)

      // ETH balance
      const ethBal = await provider.getBalance(account)
      setEthBalance(parseFloat(ethers.formatEther(ethBal)).toFixed(6))

      // cvUSD balance
      if (CVUSD_CONTRACT_ADDRESS) {
        const contract = new ethers.Contract(CVUSD_CONTRACT_ADDRESS, ERC20_ABI, provider)
        const balance: bigint = await contract.balanceOf(account)
        const decimals: bigint = await contract.decimals()
        setCvUSDBalance(ethers.formatUnits(balance, decimals))
      } else {
        setCvUSDBalance('Contract address not set')
      }
      setStatus('✅ Balances loaded')
    } catch (error) {
      setStatus(`❌ Balance fetch failed: ${error instanceof Error ? error.message : error}`)
    } finally {
      setLoadingBalance(false)
    }
  }

  const sendCvUSD = async () => {
    if (!account || !transferTo || !transferAmount) {
      setStatus('❌ Fill in destination and amount')
      return
    }
    if (!CVUSD_CONTRACT_ADDRESS) {
      setStatus('❌ NEXT_PUBLIC_CVUSD_CONTRACT_ADDRESS not set')
      return
    }
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      setStatus('❌ MetaMask not found')
      return
    }
    setSending(true)
    setStatus('🔄 Sending cvUSD — approve in MetaMask...')
    try {
      // BrowserProvider requires MetaMask for signing
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CVUSD_CONTRACT_ADDRESS, ERC20_ABI, signer)
      const decimals: bigint = await contract.decimals()
      const parsed = ethers.parseUnits(transferAmount, decimals)
      const tx = await contract.transfer(transferTo, parsed)
      setStatus(`🔄 Transaction submitted: ${tx.hash} — waiting for confirmation...`)
      const receipt = await tx.wait()
      setLastTxHash(receipt.hash)
      setStatus(`✅ Transfer confirmed! Hash: ${receipt.hash}`)
      setTransferTo('')
      setTransferAmount('')
      await fetchBalances()
    } catch (error) {
      setStatus(`❌ Transfer failed: ${error instanceof Error ? error.message : error}`)
    } finally {
      setSending(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setStatus(`📋 ${label} copied!`)
  }

  // Listen for MetaMask account/chain changes
  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).ethereum) return
    const onAccounts = (accounts: string[]) => {
      if (accounts.length === 0) { setAccount(null); setStatus('Disconnected') }
      else setAccount(accounts[0])
    }
    const onChain = (hex: string) => { setChainId(parseInt(hex, 16)) }
    (window as any).ethereum.on('accountsChanged', onAccounts)
    (window as any).ethereum.on('chainChanged', onChain)
    return () => {
      (window as any).ethereum.removeListener('accountsChanged', onAccounts)
      (window as any).ethereum.removeListener('chainChanged', onChain)
    }
  }, [])

  useEffect(() => {
    if (account) fetchBalances()
  }, [account])

  const wrongNetwork = account !== null && chainId !== SEPOLIA_CHAIN_ID

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
            <span className="text-2xl">💎</span>
            <span className="text-blue-700 font-medium">Ethereum Sepolia</span>
            <span className={`w-2 h-2 rounded-full ${account ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ETH Wallet Manager</h1>
          <p className="text-gray-600">MetaMask + cvUSD on Ethereum Sepolia</p>
        </div>

        {/* Status */}
        <div className={`mb-8 p-4 rounded-xl border-2 ${
          status.includes('✅') ? 'bg-green-50 border-green-200' :
          status.includes('❌') ? 'bg-red-50 border-red-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <p className="font-medium">{status}</p>
        </div>

        {/* Wrong network warning */}
        {wrongNetwork && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
            <p className="text-yellow-800 font-semibold">⚠️ Wrong network (chain {chainId}). Switch MetaMask to Ethereum Sepolia (chain {SEPOLIA_CHAIN_ID}).</p>
          </div>
        )}

        {/* Connect Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">MetaMask Connection</h2>
          {!account ? (
            <button
              onClick={connectMetaMask}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              🦊 Connect MetaMask
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-gray-500">Connected Address</p>
                  <button onClick={() => copyToClipboard(account, 'Address')} className="text-xs text-blue-600">📋 Copy</button>
                </div>
                <p className="text-sm font-mono break-all">{account}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Network</p>
                <p className="text-sm font-medium text-green-700">Ethereum Sepolia (Chain {chainId})</p>
              </div>
              <a
                href={`${SEPOLIA_EXPLORER}/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 rounded-lg text-sm"
              >
                🔍 View on Sepolia Etherscan
              </a>
            </div>
          )}
        </div>

        {/* Balances */}
        {account && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4">ETH Balance</h3>
              <div className="p-4 rounded-lg bg-blue-50">
                <p className="text-2xl font-bold">{loadingBalance ? '...' : (ethBalance ?? '—')} ETH</p>
              </div>
              <button
                onClick={fetchBalances}
                disabled={loadingBalance}
                className="w-full mt-3 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm"
              >
                🔄 Refresh
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4">cvUSD Balance</h3>
              <div className="p-4 rounded-lg bg-green-50">
                <p className="text-2xl font-bold">{loadingBalance ? '...' : (cvUSDBalance ?? '—')} cvUSD</p>
              </div>
              <a
                href={`${SEPOLIA_EXPLORER}/address/${CVUSD_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center mt-3 bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded-lg text-sm"
              >
                🔍 Contract on Etherscan
              </a>
            </div>
          </div>
        )}

        {/* Send cvUSD */}
        {account && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">📤 Send cvUSD</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Destination Address (0x...)</label>
                <input
                  type="text"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 border rounded-lg font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount (cvUSD)</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>
            </div>
            <button
              onClick={sendCvUSD}
              disabled={sending || !transferTo || !transferAmount}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-medium text-lg disabled:opacity-50"
            >
              {sending ? '🔄 Sending — approve in MetaMask...' : '🚀 Send cvUSD'}
            </button>
          </div>
        )}

        {/* Last Transaction */}
        {lastTxHash && (
          <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-8">
            <h3 className="text-lg font-bold text-green-800 mb-4">✅ Last Transaction</h3>
            <p className="text-xs font-mono break-all text-slate-700 mb-3">{lastTxHash}</p>
            <a
              href={`${SEPOLIA_EXPLORER}/tx/${lastTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
              🔍 View on Sepolia Etherscan →
            </a>
          </div>
        )}

        {/* Contract Info */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm">
          <h3 className="text-white font-bold mb-4">📋 Deployed Contract:</h3>
          <pre className="overflow-x-auto whitespace-pre-wrap break-all">
{`# cvUSD (Converge Stablecoin) - Ethereum Sepolia
NEXT_PUBLIC_CVUSD_CONTRACT_ADDRESS=${CVUSD_CONTRACT_ADDRESS || '<not set>'}

# Etherscan
${SEPOLIA_EXPLORER}/address/${CVUSD_CONTRACT_ADDRESS || '<not set>'}`}
          </pre>
        </div>

      </div>
    </div>
  )
}
