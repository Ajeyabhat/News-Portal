import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Building2, Mail, Lock } from 'lucide-react';

const RegisterInstitution = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    institutionName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const { institutionName, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!institutionName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Register without auto-login
      const response = await axios.post('http://localhost:5000/api/users/register', {
        username: institutionName,
        email,
        password,
        role: 'Institution',
        institutionName
      });

      toast.success('Registration successful!');
      toast.success('Please check your email to verify your account');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.msg || 'Registration failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 size={32} className="text-primary-600" />
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Register Institution</h2>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400">Join as an educational institution</p>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="institutionName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Institution Name *
              </label>
              <div className="relative">
                <Building2 size={18} className="absolute left-3 top-3.5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  id="institutionName"
                  name="institutionName"
                  value={institutionName}
                  onChange={onChange}
                  placeholder="Enter institution name"
                  disabled={loading}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 focus:bg-white dark:focus:bg-gray-600 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Official Email Address *
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3.5 text-gray-500 dark:text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="institution@example.edu"
                  disabled={loading}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 focus:bg-white dark:focus:bg-gray-600 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-500 dark:text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="At least 6 characters"
                  disabled={loading}
                  minLength="6"
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 focus:bg-white dark:focus:bg-gray-600 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-500 dark:text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  placeholder="Re-enter your password"
                  disabled={loading}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-600 focus:bg-white dark:focus:bg-gray-600 transition-all duration-300"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              disabled={loading}
            >
              {loading ? '⏳ Creating Account...' : '🏛️ Register Institution'}
            </button>
          </form>

          {/* Footer */}
          <div className="space-y-2 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                Login here
              </Link>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Register as a reader?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterInstitution;
