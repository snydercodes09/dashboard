const { performance } = require('perf_hooks');

const localStorageMock = {
    _data: {},
    setItem: function(key, value) {
        this._data[key] = value;
    }
};

const plannerData = { '9': 'Meeting' };

const t0 = performance.now();
for (let i = 0; i < 1000; i++) {
    plannerData['9'] = 'Meeting ' + i;
    localStorageMock.setItem("dashboard-planner", JSON.stringify(plannerData));
}
const t1 = performance.now();
const baselineTime = t1 - t0;

const t2 = performance.now();
for (let i = 0; i < 1000; i++) {
    plannerData['9'] = 'Meeting ' + i;
}
localStorageMock.setItem("dashboard-planner", JSON.stringify(plannerData));
const t3 = performance.now();
const optimizedTime = t3 - t2;

console.log(`Baseline (1000 writes): ${baselineTime.toFixed(4)} ms`);
console.log(`Optimized (1 write): ${optimizedTime.toFixed(4)} ms`);
console.log(`Improvement: ${((baselineTime - optimizedTime) / baselineTime * 100).toFixed(2)}%`);
