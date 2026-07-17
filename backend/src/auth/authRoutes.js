// backend/src/auth/authRoutes.js
import express from 'express';
import { login, logout, getCurrentUser } from './authController.js';
import { isAuthenticated } from './authMiddleware.js';

const router = express.Router();

// Public routes (no authentication needed)
router.post('/login', login);
router.post('/logout', logout);

// Protected routes (require authentication)
router.get('/me', isAuthenticated, getCurrentUser);

export default router;