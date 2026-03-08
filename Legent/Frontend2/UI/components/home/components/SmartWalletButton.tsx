'use client';

import React, { useState } from 'react';
import useEthWallet from '../../hooks/useEthWallet';
import { getEthConfig } from '../../utils/network/getEthConfig';

export function SmartWalletButton() {
  const { activeAddress, isConnecting, connect, disconnect, chainId } = useEthWallet();
  const [showModal, setShowModal] = useState(false);
  const config = getEthConfig();
  const isCorrectNetwork = chainId === config.chainId;

  const formatAddress = (address: string) =>
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  if (activeAddress) {
    return (
      <div className="flex items-center space-x-2">
        <div className={`px-3 py-2 rounded-lg text-sm ${isCorrectNetwork ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
          <div className="font-semibold">MetaMask</div>
          <div className="font-mono text-xs">{formatAddress(activeAddress)}</div>
          {!isCorrectNetwork && (
            <div className="text-xs">⚠️ Wrong network</div>
          )}
        </div>
        <button
          onClick={disconnect}
          className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded font-medium transition-colors bg-orange-500 hover:bg-orange-600 text-white"
      >
        🦊 Connect MetaMask
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">🦊 Connect to Sepolia</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
              <strong>Sepolia Testnet:</strong> Make sure MetaMask is installed and
              you have testnet ETH.{' '}
              <a
                href="https://www.alchemy.com/faucets/ethereum-sepolia"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Get ETH →
              </a>
            </div>

            <button
              onClick={async () => {
                await connect();
                setShowModal(false);
              }}
              disabled={isConnecting}
              className="w-full p-3 rounded border border-orange-200 hover:bg-orange-50 text-left transition-colors flex items-center space-x-3"
            >
              <img
                src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/SVG_MetaMask_Icon_Color.svg"
                alt="MetaMask"
                className="w-8 h-8"
              />
              <div>
                <div className="font-medium">MetaMask</div>
                <div className="text-sm text-gray-600">
                  {isConnecting ? 'Connecting…' : 'Connect to Ethereum Sepolia'}
                </div>
              </div>
            </button>

            <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
              <strong>Don&apos;t have MetaMask?</strong>{' '}
              <a
                href="https://metamask.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Install MetaMask
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SmartWalletButton;
