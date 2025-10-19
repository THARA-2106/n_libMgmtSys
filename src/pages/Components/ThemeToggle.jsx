import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get saved theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else if (newTheme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    } else {
      // Auto theme - follow system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
      } else {
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
      }
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    setIsOpen(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <FaMoon />;
      case 'light':
        return <FaSun />;
      default:
        return <FaDesktop />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return 'Dark';
      case 'light':
        return 'Light';
      default:
        return 'Auto';
    }
  };

  return (
    <div className="theme-toggle-container">
      <button
        className="theme-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme"
        title={`Current theme: ${getThemeLabel()}`}
      >
        {getThemeIcon()}
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-option" onClick={() => handleThemeChange('light')}>
            <FaSun className="theme-icon light" />
            <span>Light</span>
            {theme === 'light' && <div className="checkmark">✓</div>}
          </div>
          
          <div className="theme-option" onClick={() => handleThemeChange('dark')}>
            <FaMoon className="theme-icon dark" />
            <span>Dark</span>
            {theme === 'dark' && <div className="checkmark">✓</div>}
          </div>
          
          <div className="theme-option" onClick={() => handleThemeChange('auto')}>
            <FaDesktop className="theme-icon auto" />
            <span>Auto</span>
            {theme === 'auto' && <div className="checkmark">✓</div>}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="theme-dropdown-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeToggle;