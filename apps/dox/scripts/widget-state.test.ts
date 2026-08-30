// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { WidgetStateManager } from "../src/lib/widget-state";

const mockLocation = (hash: string) => {
  const loc = {
    hash,
    origin: "http://localhost",
    pathname: "/test",
    search: "",
    href: `http://localhost/test${hash}`,
    toString: () => "http://localhost/test",
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  };
  vi.stubGlobal("location", loc);
  return loc;
};

describe("WidgetStateManager", () => {
  // --- serialize / deserialize round-trip ---

  it("round-trips a simple state object", () => {
    const state = { value: "2024-03-15", unit: "day" };
    const hash = WidgetStateManager.serialize("playground", state);
    expect(hash).toBe("#widget=playground&value=2024-03-15&unit=day");

    const restored = WidgetStateManager.deserialize("playground", hash);
    expect(restored).toEqual({ value: "2024-03-15", unit: "day" });
  });

  it("round-trips values with special characters via encodeURIComponent", () => {
    const state = { value: "2024-03-15T14:30:45-05:00[America/New_York]" };
    const hash = WidgetStateManager.serialize("playground", state);
    const restored = WidgetStateManager.deserialize("playground", hash);
    expect(restored).toEqual({ value: "2024-03-15T14:30:45-05:00[America/New_York]" });
  });

  it("round-trips arrays using key[]=val1&key[]=val2", () => {
    const state = { tags: ["a", "b", "c"] };
    const hash = WidgetStateManager.serialize("playground", state);
    expect(hash).toBe("#widget=playground&tags%5B%5D=a&tags%5B%5D=b&tags%5B%5D=c");

    const restored = WidgetStateManager.deserialize("playground", hash);
    expect(restored).toEqual({ tags: ["a", "b", "c"] });
  });

  // --- multiple widgets ---

  it("serializes and deserializes multiple widget types in the same hash", () => {
    const hash =
      "#widget=playground&value=2024-03-15&unit=day" +
      "&widget=dst-inspector&zone=America/New_York&year=2024";

    const playground = WidgetStateManager.deserialize("playground", hash);
    expect(playground).toEqual({ value: "2024-03-15", unit: "day" });

    const inspector = WidgetStateManager.deserialize("dst-inspector", hash);
    expect(inspector).toEqual({ zone: "America/New_York", year: "2024" });
  });

  it("returns null when the requested widget type is not in the hash", () => {
    const hash = "#widget=other&value=1";
    expect(WidgetStateManager.deserialize("playground", hash)).toBeNull();
  });

  // --- malformed input ---

  it("returns null for an empty hash", () => {
    expect(WidgetStateManager.deserialize("playground", "")).toBeNull();
    expect(WidgetStateManager.deserialize("playground", "#")).toBeNull();
  });

  it("returns null for a hash without widget markers", () => {
    expect(WidgetStateManager.deserialize("playground", "#foo=bar")).toBeNull();
  });

  it("does not throw on completely garbled input", () => {
    expect(() => WidgetStateManager.deserialize("playground", "#%%%")).not.toThrow();
    expect(WidgetStateManager.deserialize("playground", "#%%%")).toBeNull();
  });

  // --- hydrate ---

  it("hydrate applies state to matching inputs by name", () => {
    mockLocation("#widget=playground&value=2024-03-15&unit=hour&disambiguation=reject");

    const root = document.createElement("div");
    root.innerHTML = `
      <input data-param="value" value="default" />
      <select data-param="unit"><option value="day">day</option><option value="hour" selected>hour</option></select>
      <input data-option="disambiguation" value="compatible" />
    `;

    const hydrated = WidgetStateManager.hydrate(root, "playground");
    expect(hydrated).toBe(true);

    const inputs = root.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select");
    const valueInput = [...inputs].find((el) => el.dataset.param === "value")!;
    const unitSelect = [...inputs].find((el) => el.dataset.param === "unit")!;
    const disambigInput = [...inputs].find((el) => el.dataset.option === "disambiguation")!;

    expect(valueInput.value).toBe("2024-03-15");
    expect(unitSelect.value).toBe("hour");
    expect(disambigInput.value).toBe("reject");

    vi.unstubAllGlobals();
  });

  it("hydrate returns false when no matching state exists in the hash", () => {
    mockLocation("#widget=other&value=1");

    const root = document.createElement("div");
    root.innerHTML = `<input data-param="value" value="default" />`;

    const hydrated = WidgetStateManager.hydrate(root, "playground");
    expect(hydrated).toBe(false);
    expect(root.querySelector("input")?.value).toBe("default");

    vi.unstubAllGlobals();
  });

  it("hydrate skips inputs that have no matching state key", () => {
    mockLocation("#widget=playground&value=2024-03-15");

    const root = document.createElement("div");
    root.innerHTML = `
      <input data-param="value" value="default" />
      <input data-param="unit" value="day" />
    `;

    const hydrated = WidgetStateManager.hydrate(root, "playground");
    expect(hydrated).toBe(true);

    const inputs = root.querySelectorAll<HTMLInputElement>("input");
    const valueInput = [...inputs].find((el) => el.dataset.param === "value")!;
    const unitInput = [...inputs].find((el) => el.dataset.param === "unit")!;

    expect(valueInput.value).toBe("2024-03-15");
    expect(unitInput.value).toBe("day"); // unchanged

    vi.unstubAllGlobals();
  });

  it("hydrate removes data-hydrating attribute after applying state", () => {
    mockLocation("#widget=playground&value=2024-03-15");

    const root = document.createElement("div");
    root.innerHTML = `<input data-param="value" value="default" />`;

    WidgetStateManager.hydrate(root, "playground");
    expect(root.hasAttribute("data-hydrating")).toBe(false);

    vi.unstubAllGlobals();
  });

  // --- readState ---

  it("readState collects data-param and data-option values", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <input data-param="value" value="2024-03-15" />
      <select data-option="disambiguation"><option value="reject" selected>reject</option></select>
    `;

    const state = WidgetStateManager.readState(root);
    expect(state).toEqual({
      value: "2024-03-15",
      disambiguation: "reject",
    });
  });

  // --- serialize edge cases ---

  it("serialize handles empty state with just the widget type", () => {
    const hash = WidgetStateManager.serialize("playground", {});
    expect(hash).toBe("#widget=playground");
    expect(WidgetStateManager.deserialize("playground", hash)).toEqual({});
  });

  // --- observe ---

  it("observe() preserves existing query params when writing hash", () => {
    // Stub location to have query params, but mock replaceState to prevent
    // jsdom SecurityError (stubbing location breaks jsdom's internal history).
    const loc = {
      hash: "",
      href: "http://localhost/test?foo=bar",
      origin: "http://localhost",
      pathname: "/test",
      search: "?foo=bar",
      assign: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn(),
      toString: () => "http://localhost/test?foo=bar",
    };
    vi.stubGlobal("location", loc);
    const replaceStateSpy = vi
      .spyOn(history, "replaceState")
      .mockImplementation(() => {});

    const root = document.createElement("div");
    root.innerHTML = `<input data-param="value" value="2024-03-15" />`;
    document.body.appendChild(root);

    const dispose = WidgetStateManager.observe(root, "playground");

    vi.useFakeTimers();
    root.querySelector("input")!.dispatchEvent(new Event("input"));
    vi.advanceTimersByTime(150);

    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    const calledUrl = replaceStateSpy.mock.calls[0][2] as string;
    expect(calledUrl).toContain("foo=bar");
    expect(calledUrl).toContain("widget=playground");
    expect(calledUrl).toContain("value=2024-03-15");

    dispose();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.removeChild(root);
  });

  it("observe() does not write to URL when not hydrating (skips data-hydrating)", () => {
    // Note: do NOT call mockLocation() here — jsdom's built-in location/history
    // is sufficient. Mocking location with vi.stubGlobal breaks jsdom's internal
    // history state consistency, causing replaceState() to throw SecurityError.
    const replaceStateSpy = vi
      .spyOn(history, "replaceState")
      .mockImplementation(() => {});

    const root = document.createElement("div");
    root.innerHTML = `<input data-param="value" value="2024-03-15" />`;
    document.body.appendChild(root);

    const dispose = WidgetStateManager.observe(root, "playground");

    // Set data-hydrating to block writes (simulates hydration phase)
    root.setAttribute("data-hydrating", "");

    vi.useFakeTimers();
    root.querySelector("input")!.dispatchEvent(new Event("input"));
    vi.advanceTimersByTime(150);

    expect(replaceStateSpy).not.toHaveBeenCalled();

    dispose();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.removeChild(root);
  });
});
