## 2024-07-15 - Unconditional DOM Writes on Intervals
**Learning:** Unconditional DOM writes and re-evaluating properties on high-frequency timers (like `setInterval` for a clock) create unnecessary main-thread overhead and CPU usage. Also, creating `Intl.DateTimeFormat` objects dynamically on every tick is a heavy operation.
**Action:** Always cache expensive objects like `Intl.DateTimeFormat` outside of the interval function. Track the last rendered value in module-level variables and check if the computed string has changed before making any DOM updates (e.g. updating `textContent` or `style`).

## 2024-07-15 - [Test Coverage] Custom Node.js Test Runner
**Learning:** For vanilla JS projects without package managers, executing tests inside Node.js against functions that normally run in the browser can be challenging due to DOM dependencies (`document`, `window`).
**Action:** Extract pure functions by reading the source code as a string, splicing the function code, and evaluating it within the Node.js context before assertions. Use simple test runner scripts to maintain basic testing functionality without imposing heavy dependency constraints on zero-dependency projects.
