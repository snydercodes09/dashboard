## 2024-07-15 - Unconditional DOM Writes on Intervals
**Learning:** Unconditional DOM writes and re-evaluating properties on high-frequency timers (like `setInterval` for a clock) create unnecessary main-thread overhead and CPU usage. Also, creating `Intl.DateTimeFormat` objects dynamically on every tick is a heavy operation.
**Action:** Always cache expensive objects like `Intl.DateTimeFormat` outside of the interval function. Track the last rendered value in module-level variables and check if the computed string has changed before making any DOM updates (e.g. updating `textContent` or `style`).

## 2024-07-16 - Object Map Lookups vs Repeated Array Includes
**Learning:** Re-evaluating multiple `.includes()` on arrays sequentially in a large `if-else if` block, especially for grouping similar constant conditions, is harder to read and theoretically less performant than an object map lookup. Defining constants outside the function scope prevents reallocating memory on every execution.
**Action:** Use an object map (`{ key: "value" }`) defined outside of the function to map discrete, finite values (like weather codes) to standard strings instead of chaining multiple array `includes()` checks inside the function.
