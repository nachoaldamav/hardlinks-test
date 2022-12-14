/**
 * @param value Markdown to parse (`string` or `Buffer`).
 * @param [encoding] Character encoding to understand `value` as when it’s a `Buffer` (`string`, default: `'utf8'`).
 * @param [options] Configuration
 */
export const micromark: ((
  value: Value,
  encoding: Encoding,
  options?: Options
) => string) &
  ((value: Value, options?: Options) => string)
export type Options = import('micromark-util-types').Options
export type Value = import('micromark-util-types').Value
export type Encoding = import('micromark-util-types').Encoding
