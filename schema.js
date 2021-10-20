const { sanitize } = require('express-mongo-sanitize');
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} Must Not Include HTML!!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean != value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().integer().min(0),
    location: Joi.string().required(),
    //image: Joi.string().required(),
    description: Joi.string().required().escapeHTML(),
    deleteImages: Joi.array()
}).required()

module.exports.reviewSchema = Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().min(1).max(5).required(),
}).required()
