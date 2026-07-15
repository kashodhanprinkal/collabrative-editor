// backend/src/config/serverConfig.js
export const serverConfig = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};