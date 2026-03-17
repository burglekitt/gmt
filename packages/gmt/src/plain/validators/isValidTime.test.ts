import { isValidTime } from "./isValidTime";

describe("isValidTime", () => {
  it.each(["00:00:00", "23:59:59", "08:30:45.123"])(
    "returns true for valid time: %s",
    (value) => {
      expect(isValidTime(value)).toBe(true);
    },
  );

  it.each(["8:30:45", "24:00:00", "23:59", "hello"])(
    "returns false for invalid time: %s",
    (value) => {
      expect(isValidTime(value)).toBe(false);
    },
  );
});
