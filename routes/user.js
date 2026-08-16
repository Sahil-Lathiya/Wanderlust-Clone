const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const { createAuthLimiter } = require("../config/rateLimit.js");

const authLimiter = createAuthLimiter();

router
    .route("/signup")
    .get(
        userController.renderSignupForm)
    .post(
        authLimiter,
        userController.signup);


router
    .route("/login")
    .get(
        userController.renderLoginForm)
    .post(
        authLimiter,
        saveRedirectUrl,
        passport.authenticate('local',
            {
                failureRedirect: '/login',
                failureFlash: true
            }),
        userController.login
    );


router.post("/logout", userController.logout);

module.exports = router;
