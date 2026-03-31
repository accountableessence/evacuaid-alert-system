import express from 'express';
import { body, param, validationResult } from 'express-validator';
import db from '../firebase.js';

export default function taskRoutes(io) {
  const router = express.Router();

  // GET /api/tasks
  router.get('/', async (req, res) => {
    try {
      if (!db) {
        return res.status(503).json({ error: "Database not available" });
      }

      const snapshot = await db.collection('tasks').get();
      const tasks = [];
      snapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });

      res.status(200).json(tasks);
    } catch (error) {
      console.error("GET /tasks error:", error);
      res.status(500).json({ error: "Failed to retrieve tasks." });
    }
  });

  // PUT /api/tasks/:id
  router.put('/:id',
    [
      param('id').isString().notEmpty().withMessage('Task ID is required'),
      body('status').isIn(['ASSIGNED', 'IN_PROGRESS', 'COMPLETED']).withMessage('Invalid status')
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
          await db.collection('tasks').doc(id).update({ status });
        }

        io.emit('task:status_update', { id, status });

        res.status(200).json({ message: 'Task status updated.' });
      } catch (error) {
        console.error("PUT /tasks/:id error:", error);
        res.status(500).json({ error: "Failed to update task." });
      }
    }
  );

  return router;
}
