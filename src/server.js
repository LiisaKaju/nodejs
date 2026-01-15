import express from 'express';
import bookRoutes from './routes/book.routes.js';
import authorRoutes from "./routes/author.routes.js";
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import{ errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/welcome', (request, response) => {
    response.send({
        message: 'Welcome to the API',
    });
});


app.use('/api/v1', bookRoutes);
app.use('/api/v1', authorRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', categoryRoutes);

app.use(errorHandler);

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise rehection", err.message);
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
