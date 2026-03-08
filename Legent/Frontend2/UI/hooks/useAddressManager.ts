/**
 * useAddressManager — Ethereum Sepolia version
 * Replaces the Algorand/KMD version of useAddressManager.ts
 *
 * On Ethereum there is no LocalNet KMD.  Role addresses are assigned by the
 * user via MetaMask (multiple accounts) and stored in localStorage.
 * No private keys or mnemonics are handled here — MetaMask owns the keys.
 */
'use client';

import { useState, useEffect } from 'react';
import useEthWallet from './useEthWallet';

export interface RoleAccount {
  role: string;
  nickname: string;
  address: string;
  isActive: boolean;
}

const ROLE_NICKNAMES: Record<string, string> = {
  EXPORTER: '📦 Exporter',
  CARRIER: '🚢 Carrier',
  INVESTOR_SMALL_1: '💰 Investor Small 1',
  INVESTOR_SMALL_2: '💰 Investor Small 2',
  INVESTOR_SMALL_3: '💰 Investor Small 3',
  INVESTOR_SMALL_4: '💰 Investor Small 4',
  INVESTOR_SMALL_5: '💰 Investor Small 5',
  INVESTOR_LARGE_1: '🏛️ Investor Large 1',
  INVESTOR_LARGE_2: '🏛️ Investor Large 2',
  BUYER_1: '🛒 Buyer 1',
  BUYER_2: '🛒 Buyer 2',
  MARKETPLACE_OPERATOR: '🏬 Marketplace Operator',
  MARKETPLACE_ADMIN: '⚙️ Marketplace Admin',
  BANK: '🏦 Bank',
  REGULATOR: '🏛️ Regulator',
};

const STORAGE_PREFIX = 'eth_role_address_';

function loadRoleAddresses(): Record<string, string> {
  const addresses: Record<string, string> = {};
  for (const role of Object.keys(ROLE_NICKNAMES)) {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${role}`);
    if (saved) addresses[role] = saved;
  }
  return addresses;
}

export function useAddressManager() {
  const { activeAddress } = useEthWallet();
  const [roleAddresses, setRoleAddresses] = useState<Record<string, string>>({});
  const [forceUpdateTrigger, setForceUpdateTrigger] = useState(0);

  // Load saved role addresses on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setRoleAddresses(loadRoleAddresses());
  }, []);

  /**
   * Get the currently active role based on localStorage or the connected address.
   */
  const getCurrentRole = (): string | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('eth_active_role');
    if (stored) return stored;
    // Fallback: find which role matches the connected address
    for (const [role, addr] of Object.entries(roleAddresses)) {
      if (addr.toLowerCase() === (activeAddress || '').toLowerCase()) return role;
    }
    return null;
  };

  /**
   * Get the currently active Ethereum address.
   * Prefers the explicitly saved "active" address (for multi-account role testing),
   * falls back to MetaMask's activeAddress.
   */
  const getActiveAddress = (): string | null => {
    if (typeof window === 'undefined') return activeAddress;
    return localStorage.getItem('eth_active_address') || activeAddress;
  };

  /**
   * Assign a specific Ethereum address (from MetaMask) to a role.
   * Call this after switching MetaMask accounts.
   */
  const assignAddressToRole = (role: string, address: string): void => {
    localStorage.setItem(`${STORAGE_PREFIX}${role}`, address);
    setRoleAddresses((prev) => ({ ...prev, [role]: address }));
  };

  /**
   * Switch to a role (set as active role + address in localStorage).
   */
  const switchToRole = async (role: string): Promise<void> => {
    const address = roleAddresses[role];
    if (!address) {
      console.warn(`No address assigned to role: ${role}`);
      return;
    }
    localStorage.setItem('eth_active_role', role);
    localStorage.setItem('eth_active_address', address);
    setRoleAddresses((prev) => ({ ...prev }));
    setForceUpdateTrigger((n) => n + 1);
    window.dispatchEvent(
      new CustomEvent('eth-role-changed', { detail: { role, address } })
    );
    console.log(`✅ Switched to role: ${role} (${address})`);
  };

  /**
   * Assign the currently connected MetaMask address to a role.
   */
  const assignCurrentAddressToRole = (role: string): void => {
    if (!activeAddress) {
      console.warn('No MetaMask address connected');
      return;
    }
    assignAddressToRole(role, activeAddress);
    localStorage.setItem(`eth_role_for_${activeAddress.toLowerCase()}`, role);
    console.log(`Assigned ${activeAddress} → ${role}`);
  };

  /**
   * Return all roles with their assigned addresses and active flag.
   */
  const getAllRoleAccounts = (): RoleAccount[] => {
    const currentAddr = getActiveAddress();
    return Object.keys(ROLE_NICKNAMES).map((role) => ({
      role,
      nickname: ROLE_NICKNAMES[role],
      address: roleAddresses[role] || '',
      isActive:
        !!roleAddresses[role] &&
        roleAddresses[role].toLowerCase() === (currentAddr || '').toLowerCase(),
    }));
  };

  const clearAllRoleAddresses = (): void => {
    for (const role of Object.keys(ROLE_NICKNAMES)) {
      localStorage.removeItem(`${STORAGE_PREFIX}${role}`);
    }
    localStorage.removeItem('eth_active_role');
    localStorage.removeItem('eth_active_address');
    setRoleAddresses({});
  };

  const getAccountsCount = (): number => Object.keys(roleAddresses).length;

  const getMnemonicForRole = (_role: string): null => {
    // Not applicable on Ethereum — MetaMask manages private keys
    return null;
  };

  return {
    roleAddresses,
    // isLocalNet is always false on Sepolia — kept for API compat with components
    isLocalNet: false,
    activeAddress: getActiveAddress(),
    getCurrentRole,
    getAllRoleAccounts,
    switchToRole,
    assignCurrentAddressToRole,
    assignAddressToRole,
    clearAllRoleAddresses,
    getAccountsCount,
    getMnemonicForRole,
    getActiveAddress,
    // forceUpdateTrigger kept for components that depend on it
    forceUpdateTrigger,
  };
}

export default useAddressManager;
