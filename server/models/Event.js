const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  link: { type: String } // Optional link for more info
});

module.exports = mongoose.model('Event', EventSchema);