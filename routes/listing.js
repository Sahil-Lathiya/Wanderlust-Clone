const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js"); //listing model access
const { isPublicWriteEnabled, isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const { createListingReadLimiter } = require("../config/rateLimit.js");
const listingReadLimiter = createListingReadLimiter();


router
    .route("/")
    .get(
        listingReadLimiter,
        wrapAsync(listingController.index))
    .post(
        isPublicWriteEnabled,
        isLoggedIn,
        validateListing,
        wrapAsync(listingController.createListing));

// New Route
router.get(
    "/new",
    isPublicWriteEnabled,
    isLoggedIn,
    listingController.renderNewForm);


router
    .route("/:id")
    .get(
        listingReadLimiter,
        wrapAsync(listingController.showListing))
    .put(
        isPublicWriteEnabled,
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(
        isPublicWriteEnabled,
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing));


// Edit Route
router.get(
    "/:id/edit",
    isPublicWriteEnabled,
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));


module.exports = router;
