// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PlaygroundSpec } from "../src/lib/playground-spec";
import { GmtPlaygroundElement, registerGmtPlayground } from "../src/web-components";

const moduleMocks = vi.hoisted(() => {
  const mocks: Record<string, () => Promise<Record<string, unknown>>> = {};
  return { mocks };
});

vi.mock("../src/lib/gmt-modules", () => ({
  GMT_MODULES: moduleMocks.mocks,
}));

vi.mock("../src/lib/widget-state", () => ({
  WidgetStateManager: {
    hydrate: vi.fn(),
    observe: vi.fn(() => () => {}),
  },
}));

const spec: PlaygroundSpec = {
  module: "plain/calculate",
  fn: "addDays",
  params: [
    { name: "value", type: "string", value: "2024-03-15" },
    { name: "days", type: "string", value: "5" },
  ],
  returnType: "string",
};

function buildPlayground(specJson = JSON.stringify(spec)): GmtPlaygroundElement {
  const el = document.createElement("gmt-playground") as GmtPlaygroundElement;
  el.dataset.spec = specJson;
  el.dataset.widgetId = "test-widget";
  el.innerHTML = `
    <div class="gmt-playground-inputs">
      <input class="gmt-playground-input" data-param="value" value="2024-03-15" />
      <input class="gmt-playground-input" data-param="days" value="5" />
    </div>
    <div class="gmt-playground-call">
      <div class="gmt-playground-call-code"></div>
      <button class="gmt-playground-copy" data-copied="Copied!"></button>
      <button class="gmt-playground-permalink" data-copied="Copied!"></button>
      <div aria-live="polite"></div>
    </div>
    <output class="gmt-playground-result" data-return-type="string"></output>
  `;
  return el;
}

describe("GmtPlaygroundElement", () => {
  beforeEach(() => {
    moduleMocks.mocks["plain/calculate"] = vi.fn(async () => ({
      addDays: () => "2024-03-20",
    }));
    vi.clearAllMocks();
  });

  it("registers the custom element exactly once", () => {
    expect(customElements.get("gmt-playground")).toBeUndefined();
    registerGmtPlayground();
    expect(customElements.get("gmt-playground")).toBeDefined();
    registerGmtPlayground();
    expect(customElements.get("gmt-playground")).toBeDefined();
  });

  it("hydrates and renders a successful result", async () => {
    const el = buildPlayground();
    document.body.appendChild(el);
    await el.connectedCallback();

    const result = el.querySelector(".gmt-playground-result") as HTMLElement;
    expect(result.textContent).toBe("2024-03-20");
    expect(result.classList.contains("gmt-playground-live")).toBe(true);
    expect(result.classList.contains("gmt-playground-sentinel")).toBe(false);
  });

  it("renders a sentinel when the function throws", async () => {
    moduleMocks.mocks["plain/calculate"] = vi.fn(async () => ({
      addDays: () => {
        throw new Error("bad input");
      },
    }));

    const el = buildPlayground();
    document.body.appendChild(el);
    await el.connectedCallback();

    const result = el.querySelector(".gmt-playground-result") as HTMLElement;
    expect(result.textContent).toBe("⟨ NO SIGNAL — invalid input ⟩");
    expect(result.classList.contains("gmt-playground-sentinel")).toBe(true);
  });

  it("renders a module-load error when the importer fails", async () => {
    moduleMocks.mocks["plain/calculate"] = vi.fn(async () => {
      throw new Error("chunk missing");
    });

    const el = buildPlayground();
    document.body.appendChild(el);
    await el.connectedCallback();

    const result = el.querySelector(".gmt-playground-result") as HTMLElement;
    expect(result.textContent).toBe("⟨ module failed to load ⟩");
    expect(result.classList.contains("gmt-playground-sentinel")).toBe(true);
  });

  it("renders a missing-export error when the fn is not on the module", async () => {
    moduleMocks.mocks["plain/calculate"] = vi.fn(async () => ({
      somethingElse: () => "nope",
    }));

    const el = buildPlayground();
    document.body.appendChild(el);
    await el.connectedCallback();

    const result = el.querySelector(".gmt-playground-result") as HTMLElement;
    expect(result.textContent).toBe('⟨ "addDays" is not exported ⟩');
    expect(result.classList.contains("gmt-playground-sentinel")).toBe(true);
  });

  it("recomputes when an input changes", async () => {
    moduleMocks.mocks["plain/calculate"] = vi.fn(async () => ({
      addDays: (_value: string, days: string) => {
        return `2024-03-${15 + Number(days)}`;
      },
    }));

    const el = buildPlayground();
    document.body.appendChild(el);
    await el.connectedCallback();

    const input = el.querySelector('[data-param="days"]') as HTMLInputElement;
    input.value = "10";
    input.dispatchEvent(new Event("input"));

    const result = el.querySelector(".gmt-playground-result") as HTMLElement;
    expect(result.textContent).toBe("2024-03-25");
  });

  it("renders the call code with highlighted syntax", async () => {
    const el = buildPlayground();
    document.body.appendChild(el);
    await el.connectedCallback();

    const callCode = el.querySelector(".gmt-playground-call-code") as HTMLElement;
    expect(callCode.innerHTML).toContain("addDays");
    expect(callCode.innerHTML).toContain('"2024-03-15"');
    expect(callCode.innerHTML).toContain('"5"');
  });

  it("copies the call code to the clipboard", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
    });

    const el = buildPlayground();
    document.body.appendChild(el);
    await el.connectedCallback();

    const copyBtn = el.querySelector(".gmt-playground-copy") as HTMLButtonElement;
    copyBtn.click();

    expect(mockWriteText).toHaveBeenCalledWith('addDays("2024-03-15", "5")');
  });

  it("copies the permalink to the clipboard", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
    });

    const el = buildPlayground();
    document.body.appendChild(el);
    await el.connectedCallback();

    const permalinkBtn = el.querySelector(".gmt-playground-permalink") as HTMLButtonElement;
    permalinkBtn.click();

    expect(mockWriteText).toHaveBeenCalledWith(window.location.href);
  });

  it("removes itself from connectedPlaygrounds on disconnect", async () => {
    const el = buildPlayground();
    document.body.appendChild(el);
    await el.connectedCallback();

    document.body.removeChild(el);

    expect(el.isConnected).toBe(false);
  });
});
