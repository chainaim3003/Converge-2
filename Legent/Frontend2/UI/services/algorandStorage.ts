/**
 * algorandStorage.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * Compatibility shim.  Algorand box / IPFS storage is replaced by:
 *   - IPFS via ipfsService.ts (unchanged — IPFS is chain-agnostic)
 *   - On-chain data stored in Ethereum contract events / IPFS hashes
 *
 * The AlgorandStorageService class is re-exported here so existing callers
 * continue to compile.  Implementations delegate to ipfsService / local
 * in-memory fallbacks.
 */

import { getExplorerUrl } from '../utils/network/getEthConfig';

// ─── Result types (kept for API compatibility) ────────────────────────────

export interface StorageResult {
  storageType: 'ipfs' | 'ethereum' | 'local';
  primaryHash: string;
  backupHash?: string;
  ipfsHash?: string;
  metadataHash: string;
  storageUrl: string;
  estimatedCost: number;
}

export interface BoxStorageResult {
  boxId: string;
  boxName: string;
  appId: number;
  transactionId: string;
  explorerUrl: string;
  storageHash: string;
  dataSize: number;
}

// ─── AlgorandStorageService shim ─────────────────────────────────────────────

export class AlgorandStorageService {
  /**
   * Store data — on Ethereum this means computing a content hash and
   * optionally pinning to IPFS.  Returns a StorageResult compatible with
   * the existing interface.
   */
  async storeData(
    data: Record<string, unknown>,
    label = 'data'
  ): Promise<StorageResult> {
    try {
      const { default: ipfsService } = await import('./ipfsService');
      const json = JSON.stringify(data);
      const ipfsHash = await ipfsService.uploadJSON(json);
      return {
        storageType: 'ipfs',
        primaryHash: ipfsHash,
        ipfsHash,
        metadataHash: ipfsHash,
        storageUrl: `https://ipfs.io/ipfs/${ipfsHash}`,
        estimatedCost: 0,
      };
    } catch {
      // Fallback: localStorage-backed hash
      const json = JSON.stringify(data);
      const encoder = new TextEncoder();
      const bytes = encoder.encode(json);
      const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
      const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const storageKey = `eth_storage_${label}_${hashHex.slice(0, 16)}`;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(storageKey, json);
      }
      return {
        storageType: 'local',
        primaryHash: hashHex,
        metadataHash: hashHex,
        storageUrl: `local://${storageKey}`,
        estimatedCost: 0,
      };
    }
  }

  /**
   * Read data previously stored via storeData.
   */
  async readData(storageUrl: string): Promise<Record<string, unknown> | null> {
    try {
      if (storageUrl.startsWith('local://')) {
        const key = storageUrl.replace('local://', '');
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
        return raw ? JSON.parse(raw) : null;
      }
      if (storageUrl.startsWith('https://ipfs.io/ipfs/')) {
        const res = await fetch(storageUrl);
        return res.json();
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Legacy box-storage wrapper.  Returns a BoxStorageResult so callers
   * that expected Algorand box IDs still compile.
   */
  async storeInBox(
    data: Record<string, unknown>,
    label = 'box'
  ): Promise<BoxStorageResult> {
    const result = await this.storeData(data, label);
    return {
      boxId: result.primaryHash.slice(0, 16),
      boxName: label,
      appId: 0, // No Algorand app on Ethereum
      transactionId: result.primaryHash,
      explorerUrl: result.storageType === 'ipfs'
        ? result.storageUrl
        : '',
      storageHash: result.primaryHash,
      dataSize: JSON.stringify(data).length,
    };
  }
}

export const algorandStorageService = new AlgorandStorageService();
export default algorandStorageService;
