const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js"); // for error handle back-end side
const Review = require("../models/review.js"); // review model access
const Listing = require("../models/listing.js"); //listing model access
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



// Post reviews route
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

//Delete reiviews route
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports = router;
