## 2024-07-15 - Unconditional DOM Writes on Intervals
**Learning:** Unconditional DOM writes and re-evaluating properties on high-frequency timers (like `setInterval` for a clock) create unnecessary main-thread overhead and CPU usage. Also, creating `Intl.DateTimeFormat` objects dynamically on every tick is a heavy operation.
**Action:** Always cache expensive objects like `Intl.DateTimeFormat` outside of the interval function. Track the last rendered value in module-level variables and check if the computed string has changed before making any DOM updates (e.g. updating `textContent` or `style`).

## 2024-07-23 - Extract Repeated Arrays of Classes
**Learning:** Hardcoding the same array of CSS class names (such as for toggling active/inactive styles) multiple times leads to code duplication and increases the risk of inconsistencies if styles need to change later.
**Action:** Extract repetitive arrays of class names into top-level constants and use the spread operator (`...CONSTANT_NAME`) to apply them with `classList.add()` or `classList.remove()`.
