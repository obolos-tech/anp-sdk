/**
 * NegotiationSettlement contract ABI.
 * Exported as a const for type-safe use with viem.
 */
export declare const NEGOTIATION_SETTLEMENT_ABI: readonly [{
    readonly type: "constructor";
    readonly inputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "settle";
    readonly inputs: readonly [{
        readonly name: "listing";
        readonly type: "tuple";
        readonly components: readonly [{
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
    }, {
        readonly name: "listingSig";
        readonly type: "bytes";
    }, {
        readonly name: "bid";
        readonly type: "tuple";
        readonly components: readonly [{
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
    }, {
        readonly name: "bidSig";
        readonly type: "bytes";
    }, {
        readonly name: "acceptance";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "listingHash";
            readonly type: "bytes32";
        }, {
            readonly name: "bidHash";
            readonly type: "bytes32";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "acceptSig";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "settlementId";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "linkJob";
    readonly inputs: readonly [{
        readonly name: "settlementId";
        readonly type: "uint256";
    }, {
        readonly name: "acpJobId";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
}, {
    readonly type: "function";
    readonly name: "getSettlement";
    readonly inputs: readonly [{
        readonly name: "settlementId";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "client";
            readonly type: "address";
        }, {
            readonly name: "provider";
            readonly type: "address";
        }, {
            readonly name: "listingHash";
            readonly type: "bytes32";
        }, {
            readonly name: "bidHash";
            readonly type: "bytes32";
        }, {
            readonly name: "price";
            readonly type: "uint256";
        }, {
            readonly name: "acpJobId";
            readonly type: "uint256";
        }, {
            readonly name: "settledAt";
            readonly type: "uint256";
        }];
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "verifyListingSigner";
    readonly inputs: readonly [{
        readonly name: "listing";
        readonly type: "tuple";
        readonly components: readonly [{
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
    }, {
        readonly name: "signature";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "verifyBidSigner";
    readonly inputs: readonly [{
        readonly name: "bid";
        readonly type: "tuple";
        readonly components: readonly [{
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
    }, {
        readonly name: "signature";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "verifyAcceptSigner";
    readonly inputs: readonly [{
        readonly name: "acceptance";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "listingHash";
            readonly type: "bytes32";
        }, {
            readonly name: "bidHash";
            readonly type: "bytes32";
        }, {
            readonly name: "nonce";
            readonly type: "uint256";
        }];
    }, {
        readonly name: "signature";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "signer";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "hashListing";
    readonly inputs: readonly [{
        readonly name: "listing";
        readonly type: "tuple";
        readonly components: readonly [{
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
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "pure";
}, {
    readonly type: "function";
    readonly name: "hashBid";
    readonly inputs: readonly [{
        readonly name: "bid";
        readonly type: "tuple";
        readonly components: readonly [{
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
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "pure";
}, {
    readonly type: "function";
    readonly name: "domainSeparator";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "settlementCount";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "usedNonces";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }, {
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "function";
    readonly name: "listingSettled";
    readonly inputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
}, {
    readonly type: "event";
    readonly name: "Settled";
    readonly inputs: readonly [{
        readonly name: "settlementId";
        readonly type: "uint256";
        readonly indexed: true;
    }, {
        readonly name: "client";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "provider";
        readonly type: "address";
        readonly indexed: true;
    }, {
        readonly name: "listingHash";
        readonly type: "bytes32";
        readonly indexed: false;
    }, {
        readonly name: "bidHash";
        readonly type: "bytes32";
        readonly indexed: false;
    }, {
        readonly name: "price";
        readonly type: "uint256";
        readonly indexed: false;
    }];
}, {
    readonly type: "event";
    readonly name: "JobLinked";
    readonly inputs: readonly [{
        readonly name: "settlementId";
        readonly type: "uint256";
        readonly indexed: true;
    }, {
        readonly name: "acpJobId";
        readonly type: "uint256";
        readonly indexed: true;
    }];
}, {
    readonly type: "error";
    readonly name: "ListingExpired";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "PriceOutOfRange";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "ProviderIsClient";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AcceptorNotClient";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "BidListingMismatch";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AcceptListingMismatch";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AcceptBidMismatch";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "NonceAlreadyUsed";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AlreadySettled";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "InvalidSettlementId";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "Unauthorized";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "AlreadyLinked";
    readonly inputs: readonly [];
}];
//# sourceMappingURL=abi.d.ts.map