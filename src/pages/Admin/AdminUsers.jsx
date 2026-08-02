import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiEdit2,
  FiLock,
  FiUnlock,
} from "react-icons/fi";

import { adminService } from "../../services/adminService";
import { normalizeRole } from "../../utils/roleUtils";

import Badge from "../../components/Badge/Badge";
import Loader from "../../components/Loader/Loader";

import styles from "./AdminDashboard.module.css";

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleDrafts, setRoleDrafts] = useState({});
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [feedback, setFeedback] = useState("");

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

  const handleRoleChange = (userId, nextRole) => {
    setRoleDrafts((current) => ({
      ...current,
      [userId]: normalizeRole(nextRole),
    }));
    setFeedback("");
  };

  const handleSaveRole = async (user) => {
    const nextRole = normalizeRole(roleDrafts[user.id] || user.role);

    try {
      setUpdatingUserId(user.id);
      await adminService.updateUserRole(user.id, nextRole);

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item.id === user.id ? { ...item, role: nextRole } : item
        )
      );

      setFeedback(`${user.full_name || user.email} is now a ${nextRole}.`);
    } catch (err) {
      console.error(err);
      setFeedback("Unable to update the user's role right now.");
    } finally {
      setUpdatingUserId(null);
    }
  };

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

        {feedback && (
          <div style={{ marginBottom: "16px", color: "var(--success)", fontWeight: 600 }}>
            {feedback}
          </div>
        )}

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

                      <div className={styles.rowActions} style={{ gap: "8px", flexWrap: "wrap" }}>
                        <select
                          value={normalizeRole(roleDrafts[user.id] || user.role)}
                          onChange={(event) => handleRoleChange(user.id, event.target.value)}
                          style={{
                            padding: "8px 10px",
                            borderRadius: "8px",
                            border: "1px solid var(--border)",
                            background: "var(--background)",
                            color: "var(--text)",
                          }}
                        >
                          <option value="user">User</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>

                        <button
                          className={styles.actionIcon}
                          title="Save Role"
                          onClick={() => handleSaveRole(user)}
                          disabled={updatingUserId === user.id}
                        >
                          {updatingUserId === user.id ? "Saving..." : "Save"}
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