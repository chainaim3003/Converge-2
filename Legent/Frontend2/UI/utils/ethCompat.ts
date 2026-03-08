/**
 * Ethereum Compatibility Utilities
 * Replaces utils/algosdkCompat.ts
 *
 * Helper functions for working with ethers v6 receipt / transaction data.
 * ethers v6 docs: https://docs.ethers.org/v6/
 */
import { ethers } from 'ethers';

/**
 * Normalise a transaction hash — ensures it starts with 0x.
 */
export function normalizeTxHash(hash: string): string {
  return hash.startsWith('0x') ? hash : `0x${hash}`;
}

/**
 * Extract the transaction hash from a receipt or raw tx response.
 */
export function getTxHash(response: ethers.TransactionResponse | ethers.TransactionReceipt | any): string {
  return (response as any).hash || (response as any).txHash || '';
}

/**
 * Get the confirmed block number from a receipt.
 */
export function getConfirmedBlock(receipt: ethers.TransactionReceipt | any): number {
  return (receipt as any).blockNumber ?? 0;
}

/**
 * Safely convert bigint to number (use only for values that safely fit).
 */
export function bigIntToNumber(value: bigint | number): number {
  return typeof value === 'bigint' ? Number(value) : value;
}

/**
 * Parse an event from transaction receipt logs.
 * Returns null if the event is not found.
 */
export function parseEventFromReceipt(
  receipt: ethers.TransactionReceipt,
  abi: string[],
  eventName: string
): ethers.LogDescription | null {
  const iface = new ethers.Interface(abi);
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog({ topics: [...log.topics], data: log.data });
      if (parsed && parsed.name === eventName) {
        return parsed;
      }
    } catch {
      // skip logs from other contracts
    }
  }
  return null;
}

/**
 * Format an Ethereum address for display (truncated).
 */
export function formatAddress(address: string, chars = 6): string {
  if (!address || address.length < chars * 2) return address;
  return `${address.substring(0, chars)}...${address.substring(address.length - 4)}`;
}
