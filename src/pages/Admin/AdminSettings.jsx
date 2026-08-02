import React, { useEffect, useState } from "react";
import {
  FiSave,
  FiShield,
  FiMail,
  FiGlobe,
} from "react-icons/fi";

import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import { adminService } from "../../services/adminService";

import styles from "./AdminDashboard.module.css";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    storeName: "CinemaHub",
    supportEmail: "",
    twoFactor: true,
    strongPasswords: true,
    sessionTimeout: false,
    orderNotifications: true,
    newUserAlerts: true,
    lowStockAlerts: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);

      // Later you can replace this with:
      // const data = await adminService.getSettings();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, checked, type } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  async function handleSave() {
    try {

      // await adminService.updateSettings(settings);

      alert("Settings saved successfully.");

    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader size="large" text="Loading settings" />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>

      <div className={styles.header}>
        <div>
          <h1>Settings</h1>

          <p className={styles.subtitle}>
            Configure platform preferences.
          </p>
        </div>
      </div>

      <div className={styles.bottomRow}>

        {/* SECURITY */}

        <div className={styles.bottomCard}>

          <div className={styles.cardHeader}>
            <h3>
              <FiShield />
              Security
            </h3>
          </div>

          <div className={styles.settingsContent}>

            <label className={styles.settingItem}>
              <span>
                Two-Factor Authentication
              </span>

              <input
                type="checkbox"
                name="twoFactor"
                checked={settings.twoFactor}
                onChange={handleChange}
              />
            </label>

            <label className={styles.settingItem}>
              <span>
                Require Strong Passwords
              </span>

              <input
                type="checkbox"
                name="strongPasswords"
                checked={settings.strongPasswords}
                onChange={handleChange}
              />
            </label>

            <label className={styles.settingItem}>
              <span>
                Session Timeout
              </span>

              <input
                type="checkbox"
                name="sessionTimeout"
                checked={settings.sessionTimeout}
                onChange={handleChange}
              />
            </label>

          </div>

        </div>

        {/* NOTIFICATIONS */}

        <div className={styles.bottomCard}>

          <div className={styles.cardHeader}>
            <h3>
              <FiMail />
              Notifications
            </h3>
          </div>

          <div className={styles.settingsContent}>

            <label className={styles.settingItem}>
              <span>Order Notifications</span>

              <input
                type="checkbox"
                name="orderNotifications"
                checked={settings.orderNotifications}
                onChange={handleChange}
              />
            </label>

            <label className={styles.settingItem}>
              <span>New User Alerts</span>

              <input
                type="checkbox"
                name="newUserAlerts"
                checked={settings.newUserAlerts}
                onChange={handleChange}
              />
            </label>

            <label className={styles.settingItem}>
              <span>Low Stock Alerts</span>

              <input
                type="checkbox"
                name="lowStockAlerts"
                checked={settings.lowStockAlerts}
                onChange={handleChange}
              />
            </label>

          </div>

        </div>

        {/* PLATFORM */}

        <div className={styles.bottomCard}>

          <div className={styles.cardHeader}>
            <h3>
              <FiGlobe />
              Platform
            </h3>
          </div>

          <div className={styles.settingsContent}>

            <label className={styles.inputGroup}>
              <span>Store Name</span>

              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className={styles.settingsInput}
              />
            </label>

            <label className={styles.inputGroup}>
              <span>Support Email</span>

              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className={styles.settingsInput}
              />
            </label>

          </div>

        </div>

      </div>

      <div className={styles.settingsFooter}>
        <Button
          variant="primary"
          onClick={handleSave}
        >
          <FiSave />
          Save Changes
        </Button>
      </div>

    </div>
  );
};

export default AdminSettings;