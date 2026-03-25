/**
 * NegotiationSettlement contract ABI.
 * Exported as a const for type-safe use with viem.
 */
export const NEGOTIATION_SETTLEMENT_ABI = [
    {
        type: 'constructor',
        inputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'settle',
        inputs: [
            {
                name: 'listing',
                type: 'tuple',
                components: [
                    { name: 'contentHash', type: 'bytes32' },
                    { name: 'minBudget', type: 'uint256' },
                    { name: 'maxBudget', type: 'uint256' },
                    { name: 'deadline', type: 'uint256' },
                    { name: 'jobDuration', type: 'uint256' },
                    { name: 'preferredEvaluator', type: 'address' },
                    { name: 'nonce', type: 'uint256' },
                ],
            },
            { name: 'listingSig', type: 'bytes' },
            {
                name: 'bid',
                type: 'tuple',
                components: [
                    { name: 'listingHash', type: 'bytes32' },
                    { name: 'contentHash', type: 'bytes32' },
                    { name: 'price', type: 'uint256' },
                    { name: 'deliveryTime', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                ],
            },
            { name: 'bidSig', type: 'bytes' },
            {
                name: 'acceptance',
                type: 'tuple',
                components: [
                    { name: 'listingHash', type: 'bytes32' },
                    { name: 'bidHash', type: 'bytes32' },
                    { name: 'nonce', type: 'uint256' },
                ],
            },
            { name: 'acceptSig', type: 'bytes' },
        ],
        outputs: [{ name: 'settlementId', type: 'uint256' }],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'linkJob',
        inputs: [
            { name: 'settlementId', type: 'uint256' },
            { name: 'acpJobId', type: 'uint256' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
    },
    {
        type: 'function',
        name: 'getSettlement',
        inputs: [{ name: 'settlementId', type: 'uint256' }],
        outputs: [
            {
                name: '',
                type: 'tuple',
                components: [
                    { name: 'client', type: 'address' },
                    { name: 'provider', type: 'address' },
                    { name: 'listingHash', type: 'bytes32' },
                    { name: 'bidHash', type: 'bytes32' },
                    { name: 'price', type: 'uint256' },
                    { name: 'acpJobId', type: 'uint256' },
                    { name: 'settledAt', type: 'uint256' },
                ],
            },
        ],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'verifyListingSigner',
        inputs: [
            {
                name: 'listing',
                type: 'tuple',
                components: [
                    { name: 'contentHash', type: 'bytes32' },
                    { name: 'minBudget', type: 'uint256' },
                    { name: 'maxBudget', type: 'uint256' },
                    { name: 'deadline', type: 'uint256' },
                    { name: 'jobDuration', type: 'uint256' },
                    { name: 'preferredEvaluator', type: 'address' },
                    { name: 'nonce', type: 'uint256' },
                ],
            },
            { name: 'signature', type: 'bytes' },
        ],
        outputs: [{ name: 'signer', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'verifyBidSigner',
        inputs: [
            {
                name: 'bid',
                type: 'tuple',
                components: [
                    { name: 'listingHash', type: 'bytes32' },
                    { name: 'contentHash', type: 'bytes32' },
                    { name: 'price', type: 'uint256' },
                    { name: 'deliveryTime', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                ],
            },
            { name: 'signature', type: 'bytes' },
        ],
        outputs: [{ name: 'signer', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'verifyAcceptSigner',
        inputs: [
            {
                name: 'acceptance',
                type: 'tuple',
                components: [
                    { name: 'listingHash', type: 'bytes32' },
                    { name: 'bidHash', type: 'bytes32' },
                    { name: 'nonce', type: 'uint256' },
                ],
            },
            { name: 'signature', type: 'bytes' },
        ],
        outputs: [{ name: 'signer', type: 'address' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'hashListing',
        inputs: [
            {
                name: 'listing',
                type: 'tuple',
                components: [
                    { name: 'contentHash', type: 'bytes32' },
                    { name: 'minBudget', type: 'uint256' },
                    { name: 'maxBudget', type: 'uint256' },
                    { name: 'deadline', type: 'uint256' },
                    { name: 'jobDuration', type: 'uint256' },
                    { name: 'preferredEvaluator', type: 'address' },
                    { name: 'nonce', type: 'uint256' },
                ],
            },
        ],
        outputs: [{ name: '', type: 'bytes32' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        name: 'hashBid',
        inputs: [
            {
                name: 'bid',
                type: 'tuple',
                components: [
                    { name: 'listingHash', type: 'bytes32' },
                    { name: 'contentHash', type: 'bytes32' },
                    { name: 'price', type: 'uint256' },
                    { name: 'deliveryTime', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                ],
            },
        ],
        outputs: [{ name: '', type: 'bytes32' }],
        stateMutability: 'pure',
    },
    {
        type: 'function',
        name: 'domainSeparator',
        inputs: [],
        outputs: [{ name: '', type: 'bytes32' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'settlementCount',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'usedNonces',
        inputs: [
            { name: '', type: 'address' },
            { name: '', type: 'uint256' },
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'function',
        name: 'listingSettled',
        inputs: [{ name: '', type: 'bytes32' }],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
    },
    {
        type: 'event',
        name: 'Settled',
        inputs: [
            { name: 'settlementId', type: 'uint256', indexed: true },
            { name: 'client', type: 'address', indexed: true },
            { name: 'provider', type: 'address', indexed: true },
            { name: 'listingHash', type: 'bytes32', indexed: false },
            { name: 'bidHash', type: 'bytes32', indexed: false },
            { name: 'price', type: 'uint256', indexed: false },
        ],
    },
    {
        type: 'event',
        name: 'JobLinked',
        inputs: [
            { name: 'settlementId', type: 'uint256', indexed: true },
            { name: 'acpJobId', type: 'uint256', indexed: true },
        ],
    },
    { type: 'error', name: 'ListingExpired', inputs: [] },
    { type: 'error', name: 'PriceOutOfRange', inputs: [] },
    { type: 'error', name: 'ProviderIsClient', inputs: [] },
    { type: 'error', name: 'AcceptorNotClient', inputs: [] },
    { type: 'error', name: 'BidListingMismatch', inputs: [] },
    { type: 'error', name: 'AcceptListingMismatch', inputs: [] },
    { type: 'error', name: 'AcceptBidMismatch', inputs: [] },
    { type: 'error', name: 'NonceAlreadyUsed', inputs: [] },
    { type: 'error', name: 'AlreadySettled', inputs: [] },
    { type: 'error', name: 'InvalidSettlementId', inputs: [] },
    { type: 'error', name: 'Unauthorized', inputs: [] },
    { type: 'error', name: 'AlreadyLinked', inputs: [] },
];
//# sourceMappingURL=abi.js.map