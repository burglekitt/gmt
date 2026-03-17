import { Temporal } from "@js-temporal/polyfill";

import { isValidDate, isValidDateTime } from "../validate";

function isIsoDateLike(v: string): boolean {
  return isValidDate(v) || isValidDateTime(v);
}

export function areDatesEqual(value1: string, value2: string): boolean {
  if (!isIsoDateLike(value1) || !isIsoDateLike(value2)) {
    return false;
  }

  try {
    const date1 = Temporal.PlainDate.from(value1);
    const date2 = Temporal.PlainDate.from(value2);

    return (
      date1.year === date2.year &&
      date1.month === date2.month &&
      date1.day === date2.day
    );
  } catch {
    return false;
  }
}
