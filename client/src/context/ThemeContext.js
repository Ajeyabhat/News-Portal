import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Apply theme function - outside component so it doesn't recreate
const applyTheme = (themeValue) => {
  const html = document.documentElement;
  
  // Toggle the 'dark' class on html element for Tailwind dark mode
  if (themeValue === 'dark') {
    html.classList.add('dark');
    html.setAttribute('data-theme', 'dark');
  } else {
    html.classList.remove('dark');
    html.setAttribute('data-theme', 'light');
  }
  
  // Set color-scheme so system components match
  html.style.colorScheme = themeValue;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first (try both keys for compatibility)
    let saved = localStorage.getItem('appTheme');
    if (!saved) {
      saved = localStorage.getItem('theme');
    }
    if (saved && (saved === 'light' || saved === 'dark')) {
      return saved;
    }
    
    // Default to light mode, don't use system preference
    return 'light';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
