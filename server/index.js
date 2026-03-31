import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './firebase.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

const globalState = {
  dangerZones: [],
  tasks: []
};

// WebSocket Brain
io.on('connection', (socket) => {
  console.log(`🔌 Client active: [${socket.id}]`);

  // Sync state on load
  socket.emit('admin:map_update', { dangerZones: globalState.dangerZones });

  // 1. SOS Button Trigger
  socket.on('incident:report', async (payload) => {
    console.log(`🚨 SOS INCIDENT TRIGGERED:`, payload);
    const incidentZone = payload.zone || 'A';
    
    // FIREBASE PIPELINE: Persist incident permanently if DB is active
    if (db) {
      try {
        await db.collection('incidents').add({
           type: payload.type || 'EMERGENCY',
           zone: incidentZone,
           status: 'ACTIVE',
           timestamp: new Date()
        });
        console.log(`✅ Incident securely logged to Firebase Firestore`);
      } catch (e) {
        console.error("Failed writing to Firebase:", e.message);
      }
    }

    if (!globalState.dangerZones.includes(incidentZone)) {
       globalState.dangerZones.push(incidentZone);
       
       const newTask = {
         id: `task_${Date.now()}`,
         type: payload.type || 'EMERGENCY',
         zone: incidentZone,
         instructions: `Active incident tracked in Zone ${incidentZone}. Proceed safely and coordinate crowd displacement immediately.`,
         status: 'ASSIGNED',
         assignedTo: 'staff_pool'
       };
       globalState.tasks.push(newTask);
       
       io.emit('admin:map_update', { dangerZones: globalState.dangerZones });
       io.emit('staff:dispatch', newTask);
    }
  });

  socket.on('task:update', ({ id, status }) => {
     console.log(`📝 Task Updated - [${id}]: ${status}`);
     // Mock updating Firebase task document
     const t = globalState.tasks.find(t => t.id === id);
     if (t) t.status = status;
     
     if (status === 'COMPLETED') {
        const zone = t.zone;
        globalState.dangerZones = globalState.dangerZones.filter(z => z !== zone);
        io.emit('admin:map_update', { dangerZones: globalState.dangerZones });
        console.log(`✅ Zone ${zone} secured. Incident resolved.`);
     }
  });

  socket.on('admin:override', (payload) => {
     // Trigger simulated PA Push Notifications to Firebase Cloud Messaging (FCM)
     console.log(`📢 GLOBAL PA BROADCAST: [${payload.target}]: ${payload.message}`);
     io.emit('attendee:alert', payload);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client detached: [${socket.id}]`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 EvacuAid Node.js Core listening locally on port ${PORT}`);
});
