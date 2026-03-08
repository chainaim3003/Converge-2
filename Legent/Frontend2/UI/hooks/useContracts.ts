/**
 * useContracts — Ethereum Sepolia
 * Replaces useContracts.ts (AlgoKit / AlgorandClient version)
 *
 * Manages connection to deployed Ethereum contracts on Sepolia.
 * ethers v6 docs: https://docs.ethers.org/v6/
 */
'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getEthConfig } from '../utils/network/getEthConfig';
import { TRADE_ESCROW_ABI } from '../services/escrowEthService';
import { TRADE_REGISTRY_ABI } from '../services/eblEthService';
import { ERC20_ABI } from '../services/ethService';

export interface EthContracts {
  provider: ethers.JsonRpcProvider;
  escrow: ethers.Contract | null;
  registry: ethers.Contract | null;
  cvUsd: ethers.Contract | null;
  config: ReturnType<typeof getEthConfig>;
}

export interface UseContractsResult {
  contracts: EthContracts | null;
  loading: boolean;
  error: string | null;
  reconnect: () => Promise<void>;
}

export const useContracts = (): UseContractsResult => {
  const [contracts, setContracts] = useState<EthContracts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const init = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = getEthConfig();
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);

      // Verify RPC connectivity
      await provider.getNetwork();

      const escrow = config.escrowContractAddress
        ? new ethers.Contract(config.escrowContractAddress, TRADE_ESCROW_ABI, provider)
        : null;

      const registry = config.registryContractAddress
        ? new ethers.Contract(config.registryContractAddress, TRADE_REGISTRY_ABI, provider)
        : null;

      const cvUsd = config.cvUsdAddress
        ? new ethers.Contract(config.cvUsdAddress, ERC20_ABI, provider)
        : null;

      if (!config.escrowContractAddress || !config.registryContractAddress) {
        console.warn(
          '⚠️ Some contract addresses are not configured. ' +
            'Set NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS and NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS in .env.local'
        );
      }

      setContracts({ provider, escrow, registry, cvUsd, config });
      console.log(`✅ Connected to Sepolia contracts`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Contract connection failed';
      setError(msg);
      console.error('Failed to initialise contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return { contracts, loading, error, reconnect: init };
};

export const useEscrow = () => {
  const { contracts } = useContracts();
  return contracts?.escrow ?? null;
};

export const useRegistry = () => {
  const { contracts } = useContracts();
  return contracts?.registry ?? null;
};
