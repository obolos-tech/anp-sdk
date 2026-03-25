/**
 * Content Hash computation for EIP-712 structs.
 *
 * Computes sha256 of the full data JSON (title, description, etc.),
 * returned as a 0x-prefixed bytes32 hex string for use in EIP-712 signing.
 *
 * Uses Web Crypto API (browser) with Node.js crypto fallback.
 */
import { canonicalJSON } from './canonical.js';
/**
 * Compute the contentHash field for EIP-712 signing.
 * This is sha256 of the canonical JSON, returned as a 0x-prefixed bytes32 hex string.
 */
export async function computeContentHash(data) {
    const canonical = canonicalJSON(data);
    // Try Web Crypto API first (browser + Node 18+)
    if (typeof globalThis.crypto?.subtle?.digest === 'function') {
        const buffer = new TextEncoder().encode(canonical);
        const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return `0x${hash}`;
    }
    // Fallback to Node.js crypto
    const { createHash } = await import('crypto');
    const hash = createHash('sha256').update(canonical).digest('hex');
    return `0x${hash}`;
}
//# sourceMappingURL=content-hash.js.map