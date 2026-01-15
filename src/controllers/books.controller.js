import prisma from '../config/prisma.js';
import { QueryBuilder } from "../utils/QueryBuilder.js";
import AppError from '../utils/AppError.js';

export const getAllBooks = async (request, response, next) => {
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

        const [books, count] = await Promise.all([
            prisma.book.findMany(prismaQuery),
            prisma.book.count({ where: prismaQuery.where })
        ]);

        const meta = Builder.getPaginationMeta(count);

        response.status(200).json({
            message: 'All books',
            data: books,
            meta,
        });
    } catch (exception) {
       next(exception);
        
    }
};

export const getBookById = async (request, response,next) => {
    try {
        const idFromURL = request.params?.id;

        const book = await prisma.book.findUnique({
            where: {
                id: Number(idFromURL)
            }
        });

        if (!book) throw new NotFoundError(`book with id ${idFromURL} not found`);
          

        response.status(200).json({
            message: 'Successfully Found Book',
            data: book
        })
    } catch (exception) {
        next(exception)
    }
};

export const createBook = async (request, response, next) => {
    try {
        const { title, description, thumbnail_url, release_year } = request.body;

       await prisma.book.create({
            data: {
                title,
                description,
                thumbnail_url,
                release_year: Number(release_year),
            }
        });

        response.sendStatus(201);
    } catch (exception) {
        next(exception);
    }
};

export const updateBook = async (request, response, next) => {
    try {
        const { id } = request.params;
        const { title, description, thumbnail_url, release_year } = request.body;

        const updatedBook = await prisma.book.update({
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

        if (!updatedBook) {
            response.status(404).json({
                message: 'Not Found'
            })
        }

        response.status(200).json({
            message: 'Successfully Updated Book',
            data: updatedBook
        })

    } catch (exception) {
        next(exception);
        
    }
};

export const deleteBook = async (request, response, next) => {
    try {
        const bookId = request.params?.id;

        await prisma.book.delete({
            where: {
                id: Number(bookId)
            }
        })

        response.status(200);

    } catch (exception) {
       next(exception);
    }
};