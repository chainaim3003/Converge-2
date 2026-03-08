/**
 * ERC-20 Token Approval Utility
 * Replaces utils/assetOptIn.ts (Algorand ASA opt-in)
 *
 * On Ethereum, instead of "opting in" to an asset, you approve a spender
 * (e.g. the escrow contract) to transfer tokens on your behalf via ERC-20
 * approve().  This is the direct equivalent of Algorand's asset opt-in for
 * the trade finance use-case.
 *
 * ethers v6 docs: https://docs.ethers.org/v6/
 * EIP-20: https://eips.ethereum.org/EIPS/eip-20
 */
import { ethers } from 'ethers';
import { getExplorerUrl } from './network/getEthConfig';

const ERC20_APPROVAL_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

export interface TokenApproveParams {
  tokenAddress: string;
  spenderAddress: string;
  amount: string;          // human-readable e.g. "1000"
}

export interface TokenApproveResult {
  success: boolean;
  txHash: string;
  explorerUrl: string;
  confirmedBlock: number;
}

/**
 * Approve a spender (e.g. escrow contract) to spend ERC-20 tokens.
 * Must be called before the escrow contract can pull tokens from the user.
 */
export async function approveToken(params: TokenApproveParams): Promise<TokenApproveResult> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not found. Install at https://metamask.io');
  }

  console.log('🔑 Approving token spend:', {
    token: params.tokenAddress,
    spender: params.spenderAddress,
    amount: params.amount,
  });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const token = new ethers.Contract(params.tokenAddress, ERC20_APPROVAL_ABI, signer);

  const decimals: bigint = await token.decimals();
  const parsedAmount = ethers.parseUnits(params.amount, decimals);

  const tx = await token.approve(params.spenderAddress, parsedAmount);
  const receipt = await tx.wait();

  if (!receipt) throw new Error('Approval transaction receipt is null');

  console.log('✅ Token approval confirmed:', receipt.hash);

  return {
    success: true,
    txHash: receipt.hash,
    explorerUrl: getExplorerUrl(receipt.hash),
    confirmedBlock: receipt.blockNumber,
  };
}

/**
 * Check the current ERC-20 allowance for a spender.
 * Returns human-readable allowance string.
 */
export async function checkTokenAllowance(
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  rpcUrl = 'https://rpc.sepolia.org'
): Promise<string> {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const token = new ethers.Contract(tokenAddress, ERC20_APPROVAL_ABI, provider);

  const [allowance, decimals] = await Promise.all([
    token.allowance(ownerAddress, spenderAddress) as Promise<bigint>,
    token.decimals() as Promise<bigint>,
  ]);

  return ethers.formatUnits(allowance, decimals);
}
