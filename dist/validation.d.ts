/**
 * Document structure validation (not signatures — that requires viem).
 */
import type { ANPDocument } from './types.js';
export declare function validateDocument(doc: ANPDocument): {
    valid: boolean;
    error?: string;
};
//# sourceMappingURL=validation.d.ts.map