// backend/src/auth/authUtils.js

// Generate a simple token (in real app, use JWT)
export const generateToken = (user) => {
  // Simple base64 encoding for demo
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    timestamp: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

// Verify token (simple version)
export const verifyToken = (token) => {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
};

// Get user from token
export const getUserFromToken = (token, findUserById) => {
  const decoded = verifyToken(token);
  if (decoded && decoded.userId) {
    return findUserById(decoded.userId);
  }
  return null;
};