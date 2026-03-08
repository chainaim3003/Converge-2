import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import path from "path";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from seller-agent/.env
dotenv.config({ path: path.join(__dirname, '.env') });

import { A2AClient } from "@a2a-js/sdk/client";
import type { InvoiceSchema, InvoiceMessage, PurchaseOrderMessage, POAcceptanceMessage, WarehouseReceiptMessage } from '../../types/invoice.js';


import {
  AgentCard,
  Task,
  TaskStatusUpdateEvent,
  Message
} from "@a2a-js/sdk";
import {
  InMemoryTaskStore,
  TaskStore,
  AgentExecutor,
  RequestContext,
  ExecutionEventBus,
  DefaultRequestHandler,
} from "@a2a-js/sdk/server";
import { A2AExpressApp } from "@a2a-js/sdk/server/express";

/**
 * Payment Configuration Helper
 * Provides backward compatibility while supporting new naming
 */
function getPaymentConfig() {
  // Currency: PAYMENT_CURRENCY (new) or INVOICE_CURRENCY (backward compat)
  const currency = process.env.PAYMENT_CURRENCY || process.env.INVOICE_CURRENCY || 'ALGO';
  
  // Total trade amount: TRADE_AMOUNT (new) or INVOICE_AMOUNT (backward compat)
  const tradeAmount = parseFloat(
    process.env.TRADE_AMOUNT || process.env.INVOICE_AMOUNT || '10.0'
  );
  
  // Stage percentages (defaults for 3-stage payment)
  const poPercent = parseFloat(process.env.PAYMENT_STAGE_PO_PERCENT || '20');
  const invoicePercent = parseFloat(process.env.PAYMENT_STAGE_INVOICE_PERCENT || '50');
  const receiptPercent = parseFloat(process.env.PAYMENT_STAGE_RECEIPT_PERCENT || '30');
  
  // Calculate stage amounts
  const poAmount = (tradeAmount * poPercent) / 100;
  const invoiceAmount = (tradeAmount * invoicePercent) / 100;
  const receiptAmount = (tradeAmount * receiptPercent) / 100;
  
  return {
    currency,
    tradeAmount,
    stages: {
      po: { percent: poPercent, amount: poAmount },
      invoice: { percent: invoicePercent, amount: invoiceAmount },
      receipt: { percent: receiptPercent, amount: receiptAmount }
    }
  };
}

/**
 * Simple Seller Agent Executor
 */
class SellerAgentExecutor implements AgentExecutor {
  private cancelledTasks = new Set<string>();

  public cancelTask = async (
    taskId: string,
    eventBus: ExecutionEventBus,
  ): Promise<void> => {
    this.cancelledTasks.add(taskId);
  };

