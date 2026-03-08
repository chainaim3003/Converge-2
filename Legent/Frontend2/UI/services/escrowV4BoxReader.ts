/**
 * escrowV4BoxReader.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * On Algorand, trade data was stored in ARC4-encoded "boxes" read via algosdk.
 * On Ethereum, trade data is stored in contract storage and emitted as events,
 * read via ethers v6 contract calls.
 *
 * This file re-exports types from escrowEthService and provides an
 * EscrowV4BoxReader class whose API matches the original so callers compile.
 *
 * ethers v6 docs: https://docs.ethers.org/v6/
 */

export type {
  EscrowTrade,
  TradeMetadata,
} from './escrowEthService';

export { TradeState } from './escrowEthService';

import escrowEthService, { EscrowTrade, TradeState } from './escrowEthService';

// Legacy TradeMetadata shape (previously decoded from Algorand boxes)
export interface TradeMetadata {
  productType: string;
  description: string;
  ipfsHash: string;
  leiId: string;
  leiName: string;
  instrumentNumber: string;
}

export class EscrowV4BoxReader {
  /** Return number of trades created so far (next trade ID - 1). */
  async getNextTradeId(): Promise<number> {
    try {
      return await escrowEthService.getNextTradeId();
    } catch {
      return 1;
    }
  }

  /** Read a single trade from the escrow contract. */
  async getTrade(tradeId: number): Promise<EscrowTrade | null> {
    try {
      return await escrowEthService.getTrade(tradeId);
    } catch {
      return null;
    }
  }

  /**
   * Read trade metadata.
   * On Ethereum, metadata lives in the trade struct itself (productType,
   * description, ipfsHash).  vLEI / LEI fields default to empty strings
   * until a dedicated on-chain document storage is deployed.
   */
  async getTradeMetadata(tradeId: number): Promise<TradeMetadata | null> {
    try {
      const trade = await escrowEthService.getTrade(tradeId);
      if (!trade) return null;
      return {
        productType: trade.productType,
        description: trade.description,
        ipfsHash: trade.ipfsHash,
        leiId: '',
        leiName: '',
        instrumentNumber: '',
      };
    } catch {
      return null;
    }
  }

  /** Get all trades with metadata. */
  async getAllTrades(): Promise<Array<{ trade: EscrowTrade; metadata: TradeMetadata }>> {
    try {
      const trades = await escrowEthService.getAllTrades();
      return trades.map((trade) => ({
        trade,
        metadata: {
          productType: trade.productType,
          description: trade.description,
          ipfsHash: trade.ipfsHash,
          leiId: '',
          leiName: '',
          instrumentNumber: '',
        },
      }));
    } catch {
      return [];
    }
  }

  async getTradesByState(state: number) {
    const all = await this.getAllTrades();
    return all.filter((t) => t.trade.state === state);
  }

  async getTradesByBuyer(buyerAddress: string) {
    const all = await this.getAllTrades();
    return all.filter(
      (t) => t.trade.buyer.toLowerCase() === buyerAddress.toLowerCase()
    );
  }

  async getTradesBySeller(sellerAddress: string) {
    const all = await this.getAllTrades();
    return all.filter(
      (t) => t.trade.seller.toLowerCase() === sellerAddress.toLowerCase()
    );
  }
}

export const escrowV4BoxReader = new EscrowV4BoxReader();
