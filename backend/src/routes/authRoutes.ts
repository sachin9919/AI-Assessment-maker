import { Router } from 'express';
import { signup, login, logout, getCurrentUser } from '../controllers/authController';
import { verifyAuth } from '../middleware/authMiddleware';

const router = Router();

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me (protected)
router.get('/me', verifyAuth, getCurrentUser);

export default router;
