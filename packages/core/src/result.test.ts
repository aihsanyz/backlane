import { describe, expect, it } from 'vitest';
import { err, isErr, isOk, ok, unwrapOr } from './result.js';

describe('Result', () => {
  it('ok değeri taşır', () => {
    const r = ok(42);
    expect(isOk(r)).toBe(true);
    expect(isErr(r)).toBe(false);
    expect(r.value).toBe(42);
  });

  it('err hatayı taşır', () => {
    const hata = new Error('patladı');
    const r = err(hata);
    expect(isErr(r)).toBe(true);
    expect(r.error).toBe(hata);
  });

  it('unwrapOr err durumunda yedeği döner', () => {
    expect(unwrapOr(ok('a'), 'b')).toBe('a');
    expect(unwrapOr(err(new Error('yok')), 'b')).toBe('b');
  });
});
