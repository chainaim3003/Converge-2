/**
 * Core Ethereum Service
 * Replaces algorandService.ts
 *
 * Uses ethers v6 — official docs: https://docs.ethers.org/v6/
 * MetaMask docs: https://docs.metamask.io/wallet/get-started/
 */
import { ethers } from 'ethers';
import { getEthConfig, getExplorerUrl } from '../utils/network/getEthConfig';

// Minimal ERC-20 ABI — EIP-20: https://eips.ethereum.org/EIPS/eip-20
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function mint(address to, uint256 amount)',
];

export interface TransactionResult {
  txHash: string;
  confirmedBlock: number;
  explorerUrl: string;
}

export interface AccountInfo {
  address: string;
  ethBalance: string;     // human-readable ETH
  cvUsdBalance: string;   // human-readable cvUSD
}

export interface NetworkInfo {
  network: string;
  chainId: number;
  rpcUrl: string;
}

class EthService {
  /**
   * Get a read-only JSON-RPC provider (no wallet needed).
   */
  getProvider(): ethers.JsonRpcProvider {
    const { rpcUrl } = getEthConfig();
    return new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Get MetaMask BrowserProvider (requires window.ethereum).
   * Docs: https://docs.ethers.org/v6/api/providers/#BrowserProvider
   */
  getBrowserProvider(): ethers.BrowserProvider {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error(
        'MetaMask not found. Install MetaMask at https://metamask.io'
      );
    }
    return new ethers.BrowserProvider(window.ethereum);
  }

  /**
   * Validate an Ethereum address.
   * Docs: https://docs.ethers.org/v6/api/utils/#isAddress
   */
  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  /**
   * Get current connected address from MetaMask.
   */
  async getActiveAddress(): Promise<string | null> {
    try {
      const provider = this.getBrowserProvider();
      const signer = await provider.getSigner();
      return await signer.getAddress();
    } catch {
      return null;
    }
  }

  /**
   * Get ETH balance for an address.
   * Returns human-readable string (e.g. "0.5").
   */
  async getEthBalance(address: string): Promise<string> {
    const provider = this.getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  /**
   * Get cvUSD ERC-20 token balance.
   * Returns human-readable string.
   */
  async getCvUSDBalance(
    address: string,
    cvUsdContractAddress: string
  ): Promise<string> {
    if (!cvUsdContractAddress) return '0';
    const provider = this.getProvider();
    const contract = new ethers.Contract(
      cvUsdContractAddress,
      ERC20_ABI,
      provider
    );
    const balance: bigint = await contract.balanceOf(address);
    const decimals: bigint = await contract.decimals();
    return ethers.formatUnits(balance, decimals);
  }

  /**
   * Get full account info (ETH + cvUSD balances).
   */
  async getAccountInfo(
    address: string,
    cvUsdContractAddress: string
  ): Promise<AccountInfo> {
    const [ethBalance, cvUsdBalance] = await Promise.all([
      this.getEthBalance(address),
      this.getCvUSDBalance(address, cvUsdContractAddress),
    ]);
    return { address, ethBalance, cvUsdBalance };
  }

  /**
   * Get network info from the RPC provider.
   */
  async getNetworkInfo(): Promise<NetworkInfo> {
    const config = getEthConfig();
    const provider = this.getProvider();
    const network = await provider.getNetwork();
    return {
      network: config.network,
      chainId: Number(network.chainId),
      rpcUrl: config.rpcUrl,
    };
  }

  /**
   * Test connectivity to the RPC node.
   */
  async testConnection(): Promise<{
    connected: boolean;
    blockNumber?: number;
    chainId?: number;
    error?: string;
  }> {
    try {
      const provider = this.getProvider();
      const [blockNumber, network] = await Promise.all([
        provider.getBlockNumber(),
        provider.getNetwork(),
      ]);
      return {
        connected: true,
        blockNumber,
        chainId: Number(network.chainId),
      };
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send ETH from connected MetaMask wallet.
   */
  async sendETH(
    toAddress: string,
    amountEth: string,
    memo?: string
  ): Promise<TransactionResult> {
    const provider = this.getBrowserProvider();
    const signer = await provider.getSigner();

    const txRequest: ethers.TransactionRequest = {
      to: toAddress,
      value: ethers.parseEther(amountEth),
    };

    if (memo) {
      txRequest.data = ethers.hexlify(ethers.toUtf8Bytes(memo));
    }

    const tx = await signer.sendTransaction(txRequest);
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error('Transaction receipt is null');
    }

    return {
      txHash: receipt.hash,
      confirmedBlock: receipt.blockNumber,
      explorerUrl: getExplorerUrl(receipt.hash),
    };
  }

  /**
   * Transfer cvUSD ERC-20 tokens via MetaMask.
   */
  async transferCvUSD(
    toAddress: string,
    amount: string,
    cvUsdContractAddress: string
  ): Promise<TransactionResult> {
    const provider = this.getBrowserProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      cvUsdContractAddress,
      ERC20_ABI,
      signer
    );

    const decimals: bigint = await contract.decimals();
    const parsedAmount = ethers.parseUnits(amount, decimals);

    const tx = await contract.transfer(toAddress, parsedAmount);
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error('Transaction receipt is null');
    }

    return {
      txHash: receipt.hash,
      confirmedBlock: receipt.blockNumber,
      explorerUrl: getExplorerUrl(receipt.hash),
    };
  }

  /**
   * Approve spender to spend cvUSD on behalf of the connected wallet.
   * Required before transferFrom calls (e.g. escrow funding).
   */
  async approveCvUSD(
    spenderAddress: string,
    amount: string,
    cvUsdContractAddress: string
  ): Promise<TransactionResult> {
    const provider = this.getBrowserProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      cvUsdContractAddress,
      ERC20_ABI,
      signer
    );

    const decimals: bigint = await contract.decimals();
    const parsedAmount = ethers.parseUnits(amount, decimals);

    const tx = await contract.approve(spenderAddress, parsedAmount);
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error('Transaction receipt is null');
    }

    return {
      txHash: receipt.hash,
      confirmedBlock: receipt.blockNumber,
      explorerUrl: getExplorerUrl(receipt.hash),
    };
  }

  /**
   * Get transaction info from the RPC provider.
   */
  async getTransactionInfo(txHash: string): Promise<ethers.TransactionReceipt | null> {
    const provider = this.getProvider();
    return provider.getTransactionReceipt(txHash);
  }
}

export const ethService = new EthService();
export default ethService;
