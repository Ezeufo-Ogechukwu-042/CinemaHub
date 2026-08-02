import React from 'react';
import { FiCheckCircle, FiX, FiAlertCircle } from 'react-icons/fi';
import styles from './Toast.module.css';

const Toast = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <FiCheckCircle />,
    error: <FiAlertCircle />,
  };

  return (
    <div className={`${styles.toast} ${styles[type]} animate-slide-up`}>
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={onClose} aria-label="Close notification">
        <FiX />
      </button>
    </div>
  );
};

export default Toast;

