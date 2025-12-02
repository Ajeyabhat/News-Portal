import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AlarmClock, Calendar, AlertCircle, X } from 'lucide-react';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  });

const getDayDiff = (value) => {
  const now = new Date();
  const target = new Date(value);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const NEAR_TERM_DAYS = 5;

const DeadlineAlert = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/events');
        if (active) {
          setEvents(res.data || []);
        }
      } catch (err) {
        if (active) {
          console.error('Error fetching upcoming deadlines:', err);
          setError('Unable to load upcoming deadlines right now.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      active = false;
    };
  }, []);

  const nextEvent = useMemo(() => {
    const now = new Date();
    return events
      .map((event) => ({ ...event, dateObj: new Date(event.date) }))
      .filter((event) => event.dateObj >= now)
      .sort((a, b) => a.dateObj - b.dateObj)[0];
  }, [events]);

  if (dismissed) {
    return null;
  }

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border border-primary-200/60 bg-white dark:bg-slate-900/40 p-4 shadow-md">
        <div className="h-4 w-28 rounded-full bg-primary-200/70 mb-3"></div>
        <div className="h-5 w-40 rounded-full bg-primary-200/70 mb-2"></div>
        <div className="h-4 w-60 rounded-full bg-primary-100/70"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/10 p-4 text-red-700 dark:text-red-300 flex items-start gap-3">
        <AlertCircle className="flex-shrink-0" size={20} />
        <div>
          <p className="font-semibold">Deadline banner unavailable</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!nextEvent) {
    return null;
  }

  const daysLeft = getDayDiff(nextEvent.date);

  if (daysLeft > NEAR_TERM_DAYS) {
    return null;
  }

  const urgencyTone =
    daysLeft <= 1
      ? 'text-red-600 dark:text-red-400'
      : daysLeft <= 3
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-primary-600 dark:text-primary-400';

  return (
    <section className="rounded-2xl border border-primary-100 dark:border-slate-700 bg-white dark:bg-slate-900/70 shadow-md p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 pr-6">
          <div className="rounded-xl bg-primary-100 dark:bg-primary-900/30 p-2 text-primary-700 dark:text-primary-300">
            <AlarmClock size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-300">Upcoming deadline</p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{nextEvent.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {nextEvent.description || 'Submit your application before the window closes.'}
            </p>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 sm:flex-col sm:items-end sm:gap-2">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="order-2 sm:order-none p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-slate-800"
            aria-label="Dismiss deadline reminder"
          >
            <X size={16} />
          </button>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <Calendar size={16} className="text-primary-600 dark:text-primary-400" />
              <span className="font-semibold">{formatDate(nextEvent.date)}</span>
            </div>
            <span className={`text-sm font-semibold ${urgencyTone}`}>
              {daysLeft <= 0 ? 'Closes today' : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeadlineAlert;
