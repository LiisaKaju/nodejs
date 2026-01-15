import Joi from "joi";

export const bookSchema = Joi.object({
    title: Joi.string().max(255).required(),
    description: Joi.string().required(),
    thumbnail_url: Joi.string().uri().required(),
    release_year: Joi.number().integer().positive().required()
});