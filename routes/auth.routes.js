import express from 'express';
import { register, login, refreshApiKey } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateAuth } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);
router.post('/refresh-api-key', authenticateToken, refreshApiKey);

export default router;