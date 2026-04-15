/**
 * Return the runtime system timeZone name (for example "America/New_York").
 *
 * @returns system timeZone name or an empty string on failure
 * 
 * @example getSystemTimeZone() // "America/New_York"
 */
export function getSystemTimeZone(): string {
  try {
    const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return systemTimeZone || "";
  } catch {
    return "";
  }
}
