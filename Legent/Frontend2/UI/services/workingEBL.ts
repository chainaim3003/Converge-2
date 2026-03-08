/**
 * workingEBL.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * The Algorand AlgoKit ASA creation + atomic opt-in/transfer flow is replaced
 * by an ERC-721 mint call on Ethereum Sepolia via eblEthService.createInstrument().
 *
 * On Ethereum there is no "opt-in" for ERC-721 — the token is simply minted
 * to the exporter's address in one transaction.  The carrier (msg.sender in
 * MetaMask) calls the registry contract which mints the token.
 *
 * ethers v6 docs: https://docs.ethers.org/v6/
 */
import eblEthService from './eblEthService';
import { boxStorageService } from './boxStorage';
import type { ExtendedBillOfLading } from './boxStorage';
import { getErrorMessage } from '../utils/errorHandling';

export interface WorkingEBLParams {
  instrumentNumber: string;
  exporterAddress: string;
  cargoDescription: string;
  cargoValue: number;
  sender: string;
  signer?: unknown;        // no longer needed
  exporterSigner?: unknown; // no longer needed
  quantity?: string;
  vesselName?: string;
  voyageNumber?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
}

export interface WorkingEBLResult {
  txId: string;
  confirmedRound: number;
  explorerUrl: string;
  assetId: number;         // = ERC-721 tokenId
  status: string;
}

// Re-export ExtendedBillOfLading from boxStorage for callers that import it here
export type { ExtendedBillOfLading };

/**
 * createWorkingEBL — creates an eBL (ERC-721) on Ethereum Sepolia,
 * then stores BL metadata in localStorage-backed box storage.
 */
export async function createWorkingEBL(params: WorkingEBLParams): Promise<WorkingEBLResult> {
  console.log('🚀 Creating eBL on Ethereum Sepolia:', params.instrumentNumber);

  const result = await eblEthService.createInstrument({
    instrumentNumber: params.instrumentNumber,
    exporterAddress: params.exporterAddress,
    importerAddress: params.exporterAddress, // same party for simple flow
    cargoDescription: params.cargoDescription,
    cargoValue: params.cargoValue,
    originPort: params.portOfLoading || '',
    destinationPort: params.portOfDischarge || '',
  });

  const tokenId = result.tokenId ?? 0;

  // Store BL metadata in box storage (localStorage-backed)
  await _storeBLMetadata(params, tokenId, result.txHash);

  console.log('✅ eBL created on Ethereum Sepolia. Token ID:', tokenId);

  return {
    txId: result.txHash,
    confirmedRound: result.confirmedBlock,
    explorerUrl: result.explorerUrl,
    assetId: tokenId,
    status: 'success',
  };
}

/**
 * optInToAsset — no-op on Ethereum (ERC-721 has no opt-in mechanism).
 * Kept for API compatibility with callers that call this before a transfer.
 */
export async function optInToAsset(params: {
  assetId: number;
  address: string;
  signer?: unknown;
}): Promise<{ txId: string; explorerUrl: string }> {
  console.log(
    'ℹ️  optInToAsset is a no-op on Ethereum — ERC-721 tokens have no opt-in. ' +
      'Token ID:', params.assetId
  );
  return { txId: '', explorerUrl: '' };
}

// ── Internal helpers ────────────────────────────────────────────────────────

async function _storeBLMetadata(
  params: WorkingEBLParams,
  tokenId: number,
  txHash: string
): Promise<void> {
  try {
    const bl: ExtendedBillOfLading = {
      transportDocumentReference: params.instrumentNumber,
      shippedOnBoardDate: new Date().toISOString(),
      receiptTypeAtOrigin: 'CY',
      deliveryTypeAtDestination: 'CY',
      cargoMovementTypeAtOrigin: 'FCL',
      cargoMovementTypeAtDestination: 'FCL',
      serviceContractReference: `SC-${tokenId}`,
      declaredValue: { amount: params.cargoValue, currency: 'USD' },
      shipmentTerms: 'FOB',
      canBeFinanced: true,
      transports: {
        portOfLoading: { portName: params.portOfLoading || 'Unknown' },
        portOfDischarge: { portName: params.portOfDischarge || 'Unknown' },
        vesselVoyages: [{ vesselName: params.vesselName || 'Unknown Vessel' }],
      },
      documentParties: {
        issuingParty: {
          partyName: 'Carrier',
          role: 'CARRIER',
          address: { street: '', streetNumber: '', city: '', countryCode: '' },
        },
        shipper: {
          partyName: 'Shipper',
          role: 'SHIPPER',
          titleHolder: true,
          displayedAddress: [],
          partyContactDetails: [],
        },
        consignee: {
          partyName: 'Consignee',
          role: 'CONSIGNEE',
          displayedAddress: [],
          partyContactDetails: [],
        },
      },
      consignmentItems: [
        {
          carrierBookingReference: params.instrumentNumber,
          descriptionOfGoods: [params.cargoDescription],
          HSCodes: ['000000'],
          cargoItems: [
            {
              equipmentReference: 'CONT001',
              cargoGrossWeight: {
                value: parseFloat(params.quantity || '1'),
                unit: 'KGS',
              },
              outerPackaging: {
                numberOfPackages: 1,
                packageCode: 'CT',
                description: 'Container',
              },
            },
          ],
        },
      ],
      ipfsData: { metadataHash: '', imageHash: '', documentHash: '', encryptionKey: '' },
      rwaTokenization: {
        canTokenize: true,
        minInvestment: 1000,
        totalShares: 1,
        sharePrice: params.cargoValue,
        expectedYield: 5,
        paymentTerms: 90,
        riskRating: 'A',
        marketplaceEligible: true,
        enabled: true,
        assetId: tokenId,
      },
      charges: [],
      invoicePayableAt: params.portOfDischarge || 'Destination',
      cargoDescription: params.cargoDescription,
      cargoValue: params.cargoValue,
      currency: 'USD',
      originPort: params.portOfLoading,
      destinationPort: params.portOfDischarge,
      vesselName: params.vesselName,
      currentHolder: params.exporterAddress,
      createdByCarrier: {
        carrierAddress: params.sender,
        assignedToExporter: params.exporterAddress,
        creationTxHash: txHash,
        timestamp: new Date().toISOString(),
      },
      status: 'transferred',
    } as ExtendedBillOfLading;

    await boxStorageService.storeBL(bl, params.sender);
    console.log('📦 BL metadata stored (token ID:', tokenId, ')');
  } catch (err) {
    console.warn('⚠️ Could not store BL metadata:', getErrorMessage(err));
  }
}
