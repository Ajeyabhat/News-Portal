import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeadlinesWidget.css';

const DeadlinesWidget = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="deadlines-widget">
      <h3>🗓️ Upcoming Deadlines</h3>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <span className="event-date">
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <p className="event-title">{event.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeadlinesWidget;