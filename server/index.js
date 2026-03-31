require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT']
  }
});

app.use(cors());
app.use(express.json());

// Basic API placeholder for incidents
app.post('/api/incidents', (req, res) => {
  const { type, location, reportedBy } = req.body;
  // TODO: Implement incident creation, Gemini API check
  console.log('Incident reported:', { type, location, reportedBy });
  
  // Emit to socket
  io.emit('admin:map_update', { type, location, active: true });
  
  res.status(201).json({ message: 'Incident received' });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('location:update', (data) => {
    console.log(`User ${socket.id} location updated:`, data);
  });

  socket.on('incident:report', (data) => {
    console.log(`User ${socket.id} triggered SOS via Socket:`, data);
    // Broadcast for immediate map response
    io.emit('zone:status_change', { zoneId: data.zoneId, status: 'DANGER' });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
