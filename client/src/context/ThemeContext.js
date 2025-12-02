import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Apply theme function - outside component so it doesn't recreate
const applyTheme = (themeValue) => {
  const html = document.documentElement;
  
  console.log('🎨 Applying theme:', themeValue);
  console.log('HTML element before:', html.className);
  
  // Simple: just toggle the 'dark' class on html element
  // Tailwind will automatically apply dark: prefixed styles when this class exists
  if (themeValue === 'dark') {
    html.classList.add('dark');
    html.setAttribute('data-theme', 'dark');
    console.log('✅ Dark class added to HTML');
  } else {
    html.classList.remove('dark');
    html.setAttribute('data-theme', 'light');
    console.log('✅ Dark class removed from HTML');
  }
  
  console.log('HTML element after:', html.className);
  console.log('Data-theme:', html.getAttribute('data-theme'));
  
  // Set color-scheme so system components (inputs, scrollbars) match
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
    console.log('🔄 Toggle button clicked!');
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('Theme changing from', prevTheme, 'to', newTheme);
      return newTheme;
    });
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
