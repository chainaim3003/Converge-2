'use client';

import React, { useState } from 'react';
import useEthWallet from '../../hooks/useEthWallet';
import { useAddressManager } from '../../hooks/useAddressManager';
import { getEthConfig } from '../../utils/network/getEthConfig';

interface AdaptiveWalletStatusProps {
  requireConnection?: boolean;
  showContractInfo?: boolean;
  showRoleSwitcher?: boolean;
  pageContext?: string;
  children?: React.ReactNode;
}

export function AdaptiveWalletStatus({
  requireConnection = false,
  showContractInfo = true,
  showRoleSwitcher = true,
  pageContext,
  children,
}: AdaptiveWalletStatusProps) {
  const { activeAddress, chainId, connect, disconnect } = useEthWallet();
  const { getCurrentRole, getAllRoleAccounts, switchToRole } = useAddressManager();
  const config = getEthConfig();
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const [showRoleList, setShowRoleList] = useState(false);

  const currentRole = getCurrentRole();
  const allAccounts = getAllRoleAccounts();
  const isCorrectNetwork = chainId === config.chainId;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
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
          <p className="text-sm">Connect your MetaMask wallet (Sepolia) to continue.</p>
        </div>
        <div className="bg-white p-4 rounded border mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Supported Wallets:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• MetaMask (recommended) — <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">metamask.io</a></li>
          </ul>
        </div>
        <button
          onClick={() => connect()}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-green-800 text-sm font-medium">✅ MetaMask Connected</span>
                <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  📡 {config.network.toUpperCase()}
                </div>
                {!isCorrectNetwork && (
                  <span className="text-xs text-red-600">⚠️ Wrong network</span>
                )}
              </div>

              {currentRole && (
                <div className="mb-2 flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Role:</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium border bg-blue-100 text-blue-800 border-blue-200">
                    {allAccounts.find((a) => a.role === currentRole)?.nickname || currentRole}
                  </span>
                  {showRoleSwitcher && (
                    <button
                      onClick={() => setShowRoleList(!showRoleList)}
                      className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-300 rounded"
                    >
                      🔄 Switch
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2">
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
                  className="text-blue-600 text-xs px-1 py-1 border border-blue-300 rounded hover:bg-blue-50"
                >
                  📋
                </button>
              </div>
              {copyMessage && (
                <span className="text-xs text-green-600 font-medium mt-1 block">{copyMessage}</span>
              )}
            </div>

            <div className="ml-4">
              <button
                onClick={disconnect}
                className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-300 rounded hover:bg-red-50"
              >
                🔌 Disconnect
              </button>
            </div>
          </div>

          {showContractInfo && (
            <div className="mt-3 pt-3 border-t border-green-200 text-xs text-green-700 space-y-1">
              <div>🌐 <strong>Network:</strong> Ethereum Sepolia (Chain ID {config.chainId})</div>
              <div>🔗 <strong>RPC:</strong> {config.rpcUrl}</div>
              <div>
                🔍{' '}
                <a
                  href={`https://sepolia.etherscan.io/address/${activeAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View on Etherscan
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Role Switcher (for multi-account testing on Sepolia) */}
      {showRoleSwitcher && showRoleList && activeAddress && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-300 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">🔄 Switch Role:</h4>
          <p className="text-xs text-gray-500 mb-3">
            Assign roles by connecting different MetaMask accounts and using the Admin panel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {allAccounts
              .filter((a) => a.address)
              .map((account) => (
                <button
                  key={account.role}
                  onClick={async () => {
                    await switchToRole(account.role);
                    setShowRoleList(false);
                  }}
                  className={`p-2 rounded border text-left text-sm transition-colors hover:bg-blue-50 ${
                    account.role === currentRole ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="font-medium">{account.nickname}</div>
                  <code className="text-xs font-mono text-gray-500">
                    {account.address.substring(0, 10)}...
                  </code>
                </button>
              ))}
          </div>
          <button
            onClick={() => setShowRoleList(false)}
            className="mt-3 px-4 py-2 bg-gray-600 text-white rounded text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {children}
    </>
  );
}

export default AdaptiveWalletStatus;
