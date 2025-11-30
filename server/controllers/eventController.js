/**
 * Event Controller
 * Handles upcoming events/deadlines management
 */

const Event = require('../models/Event');

/**
 * GET /api/events
 * Get upcoming events (future dates only, limit 5)
 */
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5);
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * POST /api/events
 * Create a new event (Admin only)
 */
exports.createEvent = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  
  try {
    const { title, date, link } = req.body;
    const newEvent = new Event({ title, date, link });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * DELETE /api/events/:id
 * Delete an event (Admin only)
 */
exports.deleteEvent = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    await event.deleteOne();
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
