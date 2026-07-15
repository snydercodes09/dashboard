## 2024-07-15 - Unconditional DOM Writes on Intervals
**Learning:** Unconditional DOM writes and re-evaluating properties on high-frequency timers (like `setInterval` for a clock) create unnecessary main-thread overhead and CPU usage. Also, creating `Intl.DateTimeFormat` objects dynamically on every tick is a heavy operation.
**Action:** Always cache expensive objects like `Intl.DateTimeFormat` outside of the interval function. Track the last rendered value in module-level variables and check if the computed string has changed before making any DOM updates (e.g. updating `textContent` or `style`).
## 2024-07-15 - Inefficient DOM Appends in Loop
**Learning:** Appending elements to the DOM one by one within a loop (e.g., inside `forEach` to a live DOM element like `goalsList` or `todoList`) causes multiple reflows/repaints, slowing down rendering performance, particularly for long lists.
**Action:** Use a `DocumentFragment`. Create the fragment before the loop, append all new elements to the fragment during the loop, and finally append the entire fragment to the actual DOM element once the loop is finished. This batches the DOM updates and drastically improves performance.
