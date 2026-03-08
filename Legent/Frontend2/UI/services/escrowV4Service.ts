/**
 * escrowV4Service.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * Compatibility shim.  All V4 escrow logic is now in:
 *   services/escrowEthService.ts   (TradeEscrow.sol on Sepolia)
 *
 * This file re-exports the EscrowV4Service class with method names that
 * match the original Algorand service so callers compile unchanged.
 */
export {
  default as EscrowV4Service,
  default,
  escrowEthService as escrowV4Service,
  type EscrowTrade,
  type CreateTradeParams,
  type TradeResult,
  TradeState,
  TRADE_ESCROW_ABI,
} from './escrowEthService';
