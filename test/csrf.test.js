const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
    csrfMultipartProtection,
    csrfSynchronisedProtection,
    generateToken,
} = require("../config/csrf.js");


function runMiddleware(middleware, req) {
    return new Promise((resolve) => {
        middleware(req, {}, (error) => resolve(error));
    });
}


function request({ method, session, token, multipart = false }) {
    return {
        method,
        session,
        body: token ? { _csrf: token } : {},
        headers: {},
        is: (type) => multipart && type === "multipart/form-data",
    };
}


test("CSRF middleware rejects a missing token and accepts the session token", async () => {
    const session = {};
    const token = generateToken(request({ method: "GET", session }));

    const missingTokenError = await runMiddleware(
        csrfSynchronisedProtection,
        request({ method: "POST", session })
    );
    const validTokenError = await runMiddleware(
        csrfSynchronisedProtection,
        request({ method: "POST", session, token })
    );

    assert.equal(missingTokenError.statusCode, 403);
    assert.equal(missingTokenError.code, "EBADCSRFTOKEN");
    assert.equal(validTokenError, undefined);
});


test("multipart forms are checked after upload parsing", async () => {
    const session = {};
    const token = generateToken(request({ method: "GET", session }));
    const multipartRequest = request({ method: "POST", session, token, multipart: true });

    assert.equal(
        await runMiddleware(csrfSynchronisedProtection, multipartRequest),
        undefined
    );
    assert.equal(
        await runMiddleware(csrfMultipartProtection, multipartRequest),
        undefined
    );
    assert.equal(
        (await runMiddleware(
            csrfMultipartProtection,
            request({ method: "POST", session, multipart: true })
        )).statusCode,
        403
    );
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
            assert.match(form, /name="_csrf" value="<%= csrfToken %>"/, template);
        }
    }
});
