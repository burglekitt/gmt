import { getLargestTimeUnit } from "./getLargestTimeUnit";

describe("getLargestTimeUnit", () => {
  it("should return the largest unit from the array", () => {
    expect(getLargestTimeUnit(["seconds", "minutes", "hours"])).toBe("hours");
    expect(getLargestTimeUnit(["milliseconds", "seconds"])).toBe("seconds");
    expect(getLargestTimeUnit(["microseconds", "milliseconds"])).toBe(
      "milliseconds",
    );
  });

  it("should default to seconds if no valid unit is found", () => {
    expect(getLargestTimeUnit([])).toBe("seconds");
  });
});
