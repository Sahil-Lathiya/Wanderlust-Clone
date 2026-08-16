const { rateLimit } = require("express-rate-limit");

const AUTH_LIMIT_DEFAULTS = Object.freeze({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "Too many authentication attempts. Please try again later.",
});

const LISTING_READ_LIMIT_DEFAULTS = Object.freeze({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "Too many listing requests. Please try again later.",
});

function createAuthLimiter(overrides = {}) {
    return rateLimit({
        ...AUTH_LIMIT_DEFAULTS,
        ...overrides,
    });
}

function createListingReadLimiter(overrides = {}) {
    return rateLimit({
        ...LISTING_READ_LIMIT_DEFAULTS,
        ...overrides,
    });
}


module.exports = {
    AUTH_LIMIT_DEFAULTS,
    LISTING_READ_LIMIT_DEFAULTS,
    createAuthLimiter,
    createListingReadLimiter,
};
