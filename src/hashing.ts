/**
 * EIP-712 Struct Hashing (mirrors Solidity NegotiationSettlement.sol)
 *
 * These functions compute the same struct hashes as the Solidity contract.
 * Used to build cross-references (bid -> listing hash, accept -> bid hash).
 */

import { encodeAbiParameters, keccak256 } from 'viem';

const LISTING_TYPEHASH = keccak256(
  new TextEncoder().encode(
    'ListingIntent(bytes32 contentHash,uint256 minBudget,uint256 maxBudget,uint256 deadline,uint256 jobDuration,address preferredEvaluator,uint256 nonce)',
  ),
);

const BID_TYPEHASH = keccak256(
  new TextEncoder().encode(
    'BidIntent(bytes32 listingHash,bytes32 contentHash,uint256 price,uint256 deliveryTime,uint256 nonce)',
  ),
);

const ACCEPT_TYPEHASH = keccak256(
  new TextEncoder().encode(
    'AcceptIntent(bytes32 listingHash,bytes32 bidHash,uint256 nonce)',
  ),
);

export function hashListingIntent(listing: {
  contentHash: `0x${string}`;
  minBudget: bigint;
  maxBudget: bigint;
  deadline: bigint;
  jobDuration: bigint;
  preferredEvaluator: `0x${string}`;
  nonce: bigint;
}): `0x${string}` {
  const encoded = encodeAbiParameters(
    [
      { type: 'bytes32' },
      { type: 'bytes32' },
      { type: 'uint256' },
      { type: 'uint256' },
      { type: 'uint256' },
      { type: 'uint256' },
      { type: 'address' },
      { type: 'uint256' },
    ],
    [
      LISTING_TYPEHASH,
      listing.contentHash,
      listing.minBudget,
      listing.maxBudget,
      listing.deadline,
      listing.jobDuration,
      listing.preferredEvaluator,
      listing.nonce,
    ],
  );
  return keccak256(encoded);
}

export function hashBidIntent(bid: {
  listingHash: `0x${string}`;
  contentHash: `0x${string}`;
  price: bigint;
  deliveryTime: bigint;
  nonce: bigint;
}): `0x${string}` {
  const encoded = encodeAbiParameters(
    [
      { type: 'bytes32' },
      { type: 'bytes32' },
      { type: 'bytes32' },
      { type: 'uint256' },
      { type: 'uint256' },
      { type: 'uint256' },
    ],
    [
      BID_TYPEHASH,
      bid.listingHash,
      bid.contentHash,
      bid.price,
      bid.deliveryTime,
      bid.nonce,
    ],
  );
  return keccak256(encoded);
}

export function hashAcceptIntent(accept: {
  listingHash: `0x${string}`;
  bidHash: `0x${string}`;
  nonce: bigint;
}): `0x${string}` {
  const encoded = encodeAbiParameters(
    [
      { type: 'bytes32' },
      { type: 'bytes32' },
      { type: 'bytes32' },
      { type: 'uint256' },
    ],
    [
      ACCEPT_TYPEHASH,
      accept.listingHash,
      accept.bidHash,
      accept.nonce,
    ],
  );
  return keccak256(encoded);
}
