import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTv, FiShield, FiDownloadCloud } from 'react-icons/fi';
import styles from './Banner.module.css';

const Banner = () => {
  return (
    <section className={styles.bannerSection}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.bgGlow} />
          <div className={styles.content}>
            <div className={styles.badgeRow}>
              <span className={styles.badgePill}><FiTv /> Ultra HD 4K</span>
              <span className={styles.badgePill}><FiDownloadCloud /> Offline Download</span>
              <span className={styles.badgePill}><FiShield /> Keep Forever</span>
            </div>
            
            <h2 className={styles.title}>Own the Movies You Love, Anytime Anywhere</h2>
            <p className={styles.subtitle}>
              Build your permanent digital collection with zero subscription fees or streaming limits.
            </p>
            
            <Link to="/movies" className={styles.ctaBtn}>
              <span>Explore Full Cinema Collection</span>
              <FiArrowRight className={styles.btnIcon} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;