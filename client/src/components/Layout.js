import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ThemeProvider } from '../context/ThemeContext';

const Layout = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="site-container">
        <Navbar />
        <main className="container">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;