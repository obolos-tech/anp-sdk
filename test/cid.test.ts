import { describe, it, expect } from 'vitest';
import { computeCID, verifyCID } from '../src/cid.js';
import { canonicalJSON } from '../src/canonical.js';
import type { ANPDocument, ListingData } from '../src/types.js';

const FUTURE_DEADLINE = Math.floor(Date.now() / 1000) + 86400 * 7;

const SAMPLE_SIGNATURE =
  '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' +
  'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab1c';

const sampleListing: ANPDocument<ListingData> = {
  protocol: 'anp/v1' as const,
  type: 'listing' as const,
  data: {
    title: 'Build a DeFi dashboard',
    description: 'React dashboard with wallet integration',
    minBudget: '5000000',
    maxBudget: '50000000',
    deadline: FUTURE_DEADLINE,
    jobDuration: 86400 * 3,
    preferredEvaluator: '0x0000000000000000000000000000000000000000',
    nonce: 12345,
  },
  signer: '0x1234567890abcdef1234567890abcdef12345678',
  signature: SAMPLE_SIGNATURE,
  timestamp: Date.now(),
};

describe('computeCID', () => {
  it('returns a string prefixed with "sha256-"', async () => {
    const cid = await computeCID(sampleListing);
    expect(cid).toMatch(/^sha256-[0-9a-f]{64}$/);
  });

  it('is deterministic: same document produces the same CID every time', async () => {
    const cid1 = await computeCID(sampleListing);
    const cid2 = await computeCID(sampleListing);
    expect(cid1).toBe(cid2);
  });

  it('produces different CIDs for documents that differ by one field', async () => {
    const modified: ANPDocument<ListingData> = {
      ...sampleListing,
      data: { ...sampleListing.data, title: 'Different title' },
    };
    expect(await computeCID(sampleListing)).not.toBe(await computeCID(modified));
  });

  it('is sensitive to signer address changes', async () => {
    const differentSigner: ANPDocument<ListingData> = {
      ...sampleListing,
      signer: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
    };
    expect(await computeCID(sampleListing)).not.toBe(await computeCID(differentSigner));
  });
});

describe('verifyCID', () => {
  it('returns true when the CID matches the serialized document content', async () => {
    const cid = await computeCID(sampleListing);
    const content = canonicalJSON(sampleListing);
    expect(await verifyCID(cid, content)).toBe(true);
  });

  it('returns false when the content has been tampered with', async () => {
    const cid = await computeCID(sampleListing);
    const tampered = canonicalJSON({
      ...sampleListing,
      data: { ...sampleListing.data, minBudget: '9999999' },
    });
    expect(await verifyCID(cid, tampered)).toBe(false);
  });

  it('returns false for completely invalid (non-JSON) content', async () => {
    const cid = await computeCID(sampleListing);
    expect(await verifyCID(cid, 'not valid json {')).toBe(false);
  });

  it('returns false when an empty string is supplied as content', async () => {
    const cid = await computeCID(sampleListing);
    expect(await verifyCID(cid, '')).toBe(false);
  });

  it('returns false when the CID belongs to a different document', async () => {
    const otherDoc: ANPDocument<ListingData> = {
      ...sampleListing,
      data: { ...sampleListing.data, nonce: 99999 },
    };
    const wrongCid = await computeCID(otherDoc);
    const content = canonicalJSON(sampleListing);
    expect(await verifyCID(wrongCid, content)).toBe(false);
  });
});
