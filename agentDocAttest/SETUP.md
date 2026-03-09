# DocAttest V6 — Step-by-Step: Compile, Deploy, Test

## Prerequisites Checklist

Before starting, verify these tools are installed:

```bash
# Node.js v20+
node --version    # Must be >= 20.0.0

# Bun v1.3+ (required by CRE SDK)
# Install: https://bun.sh
bun --version     # Must be >= 1.3.0

# CRE CLI
# Install: https://cre.chain.link
cre --version
```

Hardhat is installed as a local dev dependency — no global install needed.

### Keys & Funds You Need

| What | Where to Get | Notes |
|---|---|---|
| Base Sepolia ETH | https://www.alchemy.com/faucets/base-sepolia | Need ~0.1 ETH for contract deploy + transactions |
| Gemini API Key | https://aistudio.google.com/api-keys | Free, click "Create API Key" |
| Private Key | Your MetaMask (Base Sepolia) | Export from MetaMask → Account Details → Export Private Key |

---

## Step 1: Install Gateway Dependencies

```bash
cd C:\SATHYA\CHAINAIM3003\mcp-servers\CRE\CRE20\Converge-2\agentDocAttest\gateway
npm install
```

Expected: express, ethers, cors, dotenv, tsx, typescript installed.

## Step 2: Install CRE Workflow Dependencies

```bash
cd C:\SATHYA\CHAINAIM3003\mcp-servers\CRE\CRE20\Converge-2\agentDocAttest\cre\trade-assess
npm install
```

Expected: @chainlink/cre-sdk, zod, typescript installed.

## Step 3: Install Hardhat + Contract Dependencies

```bash
cd C:\SATHYA\CHAINAIM3003\mcp-servers\CRE\CRE20\Converge-2\agentDocAttest\contracts
npm install
```

Expected: hardhat, @nomicfoundation/hardhat-toolbox, dotenv installed.

## Step 4: Create .env File

```bash
cd C:\SATHYA\CHAINAIM3003\mcp-servers\CRE\CRE20\Converge-2\agentDocAttest
copy .env.example .env
```

Edit `.env` and fill in:

```bash
# Your private key (same key for CRE deploy and gateway transactions)
CRE_ETH_PRIVATE_KEY=0x<your_base_sepolia_private_key>
GATEWAY_PRIVATE_KEY=0x<your_base_sepolia_private_key>

# Gemini API key (free)
LLM_API_KEY=<your_gemini_api_key>

# Leave TRADE_REGISTRY_ADDRESS empty for now — we'll fill it after deploy
```

## Step 5: Compile TradeRegistry.sol with Hardhat

```bash
cd C:\SATHYA\CHAINAIM3003\mcp-servers\CRE\CRE20\Converge-2\agentDocAttest\contracts
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file successfully (solc 0.8.24)
```

Artifacts are generated in `contracts/artifacts/TradeRegistry.sol/TradeRegistry.json`.

## Step 6: Deploy TradeRegistry.sol to Base Sepolia

```bash
cd C:\SATHYA\CHAINAIM3003\mcp-servers\CRE\CRE20\Converge-2\agentDocAttest\contracts
npx hardhat run scripts/deploy.ts --network baseSepolia
```

Expected output:
```
============================================
  DocAttest — TradeRegistry.sol Deployment
  Network: Base Sepolia (Chain ID 84532)
============================================

Deployer: 0x<your_address>
Balance:  0.0XX ETH

CRE Forwarder: 0x82300bd7c3958625581cc2f77bc6464dcecdf3e5
Deploying TradeRegistry...

============================================
✅ TradeRegistry deployed to: 0x<CONTRACT_ADDRESS>
============================================

Next steps:
  1. Update .env: TRADE_REGISTRY_ADDRESS=0x<CONTRACT_ADDRESS>
  2. View on Basescan: https://sepolia.basescan.org/address/0x<CONTRACT_ADDRESS>
  3. Verify (optional):
     npx hardhat verify --network baseSepolia 0x<CONTRACT_ADDRESS> 0x82300bd7c3958625581cc2f77bc6464dcecdf3e5
```

