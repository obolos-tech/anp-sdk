/**
 * ANP Protocol Constants
 *
 * EIP-712 domain and type definitions matching NegotiationSettlement.sol.
 */
export const ANP_VERSION = 'anp/v1';
/**
 * EIP-712 type definitions for viem/ethers signTypedData.
 * These mirror the struct definitions in NegotiationSettlement.sol.
 */
export const ANP_TYPES = {
    ListingIntent: [
        { name: 'contentHash', type: 'bytes32' },
        { name: 'minBudget', type: 'uint256' },
        { name: 'maxBudget', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
        { name: 'jobDuration', type: 'uint256' },
        { name: 'preferredEvaluator', type: 'address' },
        { name: 'nonce', type: 'uint256' },
    ],
    BidIntent: [
        { name: 'listingHash', type: 'bytes32' },
        { name: 'contentHash', type: 'bytes32' },
        { name: 'price', type: 'uint256' },
        { name: 'deliveryTime', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
    ],
    AcceptIntent: [
        { name: 'listingHash', type: 'bytes32' },
        { name: 'bidHash', type: 'bytes32' },
        { name: 'nonce', type: 'uint256' },
    ],
};
/**
 * Build an EIP-712 domain for ANP signature verification.
 * The domain must match the NegotiationSettlement contract's EIP712 constructor ("ANP", "1").
 *
 * @param chainId - The chain ID (e.g. 8453 for Base mainnet)
 * @param contractAddress - The deployed NegotiationSettlement contract address
 */
export function getANPDomain(chainId, contractAddress) {
    return {
        name: 'ANP',
        version: '1',
        chainId,
        verifyingContract: contractAddress,
    };
}
//# sourceMappingURL=constants.js.map