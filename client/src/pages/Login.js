import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import './AuthForms.css';

function Login() {
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // This hook still works perfectly. It will run when
  // AuthContext confirms the user is logged in.
  useEffect(() => {
    if (isAuthenticated) {
      if (user && user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // This is the only change in this function!
      // We call the context's login, which calls Firebase.
      await login(email, password);
      // The useEffect above will handle redirection.

    } catch (err) {
      console.error(err);
      toast.error('Login Failed: ' + (err.message || 'Invalid credentials'));
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;