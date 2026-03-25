/**
 * Document builder — creates complete ANP documents ready for publishing.
 */
import type { ANPDocument, ListingData, BidData, AcceptanceData } from './types.js';
export declare function buildDocument<T extends ListingData | BidData | AcceptanceData>(type: ANPDocument['type'], data: T, signer: string, signature: string): ANPDocument<T>;
//# sourceMappingURL=document.d.ts.map