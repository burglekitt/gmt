import { isWeekStartsOn } from "./isWeekStartsOn";

describe("isWeekStartsOn", () => {
  it.each`
    value        | expected
    ${"monday"}  | ${true}
    ${"sunday"}  | ${true}
    ${"tuesday"} | ${false}
    ${"friday"}  | ${false}
    ${""}        | ${false}
    ${null}      | ${false}
    ${undefined} | ${false}
    ${123}       | ${false}
    ${{}}        | ${false}
  `("returns $expected for value '$value'", ({ value, expected }) => {
    expect(isWeekStartsOn(value)).toBe(expected);
  });
});
