import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeadlinesWidget.css';

const DeadlinesWidget = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Ensure this URL is correct
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events for widget:', err);
      }
    };
    fetchEvents();
  }, []); // Empty dependency array means it runs once on mount

  return (
    <div className="deadlines-widget">
      <h3>🗓️ Upcoming Deadlines</h3>
      <ul>
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event._id}>
              <span className="event-date">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <p className="event-title">{event.title}</p>
            </li>
          ))
        ) : (
          <li>No upcoming deadlines found.</li>
        )}
      </ul>
    </div>
  );
};

export default DeadlinesWidget;