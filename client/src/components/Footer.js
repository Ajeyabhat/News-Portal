import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>News Portal</h4>
          <p>Your daily source for educational updates. Stay informed, stay ahead.</p>
          <div className="social-icons">
            <a href="#facebook" title="Facebook" aria-label="Follow us on Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#twitter" title="Twitter" aria-label="Follow us on Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#instagram" title="Instagram" aria-label="Follow us on Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#linkedin" title="LinkedIn" aria-label="Follow us on LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><a href="#exams">📋 Exam Alerts</a></li>
            <li><a href="#scholarships">🎓 Scholarships</a></li>
            <li><a href="#guidelines">📚 Guidelines</a></li>
            <li><a href="#internships">💼 Internships</a></li>
          </ul>
        </div>

        <div className="footer-section newsletter-section">
          <h4>Newsletter</h4>
          <p>Subscribe to get the latest news delivered to your inbox.</p>
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address"
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
          {subscribed && <p className="success-message">✓ Thanks for subscribing!</p>}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} News Portal. All Rights Reserved.</p>
        <div className="footer-legal">
          <Link to="/privacy">Privacy</Link>
          <span>•</span>
          <Link to="/">Terms</Link>
          <span>•</span>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

