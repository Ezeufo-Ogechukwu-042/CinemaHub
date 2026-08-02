import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiShoppingBag, FiHeadphones, FiBox, FiMessageSquare,
  FiSettings, FiLogOut, FiMenu, FiX, FiChevronDown,
  FiBriefcase, FiBell, FiSearch
} from 'react-icons/fi';
import { useTheme } from '../../Context/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import Avatar from '../../components/Avatar/Avatar';
import styles from './StaffLayout.module.css';

const sidebarItems = [
  { path: '/staff', label: 'Dashboard', icon: FiGrid },
  { path: '/staff/orders', label: 'Orders', icon: FiShoppingBag },
  { path: '/staff/support', label: 'Support', icon: FiHeadphones },
  { path: '/staff/inventory', label: 'Inventory', icon: FiBox },
  { path: '/staff/messages', label: 'Messages', icon: FiMessageSquare },
  { path: '/staff/settings', label: 'Settings', icon: FiSettings },
];

const StaffLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/staff') return location.pathname === '/staff';
    return location.pathname.startsWith(path);
  };

  return (
    <div className={styles.layout}>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/staff" className={styles.brand}>
            <FiBriefcase className={styles.brandIcon} />
            <div>
              <span className={styles.brandName}>CinemaHub</span>
              <span className={styles.brandTag}>Staff Portal</span>
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

        <nav className={styles.nav} aria-label="Staff navigation">
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

      <div className={styles.main}>
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
            <input type="text" placeholder="Search staff portal..." aria-label="Staff search" />
          </div>

          <div className={styles.topbarActions}>
            <button className={styles.iconBtn} aria-label="Notifications">
              <FiBell />
              <span className={styles.notifBadge}>5</span>
            </button>
            <ThemeToggle />
            <div className={styles.profile}>
              <button
                className={styles.profileBtn}
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
              >
                <Avatar size="small" fallback="ST" />
                <span className={styles.profileName}>Staff</span>
                <FiChevronDown className={`${styles.chevron} ${profileOpen ? styles.rotated : ''}`} />
              </button>

              {profileOpen && (
                <div className={styles.dropdown}>
                  <Link to="/staff/settings">Settings</Link>
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

export default StaffLayout; 
