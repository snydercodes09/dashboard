## 2024-07-15 - Unconditional DOM Writes on Intervals
**Learning:** Unconditional DOM writes and re-evaluating properties on high-frequency timers (like `setInterval` for a clock) create unnecessary main-thread overhead and CPU usage. Also, creating `Intl.DateTimeFormat` objects dynamically on every tick is a heavy operation.
**Action:** Always cache expensive objects like `Intl.DateTimeFormat` outside of the interval function. Track the last rendered value in module-level variables and check if the computed string has changed before making any DOM updates (e.g. updating `textContent` or `style`).

## 2024-07-15 - Vanilla JS Global State Mocking
**Learning:** Testing logic tied directly to globals (`window`, `document`, `localStorage`, `todos`) in vanilla JavaScript environments lacking module bundlers requires `vm` context evaluations to inject mocks directly into the file's scope.
**Action:** Utilize Node's `vm` module to create isolated test sandboxes. Overwrite global test data references internally via evaluations (like `vm.runInContext('todos = ...', sandbox)`) to ensure functions like `saveTodos()` interact correctly with the mocked globals.
