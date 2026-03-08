/**
 * simpleEBL.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * The Algorand ABI-encoded smart contract call (makeApplicationNoOpTxnFromObject)
 * is replaced by an ERC-721 mint call via eblEthService.createInstrument().
 *
 * ethers v6 docs: https://docs.ethers.org/v6/
 */
import eblEthService from './eblEthService';
import { getErrorMessage } from '../utils/errorHandling';

export interface SimpleEBLParams {
  instrumentNumber: string;
  exporterAddress: string;
  importerAddress: string;
  cargoDescription: string;
  cargoValue: number;
  originPort: string;
  destinationPort: string;
  sender: string;
  signer?: unknown; // no longer needed — MetaMask handles signing
}

export interface SimpleEBLResult {
  txId: string;
  confirmedRound: number;
  explorerUrl: string;
  tokenId?: number;
  status: string;
}

/**
 * createSimpleEBL — creates an eBL instrument on Ethereum Sepolia.
 * Equivalent to the old Algorand makeApplicationNoOpTxnFromObject call.
 */
export async function createSimpleEBL(params: SimpleEBLParams): Promise<SimpleEBLResult> {
  console.log('=== SIMPLE EBL CREATION (Ethereum Sepolia) ===');
  console.log('Instrument:', params.instrumentNumber);
  console.log('Exporter:', params.exporterAddress);

  try {
    const result = await eblEthService.createInstrument({
      instrumentNumber: params.instrumentNumber,
      exporterAddress: params.exporterAddress,
      importerAddress: params.importerAddress || params.exporterAddress,
      cargoDescription: params.cargoDescription,
      cargoValue: params.cargoValue,
      originPort: params.originPort || '',
      destinationPort: params.destinationPort || '',
    });

    console.log('✅ eBL created on Ethereum Sepolia');
    console.log('  Token ID:', result.tokenId);
    console.log('  TxHash:', result.txHash);

    return {
      txId: result.txHash,
      confirmedRound: result.confirmedBlock,
      explorerUrl: result.explorerUrl,
      tokenId: result.tokenId,
      status: 'success',
    };
  } catch (error) {
    console.error('Error creating eBL:', getErrorMessage(error));
    throw new Error(
      `eBL creation failed: ${getErrorMessage(error)}\n\n` +
        'Make sure:\n' +
        '1. MetaMask is connected to Ethereum Sepolia\n' +
        '2. NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS is set in .env.local\n' +
        '3. You have Sepolia ETH for gas (https://www.alchemy.com/faucets/ethereum-sepolia)'
    );
  }
}
