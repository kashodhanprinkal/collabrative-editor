// backend/src/server.js
import express from 'express';
import { createServer as createHttpServer } from 'http';
import { Server } from 'socket.io';
import { YSocketIO } from 'y-socket.io/dist/server';
import cors from 'cors';
import { logger } from './utils/logger.js';

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
        websocket: '/socket.io/',
      },
    });
  });

  // Socket connection events
  io.on('connection', (socket) => {
    logger.info(`🔗 New client connected: ${socket.id}`);

    // Send welcome message to new client
    socket.emit('welcome', {
      message: 'Welcome to CodeSync!',
      socketId: socket.id,
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`❌ Client disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error (${socket.id}):`, error);
    });
  });

  return httpServer;
}