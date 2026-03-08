/**
 * Ethereum contract addresses configuration
 * Replaces Algorand App IDs with deployed Ethereum contract addresses.
 * All addresses come from environment variables set after deployment.
 */
import { getEthConfig } from '../utils/network/getEthConfig';

export interface EscrowContractConfig {
  address: string;
  network: string;
}

export interface RegistryContractConfig {
  address: string;
  network: string;
}

/**
 * Get the active escrow contract config.
 * Address comes from NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS env var.
 */
export function getActiveEscrowContract(): EscrowContractConfig {
  const config = getEthConfig();
  return {
    address: config.escrowContractAddress,
    network: config.network,
  };
}

/**
 * Get the trade registry contract config.
 * Address comes from NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS env var.
 */
export function getRegistryContract(): RegistryContractConfig {
  const config = getEthConfig();
  return {
    address: config.registryContractAddress,
    network: config.network,
  };
}

/**
 * Get cvUSD ERC-20 contract address.
 */
export function getCvUSDAddress(): string {
  return getEthConfig().cvUsdAddress;
}
