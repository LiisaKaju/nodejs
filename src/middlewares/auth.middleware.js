import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import AuthenticationError from '../utils/AuthenticationError.js';

export const authenticateToken = async (request, response, next) => {
    try {
        const authHeader = request.headers.authorization;

        // Ootame vormingut: "Bearer <token>"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError("Token not provided");
        }

        const token = authHeader.slice(7); // eemaldab "Bearer "

        let payLoad;
        try {
            payLoad = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            throw new AuthenticationError("Invalid token");
        }

        const user = await prisma.user.findUnique({ where: { id: payLoad.id } });

        if (!user) {
            return response.status(401).json({
                message: 'Unauthorized'
            });
        }

        request.user = {
            id: user.id,
            email: user.email
        };

        next();
    } catch (exception) {
        next(exception);
    }
};