## Step 7: Update .env with Deployed Contract Address

Edit `agentDocAttest/.env`:

```bash
TRADE_REGISTRY_ADDRESS=0x<CONTRACT_ADDRESS_FROM_STEP_6>
```

## Step 8: Verify on Basescan (Optional but Recommended)

```bash
cd C:\SATHYA\CHAINAIM3003\mcp-servers\CRE\CRE20\Converge-2\agentDocAttest\contracts
npx hardhat verify --network baseSepolia 0x<CONTRACT_ADDRESS> 0x82300bd7c3958625581cc2f77bc6464dcecdf3e5
```

For Basescan verification you need an API key from https://basescan.org/myapikey.
Add it to `.env` as `BASESCAN_API_KEY=<your_key>`.

Or verify manually at: https://sepolia.basescan.org/address/0x<CONTRACT_ADDRESS>#code

## Step 9: Start the Gateway

```bash
cd C:\SATHYA\CHAINAIM3003\mcp-servers\CRE\CRE20\Converge-2\agentDocAttest\gateway
npx tsx index.ts
```

Expected output:
```
🚀 DocAttest Gateway running on http://localhost:3002
   Contract: 0x<your_contract_address>
   RPC: https://sepolia.base.org

   Endpoints:
   POST /api/register-trade    — Lock PO onchain
   POST /api/submit-invoice    — Submit invoice for CRE assessment
   POST /api/submit-receipt    — Submit receipt for CRE assessment
   GET  /api/attestation/:id/:type — Read CRE attestation
   GET  /api/trade/:id         — Read trade details
   GET  /health                — Health check
```

## Step 10: Test the Gateway (Curl Only — No UI)

Open a NEW terminal and test each endpoint:

### 10a. Health Check

```bash
curl http://localhost:3002/health
```

Expected: `{"status":"ok","service":"DocAttest Gateway","contract":"0x...","rpc":"https://sepolia.base.org"}`

### 10b. Register a Trade (Lock PO Onchain)

```bash
curl -X POST http://localhost:3002/api/register-trade ^
  -H "Content-Type: application/json" ^
  -d "{\"po\":{\"poNumber\":\"PO-TEST-001\",\"items\":[{\"name\":\"Organic Cotton T-Shirts\",\"quantity\":1000,\"unitPrice\":100,\"total\":100000}],\"totalAmount\":100000,\"deliveryTerms\":\"FOB Mumbai Port\",\"paymentTerms\":\"20%% upfront, balance on milestones\",\"deliveryDate\":\"2026-04-08\"},\"buyer\":\"0x0c5e419D592d116bD9cE3DeE3D613F8b166e42EE\",\"seller\":\"0x30e1557AB6420E3257A23721B06d7FA3994aB516\"}"
```

Expected: `{"success":true,"tradeId":"0","txHash":"0x...","blockNumber":...,"message":"PO PO-TEST-001 locked onchain as trade 0"}`

**Note the tradeId** — use it in the next calls.

### 10c. Submit an Invoice

```bash
curl -X POST http://localhost:3002/api/submit-invoice ^
  -H "Content-Type: application/json" ^
  -d "{\"tradeId\":0,\"invoice\":{\"invoiceNumber\":\"INV-TEST-001\",\"poNumber\":\"PO-TEST-001\",\"items\":[{\"name\":\"Organic Cotton T-Shirts\",\"quantity\":1000,\"unitPrice\":100,\"total\":100000}],\"subtotal\":0.50,\"tax\":0.09,\"totalAmount\":0.59,\"dueDate\":\"2026-03-23\",\"notes\":\"Order processed and ready for shipment\"}}"
```

Expected: `{"success":true,"tradeId":0,"docType":"INVOICE","txHash":"0x...","message":"Invoice INV-TEST-001 submitted for CRE assessment"}`

### 10d. Submit a Warehouse Receipt

