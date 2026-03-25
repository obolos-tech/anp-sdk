// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

/// @title NegotiationSettlement — Trustless settlement for the Agent Negotiation Protocol
/// @notice Verifies three EIP-712 signed intents (listing, bid, acceptance) in a single
///         on-chain call. All negotiation happens off-chain via signed messages stored on
///         IPFS / content-addressed storage. This contract only touches the chain once —
///         at settlement — to produce an immutable, verifiable proof of agreement.
/// @dev Does NOT handle money or create ACP jobs. The client creates the ACP job
///      separately (so they remain msg.sender / job.client) and links it back.
contract NegotiationSettlement is EIP712 {
    using ECDSA for bytes32;

    // ─── EIP-712 Type Hashes ─────────────────────────────────────────────

    bytes32 public constant LISTING_TYPEHASH = keccak256(
        "ListingIntent(bytes32 contentHash,uint256 minBudget,uint256 maxBudget,uint256 deadline,uint256 jobDuration,address preferredEvaluator,uint256 nonce)"
    );

    bytes32 public constant BID_TYPEHASH = keccak256(
        "BidIntent(bytes32 listingHash,bytes32 contentHash,uint256 price,uint256 deliveryTime,uint256 nonce)"
    );

    bytes32 public constant ACCEPT_TYPEHASH = keccak256(
        "AcceptIntent(bytes32 listingHash,bytes32 bidHash,uint256 nonce)"
    );

    // ─── Types ───────────────────────────────────────────────────────────

    struct ListingIntent {
        bytes32 contentHash;        // sha256 of full listing JSON (title, description, etc.)
        uint256 minBudget;          // minimum USDC (6 decimals)
        uint256 maxBudget;          // maximum USDC (6 decimals)
        uint256 deadline;           // unix timestamp — listing expiry
        uint256 jobDuration;        // seconds the provider has after funding
        address preferredEvaluator; // address(0) = client self-evaluates
        uint256 nonce;              // replay protection (arbitrary, non-sequential)
    }

    struct BidIntent {
        bytes32 listingHash;        // EIP-712 struct hash of the ListingIntent
        bytes32 contentHash;        // sha256 of full bid JSON (message, proposal, etc.)
        uint256 price;              // proposed USDC amount (6 decimals)
        uint256 deliveryTime;       // proposed seconds to complete
        uint256 nonce;              // replay protection
    }

    struct AcceptIntent {
        bytes32 listingHash;        // must match BidIntent.listingHash
        bytes32 bidHash;            // EIP-712 struct hash of the BidIntent
        uint256 nonce;              // replay protection
    }

    struct Settlement {
        address client;
        address provider;
        bytes32 listingHash;
        bytes32 bidHash;
        uint256 price;
        uint256 acpJobId;           // 0 until linked
        uint256 settledAt;
    }

    // ─── Errors ──────────────────────────────────────────────────────────

    error ListingExpired();
    error PriceOutOfRange();
    error ProviderIsClient();
    error AcceptorNotClient();
    error BidListingMismatch();
    error AcceptListingMismatch();
    error AcceptBidMismatch();
    error NonceAlreadyUsed();
    error AlreadySettled();
    error InvalidSettlementId();
    error Unauthorized();
    error AlreadyLinked();

    // ─── Events ──────────────────────────────────────────────────────────

    event Settled(
        uint256 indexed settlementId,
        address indexed client,
        address indexed provider,
        bytes32 listingHash,
        bytes32 bidHash,
        uint256 price
    );

    event JobLinked(
        uint256 indexed settlementId,
        uint256 indexed acpJobId
    );

    // ─── State ───────────────────────────────────────────────────────────

    uint256 public settlementCount;
    mapping(uint256 => Settlement) public settlements;

    /// @notice Tracks used nonces per address to prevent replay
    mapping(address => mapping(uint256 => bool)) public usedNonces;

    /// @notice Tracks settled listing hashes to prevent double-settlement
    mapping(bytes32 => bool) public listingSettled;

    // ─── Constructor ─────────────────────────────────────────────────────

    constructor() EIP712("ANP", "1") {}

    // ─── Core: Settlement ────────────────────────────────────────────────

    /// @notice Verify three signed intents and record the settlement.
    /// @dev Anyone can call this with valid signatures — the signer identities
    ///      are recovered from the signatures, not from msg.sender.
    /// @param listing   The listing terms signed by the client
    /// @param listingSig EIP-712 signature over ListingIntent
    /// @param bid       The bid terms signed by the provider
    /// @param bidSig    EIP-712 signature over BidIntent
    /// @param acceptance The acceptance signed by the client
    /// @param acceptSig EIP-712 signature over AcceptIntent
    /// @return settlementId The ID of the created settlement
    function settle(
        ListingIntent calldata listing,
        bytes calldata listingSig,
        BidIntent calldata bid,
        bytes calldata bidSig,
        AcceptIntent calldata acceptance,
        bytes calldata acceptSig
    ) external returns (uint256 settlementId) {
        // 1. Compute EIP-712 struct hashes
        bytes32 listingHash = _hashListing(listing);
        bytes32 bidHash = _hashBid(bid);
        bytes32 acceptHash = _hashAccept(acceptance);

        // 2. Recover signers
        address client = _hashTypedDataV4(listingHash).recover(listingSig);
        address provider = _hashTypedDataV4(bidHash).recover(bidSig);
        address acceptor = _hashTypedDataV4(acceptHash).recover(acceptSig);

        // 3. Verify referential integrity
        //    - bid must reference this listing
        if (bid.listingHash != listingHash) revert BidListingMismatch();
        //    - acceptance must reference this listing and this bid
        if (acceptance.listingHash != listingHash) revert AcceptListingMismatch();
        if (acceptance.bidHash != bidHash) revert AcceptBidMismatch();
        //    - acceptor must be the same address that signed the listing
        if (acceptor != client) revert AcceptorNotClient();

        // 4. Verify business rules
        if (block.timestamp >= listing.deadline) revert ListingExpired();
        if (bid.price < listing.minBudget || bid.price > listing.maxBudget) revert PriceOutOfRange();
        if (provider == client) revert ProviderIsClient();

        // 5. Replay protection
        if (usedNonces[client][listing.nonce]) revert NonceAlreadyUsed();
        if (usedNonces[provider][bid.nonce]) revert NonceAlreadyUsed();
        if (usedNonces[client][acceptance.nonce]) revert NonceAlreadyUsed();
        if (listingSettled[listingHash]) revert AlreadySettled();

        usedNonces[client][listing.nonce] = true;
        usedNonces[provider][bid.nonce] = true;
        usedNonces[client][acceptance.nonce] = true;
        listingSettled[listingHash] = true;

        // 6. Store settlement
        settlementId = settlementCount++;
        Settlement storage s = settlements[settlementId];
        s.client = client;
        s.provider = provider;
        s.listingHash = listingHash;
        s.bidHash = bidHash;
        s.price = bid.price;
        s.settledAt = block.timestamp;

        emit Settled(settlementId, client, provider, listingHash, bidHash, bid.price);
    }

    /// @notice Link an ACP job to a settlement. Called by the client after
    ///         they create the ACP job themselves (preserving msg.sender ownership).
    /// @param settlementId The settlement to link
    /// @param acpJobId     The ACP job ID
    function linkJob(uint256 settlementId, uint256 acpJobId) external {
        if (settlementId >= settlementCount) revert InvalidSettlementId();
        Settlement storage s = settlements[settlementId];
        if (msg.sender != s.client) revert Unauthorized();
        if (s.acpJobId != 0) revert AlreadyLinked();

        s.acpJobId = acpJobId;

        emit JobLinked(settlementId, acpJobId);
    }

    // ─── View Functions ──────────────────────────────────────────────────

    /// @notice Get full settlement details
    function getSettlement(uint256 settlementId) external view returns (Settlement memory) {
        return settlements[settlementId];
    }

    /// @notice Verify a listing signature without settling. Useful for platform validation.
    function verifyListingSigner(
        ListingIntent calldata listing,
        bytes calldata signature
    ) external view returns (address signer) {
        bytes32 hash = _hashListing(listing);
        signer = _hashTypedDataV4(hash).recover(signature);
    }

    /// @notice Verify a bid signature without settling.
    function verifyBidSigner(
        BidIntent calldata bid,
        bytes calldata signature
    ) external view returns (address signer) {
        bytes32 hash = _hashBid(bid);
        signer = _hashTypedDataV4(hash).recover(signature);
    }

    /// @notice Verify an acceptance signature without settling.
    function verifyAcceptSigner(
        AcceptIntent calldata acceptance,
        bytes calldata signature
    ) external view returns (address signer) {
        bytes32 hash = _hashAccept(acceptance);
        signer = _hashTypedDataV4(hash).recover(signature);
    }

    /// @notice Compute the EIP-712 struct hash for a listing (for use in bids)
    function hashListing(ListingIntent calldata listing) external pure returns (bytes32) {
        return _hashListing(listing);
    }

    /// @notice Compute the EIP-712 struct hash for a bid (for use in acceptances)
    function hashBid(BidIntent calldata bid) external pure returns (bytes32) {
        return _hashBid(bid);
    }

    /// @notice Get the EIP-712 domain separator
    function domainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    // ─── Internal: Hashing ───────────────────────────────────────────────

    function _hashListing(ListingIntent calldata l) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            LISTING_TYPEHASH,
            l.contentHash,
            l.minBudget,
            l.maxBudget,
            l.deadline,
            l.jobDuration,
            l.preferredEvaluator,
            l.nonce
        ));
    }

    function _hashBid(BidIntent calldata b) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            BID_TYPEHASH,
            b.listingHash,
            b.contentHash,
            b.price,
            b.deliveryTime,
            b.nonce
        ));
    }

    function _hashAccept(AcceptIntent calldata a) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            ACCEPT_TYPEHASH,
            a.listingHash,
            a.bidHash,
            a.nonce
        ));
    }
}
