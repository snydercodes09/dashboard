const fs = require('fs');
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm');

function setupContext() {
  const mockElement = () => {
    const listeners = {};
    return {
      addEventListener: (event, handler) => { listeners[event] = handler; },
      style: {},
      classList: { add: () => {}, remove: () => {}, contains: () => false },
      innerHTML: '',
      textContent: '',
      value: '',
      appendChild: () => {},
      setAttribute: () => {},
      getAttribute: () => '',
      querySelector: () => mockElement(),
      querySelectorAll: () => [],
      remove: () => {},
      closest: () => mockElement(),
      trigger: (event) => { if(listeners[event]) listeners[event]({ target: { closest: () => mockElement() } }); }
    };
  };

  const mockDocument = {
    querySelectorAll: () => [mockElement(), mockElement()],
    querySelector: () => mockElement(),
    documentElement: { classList: { add: () => {}, remove: () => {}, contains: () => false } },
    body: mockElement(),
    createElement: () => mockElement(),
  };

  const mockLocalStorage = {
    store: {},
    getItem: function(key) { return this.store[key] || null; },
    setItem: function(key, value) { this.store[key] = String(value); },
    clear: function() { this.store = {}; }
  };

  const context = vm.createContext({
    document: mockDocument,
    localStorage: mockLocalStorage,
    window: {
      matchMedia: () => ({ matches: false }),
      location: { protocol: 'http:' }
    },
    setInterval: () => 1,
    setTimeout: () => 1,
    clearInterval: () => {},
    clearTimeout: () => {},
    fetch: () => Promise.resolve({ json: () => Promise.resolve({}) }),
    navigator: { geolocation: { getCurrentPosition: () => {} } },
    console: {
      log: () => {},
      warn: () => {},
      error: () => {}
    },
    Intl: Intl,
    Math: Math,
    Date: Date,
    String: String,
    Number: Number,
    JSON: JSON,
  });

  const scriptContent = fs.readFileSync('./script.js', 'utf-8');

  const exportCode = `
    window.escapeHTML = escapeHTML;

    // Pomodoro exports
    window.setPomodoroMode = setPomodoroMode;
    window.getPomodoroMode = () => pomodoroMode;
    window.getPomodoroTimeLeft = () => pomodoroTimeLeft;

    // Todo exports
    window.getTodos = () => todos;
    window.addTodo = (text) => { todos.push({ id: Date.now(), text, completed: false }); saveTodos(); renderTodos(); };

    // Planner exports
    window.plannerTasks = {};
    window.savePlanner = () => { localStorage.setItem("dashboard-planner", JSON.stringify(window.plannerTasks)); };

    // Goals exports
    window.goals = [];
    window.saveGoals = () => { localStorage.setItem("dashboard-goals", JSON.stringify(window.goals)); };

    // Weather exports
    window.getWeatherByCoords = getWeatherByCoords;
    window.getCurrentWeatherCondition = () => currentWeatherCondition;
  `;

  vm.runInContext(scriptContent + exportCode, context);
  return context;
}

test('escapeHTML escapes special characters', () => {
  const ctx = setupContext();
  const escaped = ctx.window.escapeHTML('<script>alert("test & pass")</script>');
  assert.strictEqual(escaped, '&lt;script&gt;alert(&quot;test &amp; pass&quot;)&lt;/script&gt;');
});

test('setPomodoroMode changes mode and time', () => {
  const ctx = setupContext();
  ctx.window.setPomodoroMode('shortBreak', 5);
  assert.strictEqual(ctx.window.getPomodoroMode(), 'shortBreak');
  assert.strictEqual(ctx.window.getPomodoroTimeLeft(), 300);

  ctx.window.setPomodoroMode('focus', 25);
  assert.strictEqual(ctx.window.getPomodoroMode(), 'focus');
  assert.strictEqual(ctx.window.getPomodoroTimeLeft(), 1500);
});

test('todos are saved to localStorage', () => {
  const ctx = setupContext();
  ctx.window.addTodo('Test Todo');
  const todos = ctx.window.getTodos();
  assert.strictEqual(todos.length, 1);
  assert.strictEqual(todos[0].text, 'Test Todo');

  const saved = JSON.parse(ctx.localStorage.getItem('dashboard-todos'));
  assert.strictEqual(saved.length, 1);
  assert.strictEqual(saved[0].text, 'Test Todo');
});

test('planner tasks can be saved', () => {
  const ctx = setupContext();
  ctx.window.plannerTasks = { "09:00": "Meeting" };
  ctx.window.savePlanner();
  const saved = JSON.parse(ctx.localStorage.getItem('dashboard-planner'));
  assert.strictEqual(saved["09:00"], "Meeting");
});

test('goals can be saved', () => {
  const ctx = setupContext();
  ctx.window.goals = [{ id: 1, text: "Finish task", completed: false }];
  ctx.window.saveGoals();
  const saved = JSON.parse(ctx.localStorage.getItem('dashboard-goals'));
  assert.strictEqual(saved.length, 1);
  assert.strictEqual(saved[0].text, "Finish task");
});
