import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, AlertCircle } from 'lucide-react';

const DeadlinesWidget = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events for widget:', err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div id="deadlines" className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-600">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-slate-600">
        <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg shadow-lg">
          <Calendar className="text-white" size={20} />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">Upcoming Deadlines</h3>
      </div>
      <ul className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event._id} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-slate-700 last:border-0 last:pb-0 hover:bg-blue-50 dark:hover:bg-slate-700/50 rounded-lg p-2 -m-2 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 shadow-lg">
                  <span className="text-xs font-bold text-white uppercase">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-lg font-bold text-white">
                    {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{event.title}</p>
                <p className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <AlertCircle size={20} />
            <span>No upcoming deadlines</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default DeadlinesWidget;