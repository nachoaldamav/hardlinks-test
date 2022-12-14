/**
 * Throw a given error.
 *
 * @param {Error|null|undefined} [error]
 *   Maybe error.
 * @returns {asserts error is null|undefined}
 */
export function bail(
  error?: Error | null | undefined
): asserts error is null | undefined
