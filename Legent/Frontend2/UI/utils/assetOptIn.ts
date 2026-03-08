/**
 * assetOptIn.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * Algorand ASA opt-in is replaced by ERC-20 token approval on Ethereum.
 * This file re-exports from utils/tokenApprove.ts so existing imports compile.
 *
 * Conceptual mapping:
 *   optInToAsset()    → approveToken()   (approve spender to spend ERC-20)
 *   checkAssetOptIn() → checkTokenAllowance() (check current allowance)
 */
export {
  approveToken as optInToAsset,
  checkTokenAllowance as checkAssetOptIn,
  approveToken,
  checkTokenAllowance,
  type TokenApproveParams,
  type TokenApproveResult,
} from './tokenApprove';
