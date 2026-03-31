import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './firebase.js';

import incidentRoutes from './routes/incidents.js';
import taskRoutes from './routes/tasks.js';
import alertRoutes from './routes/alerts.js';
import setupSocketHandlers from './socket/index.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT"] }
});

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/incidents', incidentRoutes(io));
app.use('/api/tasks', taskRoutes(io));
app.use('/api/alerts', alertRoutes(io));

// Default Route
app.get('/', (req, res) => {
  res.status(200).send("EvacuAid Backend Service is running.");
});

// Setup WebSockets
setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 EvacuAid Node.js Core listening locally on port ${PORT}`);
});
