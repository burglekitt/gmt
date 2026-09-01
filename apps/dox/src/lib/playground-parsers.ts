/**
 * Pure string parsers shared between the Node build pipeline and the browser
 * live-playground client.
 *
 * These functions intentionally have zero TypeScript or Node dependencies so
 * they can be imported directly in Astro components.
 */

export function splitTopLevel(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  let inStr: string | null = null;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      cur += ch;
      if (ch === inStr && s[i - 1] !== "\\") inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = ch;
      cur += ch;
      continue;
    }
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    if (ch === ")" || ch === "]" || ch === "}") depth--;
    if (ch === "," && depth === 0) {
      const trimmed = cur.trim();
      if (trimmed.length > 0) out.push(trimmed);
      cur = "";
      continue;
    }
    cur += ch;
  }
  const tail = cur.trim();
  if (tail.length > 0) out.push(tail);
  return out;
}

export function parseCallArgs(call: string): string[] {
  const open = call.indexOf("(");
  const close = call.lastIndexOf(")");
  if (open < 0 || close < 0 || close < open) return [];
  const inner = call.slice(open + 1, close);
  return splitTopLevel(inner)
    .map((a) => a.trim())
    .filter((a) => a.length > 0);
}

export function argToValue(raw: string): string {
  const t = raw.trim();
  if (
    (t.startsWith('"') && t.endsWith('"') && t.length >= 2) ||
    (t.startsWith("'") && t.endsWith("'") && t.length >= 2)
  ) {
    return t.slice(1, -1);
  }
  return t;
}

// ---------------------------------------------------------------------------
// Input serialization — converts typed inputs back to a call string
// ---------------------------------------------------------------------------

export interface ParamInput {
  name: string;
  type: "string" | "number" | "boolean" | "enum" | "units" | "array";
  value: string;
  options?: string[];
  unitValue?: string;
  arrayType?: "number" | "string";
}

/**
 * Serialize typed inputs back to a call string.
 * Example: `addDate("2024-03-15", { days: 5 })`
 */
export function serializeInputs(
  params: ParamInput[],
  options?: ParamInput[],
): string {
  const args: string[] = [];

  for (const p of params) {
    switch (p.type) {
      case "string":
        args.push(JSON.stringify(p.value));
        break;
      case "number":
        args.push(p.value || "0");
        break;
      case "boolean":
        args.push(p.value === "true" ? "true" : "false");
        break;
      case "enum":
        // Use the selected option value, or empty string if unset
        const enumVal = p.options?.includes(p.value) ? p.value : "";
        args.push(enumVal ? JSON.stringify(enumVal) : "");
        break;
      case "units": {
        const unit = p.unitValue || p.options?.[0] || "";
        const amount = p.value || "1";
        args.push(`{ ${unit}: ${amount} }`);
        break;
      }
      case "array": {
        const elements = p.value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (p.arrayType === "number") {
          args.push(
            `[${elements.map((e) => (isNaN(Number(e)) ? JSON.stringify(e) : e)).join(", ")}]`,
          );
        } else {
          args.push(`[${elements.map((e) => JSON.stringify(e)).join(", ")}]`);
        }
        break;
      }
      default:
        args.push(JSON.stringify(p.value));
    }
  }

  if (options?.length) {
    const optEntries: string[] = [];
    for (const o of options) {
      let val: string;
      switch (o.type) {
        case "boolean":
          val = o.value === "true" ? "true" : "false";
          break;
        case "enum":
          val = o.options?.includes(o.value) ? JSON.stringify(o.value) : "";
          break;
        case "number":
          val = o.value || "0";
          break;
        default:
          val = o.value ? JSON.stringify(o.value) : "";
      }
      if (val) {
        optEntries.push(`${o.name}: ${val}`);
      }
    }
    if (optEntries.length) {
      args.push(`{ ${optEntries.join(", ")} }`);
    }
  }

  return args.join(", ");
}
