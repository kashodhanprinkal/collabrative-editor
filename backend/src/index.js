// backend/src/index.js
import dotenv from 'dotenv';
import { createServer } from './server.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = createServer();

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 WebSocket ready for connections`);
});