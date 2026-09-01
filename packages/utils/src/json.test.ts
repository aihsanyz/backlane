import { isErr, isOk } from '@backlane/core';
import { describe, expect, it } from 'vitest';
import { parseJson } from './json.js';

describe('parseJson', () => {
  it('geçerli json için ok döner', () => {
    const r = parseJson<{ ad: string }>('{"ad":"backlane"}');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) {
      expect(r.value.ad).toBe('backlane');
    }
  });

  it('bozuk json için istisna atmaz, err döner', () => {
    const r = parseJson('{bu json degil');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) {
      expect(r.error).toBeInstanceOf(SyntaxError);
    }
  });
});
