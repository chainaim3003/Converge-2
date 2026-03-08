/**
 * Trade Escrow Service for Ethereum Sepolia
 * Replaces escrowV4Service.ts, escrowV5Service.ts, escrowV4ServiceAlgoKit.ts
 *
 * Interfaces with TradeEscrow.sol deployed on Sepolia.
 * ethers v6 docs: https://docs.ethers.org/v6/
 */
import { ethers } from 'ethers';
import { getEthConfig, getExplorerUrl } from '../utils/network/getEthConfig';
import { ERC20_ABI } from './ethService';

// ─── TradeEscrow Contract ABI ─────────────────────────────────────────────────
// Matches TradeEscrow.sol (see contracts/TradeEscrow.sol for full Solidity source)
export const TRADE_ESCROW_ABI = [
  // Write functions
  'function createTrade(address seller, uint256 amount, string calldata productType, string calldata description, string calldata ipfsHash) external returns (uint256 tradeId)',
  'function escrowTrade(uint256 tradeId) external',
  'function escrowTradeAsFinancier(uint256 tradeId) external',
  'function executeTrade(uint256 tradeId) external',
  'function cancelTrade(uint256 tradeId) external',
  // Read functions
  'function getTrade(uint256 tradeId) external view returns (tuple(uint256 tradeId, address buyer, address seller, address escrowProvider, uint256 amount, uint8 state, string productType, string description, string ipfsHash, uint256 createdAt))',
  'function getNextTradeId() external view returns (uint256)',
  'function settlementToken() external view returns (address)',
  // Events
  'event TradeCreated(uint256 indexed tradeId, address indexed seller, address indexed buyer, uint256 amount)',
  'event TradeEscrowed(uint256 indexed tradeId, address indexed escrowProvider)',
  'event TradeExecuted(uint256 indexed tradeId)',
  'event TradeCompleted(uint256 indexed tradeId)',
  'event TradeCancelled(uint256 indexed tradeId)',
];

// Trade state enum — mirrors TradeEscrow.sol
export enum TradeState {
  CREATED = 0,
  ESCROWED = 1,
  EXECUTED = 2,
  PAYMENT_ACKNOWLEDGED = 3,
  EXPIRED = 4,
  COMPLETED = 5,
}

export interface EscrowTrade {
  tradeId: number;
  buyer: string;
  seller: string;
  escrowProvider: string;
  amount: bigint;
  state: TradeState;
  productType: string;
  description: string;
  ipfsHash: string;
  createdAt: bigint;
}

export interface CreateTradeParams {
  sellerAddress: string;
  amount: string;         // human-readable cvUSD e.g. "1000"
  productType: string;
  description: string;
  ipfsHash: string;
}

export interface TradeResult {
  tradeId: number;
  txHash: string;
  explorerUrl: string;
  confirmedBlock: number;
}

class EscrowEthService {
  private getContractAddress(): string {
    const { escrowContractAddress } = getEthConfig();
    if (!escrowContractAddress) {
      throw new Error(
        'Escrow contract address not set. Add NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS to .env.local'
      );
    }
    return escrowContractAddress;
  }

