import type { TimeUnits } from "../../types";

/**
 * Return the largest TimeUnit from the provided array, based on the order of units in Temporal.
 * The order of units from largest to smallest is: hours, minutes, seconds, milliseconds, microseconds, nanoseconds.
 * If no valid unit is found, defaults to "seconds" (though this case should be prevented by validation).
 *
 * @param units array of TimeUnits to evaluate
 * @returns the largest TimeUnit found in the array, or "seconds" if none are valid
 */
export function getLargestTimeUnit(units: TimeUnits[]): TimeUnits {
  const order: TimeUnits[] = [
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
