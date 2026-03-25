/**
 * Document builder — creates complete ANP documents ready for publishing.
 */
import { ANP_VERSION } from './constants.js';
export function buildDocument(type, data, signer, signature) {
    return {
        protocol: ANP_VERSION,
        type,
        data,
        signer: signer.toLowerCase(),
        signature,
        timestamp: Date.now(),
    };
}
//# sourceMappingURL=document.js.map