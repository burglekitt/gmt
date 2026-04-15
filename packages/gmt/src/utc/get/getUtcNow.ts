import { Temporal } from "@js-temporal/polyfill";

/**
 * Return the current UTC instant as an ISO Instant string.
 *
 * @returns ISO Instant string (e.g. "2024-02-29T00:00:00Z") or empty string
 *
 * @example getUtcNow() // "2024-02-29T00:00:00Z"
 * @example getUtcNow() // "" (on failure)
 */
export function getUtcNow(): string {
  try {
    return Temporal.Now.instant().toString();
  } catch {
    return "";
  }
}
