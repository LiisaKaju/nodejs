import prisma from '../config/prisma.js';
import { QueryBuilder } from '../utils/QueryBuilder.js';

export const getAllAuthors = async (request, response) => {
    try {

        const Builder= new QueryBuilder(request.query,{
                defaultSort: 'created_at',
                defaultTake: 10,
                allowedSorts: ['created_at', 'name'],
                allowedSearchFields: ['name'],
                allowedIncludes: {
                    'books': {include: {book: true}} //kogu raamatu info
                }
});
       

        const prismaQuery = Builder.buildPrismaQuery();

        const [authors, count] = await Promise.all([
            prisma.author.findMany(prismaQuery),
            prisma.author.count({where:prismaQuery.where })
        ]);

        const meta = Builder.getPaginationMeta(count);

        response.status(200).json({
            message:'All authors',
            data: authors, 
            meta
        })

    } catch (exception) {
        console.log(exception);
        response.status(500).json({
            message: "Something went wrong",
            error: exception.message
        })
    }
};

export const getAuthorById = async (request, response) => {
    try {
        const idFromURL = request.params?.id;

        const book = await prisma.author.findUnique({
            where: {
                id: Number(idFromURL)
            }
        });

        if (!book) {
            response.status(404).json({
                message: 'Not Found'
            })
        }

        response.status(200).json({
            message: 'Successfully Found Author',
            data: book
        })
    } catch (exception) {
        response.status(500).json({
            message: 'Something went wrong',
            error: exception.message
        })
    }
};

export const createAuthor = async (request, response) => {
    try {
        const { name } = request.body;

        const newBook = await prisma.author.create({
            data: {
                name
            }
        });

        response.status(201).json({
            message: 'Successfully Created Author',
            data: newBook
        })
    } catch (exception) {
        response.status(500).json({
            message: 'Something went wrong',
            error: exception.message
        })
    }
};

export const updateAuthor = async (request, response) => {
    try {
        const { id } = request.params;
        const { name } = request.body;

        const updatedBook = await prisma.author.update({
            where: {
                id: Number(id),
            },
            data: {
                name
            }
        });

        if (!updatedBook) {
            response.status(404).json({
                message: 'Not Found'
            })
        }

        response.status(200).json({
            message: 'Successfully Updated Author',
            data: updatedBook
        })

    } catch (exception) {
        response.status(500).json({
            message: 'Something went wrong',
            error: exception.message
        })
    }
};

export const deleteAuthor = async (request, response) => {
    try {
        const bookId = request.params?.id;

        await prisma.author.delete({
            where: {
                id: Number(bookId)
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