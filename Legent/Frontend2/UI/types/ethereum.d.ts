/**
 * Global TypeScript declarations for MetaMask's window.ethereum provider.
 * MetaMask docs: https://docs.metamask.io/wallet/get-started/
 * EIP-1193:      https://eips.ethereum.org/EIPS/eip-1193
 */

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};
