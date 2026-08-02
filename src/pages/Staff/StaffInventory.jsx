import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { staffService } from '../../services/staffService';
import styles from './StaffDashboard.module.css';

const StaffInventory = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      setError('');
      const data = await staffService.getInventory();
      setMovies(data);
    } catch (err) {
      setError(err?.message || 'Unable to load inventory.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1>Inventory</h1>
          <p className={styles.subtitle}>Monitor stock levels and availability.</p>
        </div>
        <Button variant="primary" size="small">
          <FiPlus /> Restock
        </Button>
      </div>
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <h3>Movie Inventory</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Movie</th>
                <th>Genre</th>
                <th>Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className={styles.emptyCell}><Loader size="small" text="Loading inventory" /></td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className={styles.emptyCell}>{error}</td>
                </tr>
              ) : movies.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.emptyCell}>No inventory records found.</td>
                </tr>
              ) : (
                movies.map((movie) => {
                  const stock = Number(movie.stock || 0);
                  const threshold = Number(movie.threshold || movie.stock_threshold || 0);
                  const status = stock <= 0 ? 'critical' : stock <= threshold ? 'low' : 'ok';
                  return (
                    <tr key={movie.id}>
                      <td>{movie.title}</td>
                      <td>{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || 'General'}</td>
                      <td>{stock}</td>
                      <td>{threshold}</td>
                      <td>
                        <Badge variant={status === 'critical' ? 'discount' : status === 'low' ? 'warning' : 'success'}>
                          {status === 'critical' ? 'Critical' : status === 'low' ? 'Low' : 'OK'}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="secondary" size="small">Update</Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffInventory;