import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimezone } from "../../plain";
import { isValidTimezone } from "../../zoned";
import {
  isValidUnixMilliseconds,
  isValidUnixSeconds,
  isValidUnixUnit,
} from "../validate";

/**
 * Convert a Unix timestamp to a plain time string in the format "HH:mm:ss".
 * - Accepts Unix timestamps in seconds or milliseconds (default is milliseconds).
 * - Returns an empty string for invalid inputs.
 * - Uses Temporal.ZonedDateTime for accurate time conversion.
 * @param unix Unix timestamp (number or string)
 * @param options conversion options
 * @example convertUnixToPlainTime(1706659200000) // "00:00:00"
 * @example convertUnixToPlainTime(1706659200, { epochUnit: "seconds" }) // "00:00:00"
 * @returns plain time string in "HH:mm:ss" format or "" on invalid input
 */
export function convertUnixToPlainTime(
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
    return zonedDateTime.toPlainTime().toString();
  } catch {
    return "";
  }
}
