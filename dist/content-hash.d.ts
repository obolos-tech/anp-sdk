/**
 * Content Hash computation for EIP-712 structs.
 *
 * Computes sha256 of the full data JSON (title, description, etc.),
 * returned as a 0x-prefixed bytes32 hex string for use in EIP-712 signing.
 *
 * Uses Web Crypto API (browser) with Node.js crypto fallback.
 */
/**
 * Compute the contentHash field for EIP-712 signing.
 * This is sha256 of the canonical JSON, returned as a 0x-prefixed bytes32 hex string.
 */
export declare function computeContentHash(data: Record<string, unknown>): Promise<`0x${string}`>;
//# sourceMappingURL=content-hash.d.ts.map