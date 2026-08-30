/**
 * Widget state serialization — URL hash permalink mechanism (DOX-B1b).
 *
 * Each Tier 2 widget owns a named key in the URL hash:
 *
 *   #widget=<type>&<key>=<value>&<key2>=<value2>&widget=<next-type>&…
 *
 * Multiple widgets can coexist.  Arrays use `key[]=val1&key[]=val2`.
 *
 * Usage:
 *   // Serialize current widget state
 *   const hash = WidgetStateManager.serialize("playground", { value: "2024-03-15", unit: "day" });
 *
 *   // Deserialize state for a specific widget
 *   const state = WidgetStateManager.deserialize("playground", window.location.hash);
 *
 *   // Subscribe to DOM changes on a widget root
 *   const dispose = WidgetStateManager.observe(root, "playground");
 *
 *   // Hydrate widget from URL on connect
 *   const hydrated = WidgetStateManager.hydrate(root, "playground");
 */

type SerializedState = Record<string, string | string[]>;

export class WidgetStateManager {
  /** Serialize a widget's state to a URL hash string. */
  static serialize(type: string, state: Record<string, unknown>): string {
    const parts = ["widget=" + encodeURIComponent(type)];
    for (const [key, value] of Object.entries(state)) {
      if (Array.isArray(value)) {
        for (const v of value) {
          parts.push(
            encodeURIComponent(key + "[]") +
              "=" +
              encodeURIComponent(String(v)),
          );
        }
      } else {
        parts.push(
          encodeURIComponent(key) + "=" + encodeURIComponent(String(value)),
        );
      }
    }
    return "#" + parts.join("&");
  }

  /** Deserialize a widget's state from a URL hash string. Returns null if not found or malformed. */
  static deserialize(type: string, hash: string): SerializedState | null {
    if (!hash || !hash.startsWith("#")) return null;
    const params = new URLSearchParams(hash.slice(1));

    // Find the widget type that matches our type.
    // Multiple widgets can coexist via repeated widget= markers.
    const widgetTypes: string[] = [];
    for (const wt of params.getAll("widget")) {
      widgetTypes.push(decodeURIComponent(wt));
    }

    // Find the index of our matching type
    const matchIdx = widgetTypes.indexOf(type);
    if (matchIdx === -1) return null;

    // Collect all keys that belong to this widget section.
    // Keys between widget[type] and the next widget= marker belong to this widget.
    const state: SerializedState = {};
    let found = false;

    for (const [rawKey, rawValue] of params.entries()) {
      if (rawKey === "widget") {
        if (found) break; // past our section
        found = widgetTypes[widgetTypes.indexOf(rawValue)] === type;
        continue;
      }
      if (!found) continue;

      const key = decodeURIComponent(rawKey);
      const value = decodeURIComponent(rawValue);

      if (key.endsWith("[]")) {
        const arrayKey = key.slice(0, -2);
        if (!(arrayKey in state)) {
          state[arrayKey] = [] as string[];
        }
        (state[arrayKey] as string[]).push(value);
      } else {
        state[key] = value;
      }
    }

    // Return the state even if empty — the widget type was found, it just has no keys.
    return found ? state : null;
  }

  /** Read current widget state from its DOM inputs. */
  static readState(root: HTMLElement): SerializedState {
    const state: SerializedState = {};
    root
      .querySelectorAll<HTMLInputElement | HTMLSelectElement>(
        "[data-param], [data-option]",
      )
      .forEach((el) => {
        const name = el.dataset.param ?? el.dataset.option;
        if (!name) return;
        state[name] = el.value;
      });
    return state;
  }

  /**
   * Subscribe to DOM changes on a widget root, debounce, and write to URL hash.
   * Returns a dispose function.
   */
  static observe(root: HTMLElement, type: string): () => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const scheduleWrite = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const state = WidgetStateManager.readState(root);
        const hash = WidgetStateManager.serialize(type, state);
        const url = new URL(window.location.href);
        url.hash = hash;
        history.replaceState(null, "", url.toString());
      }, 150);
    };

    // Listen for input/change events on form controls
    const listener = () => {
      // Skip writes during hydration to avoid overwriting URL state with
      // default input values before the browser has a chance to navigate.
      if (root.hasAttribute("data-hydrating")) return;
      scheduleWrite();
    };
    root.querySelectorAll("input, select").forEach((el) => {
      el.addEventListener("input", listener);
      el.addEventListener("change", listener);
    });

    // Also watch for attribute changes (e.g. programmatic value changes)
    const observer = new MutationObserver(() => {
      // Only write if the change came from a user interaction
      // (avoid loops from our own hydration writes)
      if (root.hasAttribute("data-hydrating")) return;
      scheduleWrite();
    });

    observer.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["value", "data-param", "data-option"],
    });

    return () => {
      if (timeout) clearTimeout(timeout);
      observer.disconnect();
      root.querySelectorAll("input, select").forEach((el) => {
        el.removeEventListener("input", listener);
        el.removeEventListener("change", listener);
      });
    };
  }

  /**
   * On widget connect: read URL hash, apply state to matching inputs.
   * Returns true if state was hydrated from URL.
   */
  static hydrate(root: HTMLElement, type: string): boolean {
    const hash = window.location.hash;
    if (!hash) return false;

    const state = WidgetStateManager.deserialize(type, hash);
    if (!state) return false;

    root.setAttribute("data-hydrating", "");
    for (const [key, value] of Object.entries(state)) {
      const selector = `[data-param="${key}"], [data-option="${key}"]`;
      const el = root.querySelector<HTMLInputElement | HTMLSelectElement>(
        selector,
      );
      if (el) {
        if (Array.isArray(value)) {
          el.value = value[0] ?? "";
        } else {
          el.value = value;
        }
      }
    }
    root.removeAttribute("data-hydrating");
    return true;
  }
}
