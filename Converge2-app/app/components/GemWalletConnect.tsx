'use client'

/**
 * MetaMask Connect Component
 * Replaces GemWalletConnect.tsx (XRP) with MetaMask (Ethereum Sepolia).
 * ethers v6: https://docs.ethers.org/v6/
 * MetaMask docs: https://docs.metamask.io/wallet/
 */

import { useEthWallet } from '../lib/xrpl-context'

export default function MetaMaskConnect() {
  const { account, chainId, isConnected, isConnecting, connect, disconnect, lastError } = useEthWallet()

  const SEPOLIA_CHAIN_ID = 11155111
  const wrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🦊</span> MetaMask Connection
      </h2>

      {/* Status */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'MetaMask Connected' : 'MetaMask Not Connected'}
          </span>
        </div>
        {isConnected && (
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${wrongNetwork ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
            <span className="text-sm text-gray-600">
              {wrongNetwork ? `Wrong network (chain ${chainId}) — switch to Sepolia` : 'Ethereum Sepolia'}
            </span>
          </div>
        )}
      </div>

      {/* Error */}
      {lastError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{lastError}</p>
        </div>
      )}

      {/* Wallet Info */}
      {isConnected && account && (
        <div className="mb-4 space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Connected Address</p>
            <p className="text-sm font-mono text-blue-700 break-all">{account}</p>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Network</p>
            <p className="text-sm font-medium text-green-700">Ethereum Sepolia (Chain {chainId})</p>
          </div>

          <a
            href={`https://sepolia.etherscan.io/address/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm transition-colors"
          >
            View on Sepolia Etherscan →
          </a>
        </div>
      )}

      {/* Buttons */}
      {!isConnected ? (
        <button
          onClick={connect}
          disabled={isConnecting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </button>
      ) : (
        <button
          onClick={disconnect}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Disconnect
        </button>
      )}

      {/* Install Link */}
      {typeof window !== 'undefined' && !(window as any).ethereum && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Don&apos;t have MetaMask?{' '}
            <a
              href="https://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              Install it here →
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
