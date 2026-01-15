import Joi from 'joi'

export const createQuerySchema = (options = {}) => {
    const {
        allowedSortsFields = [],
        allowedSearchFields = [],
        allowedIncludes = [],
        defaultSort = 'id',
        defaultSortDirection = 'asc',
        defaultTake = 10,
        maxTake = 100
    } = options

    return Joi.object({
        page: Joi.number().integer().min(1).default(1),
        take: Joi.number().integer().min(1).max(maxTake).default(defaultTake),
        sort: Joi.string().valid(...allowedSortsFields).default(defaultSort),
        sort_direction: Joi.string().valid('asc', 'desc').default(defaultSortDirection),
        search: Joi.string().optional().default(''),
        search_fields: Joi.array().valid(...allowedSearchFields).optional(),
    });
}