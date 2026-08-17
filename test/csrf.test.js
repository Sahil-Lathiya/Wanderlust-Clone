const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const lusca = require("lusca");


const csrfProtection = lusca.csrf();


function runMiddleware(middleware, req, res = { locals: {} }) {
    return new Promise((resolve) => {
        middleware(req, res, (error) => resolve(error));
    });
}


function request({ method, session, token }) {
    return {
        method,
        session,
        body: token ? { _csrf: token } : {},
        headers: {},
    };
}


test("CSRF middleware rejects a missing token and accepts the session token", async () => {
    const session = {};
    const getResponse = { locals: {} };
    await runMiddleware(csrfProtection, request({ method: "GET", session }), getResponse);
    const token = getResponse.locals._csrf;

    const missingTokenResponse = { locals: {}, statusCode: 200 };
    const missingTokenError = await runMiddleware(
        csrfProtection,
        request({ method: "POST", session }),
        missingTokenResponse
    );
    const validTokenError = await runMiddleware(
        csrfProtection,
        request({ method: "POST", session, token })
    );

    assert.match(missingTokenError.message, /CSRF token missing/);
    assert.equal(missingTokenResponse.statusCode, 403);
    assert.equal(validTokenError, undefined);
});


test("multipart parsing is registered before global CSRF protection", () => {
    const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
    const uploadPosition = appSource.indexOf("parseAuthenticatedListingUpload");
    const csrfPosition = appSource.indexOf("app.use(lusca.csrf())");

    assert.ok(uploadPosition >= 0);
    assert.ok(csrfPosition > uploadPosition);
});


test("every state-changing form includes the synchronizer token", () => {
    const templates = [
        "views/includes/navbar.ejs",
        "views/users/signup.ejs",
        "views/users/login.ejs",
        "views/listings/new.ejs",
        "views/listings/edit.ejs",
        "views/listings/show.ejs",
    ];

    for (const template of templates) {
        const source = fs.readFileSync(path.join(__dirname, "..", template), "utf8");
        const stateChangingForms = source.match(/<form[^>]*method="POST"[\s\S]*?<\/form>/g) || [];

        assert.ok(stateChangingForms.length > 0, template);
        for (const form of stateChangingForms) {
            assert.match(form, /name="_csrf" value="<%= _csrf %>"/, template);
        }
    }
});
