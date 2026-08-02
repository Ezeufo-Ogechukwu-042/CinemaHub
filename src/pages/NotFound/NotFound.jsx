import React from 'react';
import { Link } from 'react-router-dom';
import { FiFilm } from 'react-icons/fi';
import Button from '../../components/Button/Button';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.page}>
      <FiFilm className={styles.icon} />
      <h1>404</h1>
      <p>This scene doesn't exist.</p>
      <Link to="/">
        <Button variant="primary" size="large">Back to Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;