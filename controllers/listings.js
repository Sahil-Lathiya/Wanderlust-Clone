const Listing = require("../models/listing"); //listing model access
const ExpressError = require("../utils/ExpressError");
const { cloudinary, uploadImage } = require("../cloudConfig");


module.exports.index = async (req, res) => {
    const query = String(req.query.q || "").trim();
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = query
        ? {
            $or: [
                { title: { $regex: escaped, $options: "i" } },
                { location: { $regex: escaped, $options: "i" } },
                { country: { $regex: escaped, $options: "i" } },
            ],
        }
        : {};
    const allListings = await Listing.find(filter).sort({ _id: -1 });
    res.render("listings/index.ejs", { allListings, query });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    //id = id.trim();  // Trim any extra spaces
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};



module.exports.createListing = async (req, res, next) => {
    if (!req.file) {
        throw new ExpressError(400, "A listing image is required");
    }
    const uploaded = await uploadImage(req.file.buffer);
    const url = uploaded.secure_url;
    const filename = uploaded.public_id;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created");    //flash message
    res.redirect("/listings");
};


// edit listing
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_200,w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//update listing
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        const uploaded = await uploadImage(req.file.buffer);
        const url = uploaded.secure_url;
        const filename = uploaded.public_id;
        const previousFilename = listing.image && listing.image.filename;
        listing.image = { url, filename };
        await listing.save();
        if (previousFilename) {
            await cloudinary.uploader.destroy(previousFilename).catch(() => undefined);
        }
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

//delete listing
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (deletedListing && deletedListing.image && deletedListing.image.filename) {
        await cloudinary.uploader.destroy(deletedListing.image.filename).catch(() => undefined);
    }
    req.flash("success", "Listing Deleted");   //flash message
    res.redirect("/listings");
};
