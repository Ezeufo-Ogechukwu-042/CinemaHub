import React from 'react';
import styles from './Avatar.module.css';

const Avatar = ({ src, alt, size = 'medium', fallback }) => {
  const [error, setError] = React.useState(false);
  
  const initials = fallback || alt?.split(' ').map(n => n[0]).join('').substring(0, 2) || '?';
  
  return (
    <div className={`${styles.avatar} ${styles[size]}`}>
      {!error && src ? (
        <img src={src} alt={alt} onError={() => setError(true)} loading="lazy" />
      ) : (
        <span className={styles.fallback}>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;

