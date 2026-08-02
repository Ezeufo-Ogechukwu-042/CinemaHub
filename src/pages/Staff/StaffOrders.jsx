import React, { useEffect, useMemo, useState } from 'react';
import { FiCheck, FiClock, FiPackage, FiSearch, FiTruck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import Badge from '../../components/Badge/Badge';
import Loader from '../../components/Loader/Loader';
import { staffService } from '../../services/staffService';
import { formatPrice } from '../../utils/Formatters';
import styles from './StaffDashboard.module.css';

const StaffOrders = () => {
  const { showToast } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingOrderId, setProcessingOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError('');
      const data = await staffService.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err?.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return orders.filter((order) => {
      const values = [order.id, order.customer_name, order.movie_title, order.status, order.priority];
      return values.some((value) => String(value).toLowerCase().includes(term));
    });
  }, [orders, searchTerm]);

  const getIcon = (s) => ({
    pending: <FiClock />,
    processing: <FiPackage />,
    shipped: <FiTruck />,
    delivered: <FiCheck />,
  })[s] || <FiClock />;

  const getPriorityColor = (p) => ({
    high: 'var(--error)',
    normal: 'var(--warning)',
    low: 'var(--success)',
  })[p] || 'var(--muted)';

  const handleProcessOrder = async (order) => {
    const nextStatus = order.status === 'pending' ? 'processing' : order.status === 'processing' ? 'shipped' : order.status;
    if (nextStatus === order.status) return;

    try {
      setProcessingOrderId(order.id);
      await staffService.updateOrderStatus(order.id, nextStatus);
      showToast(`Order ${order.id} updated.`);
      await loadOrders();
    } catch (err) {
      showToast(err?.message || 'Unable to update order.', 'discount');
    } finally {
      setProcessingOrderId(null);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1>Orders</h1>
          <p className={styles.subtitle}>Process and manage customer orders.</p>
        </div>
      </div>
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <h3>All Orders</h3>
          <div className={styles.searchBox}>
            <FiSearch />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Movie</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className={styles.emptyCell}><Loader size="small" text="Loading orders" /></td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className={styles.emptyCell}>{error}</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.emptyCell}>No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className={styles.mono}>{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.movie_title}</td>
                    <td className={styles.price}>{formatPrice(order.amount)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                        {getIcon(order.status)} {order.status}
                      </span>
                    </td>
                    <td>
                      <span className={styles.priorityDot} style={{ background: getPriorityColor(order.priority) }} />
                      {order.priority}
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          className={styles.actionBtn}
                          title="Process"
                          onClick={() => handleProcessOrder(order)}
                          disabled={processingOrderId === order.id}
                        >
                          <FiCheck />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffOrders;