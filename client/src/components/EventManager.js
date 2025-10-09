import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EventManager.css';

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      setEvents(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/events', { title, date });
      fetchEvents(); // Refresh the list
      setTitle('');
      setDate('');
    } catch (err) {
      alert('Error creating event.');
    }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      fetchEvents(); // Refresh the list
    } catch (err) {
      alert('Error deleting event.');
    }
  };

  return (
    <div className="event-manager">
      <h2>Manage Upcoming Events</h2>
      <form onSubmit={onSubmit} className="event-form">
        <input 
          type="text" 
          placeholder="Event Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
        <button type="submit">Add Event</button>
      </form>
      <div className="event-list">
        {events.map(event => (
          <div key={event._id} className="event-item">
            <p>{event.title} - {new Date(event.date).toLocaleDateString()}</p>
            <button onClick={() => deleteEvent(event._id)} className="delete-btn">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventManager;