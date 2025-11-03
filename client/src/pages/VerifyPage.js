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
      <Link to="/login" className="publish-button" style={{ textDecoration: 'none' }}>
        Go to Login Page
      </Link>
    </div>
  );
};

export default VerifyPage;