import { Router } from 'express';
import { validate } from "../middlewares/validator.middleware.js";
import {authorSchema} from "../validations/author.validation.js";
import { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } from '../controllers/authors.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/authors', getAllAuthors);
router.get('/authors/:id', getAuthorById);
router.post('/authors', authenticateToken, validate(authorSchema), createAuthor);
router.put('/authors/:id', authenticateToken, validate(authorSchema), updateAuthor);
router.delete('/authors/:id', authenticateToken, deleteAuthor);

export default router;