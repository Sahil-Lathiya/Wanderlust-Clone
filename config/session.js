function createSessionOptions({ store, secret, isProduction = false }) {
    if (!secret || secret.length < 32) {
        throw new Error("SECRET must contain at least 32 characters");
    }

    return {
        store,
        secret,
        name: "wanderlust.sid",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
            secure: isProduction,
        },
    };
}

module.exports = { createSessionOptions };
