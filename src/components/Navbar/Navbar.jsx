import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiMenu, FiX, FiSearch, FiShoppingCart, FiHeart, 
  FiUser, FiFilm, FiHome, FiTrendingUp, FiZap, 
  FiPlus, FiPhone, FiInfo, FiShield, FiBriefcase, FiUserPlus, FiLogIn 
} from 'react-icons/fi';
import logo from '../../assets/logo.png';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSearch } from '../../context/SearchContext';
import { useScroll } from '../../hooks/useScroll';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Navbar.module.css';

const navLinks = [
  { path: '/', label: 'Home', icon: FiHome },
  { path: '/movies', label: 'Movies', icon: FiFilm },
  { path: '/movies?filter=trending', label: 'Trending', icon: FiTrendingUp },
  { path: '/movies?filter=new', label: 'New Releases', icon: FiZap },
  { path: '/about', label: 'About', icon: FiInfo },
  { path: '/contact', label: 'Contact', icon: FiPhone },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { isScrolled } = useScroll();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { setSearchQuery } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      setSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <>
      <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className="container">
          <div className={styles.inner}>
            {/* Brand Logo */}
            <Link to="/" className={styles.logo} aria-label="CinemaHub Home">
              <img src={logo} alt="Brand-logo" className={styles.logoImage}/>
            </Link>

            {/* Desktop Navigation */}
            <nav className={styles.desktopNav} aria-label="Main navigation">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || 
                  (link.path.includes('?') && location.search === link.path.substring(link.path.indexOf('?')));
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Tools */}
            <div className={styles.actions}>
              <button 
                className={styles.iconBtn}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search movies"
                title="Search"
              >
                <FiSearch />
              </button>

              <Link to="/wishlist" className={styles.iconBtn} aria-label="Wishlist" title="Wishlist">
                <FiHeart />
                {wishlist.length > 0 && (
                  <span className={`${styles.badge} ${styles.badgeWishlist}`}>{wishlist.length}</span>
                )}
              </Link>

              <Link to="/cart" className={styles.iconBtn} aria-label="Cart" title="Cart">
                <FiShoppingCart />
                {cartCount > 0 && (
                  <span className={`${styles.badge} ${styles.badgeCart}`}>{cartCount}</span>
                )}
              </Link>


              {/* User Dropdown */}
              <div className={styles.profileDropdown} ref={profileRef}>
                <button 
                  className={styles.iconBtn} 
                  aria-label="User Account"
                  onClick={() => setProfileOpen(!profileOpen)}
                  title="Account Menu"
                >
                  <FiUser />
                </button>
                {profileOpen && (
                  <div className={styles.profileMenu}>
                    <div className={styles.menuHeader}>
                      <span className={styles.menuTitle}>Account Services</span>
                    </div>
                    <Link to="/profile" className={styles.menuItem}>
                      <FiUser /> My Profile
                    </Link>
                    <Link to="/wishlist" className={styles.menuItem}>
                      <FiHeart /> Saved Movies
                    </Link>
                    <div className={styles.menuDivider} />
                    <Link to="/login" className={styles.menuItem}>
                      <FiLogIn /> Sign In
                    </Link>
                    <Link to="/register" className={`${styles.menuItem} ${styles.menuHighlight}`}>
                      <FiUserPlus /> Create Account
                    </Link>
                    <div className={styles.menuDivider} />
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Toggle */}
              <button 
                className={styles.mobileMenuBtn}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Search Bar Overlay */}
      {searchOpen && (
        <div className={styles.searchOverlayWrapper} ref={searchRef}>
          <div className="container">
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="search"
                placeholder="Search movies, genres, directors, actors..."
                className={styles.searchInput}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className={styles.searchSubmitBtn}>
                Search
              </button>
              <button 
                type="button" 
                className={styles.searchCloseBtn}
                onClick={() => setSearchOpen(false)}
              >
                <FiX />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContent}>
          <div className={styles.mobileNavLinks}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${styles.mobileLink} ${location.pathname === link.path ? styles.active : ''}`}
              >
                <link.icon className={styles.mobileIcon} />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className={styles.mobileDivider} />

          <div className={styles.mobileAuthLinks}>
            <Link to="/login" className={styles.mobileLink}>
              <FiLogIn /> Sign In
            </Link>
            <Link to="/register" className={`${styles.mobileLink} ${styles.mobileHighlight}`}>
              <FiUserPlus /> Register Account
            </Link>
          </div>

          <div className={styles.mobileDivider} />
        </div>
      </div>
    </>
  );
};

export default Navbar;
