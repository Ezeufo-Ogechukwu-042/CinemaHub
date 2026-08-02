import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiTruck,
} from "react-icons/fi";

import { adminService } from "../../services/adminService";

import { formatPrice } from "../../utils/Formatters";

import Badge from "../../components/Badge/Badge";
import Loader from "../../components/Loader/Loader";

import styles from "./AdminDashboard.module.css";

const AdminOrders = () => {
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);

      const dashboard = await adminService.getDashboard();

      setOrders(dashboard.orders);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = orders.filter((order) =>
    (
      order.customer_name ||
      order.customer ||
      ""
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const variants = {
      completed: "success",
      processing: "warning",
      pending: "primary",
      cancelled: "discount",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader size="large" text="Loading orders" />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>

      {/* Header */}

      <div className={styles.header}>
        <div>
          <h1>All Orders</h1>

          <p className={styles.subtitle}>
            Manage and track customer purchases.
          </p>
        </div>
      </div>

      {/* Orders */}

      <div className={styles.tableCard}>

        <div className={styles.tableHeader}>

          <h3>
            Orders ({filteredOrders.length})
          </h3>

          <div className={styles.searchBox}>
            <FiSearch />

            <input
              type="text"
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

        </div>

        <div className={styles.tableWrapper}>

          <table className={styles.table}>

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Movie</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className={styles.emptyCell}
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>

                    <td className={styles.mono}>
                      {order.id}
                    </td>

                    <td>
                      {order.customer_name ||
                        order.customer}
                    </td>

                    <td>
                      {order.movie_title ||
                        order.movie}
                    </td>

                    <td className={styles.price}>
                      {formatPrice(order.amount)}
                    </td>

                    <td>
                      {getStatusBadge(order.status)}
                    </td>

                    <td className={styles.muted}>
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td>

                      <div
                        className={styles.rowActions}
                      >

                        <button
                          className={styles.actionIcon}
                          title="Approve"
                        >
                          <FiCheck />
                        </button>

                        <button
                          className={styles.actionIcon}
                          title="Ship"
                        >
                          <FiTruck />
                        </button>

                        <button
                          className={styles.actionIcon}
                          title="Cancel"
                        >
                          <FiX />
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

export default AdminOrders;