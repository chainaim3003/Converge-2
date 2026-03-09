// hardhat.config.ts
// Reference: https://hardhat.org/hardhat-runner/docs/config
// Network: Base Sepolia (Chain ID 84532)
// CRE Forwarder: 0x82300bd7c3958625581cc2f77bc6464dcecdf3e5
//   Source: github.com/smartcontractkit/x402-cre-price-alerts

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import path from "path";

// Load .env from the agentDocAttest root (one level up from contracts/)
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const PRIVATE_KEY = process.env.CRE_ETH_PRIVATE_KEY || "";
const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    baseSepolia: {
      url: BASE_SEPOLIA_RPC,
      chainId: 84532,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: ".",           // TradeRegistry.sol is in contracts/ (this dir)
    artifacts: "artifacts",
    cache: "cache",
  },
  // Optional: Basescan verification
  // Get API key from: https://basescan.org/myapikey
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
};

export default config;
