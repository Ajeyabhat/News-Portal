import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AuthForms.css';

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
      toast.error('❌ Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('❌ Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('❌ Passwords do not match');
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

      toast.success('✅ Registration successful!');
      toast.success('📧 Please check your email to verify your account');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.msg || 'Registration failed';
      toast.error('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register Institution</h2>
        <p className="auth-subtitle">Join as an educational institution</p>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="institutionName">Institution Name *</label>
            <input
              type="text"
              id="institutionName"
              name="institutionName"
              value={institutionName}
              onChange={onChange}
              placeholder="Enter institution name"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Official Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="institution@example.edu"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="Re-enter your password"
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register Institution'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
          <p>Register as a reader? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterInstitution;
