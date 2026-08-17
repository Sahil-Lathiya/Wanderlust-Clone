const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");


const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");


test("sessions always use secure, httpOnly, same-site cookies", () => {
    assert.match(appSource, /app\.use\(session\(\{[\s\S]*?saveUninitialized:\s*false/);
    assert.match(appSource, /cookie:\s*\{[\s\S]*?httpOnly:\s*true/);
    assert.match(appSource, /cookie:\s*\{[\s\S]*?sameSite:\s*"lax"/);
    assert.match(appSource, /cookie:\s*\{[\s\S]*?secure:\s*true/);
});


test("session cookies cannot be downgraded to clear text", () => {
    assert.doesNotMatch(appSource, /secure:\s*isProduction/);
    assert.doesNotMatch(appSource, /secure:\s*false/);
});


test("short session secrets are rejected", () => {
    assert.match(appSource, /process\.env\.SECRET\.length\s*<\s*32/);
    assert.match(appSource, /SECRET must contain at least 32 characters/);
});
