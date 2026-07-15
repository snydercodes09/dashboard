const { performance } = require('perf_hooks');

const plannerData = {};
for (let i = 0; i < 24; i++) {
  plannerData[i] = "Some relatively long text to make stringify take a bit more time ".repeat(10);
}

const localStorageMock = {
    _data: {},
    setItem: function(key, value) {
        this._data[key] = value;
    }
};

let t0 = performance.now();
for (let i = 0; i < 50; i++) {
    plannerData['9'] = 'Meeting ' + i;
    localStorageMock.setItem("dashboard-planner", JSON.stringify(plannerData));
}
let t1 = performance.now();
const baselineTime = t1 - t0;

let t2 = performance.now();
let timeout;
for (let i = 0; i < 50; i++) {
    plannerData['9'] = 'Meeting ' + i;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        localStorageMock.setItem("dashboard-planner", JSON.stringify(plannerData));
    }, 500);
}
let t3 = performance.now();
const optimizedTime = t3 - t2;

console.log(`Baseline: ${baselineTime.toFixed(4)} ms`);
console.log(`Optimized: ${optimizedTime.toFixed(4)} ms`);
console.log(`Improvement: ${((baselineTime - optimizedTime) / baselineTime * 100).toFixed(2)}%`);
clearTimeout(timeout);
