import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiEdit2,
  FiLock,
  FiUnlock,
} from "react-icons/fi";

import { adminService } from "../../services/adminService";

import Badge from "../../components/Badge/Badge";
import Loader from "../../components/Loader/Loader";

import styles from "./AdminDashboard.module.css";

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);

      const dashboard = await adminService.getDashboard();

      setUsers(dashboard.users);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter((user) =>
    (
      user.full_name ||
      user.name ||
      ""
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader size="large" text="Loading users" />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>

      {/* Header */}

      <div className={styles.header}>
        <div>
          <h1>User Management</h1>

          <p className={styles.subtitle}>
            Manage customers, staff and administrators.
          </p>
        </div>
      </div>

      {/* Users Table */}

      <div className={styles.tableCard}>

        <div className={styles.tableHeader}>

          <h3>
            All Users ({filteredUsers.length})
          </h3>

          <div className={styles.searchBox}>
            <FiSearch />

            <input
              type="text"
              placeholder="Search users..."
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
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Orders</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className={styles.emptyCell}
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>

                    <td>

                      <div className={styles.userCell}>

                        <div className={styles.userAvatar}>
                          {(user.full_name || user.name || "?")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)}
                        </div>

                        <div>

                          <div className={styles.userName}>
                            {user.full_name || user.name}
                          </div>

                          <div className={styles.userEmail}>
                            {user.email}
                          </div>

                        </div>

                      </div>

                    </td>

                    <td>

                      <Badge
                        variant={
                          user.role === "admin"
                            ? "primary"
                            : user.role === "staff"
                            ? "accent"
                            : "outline"
                        }
                      >
                        {user.role}
                      </Badge>

                    </td>

                    <td>

                      <Badge
                        variant={
                          user.status === "active"
                            ? "success"
                            : "outline"
                        }
                      >
                        {user.status}
                      </Badge>

                    </td>

                    <td className={styles.muted}>
                      {new Date(
                        user.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {user.total_orders ?? 0}
                    </td>

                    <td>

                      <div className={styles.rowActions}>

                        <button
                          className={styles.actionIcon}
                          title="Edit User"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          className={styles.actionIcon}
                          title={
                            user.status === "active"
                              ? "Suspend User"
                              : "Activate User"
                          }
                        >
                          {user.status === "active" ? (
                            <FiLock />
                          ) : (
                            <FiUnlock />
                          )}
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

export default AdminUsers;