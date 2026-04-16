import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  try {
    vi.useRealTimers();
  } catch {}
});
