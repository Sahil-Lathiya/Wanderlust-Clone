if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // like Boilerplate code for use
const ExpressError = require("./utils/ExpressError.js"); // for error handle back-end side
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const lusca = require("lusca");
const User = require("./models/user.js");
const { createSecurityHeaders } = require("./config/security.js");
const { isPublicWriteAccessEnabled } = require("./config/publicDemo.js");
const { parseAuthenticatedListingUpload } = require("./config/upload.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;
const isProduction = process.env.NODE_ENV === "production";
const publicWriteAccessEnabled = isPublicWriteAccessEnabled({
    configuredValue: process.env.PUBLIC_WRITE_ACCESS,
});

async function main() {
    if (!publicWriteAccessEnabled) return false;
    await mongoose.connect(dbUrl);
    return true;
}

// Middleware and settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.disable("x-powered-by");
if (isProduction) app.set("trust proxy", 1);
app.use(createSecurityHeaders({ isProduction }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);  // include - exculde for use in ejs already learned
app.use(express.static(path.join(__dirname, "/public")));

if (publicWriteAccessEnabled) {
    if (!dbUrl) {
        throw new Error("ATLASDB_URL is required when PUBLIC_WRITE_ACCESS=true");
    }
    if (!process.env.SECRET) {
        throw new Error("SECRET is required when PUBLIC_WRITE_ACCESS=true");
    }
    if (process.env.SECRET.length < 32) {
        throw new Error("SECRET must contain at least 32 characters");
    }

    const store = MongoStore.create({
        mongoUrl: dbUrl,
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 60 * 60,
    });

    store.on("error", (err) => {
        console.log("ERROR in MONGO SESSION STORE", err);
    });

    app.use(session({
        store,
        secret: process.env.SECRET,
        name: "wanderlust.sid",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        },
    }));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
}



app.use((req, res, next) => {
    res.locals.success = publicWriteAccessEnabled ? req.flash("success") : [];
    res.locals.error = publicWriteAccessEnabled ? req.flash("error") : [];
    res.locals.currUser = publicWriteAccessEnabled ? req.user : null;
    res.locals.publicWriteAccessEnabled = publicWriteAccessEnabled;
    next();
});

if (publicWriteAccessEnabled) {
    app.use("/listings", parseAuthenticatedListingUpload);
    app.use(lusca.csrf());
}

// Define the home route to redirect to listings
app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.get("/about", (req, res) => {
    res.render("legal/about.ejs");
});

app.get("/privacy", (req, res) => {
    res.render("legal/privacy.ejs");
});

app.get("/terms", (req, res) => {
    res.render("legal/terms.ejs");
});


// Routes
app.use("/listings", listingRouter);  // /listings prefix applies to all listing routes
app.use("/listings/:id/reviews", reviewRouter);  // /listings/:id/reviews applies to all review routes
app.use("/", userRouter);


// Error Handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    const responseStatus = res.statusCode >= 400 ? res.statusCode : 500;
    let { statusCode = responseStatus, message = "Something went wrong!" } = err;
    if (statusCode >= 500 && isProduction) {
        message = "Something went wrong!";
    }
    res.status(statusCode).render("error.ejs", { message });
});


const port = process.env.PORT || 8080;

async function start() {
    const connectedToDatabase = await main();
    if (connectedToDatabase) {
        console.log("Connected to DB");
    } else {
        console.log("Read-only mode: database connection disabled");
    }
    return app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

if (require.main === module) {
    start().catch((error) => {
        console.error("Application startup failed:", error.message);
        process.exitCode = 1;
    });
}

module.exports = { app, start };
