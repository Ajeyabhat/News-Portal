/**
 * Event Routes
 * Defines API endpoints for upcoming events/deadlines
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUpcomingEvents,
  createEvent,
  deleteEvent
} = require('../controllers/eventController');

// Public route
router.get('/', getUpcomingEvents);           // GET /api/events

// Admin-only routes
router.post('/', auth, createEvent);          // POST /api/events
router.delete('/:id', auth, deleteEvent);     // DELETE /api/events/:id

module.exports = router;