  private getBrowserProvider(): ethers.BrowserProvider {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not found. Install at https://metamask.io');
    }
    return new ethers.BrowserProvider(window.ethereum);
  }

  private getReadProvider(): ethers.JsonRpcProvider {
    const { rpcUrl } = getEthConfig();
    return new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Switch MetaMask to Sepolia if not already on it.
   * Docs: https://docs.metamask.io/wallet/how-to/manage-networks/add-network/
   */
  async ensureSepoliaNetwork(): Promise<void> {
    if (!window.ethereum) return;
    const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // Chain not added yet — add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: 'Ethereum Sepolia',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Approve escrow contract to spend cvUSD on behalf of the user.
   * Must be called before escrowTrade / escrowTradeAsFinancier.
   */
  async approveCvUSDForEscrow(amountCvUSD: string): Promise<string> {
    const { cvUsdAddress, escrowContractAddress } = getEthConfig();
    if (!cvUsdAddress) throw new Error('cvUSD contract address not configured');

    const provider = this.getBrowserProvider();
    const signer = await provider.getSigner();
    const token = new ethers.Contract(cvUsdAddress, ERC20_ABI, signer);

    const decimals: bigint = await token.decimals();
    const parsed = ethers.parseUnits(amountCvUSD, decimals);

    const tx = await token.approve(escrowContractAddress, parsed);
    const receipt = await tx.wait();
    if (!receipt) throw new Error('Approve transaction receipt is null');
    return receipt.hash;
  }

  /**
   * Create a new trade listing.
   * Caller (msg.sender) becomes the buyer.
   */
  async createTradeListing(params: CreateTradeParams): Promise<TradeResult> {
    await this.ensureSepoliaNetwork();

    const provider = this.getBrowserProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      this.getContractAddress(),
      TRADE_ESCROW_ABI,
      signer
    );

    const { cvUsdAddress } = getEthConfig();
    if (!cvUsdAddress) throw new Error('cvUSD contract address not configured');

    const token = new ethers.Contract(cvUsdAddress, ERC20_ABI, provider);
    const decimals: bigint = await token.decimals();
    const parsedAmount = ethers.parseUnits(params.amount, decimals);

    console.log('📝 Creating trade:', {
      seller: params.sellerAddress,
      amount: params.amount,
      product: params.productType,
    });

    const tx = await contract.createTrade(
      params.sellerAddress,
      parsedAmount,
      params.productType,
      params.description,
      params.ipfsHash
    );

    const receipt = await tx.wait();
    if (!receipt) throw new Error('Transaction receipt is null');

    // Extract tradeId from TradeCreated event
    const iface = new ethers.Interface(TRADE_ESCROW_ABI);
    let tradeId = 0;
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog({ topics: [...log.topics], data: log.data });
        if (parsed && parsed.name === 'TradeCreated') {
          tradeId = Number(parsed.args.tradeId);
          break;
        }
      } catch {
        // not this event
      }
    }

    console.log('✅ Trade created. ID:', tradeId, 'TxHash:', receipt.hash);

    return {
      tradeId,
      txHash: receipt.hash,
      explorerUrl: getExplorerUrl(receipt.hash),
      confirmedBlock: receipt.blockNumber,
    };
  }

  /**
   * Fund escrow as buyer (msg.sender must have approved cvUSD first).
   */
  async escrowTrade(tradeId: number): Promise<TradeResult> {
    await this.ensureSepoliaNetwork();

    const provider = this.getBrowserProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      this.getContractAddress(),
      TRADE_ESCROW_ABI,
      signer
    );

    const tx = await contract.escrowTrade(tradeId);
    const receipt = await tx.wait();
    if (!receipt) throw new Error('Transaction receipt is null');

    return {
      tradeId,
      txHash: receipt.hash,
      explorerUrl: getExplorerUrl(receipt.hash),
      confirmedBlock: receipt.blockNumber,
    };
  }

  /**
   * Fund escrow as financier (third-party funder).
   */
  async escrowTradeAsFinancier(tradeId: number): Promise<TradeResult> {
    await this.ensureSepoliaNetwork();

    const provider = this.getBrowserProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      this.getContractAddress(),
      TRADE_ESCROW_ABI,
      signer
    );

    const tx = await contract.escrowTradeAsFinancier(tradeId);
    const receipt = await tx.wait();
    if (!receipt) throw new Error('Transaction receipt is null');

    return {
      tradeId,
      txHash: receipt.hash,
      explorerUrl: getExplorerUrl(receipt.hash),
      confirmedBlock: receipt.blockNumber,
    };
  }

  /**
   * Execute trade — seller releases goods, escrow releases payment.
   * Called by seller.
   */
  async executeTrade(tradeId: number): Promise<TradeResult> {
    await this.ensureSepoliaNetwork();

    const provider = this.getBrowserProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      this.getContractAddress(),
      TRADE_ESCROW_ABI,
      signer
    );

    const tx = await contract.executeTrade(tradeId);
    const receipt = await tx.wait();
    if (!receipt) throw new Error('Transaction receipt is null');

    return {
      tradeId,
      txHash: receipt.hash,
      explorerUrl: getExplorerUrl(receipt.hash),
      confirmedBlock: receipt.blockNumber,
    };
  }

  /**
   * Get trade details from the contract.
   */
  async getTrade(tradeId: number): Promise<EscrowTrade> {
    const provider = this.getReadProvider();
    const contract = new ethers.Contract(
      this.getContractAddress(),
      TRADE_ESCROW_ABI,
      provider
    );

    const raw = await contract.getTrade(tradeId);

    return {
      tradeId: Number(raw.tradeId),
      buyer: raw.buyer,
      seller: raw.seller,
      escrowProvider: raw.escrowProvider,
      amount: raw.amount as bigint,
      state: Number(raw.state) as TradeState,
      productType: raw.productType,
      description: raw.description,
      ipfsHash: raw.ipfsHash,
      createdAt: raw.createdAt as bigint,
    };
  }

  /**
   * Get all trades up to nextTradeId.
   */
  async getAllTrades(): Promise<EscrowTrade[]> {
    const provider = this.getReadProvider();
    const contract = new ethers.Contract(
      this.getContractAddress(),
      TRADE_ESCROW_ABI,
      provider
    );

    const nextId: bigint = await contract.getNextTradeId();
    const total = Number(nextId);

    if (total === 0) return [];

    const ids = Array.from({ length: total }, (_, i) => i + 1);
    const trades = await Promise.all(
      ids.map(async (id) => {
        try {
          return await this.getTrade(id);
        } catch {
          return null;
        }
      })
    );

    return trades.filter((t): t is EscrowTrade => t !== null);
  }

  /**
   * Get the next trade ID (= total trades created so far + 1).
   */
  async getNextTradeId(): Promise<number> {
    const provider = this.getReadProvider();
    const contract = new ethers.Contract(
      this.getContractAddress(),
      TRADE_ESCROW_ABI,
      provider
    );
    const nextId: bigint = await contract.getNextTradeId();
    return Number(nextId);
  }

  /**
   * Check if the escrow contract is reachable.
   */
  async isContractReachable(): Promise<boolean> {
    try {
      await this.getNextTradeId();
      return true;
    } catch {
      return false;
    }
  }
}

export const escrowEthService = new EscrowEthService();
export default escrowEthService;
