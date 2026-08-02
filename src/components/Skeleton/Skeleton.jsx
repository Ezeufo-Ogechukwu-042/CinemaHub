import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({ width, height, circle = false, className = '' }) => {
  return (
    <div
      className={`${styles.skeleton} ${circle ? styles.circle : ''} ${className}`}
      style={{ width, height }}
    />
  );
};

export const SkeletonCard = () => (
  <div className={styles.card}>
    <Skeleton height="280px" className={styles.poster} />
    <div className={styles.content}>
      <Skeleton width="70%" height="20px" />
      <Skeleton width="40%" height="16px" />
      <Skeleton width="50%" height="16px" />
    </div>
  </div>
);

export default Skeleton;


