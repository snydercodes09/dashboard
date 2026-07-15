## 2024-07-15 - Unconditional DOM Writes on Intervals
**Learning:** Unconditional DOM writes and re-evaluating properties on high-frequency timers (like `setInterval` for a clock) create unnecessary main-thread overhead and CPU usage. Also, creating `Intl.DateTimeFormat` objects dynamically on every tick is a heavy operation.
**Action:** Always cache expensive objects like `Intl.DateTimeFormat` outside of the interval function. Track the last rendered value in module-level variables and check if the computed string has changed before making any DOM updates (e.g. updating `textContent` or `style`).

## 2026-07-15 - Use DocumentFragment for Loops
**Learning:** Appending DOM elements directly in a loop, like inside `forEach`, forces the browser to reflow and repaint continuously. This leads to slow performance for large lists.
**Action:** Use `document.createDocumentFragment()` to create an off-screen fragment, append the generated items inside the loop to the fragment, and finally append the fragment to the DOM container once.
