const mongoose = require("mongoose");
//const review = require("./review");
const Schema = mongoose.Schema;
const review = require("./review.js");


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
    },

  price: Number,
  location: String,
  country: String,

  // Add a reviews array that stores references to Review models
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;