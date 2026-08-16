const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
    AUTH_LIMIT_DEFAULTS,
    LISTING_READ_LIMIT_DEFAULTS,
    createAuthLimiter,
    createListingReadLimiter,
} = require("../config/rateLimit.js");
const { createSecurityHeaders } = require("../config/security.js");


test("security middleware emits a CSP without inline scripts", async () => {
    const headers = new Map();
    const response = {
        setHeader(name, value) {
            headers.set(name.toLowerCase(), String(value));
        },
        getHeader(name) {
            return headers.get(name.toLowerCase());
        },
        removeHeader(name) {
            headers.delete(name.toLowerCase());
        },
    };

    await new Promise((resolve, reject) => {
        createSecurityHeaders({ isProduction: false })({}, response, (error) => {
            if (error) reject(error);
            else resolve();
        });
    });

    const csp = headers.get("content-security-policy");
    assert.match(csp, /script-src 'self' https:\/\/cdn\.jsdelivr\.net/);
    assert.match(csp, /script-src-attr 'none'/);
    assert.doesNotMatch(csp, /unsafe-inline/);
});


test("authentication limiter uses bounded modern defaults", () => {
    assert.equal(AUTH_LIMIT_DEFAULTS.windowMs, 15 * 60 * 1000);
    assert.equal(AUTH_LIMIT_DEFAULTS.limit, 10);
    assert.equal(AUTH_LIMIT_DEFAULTS.standardHeaders, "draft-8");
    assert.equal(AUTH_LIMIT_DEFAULTS.legacyHeaders, false);
    assert.equal(typeof createAuthLimiter(), "function");
});


test("listing read limiter uses bounded modern defaults", () => {
    assert.equal(LISTING_READ_LIMIT_DEFAULTS.windowMs, 15 * 60 * 1000);
    assert.equal(LISTING_READ_LIMIT_DEFAULTS.limit, 300);
    assert.equal(LISTING_READ_LIMIT_DEFAULTS.standardHeaders, "draft-8");
    assert.equal(LISTING_READ_LIMIT_DEFAULTS.legacyHeaders, false);
    assert.equal(typeof createListingReadLimiter(), "function");
});


test("listing database reads apply the listing limiter", () => {
    const routes = fs.readFileSync(
        path.join(__dirname, "..", "routes", "listing.js"),
        "utf8"
    );

    assert.match(routes, /route\("\/"\)[\s\S]*?\.get\(\s*listingReadLimiter,\s*wrapAsync\(listingController\.index\)\)/);
    assert.match(routes, /route\("\/:id"\)[\s\S]*?\.get\(\s*listingReadLimiter,\s*wrapAsync\(listingController\.showListing\)\)/);
});


test("signup and login routes apply the authentication limiter", () => {
    const routes = fs.readFileSync(
        path.join(__dirname, "..", "routes", "user.js"),
        "utf8"
    );

    assert.match(routes, /route\("\/signup"\)[\s\S]*?\.post\(\s*isPublicWriteEnabled,\s*authLimiter,/);
    assert.match(routes, /route\("\/login"\)[\s\S]*?\.post\(\s*isPublicWriteEnabled,\s*authLimiter,/);
});


test("listing template contains no inline script or style blocks", () => {
    const template = fs.readFileSync(
        path.join(__dirname, "..", "views", "listings", "index.ejs"),
        "utf8"
    );

    assert.doesNotMatch(template, /<script\b/i);
    assert.doesNotMatch(template, /<style\b/i);
    assert.doesNotMatch(template, /\sstyle=/i);
});