  async execute(
    requestContext: RequestContext,
    eventBus: ExecutionEventBus
  ): Promise<void> {
    const userMessage = requestContext.userMessage;
    const existingTask = requestContext.task;

    const taskId = existingTask?.id || uuidv4();
    const contextId = userMessage.contextId || existingTask?.contextId || uuidv4();

    console.log(`[SellerAgent] Processing message ${userMessage.messageId} for task ${taskId}`);

    // 1. Publish initial Task event if it's a new task
    if (!existingTask) {
      const initialTask: Task = {
        kind: 'task',
        id: taskId,
        contextId: contextId,
        status: {
          state: "submitted",
          timestamp: new Date().toISOString(),
        },
        history: [userMessage],
        metadata: userMessage.metadata,
      };
      eventBus.publish(initialTask);
    }

    // 2. Publish "working" status
    const workingStatusUpdate: TaskStatusUpdateEvent = {
      kind: 'status-update',
      taskId: taskId,
      contextId: contextId,
      status: {
        state: "working",
        message: {
          kind: 'message',
          role: 'agent',
          messageId: uuidv4(),
          parts: [{ kind: 'text', text: 'Jupiter Agent processing your request...' }],
          taskId: taskId,
          contextId: contextId,
        },
        timestamp: new Date().toISOString(),
      },
      final: false,
    };
    eventBus.publish(workingStatusUpdate);

    try {
      // Simple response based on the user's message
      const userText = userMessage.parts
        .filter(p => p.kind === 'text')
        .map(p => (p as any).text)
        .join(' ')
        .toLowerCase();

      let responseText = "Hello! I'm Jupiter Agent, a seller agent. I can help you with product information.";

      // ========== CHECK FOR INCOMING DATA MESSAGES (PO from Buyer) ==========
      const dataParts = userMessage.parts.filter((p) => p.kind === "data");
      
      if (dataParts.length > 0) {
        const docData = (dataParts[0] as any).data;
        
        // ========== STAGE 1: RECEIVE PURCHASE ORDER FROM BUYER ==========
        if (docData.stage === 1 && docData.poId) {
          const poData = docData as PurchaseOrderMessage;
          console.log('[SellerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('[SellerAgent] 📋 PURCHASE ORDER RECEIVED FROM BUYER');
          console.log('[SellerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(`[SellerAgent] PO ID: ${poData.poId}`);
          console.log(`[SellerAgent] Amount: ${poData.amount} ${poData.currency} (20%)`);
          console.log(`[SellerAgent] Total: ${poData.tradeTotal} ${poData.currency}`);
          console.log(`[SellerAgent] From: ${poData.senderAgent.name}`);
          
          // Auto-accept and send PO Acceptance back to buyer
          const poAcceptance: POAcceptanceMessage = {
            acceptanceId: `POA-${Date.now()}-${uuidv4().substring(0, 8)}`,
            poId: poData.poId,
            status: 'accepted',
            seller: {
              name: jupiterAgentCard.name,
              agentAID: jupiterAgentCard.extensions?.keriIdentifiers?.agentAID || 'UNKNOWN',
              walletAddress: process.env.SELLER_ADDRESS || ''
            },
            buyer: {
              name: poData.senderAgent.name,
              agentAID: poData.senderAgent.agentAID
            },
            acceptanceDetails: {
              estimatedDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              paymentInstructions: `Payment to: ${process.env.SELLER_ADDRESS}`,
              notes: 'Order accepted and will be processed'
            },
            timestamp: new Date().toISOString(),
            nextStage: {
              stage: 'invoice',
              expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
          };
          
          try {
            const buyerAgentUrl = process.env.BUYER_AGENT_URL || 'http://localhost:9090';
            const buyerClient = new A2AClient(buyerAgentUrl);
            
            console.log(`[SellerAgent] Sending PO ACCEPTANCE to buyer...`);
            
            await buyerClient.sendMessage({
              role: "agent",
              parts: [{ kind: "data", data: poAcceptance }]
            });
            
            responseText = `
✅ PURCHASE ORDER ACCEPTED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RECEIVED PO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PO ID: ${poData.poId}
Amount: ${poData.currency} ${poData.amount} (20%)
Total: ${poData.currency} ${poData.tradeTotal}
From Buyer: ${poData.senderAgent.name}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ACCEPTANCE SENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Acceptance ID: ${poAcceptance.acceptanceId}
Status: ACCEPTED
Expected Delivery: ${poAcceptance.acceptanceDetails?.estimatedDeliveryDate}
Next: Invoice will be sent after buyer payment

⏳ Waiting for buyer's 20% payment...
            `.trim();
            
            console.log('[SellerAgent] PO Acceptance sent successfully');
            
          } catch (error: any) {
            console.error('[SellerAgent] Error sending PO Acceptance:', error);
            responseText = `❌ Failed to send PO Acceptance: ${error.message}`;
          }
        }
      } else if (userText.includes('product') || userText.includes('sell')) {
        responseText = "I have various products available. Our catalog includes electronics, clothing, and accessories. What are you interested in?";
      } else if (userText.includes('price') || userText.includes('cost')) {
        responseText = "Our prices are competitive! Please specify which product you're interested in for exact pricing.";
      } else if (userText.includes('hello') || userText.includes('hi')) {
        responseText = "Hello! I'm Jupiter Agent. How can I assist you with your purchase today?";
      } else if (userText.includes('send invoice') || userText.includes('invoice')) {
        console.log('[SellerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('[SellerAgent] 📄 STAGE 2: INVOICE');
        console.log('[SellerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Get payment configuration (supports both old and new env vars)
        const paymentConfig = getPaymentConfig();
        
        // For now, use invoice stage amount (50% of total)
        // Future: support different stages (PO=20%, Invoice=50%, Receipt=30%)
        const invoiceAmount = paymentConfig.stages.invoice.amount;
        
        console.log(`[SellerAgent] Payment Config:`);
        console.log(`  Trade Amount: ${paymentConfig.tradeAmount} ${paymentConfig.currency}`);
        console.log(`  Invoice Stage: ${invoiceAmount} ${paymentConfig.currency} (${paymentConfig.stages.invoice.percent}%)`);

        // Create invoice data
        const invoice: InvoiceMessage = {
          invoiceId: `INV-${uuidv4().substring(0, 8)}`,
          invoice: {
            amount: invoiceAmount,
            currency: paymentConfig.currency,
            dueDate: '2025-12-31',
            refUri: {
              type: 'transaction_hash',
              value: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
            },
            destinationAccount: {
              type: 'digital_asset',
              chainId: process.env.ALGORAND_GENESIS_ID || 'testnet-v1.0',
              walletAddress: process.env.SELLER_ADDRESS || ''
            }
          },
          timestamp: new Date().toISOString(),
          senderAgent: {
            name: jupiterAgentCard.name,
            agentAID: jupiterAgentCard.extensions?.keriIdentifiers?.agentAID || 'UNKNOWN'
          }
        };

        // Send invoice to buyer agent
        try {
          const buyerAgentUrl = process.env.BUYER_AGENT_URL || 'http://localhost:9090';
          console.log(`[SellerAgent] Connecting to buyer agent at: ${buyerAgentUrl}...`);

          console.log(`[SellerAgent] Connecting to buyer agent at ${buyerAgentUrl}...`);

          // Use direct URL for local testing (agent card URL field points to production domain)
          const buyerClient = new A2AClient(buyerAgentUrl);

          console.log(`[SellerAgent] Connected to buyer agent`);
          console.log(`[SellerAgent] Sending invoice to buyer...`);

          // Create message to send
          const stream = buyerClient.sendMessageStream({
            message: {
              kind: "message",
              role: "agent",
              messageId: uuidv4(),
              parts: [{ kind: "data", data: invoice }],
            },
          });

          let buyerResponse = '';

          // Listen for buyer's response
          for await (const event of stream) {
            if (event.kind === 'status-update' && event.status.message) {
              const responseText = event.status.message.parts
                .filter(p => p.kind === 'text')
                .map(p => (p as any).text)
                .join(' ');

              if (responseText) {
                buyerResponse = responseText;
              }
            }
          }

          responseText = `
📤 INVOICE SENT TO BUYER AGENT

Invoice Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Invoice ID: ${invoice.invoiceId}
- Amount: ${invoice.invoice.currency} ${invoice.invoice.amount}
- Due Date: ${invoice.invoice.dueDate}
- Chain: ${invoice.invoice.destinationAccount.chainId}
- Wallet: ${invoice.invoice.destinationAccount.walletAddress}
- Ref URI: ${invoice.invoice.refUri.type}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      ${buyerResponse ? `🔔 BUYER RESPONSE:\n${buyerResponse}` : '⏳ Waiting for buyer response...'}
                `.trim();

          console.log('[SellerAgent] Invoice sent and response received');

        } catch (error: any) {
          console.error('[SellerAgent] Error sending invoice:', error);
          responseText = `❌ Failed to send invoice: ${error.message}\n\nMake sure buyer agent is running at http://localhost:9090`;
        }

      } else if (userText.includes('send warehouse receipt') || userText.includes('send receipt')) {
        console.log('[SellerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('[SellerAgent] 📦 STAGE 3: WAREHOUSE RECEIPT');
        console.log('[SellerAgent] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const paymentConfig = getPaymentConfig();
        const receiptAmount = paymentConfig.stages.receipt.amount;

        console.log(`[SellerAgent] Trade Amount: ${paymentConfig.tradeAmount} ${paymentConfig.currency}`);
        console.log(`[SellerAgent] Receipt Stage: ${receiptAmount} ${paymentConfig.currency} (${paymentConfig.stages.receipt.percent}%)`);

        // Create Warehouse Receipt data
        const warehouseReceipt: WarehouseReceiptMessage = {
          receiptId: `WR-${uuidv4().substring(0, 8)}`,
          stage: 3,
          amount: receiptAmount,
          currency: paymentConfig.currency,
          tradeTotal: paymentConfig.tradeAmount,
          destinationAccount: {
            type: 'digital_asset',
            chainId: process.env.ALGORAND_GENESIS_ID || 'testnet-v1.0',
            walletAddress: process.env.SELLER_ADDRESS || ''
          },
          senderAgent: {
            name: jupiterAgentCard.name,
            agentAID: jupiterAgentCard.extensions?.keriIdentifiers?.agentAID || 'UNKNOWN'
          },
          timestamp: new Date().toISOString()
        };

        // Send warehouse receipt to buyer agent
        try {
          const buyerAgentUrl = process.env.BUYER_AGENT_URL || 'http://localhost:9090';
          console.log(`[SellerAgent] Connecting to buyer agent at: ${buyerAgentUrl}...`);

          const buyerClient = new A2AClient(buyerAgentUrl);
          console.log(`[SellerAgent] Sending Warehouse Receipt to buyer...`);

          const stream = buyerClient.sendMessageStream({
            message: {
              kind: "message",
              role: "agent",
              messageId: uuidv4(),
              parts: [{ kind: "data", data: warehouseReceipt }],
            },
          });

          let buyerResponse = '';

          for await (const event of stream) {
            if (event.kind === 'status-update' && event.status.message) {
              const responseText = event.status.message.parts
                .filter(p => p.kind === 'text')
                .map(p => (p as any).text)
                .join(' ');

              if (responseText) {
                buyerResponse = responseText;
              }
            }
          }

          responseText = `
📤 WAREHOUSE RECEIPT SENT TO BUYER AGENT

Receipt Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Receipt ID: ${warehouseReceipt.receiptId}
- Stage: 3 (Warehouse Receipt - Final Payment)
- Amount: ${warehouseReceipt.currency} ${warehouseReceipt.amount} (${paymentConfig.stages.receipt.percent}%)
- Trade Total: ${warehouseReceipt.currency} ${warehouseReceipt.tradeTotal}
- Chain: ${warehouseReceipt.destinationAccount.chainId}
- Wallet: ${warehouseReceipt.destinationAccount.walletAddress}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      ${buyerResponse ? `🔔 BUYER RESPONSE:\n${buyerResponse}` : '⏳ Waiting for buyer response...'}
                `.trim();

          console.log('[SellerAgent] Warehouse Receipt sent and response received');

        } catch (error: any) {
          console.error('[SellerAgent] Error sending Warehouse Receipt:', error);
          responseText = `❌ Failed to send Warehouse Receipt: ${error.message}\n\nMake sure buyer agent is running at http://localhost:9090`;
        }
      }
      // Check if cancelled
      if (this.cancelledTasks.has(taskId)) {
        const cancelledUpdate: TaskStatusUpdateEvent = {
          kind: 'status-update',
          taskId: taskId,
          contextId: contextId,
          status: {
            state: "canceled",
            timestamp: new Date().toISOString(),
          },
          final: true,
        };
        eventBus.publish(cancelledUpdate);
        return;
      }

      // 3. Publish final completed status
      const agentMessage: Message = {
        kind: 'message',
        role: 'agent',
        messageId: uuidv4(),
        parts: [{ kind: 'text', text: responseText }],
        taskId: taskId,
        contextId: contextId,
      };

      const finalUpdate: TaskStatusUpdateEvent = {
        kind: 'status-update',
        taskId: taskId,
        contextId: contextId,
        status: {
          state: "completed",
          message: agentMessage,
          timestamp: new Date().toISOString(),
        },
        final: true,
      };
      eventBus.publish(finalUpdate);

      console.log(`[SellerAgent] Task ${taskId} completed`);

    } catch (error: any) {
      console.error(`[SellerAgent] Error processing task ${taskId}:`, error);
      const errorUpdate: TaskStatusUpdateEvent = {
        kind: 'status-update',
        taskId: taskId,
        contextId: contextId,
        status: {
          state: "failed",
          message: {
            kind: 'message',
            role: 'agent',
            messageId: uuidv4(),
            parts: [{ kind: 'text', text: `Error: ${error.message}` }],
            taskId: taskId,
            contextId: contextId,
          },
          timestamp: new Date().toISOString(),
        },
        final: true,
      };
      eventBus.publish(errorUpdate);
    }
  }
}
// --- Server Setup ---

// Jupiter Agent Card with custom metadata
// Use environment variable if set, otherwise use relative path
const jupiterCardPath = process.env.AGENT_CARD_PATH 
  ? path.resolve(__dirname, process.env.AGENT_CARD_PATH)
  : path.resolve(__dirname, '../../../agent-cards/jupiterSellerAgent-card.json');

console.log(`[SellerAgent] Loading agent card from: ${jupiterCardPath}`);

const jupiterAgentCard: AgentCard = JSON.parse(
  fs.readFileSync(jupiterCardPath, "utf8")
);

async function main() {
  // Validate environment variables
  if (!process.env.SELLER_ADDRESS) {
    console.error('❌ ERROR: SELLER_ADDRESS not set in .env file');
    process.exit(1);
  }

  if (!process.env.ALGORAND_GENESIS_ID) {
    console.warn('⚠️  WARNING: ALGORAND_GENESIS_ID not set, using default: testnet-v1.0');
  }

  // Load and display payment configuration
  const paymentConfig = getPaymentConfig();
  
  console.log('✅ Environment variables loaded:');
  console.log(`   Seller Address: ${process.env.SELLER_ADDRESS}`);
  console.log(`   Chain ID: ${process.env.ALGORAND_GENESIS_ID}`);
  console.log(`\n💰 Payment Configuration:`);
  console.log(`   Trade Amount: ${paymentConfig.tradeAmount} ${paymentConfig.currency}`);
  console.log(`   3-Stage Breakdown:`);
  console.log(`     PO (${paymentConfig.stages.po.percent}%):      ${paymentConfig.stages.po.amount.toFixed(2)} ${paymentConfig.currency}`);
  console.log(`     Invoice (${paymentConfig.stages.invoice.percent}%): ${paymentConfig.stages.invoice.amount.toFixed(2)} ${paymentConfig.currency}`);
  console.log(`     Receipt (${paymentConfig.stages.receipt.percent}%): ${paymentConfig.stages.receipt.amount.toFixed(2)} ${paymentConfig.currency}`);
  console.log(`   Total: ${(paymentConfig.stages.po.amount + paymentConfig.stages.invoice.amount + paymentConfig.stages.receipt.amount).toFixed(2)} ${paymentConfig.currency} (100%)\n`);

  // 1. Create TaskStore
  const taskStore: TaskStore = new InMemoryTaskStore();

  // 2. Create AgentExecutor
  const agentExecutor: AgentExecutor = new SellerAgentExecutor();

  // 3. Create DefaultRequestHandler
  const requestHandler = new DefaultRequestHandler(
    jupiterAgentCard,
    taskStore,
    agentExecutor
  );

  // 4. Create and setup A2AExpressApp
  const appBuilder = new A2AExpressApp(requestHandler);
  const app = express();

  // Add CORS middleware to allow requests from UI
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  console.log(`[SellerAgent] CORS enabled for: ${corsOrigin}`);
  
  app.use(cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
  }));

  const expressApp = appBuilder.setupRoutes(app);

  // 5. Start the server
  const PORT = process.env.PORT || 8080;
  expressApp.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║          🪐 JUPITER AGENT (SELLER) STARTED 🪐             ║
╠════════════════════════════════════════════════════════════╣
║  Name:       ${jupiterAgentCard.name}                     
║  Agent AID:  ${jupiterAgentCard.extensions?.keriIdentifiers?.agentAID}                   
║  OOR Role:   ${jupiterAgentCard.extensions?.gleifIdentity?.officialRole || 'N/A'}
╠════════════════════════════════════════════════════════════╣
║  Agent Card: http://localhost:${PORT}/.well-known/agent-card.json
║  Status:     🟢 READY                                      
║  Feature:    Can receive buyer inquiries!                  
╚════════════════════════════════════════════════════════════╝

💡 Try saying: "fetch buyer agent"
`);
  });
}

main().catch(console.error);
