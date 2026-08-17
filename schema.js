const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().trim().min(3).max(120).required(),
        description: Joi.string().trim().min(10).max(2000).required(),
        location: Joi.string().trim().min(2).max(120).required(),
        country: Joi.string().trim().min(2).max(120).required(),
        price: Joi.number().min(0).required(),
        image: Joi.object({
            url: Joi.string().allow("", null)
        }).optional(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().trim().min(2).max(2000).required(),
    }).required()
});
