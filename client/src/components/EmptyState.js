import React from 'react';
import { FaInbox } from 'react-icons/fa'; // A nice icon for "empty"
import './EmptyState.css';

// This component takes a "message" prop so we can reuse it
const EmptyState = ({ message }) => {
  return (
    <div className="empty-state">
      <FaInbox className="empty-state-icon" />
      <p className="empty-state-message">{message}</p>
    </div>
  );
};

export default EmptyState;