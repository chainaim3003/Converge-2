// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * TradeEscrow.sol
 *
 * Replaces AtomicMarketplaceEscrowV4 / V5 from the Algorand codebase.
 *
 * Deploy on Ethereum Sepolia via Remix IDE (https://remix.ethereum.org):
 *   1. Create this file in Remix.
 *   2. Compile with Solidity ^0.8.20.
 *   3. In "Deploy & Run Transactions" select "Injected Provider - MetaMask".
 *   4. Ensure MetaMask is on Sepolia (Chain ID 11155111).
 *   5. Constructor arg: pass your deployed cvUSD ERC-20 contract address.
 *   6. Click Deploy → confirm in MetaMask.
 *   7. Copy the deployed contract address to NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS in .env.local.
 *
 * Docs:
 *   Ethereum smart contracts: https://ethereum.org/en/developers/docs/smart-contracts/
 *   Solidity: https://docs.soliditylang.org/en/latest/
 */

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract TradeEscrow {

    // ── Types ──────────────────────────────────────────────────────────────────

    enum TradeState {
        CREATED,              // 0 — seller created listing
        ESCROWED,             // 1 — buyer / financier funded escrow
        EXECUTED,             // 2 — seller confirmed shipment
        PAYMENT_ACKNOWLEDGED, // 3 — buyer acknowledged payment
        EXPIRED,              // 4 — expired without execution
        COMPLETED             // 5 — fully settled
    }

    struct Trade {
        uint256 tradeId;
        address buyer;
        address seller;
        address escrowProvider;
        uint256 amount;          // cvUSD in token's smallest unit (wei-equivalent)
        TradeState state;
        string productType;
        string description;
        string ipfsHash;
        uint256 createdAt;
    }

    // ── State ──────────────────────────────────────────────────────────────────

    IERC20 public immutable settlementToken; // cvUSD ERC-20 address
    uint256 private _nextTradeId;
    mapping(uint256 => Trade) private _trades;

    uint256 public constant FEE_BPS = 25; // 0.25% marketplace fee (in basis points)
    address public owner;

    // ── Events ─────────────────────────────────────────────────────────────────

    event TradeCreated(uint256 indexed tradeId, address indexed seller, address indexed buyer, uint256 amount);
    event TradeEscrowed(uint256 indexed tradeId, address indexed escrowProvider);
    event TradeExecuted(uint256 indexed tradeId);
    event TradeCompleted(uint256 indexed tradeId);
    event TradeCancelled(uint256 indexed tradeId);

    // ── Constructor ────────────────────────────────────────────────────────────

    constructor(address _settlementToken) {
        require(_settlementToken != address(0), "Invalid token address");
        settlementToken = IERC20(_settlementToken);
        owner = msg.sender;
        _nextTradeId = 1; // first trade will have ID 1
    }

    // ── Write functions ────────────────────────────────────────────────────────

    /**
     * Seller creates a trade listing. msg.sender becomes the buyer's counterpart
     * (the seller sets who the buyer is; buyer funds later).
     * For self-listing: the caller (exporter) is also the seller.
     */
    function createTrade(
        address seller,
        uint256 amount,
        string calldata productType,
        string calldata description,
        string calldata ipfsHash
    ) external returns (uint256 tradeId) {
        require(seller != address(0), "Invalid seller address");
        require(amount > 0, "Amount must be > 0");

        tradeId = _nextTradeId++;

        _trades[tradeId] = Trade({
            tradeId:       tradeId,
            buyer:         msg.sender,
            seller:        seller,
            escrowProvider: address(0),
            amount:        amount,
            state:         TradeState.CREATED,
            productType:   productType,
            description:   description,
            ipfsHash:      ipfsHash,
            createdAt:     block.timestamp
        });

        emit TradeCreated(tradeId, seller, msg.sender, amount);
    }

    /**
     * Buyer funds escrow. Caller must have approved this contract for
     * trade.amount cvUSD before calling.
     */
    function escrowTrade(uint256 tradeId) external {
        Trade storage t = _trades[tradeId];
        require(t.tradeId != 0,                  "Trade not found");
        require(t.state == TradeState.CREATED,    "Trade not in CREATED state");
        require(msg.sender == t.buyer,            "Only buyer can call escrowTrade");

        // Pull cvUSD from buyer into this contract
        bool ok = settlementToken.transferFrom(msg.sender, address(this), t.amount);
        require(ok, "cvUSD transfer failed");

        t.escrowProvider = msg.sender;
        t.state = TradeState.ESCROWED;

        emit TradeEscrowed(tradeId, msg.sender);
    }

    /**
     * Third-party financier funds escrow on behalf of the buyer.
     */
    function escrowTradeAsFinancier(uint256 tradeId) external {
        Trade storage t = _trades[tradeId];
        require(t.tradeId != 0,               "Trade not found");
        require(t.state == TradeState.CREATED, "Trade not in CREATED state");

        bool ok = settlementToken.transferFrom(msg.sender, address(this), t.amount);
        require(ok, "cvUSD transfer failed");

        t.escrowProvider = msg.sender;
        t.state = TradeState.ESCROWED;

        emit TradeEscrowed(tradeId, msg.sender);
    }

    /**
     * Seller executes the trade — releases payment from escrow to seller.
     * Call this after confirming goods have shipped.
     */
    function executeTrade(uint256 tradeId) external {
        Trade storage t = _trades[tradeId];
        require(t.tradeId != 0,                "Trade not found");
        require(t.state == TradeState.ESCROWED, "Trade not funded");
        require(msg.sender == t.seller,         "Only seller can execute");

        t.state = TradeState.EXECUTED;

        // Calculate platform fee
        uint256 fee = (t.amount * FEE_BPS) / 10000;
        uint256 sellerAmount = t.amount - fee;

        // Transfer seller share
        bool ok = settlementToken.transfer(t.seller, sellerAmount);
        require(ok, "Seller payment failed");

        // Fee stays in contract (owner can withdraw separately)

        emit TradeExecuted(tradeId);
        emit TradeCompleted(tradeId);
        t.state = TradeState.COMPLETED;
    }

    /**
     * Cancel a trade in CREATED state (only buyer or seller).
     */
    function cancelTrade(uint256 tradeId) external {
        Trade storage t = _trades[tradeId];
        require(t.tradeId != 0,               "Trade not found");
        require(t.state == TradeState.CREATED, "Can only cancel CREATED trades");
        require(
            msg.sender == t.buyer || msg.sender == t.seller,
            "Only buyer or seller"
        );

        t.state = TradeState.EXPIRED;
        emit TradeCancelled(tradeId);
    }

    // ── Read functions ─────────────────────────────────────────────────────────

    function getTrade(uint256 tradeId) external view returns (Trade memory) {
        require(_trades[tradeId].tradeId != 0, "Trade not found");
        return _trades[tradeId];
    }

    function getNextTradeId() external view returns (uint256) {
        return _nextTradeId;
    }

    // ── Owner functions ────────────────────────────────────────────────────────

    /**
     * Owner withdraws accumulated platform fees.
     */
    function withdrawFees(address to, uint256 amount) external {
        require(msg.sender == owner, "Only owner");
        bool ok = settlementToken.transfer(to, amount);
        require(ok, "Withdraw failed");
    }
}
