/**
 * Marketplace Service — Ethereum Sepolia
 * Replaces MarketplaceService.ts (AlgoKit / AlgorandClient version)
 *
 * All marketplace operations: create listing, fund escrow, execute trade.
 * Uses ethers v6 + TradeEscrow.sol + TradeRegistry.sol deployed on Sepolia.
 */
import { ethers } from 'ethers';
import { getErrorMessage } from '../utils/errorHandling';
import escrowEthService, {
  EscrowTrade,
  TradeState,
  CreateTradeParams,
  TradeResult,
} from './escrowEthService';
import eblEthService, { EBLInstrument } from './eblEthService';
import { getEthConfig } from '../utils/network/getEthConfig';
import { ERC20_ABI } from './ethService';

// Re-export types needed by components
export type {
  EscrowTrade as InstrumentListing,
  TradeResult,
};

export { TradeState };

export class MarketplaceService {
  /**
   * Create a new trade listing (seller creates, buyer = msg.sender).
   */
  async createTradeListing(params: CreateTradeParams): Promise<TradeResult> {
    try {
      return await escrowEthService.createTradeListing(params);
    } catch (error) {
      throw new Error(`Failed to create trade: ${getErrorMessage(error)}`);
    }
  }

  /**
   * Fund escrow as buyer. Approves cvUSD first, then calls escrowTrade.
   */
  async fundEscrowAsBuyer(tradeId: number, amountCvUSD: string): Promise<TradeResult> {
    try {
      // Step 1: Approve cvUSD spend
      await escrowEthService.approveCvUSDForEscrow(amountCvUSD);
      // Step 2: Fund escrow
      return await escrowEthService.escrowTrade(tradeId);
    } catch (error) {
      throw new Error(`Failed to fund escrow: ${getErrorMessage(error)}`);
    }
  }

  /**
   * Fund escrow as financier. Approves cvUSD first, then calls escrowTradeAsFinancier.
   */
  async fundEscrowAsFinancier(tradeId: number, amountCvUSD: string): Promise<TradeResult> {
    try {
      await escrowEthService.approveCvUSDForEscrow(amountCvUSD);
      return await escrowEthService.escrowTradeAsFinancier(tradeId);
    } catch (error) {
      throw new Error(`Failed to fund escrow as financier: ${getErrorMessage(error)}`);
    }
  }

  /**
   * Execute trade (seller confirms goods shipped, releases escrow payment).
   */
  async executeTrade(tradeId: number): Promise<TradeResult> {
    try {
      return await escrowEthService.executeTrade(tradeId);
    } catch (error) {
      throw new Error(`Failed to execute trade: ${getErrorMessage(error)}`);
    }
  }

  /**
   * Fetch all trades from the escrow contract.
   */
  async getMarketplaceListings(): Promise<EscrowTrade[]> {
    try {
      return await escrowEthService.getAllTrades();
    } catch (error) {
      throw new Error(`Failed to load marketplace listings: ${getErrorMessage(error)}`);
    }
  }

  /**
   * Get a single trade by ID.
   */
  async getTrade(tradeId: number): Promise<EscrowTrade> {
    try {
      return await escrowEthService.getTrade(tradeId);
    } catch (error) {
      throw new Error(`Failed to get trade: ${getErrorMessage(error)}`);
    }
  }

  /**
   * Get cvUSD balance for an address (human-readable).
   */
  async getCvUSDBalance(address: string): Promise<string> {
    const config = getEthConfig();
    if (!config.cvUsdAddress) return '0';
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const token = new ethers.Contract(config.cvUsdAddress, ERC20_ABI, provider);
    const [balance, decimals]: [bigint, bigint] = await Promise.all([
      token.balanceOf(address),
      token.decimals(),
    ]);
    return ethers.formatUnits(balance, decimals);
  }

  /**
   * Get instrument details from the registry contract.
   */
  async getInstrumentDetails(tokenId: number): Promise<EBLInstrument | null> {
    try {
      return await eblEthService.getInstrument(tokenId);
    } catch {
      return null;
    }
  }
}
