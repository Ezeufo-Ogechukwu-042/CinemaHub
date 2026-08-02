import React, { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiUsers,
  FiShoppingBag,
  FiFilm,
} from "react-icons/fi";

import { adminService } from "../../services/adminService";
import Loader from "../../components/Loader/Loader";

import styles from "./AdminDashboard.module.css";

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    revenue: 0,
    users: 0,
    orders: 0,
    movies: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);

      const dashboard = await adminService.getDashboard();

      setStats({
        revenue: dashboard.totalRevenue,
        users: dashboard.totalUsers,
        orders: dashboard.totalOrders,
        movies: dashboard.totalMovies,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader size="large" text="Loading analytics" />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Revenue",
      value: `₦${Number(stats.revenue).toLocaleString()}`,
      icon: FiDollarSign,
    },
    {
      label: "Total Users",
      value: stats.users,
      icon: FiUsers,
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: FiShoppingBag,
    },
    {
      label: "Movies Listed",
      value: stats.movies,
      icon: FiFilm,
    },
  ];

  return (
    <div className={styles.dashboard}>

      {/* Header */}

      <div className={styles.header}>
        <div>
          <h1>Analytics</h1>

          <p className={styles.subtitle}>
            Deep insights into CinemaHub performance.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div className={styles.statsGrid}>
        {cards.map((card, index) => (
          <div
            key={index}
            className={styles.statCard}
          >
            <div className={styles.statHeader}>
              <div
                className={`${styles.statIcon} ${
                  styles[`icon${index}`]
                }`}
              >
                <card.icon />
              </div>
            </div>

            <div className={styles.statValue}>
              {card.value}
            </div>

            <div className={styles.statLabel}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}

      <div className={styles.chartsRow}>

        <div className={styles.chartCard}>

          <div className={styles.chartHeader}>
            <h3>Revenue Trend</h3>
          </div>

          <div className={styles.chartPlaceholder}>
            <div className={styles.barChart}>
              {[45, 60, 55, 72, 63, 85, 80].map(
                (height, index) => (
                  <div
                    key={index}
                    className={styles.barWrapper}
                  >
                    <div
                      className={styles.bar}
                      style={{
                        height: `${height}%`,
                      }}
                    />

                    <span>
                      {
                        [
                          "Mon",
                          "Tue",
                          "Wed",
                          "Thu",
                          "Fri",
                          "Sat",
                          "Sun",
                        ][index]
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

        </div>

        {/* User Growth */}

        <div className={styles.chartCard}>

          <div className={styles.chartHeader}>
            <h3>User Growth</h3>
          </div>

          <div className={styles.chartPlaceholder}>
            <div className={styles.barChart}>
              {[25, 40, 35, 50, 60, 70, 90].map(
                (height, index) => (
                  <div
                    key={index}
                    className={styles.barWrapper}
                  >
                    <div
                      className={styles.bar}
                      style={{
                        height: `${height}%`,
                      }}
                    />

                    <span>
                      {
                        [
                          "Mon",
                          "Tue",
                          "Wed",
                          "Thu",
                          "Fri",
                          "Sat",
                          "Sun",
                        ][index]
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminAnalytics;