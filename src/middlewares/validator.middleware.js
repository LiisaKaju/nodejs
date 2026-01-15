import { PrismaClientValidationError } from "@prisma/client/runtime/library";

export const validate = (schema, source = 'body') => {
    return (request, response, next) => {
        const { error, value } = schema.validate(request[source], {
            abortEarly: false,
            stripUnknown: true,
            errors: {
                wrap: {
                    label: false
                }
            }
        });

        if(error) {
            const errorBag = {};

            error.details.forEach((detail) => {
                errorBag[detail.path] = {
                    message: detail.message,
                };
            });

            throw new ValidationError("Validation failed", errorBag);
        }

        if(source === 'query') {
            Object.keys(value).forEach((key) => {
                request.query[key] = value[key];
            });
        } else {
            request[source] = value;
        }

        next();

    };
};

export const validateBody = (schema) => validate(schema, 'body');
export const validateQuery = (schema) => validate(schema, 'query');

export default validate;