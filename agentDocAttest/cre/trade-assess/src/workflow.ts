// ============================================
// DocAttest CRE Workflow — AI Trade Assessment
//
// Trigger: EVM Log on DocumentSubmitted(tradeId, docType)
// Phase 1: EVMClient.read → original PO + submitted document from chain
// Phase 2: runInNodeMode → LLM trade assessment → consensusIdentical
// Phase 3: EVMClient.write → writeAttestation onchain
//
// Pattern source: github.com/smartcontractkit/cre-bootcamp-2026
//   (prediction-market/my-workflow/src/workflow.ts)
// CRE SDK reference: docs.chain.link/cre/reference/sdk/core-ts
// ============================================

import * as cre from "@chainlink/cre-sdk";
import { z } from "zod";

// ============================================
// Configuration Schema
// Validated by CRE SDK at deployment time
// Pattern: cre-bootcamp-2026/prediction-market/my-workflow/src/workflow.ts
// ============================================
const configSchema = z.object({
  tradeRegistryAddress: z.string().describe("TradeRegistry.sol deployed address on Base Sepolia"),
  chainSelector: z.string().describe("Base Sepolia chain selector: 16015286601757825753"),
  llmApiUrl: z.string().describe("LLM API endpoint (Gemini or any OpenAI-compatible)"),
  llmApiKey: z.string().describe("LLM API key"),
});

type Config = z.infer<typeof configSchema>;

// ============================================
// TradeRegistry.sol ABI — only what CRE needs to read/write
// ============================================
const TRADE_REGISTRY_ABI = [
  "function getTrade(uint256 tradeId) view returns (tuple(string poData, bytes32 poHash, address buyer, address seller, uint256 registeredAt, uint256 registeredBlock))",
  "function getDocument(uint256 tradeId, uint8 docType) view returns (tuple(uint8 docType, string docData, bytes32 docHash, uint256 submittedAt))",
  "function writeAttestation(uint256 tradeId, uint8 docType, uint256 tradeScore, string recommendation, string findings) external",
  "event DocumentSubmitted(uint256 indexed tradeId, uint8 docType)",
];

// ============================================
// LLM Prompt Builder
// Constructs the trade assessment prompt from onchain data
// ============================================
function buildAssessmentPrompt(
  poData: string,
  docData: string,
  docType: number,
  buyer: string,
  seller: string,
  registeredBlock: number
): string {
  const docTypeName = docType === 1 ? "INVOICE" : "WAREHOUSE RECEIPT";

  return `You are a trade finance auditor for a B2B marketplace. Assess this trade by comparing the submitted ${docTypeName} against the original purchase order that was locked onchain at the time of mutual acceptance.

BUYER: TOMMY HILFIGER EUROPE B.V. (Wallet: ${buyer})
SELLER: JUPITER KNITTING COMPANY (Wallet: ${seller})

ORIGINAL PURCHASE ORDER (locked onchain at block ${registeredBlock}):
${poData}

${docTypeName} SUBMITTED BY SELLER:
${docData}

Assess this trade on:
1. Document consistency — do items, quantities, and prices match the original PO?
2. Specification completeness — are product specifications (e.g. 'Organic') mentioned consistently?
3. Tax and payment structure — are tax rates and milestone percentages reasonable?
4. Timeline reasonableness — are dates realistic for the type of goods and trade route?
5. Trade route assessment — are delivery terms appropriate for the origin and destination?
6. Inspector and quality verification — for warehouse receipts, does the inspection cover required checks?
7. Any red flags or missing information?

Respond ONLY with JSON (no markdown, no backticks, no preamble):
{
  "tradeScore": <integer 0-100>,
  "recommendation": "APPROVE" or "REVIEW",
  "findings": [
    { "area": "<area name>", "status": "GOOD" or "FLAG" or "INFO", "detail": "<brief explanation>" }
  ]
}`;
}

