import { describe, it, expect } from 'vitest';
import { validateDocument } from '../src/validation.js';
import { computeCID } from '../src/cid.js';
import { buildDocument } from '../src/document.js';
import { usdToUsdc, usdcToUsd } from '../src/usdc.js';
import { ANP_VERSION } from '../src/constants.js';
import type { ANPDocument, ListingData, BidData, AcceptanceData } from '../src/types.js';

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

describe('validateDocument', () => {
  describe('valid documents', () => {
    it('accepts a fully valid listing document', () => {
      const result = validateDocument(sampleListing);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('accepts a valid bid document', async () => {
      const bidDoc: ANPDocument<BidData> = {
        protocol: 'anp/v1',
        type: 'bid',
        data: {
          listingCid: await computeCID(sampleListing),
          listingHash: '0xaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccdd',
          price: '10000000',
          deliveryTime: 86400 * 3,
          nonce: 1,
        },
        signer: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
        signature: SAMPLE_SIGNATURE,
        timestamp: Date.now(),
      };
      const result = validateDocument(bidDoc);
      expect(result.valid).toBe(true);
    });

    it('accepts a valid acceptance document', () => {
      const acceptDoc: ANPDocument<AcceptanceData> = {
        protocol: 'anp/v1',
        type: 'acceptance',
        data: {
          listingCid: 'sha256-aaaa',
          bidCid: 'sha256-bbbb',
          listingHash: '0xaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccdd',
          bidHash: '0x1122334411223344112233441122334411223344112233441122334411223344',
          nonce: 3,
        },
        signer: '0x9999999999999999999999999999999999999999',
        signature: SAMPLE_SIGNATURE,
        timestamp: Date.now(),
      };
      const result = validateDocument(acceptDoc);
      expect(result.valid).toBe(true);
    });
  });

  describe('protocol version errors', () => {
    it('rejects an unknown protocol version', () => {
      const doc = { ...sampleListing, protocol: 'anp/v99' as typeof ANP_VERSION };
      const result = validateDocument(doc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unknown protocol');
    });
  });

  describe('signer and signature errors', () => {
    it('rejects a document with a missing signer', () => {
      const doc = { ...sampleListing, signer: '' };
      const result = validateDocument(doc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('signer');
    });

    it('rejects a signer that does not start with 0x', () => {
      const doc = { ...sampleListing, signer: 'notanaddress' };
      const result = validateDocument(doc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('signer');
    });

    it('rejects a document with a missing signature', () => {
      const doc = { ...sampleListing, signature: '' };
      const result = validateDocument(doc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('signature');
    });

    it('rejects a signature that does not start with 0x', () => {
      const doc = { ...sampleListing, signature: 'invalidsig' };
      const result = validateDocument(doc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('signature');
    });
  });

  describe('listing-specific errors', () => {
    it('rejects a listing without a title', () => {
      const doc: ANPDocument<ListingData> = {
        ...sampleListing,
        data: { ...sampleListing.data, title: '' },
      };
      const result = validateDocument(doc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('title');
    });

    it('rejects a listing where title is only whitespace', () => {
      const doc: ANPDocument<ListingData> = {
        ...sampleListing,
        data: { ...sampleListing.data, title: '   ' },
      };
      const result = validateDocument(doc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('title');
    });

    it('rejects a listing where minBudget exceeds maxBudget', () => {
      const doc: ANPDocument<ListingData> = {
        ...sampleListing,
        data: { ...sampleListing.data, minBudget: '100000000', maxBudget: '5000000' },
      };
      const result = validateDocument(doc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('minBudget');
    });

    it('accepts a listing where minBudget equals maxBudget (fixed price)', () => {
      const doc: ANPDocument<ListingData> = {
        ...sampleListing,
        data: { ...sampleListing.data, minBudget: '10000000', maxBudget: '10000000' },
      };
      const result = validateDocument(doc);
      expect(result.valid).toBe(true);
    });

    it('rejects a listing with a deadline in the past', () => {
      const doc: ANPDocument<ListingData> = {
        ...sampleListing,
        data: { ...sampleListing.data, deadline: Math.floor(Date.now() / 1000) - 1 },
      };
      const result = validateDocument(doc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Deadline');
    });
  });

  describe('bid-specific errors', () => {
    it('rejects a bid document missing listingCid', () => {
      const doc: ANPDocument<BidData> = {
        protocol: 'anp/v1',
        type: 'bid',
        data: {
          listingCid: '',
          listingHash: '0xaabbccdd',
          price: '10000000',
          deliveryTime: 86400,
          nonce: 1,
        },
        signer: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
        signature: SAMPLE_SIGNATURE,
        timestamp: Date.now(),
      };
      const result = validateDocument(doc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('listingCid');
    });
  });

  describe('acceptance-specific errors', () => {
    it('rejects an acceptance document missing bidCid', () => {
      const doc: ANPDocument<AcceptanceData> = {
        protocol: 'anp/v1',
        type: 'acceptance',
        data: {
          listingCid: 'sha256-aaaa',
          bidCid: '',
          listingHash: '0xaabbccdd',
          bidHash: '0x11223344',
          nonce: 1,
        },
        signer: '0x9999999999999999999999999999999999999999',
        signature: SAMPLE_SIGNATURE,
        timestamp: Date.now(),
      };
      const result = validateDocument(doc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('bidCid');
    });
  });
});

describe('buildDocument', () => {
  const listingData: ListingData = {
    title: 'Smart contract audit',
    description: 'Full audit of a DeFi protocol',
    minBudget: '20000000',
    maxBudget: '100000000',
    deadline: FUTURE_DEADLINE,
    jobDuration: 86400 * 5,
    preferredEvaluator: '0x0000000000000000000000000000000000000000',
    nonce: 1,
  };

  it('sets protocol to ANP_VERSION ("anp/v1")', () => {
    const doc = buildDocument('listing', listingData, '0xABCD', SAMPLE_SIGNATURE);
    expect(doc.protocol).toBe('anp/v1');
    expect(doc.protocol).toBe(ANP_VERSION);
  });

  it('lowercases the signer address regardless of input case', () => {
    const mixed = '0xABCDEF1234567890ABCDEF1234567890ABCDEF12';
    const doc = buildDocument('listing', listingData, mixed, SAMPLE_SIGNATURE);
    expect(doc.signer).toBe(mixed.toLowerCase());
  });

  it('preserves the document type verbatim', () => {
    const doc = buildDocument('bid', listingData as unknown as BidData, '0xabc', SAMPLE_SIGNATURE);
    expect(doc.type).toBe('bid');
  });

  it('attaches a timestamp close to the current time', () => {
    const before = Date.now();
    const doc = buildDocument('listing', listingData, '0xabc', SAMPLE_SIGNATURE);
    const after = Date.now();
    expect(doc.timestamp).toBeGreaterThanOrEqual(before);
    expect(doc.timestamp).toBeLessThanOrEqual(after);
  });

  it('stores the data payload unchanged', () => {
    const doc = buildDocument('listing', listingData, '0xabc', SAMPLE_SIGNATURE);
    expect(doc.data).toEqual(listingData);
  });

  it('stores the signature unchanged', () => {
    const doc = buildDocument('listing', listingData, '0xabc', SAMPLE_SIGNATURE);
    expect(doc.signature).toBe(SAMPLE_SIGNATURE);
  });
});

describe('usdToUsdc', () => {
  it('converts $5 to "5000000"', () => {
    expect(usdToUsdc(5)).toBe('5000000');
  });

  it('converts $0.01 to "10000"', () => {
    expect(usdToUsdc(0.01)).toBe('10000');
  });

  it('converts $1 to "1000000"', () => {
    expect(usdToUsdc(1)).toBe('1000000');
  });

  it('converts $0 to "0"', () => {
    expect(usdToUsdc(0)).toBe('0');
  });

  it('rounds fractional micro-cent values correctly', () => {
    expect(usdToUsdc(1.0000001)).toBe('1000000');
  });

  it('handles large values', () => {
    expect(usdToUsdc(10000)).toBe('10000000000');
  });
});

describe('usdcToUsd', () => {
  it('converts "5000000" to 5', () => {
    expect(usdcToUsd('5000000')).toBe(5);
  });

  it('converts "1000000" to 1', () => {
    expect(usdcToUsd('1000000')).toBe(1);
  });

  it('converts "10000" to 0.01', () => {
    expect(usdcToUsd('10000')).toBe(0.01);
  });

  it('converts "0" to 0', () => {
    expect(usdcToUsd('0')).toBe(0);
  });

  it('is the inverse of usdToUsdc for round-trip values', () => {
    const usdValues = [1, 5, 10, 0.5, 100, 0.01];
    usdValues.forEach(usd => {
      expect(usdcToUsd(usdToUsdc(usd))).toBe(usd);
    });
  });
});

describe('computeContentHash', () => {
  it('returns a 0x-prefixed hex string of exactly 66 characters', async () => {
    const { computeContentHash } = await import('../src/content-hash.js');
    const hash = await computeContentHash({ title: 'hello', nonce: 1 });
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
    expect(hash.length).toBe(66);
  });

  it('is deterministic: identical data always produces the same hash', async () => {
    const { computeContentHash } = await import('../src/content-hash.js');
    const data = { title: 'Build a DeFi dashboard', nonce: 42 };
    expect(await computeContentHash(data)).toBe(await computeContentHash(data));
  });

  it('produces different hashes for different data', async () => {
    const { computeContentHash } = await import('../src/content-hash.js');
    const a = await computeContentHash({ title: 'First' });
    const b = await computeContentHash({ title: 'Second' });
    expect(a).not.toBe(b);
  });

  it('is independent of key insertion order (uses canonicalJSON internally)', async () => {
    const { computeContentHash } = await import('../src/content-hash.js');
    const v1 = await computeContentHash({ z: 99, a: 'alpha' });
    const v2 = await computeContentHash({ a: 'alpha', z: 99 });
    expect(v1).toBe(v2);
  });
});
