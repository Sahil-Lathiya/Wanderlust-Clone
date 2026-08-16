const helmet = require("helmet");


function createSecurityHeaders({ isProduction = false } = {}) {
    return helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
                scriptSrcAttr: ["'none'"],
                styleSrc: [
                    "'self'",
                    "https://cdn.jsdelivr.net",
                    "https://cdnjs.cloudflare.com",
                    "https://fonts.googleapis.com",
                ],
                fontSrc: [
                    "'self'",
                    "https://cdnjs.cloudflare.com",
                    "https://fonts.gstatic.com",
                ],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
                frameAncestors: ["'none'"],
                upgradeInsecureRequests: isProduction ? [] : null,
            },
        },
        crossOriginEmbedderPolicy: false,
    });
}


module.exports = { createSecurityHeaders };
