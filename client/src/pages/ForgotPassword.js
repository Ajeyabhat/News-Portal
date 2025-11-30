import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AuthForms.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('❌ Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/users/forgot-password', { email });
      toast.success('✅ ' + res.data.msg);
      setEmailSent(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      const errorMsg = err.response?.data?.msg || 'Failed to send reset email';
      toast.error('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="success-icon">📧</div>
          <h2>Check Your Email</h2>
          <p className="success-message">
            If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
          </p>
          <p style={{ marginTop: '20px', color: '#6b7280' }}>
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <div className="auth-footer" style={{ marginTop: '30px' }}>
            <Link to="/login">Back to Login</Link>
            <span> | </span>
            <button 
              onClick={() => setEmailSent(false)} 
              style={{ background: 'none', border: 'none', color: '#1e40af', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password?</h2>
        <p className="auth-subtitle">Enter your email to receive a password reset link</p>

        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Back to Login</Link>
          <span> | </span>
          <Link to="/register">Don't have an account?</Link>
        </div>
      </div>

      <style jsx>{`
        .success-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .success-message {
          color: #10b981;
          font-weight: 500;
          margin: 15px 0;
          line-height: 1.6;
        }

        .auth-footer span {
          margin: 0 10px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
