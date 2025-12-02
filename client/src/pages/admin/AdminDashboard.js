import React from 'react';
import DeadlinesWidget from '../../components/DeadlinesWidget';
import { BarChart3, TrendingUp } from 'lucide-react';

function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <BarChart3 size={32} className="text-primary-600" />
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Dashboard Overview</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Welcome to the admin panel. Here's a summary of your site.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deadlines Widget */}
        <div className="lg:col-span-2">
          <DeadlinesWidget />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-l-4 border-primary-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Active Users</h3>
              <TrendingUp size={20} className="text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">2,543</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">↑ 12% from last month</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border-l-4 border-accent-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Articles</h3>
              <TrendingUp size={20} className="text-accent-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">847</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">↑ 5% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;