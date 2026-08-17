const { csrfSync } = require("csrf-sync");


function getTokenFromRequest(req) {
    if (req.body && typeof req.body._csrf === "string") {
        return req.body._csrf;
    }
    return req.headers["x-csrf-token"];
}


const {
    generateToken,
    csrfSynchronisedProtection,
} = csrfSync({
    getTokenFromRequest,
    skipCsrfProtection: (req) => req.is("multipart/form-data"),
});

const {
    csrfSynchronisedProtection: csrfMultipartProtection,
} = csrfSync({ getTokenFromRequest });


function exposeCsrfToken(req, res, next) {
    res.locals.csrfToken = generateToken(req);
    next();
}


module.exports = {
    csrfMultipartProtection,
    csrfSynchronisedProtection,
    exposeCsrfToken,
    generateToken,
};
