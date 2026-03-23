// this functionally just returns date and time, that's it

export function parseZonedDateTime(value: string): string {
  try {
    const dateTimePart = value.split("[")[0];
    return dateTimePart;
  } catch {
    return "";
  }
}
