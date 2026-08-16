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
const User = require("./models/user.js");
const { createSessionOptions } = require("./config/session.js");
const { createSecurityHeaders } = require("./config/security.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;
const isProduction = process.env.NODE_ENV === "production";

if (!dbUrl) {
    throw new Error("ATLASDB_URL is required");
}
if (!process.env.SECRET) {
    throw new Error("SECRET is required");
}



async function main() {
    await mongoose.connect(dbUrl);
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

const sessionOptions = createSessionOptions({
    store,
    secret: process.env.SECRET,
    isProduction,
});




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Define the home route to redirect to listings
app.get("/", (req, res) => {
    res.redirect("/listings");
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
    let { statusCode = 500, message = "Something went wrong!" } = err;
    if (statusCode >= 500 && isProduction) {
        message = "Something went wrong!";
    }
    res.status(statusCode).render("error.ejs", { message });
});


const port = process.env.PORT || 8080;

async function start() {
    await main();
    console.log("Connected to DB");
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
