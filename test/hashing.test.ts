import { describe, it, expect } from 'vitest';
import { hashListingIntent, hashBidIntent, hashAcceptIntent } from '../src/hashing.js';
import { computeContentHash } from '../src/content-hash.js';
import { computeCID } from '../src/cid.js';
import type { ANPDocument, ListingData, BidData } from '../src/types.js';

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

describe('hashListingIntent', () => {
  const listingParams = {
    contentHash: '0xaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccdd' as `0x${string}`,
    minBudget: 5000000n,
    maxBudget: 50000000n,
    deadline: BigInt(FUTURE_DEADLINE),
    jobDuration: BigInt(86400 * 3),
    preferredEvaluator: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    nonce: 12345n,
  };

  it('returns a bytes32 hex string (0x-prefixed, 66 chars)', () => {
    const hash = hashListingIntent(listingParams);
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
    expect(hash.length).toBe(66);
  });

  it('is deterministic: same inputs always yield the same hash', () => {
    const h1 = hashListingIntent(listingParams);
    const h2 = hashListingIntent(listingParams);
    expect(h1).toBe(h2);
  });

  it('changes when the nonce changes', () => {
    const different = hashListingIntent({ ...listingParams, nonce: 99999n });
    expect(hashListingIntent(listingParams)).not.toBe(different);
  });

  it('changes when minBudget changes', () => {
    const different = hashListingIntent({ ...listingParams, minBudget: 1n });
    expect(hashListingIntent(listingParams)).not.toBe(different);
  });

  it('changes when preferredEvaluator changes', () => {
    const different = hashListingIntent({
      ...listingParams,
      preferredEvaluator: '0x1111111111111111111111111111111111111111' as `0x${string}`,
    });
    expect(hashListingIntent(listingParams)).not.toBe(different);
  });
});

describe('hashBidIntent', () => {
  const listingHash = hashListingIntent({
    contentHash: '0xaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccdd' as `0x${string}`,
    minBudget: 5000000n,
    maxBudget: 50000000n,
    deadline: BigInt(FUTURE_DEADLINE),
    jobDuration: BigInt(86400 * 3),
    preferredEvaluator: '0x0000000000000000000000000000000000000000' as `0x${string}`,
    nonce: 12345n,
  });

  const bidParams = {
    listingHash,
    contentHash: '0x1122334411223344112233441122334411223344112233441122334411223344' as `0x${string}`,
    price: 10000000n,
    deliveryTime: BigInt(86400 * 3),
    nonce: 1n,
  };

  it('returns a bytes32 hex string (0x-prefixed, 66 chars)', () => {
    const hash = hashBidIntent(bidParams);
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
    expect(hash.length).toBe(66);
  });

  it('is deterministic', () => {
    expect(hashBidIntent(bidParams)).toBe(hashBidIntent(bidParams));
  });

  it('changes when price changes', () => {
    const different = hashBidIntent({ ...bidParams, price: 20000000n });
    expect(hashBidIntent(bidParams)).not.toBe(different);
  });

  it('changes when deliveryTime changes', () => {
    const different = hashBidIntent({ ...bidParams, deliveryTime: 1n });
    expect(hashBidIntent(bidParams)).not.toBe(different);
  });

  it('produces a different hash from hashListingIntent for the same data shape', () => {
    const listingH = hashListingIntent({
      contentHash: bidParams.contentHash,
      minBudget: bidParams.price,
      maxBudget: bidParams.price,
      deadline: bidParams.deliveryTime,
      jobDuration: bidParams.deliveryTime,
      preferredEvaluator: '0x0000000000000000000000000000000000000000' as `0x${string}`,
      nonce: bidParams.nonce,
    });
    expect(hashBidIntent(bidParams)).not.toBe(listingH);
  });
});

describe('hashAcceptIntent', () => {
  const listingHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as `0x${string}`;
  const bidHash = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' as `0x${string}`;

  const acceptParams = {
    listingHash,
    bidHash,
    nonce: 7n,
  };

  it('returns a bytes32 hex string (0x-prefixed, 66 chars)', () => {
    const hash = hashAcceptIntent(acceptParams);
    expect(hash).toMatch(/^0x[0-9a-f]{64}$/);
    expect(hash.length).toBe(66);
  });

  it('is deterministic', () => {
    expect(hashAcceptIntent(acceptParams)).toBe(hashAcceptIntent(acceptParams));
  });

  it('changes when bidHash changes', () => {
    const different = hashAcceptIntent({
      ...acceptParams,
      bidHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc' as `0x${string}`,
    });
    expect(hashAcceptIntent(acceptParams)).not.toBe(different);
  });

  it('changes when nonce changes', () => {
    const different = hashAcceptIntent({ ...acceptParams, nonce: 8n });
    expect(hashAcceptIntent(acceptParams)).not.toBe(different);
  });
});

describe('EIP-712 struct hash cross-reference integrity', () => {
  it('hashListingIntent output is a valid bytes32 for use as listingHash in hashBidIntent', async () => {
    const contentHashListing = await computeContentHash(sampleListing.data as unknown as Record<string, unknown>);
    const listingIntentParams = {
      contentHash: contentHashListing,
      minBudget: BigInt(sampleListing.data.minBudget),
      maxBudget: BigInt(sampleListing.data.maxBudget),
      deadline: BigInt(sampleListing.data.deadline),
      jobDuration: BigInt(sampleListing.data.jobDuration),
      preferredEvaluator: sampleListing.data.preferredEvaluator as `0x${string}`,
      nonce: BigInt(sampleListing.data.nonce),
    };
    const computedListingHash = hashListingIntent(listingIntentParams);

    expect(computedListingHash).toMatch(/^0x[0-9a-f]{64}$/);
    expect(() => hashBidIntent({
      listingHash: computedListingHash,
      contentHash: '0x1122334411223344112233441122334411223344112233441122334411223344' as `0x${string}`,
      price: 10000000n,
      deliveryTime: BigInt(86400 * 3),
      nonce: 1n,
    })).not.toThrow();
  });

  it('all three struct hashes in the chain are distinct values', async () => {
    const contentHashListing = await computeContentHash(sampleListing.data as unknown as Record<string, unknown>);
    const listingIntentParams = {
      contentHash: contentHashListing,
      minBudget: BigInt(sampleListing.data.minBudget),
      maxBudget: BigInt(sampleListing.data.maxBudget),
      deadline: BigInt(sampleListing.data.deadline),
      jobDuration: BigInt(sampleListing.data.jobDuration),
      preferredEvaluator: sampleListing.data.preferredEvaluator as `0x${string}`,
      nonce: BigInt(sampleListing.data.nonce),
    };
    const computedListingHash = hashListingIntent(listingIntentParams);

    const bidData: BidData = {
      listingCid: await computeCID(sampleListing),
      listingHash: computedListingHash,
      price: '10000000',
      deliveryTime: 86400 * 3,
      nonce: 1,
    };
    const contentHashBid = await computeContentHash(bidData as unknown as Record<string, unknown>);
    const computedBidHash = hashBidIntent({
      listingHash: computedListingHash,
      contentHash: contentHashBid,
      price: BigInt(bidData.price),
      deliveryTime: BigInt(bidData.deliveryTime),
      nonce: BigInt(bidData.nonce),
    });

    const acceptHash = hashAcceptIntent({
      listingHash: computedListingHash,
      bidHash: computedBidHash,
      nonce: 1n,
    });

    const hashes = new Set([computedListingHash, computedBidHash, acceptHash]);
    expect(hashes.size).toBe(3);
  });
});
