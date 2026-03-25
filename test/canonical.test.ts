import { describe, it, expect } from 'vitest';
import { canonicalJSON } from '../src/canonical.js';

describe('canonicalJSON', () => {
  it('sorts object keys alphabetically at the top level', () => {
    const obj = { z: 1, a: 2, m: 3 };
    const result = canonicalJSON(obj);
    expect(result).toBe('{"a":2,"m":3,"z":1}');
  });

  it('sorts keys in nested objects recursively', () => {
    const obj = { outer: { z: 'last', a: 'first' }, b: 1 };
    const result = canonicalJSON(obj);
    expect(result).toBe('{"b":1,"outer":{"a":"first","z":"last"}}');
  });

  it('does not sort arrays — preserves element order', () => {
    const obj = { items: [3, 1, 2] };
    const result = canonicalJSON(obj);
    expect(result).toBe('{"items":[3,1,2]}');
  });

  it('preserves order of objects inside arrays', () => {
    const obj = { list: [{ b: 2, a: 1 }, { d: 4, c: 3 }] };
    const result = canonicalJSON(obj);
    expect(result).toBe('{"list":[{"a":1,"b":2},{"c":3,"d":4}]}');
  });

  it('handles null values without throwing', () => {
    const obj = { a: null, b: 'hello' };
    const result = canonicalJSON(obj);
    expect(result).toBe('{"a":null,"b":"hello"}');
  });

  it('produces identical output for semantically equal inputs with different key orders', () => {
    const v1 = { z: 99, a: 'alpha', m: true };
    const v2 = { m: true, z: 99, a: 'alpha' };
    expect(canonicalJSON(v1)).toBe(canonicalJSON(v2));
  });

  it('handles deeply nested objects with mixed key orders', () => {
    const v1 = { c: { z: 1, a: 2 }, a: { y: 3, b: 4 } };
    const v2 = { a: { b: 4, y: 3 }, c: { a: 2, z: 1 } };
    expect(canonicalJSON(v1)).toBe(canonicalJSON(v2));
  });

  it('handles primitive values (number, boolean, string) directly', () => {
    expect(canonicalJSON(42)).toBe('42');
    expect(canonicalJSON(true)).toBe('true');
    expect(canonicalJSON('hello')).toBe('"hello"');
  });
});
