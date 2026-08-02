import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className={`${styles.toggle} ${className}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span className={`${styles.icon} ${isDark ? styles.active : ''}`}>
        <FiMoon />
      </span>
      <span className={`${styles.icon} ${!isDark ? styles.active : ''}`}>
        <FiSun />
      </span>
    </button>
  );
};

export default ThemeToggle;

