/**
 * ANP SDK — Agent Negotiation Protocol
 *
 * Trustless, gas-free negotiation via EIP-712 signed messages.
 * Every listing, bid, and acceptance is a signed document stored by
 * content hash. Settlement verifies all three signatures on-chain.
 */

// Types
export type {
  ANPDocument,
  ListingData,
  BidData,
  AcceptanceData,
  ANPStorage,
  ANPStoredObject,
  ListingIndexEntry,
  BidIndexEntry,
  ListingQuery,
} from './types.js';

// Constants
export { ANP_VERSION, ANP_TYPES, getANPDomain } from './constants.js';

// Content addressing
export { canonicalJSON } from './canonical.js';
export { computeCID, verifyCID } from './cid.js';
export { computeContentHash } from './content-hash.js';

// EIP-712 struct hashing
export { hashListingIntent, hashBidIntent, hashAcceptIntent } from './hashing.js';

// Document building & validation
export { buildDocument } from './document.js';
export { validateDocument } from './validation.js';

// USDC helpers
export { usdToUsdc, usdcToUsd } from './usdc.js';

// Contract ABI
export { NEGOTIATION_SETTLEMENT_ABI } from './abi.js';
