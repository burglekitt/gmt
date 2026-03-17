import { isZuluDateTime } from "./isZuluDateTime";

describe("isZuluDateTime", () => {
  it.each`
    value
    ${"2024-03-17T14:30Z"}
    ${"2024-03-17T14:30:45Z"}
    ${"2024-03-17T14:30:45.123Z"}
    ${"2024-03-17T14:30:45,999Z"}
    ${"+001234-12-31T23:59:59Z"}
  `(
    "returns true for valid Zulu datetime: $value",
    ({ value }: { value: string }) => {
      expect(isZuluDateTime(value)).toBe(true);
    },
  );

  it.each`
    value
    ${"2024-03-17T14:30"}
    ${"2024-03-17T14:30:45"}
    ${"2024-03-17"}
    ${"2024-03-17T24:00:00Z"}
    ${"not-a-datetime"}
    ${"2024-03-17T14:30Z "}
  `(
    "returns false for invalid Zulu datetime: $value",
    ({ value }: { value: string }) => {
      expect(isZuluDateTime(value)).toBe(false);
    },
  );
});
