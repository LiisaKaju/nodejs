import { Router } from 'express';
import { validateBody, validateQuery } from "../middlewares/validator.middleware.js";
import { bookSchema } from "../validations/book.validation.js";
import * as BookController from "../controllers/books.controller.js";
import { bookQuerySchema } from "../validations/bookQuery.validation.js";
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/books', validateQuery(bookQuerySchema) ,BookController.getAllBooks);
router.get('/books/:id', BookController.getBookById);
router.post('/books', authenticateToken, validateBody(bookSchema), BookController.createBook);
router.put('/books/:id', authenticateToken, validateBody(bookSchema), BookController.updateBook);
router.delete('/books/:id', authenticateToken, BookController.deleteBook);

export default router;