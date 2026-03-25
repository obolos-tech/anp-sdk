/**
 * ANP Document Types
 *
 * Every ANP interaction (listing, bid, acceptance) is represented as a signed,
 * content-addressed document. These types define the structure of those documents.
 */

import type { ANP_VERSION } from './constants.js';

export interface ListingData {
  title: string;
  description: string;
  minBudget: string;          // USDC amount, 6 decimals (e.g. "5000000" = $5)
  maxBudget: string;
  deadline: number;           // unix timestamp
  jobDuration: number;        // seconds
  preferredEvaluator: string; // 0x address or "0x0000000000000000000000000000000000000000"
  nonce: number;
}

export interface BidData {
  listingCid: string;         // CID of the listing document
  listingHash: string;        // EIP-712 struct hash of ListingIntent (0x prefixed)
  price: string;              // USDC amount, 6 decimals
  deliveryTime: number;       // seconds
  message?: string;           // short message to client
  proposalCid?: string;       // CID of a detailed proposal document
  nonce: number;
}

export interface AcceptanceData {
  listingCid: string;         // CID of the listing
  bidCid: string;             // CID of the accepted bid
  listingHash: string;        // EIP-712 struct hash of ListingIntent
  bidHash: string;            // EIP-712 struct hash of BidIntent
  nonce: number;
}

export interface ANPDocument<T = ListingData | BidData | AcceptanceData> {
  protocol: typeof ANP_VERSION;
  type: 'listing' | 'bid' | 'acceptance';
  data: T;
  signer: string;             // 0x address (lowercase)
  signature: string;          // EIP-712 signature (0x prefixed hex)
  timestamp: number;          // unix ms when document was created
}

/** Pluggable storage interface — implement for your backend (SQLite, Postgres, IPFS, etc.) */
export interface ANPStorage {
  getObject(cid: string): Promise<ANPStoredObject | null>;
  putObject(obj: ANPStoredObject): Promise<void>;
  indexListing(entry: ListingIndexEntry): Promise<void>;
  getListing(cid: string): Promise<ListingIndexEntry | null>;
  queryListings(query: ListingQuery): Promise<{ listings: ListingIndexEntry[]; total: number }>;
  updateListingStatus(cid: string, status: string, fields?: Partial<ListingIndexEntry>): Promise<void>;
  indexBid(entry: BidIndexEntry): Promise<void>;
  getBidsForListing(listingCid: string): Promise<BidIndexEntry[]>;
}

export interface ANPStoredObject {
  cid: string;
  protocol: string;
  type: string;
  signer: string;
  content: string;
}

export interface ListingIndexEntry {
  cid: string;
  clientAddress: string;
  contentHash: string;
  title: string;
  description: string;
  minBudget: string;
  maxBudget: string;
  deadline: string | null;
  jobDuration: number;
  preferredEvaluator: string | null;
  nonce: number;
  status?: string;
  bidCount?: number;
  acceptedBidCid?: string | null;
  settlementId?: number | null;
  acpJobId?: number | null;
}

export interface BidIndexEntry {
  cid: string;
  listingCid: string;
  providerAddress: string;
  price: string;
  deliveryTime: number;
  message: string | null;
  nonce: number;
}

export interface ListingQuery {
  status?: string;
  client?: string;
  page?: number;
  limit?: number;
}
