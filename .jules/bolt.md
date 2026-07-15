## 2024-07-15 - Unconditional DOM Writes on Intervals
**Learning:** Unconditional DOM writes and re-evaluating properties on high-frequency timers (like `setInterval` for a clock) create unnecessary main-thread overhead and CPU usage. Also, creating `Intl.DateTimeFormat` objects dynamically on every tick is a heavy operation.
**Action:** Always cache expensive objects like `Intl.DateTimeFormat` outside of the interval function. Track the last rendered value in module-level variables and check if the computed string has changed before making any DOM updates (e.g. updating `textContent` or `style`).

## 2024-07-15 - Optimize Pomodoro Timer Local Storage Writes
**Learning:** Frequent writes to `localStorage` (e.g., every second inside an interval) can cause unnecessary I/O overhead and layout thrashing, hurting performance. Memory operations are much faster than disk/I/O bound operations like `localStorage`.
**Action:** Accumulate state in memory during frequent updates and only persist to `localStorage` on significant events like pausing/stopping the timer or when the `beforeunload` event fires before the window closes.
