import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import './AuthForms.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  const hasRunRef = useRef(false); // prevent double verification in StrictMode

  useEffect(() => {
    if (hasRunRef.current) {
      return;
    }

    hasRunRef.current = true;

    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token found.');
        return;
      }

      try {
        const url = `http://localhost:5000/api/users/verify-email/${token}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (!res.ok) {
          setStatus('error');
          setMessage(data.msg || 'Verification failed');
          return;
        }
        
        setStatus('success');
        setMessage(data.msg || 'Email verified successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        console.error('❌ Fetch error:', err);
        setStatus('error');
        setMessage(err.message || 'Network error. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {status === 'verifying' && (
          <>
            <div className="spinner"></div>
            <h2>Verifying Your Email...</h2>
            <p>Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon">✅</div>
            <h2>Email Verified!</h2>
            <p className="success-message">{message}</p>
            <p>Redirecting to login page...</p>
            <Link to="/login" className="auth-button">Go to Login</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-icon">❌</div>
            <h2>Verification Failed</h2>
            <p className="error-message">{message}</p>
            <div className="auth-footer">
              <Link to="/login">Back to Login</Link>
              <span> | </span>
              <Link to="/register">Register Again</Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #1e40af;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .success-icon, .error-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .success-message {
          color: #10b981;
          font-weight: 500;
          margin: 15px 0;
        }

        .error-message {
          color: #dc2626;
          font-weight: 500;
          margin: 15px 0;
        }

        .auth-footer span {
          margin: 0 10px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
