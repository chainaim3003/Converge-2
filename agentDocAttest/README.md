# DocAttest — AI Trade Assessment via Chainlink CRE

> **The marketplace holds the original agreement. When the invoice arrives, CRE reads the PO from the chain and asks the AI: does this trade still make sense?**

## What This Does

DocAttest is a marketplace service that:
1. **Locks the agreed PO onchain** at the moment both buyer and seller accept
2. **Accepts subsequent documents** (invoice, warehouse receipt) from the seller
3. **Triggers a CRE workflow** that reads the immutable PO from the chain, feeds it alongside the submitted document to an LLM, and writes an AI trade assessment onchain
4. **Produces permanent attestations** readable by financiers, regulators, and both trading parties

## Architecture

```
agenticflow/page.tsx (3 fetch() calls added to existing flow)
    │
    ├── POST /api/register-trade   (at PO acceptance)
    ├── POST /api/submit-invoice   (when invoice arrives)
    └── POST /api/submit-receipt   (when receipt arrives)
    │
    ▼
Gateway (Express, port 3002) → TradeRegistry.sol (Base Sepolia)
    │
    │ DocumentSubmitted event
    ▼
CRE Workflow:
    Phase 1: EVMClient.read → onchain PO + submitted document
    Phase 2: runInNodeMode → LLM assessment → BFT consensus
    Phase 3: EVMClient.write → attestation onchain
```

## Chainlink CRE Capabilities Used

| Capability | Purpose |
|---|---|
| EVM Log Trigger | Fires on `DocumentSubmitted` event |
| EVMClient.read | Read immutable PO + submitted document from chain |
| HTTPClient | Call LLM API (Gemini or any OpenAI-compatible) |
| runInNodeMode | Per-node LLM call for BFT consensus |
| consensusIdenticalAggregation | All DON nodes must agree on assessment |
| EVMClient.write | Write attestation onchain (CRE Forwarder only) |

## Chainlink Files

| File | Description |
|---|---|
| [`cre/trade-assess/src/workflow.ts`](cre/trade-assess/src/workflow.ts) | CRE workflow definition |
| [`cre/trade-assess/config.staging.json`](cre/trade-assess/config.staging.json) | CRE deployment config |
| [`contracts/TradeRegistry.sol`](contracts/TradeRegistry.sol) | Solidity contract with CRE Forwarder restriction |

## Prerequisites

- [CRE CLI](https://cre.chain.link) installed
- [Bun](https://bun.sh) v1.3+
- Node.js v20+
- Base Sepolia ETH (for gas) — [faucet](https://www.alchemy.com/faucets/base-sepolia)
- LLM API key — [Gemini](https://aistudio.google.com/api-keys) (free)

Hardhat is installed as a local dev dependency — no global install needed.

## Setup

```bash
# 1. Install dependencies
cd gateway && npm install && cd ..
cd cre/trade-assess && npm install && cd ../..
cd contracts && npm install && cd ..

# 2. Copy and fill environment variables
cp .env.example .env
# Edit .env with your keys

# 3. Compile TradeRegistry.sol
cd contracts && npx hardhat compile

# 4. Deploy TradeRegistry.sol to Base Sepolia
npx hardhat run scripts/deploy.ts --network baseSepolia

# 5. Update .env with deployed contract address
# TRADE_REGISTRY_ADDRESS=0x<deployed_address>

# 6. Verify on Basescan (optional)
npx hardhat verify --network baseSepolia 0x<deployed_address> 0x82300bd7c3958625581cc2f77bc6464dcecdf3e5
cd ..

# 7. Start the gateway
cd gateway && npx tsx index.ts

# 8. Simulate the CRE workflow
cd ../cre/trade-assess && cre simulate --env ../../.env
```

See [SETUP.md](SETUP.md) for detailed step-by-step instructions with expected outputs and troubleshooting.

## Blockchain Constants

| Constant | Value | Source |
|---|---|---|
| Base Sepolia CRE Forwarder | `0x82300bd7c3958625581cc2f77bc6464dcecdf3e5` | [x402-cre-price-alerts](https://github.com/smartcontractkit/x402-cre-price-alerts) |
| Base Sepolia Chain Selector | `16015286601757825753` | [CRE Supported Networks](https://docs.chain.link/cre/supported-networks-ts) |

## References

- [CRE SDK Reference](https://docs.chain.link/cre/reference/sdk/core-ts)
- [CRE Bootcamp 2026](https://github.com/smartcontractkit/cre-bootcamp-2026)
- [x402-cre-price-alerts](https://github.com/smartcontractkit/x402-cre-price-alerts)
- [CRE Supported Networks](https://docs.chain.link/cre/supported-networks-ts)
- [Convergence Hackathon Prizes](https://chain.link/hackathon/prizes)
