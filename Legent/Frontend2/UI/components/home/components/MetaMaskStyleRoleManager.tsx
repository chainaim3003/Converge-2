'use client';

import React, { useEffect } from 'react';
import { useAddressManager } from '../../hooks/useAddressManager';
import useEthWallet from '../../hooks/useEthWallet';

interface MetaMaskStyleRoleManagerProps {
  currentTab: string;
  selectedBuyer?: 'BUYER_1' | 'BUYER_2';
  selectedInvestor?: string;
  onRoleChange?: (role: string) => void;
}

const TAB_ROLES: Record<string, string[]> = {
  home: [],
  exporter: ['EXPORTER'],
  carrier: ['CARRIER'],
  importer: ['BUYER_1', 'BUYER_2'],
  financier: [
    'INVESTOR_SMALL_1',
    'INVESTOR_SMALL_2',
    'INVESTOR_SMALL_3',
    'INVESTOR_SMALL_4',
    'INVESTOR_SMALL_5',
    'INVESTOR_LARGE_1',
    'INVESTOR_LARGE_2',
  ],
  marketplace: [],
  regulator: ['REGULATOR', 'BANK'],
  admin: [],
  about: [],
};

export function MetaMaskStyleRoleManager({
  currentTab,
  selectedBuyer,
  selectedInvestor,
  onRoleChange,
}: MetaMaskStyleRoleManagerProps) {
  const { activeAddress } = useEthWallet();
  const {
    getCurrentRole,
    getAllRoleAccounts,
    switchToRole,
    assignCurrentAddressToRole,
    getActiveAddress,
  } = useAddressManager();

  const currentRole = getCurrentRole();
  const allAccounts = getAllRoleAccounts();
  const displayAddress = getActiveAddress() || activeAddress;

  const getExpectedRole = (): string | null => {
    if (currentTab === 'importer' && selectedBuyer) return selectedBuyer;
    if (currentTab === 'financier' && selectedInvestor) return selectedInvestor;
    const roles = TAB_ROLES[currentTab] || [];
    return roles.length > 0 ? roles[0] : null;
  };

  const expectedRole = getExpectedRole();
  const hasValidRole =
    !expectedRole || currentRole === expectedRole;

  useEffect(() => {
    if (
      currentTab === 'marketplace' ||
      currentTab === 'admin' ||
      currentTab === 'home' ||
      currentTab === 'about'
    )
      return;

    if (expectedRole && !hasValidRole && activeAddress) {
      const account = allAccounts.find((a) => a.role === expectedRole && a.address);
      if (account?.address) {
        switchToRole(expectedRole);
      } else if (!account) {
        assignCurrentAddressToRole(expectedRole);
      }
    }
  }, [currentTab, selectedBuyer, selectedInvestor]);

  if (
    !activeAddress ||
    currentTab === 'about' ||
    currentTab === 'home' ||
    currentTab === 'admin'
  ) {
    return null;
  }

  const getDisplayName = () => {
    if (currentRole) {
      const account = allAccounts.find((a) => a.role === currentRole);
      const name = account?.nickname || currentRole;
      if (expectedRole && !hasValidRole) {
        const expected = allAccounts.find((a) => a.role === expectedRole);
        return `${name} (⚠️ Switch to ${expected?.nickname || expectedRole})`;
      }
      return name;
    }
    return 'No Role Assigned';
  };

  const getShortAddress = () => {
    if (!displayAddress) return 'No Address';
    return `${displayAddress.substring(0, 8)}...${displayAddress.substring(
      displayAddress.length - 6
    )}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Account display */}
          <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
              {(expectedRole || currentRole || '?').charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{getDisplayName()}</div>
              <div className="text-xs text-gray-500 font-mono">{getShortAddress()}</div>
            </div>
          </div>

          {/* Role validation */}
          <div className="flex items-center space-x-4">
            {expectedRole && currentTab !== 'marketplace' && (
              hasValidRole ? (
                <span className="text-green-600 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Correct role for {currentTab}
                </span>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-amber-600 text-sm">
                    ⚠️ Expected: {expectedRole.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => {
                      if (!expectedRole) return;
                      const account = allAccounts.find((a) => a.role === expectedRole);
                      if (account?.address) {
                        switchToRole(expectedRole);
                      } else {
                        assignCurrentAddressToRole(expectedRole);
                      }
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                  >
                    → Switch Role
                  </button>
                </div>
              )
            )}

            {currentTab === 'marketplace' && (
              <span className="text-blue-600 text-sm">
                ✅ Marketplace — using {currentRole?.replace('_', ' ') || 'current role'}
              </span>
            )}

            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              🌐 Sepolia Testnet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetaMaskStyleRoleManager;
