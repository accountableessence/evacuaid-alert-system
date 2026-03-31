import express from 'express';
import { body, validationResult } from 'express-validator';
import { createIncident, generateIncidentInstructions, createStaffTask } from '../services/incidentService.js';
import db from '../firebase.js';

export default function incidentRoutes(io) {
  const router = express.Router();

  // POST /api/incidents
  router.post('/',
    [
      body('type').isString().notEmpty().withMessage('Incident type is required'),
      body('zone').isString().notEmpty().withMessage('Zone identifier is required')
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { type, zone } = req.body;
        
        // Save incident to DB
        const incident = await createIncident({ type, zone });

        // Generate response via Gemini
        const instructions = await generateIncidentInstructions(type, zone);

        // Staff Task dispatch
        const task = await createStaffTask(incident.id, type, zone, instructions.staffTask);

        // Alert via WebSocket
        io.emit('incident:new', incident);
        io.emit('staff:dispatch', task);
        
        // Might also want to broadcast an update to the danger zones
        // (Typically fetched from DB map state, but we can emit a change)
        io.emit('zone:status_change', { zone, status: 'DANGER', incidentType: type });

        res.status(201).json({
          incident,
          attendeeAlert: instructions.attendeeAlert,
          staffTask: instructions.staffTask
        });
      } catch (error) {
        console.error("POST /incidents error:", error);
        res.status(500).json({ error: "Failed to process the incident." });
      }
    }
  );

  // PUT /api/incidents/:id/status
  router.put('/:id/status',
    [
      body('status').isIn(['ACTIVE', 'RESOLVED']).withMessage('Status must be ACTIVE or RESOLVED')
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      try {
        const { id } = req.params;
        const { status } = req.body;

        if (db) {
          await db.collection('incidents').doc(id).update({ status });
        }

        io.emit('incident:update', { id, status });

        if (status === 'RESOLVED') {
           // Provide zone recovery if needed
           // io.emit('zone:status_change', { zone, status: 'SAFE' });
        }

        res.status(200).json({ message: 'Incident updated successfully.' });
      } catch (error) {
        console.error("PUT /incidents/:id/status error:", error);
        res.status(500).json({ error: "Failed to update incident status." });
      }
    }
  );

  return router;
}
