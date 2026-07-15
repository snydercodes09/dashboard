## 2024-07-15 - Unconditional DOM Writes on Intervals
**Learning:** Unconditional DOM writes and re-evaluating properties on high-frequency timers (like `setInterval` for a clock) create unnecessary main-thread overhead and CPU usage. Also, creating `Intl.DateTimeFormat` objects dynamically on every tick is a heavy operation.
**Action:** Always cache expensive objects like `Intl.DateTimeFormat` outside of the interval function. Track the last rendered value in module-level variables and check if the computed string has changed before making any DOM updates (e.g. updating `textContent` or `style`).

## 2026-07-15 - [Security] XSS Vulnerability in UI Components via innerHTML
**Learning:** Using `innerHTML` with custom sanitization like `escapeHTML` for rendering user inputs into the DOM is insecure. Vulnerabilities can arise when properties are improperly unescaped, when elements dynamically run malicious payload, or when inputs end up inside executable contexts or attributes without strict escaping.
**Action:** Replace `innerHTML` usage with `document.createElement()` along with `.textContent` for assigning user-provided strings. For inputs, set `.value` after rendering static HTML structures. Never rely on string manipulation for basic XSS prevention when secure DOM APIs are available.
