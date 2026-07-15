## 2024-07-15 - Unconditional DOM Writes on Intervals
**Learning:** Unconditional DOM writes and re-evaluating properties on high-frequency timers (like `setInterval` for a clock) create unnecessary main-thread overhead and CPU usage. Also, creating `Intl.DateTimeFormat` objects dynamically on every tick is a heavy operation.
**Action:** Always cache expensive objects like `Intl.DateTimeFormat` outside of the interval function. Track the last rendered value in module-level variables and check if the computed string has changed before making any DOM updates (e.g. updating `textContent` or `style`).
## 2024-07-15 - Extract Complex Logic to Helper Functions
**Learning:** Extracting large blocks of mapping or display logic out of main functional flows into pure helper functions improves readability without affecting performance.
**Action:** When a function exceeds 50 lines or contains deeply nested UI/string formatting logic, extract the display/mapping code into a separate helper function.
