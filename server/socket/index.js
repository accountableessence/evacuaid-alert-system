// Simulated state (In a scalable app, use Redis or similar KV store or Firestore listeners)
const globalState = {
  dangerZones: [],
  tasks: []
};

export default function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected via WebSockets: [${socket.id}]`);

    // 1. Initial State Sync
    socket.emit('admin:map_update', { dangerZones: globalState.dangerZones });

    // 2. Users join specific rooms for localized events
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`👤 Client [${socket.id}] joined room: ${room}`);
    });

    // 3. Location update (e.g. periodically sent by staff)
    socket.on('location:update', (payload) => {
      // Could broadcast to admin map for real-time tracking
      // io.to('admin_room').emit('map:staff_location', payload);
    });

    // 4. Incident SOS directly from socket (optional vs REST endpoint)
    // Most logic is now handled in the REST endpoint + Service, but we can maintain
    // this for ultra-low latency direct web socket triggering if needed.
    socket.on('incident:report', (payload) => {
      console.log(`📡 Legacy socket SOS received -> redirect to REST pipeline recommended. payload:`, payload);
      const incidentZone = payload.zone || 'A';
      
      if (!globalState.dangerZones.includes(incidentZone)) {
         globalState.dangerZones.push(incidentZone);
         io.emit('admin:map_update', { dangerZones: globalState.dangerZones });
         io.emit('zone:status_change', { zone: incidentZone, status: 'DANGER' });
      }
    });

    // 5. Admin global overrides
    socket.on('admin:override', (payload) => {
       console.log(`📢 GLOBAL WS BROADCAST: [${payload.targetZone}]: ${payload.message}`);
       // Emitting just to the target zone
       io.to(`zone_${payload.targetZone}`).emit('attendee:alert', payload);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client detached: [${socket.id}]`);
    });
  });
}