```bash
curl -X POST http://localhost:3002/api/submit-receipt ^
  -H "Content-Type: application/json" ^
  -d "{\"tradeId\":0,\"receipt\":{\"receiptNumber\":\"WR-TEST-001\",\"poNumber\":\"PO-TEST-001\",\"invoiceNumber\":\"INV-TEST-001\",\"items\":[{\"name\":\"Organic Cotton T-Shirts\",\"quantity\":1000,\"warehouseLocation\":\"Warehouse A - Bay 12\"}],\"receivedDate\":\"2026-03-08\",\"inspector\":\"Raj Kumar - Quality Inspector\",\"notes\":\"All items inspected and ready for dispatch\"}}"
```

Expected: `{"success":true,"tradeId":0,"docType":"RECEIPT","txHash":"0x...",...}`

### 10e. Read Trade from Chain

```bash
curl http://localhost:3002/api/trade/0
```

Expected: Returns the full PO JSON that was locked onchain, with buyer/seller addresses and block number.

### 10f. Verify on Basescan

Open: `https://sepolia.basescan.org/address/0x<CONTRACT_ADDRESS>#events`

You should see:
- `TradeRegistered(0, poHash, buyer, seller)` — from step 10b
- `DocumentSubmitted(0, 1)` — from step 10c (docType 1 = INVOICE)
- `DocumentSubmitted(0, 2)` — from step 10d (docType 2 = RECEIPT)

## Step 11: Simulate the CRE Workflow

```bash
cd C:\SATHYA\CHAINAIM3003\mcp-servers\CRE\CRE20\Converge-2\agentDocAttest\cre\trade-assess
cre simulate --env ../../.env
```

This will:
1. Watch for `DocumentSubmitted` events on your contract
2. Read the onchain PO + submitted document (EVMClient.read)
3. Call Gemini with the assessment prompt (HTTPClient)
4. Write the attestation onchain (EVMClient.write via CRE Forwarder)

**Important:** `cre simulate` needs to be running WHEN the `DocumentSubmitted` event fires. So:
1. Start `cre simulate` first
2. THEN submit documents via curl (repeat steps 10c and 10d)

### After CRE Writes the Attestation — Read It

```bash
# Read invoice attestation
curl http://localhost:3002/api/attestation/0/INVOICE

# Read receipt attestation
curl http://localhost:3002/api/attestation/0/RECEIPT
```

Expected:
```json
{
  "success": true,
  "tradeId": 0,
  "docType": "INVOICE",
  "attestation": {
    "tradeScore": 85,
    "recommendation": "APPROVE",
    "findings": "[{\"area\":\"Document Consistency\",\"status\":\"GOOD\",\"detail\":\"...\"},...]",
    "attestedAt": 1741427200
  }
}
```

## Step 12: Test with the Full UI

Make sure ALL of these are running in separate terminals:

```
Terminal 1: Docker (KERI/vLEI)
  cd Converge-2\ConvergeLEI
  docker compose up -d

Terminal 2: ChainAim API (port 4000)
  cd Converge-2\ConvergeLEI\api-server
  npm start

Terminal 3: Agent card servers (ports 8080 + 9090)
  (Start buyer agent on 9090 and seller agent on 8080)

Terminal 4: DocAttest Gateway (port 3002)
  cd Converge-2\agentDocAttest\gateway
  npx tsx index.ts

Terminal 5: Next.js UI
  cd Converge-2\Converge2-app
  npm run dev

Terminal 6 (optional): CRE simulate
  cd Converge-2\agentDocAttest\cre\trade-assess
  cre simulate --env ../../.env
```

Then in the browser:
1. Go to `http://localhost:3000/agenticflow`
2. Type "fetch my agent" → "fetch seller agent" → "send po"
3. Watch the buyer chat — you should see new messages alongside the existing flow:
   - `📋 DocAttest: PO registered onchain as trade #0 (block XXXXX)`
   - `📋 DocAttest: Invoice submitted for CRE AI assessment (trade #0)`
   - `📋 DocAttest: Receipt submitted for CRE AI assessment (trade #0)`
4. Check the gateway terminal for onchain transaction confirmations
5. If `cre simulate` is running, the LLM assessment executes and attestation is written

## Step 13: Read Attestation Directly from Chain (No Gateway Needed)

After CRE writes the attestation, anyone can read it using the Hardhat console:

