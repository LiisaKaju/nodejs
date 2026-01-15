export class QueryBuilder {

    constructor(queryParams = {}, options = {}) {
        this.params = queryParams;
        this.options = {
            defaultPage: 1,
            defaultTake: 10,
            defaultSort: 'id',
            allowedSorts: ['id'],
            allowedIncludes: [],
            allowedSearchFields: [],
            ...options
        }
    };

    getPagination() {
        let page = this.params.page ? Number(this.params.page) : this.options.defaultPage;
        let take = this.params.take ? Number(this.params.take) : this.options.defaultTake;

        page = isNaN(page) || page < 1 ? this.options.defaultPage : page;
        take = isNaN(take) || take < 1 ? this.options.defaultTake : take;

        console.log("Page: ", page);
        console.log((page - 1) * take);


        return {
            skip: (page - 1) * take,
            take
        }
    };

    getSorting() {
        let sort = this.params.sort ?? this.options.defaultSort;
        let direction;

        if (!sort) return null;

        let sortField = sort;
        if (sort.startsWith('-')) {
            direction = 'desc'
            sortField = sort.substring(1);
        } else {
            direction = 'asc'
        }

        if (!this.options.allowedSorts.includes(sortField)) return null;

        return {
            [sortField]: direction,
        }
    };

    getSearchFilter() {
        const search = this.params.search ?? '';
        let searchFields = this.options.allowedSearchFields;

        if (!search) return null;

        if(!searchFields || !Array.isArray(searchFields) || !searchFields.length) {
            searchFields = this.options.allowedSearchFields;
        } else {
            searchFields = searchFields.filter(field => this.options.allowedSearchFields.includes(field));
        }

        if (!searchFields.length) return null;

        return {
            OR: searchFields.map(field => ({
                [field]: {
                    contains: search
                }
            }))
        }
    };

    getIncludes() {
        const includes = this.params.include?.split(',') ?? [];
        if (!Array.isArray(includes)) return;

        let includesList = {};

        const allowedIncludesList = Array.isArray(this.options.allowedIncludes)
            ? this.options.allowedIncludes
            : Object.keys(this.options.allowedIncludes);

        includes.forEach(relation => {
            if (!allowedIncludesList.includes(relation)) return null;

            if (!Array.isArray(this.options.allowedIncludes) && this.options.allowedIncludes[relation]) {
                includesList[relation] = this.options.allowedIncludes[relation];
            } else {
                includesList[relation] = true;
            }
        })

        if (!Object.keys(includesList).length) return null;

        return {
            ...includesList
        }
    }

    buildPrismaQuery() {
        const query = {};

        const pagination = this.getPagination();
        query.skip = pagination.skip;
        query.take = pagination.take;

        const sorting = this.getSorting();
        if (sorting) {
            query.orderBy = sorting;
        }

        const searchFilter = this.getSearchFilter();
        if (searchFilter) {
            query.where = searchFilter;
        }

        const includes = this.getIncludes();
        if (includes) {
            query.include = includes
        }

        return query;
    }

    getPaginationMeta(count) {
        const page = this.params.page ? Number(this.params.page) : this.options.defaultPage;
        const take = this.params.take ? Number(this.params.take) : this.options.defaultTake;
        const total_pages = Math.ceil(count / take) || 1;

        return {
            current_page: page,
            per_page: take,
            total: count ?? 0,
            total_pages: total_pages ?? 0,
            has_next_page: page < total_pages,
            has_prev_page: page > 1,
        }

    }
}