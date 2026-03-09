// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title TradeRegistry — Marketplace Escrow of Original Agreements + CRE AI Attestations
/// @notice Stores agreed POs onchain at acceptance. Accepts subsequent documents (invoice, receipt).
///         CRE DON reads the immutable PO, runs AI assessment, and writes attestation via onReport().
/// @dev Pattern source: github.com/smartcontractkit/cre-bootcamp-2026/contracts/PredictionMarket.sol
///      CRE Forwarder (Base Sepolia): 0x82300bd7c3958625581cc2f77bc6464dcecdf3e5

contract TradeRegistry {

    // ============================================
    // ENUMS
    // ============================================
    enum DocType {
        NONE,       // 0 — unused
        INVOICE,    // 1
        RECEIPT     // 2
    }

    // ============================================
    // STRUCTS
    // ============================================
    struct Trade {
        string poData;           // Full PO JSON — immutable after registration
        bytes32 poHash;          // keccak256 of poData for integrity verification
        address buyer;
        address seller;
        uint256 registeredAt;    // block.timestamp at registration
        uint256 registeredBlock; // block.number at registration
    }

    struct Document {
        DocType docType;
        string docData;          // Full Invoice/Receipt JSON
        bytes32 docHash;         // keccak256 of docData
        uint256 submittedAt;
    }

    struct Attestation {
        uint256 tradeScore;      // 0-100 (AI assessment score)
        string recommendation;   // "APPROVE" or "REVIEW"
        string findings;         // JSON array of findings from LLM
        uint256 attestedAt;      // block.timestamp when CRE wrote it
    }

    // ============================================
    // STATE
    // ============================================
    /// @notice CRE Forwarder address — only this address can call onReport()
    /// @dev Base Sepolia: 0x82300bd7c3958625581cc2f77bc6464dcecdf3e5
    ///      Source: github.com/smartcontractkit/x402-cre-price-alerts README
    address public immutable creForwarder;

    /// @notice Trade counter — increments on each registerTrade()
    uint256 public tradeCount;

    /// @notice Trade storage: tradeId → Trade
    mapping(uint256 => Trade) public trades;

    /// @notice Document storage: tradeId → docType → Document
    mapping(uint256 => mapping(DocType => Document)) public documents;

    /// @notice Attestation storage: tradeId → docType → Attestation
    /// @dev Written exclusively by CRE via onReport()
    mapping(uint256 => mapping(DocType => Attestation)) public attestations;

    // ============================================
    // EVENTS
    // ============================================
    /// @notice Emitted when a PO is locked onchain at mutual acceptance
    event TradeRegistered(
        uint256 indexed tradeId,
        bytes32 poHash,
        address buyer,
        address seller
    );

    /// @notice Emitted when an invoice or receipt is submitted
    /// @dev CRE EVM Log Trigger watches this event
    event DocumentSubmitted(
        uint256 indexed tradeId,
        uint8 docType
    );

    /// @notice Emitted when CRE writes an AI attestation
    event TradeAttested(
        uint256 indexed tradeId,
        uint8 docType,
        uint256 tradeScore
    );

    // ============================================
    // CONSTRUCTOR
    // ============================================
    /// @param _creForwarder CRE Forwarder address on this chain
    constructor(address _creForwarder) {
        require(_creForwarder != address(0), "Invalid CRE Forwarder");
        creForwarder = _creForwarder;
    }

    // ============================================
    // TRADE REGISTRATION — Called by gateway at PO acceptance
    // ============================================
    /// @notice Lock the agreed PO onchain. Called once when both parties accept.
    /// @param poData Full PO JSON string
    /// @param buyer Buyer wallet address
    /// @param seller Seller wallet address
    /// @return tradeId The ID of the registered trade
    function registerTrade(
        string calldata poData,
        address buyer,
        address seller
    ) external returns (uint256 tradeId) {
        require(bytes(poData).length > 0, "PO data cannot be empty");
        require(buyer != address(0), "Invalid buyer");
        require(seller != address(0), "Invalid seller");

        tradeId = tradeCount;
        tradeCount++;

        trades[tradeId] = Trade({
            poData: poData,
            poHash: keccak256(bytes(poData)),
            buyer: buyer,
            seller: seller,
            registeredAt: block.timestamp,
            registeredBlock: block.number
        });

        emit TradeRegistered(tradeId, trades[tradeId].poHash, buyer, seller);
    }

    // ============================================
    // DOCUMENT SUBMISSION — Called by gateway when invoice/receipt arrives
    // ============================================
    /// @notice Submit a document for CRE AI assessment against the onchain PO
    /// @param tradeId The trade this document belongs to
    /// @param docType 1 = INVOICE, 2 = RECEIPT
    /// @param docData Full document JSON string
    function submitDocument(
        uint256 tradeId,
        uint8 docType,
        string calldata docData
    ) external {
        require(tradeId < tradeCount, "Trade does not exist");
        require(docType == 1 || docType == 2, "Invalid docType: 1=INVOICE, 2=RECEIPT");
        require(bytes(docData).length > 0, "Document data cannot be empty");

        DocType dt = DocType(docType);

        documents[tradeId][dt] = Document({
            docType: dt,
            docData: docData,
            docHash: keccak256(bytes(docData)),
            submittedAt: block.timestamp
        });

        // This event triggers the CRE workflow
        emit DocumentSubmitted(tradeId, docType);
    }

    // ============================================
    // CRE ATTESTATION WRITE — Called only by CRE Forwarder
    // ============================================
    /// @notice Write AI trade assessment onchain. Restricted to CRE Forwarder.
    /// @dev Pattern: cre-bootcamp-2026/contracts/PredictionMarket.sol onReport()
    /// @param tradeId The assessed trade
    /// @param docType 1 = INVOICE attestation, 2 = RECEIPT attestation
    /// @param tradeScore AI assessment score 0-100
    /// @param recommendation "APPROVE" or "REVIEW"
    /// @param findings JSON string of findings array
    function writeAttestation(
        uint256 tradeId,
        uint8 docType,
        uint256 tradeScore,
        string calldata recommendation,
        string calldata findings
    ) external {
        require(msg.sender == creForwarder, "Only CRE Forwarder can write attestations");
        require(tradeId < tradeCount, "Trade does not exist");
        require(docType == 1 || docType == 2, "Invalid docType");
        require(tradeScore <= 100, "Score must be 0-100");

        DocType dt = DocType(docType);

        attestations[tradeId][dt] = Attestation({
            tradeScore: tradeScore,
            recommendation: recommendation,
            findings: findings,
            attestedAt: block.timestamp
        });

        emit TradeAttested(tradeId, docType, tradeScore);
    }

    // ============================================
    // VIEW FUNCTIONS — Readable by anyone (financier, regulator, agents)
    // ============================================
    /// @notice Read the original PO and trade metadata
    function getTrade(uint256 tradeId) external view returns (Trade memory) {
        require(tradeId < tradeCount, "Trade does not exist");
        return trades[tradeId];
    }

    /// @notice Read a submitted document
    function getDocument(uint256 tradeId, uint8 docType) external view returns (Document memory) {
        require(tradeId < tradeCount, "Trade does not exist");
        return documents[tradeId][DocType(docType)];
    }

    /// @notice Read a CRE attestation
    function getAttestation(uint256 tradeId, uint8 docType) external view returns (Attestation memory) {
        require(tradeId < tradeCount, "Trade does not exist");
        return attestations[tradeId][DocType(docType)];
    }
}
