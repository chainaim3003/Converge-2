// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * cvUSD.sol — ERC-20 stablecoin for the trade finance platform.
 *
 * Deploy on Sepolia via Remix (https://remix.ethereum.org):
 *   1. Create this file in Remix.
 *   2. Compile with Solidity ^0.8.20.
 *   3. In "Deploy & Run Transactions" → "Injected Provider - MetaMask" (Sepolia).
 *   4. Constructor arg: pass your MetaMask wallet address as initialOwner.
 *   5. Deploy → confirm in MetaMask.
 *   6. Copy the deployed address to NEXT_PUBLIC_CVUSD_CONTRACT_ADDRESS in .env.local.
 *   7. In Remix, call mint(yourAddress, 1000000000000000000000) to mint 1000 cvUSD.
 *   8. Import the token into MetaMask using the contract address.
 *
 * OpenZeppelin ERC-20 docs: https://docs.openzeppelin.com/contracts/5.x/erc20
 * EIP-20 standard:          https://eips.ethereum.org/EIPS/eip-20
 *
 * NOTE: This uses OpenZeppelin imports which are available automatically in
 * Remix via the npm import syntax below.
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract cvUSD is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("cvUSD", "cvUSD")
        Ownable(initialOwner)
    {}

    /// @notice Mint cvUSD tokens (only contract owner can call)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /// @notice Burn cvUSD tokens from caller's balance
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
