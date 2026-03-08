/**
 * getAlgoClientConfigs.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * Algorand node configuration (VITE_ALGOD_*, VITE_INDEXER_*, VITE_KMD_*)
 * is replaced by Ethereum / Sepolia configuration in:
 *   utils/network/getEthConfig.ts
 *
 * This file re-exports getEthConfig() under the old name so any remaining
 * callers compile without changes.
 *
 * Legacy callers that destructure { server, port, token, network } from
 * getAlgodConfigFromViteEnvironment() will receive Ethereum equivalents.
 */
export {
  getEthConfig as getAlgodConfigFromViteEnvironment,
  getEthConfig,
  getExplorerUrl,
} from './getEthConfig';

/** Legacy AlgodConfig shape — mapped to Ethereum equivalents */
export interface AlgodConfig {
  server: string;   // RPC URL
  port: number;     // always 443 on Sepolia
  token: string;    // API key / empty for public RPC
  network: string;  // "sepolia"
}

/**
 * Returns Ethereum Sepolia config in the shape that old Algod callers expect.
 */
export function getAlgodConfig(): AlgodConfig {
  const { rpcUrl, network } = (() => {
    const rpcUrl =
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ETH_RPC_URL) ||
      'https://rpc.sepolia.org';
    const network =
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ETH_NETWORK) ||
      'sepolia';
    return { rpcUrl, network };
  })();

  return {
    server: rpcUrl,
    port: 443,
    token: '',
    network,
  };
}
