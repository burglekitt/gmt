import { getLargestDateUnit } from "./getLargestDateUnit";

describe("getLargestDateUnit", () => {
  it("should return the largest unit from the array", () => {
    expect(getLargestDateUnit(["days", "months", "years"])).toBe("years");
    expect(getLargestDateUnit(["weeks", "days"])).toBe("weeks");
    expect(getLargestDateUnit(["months", "days"])).toBe("months");
  });

  it("should default to days if no valid unit is found", () => {
    expect(getLargestDateUnit([])).toBe("days");
  });
});
