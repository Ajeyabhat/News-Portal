import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import { LanguageProvider } from './context/LanguageContext';

// Initialize theme on first load - just add 'dark' class if saved, otherwise nothing needed
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('appTheme') || localStorage.getItem('theme');
  const html = document.documentElement;
  
  if (savedTheme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  html.style.colorScheme = savedTheme === 'dark' ? 'dark' : 'light';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>
);