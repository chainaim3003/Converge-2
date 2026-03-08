/**
 * simpleSigner.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * The Algorand LocalNet simple signer (which decoded mnemonics and signed
 * raw Algorand transactions) has no equivalent on Ethereum.
 * MetaMask handles all signing via BrowserProvider + getSigner().
 *
 * This file exports a no-op stub so any lingering imports compile.
 */

export class SimpleLocalNetSigner {
  constructor(_mnemonic?: string) {
    console.warn(
      'SimpleLocalNetSigner is a no-op on Ethereum Sepolia. ' +
        'Use MetaMask (ethers BrowserProvider) for signing.'
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async signTransactions(_txns: any[]): Promise<null[]> {
    return [];
  }
}

export default SimpleLocalNetSigner;
