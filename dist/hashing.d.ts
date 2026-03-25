/**
 * EIP-712 Struct Hashing (mirrors Solidity NegotiationSettlement.sol)
 *
 * These functions compute the same struct hashes as the Solidity contract.
 * Used to build cross-references (bid -> listing hash, accept -> bid hash).
 */
export declare function hashListingIntent(listing: {
    contentHash: `0x${string}`;
    minBudget: bigint;
    maxBudget: bigint;
    deadline: bigint;
    jobDuration: bigint;
    preferredEvaluator: `0x${string}`;
    nonce: bigint;
}): `0x${string}`;
export declare function hashBidIntent(bid: {
    listingHash: `0x${string}`;
    contentHash: `0x${string}`;
    price: bigint;
    deliveryTime: bigint;
    nonce: bigint;
}): `0x${string}`;
export declare function hashAcceptIntent(accept: {
    listingHash: `0x${string}`;
    bidHash: `0x${string}`;
    nonce: bigint;
}): `0x${string}`;
//# sourceMappingURL=hashing.d.ts.map