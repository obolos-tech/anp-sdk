/**
 * Document builder — creates complete ANP documents ready for publishing.
 */

import { ANP_VERSION } from './constants.js';
import type { ANPDocument, ListingData, BidData, AcceptanceData } from './types.js';

export function buildDocument<T extends ListingData | BidData | AcceptanceData>(
  type: ANPDocument['type'],
  data: T,
  signer: string,
  signature: string,
): ANPDocument<T> {
  return {
    protocol: ANP_VERSION,
    type,
    data,
    signer: signer.toLowerCase(),
    signature,
    timestamp: Date.now(),
  };
}
