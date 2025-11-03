import React from 'react';
import DeadlinesWidget from '../../components/DeadlinesWidget';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard-content">
      <h2>Dashboard Overview</h2>
      <p>Welcome to the admin panel. Here's a summary of your site.</p>
      <div className="dashboard-widgets">
        <DeadlinesWidget />
        {/* You can add more widgets here, like TrendingWidget */}
      </div>
    </div>
  );
}

export default AdminDashboard;