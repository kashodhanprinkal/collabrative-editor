// backend/src/auth/authMiddleware.js
import { getUserFromToken } from './authUtils.js';
import { findUserById } from '../models/User.js';

// Middleware to check if user is authenticated
export const isAuthenticated = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header required',
      });
    }

    // Format: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    // Verify token
    const userData = getUserFromToken(token, findUserById);
    if (!userData) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Attach user to request
    req.user = userData;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Optional auth (doesn't block if no token)
export const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const userData = getUserFromToken(token, findUserById);
      if (userData) {
        req.user = userData;
      }
    }
    next();
  } catch (error) {
    next();
  }
};