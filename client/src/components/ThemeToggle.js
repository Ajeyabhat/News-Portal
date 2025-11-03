import React, { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import './Navbar.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} className="theme-toggle-button">
      {theme === 'light' ? <BsFillMoonFill /> : <BsFillSunFill />}
    </button>
  );
}

export default ThemeToggle;
