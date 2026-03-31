import express from 'express';
import { body, validationResult } from 'express-validator';
import { broadcastAlert } from '../services/notificationService.js';

export default function alertRoutes(io) {
  const router = express.Router();

  // POST /api/alerts/broadcast
  router.post('/broadcast',
    [
      body('message').isString().notEmpty().withMessage('Message must be a valid string'),
      body('targetZone').isString().notEmpty().withMessage('Target zone must be specified')
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { message, targetZone } = req.body;
        
        // The topic is determined by the target zone. 
        // Following DesignDoc structure e.g., topic: `zone_${targetZone}_alerts`
        const topicName = `zone_${targetZone}_alerts`;
        const title = `🚨 Admin Security Alert - Zone ${targetZone}`;

        await broadcastAlert(topicName, title, message, {
           type: 'ADMIN_BROADCAST',
           zone: targetZone
        });

        // Optionally echo this inside the WebSocket room as well
        io.to(`zone_${targetZone}`).emit('admin:broadcast_received', {
          title,
          message,
          zone: targetZone,
          timestamp: new Date()
        });

        res.status(200).json({ success: true, message: `Alert broadcasted successfully to ${topicName}` });
      } catch (error) {
        console.error("POST /alerts/broadcast error:", error);
        res.status(500).json({ error: "Failed to broadcast the alert." });
      }
    }
  );

  return router;
}
