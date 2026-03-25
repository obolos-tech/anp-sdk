/**
 * ANP Protocol Constants
 *
 * EIP-712 domain and type definitions matching NegotiationSettlement.sol.
 */
export declare const ANP_VERSION: "anp/v1";
/**
 * EIP-712 type definitions for viem/ethers signTypedData.
 * These mirror the struct definitions in NegotiationSettlement.sol.
 */
export declare const ANP_TYPES: {
    readonly ListingIntent: readonly [{
        readonly name: "contentHash";
        readonly type: "bytes32";
    }, {
        readonly name: "minBudget";
        readonly type: "uint256";
    }, {
        readonly name: "maxBudget";
        readonly type: "uint256";
    }, {
        readonly name: "deadline";
        readonly type: "uint256";
    }, {
        readonly name: "jobDuration";
        readonly type: "uint256";
    }, {
        readonly name: "preferredEvaluator";
        readonly type: "address";
    }, {
        readonly name: "nonce";
        readonly type: "uint256";
    }];
    readonly BidIntent: readonly [{
        readonly name: "listingHash";
        readonly type: "bytes32";
    }, {
        readonly name: "contentHash";
        readonly type: "bytes32";
    }, {
        readonly name: "price";
        readonly type: "uint256";
    }, {
        readonly name: "deliveryTime";
        readonly type: "uint256";
    }, {
        readonly name: "nonce";
        readonly type: "uint256";
    }];
    readonly AcceptIntent: readonly [{
        readonly name: "listingHash";
        readonly type: "bytes32";
    }, {
        readonly name: "bidHash";
        readonly type: "bytes32";
    }, {
        readonly name: "nonce";
        readonly type: "uint256";
    }];
};
/**
 * Build an EIP-712 domain for ANP signature verification.
 * The domain must match the NegotiationSettlement contract's EIP712 constructor ("ANP", "1").
 *
 * @param chainId - The chain ID (e.g. 8453 for Base mainnet)
 * @param contractAddress - The deployed NegotiationSettlement contract address
 */
export declare function getANPDomain(chainId: number, contractAddress: string): {
    name: "ANP";
    version: "1";
    chainId: number;
    verifyingContract: `0x${string}`;
};
//# sourceMappingURL=constants.d.ts.map