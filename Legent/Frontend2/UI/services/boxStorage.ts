/**
 * boxStorage.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * The Algorand algosdk dependency has been removed.
 * This service now uses localStorage-backed storage (same behaviour as
 * the previous implementation, which already used localStorage as the
 * primary store with on-chain box storage as a future upgrade path).
 *
 * On Ethereum, "box storage" is replaced by:
 *   - IPFS for large/persistent data
 *   - Contract events for on-chain audit trail
 *   - localStorage for in-session state (development / testing)
 *
 * When ready for production, replace the localStorage calls with IPFS pins
 * (see ipfsService.ts) and store the resulting CID in your Ethereum contract.
 */

import { BillOfLading } from '../interfaces/types';

// Extended type for box storage with ownership tracking
export interface ExtendedBillOfLading extends BillOfLading {
  currentHolder?: string;
  createdByCarrier?: {
    carrierAddress: string;
    assignedToExporter: string;
    creationTxHash: string; // renamed from creationTxId
    timestamp: string;
  };
  status?: 'created' | 'transferred' | 'pending_transfer';
}

export class BoxStorageService {
  private storageAccount: string = '';

  /** Set the storage account (carrier's Ethereum address). */
  setStorageAccount(address: string): void {
    this.storageAccount = address;
    console.log(`📦 Storage account set to: ${address}`);
  }

  /** Store BL data in localStorage (simulates on-chain box storage). */
  async storeBL(
    bl: ExtendedBillOfLading,
    _senderAddress: string,
    _signTransactions?: unknown
  ): Promise<string> {
    const tokenId = bl.rwaTokenization?.assetId;
    if (!tokenId) {
      throw new Error('BL must have an asset / token ID');
    }

    const boxName = `BL_${tokenId}`;
    const storageKey = `eth_box_${boxName}`;
    const blData = JSON.stringify(bl);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, blData);

      const boxIndex = this.getBoxIndex();
      if (!boxIndex.includes(boxName)) {
        boxIndex.push(boxName);
        localStorage.setItem('eth_box_index', JSON.stringify(boxIndex));
      }
    }

    console.log(`✅ BL data stored in box ${boxName} (localStorage)`);
    return `local-${boxName}`;
  }

  /** Read BL data from localStorage. */
  async readBL(tokenId: number): Promise<ExtendedBillOfLading | null> {
    try {
      const storageKey = `eth_box_BL_${tokenId}`;
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
      if (!raw) return null;
      return JSON.parse(raw) as ExtendedBillOfLading;
    } catch {
      return null;
    }
  }

  /** List all stored BLs. */
  async listAllBLs(): Promise<ExtendedBillOfLading[]> {
    const boxIndex = this.getBoxIndex();
    const bls: ExtendedBillOfLading[] = [];

    for (const boxName of boxIndex) {
      if (!boxName.startsWith('BL_')) continue;
      const tokenId = parseInt(boxName.replace('BL_', ''), 10);
      const bl = await this.readBL(tokenId);
      if (bl) bls.push(bl);
    }

    return bls;
  }

  /** Update BL status and current holder. */
  async updateBLStatus(
    transportDocumentReference: string,
    status: 'created' | 'transferred' | 'pending_transfer',
    newHolder?: string
  ): Promise<void> {
    const allBLs = await this.listAllBLs();
    const bl = allBLs.find(
      (b) => b.transportDocumentReference === transportDocumentReference
    );
    if (!bl) throw new Error(`BL not found: ${transportDocumentReference}`);

    bl.status = status;
    if (newHolder) bl.currentHolder = newHolder;

    const tokenId = bl.rwaTokenization?.assetId;
    if (!tokenId) throw new Error('BL does not have a token ID');

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`eth_box_BL_${tokenId}`, JSON.stringify(bl));
    }
  }

  /** Clear all stored boxes (for testing). */
  async clearAllBoxes(): Promise<void> {
    if (typeof localStorage === 'undefined') return;
    const boxIndex = this.getBoxIndex();
    for (const boxName of boxIndex) {
      localStorage.removeItem(`eth_box_${boxName}`);
    }
    localStorage.removeItem('eth_box_index');
    console.log('🗑️ Cleared all ETH box entries from localStorage');
  }

  /** Get box statistics. */
  async getBoxStats(): Promise<{ totalBoxes: number; totalSize: number; estimatedCost: number }> {
    const boxIndex = this.getBoxIndex();
    let totalSize = 0;
    for (const boxName of boxIndex) {
      const raw = typeof localStorage !== 'undefined'
        ? localStorage.getItem(`eth_box_${boxName}`)
        : null;
      if (raw) totalSize += raw.length;
    }
    return { totalBoxes: boxIndex.length, totalSize, estimatedCost: 0 };
  }

  private getBoxIndex(): string[] {
    try {
      const raw = typeof localStorage !== 'undefined'
        ? localStorage.getItem('eth_box_index')
        : null;
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const boxStorageService = new BoxStorageService();
