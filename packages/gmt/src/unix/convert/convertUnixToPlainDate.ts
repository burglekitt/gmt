import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimezone } from "../../plain";
import { isValidTimezone } from "../../zoned";
import {
  isValidUnixMilliseconds,
  isValidUnixSeconds,
  isValidUnixUnit,
} from "../validate";

/**
 * Convert a Unix timestamp to a plain date string in the format "YYYY-MM-DD".
 *
 * - Accepts Unix timestamps in seconds or milliseconds (default is milliseconds).
 * - Returns an empty string for invalid inputs.
 * - Uses Temporal.ZonedDateTime for accurate date conversion.
 *
 * @param value Unix timestamp (number or string)
 * @param options conversion options
 * @example convertUnixToPlainDate(1706659200000) // "2024-02-29"
 * @example convertUnixToPlainDate(1706659200, { epochUnit: "seconds" }) // "2024-02-29"
 * @returns plain date string in "YYYY-MM-DD" format or "" on invalid input
 */

export function convertUnixToPlainDate(
  unix: number | string,
  options?: { epochUnit?: "seconds" | "milliseconds"; timezone?: string },
): string {
  const { epochUnit = "milliseconds", timezone = getSystemTimezone() } =
    options ?? {};

  if (!isValidUnixUnit(epochUnit)) return "";
  if (!isValidTimezone(timezone)) return "";

  try {
    const numUnix = typeof unix === "string" ? Number(unix) : unix;
    if (
      (epochUnit === "milliseconds" && !isValidUnixMilliseconds(numUnix)) ||
      (epochUnit === "seconds" && !isValidUnixSeconds(numUnix))
    ) {
      return "";
    }

    const instant = Temporal.Instant.fromEpochMilliseconds(
      epochUnit === "seconds" ? numUnix * 1000 : numUnix,
    );
    const zonedDateTime = instant.toZonedDateTimeISO(timezone);
    return zonedDateTime.toPlainDate().toString();
  } catch {
    return "";
  }
}
