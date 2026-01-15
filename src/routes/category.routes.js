import { Router } from 'express';
import { validateBody, } from "../middlewares/validator.middleware.js";
import { categorySchema } from "../validations/category.validation.js";;
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { createCategory, getAllCategory, updateCategory, getCategoryById, deleteCategory } from '../controllers/category.controller.js';

const router = Router();

router.get('/category', getAllCategory);
router.get('/category/:id', getCategoryById);
router.post('/category', authenticateToken, validateBody(categorySchema), createCategory);
router.put('/category/:id', authenticateToken, validateBody(categorySchema), updateCategory);
router.delete('/category/:id', authenticateToken, deleteCategory);

export default router;