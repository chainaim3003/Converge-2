// ============================================
// DocAttest Gateway — Marketplace Trade Registry API
// Registers agreed POs onchain and accepts subsequent documents
// for CRE AI assessment against the immutable original.
//
// Endpoints:
//   POST /api/register-trade   — Lock PO onchain at mutual acceptance
//   POST /api/submit-invoice   — Submit invoice for CRE assessment
//   POST /api/submit-receipt   — Submit warehouse receipt for CRE assessment
//   GET  /api/attestation/:tradeId/:docType — Read CRE attestation
//
// References:
//   Express pattern: github.com/coinbase/x402/tree/main/examples/typescript/servers/express
//   ethers v6: docs.ethers.org/v6/
// ============================================

import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = parseInt(process.env.GATEWAY_PORT || '3002', 10);
const RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';
const TRADE_REGISTRY_ADDRESS = process.env.TRADE_REGISTRY_ADDRESS || '';
const GATEWAY_PRIVATE_KEY = process.env.GATEWAY_PRIVATE_KEY || '';

// TradeRegistry.sol ABI — only the functions the gateway calls
// Full contract: contracts/TradeRegistry.sol
const TRADE_REGISTRY_ABI = [
  'function registerTrade(string poData, address buyer, address seller) returns (uint256)',
  'function submitDocument(uint256 tradeId, uint8 docType, string docData)',
  'function getTrade(uint256 tradeId) view returns (tuple(string poData, bytes32 poHash, address buyer, address seller, uint256 registeredAt, uint256 registeredBlock))',
  'function getDocument(uint256 tradeId, uint8 docType) view returns (tuple(uint8 docType, string docData, bytes32 docHash, uint256 submittedAt))',
  'function getAttestation(uint256 tradeId, uint8 docType) view returns (tuple(uint256 tradeScore, string recommendation, string findings, uint256 attestedAt))',
  'function tradeCount() view returns (uint256)',
  'event TradeRegistered(uint256 indexed tradeId, bytes32 poHash, address buyer, address seller)',
  'event DocumentSubmitted(uint256 indexed tradeId, uint8 docType)',
  'event TradeAttested(uint256 indexed tradeId, uint8 docType, uint256 tradeScore)',
];

// DocType enum matching the Solidity contract
const DocType = {
  INVOICE: 1,
  RECEIPT: 2,
} as const;

function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(RPC_URL);
}

function getSigner(): ethers.Wallet {
  if (!GATEWAY_PRIVATE_KEY) {
    throw new Error('GATEWAY_PRIVATE_KEY not set in .env');
  }
  return new ethers.Wallet(GATEWAY_PRIVATE_KEY, getProvider());
}

function getContract(signerOrProvider: ethers.Signer | ethers.Provider): ethers.Contract {
  if (!TRADE_REGISTRY_ADDRESS) {
    throw new Error('TRADE_REGISTRY_ADDRESS not set in .env');
  }
  return new ethers.Contract(TRADE_REGISTRY_ADDRESS, TRADE_REGISTRY_ABI, signerOrProvider);
}

