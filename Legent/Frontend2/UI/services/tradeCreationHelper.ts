/**
 * tradeCreationHelper.ts — MIGRATED TO ETHEREUM SEPOLIA
 *
 * On Algorand amounts were stored as microALGO (integer).
 * On Ethereum amounts are stored as cvUSD with 18-decimal precision (ERC-20).
 *
 * This helper converts a USD cargo value to a cvUSD string and calls
 * escrowEthService.createTradeListing().
 *
 * 1 USD = 1 cvUSD (demo rate, cvUSD is a 1:1 USD stablecoin)
 * ethers v6 docs: https://docs.ethers.org/v6/
 */

import escrowEthService, { CreateTradeParams, TradeResult } from './escrowEthService';

// ─── Public interfaces ────────────────────────────────────────────────────────

export interface CreateTradeHelperParams {
  cargoValueUsd: number;    // USD value — converted 1:1 to cvUSD
  sellerAddress: string;
  buyerAddress: string;     // msg.sender (MetaMask connected account)
  productType: string;
  description: string;
  ipfsHash: string;
  signer?: unknown;         // no longer needed — MetaMask handles signing
}

// ─── Main helper ──────────────────────────────────────────────────────────────

/**
 * Create a trade listing with the correct USD → cvUSD conversion.
 *
 * On Ethereum 1 cvUSD = 1 USD (18 decimals handled by ethers.parseUnits).
 * The sellerAddress must be a valid Ethereum address.
 */
export async function createTradeWithCorrectConversion(
  params: CreateTradeHelperParams
): Promise<TradeResult> {
  const { cargoValueUsd, sellerAddress, productType, description, ipfsHash } = params;

  // 1 cvUSD = 1 USD — pass the USD value as a decimal string
  const amountCvUSD = cargoValueUsd.toFixed(2);

  console.log('═══════════════════════════════════════════════════');
  console.log('📝 Creating Trade on Ethereum Sepolia');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Cargo Value (USD):  $${cargoValueUsd.toLocaleString()}`);
  console.log(`Settlement (cvUSD): ${amountCvUSD}`);
  console.log(`Seller:             ${sellerAddress}`);
  console.log(`Product:            ${productType}`);
  console.log('═══════════════════════════════════════════════════');

  const tradeParams: CreateTradeParams = {
    sellerAddress,
    amount: amountCvUSD,
    productType,
    description,
    ipfsHash,
  };

  try {
    const result = await escrowEthService.createTradeListing(tradeParams);

    console.log('✅ Trade created successfully!');
    console.log(`   Trade ID:  ${result.tradeId}`);
    console.log(`   TxHash:    ${result.txHash}`);
    console.log(`   Explorer:  ${result.explorerUrl}`);
    console.log('═══════════════════════════════════════════════════');

    return result;
  } catch (error) {
    console.error('❌ Failed to create trade:', error);
    throw error;
  }
}

// ─── Testing utilities ────────────────────────────────────────────────────────

export const tradeConversionTests = {
  runTests() {
    console.log('\n🧪 Trade Amount Conversion Tests (Ethereum / cvUSD)');
    console.log('═'.repeat(60));

    const testCases = [50_000, 100_000, 250_000, 1_000_000];
    for (const usd of testCases) {
      const cvUSD = usd.toFixed(2);
      console.log(`$${usd.toLocaleString()} USD  →  ${cvUSD} cvUSD  (1:1 rate)`);
    }

    console.log('═'.repeat(60));
  },

  verifyAmount(cargoValueUsd: number) {
    const cvUSD = cargoValueUsd.toFixed(2);
    console.log('\n💰 Amount Verification');
    console.log('─'.repeat(50));
    console.log(`Input:   $${cargoValueUsd.toLocaleString()} USD`);
    console.log(`cvUSD:   ${cvUSD}`);
    console.log(`Rate:    1 USD = 1 cvUSD`);
    console.log('─'.repeat(50));
    return { usd: cargoValueUsd, cvUSD };
  },
};

// Expose helpers in browser console for development
if (typeof window !== 'undefined') {
  (window as any).tradeHelper = {
    createTrade: createTradeWithCorrectConversion,
    test: tradeConversionTests,
    verify: tradeConversionTests.verifyAmount,
  };

  console.log('💡 Trade Helper (Ethereum Sepolia) loaded!');
  console.log('   window.tradeHelper.test.runTests()');
  console.log('   window.tradeHelper.verify(100000)');
}
