'use client';

/**
 * EscrowV5Marketplace — Ethereum Sepolia version
 * Same functionality as EscrowV4Marketplace but labelled V5 for UI tabs
 * that reference the V5 contract path. On Ethereum there is one escrow
 * contract (TradeEscrow.sol) — both V4 and V5 marketplace views use it.
 */
export { EscrowV4Marketplace as EscrowV5Marketplace } from './EscrowV4Marketplace';
export { default } from './EscrowV4Marketplace';
