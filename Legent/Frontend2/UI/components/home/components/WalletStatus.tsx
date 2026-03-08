'use client';

import React, { useState } from 'react';
import useEthWallet from '../../hooks/useEthWallet';
import { getEthConfig } from '../../utils/network/getEthConfig';

interface WalletStatusProps {
  requireConnection?: boolean;
  children: React.ReactNode;
}

export function WalletStatus({ requireConnection = false, children }: WalletStatusProps) {
  const { activeAddress, chainId, connect } = useEthWallet();
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const config = getEthConfig();

  const isCorrectNetwork = chainId === config.chainId;

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopyMessage('✅ Copied!');
      setTimeout(() => setCopyMessage(''), 2000);
    } catch {
      setCopyMessage('❌ Failed');
      setTimeout(() => setCopyMessage(''), 2000);
    }
  };

  const formatAddress = (address: string) =>
    showFullAddress
      ? address
      : `${address.substring(0, 12)}...${address.substring(address.length - 8)}`;

  if (requireConnection && !activeAddress) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 text-center">
        <div className="text-yellow-800 mb-4">
          <div className="text-lg font-semibold mb-2">🔐 Wallet Connection Required</div>
          <p className="text-sm">
            Connect your MetaMask wallet (Sepolia testnet) to create real blockchain transactions.
          </p>
        </div>
        <div className="bg-white p-4 rounded border mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Setup:</h4>
          <ul className="text-sm text-gray-700 space-y-1 text-left">
            <li>• Install MetaMask: <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">metamask.io</a></li>
            <li>• Add Sepolia via <a href="https://chainlist.org/chain/11155111" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ChainList</a></li>
            <li>• Get testnet ETH from <a href="https://www.alchemy.com/faucets/ethereum-sepolia" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Alchemy Faucet</a></li>
          </ul>
        </div>
        <button
          onClick={() => connect()}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
        >
          🦊 Connect MetaMask
        </button>
        {children}
      </div>
    );
  }

  return (
    <>
      {activeAddress && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-green-800 text-sm mb-1">
                ✅ <strong>MetaMask Connected</strong>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <code className="bg-white px-2 py-1 rounded border text-xs font-mono text-gray-800 break-all">
                  {formatAddress(activeAddress)}
                </code>
                <button
                  onClick={() => setShowFullAddress(!showFullAddress)}
                  className="text-blue-600 hover:text-blue-800 text-xs underline"
                >
                  {showFullAddress ? 'Short' : 'Full'}
                </button>
                <button
                  onClick={() => copyToClipboard(activeAddress)}
                  className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-300 rounded hover:bg-blue-50"
                >
                  📋 Copy
                </button>
                {copyMessage && (
                  <span className="text-xs text-green-600 font-medium">{copyMessage}</span>
                )}
              </div>
              {!isCorrectNetwork && chainId !== null && (
                <div className="text-orange-600 text-xs">
                  ⚠️ Wrong network (Chain ID: {chainId}). Expected Sepolia ({config.chainId}).
                </div>
              )}
            </div>
            <div className="ml-4 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
              📡 {config.network.toUpperCase()}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-green-200 text-xs text-green-700 space-y-1">
            <div>🔗 <strong>RPC:</strong> {config.rpcUrl}</div>
            <div>🔍 <strong>Explorer:</strong>{' '}
              <a
                href={`https://sepolia.etherscan.io/address/${activeAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Sepolia Etherscan
              </a>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}

export default WalletStatus;
