import { getLargestDateTimeUnit } from "./getLargestDateTimeUnit";

describe("getLargestDateTimeUnit", () => {
  it("should return the largest unit from the array", () => {
    expect(getLargestDateTimeUnit(["seconds", "minutes", "hours"])).toBe(
      "hours",
    );
    expect(getLargestDateTimeUnit(["milliseconds", "seconds"])).toBe("seconds");
    expect(getLargestDateTimeUnit(["microseconds", "milliseconds"])).toBe(
      "milliseconds",
    );
    expect(getLargestDateTimeUnit(["days", "months", "years"])).toBe("years");
    expect(getLargestDateTimeUnit(["weeks", "days"])).toBe("weeks");
    expect(getLargestDateTimeUnit(["months", "days"])).toBe("months");
  });

  it("should default to seconds if no valid unit is found", () => {
    expect(getLargestDateTimeUnit([])).toBe("seconds");
  });
});
