/**
 * escrowV4ServiceAlgoKit.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * Compatibility shim.  The AlgoKit typed client is replaced by ethers v6
 * calling TradeEscrow.sol on Ethereum Sepolia.
 *
 * All logic delegates to escrowEthService.ts.
 */
export {
  default as EscrowV4ServiceAlgoKit,
  default,
  escrowEthService as escrowV4ServiceAlgoKit,
  type EscrowTrade,
  type CreateTradeParams,
  type TradeResult,
  TradeState,
} from './escrowEthService';
