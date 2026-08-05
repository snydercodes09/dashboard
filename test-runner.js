const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const testDir = './tests';

if (!fs.existsSync(testDir)) {
    console.log("No tests directory found.");
    process.exit(0);
}

const files = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

if (files.length === 0) {
    console.log("No test files found.");
    process.exit(0);
}

console.log(`Found ${files.length} test files. Running...`);

let failed = false;

for (const file of files) {
    console.log(`\n--- Running ${file} ---`);
    try {
        execSync(`node ${path.join(testDir, file)}`, { stdio: 'inherit' });
    } catch (e) {
        failed = true;
    }
}

if (failed) {
    console.error("\n❌ Some tests failed!");
    process.exit(1);
} else {
    console.log("\n✅ All tests passed!");
}
