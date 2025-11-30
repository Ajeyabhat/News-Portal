import React from 'react';
import { Link } from 'react-router-dom';
import './AuthForms.css';

const VerifyPage = () => {
  return (
    <div className="form-container" style={{ textAlign: 'center' }}>
      <h2>Check Your Email</h2>
      <p>A verification link has been sent to your email address.</p>
      <p>Please click the link in that email to verify your account and log in.</p>
      <br />
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/login" className="publish-button" style={{ textDecoration: 'none' }}>
          Go to Login Page
        </Link>
        <Link to="/" className="publish-button" style={{ textDecoration: 'none', backgroundColor: '#666' }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default VerifyPage;