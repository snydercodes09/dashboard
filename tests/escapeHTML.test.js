const fs = require('fs');
const assert = require('assert');
const path = require('path');

// Extract just the escapeHTML function from script.js
// to avoid DOM dependencies when running in Node.js
const code = fs.readFileSync(path.join(__dirname, '../script.js'), 'utf8');
const startIndex = code.indexOf('function escapeHTML');
if (startIndex === -1) {
    console.error("Could not find escapeHTML function in script.js");
    process.exit(1);
}

let endIndex = startIndex;
let braceCount = 0;
let started = false;

for (let i = startIndex; i < code.length; i++) {
    if (code[i] === '{') {
        braceCount++;
        started = true;
    } else if (code[i] === '}') {
        braceCount--;
    }
    if (started && braceCount === 0) {
        endIndex = i + 1;
        break;
    }
}

const funcCode = code.substring(startIndex, endIndex);
eval(funcCode);

function runTests() {
    let passed = 0;
    let failed = 0;

    function test(name, fn) {
        try {
            fn();
            console.log(`✅ ${name}`);
            passed++;
        } catch (e) {
            console.error(`❌ ${name}`);
            console.error(e.message);
            failed++;
        }
    }

    console.log("Running escapeHTML tests...\n");

    test("handles null input", () => assert.strictEqual(escapeHTML(null), ""));
    test("handles undefined input", () => assert.strictEqual(escapeHTML(undefined), ""));
    test("handles empty string", () => assert.strictEqual(escapeHTML(""), ""));

    test("escapes ampersand (&)", () => assert.strictEqual(escapeHTML("&"), "&amp;"));
    test("escapes less than (<)", () => assert.strictEqual(escapeHTML("<"), "&lt;"));
    test("escapes greater than (>)", () => assert.strictEqual(escapeHTML(">"), "&gt;"));
    test("escapes double quote (\")", () => assert.strictEqual(escapeHTML('"'), "&quot;"));
    test("escapes single quote (')", () => assert.strictEqual(escapeHTML("'"), "&#39;"));

    test("escapes multiple special characters in a string", () => {
        assert.strictEqual(
            escapeHTML("<script>alert('XSS & \"hack\"')</script>"),
            "&lt;script&gt;alert(&#39;XSS &amp; &quot;hack&quot;&#39;)&lt;/script&gt;"
        );
    });

    test("converts non-string inputs to string before escaping", () => {
        assert.strictEqual(escapeHTML(123), "123");
        assert.strictEqual(escapeHTML(true), "true");
        assert.strictEqual(escapeHTML({}), "[object Object]");
    });

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
}

runTests();