```bash
cd C:\SATHYA\CHAINAIM3003\mcp-servers\CRE\CRE20\Converge-2\agentDocAttest\contracts
npx hardhat console --network baseSepolia
```

Then in the console:

```javascript
const registry = await ethers.getContractAt("TradeRegistry", "0x<CONTRACT_ADDRESS>");

// Read trade (the immutable PO)
const trade = await registry.getTrade(0);
console.log("PO Data:", trade.poData);
console.log("Block:", trade.registeredBlock.toString());

// Read invoice attestation (docType 1 = INVOICE)
const invoiceAttest = await registry.getAttestation(0, 1);
console.log("Score:", invoiceAttest.tradeScore.toString());
console.log("Recommendation:", invoiceAttest.recommendation);
console.log("Findings:", invoiceAttest.findings);

// Read receipt attestation (docType 2 = RECEIPT)
const receiptAttest = await registry.getAttestation(0, 2);
console.log("Score:", receiptAttest.tradeScore.toString());
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `npx hardhat compile` fails with import errors | Make sure you ran `npm install` in `contracts/` |
| `npx hardhat run scripts/deploy.ts` says "insufficient funds" | Get Base Sepolia ETH from faucet: https://www.alchemy.com/faucets/base-sepolia |
| Deploy says "could not detect network" | Check `BASE_SEPOLIA_RPC_URL` in `.env` — default `https://sepolia.base.org` should work |
| Deploy says "no signers available" | Check `CRE_ETH_PRIVATE_KEY` in `.env` — must start with `0x` |
| Gateway says "TRADE_REGISTRY_ADDRESS not set" | Fill in the address from Step 6 in `.env` |
| Gateway says "GATEWAY_PRIVATE_KEY not set" | Add your private key to `.env` |
| `DocumentSubmitted` event fires but CRE doesn't trigger | Make sure `cre simulate` was started BEFORE the event |
| LLM returns non-JSON (consensus fails) | Check `LLM_API_KEY` is valid; Gemini free tier may rate-limit |
| UI doesn't show "📋 DocAttest" messages | Gateway not running on port 3002, or contract not deployed |
| UI shows DocAttest messages but "gateway not available" in console | Gateway crashed — restart Terminal 4 |
| Hardhat verify fails | You need a Basescan API key — get one at https://basescan.org/myapikey |

---

## What Success Looks Like

When everything works end-to-end:

1. **Basescan** shows `TradeRegistered`, `DocumentSubmitted`, and `TradeAttested` events on your contract
2. **Gateway terminal** shows `✅ Trade registered onchain`, `✅ Invoice submitted onchain`, `✅ Receipt submitted onchain`
3. **CRE simulate terminal** shows Phase 1 (read), Phase 2 (LLM), Phase 3 (write attestation)
4. **UI chat** shows `📋 DocAttest: PO registered onchain as trade #0` messages
5. **`curl /api/attestation/0/INVOICE`** returns a real AI assessment with score and findings
6. **Hardhat console `getAttestation(0, 1)`** returns the same data directly from the chain — readable by anyone, forever

---

## File Summary

```
agentDocAttest/
├── .env.example                          # Environment template
├── .env                                  # Your filled-in config (Step 4)
├── package.json                          # Workspace root
├── README.md                             # Hackathon docs
├── SETUP.md                              # This file
├── gateway/
│   ├── package.json                      # express, ethers, dotenv, cors
│   ├── tsconfig.json
│   └── index.ts                          # Marketplace API (port 3002)
├── cre/
│   └── trade-assess/
│       ├── package.json                  # @chainlink/cre-sdk, zod
│       ├── config.staging.json           # CRE deployment config
│       └── src/
│           └── workflow.ts               # CRE workflow: Log → Read → LLM → Write
└── contracts/
    ├── package.json                      # hardhat, @nomicfoundation/hardhat-toolbox
    ├── hardhat.config.ts                 # Base Sepolia network config
    ├── TradeRegistry.sol                 # Solidity contract
    └── scripts/
        └── deploy.ts                     # Hardhat deploy script
```
