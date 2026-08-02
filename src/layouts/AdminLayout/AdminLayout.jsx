import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiFilm, FiUsers, FiShoppingBag, FiBarChart2,
  FiSettings, FiLogOut, FiMenu, FiX, FiChevronDown,
  FiShield, FiBell, FiSearch
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import Avatar from '../../components/Avatar/Avatar';
import styles from './AdminLayout.module.css';

const sidebarItems = [
  { path: '/admin', label: 'Dashboard', icon: FiGrid },
  { path: '/admin/movies', label: 'Movies', icon: FiFilm },
  { path: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { path: '/admin/users', label: 'Users', icon: FiUsers },
  { path: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
  { path: '/admin/settings', label: 'Settings', icon: FiSettings },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className={styles.layout}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/admin" className={styles.brand}>
            <FiShield className={styles.brandIcon} />
            <div>
              <span className={styles.brandName}>CinemaHub</span>
              <span className={styles.brandTag}>Admin Panel</span>
            </div>
          </Link>
          <button
            className={styles.closeBtn}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Admin navigation">
          {sidebarItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className={styles.navIcon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={() => navigate('/')}>
            <FiLogOut /> Back to Store
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={styles.main}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FiMenu />
          </button>

          <div className={styles.searchBar}>
            <FiSearch />
            <input type="text" placeholder="Search admin panel..." aria-label="Admin search" />
          </div>

          <div className={styles.topbarActions}>
            <button className={styles.iconBtn} aria-label="Notifications">
              <FiBell />
              <span className={styles.notifBadge}>3</span>
            </button>
            <ThemeToggle />
            <div className={styles.profile}>
              <button
                className={styles.profileBtn}
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
              >
                <Avatar size="small" fallback="AD" />
                <span className={styles.profileName}>Admin</span>
                <FiChevronDown className={`${styles.chevron} ${profileOpen ? styles.rotated : ''}`} />
              </button>

              {profileOpen && (
                <div className={styles.dropdown}>
                  <Link to="/admin/settings">Settings</Link>
                  <button onClick={() => navigate('/')}>Back to Store</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
