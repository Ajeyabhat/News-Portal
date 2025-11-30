import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();

  // Scroll to the top whenever the route changes so users don't land at the footer
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className="site-container">
      <Navbar />
      <main className="container">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;