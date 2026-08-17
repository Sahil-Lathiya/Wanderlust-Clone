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

const UPLOAD_LIMIT_DEFAULTS = Object.freeze({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: "Too many upload attempts. Please try again later.",
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

function createUploadLimiter(overrides = {}) {
    return rateLimit({
        ...UPLOAD_LIMIT_DEFAULTS,
        skip: (req) => !req.is("multipart/form-data"),
        ...overrides,
    });
}


module.exports = {
    AUTH_LIMIT_DEFAULTS,
    LISTING_READ_LIMIT_DEFAULTS,
    UPLOAD_LIMIT_DEFAULTS,
    createAuthLimiter,
    createListingReadLimiter,
    createUploadLimiter,
};
