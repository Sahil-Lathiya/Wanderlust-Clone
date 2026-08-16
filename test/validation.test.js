const test = require("node:test");
const assert = require("node:assert/strict");

const { listingSchema, reviewSchema } = require("../schema");


test("listing validation rejects negative prices", () => {
    const { error } = listingSchema.validate({
        listing: {
            title: "Test listing",
            description: "A test",
            location: "London",
            country: "United Kingdom",
            price: -1,
        },
    });

    assert.ok(error);
});


test("review validation constrains ratings to one through five", () => {
    assert.ok(reviewSchema.validate({ review: { rating: 0, comment: "No" } }).error);
    assert.equal(
        reviewSchema.validate({ review: { rating: 5, comment: "Useful" } }).error,
        undefined
    );
});
