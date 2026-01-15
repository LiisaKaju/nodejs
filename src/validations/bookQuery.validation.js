import { createQuerySchema } from "./query.validation.js";

export const bookQuerySchema = createQuerySchema({
    allowedSortFields: ['id', 'title', 'description', 'created_at', 'updated_at'],
    allowedSearchFields: ['title', 'description'],
    allowedIncludes: ['author'],
    defaultSort: 'created_at',
    defaultSortDirection: 'desc',
    defaultTake: 20,
});