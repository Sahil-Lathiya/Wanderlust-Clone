const multer = require("multer");


const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
        const isAllowed = allowed.has(file.mimetype);
        callback(
            isAllowed ? null : new Error("Only JPG, PNG and WebP images are allowed"),
            isAllowed
        );
    },
});


function parseAuthenticatedListingUpload(req, res, next) {
    if (!req.is("multipart/form-data")) return next();

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first");
        return res.redirect("/login");
    }

    return upload.single("listing[image]")(req, res, next);
}


module.exports = { parseAuthenticatedListingUpload };
