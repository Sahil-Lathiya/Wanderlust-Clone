const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ejs = require("ejs");


const template = fs.readFileSync(
    path.join(__dirname, "..", "views", "listings", "show.ejs"),
    "utf8"
);

function objectId(value) {
    return {
        equals(other) {
            return other && other.value === value;
        },
        toString() {
            return value;
        },
        value,
    };
}

function renderShow(currUser) {
    const authorId = objectId("author-1");
    return ejs.render(template, {
        layout() {},
        currUser,
        _csrf: "test-csrf-token",
        publicWriteAccessEnabled: true,
        listing: {
            _id: "listing-1",
            title: "Test listing",
            image: { url: "https://example.com/image.jpg" },
            owner: { username: "owner", _id: objectId("owner-1") },
            description: "Test description",
            price: 100,
            location: "London",
            country: "United Kingdom",
            reviews: [{
                _id: "review-1",
                author: { username: "reviewer", _id: authorId },
                rating: 5,
                comment: "Useful",
            }],
        },
    });
}


test("logged-out visitors do not see review delete controls", () => {
    assert.doesNotMatch(renderShow(null), /reviews\/review-1\?_method=DELETE/);
});


test("review authors see their own delete control", () => {
    assert.match(
        renderShow({ _id: objectId("author-1") }),
        /reviews\/review-1\?_method=DELETE/
    );
});
