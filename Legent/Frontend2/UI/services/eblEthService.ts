/**
 * Electronic Bill of Lading (eBL) Service for Ethereum Sepolia
 * Replaces eblService.ts
 *
 * Interfaces with TradeRegistry.sol (ERC-721 based instrument registry).
 * ethers v6 docs: https://docs.ethers.org/v6/
 */
import { ethers } from 'ethers';
import { getEthConfig, getExplorerUrl } from '../utils/network/getEthConfig';

// Trade Registry ABI (ERC-721 + custom registry methods)
// Matches TradeRegistry.sol that the user deploys via Remix
export const TRADE_REGISTRY_ABI = [
  // ERC-721 standard
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function balanceOf(address owner) view returns (uint256)',
  // Registry-specific
  'function createInstrument(string calldata instrumentNumber, address exporter, address importer, string calldata cargoDescription, uint256 cargoValue, string calldata originPort, string calldata destinationPort) external returns (uint256 tokenId)',
  'function getInstrument(uint256 tokenId) external view returns (tuple(uint256 tokenId, string instrumentNumber, address exporter, address importer, string cargoDescription, uint256 cargoValue, string originPort, string destinationPort, uint256 createdAt, address currentHolder))',
  'function getNextTokenId() external view returns (uint256)',
  // Events
  'event InstrumentCreated(uint256 indexed tokenId, address indexed exporter, string instrumentNumber)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
];

export interface EBLCreationParams {
  instrumentNumber: string;
  exporterAddress: string;
  importerAddress: string;
  cargoDescription: string;
  cargoValue: number;
  originPort: string;
  destinationPort: string;
}

export interface EBLCreationResult {
  txHash: string;
  confirmedBlock: number;
  explorerUrl: string;
  tokenId: number;
}

export interface EBLInstrument {
  tokenId: number;
  instrumentNumber: string;
  exporter: string;
  importer: string;
  cargoDescription: string;
  cargoValue: bigint;
  originPort: string;
  destinationPort: string;
  createdAt: bigint;
  currentHolder: string;
}

class EBLEthService {
  private getContractAddress(): string {
    const { registryContractAddress } = getEthConfig();
    if (!registryContractAddress) {
      throw new Error(
        'Registry contract address not configured. Set NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS in .env.local'
      );
    }
    return registryContractAddress;
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
   * Create a new eBL instrument on-chain (mints an ERC-721 token).
   */
  async createInstrument(params: EBLCreationParams): Promise<EBLCreationResult> {
    const provider = this.getBrowserProvider();
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      this.getContractAddress(),
      TRADE_REGISTRY_ABI,
      signer
    );

    console.log('📝 Creating eBL instrument:', params.instrumentNumber);

    const tx = await contract.createInstrument(
      params.instrumentNumber,
      params.exporterAddress,
      params.importerAddress,
      params.cargoDescription,
      BigInt(params.cargoValue),
      params.originPort,
      params.destinationPort
    );

    const receipt = await tx.wait();
    if (!receipt) throw new Error('Transaction receipt is null');

    // Extract tokenId from InstrumentCreated event
    const iface = new ethers.Interface(TRADE_REGISTRY_ABI);
    let tokenId = 0;
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog({ topics: [...log.topics], data: log.data });
        if (parsed && parsed.name === 'InstrumentCreated') {
          tokenId = Number(parsed.args.tokenId);
          break;
        }
      } catch {
        // not this event
      }
    }

    console.log('✅ eBL created. Token ID:', tokenId, 'TxHash:', receipt.hash);

    return {
      txHash: receipt.hash,
      confirmedBlock: receipt.blockNumber,
      explorerUrl: getExplorerUrl(receipt.hash),
      tokenId,
    };
  }

  /**
   * Get instrument details by token ID.
   */
  async getInstrument(tokenId: number): Promise<EBLInstrument> {
    const provider = this.getReadProvider();
    const contract = new ethers.Contract(
      this.getContractAddress(),
      TRADE_REGISTRY_ABI,
      provider
    );

    const raw = await contract.getInstrument(tokenId);

    return {
      tokenId: Number(raw.tokenId),
      instrumentNumber: raw.instrumentNumber,
      exporter: raw.exporter,
      importer: raw.importer,
      cargoDescription: raw.cargoDescription,
      cargoValue: raw.cargoValue as bigint,
      originPort: raw.originPort,
      destinationPort: raw.destinationPort,
      createdAt: raw.createdAt as bigint,
      currentHolder: raw.currentHolder,
    };
  }

  /**
   * Transfer an eBL instrument to a new holder.
   */
  async transferInstrument(
    tokenId: number,
    toAddress: string
  ): Promise<{ txHash: string; explorerUrl: string }> {
    const provider = this.getBrowserProvider();
    const signer = await provider.getSigner();
    const fromAddress = await signer.getAddress();
    const contract = new ethers.Contract(
      this.getContractAddress(),
      TRADE_REGISTRY_ABI,
      signer
    );

    const tx = await contract.safeTransferFrom(fromAddress, toAddress, tokenId);
    const receipt = await tx.wait();
    if (!receipt) throw new Error('Transaction receipt is null');

    return {
      txHash: receipt.hash,
      explorerUrl: getExplorerUrl(receipt.hash),
    };
  }
}

export const eblEthService = new EBLEthService();
export default eblEthService;
