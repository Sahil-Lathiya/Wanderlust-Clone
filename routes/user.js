const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isPublicWriteEnabled, saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const { createAuthLimiter } = require("../config/rateLimit.js");

const authLimiter = createAuthLimiter();

router
    .route("/signup")
    .get(
        isPublicWriteEnabled,
        userController.renderSignupForm)
    .post(
        isPublicWriteEnabled,
        authLimiter,
        userController.signup);


router
    .route("/login")
    .get(
        isPublicWriteEnabled,
        userController.renderLoginForm)
    .post(
        isPublicWriteEnabled,
        authLimiter,
        saveRedirectUrl,
        passport.authenticate('local',
            {
                failureRedirect: '/login',
                failureFlash: true
            }),
        userController.login
    );


router.post("/logout", isPublicWriteEnabled, userController.logout);

module.exports = router;
