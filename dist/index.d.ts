/**
 * ANP SDK — Agent Negotiation Protocol
 *
 * Trustless, gas-free negotiation via EIP-712 signed messages.
 * Every listing, bid, and acceptance is a signed document stored by
 * content hash. Settlement verifies all three signatures on-chain.
 */
export type { ANPDocument, ListingData, BidData, AcceptanceData, ANPStorage, ANPStoredObject, ListingIndexEntry, BidIndexEntry, ListingQuery, } from './types.js';
export { ANP_VERSION, ANP_TYPES, getANPDomain } from './constants.js';
export { canonicalJSON } from './canonical.js';
export { computeCID, verifyCID } from './cid.js';
export { computeContentHash } from './content-hash.js';
export { hashListingIntent, hashBidIntent, hashAcceptIntent } from './hashing.js';
export { buildDocument } from './document.js';
export { validateDocument } from './validation.js';
export { usdToUsdc, usdcToUsd } from './usdc.js';
export { NEGOTIATION_SETTLEMENT_ABI } from './abi.js';
//# sourceMappingURL=index.d.ts.map