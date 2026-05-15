import { getSystemTimeZone } from "../plain/get/getSystemTimeZone";
import { isValidTimeZone } from "../zoned/validate";

export function normalizeTimeZone(tz?: string): string {
  if (tz === "local") return getSystemTimeZone();
  if (typeof tz === "string" && tz.length > 0 && isValidTimeZone(tz)) return tz;
  return "UTC";
}
