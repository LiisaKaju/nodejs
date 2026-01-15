import { Router } from "express";
import * as AuthController from '../controllers/auth.controllers.js';
import { validateBody } from "../middlewares/validator.middleware.js";
import { authSchema } from "../validations/auth.validation.js";


const router = Router ();



router.post('/register', validateBody(authSchema), AuthController.register);
router.post('/login', validateBody(authSchema), AuthController.login);

export default router;