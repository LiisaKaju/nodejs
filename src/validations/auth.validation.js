import Joi from "joi";
export const authSchema = Joi.object({
    email: Joi.string().email().required().messages(    {
        'any.required': 'Email on vajalik',
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Minimaalne pikkus on 8 tähemärki',
    }),
});