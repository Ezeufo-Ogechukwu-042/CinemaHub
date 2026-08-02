import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFilm, FiFacebook, FiTwitter, FiInstagram, FiYoutube,
  FiMail, FiMapPin, FiPhone,  
} from 'react-icons/fi';
import styles from './Footer.module.css';
import logo from '../../assets/logo.png'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <img src={logo} alt="Brand-logo" className={styles.logoImage} />
            </Link>
            <p className={styles.tagline}>
              Your premier digital cinema destination in Nigeria. Discover, stream, and enjoy the latest blockbusters and beloved classics with ease.
            </p>
            <div className={styles.socials}>
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="YouTube"><FiYoutube /></a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className={styles.column}>
            <h4>Discover</h4>
            <ul>
              <li><Link to="/movies">All Movies</Link></li>
              <li><Link to="/movies?filter=trending">Trending Now</Link></li>
              <li><Link to="/movies?filter=new">New Releases</Link></li>
              <li><Link to="/movies?filter=top">Top Rated</Link></li>
            </ul>
          </div>

          {/* Quick Links & Portals */}
          <div className={styles.column}>
            <h4>Company & Portals</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className={styles.column}>
            <h4>Contact Info</h4>
            <ul className={styles.contactList}>
              <li><FiMapPin className={styles.contactIcon} /> 12B Allen Avenue, Ikeja, Lagos, Nigeria</li>
              <li><FiPhone className={styles.contactIcon} /> +234 810 000 0000</li>
              <li><FiMail className={styles.contactIcon} /> support@cinemahub.ng</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} CinemaHub Nigeria. All rights reserved.</p>
          <div className={styles.legal}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
