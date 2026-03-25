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

import { canonicalJSON } from './canonical.js';
import type { ANPDocument } from './types.js';

/**
 * SHA-256 hash that works in both browser and Node.js.
 * Returns hex string.
 */
async function sha256hex(input: string): Promise<string> {
  // Try Web Crypto API first (browser + Node 18+)
  if (typeof globalThis.crypto?.subtle?.digest === 'function') {
    const buffer = new TextEncoder().encode(input);
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback to Node.js crypto
  const { createHash } = await import('crypto');
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Compute content identifier (CID) from a document.
 * CID = "sha256-" + hex(sha256(canonicalJSON(doc)))
 */
export async function computeCID(document: ANPDocument): Promise<string> {
  const canonical = canonicalJSON(document);
  const hash = await sha256hex(canonical);
  return `sha256-${hash}`;
}

/**
 * Verify a CID matches a document's content.
 */
export async function verifyCID(cid: string, content: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(content);
    const expectedCid = await computeCID(parsed);
    return cid === expectedCid;
  } catch {
    return false;
  }
}
