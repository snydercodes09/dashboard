const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

// 1. Setup mock environment
const mockLocalStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  clear() {
    this.store = {};
  }
};

const mockElement = {
  addEventListener: () => {},
  classList: { add: () => {}, remove: () => {}, contains: () => false },
  style: {},
  textContent: '',
  innerHTML: '',
  querySelectorAll: () => [],
  appendChild: () => {},
  setAttribute: () => {},
  querySelector: () => mockElement,
  dataset: {},
};

const sandboxTemplate = {
  document: {
    documentElement: mockElement,
    body: mockElement,
    querySelectorAll: () => [],
    querySelector: () => mockElement,
    createElement: () => mockElement,
  },
  navigator: { geolocation: { getCurrentPosition: () => {} } },
  window: {
    matchMedia: () => ({ matches: false }),
    addEventListener: () => {},
    location: { protocol: 'http:' }
  },
  fetch: () => Promise.resolve({ json: () => Promise.resolve({}) }),
  console: console,
  setInterval: () => {},
  setTimeout: () => {},
  // Add missing pomodoroTime element that caused failure when resetting script.js
  pomodoroTime: mockElement
};

const code = fs.readFileSync('./script.js', 'utf8');

function runTest(initialTodos, testName) {
  mockLocalStorage.clear();

  const sandbox = { ...sandboxTemplate, localStorage: mockLocalStorage };
  vm.createContext(sandbox);

  try {
    vm.runInContext(code, sandbox);
  } catch (e) {
    console.error("Error evaluating script.js:", e);
    process.exit(1);
  }

  // Clear any storage set during initialization
  mockLocalStorage.clear();

  // Important: script.js declares `let todos = ...` globally. We must update the sandbox's `todos` reference
  // so that `saveTodos` sees the updated array.
  vm.runInContext(`todos = ${JSON.stringify(initialTodos || [])};`, sandbox);
  sandbox.saveTodos();

  const saved = mockLocalStorage.getItem("dashboard-todos");
  const expected = JSON.stringify(initialTodos === null ? [] : initialTodos);

  assert.strictEqual(saved, expected, `Failed: ${testName}`);
  console.log(`✅ ${testName} passed`);
}

console.log("Running tests for saveTodos...");
let testsFailed = false;

try {
  runTest([], "Test 1: Empty todos array");
  runTest([{ id: 1, text: "Buy milk", completed: false, details: "" }], "Test 2: Single todo item");
  runTest([
    { id: 1, text: "Buy milk", completed: true, details: "" },
    { id: 2, text: "Quotes & special <chars>", completed: false, details: "More info" }
  ], "Test 3: Multiple todos with special characters");

  console.log("🎉 All saveTodos tests passed successfully!");
} catch (error) {
  console.error("❌ Test failed:", error.message);
  testsFailed = true;
}

if (testsFailed) {
    process.exit(1);
}
