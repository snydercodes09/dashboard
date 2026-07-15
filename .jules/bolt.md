## 2024-07-15 - Unconditional DOM Writes on Intervals
**Learning:** Unconditional DOM writes and re-evaluating properties on high-frequency timers (like `setInterval` for a clock) create unnecessary main-thread overhead and CPU usage. Also, creating `Intl.DateTimeFormat` objects dynamically on every tick is a heavy operation.
**Action:** Always cache expensive objects like `Intl.DateTimeFormat` outside of the interval function. Track the last rendered value in module-level variables and check if the computed string has changed before making any DOM updates (e.g. updating `textContent` or `style`).

## 2024-07-15 - Node Native Testing for Vanilla JS
**Learning:** Testing browser-based Vanilla JS logic usually requires heavy dependencies like Jest and jsdom which can be cumbersome to load globally and cause state bleeding. Node's native `node:test` runner combined with the `vm` module provides a powerful, fast, and completely isolated environment to mock DOM interactions on a per-test basis without any `npm` packages required.
**Action:** When testing simple vanilla browser JS that doesn't use modern bundlers, use the Node `vm` context pattern to mock browser APIs, avoiding package bloat while achieving test isolation.
