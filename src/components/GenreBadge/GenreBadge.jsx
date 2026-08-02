import React from 'react';
import styles from './GenreBadge.module.css';

const GenreBadge = ({ genre, onClick, active = false, className = '' }) => {
  return (
    <button
      className={`${styles.badge} ${active ? styles.active : ''} ${className}`}
      onClick={onClick}
      type="button"
    >
      {genre}
    </button>
  );
};

export default GenreBadge;
