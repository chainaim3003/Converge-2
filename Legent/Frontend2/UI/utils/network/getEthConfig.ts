/**
 * Ethereum Sepolia Network Configuration
 * Replaces getAlgoClientConfigs.ts
 * All env vars use NEXT_PUBLIC_ prefix (Next.js client-side)
 */

export interface EthClientConfig {
  rpcUrl: string;
  chainId: number;
  network: string;
  cvUsdAddress: string;
  escrowContractAddress: string;
  registryContractAddress: string;
}

export function getEthConfig(): EthClientConfig {
  const rpcUrl =
    process.env.NEXT_PUBLIC_ETH_RPC_URL || 'https://rpc.sepolia.org';
  const chainId = parseInt(
    process.env.NEXT_PUBLIC_CHAIN_ID || '11155111',
    10
  );
  const network = process.env.NEXT_PUBLIC_ETH_NETWORK || 'sepolia';
  const cvUsdAddress =
    process.env.NEXT_PUBLIC_CVUSD_CONTRACT_ADDRESS || '';
  const escrowContractAddress =
    process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || '';
  const registryContractAddress =
    process.env.NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS || '';

  return {
    rpcUrl,
    chainId,
    network,
    cvUsdAddress,
    escrowContractAddress,
    registryContractAddress,
  };
}

export function isSepolia(): boolean {
  return getEthConfig().chainId === 11155111;
}

export function getExplorerUrl(txHash: string): string {
  const { network } = getEthConfig();
  if (network === 'mainnet') {
    return `https://etherscan.io/tx/${txHash}`;
  }
  return `https://sepolia.etherscan.io/tx/${txHash}`;
}

export function getAddressExplorerUrl(address: string): string {
  const { network } = getEthConfig();
  if (network === 'mainnet') {
    return `https://etherscan.io/address/${address}`;
  }
  return `https://sepolia.etherscan.io/address/${address}`;
}
