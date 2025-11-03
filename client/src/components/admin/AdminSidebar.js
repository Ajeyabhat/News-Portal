import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/admin" end>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/admin/content">Content</NavLink>
        </li>
        <li>
          <NavLink to="/admin/users">Users</NavLink>
        </li>
        <li>
          <NavLink to="/admin/events">Events</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;