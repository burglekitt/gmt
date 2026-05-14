import { getSystemTimeZone } from "../plain";
import { isValidTimeZone } from "../zoned";

export function normalizeTimeZone(tz?: string): string {
  if (tz === "local") return getSystemTimeZone();
  if (typeof tz === "string" && tz.length > 0 && isValidTimeZone(tz)) return tz;
  return "UTC";
}
