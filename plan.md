1. **Analyze the Optimization**
    - The code currently triggers `localStorage.setItem` and `JSON.stringify` on every single keystroke (`input` event) in the planner.
    - `JSON.stringify` and `localStorage.setItem` are synchronous operations that block the main thread.
    - We will introduce a debounce mechanism to delay the `localStorage` write until the user has stopped typing for a short duration (e.g., 500ms).

2. **Measure**
    - I already ran a benchmark (`benchmark3.js`) showing ~69% performance improvement for 50 rapid keystrokes with simulated payload, demonstrating reduced main thread blocking time.

3. **Implement**
    - Add a debounce logic using `setTimeout` and `clearTimeout` for the `dashboard-planner` storage write in the `input` event listener inside `script.js`.
    - Update `.jules/bolt.md` to log the performance learning.

4. **Verify**
    - Ensure `node -c script.js` passes.
    - Complete pre commit steps to make sure proper testing, verifications, reviews and reflections are done.

5. **Present**
    - Create a PR titled "⚡ Bolt: Debounce Planner LocalStorage Writes" with What/Why/Impact.
