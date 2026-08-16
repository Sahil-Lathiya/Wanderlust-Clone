const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js"); //listing model access
const { isPublicWriteEnabled, isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const { createListingReadLimiter } = require("../config/rateLimit.js");

const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
        callback(allowed.has(file.mimetype) ? null : new Error("Only JPG, PNG and WebP images are allowed"), allowed.has(file.mimetype));
    },
});
const listingReadLimiter = createListingReadLimiter();


router
    .route("/")
    .get(
        listingReadLimiter,
        wrapAsync(listingController.index))
    .post(
        isPublicWriteEnabled,
        isLoggedIn,
        upload.single("listing[image]"),
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
        upload.single("listing[image]"),
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
