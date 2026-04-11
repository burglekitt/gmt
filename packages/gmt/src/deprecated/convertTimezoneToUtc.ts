import { convertZonedToUtc } from "../zoned/convert/convertZonedToUtc";

/**
 * @deprecated will be removed in v2.0.0 - use `convertZonedToUtc` instead
 * Thin compatibility wrapper that delegates to `convertZonedToUtc`.
 * Emits a single runtime warning when first called.
 *
 * @param value zoned ISO 8601 datetime string
 * @example convertTimezoneToUtc("2024-02-29T14:30:45-05:00[America/New_York]") // "2024-02-29T19:30:45Z"
 * @returns UTC Instant ISO string or empty string when invalid
 */
let warned = false;

export function convertTimezoneToUtc(value: string): string {
  if (!warned) {
    // eslint-disable-next-line no-console
    console.warn(
      "`convertTimezoneToUtc` is deprecated and will be removed in v2.0.0. Use `convertZonedToUtc` instead.",
    );
    warned = true;
  }

  return convertZonedToUtc(value);
}
