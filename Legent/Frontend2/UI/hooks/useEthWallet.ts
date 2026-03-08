/**
 * useEthWallet — MetaMask React Hook
 * Replaces @txnlab/use-wallet-react for the Ethereum Sepolia migration.
 *
 * Provides wallet state and MetaMask connection helpers.
 * MetaMask docs: https://docs.metamask.io/wallet/get-started/
 * ethers v6 docs: https://docs.ethers.org/v6/
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getEthConfig, getExplorerUrl } from '../utils/network/getEthConfig';

export interface EthWalletState {
  activeAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  getSigner: () => Promise<ethers.Signer>;
  switchToSepolia: () => Promise<void>;
}

const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';

export function useEthWallet(): EthWalletState {
  const [activeAddress, setActiveAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Restore connection from last session
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const restore = async () => {
      try {
        const accounts: string[] = await window.ethereum!.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          setActiveAddress(accounts[0]);
        }
        const chainHex: string = await window.ethereum!.request({
          method: 'eth_chainId',
        });
        setChainId(parseInt(chainHex, 16));
      } catch {
        // no prior session
      }
    };

    restore();

    const handleAccountsChanged = (accounts: string[]) => {
      setActiveAddress(accounts.length > 0 ? accounts[0] : null);
    };

    const handleChainChanged = (chainHex: string) => {
      setChainId(parseInt(chainHex, 16));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) throw new Error('MetaMask not found');
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID_HEX,
              chainName: 'Ethereum Sepolia',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask not found. Install at https://metamask.io');
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      // Switch to Sepolia first
      await switchToSepolia();

      // Request accounts
      const accounts: string[] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts returned by MetaMask');
      }

      setActiveAddress(accounts[0]);

      const chainHex: string = await window.ethereum.request({
        method: 'eth_chainId',
      });
      setChainId(parseInt(chainHex, 16));

      console.log('✅ MetaMask connected:', accounts[0]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Wallet connection failed';
      setError(msg);
      console.error('❌ MetaMask connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [switchToSepolia]);

  const disconnect = useCallback(() => {
    // MetaMask does not support programmatic disconnect — clear local state only.
    setActiveAddress(null);
    setChainId(null);
    console.log('Wallet disconnected (local state cleared)');
  }, []);

  const getSigner = useCallback(async (): Promise<ethers.Signer> => {
    if (!window.ethereum) throw new Error('MetaMask not found');
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
  }, []);

  return {
    activeAddress,
    isConnected: !!activeAddress,
    isConnecting,
    chainId,
    error,
    connect,
    disconnect,
    getSigner,
    switchToSepolia,
  };
}

export default useEthWallet;
