/**
 * Blockchain Verification Service — Ethereum Sepolia
 * Replaces blockchainVerification.ts (algosdk version)
 *
 * ethers v6 docs: https://docs.ethers.org/v6/
 */
import { ethers } from 'ethers';
import ethService from './ethService';
import { getExplorerUrl, getEthConfig } from '../utils/network/getEthConfig';

export class BlockchainVerificationService {
  /**
   * Validate an Ethereum address (checksummed or not).
   * Docs: https://docs.ethers.org/v6/api/utils/#isAddress
   */
  static validateAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  /**
   * Validate a transaction hash (0x + 64 hex chars).
   */
  static validateTransactionHash(txHash: string): boolean {
    return /^0x[0-9a-fA-F]{64}$/.test(txHash);
  }

  /**
   * Test connectivity to the configured Sepolia RPC node.
   */
  static async testBlockchainConnection(): Promise<{
    connected: boolean;
    network: string;
    rpcUrl: string;
    blockNumber?: number;
    error?: string;
  }> {
    const config = getEthConfig();
    try {
      const result = await ethService.testConnection();
      return {
        connected: result.connected,
        network: config.network,
        rpcUrl: config.rpcUrl,
        blockNumber: result.blockNumber,
        error: result.error,
      };
    } catch (error) {
      return {
        connected: false,
        network: config.network,
        rpcUrl: config.rpcUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify an account exists on-chain by checking its ETH balance.
   */
  static async verifyAccountExists(address: string): Promise<{
    exists: boolean;
    ethBalance?: string;
    error?: string;
  }> {
    if (!this.validateAddress(address)) {
      return { exists: false, error: 'Invalid Ethereum address format' };
    }
    try {
      const ethBalance = await ethService.getEthBalance(address);
      return { exists: true, ethBalance };
    } catch (error) {
      return {
        exists: false,
        error: error instanceof Error ? error.message : 'Account verification failed',
      };
    }
  }

  /**
   * Verify a transaction exists on-chain.
   */
  static async verifyTransactionExists(txHash: string): Promise<{
    exists: boolean;
    confirmedBlock?: number;
    status?: number;
    error?: string;
  }> {
    if (!this.validateTransactionHash(txHash)) {
      return { exists: false, error: 'Invalid transaction hash format' };
    }
    try {
      const receipt = await ethService.getTransactionInfo(txHash);
      if (!receipt) {
        return { exists: false, error: 'Transaction not found or not yet confirmed' };
      }
      return {
        exists: true,
        confirmedBlock: receipt.blockNumber,
        status: receipt.status ?? undefined,
      };
    } catch (error) {
      return {
        exists: false,
        error: error instanceof Error ? error.message : 'Transaction verification failed',
      };
    }
  }

  /**
   * Get Sepolia Etherscan URL for a transaction.
   */
  static getExplorerUrl(txHash: string): string | null {
    if (!this.validateTransactionHash(txHash)) return null;
    return getExplorerUrl(txHash);
  }
}

export default BlockchainVerificationService;
