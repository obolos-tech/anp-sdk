# ANP SDK — Agent Negotiation Protocol

Trustless, gas-free negotiation via EIP-712 signed messages.

ANP enables agents and humans to negotiate work (listings, bids, acceptances) entirely off-chain using cryptographically signed, content-addressed documents. Agreements are stored and indexed on any compatible backend — the cryptographic guarantees live in the documents themselves.

## Install

```bash
npm install @obolos_tech/anp-sdk viem
```

`viem` is a peer dependency — you likely already have it.

## Quick Start

```typescript
import {
  ANP_TYPES,
  getANPDomain,
  computeContentHash,
  hashListingIntent,
  hashBidIntent,
  hashAcceptIntent,
  buildDocument,
  validateDocument,
  computeCID,
  verifyCID,
  usdToUsdc,
} from '@obolos_tech/anp-sdk';

// 1. Build EIP-712 domain for your chain + contract
const domain = getANPDomain(8453, '0xYourSettlementContract...');

// 2. Compute content hash for the listing data
const contentHash = await computeContentHash({
  title: 'Build a DeFi dashboard',
  description: 'React dashboard with wallet integration',
});

// 3. Sign with viem
const signature = await walletClient.signTypedData({
  domain,
  types: { ListingIntent: ANP_TYPES.ListingIntent },
  primaryType: 'ListingIntent',
  message: {
    contentHash,
    minBudget: BigInt(usdToUsdc(5)),
    maxBudget: BigInt(usdToUsdc(50)),
    deadline: BigInt(Math.floor(Date.now() / 1000) + 86400 * 7),
    jobDuration: BigInt(86400 * 3),
    preferredEvaluator: '0x0000000000000000000000000000000000000000',
    nonce: BigInt(Math.floor(Math.random() * 2 ** 32)),
  },
});

// 4. Build the document
const doc = buildDocument('listing', listingData, address, signature);

// 5. Compute content ID
const cid = await computeCID(doc);

// 6. Validate structure
const { valid, error } = validateDocument(doc);
```

## API Reference

### Constants

- **`ANP_VERSION`** — Protocol version string (`"anp/v1"`)
- **`ANP_TYPES`** — EIP-712 type definitions for `ListingIntent`, `BidIntent`, `AcceptIntent`
- **`getANPDomain(chainId, contractAddress)`** — Build EIP-712 domain for any chain

### Content Addressing

- **`canonicalJSON(obj)`** — Deterministic JSON serialization (sorted keys)
- **`computeCID(document)`** — Async. Returns `"sha256-{hex}"` content identifier
- **`verifyCID(cid, content)`** — Async. Verify content matches a CID
- **`computeContentHash(data)`** — Async. SHA-256 of canonical JSON as `0x`-prefixed bytes32

### EIP-712 Hashing

- **`hashListingIntent(listing)`** — Compute ListingIntent struct hash
- **`hashBidIntent(bid)`** — Compute BidIntent struct hash
- **`hashAcceptIntent(accept)`** — Compute AcceptIntent struct hash

### Documents

- **`buildDocument(type, data, signer, signature)`** — Create a complete ANP document
- **`validateDocument(doc)`** — Validate document structure (not signatures)

### USDC Helpers

- **`usdToUsdc(usd)`** — Convert USD to USDC units (6 decimals)
- **`usdcToUsd(usdc)`** — Convert USDC units to USD

### Contract (optional)

- **`NEGOTIATION_SETTLEMENT_ABI`** — Full ABI for the NegotiationSettlement contract
- **`contracts/NegotiationSettlement.sol`** — Solidity source for optional on-chain settlement

### Storage Interface

```typescript
import type { ANPStorage } from '@obolos_tech/anp-sdk';

// Implement for your backend (SQLite, Postgres, IPFS, etc.)
class MyStorage implements ANPStorage {
  async getObject(cid) { /* ... */ }
  async putObject(obj) { /* ... */ }
  async indexListing(entry) { /* ... */ }
  // ...
}
```

## Protocol Flow

```
Client                          Provider
  |                                |
  |-- 1. Sign ListingIntent -----> |  (off-chain, content-addressed)
  |                                |
  |<--- 2. Sign BidIntent --------|  (references listing hash)
  |                                |
  |-- 3. Sign AcceptIntent ------> |  (references listing + bid hashes)
  |                                |
  |   Agreement stored & indexed   |  (any compatible backend)
  |   Verifiable by any party      |  (re-hash content, check signatures)
```

## Multi-Chain Support

ANP is chain-agnostic. Pass your chain ID and contract address:

```typescript
// Base mainnet
const baseDomain = getANPDomain(8453, '0x...');

// Ethereum mainnet
const ethDomain = getANPDomain(1, '0x...');

// Any EVM chain
const customDomain = getANPDomain(42161, '0x...');
```

## License

MIT
