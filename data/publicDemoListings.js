const publicDemoListings = Object.freeze([
    {
        _id: "demo-shoreditch-studio",
        title: "Shoreditch Design Studio",
        description: "A bright, carefully styled studio used to demonstrate the catalogue, search and detail-page experience of this portfolio project.",
        image: {
            filename: "public-demo/shoreditch-studio",
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
        },
        price: 185,
        location: "Shoreditch, London",
        country: "United Kingdom",
        owner: { username: "Wanderlust Demo" },
        reviews: [],
    },
    {
        _id: "demo-cotswolds-cottage",
        title: "Cotswolds Stone Cottage",
        description: "A calm countryside sample stay with warm interiors and a simple presentation designed for a recruiter-friendly product walkthrough.",
        image: {
            filename: "public-demo/cotswolds-cottage",
            url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
        },
        price: 210,
        location: "Stow-on-the-Wold",
        country: "United Kingdom",
        owner: { username: "Wanderlust Demo" },
        reviews: [],
    },
    {
        _id: "demo-edinburgh-apartment",
        title: "Edinburgh Old Town Apartment",
        description: "A polished city apartment example that demonstrates consistent content structure, responsive imagery and location-based search.",
        image: {
            filename: "public-demo/edinburgh-apartment",
            url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
        },
        price: 175,
        location: "Old Town, Edinburgh",
        country: "United Kingdom",
        owner: { username: "Wanderlust Demo" },
        reviews: [],
    },
    {
        _id: "demo-lake-district-cabin",
        title: "Lake District Woodland Cabin",
        description: "A quiet woodland cabin concept included as sample content for the public, read-only version of the application.",
        image: {
            filename: "public-demo/lake-district-cabin",
            url: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=80",
        },
        price: 195,
        location: "Ambleside, Lake District",
        country: "United Kingdom",
        owner: { username: "Wanderlust Demo" },
        reviews: [],
    },
    {
        _id: "demo-brighton-loft",
        title: "Brighton Seafront Loft",
        description: "A modern coastal loft example that keeps the public portfolio experience realistic without presenting real availability or offers.",
        image: {
            filename: "public-demo/brighton-loft",
            url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80",
        },
        price: 165,
        location: "Brighton Seafront",
        country: "United Kingdom",
        owner: { username: "Wanderlust Demo" },
        reviews: [],
    },
    {
        _id: "demo-bath-townhouse",
        title: "Bath Georgian Townhouse",
        description: "A spacious townhouse concept used to showcase clean listing details, accessible navigation and a consistent visual system.",
        image: {
            filename: "public-demo/bath-townhouse",
            url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80",
        },
        price: 225,
        location: "Bath, Somerset",
        country: "United Kingdom",
        owner: { username: "Wanderlust Demo" },
        reviews: [],
    },
]);

function searchPublicDemoListings(query = "") {
    const normalizedQuery = String(query).trim().toLowerCase();
    if (!normalizedQuery) return [...publicDemoListings];

    return publicDemoListings.filter((listing) =>
        [listing.title, listing.location, listing.country]
            .some((value) => value.toLowerCase().includes(normalizedQuery))
    );
}

function findPublicDemoListing(id) {
    return publicDemoListings.find((listing) => listing._id === id);
}

module.exports = {
    publicDemoListings,
    searchPublicDemoListings,
    findPublicDemoListing,
};
