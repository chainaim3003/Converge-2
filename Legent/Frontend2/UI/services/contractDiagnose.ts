/**
 * Contract Diagnostics — Ethereum Sepolia
 * Replaces contractDiagnose.ts (algosdk version)
 *
 * ethers v6 docs: https://docs.ethers.org/v6/
 */
import { ethers } from 'ethers';
import { getEthConfig } from '../utils/network/getEthConfig';
import { TRADE_ESCROW_ABI } from './escrowEthService';
import { TRADE_REGISTRY_ABI } from './eblEthService';
import { getErrorMessage } from '../utils/errorHandling';

export async function diagnoseContracts(): Promise<void> {
  const config = getEthConfig();
  const provider = new ethers.JsonRpcProvider(config.rpcUrl);

  console.log('=== ETHEREUM CONTRACT DIAGNOSTIC ===');
  console.log('Network:', config.network);
  console.log('Chain ID:', config.chainId);
  console.log('RPC URL:', config.rpcUrl);

  // Check Escrow contract
  if (config.escrowContractAddress) {
    try {
      const escrow = new ethers.Contract(
        config.escrowContractAddress,
        TRADE_ESCROW_ABI,
        provider
      );
      const nextId: bigint = await escrow.getNextTradeId();
      const token: string = await escrow.settlementToken();
      console.log('\n📜 TradeEscrow Contract:', config.escrowContractAddress);
      console.log('  Next Trade ID:', Number(nextId));
      console.log('  Settlement Token:', token);
    } catch (error) {
      console.error('  ❌ Could not read escrow contract:', getErrorMessage(error));
    }
  } else {
    console.warn('\n⚠️  NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS not set');
  }

  // Check Registry contract
  if (config.registryContractAddress) {
    try {
      const registry = new ethers.Contract(
        config.registryContractAddress,
        TRADE_REGISTRY_ABI,
        provider
      );
      const nextId: bigint = await registry.getNextTokenId();
      console.log('\n📜 TradeRegistry Contract:', config.registryContractAddress);
      console.log('  Next Token ID:', Number(nextId));
    } catch (error) {
      console.error('  ❌ Could not read registry contract:', getErrorMessage(error));
    }
  } else {
    console.warn('\n⚠️  NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS not set');
  }

  // Check cvUSD contract
  if (config.cvUsdAddress) {
    try {
      const erc20Abi = [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function totalSupply() view returns (uint256)',
        'function decimals() view returns (uint8)',
      ];
      const cvusd = new ethers.Contract(config.cvUsdAddress, erc20Abi, provider);
      const [name, symbol, totalSupply, decimals] = await Promise.all([
        cvusd.name(),
        cvusd.symbol(),
        cvusd.totalSupply(),
        cvusd.decimals(),
      ]);
      console.log('\n💵 cvUSD Contract:', config.cvUsdAddress);
      console.log('  Name:', name, '|  Symbol:', symbol);
      console.log('  Total Supply:', ethers.formatUnits(totalSupply, decimals));
    } catch (error) {
      console.error('  ❌ Could not read cvUSD contract:', getErrorMessage(error));
    }
  } else {
    console.warn('\n⚠️  NEXT_PUBLIC_CVUSD_CONTRACT_ADDRESS not set');
  }

  console.log('\n=== END DIAGNOSTIC ===');
}
