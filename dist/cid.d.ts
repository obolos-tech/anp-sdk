/**
 * Content Identifier (CID) computation and verification.
 *
 * CID = "sha256-" + hex(sha256(canonicalJSON(doc)))
 *
 * Content-addressed: anyone can verify by re-hashing.
 * Compatible with IPFS upgrade path (same digest, different encoding).
 *
 * Uses Web Crypto API (browser) with Node.js crypto fallback.
 */
import type { ANPDocument } from './types.js';
/**
 * Compute content identifier (CID) from a document.
 * CID = "sha256-" + hex(sha256(canonicalJSON(doc)))
 */
export declare function computeCID(document: ANPDocument): Promise<string>;
/**
 * Verify a CID matches a document's content.
 */
export declare function verifyCID(cid: string, content: string): Promise<boolean>;
//# sourceMappingURL=cid.d.ts.map