import { err, ok, type Result } from '@backlane/core';

/**
 * JSON.parse'ın istisna atmayan hâli. Çağıran taraf try/catch kurmak yerine
 * dönen Result'a bakıyor.
 */
export const parseJson = <T = unknown>(text: string): Result<T, SyntaxError> => {
  try {
    return ok(JSON.parse(text) as T);
  } catch (cause) {
    return err(cause instanceof SyntaxError ? cause : new SyntaxError(String(cause)));
  }
};
