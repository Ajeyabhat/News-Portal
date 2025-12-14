import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/users/forgot-password', { email });
      toast.success(res.data.msg);
      setEmailSent(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      const errorMsg = err.response?.data?.msg || 'Failed to send reset email';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 text-center space-y-6">
            <div className="text-5xl">📧</div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Check Your Email</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                If an account exists with <strong className="text-gray-900 dark:text-white">{email}</strong>, you will receive a password reset link shortly.
              </p>
              <p className="text-gray-500 dark:text-gray-500 mt-4 text-sm">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-4">
              <Link to="/login" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold transition-colors">
                Back to Login
              </Link>
              <button 
                onClick={() => setEmailSent(false)}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Forgot Password?</h2>
            <p className="text-gray-600 dark:text-gray-400">Enter your email to receive a password reset link</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                disabled={loading}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 focus:bg-white dark:focus:bg-gray-600 transition-all duration-300"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Footer */}
          <div className="flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Back to Login
            </Link>
            <span>•</span>
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
