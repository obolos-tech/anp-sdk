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
    minBudget: string;
    maxBudget: string;
    deadline: number;
    jobDuration: number;
    preferredEvaluator: string;
    nonce: number;
}
export interface BidData {
    listingCid: string;
    listingHash: string;
    price: string;
    deliveryTime: number;
    message?: string;
    proposalCid?: string;
    nonce: number;
}
export interface AcceptanceData {
    listingCid: string;
    bidCid: string;
    listingHash: string;
    bidHash: string;
    nonce: number;
}
export interface ANPDocument<T = ListingData | BidData | AcceptanceData> {
    protocol: typeof ANP_VERSION;
    type: 'listing' | 'bid' | 'acceptance';
    data: T;
    signer: string;
    signature: string;
    timestamp: number;
}
/** Pluggable storage interface — implement for your backend (SQLite, Postgres, IPFS, etc.) */
export interface ANPStorage {
    getObject(cid: string): Promise<ANPStoredObject | null>;
    putObject(obj: ANPStoredObject): Promise<void>;
    indexListing(entry: ListingIndexEntry): Promise<void>;
    getListing(cid: string): Promise<ListingIndexEntry | null>;
    queryListings(query: ListingQuery): Promise<{
        listings: ListingIndexEntry[];
        total: number;
    }>;
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
//# sourceMappingURL=types.d.ts.map