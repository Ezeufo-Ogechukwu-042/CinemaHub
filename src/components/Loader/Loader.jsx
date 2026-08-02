import React from "react";
import styles from "./Loader.module.css";

const Loader = ({ size = "medium", className = "", text = "Loading CinemaHub..." }) => {
  return (
    <div className={`${styles.loader} ${styles[size]} ${className}`}>
      <div className={styles.loaderCard}>
        <div className={styles.orbital}>
          <div className={styles.core} />
        </div>
        <div className={styles.textBlock}>
          <p className={styles.title}>CinemaHub</p>
          <p className={styles.subtitle}>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;

