export const errorHandler = (error, request, response, next) => {
    response.status(error.statusCode || 500).json({
        message: error.message || 'Internal Server Error'
    });
};