// ============================================
// CRE Workflow Definition
// Pattern: cre-bootcamp-2026/prediction-market/my-workflow/src/workflow.ts
// ============================================
const workflow = cre.workflow({
  name: "doc-attest-trade-assess",
  config: configSchema,
  handlers: [
    // ============================================
    // Handler: EVM Log Trigger on DocumentSubmitted
    // Fires when gateway submits an invoice or receipt to TradeRegistry
    // Pattern: cre-bootcamp-2026 uses SettlementRequested event
    // ============================================
    cre.handler({
      trigger: cre.triggers.evmLogTrigger({
        contractAddress: cre.configRef("tradeRegistryAddress"),
        chainSelector: cre.configRef("chainSelector"),
        abi: TRADE_REGISTRY_ABI,
        eventName: "DocumentSubmitted",
      }),

      action: async (runtime: cre.RuntimeContext<Config>, trigger: cre.TriggerOutput) => {
        // Extract event parameters from the log trigger
        const tradeId = trigger.event.args.tradeId;
        const docType = trigger.event.args.docType;
        const config = runtime.config;

        console.log(`📡 DocumentSubmitted event: tradeId=${tradeId}, docType=${docType}`);

        // ============================================
        // Phase 1: EVMClient.read — Read onchain PO + submitted document
        // Pattern: cre-bootcamp-2026 reads market state with EVMClient
        // ============================================
        const evmClient = new cre.capabilities.EVMClient({
          chainSelector: config.chainSelector,
        });

        // Read the original PO (locked at acceptance — immutable)
        const tradeData = await evmClient.read({
          contractAddress: config.tradeRegistryAddress,
          abi: TRADE_REGISTRY_ABI,
          method: "getTrade",
          args: [tradeId],
        });

        // Read the submitted document (invoice or receipt)
        const docData = await evmClient.read({
          contractAddress: config.tradeRegistryAddress,
          abi: TRADE_REGISTRY_ABI,
          method: "getDocument",
          args: [tradeId, docType],
        });

        const poDataStr = tradeData.poData;
        const docDataStr = docData.docData;
        const buyer = tradeData.buyer;
        const seller = tradeData.seller;
        const registeredBlock = Number(tradeData.registeredBlock);

        console.log(`✅ Phase 1: Read onchain PO (block ${registeredBlock}) + document`);

        // ============================================
        // Phase 2: runInNodeMode → LLM Assessment
        // Each DON node independently calls the LLM
        // Pattern: cre-bootcamp-2026 calls Gemini with runInNodeMode
        // ============================================
        const assessmentResult = await runtime.runInNodeMode(
          async (nodeRuntime: cre.NodeRuntime) => {
            const httpClient = new cre.capabilities.HTTPClient();

            const prompt = buildAssessmentPrompt(
              poDataStr,
              docDataStr,
              Number(docType),
              buyer,
              seller,
              registeredBlock
            );

            // Call LLM — Gemini API format (proven in cre-bootcamp-2026)
            // For OpenAI-compatible endpoints, adjust the request body format
            const llmResponse = await httpClient.execute({
              url: `${config.llmApiUrl}?key=${config.llmApiKey}`,
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0, // Deterministic — required for BFT consensus
                  topP: 1,
                  maxOutputTokens: 1024,
                },
              }),
            });

            // Parse Gemini response format
            const responseBody = JSON.parse(llmResponse.body);
            const llmText = responseBody.candidates[0].content.parts[0].text;

            // Clean any markdown formatting the LLM might add
            const cleanedText = llmText
              .replace(/```json\s*/g, "")
              .replace(/```\s*/g, "")
              .trim();

            return cleanedText;
          },
          // BFT consensus: all DON nodes must return identical assessment
          // Pattern: cre-bootcamp-2026 uses consensusIdenticalAggregation
          cre.aggregations.consensusIdentical<string>()
        );

        const assessment = JSON.parse(assessmentResult);

        console.log(`✅ Phase 2: LLM assessment complete`);
        console.log(`   Score: ${assessment.tradeScore}/100`);
        console.log(`   Recommendation: ${assessment.recommendation}`);
        console.log(`   Findings: ${assessment.findings.length} items`);

        // ============================================
        // Phase 3: EVMClient.write → Write attestation onchain
        // Pattern: cre-bootcamp-2026 writes settlement with EVMClient
        // Only CRE Forwarder can call writeAttestation()
        // ============================================
        const findingsStr = JSON.stringify(assessment.findings);

        await evmClient.write({
          contractAddress: config.tradeRegistryAddress,
          abi: TRADE_REGISTRY_ABI,
          method: "writeAttestation",
          args: [
            tradeId,
            docType,
            assessment.tradeScore,
            assessment.recommendation,
            findingsStr,
          ],
        });

        console.log(`✅ Phase 3: Attestation written onchain`);
        console.log(`   TradeAttested(${tradeId}, ${docType}, ${assessment.tradeScore})`);
      },
    }),
  ],
});

export default workflow;
