// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * TradeRegistry.sol
 *
 * ERC-721-based trade instrument registry.
 * Replaces TradeInstrumentRegistryV3 from the Algorand codebase.
 * Each eBL (Electronic Bill of Lading) is minted as an NFT.
 *
 * Deploy on Sepolia via Remix (https://remix.ethereum.org):
 *   1. Compile with Solidity ^0.8.20.
 *   2. Deploy with Injected Provider (MetaMask on Sepolia).
 *   3. No constructor arguments needed.
 *   4. Copy the deployed address to NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS in .env.local.
 *
 * OpenZeppelin ERC-721 docs: https://docs.openzeppelin.com/contracts/5.x/erc721
 * EIP-721: https://eips.ethereum.org/EIPS/eip-721
 */

/**
 * Minimal ERC-721 implementation (no OpenZeppelin dependency for easy Remix deploy).
 * For production, replace with OpenZeppelin ERC721.sol.
 */
contract TradeRegistry {

    // ── ERC-721 minimal state ──────────────────────────────────────────────────
    string public name   = "TradeFinanceInstrument";
    string public symbol = "TFI";

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _approvals;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    // ── Registry state ─────────────────────────────────────────────────────────

    struct Instrument {
        uint256 tokenId;
        string  instrumentNumber;
        address exporter;
        address importer;
        string  cargoDescription;
        uint256 cargoValue;
        string  originPort;
        string  destinationPort;
        uint256 createdAt;
        address currentHolder;
    }

    uint256 private _nextTokenId;
    mapping(uint256 => Instrument) private _instruments;
    address public owner;

    event InstrumentCreated(
        uint256 indexed tokenId,
        address indexed exporter,
        string instrumentNumber
    );

    constructor() {
        owner = msg.sender;
        _nextTokenId = 1;
    }

    // ── Registry write functions ───────────────────────────────────────────────

    /**
     * Create a new eBL instrument (mints an ERC-721 token to the exporter).
     */
    function createInstrument(
        string calldata instrumentNumber,
        address exporter,
        address importer,
        string calldata cargoDescription,
        uint256 cargoValue,
        string calldata originPort,
        string calldata destinationPort
    ) external returns (uint256 tokenId) {
        require(exporter != address(0), "Invalid exporter");
        require(importer != address(0), "Invalid importer");

        tokenId = _nextTokenId++;

        _instruments[tokenId] = Instrument({
            tokenId:          tokenId,
            instrumentNumber: instrumentNumber,
            exporter:         exporter,
            importer:         importer,
            cargoDescription: cargoDescription,
            cargoValue:       cargoValue,
            originPort:       originPort,
            destinationPort:  destinationPort,
            createdAt:        block.timestamp,
            currentHolder:    exporter
        });

        // Mint NFT to exporter
        _mint(exporter, tokenId);

        emit InstrumentCreated(tokenId, exporter, instrumentNumber);
    }

    // ── Registry read functions ────────────────────────────────────────────────

    function getInstrument(uint256 tokenId) external view returns (Instrument memory) {
        require(_owners[tokenId] != address(0), "Instrument not found");
        return _instruments[tokenId];
    }

    function getNextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    // ── ERC-721 functions ──────────────────────────────────────────────────────

    function ownerOf(uint256 tokenId) public view returns (address) {
        address o = _owners[tokenId];
        require(o != address(0), "Token does not exist");
        return o;
    }

    function balanceOf(address account) public view returns (uint256) {
        require(account != address(0), "Zero address");
        return _balances[account];
    }

    function approve(address to, uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _approvals[tokenId] = to;
        emit Approval(msg.sender, to, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not approved");
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        transferFrom(from, to, tokenId);
    }

    // ── Internal helpers ───────────────────────────────────────────────────────

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), "Mint to zero");
        _owners[tokenId] = to;
        _balances[to]++;
        emit Transfer(address(0), to, tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "Wrong owner");
        require(to != address(0), "Transfer to zero");
        _balances[from]--;
        _balances[to]++;
        _owners[tokenId] = to;
        delete _approvals[tokenId];
        // Update currentHolder in instrument struct
        _instruments[tokenId].currentHolder = to;
        emit Transfer(from, to, tokenId);
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address o = ownerOf(tokenId);
        return (spender == o || _approvals[tokenId] == spender);
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x80ac58cd // ERC-721
            || interfaceId == 0x01ffc9a7; // ERC-165
    }
}
