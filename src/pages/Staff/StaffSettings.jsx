import React from 'react';
import { FiSave, FiBell, FiUser } from 'react-icons/fi';
import Button from '../../components/Button/Button';
import styles from './StaffDashboard.module.css';

const StaffSettings = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div><h1>Settings</h1><p className={styles.subtitle}>Manage your staff account preferences.</p></div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.bottomCard}>
          <div className={styles.cardHeader}><h3><FiUser /> Profile</h3></div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span>Display Name</span>
              <input type="text" defaultValue="Staff Member" style={{ padding: '10px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span>Email</span>
              <input type="email" defaultValue="staff@cinemahub.com" style={{ padding: '10px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
            </label>
          </div>
        </div>
        <div className={styles.bottomCard}>
          <div className={styles.cardHeader}><h3><FiBell /> Notifications</h3></div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>New Order Alerts</span><input type="checkbox" defaultChecked />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Support Ticket Alerts</span><input type="checkbox" defaultChecked />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Low Stock Alerts</span><input type="checkbox" />
            </label>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '24px' }}>
        <Button variant="primary" size="medium"><FiSave /> Save Changes</Button>
      </div>
    </div>
  );
};

export default StaffSettings;

