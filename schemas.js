//These are just validation schemas using Joi and not model schemas
const Joi = require('joi');
const review = require('./models/review');

module.exports.campgroundSchema = Joi.object(
    {
            campground: Joi.object(
            {
                title: Joi.string().required(),
                price: Joi.number().required().min(0),
                description: Joi.string().required(),
                location: Joi.string().required(),
                // image: Joi.string().required()
            }

        ).required(),
        deleteImages: Joi.array()
    }
);

module.exports.reviewSchema = Joi.object(
    {
        review: Joi.object(
            {
                body: Joi.string().required(),
                rating: Joi.number().required().min(1).max(5)
            }
        ).required()
    }
)