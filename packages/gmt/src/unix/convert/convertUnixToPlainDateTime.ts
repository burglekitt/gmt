import { Temporal } from "@js-temporal/polyfill";
import { getSystemTimezone } from "../../plain";
import { isValidTimezone } from "../../zoned";
import {
  isValidUnixMilliseconds,
  isValidUnixSeconds,
  isValidUnixUnit,
} from "../validate";

/**
 * Convert a Unix timestamp to a plain datetime string in the format "YYYY-MM-DDTHH:mm:ss".
 * - Accepts Unix timestamps in seconds or milliseconds (default is milliseconds).
 * - Returns an empty string for invalid inputs.
 * - Uses Temporal.ZonedDateTime for accurate datetime conversion.
 *
 * @param unix Unix timestamp (number or string)
 * @param options conversion options
 * @example convertUnixToPlainDateTime(1706659200000) // "2024-02-29T00:00:00"
 * @example convertUnixToPlainDateTime(1706659200, { epochUnit: "seconds" }) // "2024-02-29T00:00:00"
 * @returns plain datetime string in "YYYY-MM-DDTHH:mm:ss" format or "" on invalid input
 */

export function convertUnixToPlainDateTime(
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
    return zonedDateTime.toPlainDateTime().toString();
  } catch {
    return "";
  }
}
