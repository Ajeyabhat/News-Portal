import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <nav>
          <NavLink to="/admin" end>Content</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/events">Events</NavLink>
        </nav>
      </aside>
      <main className="dashboard-content">
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
    </div>
  );
};

export default AdminDashboard;