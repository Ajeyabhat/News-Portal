import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeadlineAlert.css';

const DeadlineAlert = () => {
  const [events, setEvents] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [showTest, setShowTest] = useState(false); // TEST MODE

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        console.log('DeadlineAlert - Fetched events:', res.data);
        setEvents(res.data);
        if (res.data.length === 0) {
          console.log('No events found - showing test mode');
          setShowTest(true);
        }
      } catch (err) {
        console.error('Error fetching events for alert:', err);
        setShowTest(true); // Show test if error
      }
    };
    fetchEvents();
  }, []);

  // Get upcoming events (within next 7 days, or just the next upcoming event if none within 7 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // First try to get events within next 7 days
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingInWeek = events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today && eventDate <= nextWeek;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // If we have events in the next week, return the most urgent one
    if (upcomingInWeek.length > 0) {
      return upcomingInWeek.slice(0, 1);
    }
    
    // Otherwise, show the next upcoming event (even if more than 7 days away)
    const futureEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return futureEvents.length > 0 ? futureEvents.slice(0, 1) : [];
  };

  const upcomingEvent = showTest ? {
    _id: 'test',
    title: '🎓 JEE Main Exam Registration',
    date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  } : getUpcomingEvents()[0];
  
  console.log('DeadlineAlert - upcoming event:', upcomingEvent);
  console.log('DeadlineAlert - isVisible:', isVisible);
  console.log('DeadlineAlert - events length:', events.length);
  console.log('DeadlineAlert - showTest:', showTest);

  if (!upcomingEvent || !isVisible) {
    console.log('DeadlineAlert - not rendering (upcomingEvent:', !!upcomingEvent, 'isVisible:', isVisible, ')');
    return null;
  }

  const daysUntil = Math.ceil((new Date(upcomingEvent.date) - new Date()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntil <= 3;
  
  // Format label based on days
  let label = '📌 Upcoming:';
  if (isUrgent) {
    label = '🔴 URGENT:';
  } else if (daysUntil <= 7) {
    label = '⚠️ SOON:';
  }

  return (
    <div className={`deadline-alert ${isUrgent ? 'urgent' : ''}`}>
      <div className="deadline-alert-content">
        <div className="alert-icon">⏰</div>
        <div className="alert-text">
          <strong className="alert-label">
            {label}
          </strong>
          <span className="alert-title">{upcomingEvent.title}</span>
          <span className="alert-date">
            {new Date(upcomingEvent.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })} ({daysUntil} day{daysUntil !== 1 ? 's' : ''} left)
          </span>
        </div>
      </div>
      <button 
        className="alert-close" 
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss alert"
      >
        ✕
      </button>
    </div>
  );
};

export default DeadlineAlert;
