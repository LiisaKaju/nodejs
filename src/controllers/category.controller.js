import prisma from '../config/prisma.js';
import { QueryBuilder } from "../utils/QueryBuilder.js";

export const getAllCategory = async (request, response) => {
    try {
        const Builder = new QueryBuilder(request.query, {
            defaultSort: 'created_at',
            defaultTake: 20,
            allowedSorts: ['id', 'title', 'description', 'created_at', 'updated_at'],
            allowedSearchFields: ['title', 'description'],
            allowedIncludes: {
                'authors': { include: { author: true }}
            }
        });

        const prismaQuery = Builder.buildPrismaQuery();

        console.log(prismaQuery);

        const [category, count] = await Promise.all([
            prisma.category.findMany(prismaQuery),
            prisma.category.count({ where: prismaQuery.where })
        ]);

        const meta = Builder.getPaginationMeta(count);

        response.status(200).json({
            message: 'All category',
            data: category,
            meta,
        });
    } catch (exception) {
        console.log(exception);
        response.status(500).json({
            message: "Something went wrong",
            error: exception.message
        })
    }
};

export const getCategoryById = async (request, response) => {
    try {
        const idFromURL = request.params?.id;

        const category = await prisma.category.findUnique({
            where: {
                id: Number(idFromURL)
            }
        });

        if (!category) {
            response.status(404).json({
                message: 'Not Found'
            })
        }

        response.status(200).json({
            message: 'Successfully Found category',
            data: category
        })
    } catch (exception) {
        response.status(500).json({
            message: 'Something went wrong',
            error: exception.message
        })
    }
};

export const createCategory = async (request, response) => {
    try {
        const { title, description, thumbnail_url, release_year } = request.body;

        const newCategory = await prisma.category.create({
            data: {
                title,
                description,
                thumbnail_url,
                release_year: Number(release_year),
            }
        });

        response.status(201).json({
            message: 'Successfully Created category',
            data: newCategory
        });

    } catch (exception) {
        response.status(500).json({
            message: 'Something went wrong',
            error: exception.message
        })
    }
};

export const updateCategory = async (request, response) => {
    try {
        const { id } = request.params;
        const { title, description, thumbnail_url, release_year } = request.body;

        const updatedCategory = await prisma.category.update({
            where: {
                id: Number(id),
            },
            data: {
                title,
                description,
                thumbnail_url,
                release_year: Number(release_year),
            }
        });

        if (!updatedCategory) {
            response.status(404).json({
                message: 'Not Found'
            })
        }

        response.status(200).json({
            message: 'Successfully Updated category',
            data: updatedCategory
        })

    } catch (exception) {
        response.status(500).json({
            message: 'Something went wrong',
            error: exception.message
        })
    }
};

export const deleteCategory = async (request, response) => {
    try {
        const categoryId = request.params?.id;

        await prisma.category.delete({
            where: {
                id: Number(categoryId)
            }
        })

        response.status(200).json({
            message: 'Successfully Deleted',
        })
    } catch (exception) {
        response.status(500).json({
            message: 'Something went wrong',
            error: exception.message
        })
    }
};