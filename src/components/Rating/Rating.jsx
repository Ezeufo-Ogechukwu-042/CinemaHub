import React from 'react';
import { FiStar } from 'react-icons/fi';
import styles from './Rating.module.css';

const Rating = ({ value, max = 5, size = 'medium', showValue = true }) => {
  const stars = [];
  const normalizedValue = value / 2; // Convert 10-scale to 5-scale
  
  for (let i = 1; i <= max; i++) {
    const filled = i <= normalizedValue;
    const half = !filled && i - 0.5 <= normalizedValue;
    
    stars.push(
      <span 
        key={i} 
        className={`${styles.star} ${filled ? styles.filled : ''} ${half ? styles.half : ''}`}
      >
        <FiStar />
      </span>
    );
  }

  return (
    <div className={`${styles.rating} ${styles[size]}`}>
      <div className={styles.stars}>{stars}</div>
      {showValue && <span className={styles.value}>{value.toFixed(1)}</span>}
    </div>
  );
};

export default Rating;



