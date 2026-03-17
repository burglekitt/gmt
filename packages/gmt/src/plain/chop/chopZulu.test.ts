// Sometimes a datetime with a Z needs to be treated as just a plain date
// This function simply chops off the Z and any time information, leaving just the date
import { chopZulu } from "./chopZulu";

describe("chopZulu", () => {
  it.each`
    value                         | expected
    ${"2024-03-17T00:00:00Z"}     | ${"2024-03-17"}
    ${"2024-03-17T12:30:45Z"}     | ${"2024-03-17"}
    ${"2024-03-17T23:59:59Z"}     | ${"2024-03-17"}
    ${"2024-03-17T12:30:45.123Z"} | ${"2024-03-17"}
    ${"2024-03-17T12:30:45,999Z"} | ${"2024-03-17"}
    ${"+001234-12-31T23:59:59Z"}  | ${"+001234-12-31"}
  `(
    "returns $expected for $value",
    ({ value, expected }: { value: string; expected: string }) => {
      expect(chopZulu(value)).toBe(expected);
    },
  );

  it("throws for an invalid Zulu datetime (missing Z)", () => {
    expect(() => chopZulu("2024-03-17T12:30:45")).toThrow();
  });

  it("throws for a plain date (not a datetime)", () => {
    expect(() => chopZulu("2024-03-17")).toThrow();
  });

  it("throws for an invalid format", () => {
    expect(() => chopZulu("not-a-datetime")).toThrow();
  });
});
