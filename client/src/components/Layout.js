import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';

const Layout = ({ children }) => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="site-container">
          <Navbar />
          <main className="container">{children}</main>
          <Footer />
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default Layout;