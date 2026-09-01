Plan: DOX-B2a-prereq — Param-Input Playground (replace textarea with typed controls)
TL;DR: The generator already classifies every param into { type, value, options, unitValue } but throws that data away — LIVE_PLAYGROUND_TEMPLATES only stores a raw call-string template. We extend the generated spec to include the full ParamSpec[], then render typed inputs (selects, toggles, number fields) instead of a textarea. On "Run", we serialize inputs back to a call string and execute as before.

Steps

Extend LivePlaygroundTemplate type — add params: ParamSpec[] and options?: ParamSpec[] to the interface in playground-spec.ts
Update generator to attach specs — modify buildLivePlaygroundTemplate() in build-reference.ts to pass doc.playgroundSpec?.params and doc.playgroundSpec?.options into the generated template record
Refactor PlaygroundLive.astro markup — replace the single <textarea> with a param-by-param input layout:
string → <input type="text"> (pre-filled with seed value)
number → <input type="number">
boolean → <select> with true/false options
enum → <select> with seeded default from options[]
units → <select> for unit name + <input type="number"> for amount (renders as { unit: amount })
array → <input type="text"> (comma-separated, pre-filled)
Options rendered inline after positional params, using the same type mapping
Add client-side serialization — in the <script> block, replace textarea.value with a function that reads all input values and reconstructs the call string: fn(arg1, arg2, { opt1: val1, opt2: val2 }). This replaces parseCallArgs(textarea.value) with serializeInputs(params, options).
Add CSS — new styles in gmt-live-playground.css for the input fields, labels, and units-pair layout. Keep existing .gmt-live-playground-\* classes; add .gmt-live-playground-input, .gmt-live-playground-units-pair, .gmt-live-playground-option-row.
Update PlaygroundLive.test.ts — adapt tests for the new input-based DOM structure (inputs instead of textarea).
Relevant files

playground-spec.ts — extend LivePlaygroundTemplate with params/options fields
build-reference.ts — buildLivePlaygroundTemplate() (line ~450) to attach doc.playgroundSpec?.params and doc.playgroundSpec?.options; the spec is already built at line 699
PlaygroundLive.astro — replace textarea markup with param-by-param inputs; replace textarea.value serialization with input-to-call-string logic
playground-parsers.ts — add serializeInputs(params, options) function (pure string output, zero deps)
gmt-live-playground.css — new styles for input fields, option rows, units pairs
PlaygroundLive.test.ts — adapt DOM queries from textarea to inputs
Verification

pnpm nx run dox:generate — verify generated templates include params[] with correct types (spot-check a function with enum params like durationAs, and one with units like addDate)
pnpm nx run dox:dev — open a reference page, confirm inputs render with seeded values, edit values, click Run, confirm output updates correctly
Test edge cases: function with no options (e.g., getDay), function with only options (rare), function with units param, function with array param
pnpm nx run-many -t lint test typecheck build — all green
Decisions

Keep the textarea as a fallback? No. The textarea was a POC. Typed inputs are strictly better for every param type except array (where a text input is still needed). We replace entirely.
Web component vs Astro island? Astro island. The param→input mapping works fine in the existing <script> block. A custom element adds shadow DOM complexity for no real gain.
Backward compat with old generated templates? The generator always regenerates live-playground-templates.ts on source change, so old templates won't persist. But we should handle params being undefined gracefully in the component (fall back to textarea mode) for safety during transition.
Scope: This is DOX-B2a's prerequisite. B2b/B2c/B2d are separate purpose-built widgets that don't use this component.
Further Considerations

Array inputs — comma-separated text is the best we can do without a custom multi-value widget. Should we add a "+" button to append values? Probably out of scope for v1; keep it simple.
Keyboard accessibility — all <input>, <select> elements are naturally keyboard-operable. The Run button already has focus styles. No additional work needed beyond standard HTML semantics.
What about functions with complex option objects? Some options have nested objects (e.g., { roundingMode: { maximumSignificantDigits: 3 } }). These are rare in GMT — most options are flat. If we encounter nested options, we'd need a sub-object renderer, but that's a future enhancement, not v1.
