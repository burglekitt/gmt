import { isValidZonedDateTime } from ".";

describe("isValidZonedDateTime", () => {
  it.each`
    value
    ${"2024-03-17T14:30:45.123-04:00[America/New_York]"}
    ${"2024-03-17T14:30:45.123[America/New_York]"}
    ${"2024-03-17T14:30:45Z[UTC]"}
  `(
    "returns true for valid zoned datetime: $value",
    ({ value }: { value: string }) => {
      expect(isValidZonedDateTime(value)).toBe(true);
    },
  );

  it.each`
    value
    ${"2024-03-17T14:30:45.123-04:00"}
    ${"2024-03-17T14:30:45Z"}
    ${"2024-03-17T14:30:45.123-04:00[Not/AZone]"}
    ${"not-a-zoned-datetime"}
  `(
    "returns false for invalid zoned datetime: $value",
    ({ value }: { value: string }) => {
      expect(isValidZonedDateTime(value)).toBe(false);
    },
  );
});
