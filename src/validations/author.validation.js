import Joi from "joi";

export const authorSchema = Joi.object({
    name: Joi.string().max(255).required(),
    biography: Joi.string().required(),
    birth_year: Joi.number().integer().min(0).max(new Date().getFullYear()).required()
});


