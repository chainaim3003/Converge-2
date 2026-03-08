/**
 * eblService.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * Compatibility shim.  The Algorand TradeInstrumentRegistryV3 contract
 * is replaced by the ERC-721 TradeRegistry.sol on Sepolia.
 * All logic delegates to eblEthService.ts.
 *
 * ethers v6 docs: https://docs.ethers.org/v6/
 */

export {
  default as eblEthService,
  default,
  type EBLInstrument,
  type EBLCreationParams,
  type EBLCreationResult,
  TRADE_REGISTRY_ABI,
} from './eblEthService';

// ── Legacy call signature (kept so callers compile) ─────────────────────────

import eblEthService from './eblEthService';

export interface EBLCreationLegacyParams {
  instrumentNumber: string;
  exporterAddress: string;
  importerAddress: string;
  cargoDescription: string;
  cargoValue: number;
  originPort: string;
  destinationPort: string;
  sender: string;
  signer?: unknown; // no longer needed — MetaMask handles signing
}

export interface EBLCreationLegacyResult {
  txId: string;          // tx hash
  confirmedRound: number; // block number
  explorerUrl: string;
  instrumentId: number;  // ERC-721 token ID
  assetId?: number;      // alias for tokenId
}

/**
 * createRealEBLInstrument — drop-in replacement for the Algorand version.
 */
export async function createRealEBLInstrument(
  params: EBLCreationLegacyParams
): Promise<EBLCreationLegacyResult> {
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
    instrumentId: result.tokenId ?? 0,
    assetId: result.tokenId,
  };
}
