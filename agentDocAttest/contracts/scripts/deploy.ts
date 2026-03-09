// scripts/deploy.ts
// Deploys TradeRegistry.sol to Base Sepolia
// Constructor arg: CRE Forwarder address
//   Base Sepolia: 0x82300bd7c3958625581cc2f77bc6464dcecdf3e5
//   Source: github.com/smartcontractkit/x402-cre-price-alerts README
//
// Usage:
//   cd agentDocAttest/contracts
//   npx hardhat run scripts/deploy.ts --network baseSepolia
//
// Reference: https://hardhat.org/hardhat-runner/docs/guides/deploying

import { ethers } from "hardhat";

async function main() {
  // Base Sepolia CRE Forwarder — from x402-cre-price-alerts README
  // docs.chain.link/cre/supported-networks-ts
  const CRE_FORWARDER = "0x82300bd7c3958625581cc2f77bc6464dcecdf3e5";

  console.log("============================================");
  console.log("  DocAttest — TradeRegistry.sol Deployment");
  console.log("  Network: Base Sepolia (Chain ID 84532)");
  console.log("============================================\n");

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance:  ${ethers.formatEther(balance)} ETH\n`);

  if (balance === 0n) {
    throw new Error(
      "Deployer has 0 ETH on Base Sepolia. Get testnet ETH from: https://www.alchemy.com/faucets/base-sepolia"
    );
  }

  console.log(`CRE Forwarder: ${CRE_FORWARDER}`);
  console.log("Deploying TradeRegistry...\n");

  const TradeRegistry = await ethers.getContractFactory("TradeRegistry");
  const tradeRegistry = await TradeRegistry.deploy(CRE_FORWARDER);

  await tradeRegistry.waitForDeployment();
  const deployedAddress = await tradeRegistry.getAddress();

  console.log("============================================");
  console.log(`✅ TradeRegistry deployed to: ${deployedAddress}`);
  console.log("============================================\n");
  console.log("Next steps:");
  console.log(`  1. Update .env: TRADE_REGISTRY_ADDRESS=${deployedAddress}`);
  console.log(`  2. View on Basescan: https://sepolia.basescan.org/address/${deployedAddress}`);
  console.log(`  3. Verify (optional):`);
  console.log(`     npx hardhat verify --network baseSepolia ${deployedAddress} ${CRE_FORWARDER}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
