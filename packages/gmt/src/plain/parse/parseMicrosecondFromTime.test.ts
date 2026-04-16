import { mockTemporalPlainTimeFromThrow } from "../../test/mocks";
import { parseMicrosecondFrom } from "./parseMicrosecondFromTime";

describe("parseMicrosecondFromTime", () => {
  it.each`
    value                | expected
    ${"14:30:45"}        | ${"000"}
    ${"14:30:45.123"}    | ${"000"}
    ${"14:30:45.123456"} | ${"456"}
  `("returns $expected for $value", ({ value, expected }) => {
    expect(parseMicrosecondFrom(value)).toBe(expected);
  });

  it.each`
    invalidValue
    ${"invalid"}
    ${"25:00:00"}
  `(
    "returns empty string for invalid time $invalidValue",
    ({ invalidValue }) => {
      expect(parseMicrosecondFrom(invalidValue)).toBe("");
    },
  );

  it("returns empty string on failure", () => {
    mockTemporalPlainTimeFromThrow();
    const result = parseMicrosecondFrom("14:30:45");
    expect(result).toBe("");
  });
});
