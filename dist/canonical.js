/**
 * Canonical JSON serialization (RFC 8785-like).
 * Sorts object keys recursively, ensures deterministic output.
 */
export function canonicalJSON(obj) {
    return JSON.stringify(obj, (_key, value) => {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return Object.keys(value).sort().reduce((sorted, key) => {
                sorted[key] = value[key];
                return sorted;
            }, {});
        }
        return value;
    });
}
//# sourceMappingURL=canonical.js.map