// backend/src/server.js
import express from 'express';
import { createServer as createHttpServer } from 'http';
import { Server } from 'socket.io';
import { YSocketIO } from 'y-socket.io/dist/server';
import cors from 'cors';
import { logger } from './utils/logger.js';
import authRoutes from './auth/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer() {
  const app = express();
  const httpServer = createHttpServer(app);

  // CORS configuration
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.static("public"));

  // --- ADD AUTH ROUTES ---
  app.use('/api/auth', authRoutes);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Welcome endpoint
  app.get('/', (req, res) => {
    res.status(200).json({
      message: '🚀 CodeSync Backend is running!',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        auth: '/api/auth',
        websocket: '/socket.io/',
      },
    });
  });

  // Socket.IO setup
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Yjs WebSocket setup for collaboration
  const ySocketIO = new YSocketIO(io);
  ySocketIO.initialize();

  // Socket connection events
  io.on('connection', (socket) => {
    logger.info(`🔗 New client connected: ${socket.id}`);

    socket.emit('welcome', {
      message: 'Welcome to CodeSync!',
      socketId: socket.id,
    });

    socket.on('disconnect', () => {
      logger.info(`❌ Client disconnected: ${socket.id}`);
    });

    socket.on('error', (error) => {
      logger.error(`Socket error (${socket.id}):`, error);
    });
  });

  // --- SPA FALLBACK: Serve index.html for frontend routes ---
  // This MUST be LAST (after all API routes)
  // Use this approach for Express 5 compatibility
  app.use((req, res, next) => {
    // If the request is for an API route or static file, skip
    if (req.path.startsWith('/api/') || req.path.startsWith('/socket.io/')) {
      return next();
    }
    // For all other routes, serve index.html
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
  });

  return httpServer;
}