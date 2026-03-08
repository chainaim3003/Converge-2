/**
 * Contract Initialization — Ethereum Sepolia
 * Replaces contractInit.ts (algosdk version)
 *
 * On Ethereum, smart contracts are initialized at deploy time via the
 * constructor. There is no separate on-chain initialize() call needed for
 * standard OpenZeppelin contracts. This module exists as a placeholder so
 * any callers in the codebase continue to compile without errors.
 *
 * If your TradeEscrow.sol or TradeRegistry.sol requires an explicit
 * initializer call (e.g. an upgradeable proxy pattern), add the logic here.
 */
export async function initializeContract(
  // senderAddress and signer kept for API compatibility; unused here
  _senderAddress: string,
  _signer: unknown
): Promise<string> {
  console.log(
    'ℹ️ Ethereum contracts are initialized at deploy time via constructor. ' +
      'No on-chain initialize() call required for standard OpenZeppelin deployments.'
  );
  return '';
}
