/**
 * escrowV5BoxReader.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * On Algorand, vLEI documents were stored in ARC4-encoded boxes.
 * On Ethereum, vLEI / compliance documents are stored off-chain (IPFS) and
 * referenced in contract events.  This file provides the same public API so
 * callers compile unchanged.
 *
 * When a dedicated vLEI document contract is deployed on Sepolia, replace
 * the IPFS-based stubs below with the appropriate ethers v6 contract calls.
 */

export interface VLEICreationDocuments {
  buyerLEI: string;
  buyerLEI_IPFS: string;
  sellerLEI: string;
  sellerLEI_IPFS: string;
  purchaseOrderVLEI: string;
  purchaseOrderVLEI_IPFS: string;
  timestamp: number;
  tradeId: number;
}

export interface VLEIExecutionDocuments {
  shippingInstructionVLEI: string;
  shippingInstructionVLEI_IPFS: string;
  commercialInvoiceVLEI: string;
  commercialInvoiceVLEI_IPFS: string;
  rwaInstrumentLEI: string;
  rwaInstrumentLEI_IPFS: string;
  shippingInstructionId: string;
  commercialInvoiceId: string;
  timestamp: number;
  tradeId: number;
}

const VLEI_STORAGE_PREFIX = 'eth_vlei_';

class EscrowV5BoxReader {
  /**
   * Retrieve vLEI creation documents for a trade.
   * Looks up localStorage (written by the trade creation flow via vLEIDocumentService).
   */
  async getVLEICreationDocuments(tradeId: number): Promise<VLEICreationDocuments | null> {
    try {
      const key = `${VLEI_STORAGE_PREFIX}creation_${tradeId}`;
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
      if (!raw) return null;
      return { ...JSON.parse(raw), tradeId };
    } catch {
      return null;
    }
  }

  /**
   * Retrieve vLEI execution documents for a trade.
   */
  async getVLEIExecutionDocuments(tradeId: number): Promise<VLEIExecutionDocuments | null> {
    try {
      const key = `${VLEI_STORAGE_PREFIX}execution_${tradeId}`;
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
      if (!raw) return null;
      return { ...JSON.parse(raw), tradeId };
    } catch {
      return null;
    }
  }

  async hasVLEICreationDocuments(tradeId: number): Promise<boolean> {
    const docs = await this.getVLEICreationDocuments(tradeId);
    return docs !== null && (!!docs.buyerLEI || !!docs.sellerLEI || !!docs.purchaseOrderVLEI);
  }

  async hasVLEIExecutionDocuments(tradeId: number): Promise<boolean> {
    const docs = await this.getVLEIExecutionDocuments(tradeId);
    return (
      docs !== null &&
      (!!docs.shippingInstructionVLEI ||
        !!docs.commercialInvoiceVLEI ||
        !!docs.rwaInstrumentLEI)
    );
  }

  /**
   * Store vLEI creation documents (called by trade creation flow).
   */
  storeVLEICreationDocuments(
    tradeId: number,
    docs: Omit<VLEICreationDocuments, 'tradeId'>
  ): void {
    if (typeof localStorage === 'undefined') return;
    const key = `${VLEI_STORAGE_PREFIX}creation_${tradeId}`;
    localStorage.setItem(key, JSON.stringify(docs));
  }

  /**
   * Store vLEI execution documents (called by trade execution flow).
   */
  storeVLEIExecutionDocuments(
    tradeId: number,
    docs: Omit<VLEIExecutionDocuments, 'tradeId'>
  ): void {
    if (typeof localStorage === 'undefined') return;
    const key = `${VLEI_STORAGE_PREFIX}execution_${tradeId}`;
    localStorage.setItem(key, JSON.stringify(docs));
  }
}

export const escrowV5BoxReader = new EscrowV5BoxReader();
