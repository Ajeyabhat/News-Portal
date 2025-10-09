import React, { useState } from 'react';
import axios from 'axios';
import './AuthForms.css'; // New: Import the CSS

function Register() {
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
      const newUser = {
        username,
        email,
        password,
      };

      const res = await axios.post('http://localhost:5000/api/register', newUser);
      console.log(res.data);

    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="form-container"> {/* New: Add this wrapper div */}
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