/**
 * Simple Agent Card Server
 * 
 * Serves agent cards at well-known URLs:
 * - Buyer:  http://localhost:9090/.well-known/agent-card.json
 * - Seller: http://localhost:8080/.well-known/agent-card.json
 * 
 * Usage: node serve-agent-cards.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Relative path to agent cards from unified-app
const AGENT_CARDS_DIR = path.join(__dirname, '..', 'Legent', 'A2A', 'agent-cards');

// Agent card configurations
const agents = {
  buyer: {
    port: 9090,
    cardFile: 'tommyBuyerAgent-card.json',
    name: 'Tommy Buyer Agent'
  },
  seller: {
    port: 8080,
    cardFile: 'jupiterSellerAgent-card.json',
    name: 'Jupiter Seller Agent'
  }
};

function createServer(agentType, config) {
  const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Only serve GET requests to the well-known path
    if (req.method === 'GET' && req.url === '/.well-known/agent-card.json') {
      const cardPath = path.join(AGENT_CARDS_DIR, config.cardFile);
      
      fs.readFile(cardPath, 'utf8', (err, data) => {
        if (err) {
          console.error(`[${agentType}] Error reading ${config.cardFile}:`, err.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to read agent card', details: err.message }));
          return;
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
        console.log(`[${agentType}] Served agent card: ${config.cardFile}`);
      });
    } else {
      // Return helpful info for other paths
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        agent: config.name,
        type: agentType,
        wellKnownUrl: `http://localhost:${config.port}/.well-known/agent-card.json`,
        message: 'Access the well-known URL for the agent card'
      }));
    }
  });

  server.listen(config.port, () => {
    console.log(`✅ ${config.name} server running at http://localhost:${config.port}`);
    console.log(`   └─ Agent card: http://localhost:${config.port}/.well-known/agent-card.json`);
    console.log(`   └─ Source file: ${path.join(AGENT_CARDS_DIR, config.cardFile)}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${config.port} is already in use for ${config.name}`);
    } else {
      console.error(`❌ Error starting ${config.name} server:`, err.message);
    }
  });

  return server;
}

// Check if agent cards directory exists
if (!fs.existsSync(AGENT_CARDS_DIR)) {
  console.error(`❌ Agent cards directory not found: ${AGENT_CARDS_DIR}`);
  console.log('   Expected relative path: ../Legent/A2A/agent-cards');
  process.exit(1);
}

console.log('🚀 Starting Agent Card Servers...');
console.log(`   Agent cards directory: ${AGENT_CARDS_DIR}\n`);

// Start both servers
const buyerServer = createServer('buyer', agents.buyer);
const sellerServer = createServer('seller', agents.seller);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down agent card servers...');
  buyerServer.close();
  sellerServer.close();
  process.exit(0);
});

console.log('\n📋 Available Agent Cards:');
console.log('─────────────────────────────────────────────────────────');