// ============================================
// POST /api/register-trade
// Called at PO acceptance — locks the agreed PO onchain
// ============================================
app.post('/api/register-trade', async (req, res) => {
  try {
    const { po, buyer, seller } = req.body;

    if (!po || !buyer || !seller) {
      return res.status(400).json({ error: 'Missing required fields: po, buyer, seller' });
    }

    const poDataStr = JSON.stringify(po);
    console.log(`📝 Registering trade onchain: PO ${po.poNumber}`);
    console.log(`   Buyer: ${buyer}`);
    console.log(`   Seller: ${seller}`);

    const signer = getSigner();
    const contract = getContract(signer);

    const tx = await contract.registerTrade(poDataStr, buyer, seller);
    console.log(`🔄 Transaction submitted: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`✅ Trade registered onchain at block ${receipt.blockNumber}`);

    // Parse TradeRegistered event to get tradeId
    const tradeRegisteredEvent = receipt.logs
      .map((log: ethers.Log) => {
        try { return contract.interface.parseLog({ topics: [...log.topics], data: log.data }); }
        catch { return null; }
      })
      .find((parsed: ethers.LogDescription | null) => parsed?.name === 'TradeRegistered');

    const tradeId = tradeRegisteredEvent ? tradeRegisteredEvent.args.tradeId.toString() : '0';

    res.json({
      success: true,
      tradeId,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      message: `PO ${po.poNumber} locked onchain as trade ${tradeId}`,
    });
  } catch (error: any) {
    console.error('❌ register-trade error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// POST /api/submit-invoice
// Called when invoice arrives — stores onchain, triggers CRE assessment
// ============================================
app.post('/api/submit-invoice', async (req, res) => {
  try {
    const { tradeId, invoice } = req.body;

    if (tradeId === undefined || !invoice) {
      return res.status(400).json({ error: 'Missing required fields: tradeId, invoice' });
    }

    const invoiceDataStr = JSON.stringify(invoice);
    console.log(`📄 Submitting invoice for trade ${tradeId}: ${invoice.invoiceNumber}`);

    const signer = getSigner();
    const contract = getContract(signer);

    const tx = await contract.submitDocument(tradeId, DocType.INVOICE, invoiceDataStr);
    console.log(`🔄 Transaction submitted: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`✅ Invoice submitted onchain at block ${receipt.blockNumber}`);
    console.log(`📡 DocumentSubmitted event emitted — CRE workflow will trigger`);

    res.json({
      success: true,
      tradeId,
      docType: 'INVOICE',
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      message: `Invoice ${invoice.invoiceNumber} submitted for CRE assessment`,
    });
  } catch (error: any) {
    console.error('❌ submit-invoice error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// POST /api/submit-receipt
// Called when warehouse receipt arrives — stores onchain, triggers CRE assessment
// ============================================
app.post('/api/submit-receipt', async (req, res) => {
  try {
    const { tradeId, receipt: warehouseReceipt } = req.body;

    if (tradeId === undefined || !warehouseReceipt) {
      return res.status(400).json({ error: 'Missing required fields: tradeId, receipt' });
    }

    const receiptDataStr = JSON.stringify(warehouseReceipt);
    console.log(`📦 Submitting receipt for trade ${tradeId}: ${warehouseReceipt.receiptNumber}`);

    const signer = getSigner();
    const contract = getContract(signer);

    const tx = await contract.submitDocument(tradeId, DocType.RECEIPT, receiptDataStr);
    console.log(`🔄 Transaction submitted: ${tx.hash}`);

    const txReceipt = await tx.wait();
    console.log(`✅ Receipt submitted onchain at block ${txReceipt.blockNumber}`);
    console.log(`📡 DocumentSubmitted event emitted — CRE workflow will trigger`);

    res.json({
      success: true,
      tradeId,
      docType: 'RECEIPT',
      txHash: txReceipt.hash,
      blockNumber: txReceipt.blockNumber,
      message: `Receipt ${warehouseReceipt.receiptNumber} submitted for CRE assessment`,
    });
  } catch (error: any) {
    console.error('❌ submit-receipt error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET /api/attestation/:tradeId/:docType
// Read CRE-written attestation — free view call
// ============================================
app.get('/api/attestation/:tradeId/:docType', async (req, res) => {
  try {
    const tradeId = parseInt(req.params.tradeId, 10);
    const docTypeParam = req.params.docType.toUpperCase();
    const docType = docTypeParam === 'INVOICE' ? DocType.INVOICE : DocType.RECEIPT;

    console.log(`🔍 Reading attestation for trade ${tradeId}, docType ${docTypeParam}`);

    const provider = getProvider();
    const contract = getContract(provider);

    const attestation = await contract.getAttestation(tradeId, docType);

    res.json({
      success: true,
      tradeId,
      docType: docTypeParam,
      attestation: {
        tradeScore: Number(attestation.tradeScore),
        recommendation: attestation.recommendation,
        findings: attestation.findings,
        attestedAt: Number(attestation.attestedAt),
      },
    });
  } catch (error: any) {
    console.error('❌ attestation read error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET /api/trade/:tradeId — Read trade details
// ============================================
app.get('/api/trade/:tradeId', async (req, res) => {
  try {
    const tradeId = parseInt(req.params.tradeId, 10);
    const provider = getProvider();
    const contract = getContract(provider);
    const trade = await contract.getTrade(tradeId);

    res.json({
      success: true,
      trade: {
        poData: trade.poData,
        poHash: trade.poHash,
        buyer: trade.buyer,
        seller: trade.seller,
        registeredAt: Number(trade.registeredAt),
        registeredBlock: Number(trade.registeredBlock),
      },
    });
  } catch (error: any) {
    console.error('❌ trade read error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Health check
// ============================================
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'DocAttest Gateway',
    contract: TRADE_REGISTRY_ADDRESS || 'NOT SET',
    rpc: RPC_URL,
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 DocAttest Gateway running on http://localhost:${PORT}`);
  console.log(`   Contract: ${TRADE_REGISTRY_ADDRESS || 'NOT SET — deploy TradeRegistry.sol first'}`);
  console.log(`   RPC: ${RPC_URL}`);
  console.log(`\n   Endpoints:`);
  console.log(`   POST /api/register-trade    — Lock PO onchain`);
  console.log(`   POST /api/submit-invoice    — Submit invoice for CRE assessment`);
  console.log(`   POST /api/submit-receipt    — Submit receipt for CRE assessment`);
  console.log(`   GET  /api/attestation/:id/:type — Read CRE attestation`);
  console.log(`   GET  /api/trade/:id         — Read trade details`);
  console.log(`   GET  /health                — Health check\n`);
});
