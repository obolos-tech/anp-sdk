/**
 * Document structure validation (not signatures — that requires viem).
 */

import { ANP_VERSION } from './constants.js';
import type { ANPDocument, ListingData, BidData, AcceptanceData } from './types.js';

export function validateDocument(doc: ANPDocument): { valid: boolean; error?: string } {
  if (doc.protocol !== ANP_VERSION) {
    return { valid: false, error: `Unknown protocol: ${doc.protocol}` };
  }

  if (!['listing', 'bid', 'acceptance'].includes(doc.type)) {
    return { valid: false, error: `Unknown document type: ${doc.type}` };
  }

  if (!doc.signer || !doc.signer.startsWith('0x')) {
    return { valid: false, error: 'Invalid signer address' };
  }

  if (!doc.signature || !doc.signature.startsWith('0x')) {
    return { valid: false, error: 'Invalid signature' };
  }

  if (!doc.data || typeof doc.data !== 'object') {
    return { valid: false, error: 'Missing data' };
  }

  if (doc.type === 'listing') {
    const data = doc.data as ListingData;
    if (!data.title?.trim()) return { valid: false, error: 'Listing title required' };
    if (!data.description?.trim()) return { valid: false, error: 'Listing description required' };
    if (!data.minBudget) return { valid: false, error: 'minBudget required' };
    if (!data.maxBudget) return { valid: false, error: 'maxBudget required' };
    if (BigInt(data.minBudget) > BigInt(data.maxBudget)) {
      return { valid: false, error: 'minBudget exceeds maxBudget' };
    }
    if (!data.deadline || data.deadline <= Date.now() / 1000) {
      return { valid: false, error: 'Deadline must be in the future' };
    }
  }

  if (doc.type === 'bid') {
    const data = doc.data as BidData;
    if (!data.listingCid) return { valid: false, error: 'listingCid required' };
    if (!data.listingHash) return { valid: false, error: 'listingHash required' };
    if (!data.price) return { valid: false, error: 'price required' };
  }

  if (doc.type === 'acceptance') {
    const data = doc.data as AcceptanceData;
    if (!data.listingCid) return { valid: false, error: 'listingCid required' };
    if (!data.bidCid) return { valid: false, error: 'bidCid required' };
    if (!data.listingHash) return { valid: false, error: 'listingHash required' };
    if (!data.bidHash) return { valid: false, error: 'bidHash required' };
  }

  return { valid: true };
}
