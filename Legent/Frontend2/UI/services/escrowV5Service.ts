/**
 * escrowV5Service.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * Compatibility shim.  The V5 escrow (vLEI-enhanced) is implemented by the
 * same TradeEscrow.sol contract on Sepolia (vLEI docs stored off-chain/IPFS).
 *
 * All logic delegates to escrowEthService.ts.
 */
export {
  default as EscrowV5Service,
  default,
  escrowEthService as escrowV5Service,
  type EscrowTrade,
  type CreateTradeParams,
  type TradeResult,
  TradeState,
  TRADE_ESCROW_ABI,
} from './escrowEthService';
