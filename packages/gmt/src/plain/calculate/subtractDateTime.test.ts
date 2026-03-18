import { subtractDateTime } from "./subtractDateTime";

describe("subtractDateTime", () => {
  it.each`
    value                 | amount  | unit             | expected
    ${"2024-03-17T14:30"} | ${1}    | ${"year"}        | ${"2023-03-17T14:30:00"}
    ${"2024-03-17T14:30"} | ${1}    | ${"month"}       | ${"2024-02-17T14:30:00"}
    ${"2024-03-17T14:30"} | ${2}    | ${"week"}        | ${"2024-03-03T14:30:00"}
    ${"2024-03-17T14:30"} | ${1}    | ${"day"}         | ${"2024-03-16T14:30:00"}
    ${"2024-03-17T14:30"} | ${2}    | ${"hour"}        | ${"2024-03-17T12:30:00"}
    ${"2024-03-17T14:30"} | ${45}   | ${"minute"}      | ${"2024-03-17T13:45:00"}
    ${"2024-03-17T14:30"} | ${45}   | ${"second"}      | ${"2024-03-17T14:29:15"}
    ${"2024-03-17T14:30"} | ${250}  | ${"millisecond"} | ${"2024-03-17T14:29:59.75"}
    ${"2024-03-17T14:30"} | ${500}  | ${"microsecond"} | ${"2024-03-17T14:29:59.9995"}
    ${"2024-03-17T14:30"} | ${1000} | ${"nanosecond"}  | ${"2024-03-17T14:29:59.999999"}
  `(
    "returns $expected for $value - $amount $unit",
    ({ value, amount, unit, expected }) => {
      expect(subtractDateTime(value, amount, unit)).toBe(expected);
    },
  );

  it.each`
    negativeAmount | expectedDateTime
    ${-1}          | ${"2024-03-17T14:31:00"}
    ${-30}         | ${"2024-03-17T15:00:00"}
    ${-90}         | ${"2024-03-17T16:00:00"}
  `(
    "returns $expectedDateTime when subtracting a negative amount: $negativeAmount",
    ({ negativeAmount, expectedDateTime }) => {
      expect(
        subtractDateTime("2024-03-17T14:30", negativeAmount, "minute"),
      ).toBe(expectedDateTime);
    },
  );

  it.each`
    invalidAmount
    ${"not-a-number"}
    ${NaN}
    ${null}
    ${undefined}
    ${true}
    ${false}
    ${""}
  `(
    "returns an empty string for an invalid amount: $invalidAmount",
    ({ invalidAmount }) => {
      expect(
        subtractDateTime("2024-03-17T14:30", invalidAmount as never, "minute"),
      ).toBe("");
    },
  );

  it.each`
    invalidValue
    ${"not-a-datetime"}
    ${"2024-02-30T14:30:00"}
    ${"2024-02-30T14:30:00Z"}
    ${"2024-02-30"}
    ${NaN}
    ${null}
    ${undefined}
    ${true}
    ${false}
    ${""}
  `(
    "returns an empty string for an invalid datetime: $invalidValue",
    ({ invalidValue }) => {
      expect(subtractDateTime(invalidValue as never, 30, "minute")).toBe("");
    },
  );

  it.each`
    invalidUnit
    ${"invalid"}
    ${""}
    ${null}
    ${undefined}
  `(
    "returns an empty string for an invalid unit: $invalidUnit",
    ({ invalidUnit }) => {
      expect(
        subtractDateTime("2024-03-17T14:30", 1, invalidUnit as never),
      ).toBe("");
    },
  );
});
