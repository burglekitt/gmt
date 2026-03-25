import type { DateTimeDurationUnit } from "../../types";

/**
 * Return the largest DateTimeUnit from the provided array.
 * The order of units from largest to smallest is: years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds.
 * If no valid unit is found, defaults to "seconds" (though this case should be prevented by validation).
 *
 * @param units array of DateTimeUnit to evaluate
 * @returns the largest DateTimeUnit found, or "seconds" if none are valid
 */
export function getLargestDateTimeUnit(
  units: DateTimeDurationUnit[],
): DateTimeDurationUnit {
  const order: DateTimeDurationUnit[] = [
    "years",
    "months",
    "weeks",
    "days",
    "hours",
    "minutes",
    "seconds",
    "milliseconds",
    "microseconds",
    "nanoseconds",
  ];
  for (const unit of order) {
    if (units.includes(unit)) {
      return unit;
    }
  }
  // Default to seconds if no valid unit found, though this case should be prevented by validation
  return "seconds";
}
