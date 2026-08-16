const test = require("node:test");
const assert = require("node:assert/strict");

const { createSessionOptions } = require("../config/session");


test("production sessions use secure, httpOnly, same-site cookies", () => {
    const store = { name: "test-store" };
    const options = createSessionOptions({
        store,
        secret: "a-secure-session-secret-with-32-characters",
        isProduction: true,
    });

    assert.equal(options.store, store);
    assert.equal(options.saveUninitialized, false);
    assert.equal(options.cookie.httpOnly, true);
    assert.equal(options.cookie.sameSite, "lax");
    assert.equal(options.cookie.secure, true);
});


test("short session secrets are rejected", () => {
    assert.throws(
        () => createSessionOptions({ store: {}, secret: "short" }),
        /at least 32 characters/
    );
});
