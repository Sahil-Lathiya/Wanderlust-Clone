const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
    publicDemoListings,
    searchPublicDemoListings,
    findPublicDemoListing,
} = require("../data/publicDemoListings");
const listingController = require("../controllers/listings");


test("public catalogue contains six unique UK sample listings", () => {
    assert.equal(publicDemoListings.length, 6);
    assert.equal(new Set(publicDemoListings.map((listing) => listing._id)).size, 6);

    for (const listing of publicDemoListings) {
        assert.match(listing._id, /^demo-[a-z-]+$/);
        assert.equal(listing.country, "United Kingdom");
        assert.ok(listing.price > 0);
        assert.match(listing.image.url, /^https:\/\/images\.unsplash\.com\//);
        assert.deepEqual(listing.reviews, []);
    }
});


test("public catalogue search matches title and location", () => {
    assert.deepEqual(
        searchPublicDemoListings("Edinburgh").map((listing) => listing._id),
        ["demo-edinburgh-apartment"]
    );
    assert.deepEqual(
        searchPublicDemoListings("London").map((listing) => listing._id),
        ["demo-shoreditch-studio"]
    );
    assert.equal(searchPublicDemoListings("not-a-real-place").length, 0);
});


test("public catalogue supports deterministic detail routes", () => {
    assert.equal(
        findPublicDemoListing("demo-bath-townhouse").title,
        "Bath Georgian Townhouse"
    );
    assert.equal(findPublicDemoListing("missing-listing"), undefined);
});


test("production catalogue controller returns curated data without a database query", async () => {
    let rendered;
    await listingController.index(
        { query: { q: "Bath" } },
        {
            locals: { publicWriteAccessEnabled: false },
            render(template, values) {
                rendered = { template, values };
            },
        }
    );

    assert.equal(rendered.template, "listings/index.ejs");
    assert.equal(rendered.values.isCuratedDemo, true);
    assert.deepEqual(
        rendered.values.allListings.map((listing) => listing._id),
        ["demo-bath-townhouse"]
    );
});


test("production detail controller returns a deterministic sample record", async () => {
    let rendered;
    await listingController.showListing(
        { params: { id: "demo-brighton-loft" } },
        {
            locals: { publicWriteAccessEnabled: false },
            render(template, values) {
                rendered = { template, values };
            },
        }
    );

    assert.equal(rendered.template, "listings/show.ejs");
    assert.equal(rendered.values.listing.title, "Brighton Seafront Loft");
});


test("public listing templates use UK presentation without legacy tax controls", () => {
    const indexTemplate = fs.readFileSync(
        path.join(__dirname, "..", "views", "listings", "index.ejs"),
        "utf8"
    );
    const showTemplate = fs.readFileSync(
        path.join(__dirname, "..", "views", "listings", "show.ejs"),
        "utf8"
    );
    const templates = `${indexTemplate}\n${showTemplate}`;

    assert.match(indexTemplate, /href="\/listings\/<%= listing\._id %>"/);
    assert.match(templates, /£/);
    assert.doesNotMatch(templates, /GST|&#8377;|en-In|flexSwitchCheckDefault/i);
});
