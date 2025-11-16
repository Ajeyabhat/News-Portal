import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth as firebaseAuth } from '../firebase'; // Import from our firebase.js
import './AuthForms.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { username, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // --- Step 1: Create the user in Firebase Authentication ---
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      console.log('Firebase user created.');

      // --- Step 2: Send the verification email (Firebase handles this!) ---
      await sendEmailVerification(userCredential.user);
      console.log('Firebase verification email sent.');
      toast.success('Verification email sent! Please check your inbox.');

      // --- Step 3: Create the user in our *own* MongoDB database ---
      // This is the step that was likely failing.
      const newUser = { username, email }; // We don't send the password
      
      // We are sending to our Node.js back-end
      await axios.post('http://localhost:5000/api/register', newUser);
      console.log('MongoDB user created.');

      // --- Step 4: Redirect to the new Verify Page ---
      navigate('/verify');

    } catch (err) {
      console.error('Registration Failed:', err.response ? err.response.data : err.message);
      toast.error('Registration Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
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
        <input type="submit" value="Register" />
      </form>
    </div>
  );
}

export default Register;