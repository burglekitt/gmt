import { Temporal } from "@js-temporal/polyfill";
import { parseEpochNumber } from "../../internal/formatHelpers";
import { normalizeDateTime } from "../../internal/normalizeDateTime";
import { getSystemTimeZone } from "../../plain/get/getSystemTimeZone";
import { isValidTimeZone } from "../../zoned/validate";
import {
  isValidUnixMilliseconds,
  isValidUnixSeconds,
  isValidUnixUnit,
} from "../validate";

type TimeZone = string | "local";

interface Options extends Intl.DateTimeFormatOptions {
  epochUnit?: "seconds" | "milliseconds";
  timeZone?: TimeZone;
}

/**
 * Return a localized string for a Unix epoch input using Intl options.
 *
 * @param value Unix epoch as number or string
 * @param locale optional BCP 47 locale identifier
 * @param options optional Intl.DateTimeFormatOptions with additional epochUnit and timeZone
 * @returns localized date-time string or "" on invalid input
 *
 * @example formatUnix(1706659200000, "en-US", { dateStyle: "medium", timeStyle: "short" }) // "Mar 1, 2024 at 12:00 AM"
 * @example formatUnix(1706659200000, "de-DE", { dateStyle: "medium", timeStyle: "short" }) // "01.03.2024, 00:00"
 * @example formatUnix("invalid") // ""
 *
 * Examples with passed timezones
 * @example formatUnix(1706659200000, "en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Paris" }) // "Mar 1, 2024 at 1:00 AM"
 * @example formatUnix(1706659200000, "en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "local" }) // "Mar 1, 2024 at [time in system timezone]"
 */

export function formatUnix(
  value: string | number,
  locale?: string,
  options?: Options,
): string {
  const {
    epochUnit = "milliseconds",
    timeZone = getSystemTimeZone(),
    ...intlOptions
  } = options ?? {};

  if (!isValidUnixUnit(epochUnit)) return "";

  const epochNum = parseEpochNumber(value);
  if (epochNum === null) return "";

  if (
    (epochUnit === "milliseconds" && !isValidUnixMilliseconds(epochNum)) ||
    (epochUnit === "seconds" && !isValidUnixSeconds(epochNum))
  ) {
    return "";
  }

  const resolvedTimeZone =
    timeZone === "local" ? getSystemTimeZone() : timeZone;
  if (!isValidTimeZone(resolvedTimeZone)) return "";

  try {
    const instant = Temporal.Instant.fromEpochMilliseconds(
      epochUnit === "seconds" ? epochNum * 1000 : epochNum,
    );

    const zoned = instant.toZonedDateTimeISO(resolvedTimeZone);
    const outBase = zoned.toPlainDateTime().toLocaleString(locale, intlOptions);
    return normalizeDateTime(outBase);
  } catch {
    return "";
  }
}
