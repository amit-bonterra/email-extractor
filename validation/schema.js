// validation/schema.js
const Joi = require('joi');

const extractSchema = Joi.object({
    description: Joi.string().min(5).required(),
});

module.exports = { extractSchema };
