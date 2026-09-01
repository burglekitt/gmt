/**
 * Live Playground — client-side initialization.
 *
 * Combines two responsibilities:
 * 1. Assigns `window.__gmtPlaygroundMount(specId, target)` — the function
 *    that builds and initializes a playground on demand.
 * 2. Sets up click delegation for `[data-gmt-playground-trigger]` buttons.
 *
 * Importing this module (as a side effect) is all that's needed — zero Astro
 * islands hydrate on page load. The GMT polyfill is only imported when a
 * reader clicks "Try it".
 */

import { GMT_MODULES } from "./gmt-modules";
import { parseCallArgs } from "./playground-parsers";
import { evaluateArg, renderResult, sentinelFor } from "./playground-client";
import { LIVE_PLAYGROUND_TEMPLATES } from "./playground-spec";

async function runFor(
  textarea: HTMLTextAreaElement,
  outputEl: HTMLElement,
  modKey: string,
  fnName: string,
  returnType: string,
  allowEmptyArray: boolean,
): Promise<void> {
  renderResult(outputEl, "", false);

  try {
    const mod = await GMT_MODULES[modKey]?.();
    if (!mod) throw new Error("module not found: " + modKey);
    const fn = mod[fnName];
    if (typeof fn !== "function")
      throw new Error("export not found: " + fnName);

    const call = fnName + "(" + textarea.value + ")";
    const args = parseCallArgs(call).map(evaluateArg);
    const result = (fn as (...a: unknown[]) => unknown)(...args);

    const sentinel = sentinelFor(returnType, allowEmptyArray);
    const isSentinel = result === sentinel && result !== 0 && result !== false;
    renderResult(outputEl, result as string, isSentinel);
  } catch {
    renderResult(outputEl, "", true);
  }
}

function mountPlayground(specId: string, target: HTMLElement): void {
  const template = LIVE_PLAYGROUND_TEMPLATES[specId];
  if (!template) return;

  const { module: mod, template: tpl, returnType, allowEmptyArray } = template;

  const parenIndex = tpl.indexOf("(");
  const closeParenIndex = tpl.lastIndexOf(")");
  const fnName = parenIndex >= 0 ? tpl.slice(0, parenIndex).trim() : tpl.trim();
  const argsString =
    parenIndex >= 0 && closeParenIndex > parenIndex
      ? tpl.slice(parenIndex + 1, closeParenIndex)
      : "";

  target.innerHTML = `
    <div class="gmt-live-playground">
      <div class="gmt-live-playground-field">
        <span class="gmt-live-playground-label">input</span>
        <div>
          <div class="gmt-live-playground-top-row">
            <code class="gmt-live-playground-fn">${fnName}</code>
            <span class="gmt-live-playground-paren">(</span>
            <button class="gmt-live-playground-run" type="button" title="Run">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </button>
          </div>
          <div class="gmt-live-playground-call">
            <textarea
              class="gmt-live-playground-textarea"
              data-module="${mod}"
              data-fn="${fnName}"
              data-return-type="${returnType}"
              spellcheck="false"
            >${argsString}</textarea>
          </div>
          <div class="gmt-live-playground-bottom-row">
            <span class="gmt-live-playground-paren">)</span>
          </div>
        </div>
      </div>
      <div class="gmt-live-playground-field">
        <span class="gmt-live-playground-label">output</span>
        <output class="gmt-live-playground-result" data-return-type="${returnType}" data-allow-empty-array="${allowEmptyArray ? "true" : ""}">&nbsp;</output>
      </div>
    </div>
  `;

  const textarea = target.querySelector(
    ".gmt-live-playground-textarea",
  ) as HTMLTextAreaElement | null;
  const outputEl = target.querySelector(
    ".gmt-live-playground-result",
  ) as HTMLElement | null;
  if (!textarea || !outputEl) return;

  const runBtn = target.querySelector(".gmt-live-playground-run");
  if (runBtn) {
    runBtn.addEventListener("click", () =>
      runFor(textarea, outputEl, mod, fnName, returnType, !!allowEmptyArray),
    );
  }
  runFor(textarea, outputEl, mod, fnName, returnType, !!allowEmptyArray);
}

function onClick(e: Event): void {
  const btn = (e.target as Element).closest(
    "[data-gmt-playground-trigger]",
  ) as HTMLButtonElement | null;
  if (!btn || !(btn instanceof HTMLButtonElement)) return;
  if (btn.disabled) return;

  const specId = btn.dataset.gmtPlaygroundSpecId;
  if (!specId) return;

  const target = btn.nextElementSibling;
  if (
    !target ||
    !(target instanceof HTMLElement) ||
    !target.hasAttribute("data-gmt-playground-target")
  )
    return;

  mountPlayground(specId, target);
  btn.disabled = true;
  btn.classList.add("gmt-playground-trigger--mounted");
}

if (typeof window !== "undefined") {
  window.__gmtPlaygroundMount = mountPlayground;
  window.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", onClick);
  });
}

declare global {
  interface Window {
    __gmtPlaygroundMount?: (specId: string, target: HTMLElement) => void;
  }
}

export {};
