# XRP TITAN - Trade Finance Platform

## 💎 Powered by XRP Ledger

Enterprise-grade trade finance platform with KERI/vLEI verification, built on XRP Ledger blockchain.

---

## 🚀 Quick Start

```bash
cd unified-app
npm install
npm run dev
```

Open: `http://localhost:3000`

---

## ✨ Features

### Platform Tabs:
- 🏠 **Home** - Dashboard with RSS feeds, testimonials
- 🏬 **NewMarket** - Trade marketplace
- 🤖 **AgentExchange** - Agent trading
- 🔄 **AgenticFlow** - Workflow automation
- 📦 **Exporter** - Export management
- 🏪 **Importer** - Import management
- 💰 **Financier** - Trade finance
- 🛡️ **Regulator** - Compliance oversight
- 💎 **XRP Test** - Blockchain connectivity testing

### Blockchain Features:
- ⚡ **Fast Transactions** - 3-5 second settlement
- 💰 **Low Fees** - ~$0.0002 per transaction
- 🔐 **Secure** - XRP Ledger enterprise-grade security
- 🌐 **Global** - Cross-border payments support

---

## 🔧 Configuration

### Environment Variables (.env)
```bash
NEXT_PUBLIC_XRPL_NETWORK=testnet
NEXT_PUBLIC_XRPL_SERVER=wss://s.altnet.rippletest.net:51233
NEXT_PUBLIC_XRPL_EXPLORER=https://testnet.xrpl.org
```

### Supported Wallets
- **GemWallet** - Browser extension (https://gemwallet.app)
- **Crossmark** - Browser extension (https://crossmark.io)
- **Xumm** - Mobile wallet (https://xumm.app)

---

## 📁 Structure

```
unified-app/
├── package.json
├── next.config.mjs
├── .env
│
└── app/
    ├── layout.tsx
    ├── page.tsx          (Home page)
    ├── Navigation.tsx
    ├── globals.css
    ├── xrp-test/         (NEW - XRP blockchain testing)
    ├── newmarket/
    ├── agentexchange/
    ├── agenticflow/
    ├── exporter/
    ├── importer/
    ├── financier/
    └── regulator/
```

---

## 🌐 XRP Ledger Resources

- **XRPL Documentation**: https://xrpl.org/docs
- **Testnet Faucet**: https://xrpl.org/xrp-testnet-faucet.html
- **Explorer (Testnet)**: https://testnet.xrpl.org
- **Explorer (Mainnet)**: https://xrpscan.com

---

## 🔄 Migration from Algorand

This platform was migrated from Algorand to XRP Ledger. Key changes:
- SDK: `algosdk` → `xrpl`
- Wallet: Pera Wallet → GemWallet/Crossmark
- Network: Horizon API → WebSocket
- Currency: ALGO → XRP

---

**Ready to trade! 💎🚀**
