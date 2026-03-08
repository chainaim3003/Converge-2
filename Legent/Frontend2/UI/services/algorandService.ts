/**
 * algorandService.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * Compatibility shim.  All functionality has been replaced by:
 *   services/ethService.ts        — core ETH provider, balances, transfers
 *   services/eblEthService.ts     — eBL / trade instrument NFT (ERC-721)
 *   services/escrowEthService.ts  — trade escrow (ERC-20 cvUSD)
 *
 * ethers v6 docs: https://docs.ethers.org/v6/
 */

import ethService from './ethService';
import { getEthConfig, getExplorerUrl } from '../utils/network/getEthConfig';
import { ethers } from 'ethers';

// ─── Legacy result types ─────────────────────────────────────────────────────

export interface TransactionResult {
  txId: string;
  confirmedRound: number;
  explorerUrl: string;
}

export interface BLCreationResult extends TransactionResult {
  blId: string;
  tokenId?: number;
}

export interface InvestmentResult extends TransactionResult {
  shares: number;
  amount: number;
}

export interface RWAMintResult extends TransactionResult {
  assetId: number;
  totalShares: number;
  sharePrice: number;
}

// ─── AlgorandService shim ────────────────────────────────────────────────────

export class AlgorandService {
  async isConnected(): Promise<boolean> {
    const result = await ethService.testConnection();
    return result.connected;
  }

  isValidAddress(address: string): boolean {
    return ethService.isValidAddress(address);
  }

  async getAlgoBalance(address: string): Promise<number> {
    const bal = await ethService.getEthBalance(address);
    return parseFloat(bal);
  }

  async getTokenBalance(address: string): Promise<number> {
    const config = getEthConfig();
    if (!config.cvUsdAddress) return 0;
    const bal = await ethService.getCvUSDBalance(address, config.cvUsdAddress);
    return parseFloat(bal);
  }

  async sendAlgo(toAddress: string, amount: number, note?: string): Promise<TransactionResult> {
    const amountEth = ethers.formatEther(BigInt(amount));
    const result = await ethService.sendETH(toAddress, amountEth, note);
    return {
      txId: result.txHash,
      confirmedRound: result.confirmedBlock,
      explorerUrl: result.explorerUrl,
    };
  }

  async getNetworkInfo() {
    return ethService.getNetworkInfo();
  }
}

// ─── EnhancedAlgorandService shim ────────────────────────────────────────────

export class EnhancedAlgorandService extends AlgorandService {
  async createBillOfLading(params: {
    instrumentNumber: string;
    exporterAddress: string;
    importerAddress: string;
    cargoDescription: string;
    cargoValue: number;
    originPort: string;
    destinationPort: string;
  }): Promise<BLCreationResult> {
    const { default: eblEthService } = await import('./eblEthService');
    const result = await eblEthService.createInstrument({
      instrumentNumber: params.instrumentNumber,
      exporterAddress: params.exporterAddress,
      importerAddress: params.importerAddress,
      cargoDescription: params.cargoDescription,
      cargoValue: params.cargoValue,
      originPort: params.originPort,
      destinationPort: params.destinationPort,
    });
    return {
      txId: result.txHash,
      confirmedRound: result.confirmedBlock,
      explorerUrl: result.explorerUrl,
      blId: params.instrumentNumber,
      tokenId: result.tokenId,
    };
  }

  async tokenizeInvestment(params: { tradeId: number; amount: number }): Promise<InvestmentResult> {
    const { default: escrowEthService } = await import('./escrowEthService');
    const result = await escrowEthService.escrowTrade(params.tradeId);
    return {
      txId: result.txHash,
      confirmedRound: result.confirmedBlock,
      explorerUrl: result.explorerUrl,
      shares: 1,
      amount: params.amount,
    };
  }
}

export const algorandService = new AlgorandService();
export const enhancedAlgorandService = new EnhancedAlgorandService();
export default algorandService;
