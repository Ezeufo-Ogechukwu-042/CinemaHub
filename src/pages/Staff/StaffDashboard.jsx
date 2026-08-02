import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiHeadphones,
  FiBox,
  FiMessageSquare,
  FiTrendingUp,
  FiTrendingDown,
  FiCheck,
  FiX,
  FiClock,
  FiAlertTriangle,
  FiPackage,
  FiTruck,
  FiUser,
  FiSearch,
  FiFilter,
  FiEye,
  FiSend,
} from "react-icons/fi";

import { formatDate, formatPrice } from "../../utils/Formatters";
import Badge from "../../components/Badge/Badge";
import Button from "../../components/Button/Button";
import Loader from "../../components/Loader/Loader";
import { useCart } from "../../Context/CartContext";
import { useUser } from "../../Context/UserContext";
import { staffService } from "../../services/staffService";
import { supabase } from "../../supabase/client";
import styles from "./StaffDashboard.module.css";

const statusBadgeVariant = (status) => {
  const variants = {
    pending: "primary",
    processing: "warning",
    shipped: "success",
    delivered: "success",
    open: "primary",
    "in-progress": "warning",
    resolved: "success",
    critical: "discount",
    low: "warning",
    "out-of-stock": "discount",
  };

  return variants[status] || "default";
};

const getOrderStatusIcon = (status) => {
  const icons = {
    pending: <FiClock />,
    processing: <FiPackage />,
    shipped: <FiTruck />,
    delivered: <FiCheck />,
  };
  return icons[status] || <FiClock />;
};

const getPriorityColor = (priority) => {
  const colors = {
    high: "var(--error)",
    normal: "var(--warning)",
    low: "var(--success)",
  };
  return colors[priority] || "var(--muted)";
};

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useUser();
  const { showToast } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [stats, setStats] = useState({
    ordersToday: 0,
    pendingOrders: 0,
    openSupportTickets: 0,
    lowStockMovies: 0,
    unreadMessages: 0,
  });

  const [orderFilter, setOrderFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [ticketActionId, setTicketActionId] = useState(null);
  const [messageActionId, setMessageActionId] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboard = await staffService.getDashboard();

      setOrders(dashboard.orders || []);
      setTickets(dashboard.tickets || []);
      setMessages(dashboard.messages || []);
      setInventoryAlerts(dashboard.inventoryAlerts || []);
      setStats(dashboard.stats || {
        ordersToday: 0,
        pendingOrders: 0,
        openSupportTickets: 0,
        lowStockMovies: 0,
        unreadMessages: 0,
      });
    } catch (err) {
      setError(err?.message || "Unable to load staff dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (!user) return;
    loadDashboard();
  }, [loadDashboard, user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel("staff-dashboard");

    ["orders", "support_tickets", "messages", "movies"].forEach((table) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          loadDashboard();
        }
      );
    });

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [loadDashboard, user]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        if (orderFilter === "pending") return order.status === "pending";
        if (orderFilter === "processing") return order.status === "processing";
        if (orderFilter === "shipped") return order.status === "shipped";
        return true;
      })
      .filter((order) => {
        const term = searchTerm.toLowerCase();
        return [order.id, order.customer_name, order.movie_title]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term));
      });
  }, [orderFilter, orders, searchTerm]);

  const handleProcessOrder = async (order) => {
    const nextStatus = order.status === "pending" ? "processing" : order.status === "processing" ? "shipped" : order.status;

    if (nextStatus === order.status) return;

    try {
      setProcessingOrderId(order.id);
      await staffService.updateOrderStatus(order.id, nextStatus);
      showToast(`Order ${order.id} moved to ${nextStatus}.`);
      await loadDashboard();
    } catch (err) {
      showToast(err?.message || "Unable to update order status.", "discount");
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleResolveTicket = async (ticket) => {
    try {
      setTicketActionId(ticket.id);
      await staffService.updateTicketStatus(ticket.id, "resolved");
      showToast(`Ticket ${ticket.id} marked resolved.`);
      await loadDashboard();
    } catch (err) {
      showToast(err?.message || "Unable to update ticket status.", "discount");
    } finally {
      setTicketActionId(null);
    }
  };

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);

    if (!message.is_read) {
      try {
        setMessageActionId(message.id);
        await staffService.markMessageRead(message.id);
        await loadDashboard();
      } catch (err) {
        showToast(err?.message || "Unable to mark message read.", "discount");
      } finally {
        setMessageActionId(null);
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    const recipientName = selectedMessage?.sender_name || "Customer";

    try {
      setLoading(true);
      await staffService.sendMessage({
        recipientName,
        body: replyText.trim(),
        ticketId: selectedMessage?.ticket_id,
      });
      setReplyText("");
      showToast("Reply sent successfully.");
      await loadDashboard();
    } catch (err) {
      showToast(err?.message || "Unable to send reply.", "discount");
    } finally {
      setLoading(false);
    }
  };

  const getAlertVariant = (status) => {
    if (status === "critical" || status === "out-of-stock") return "discount";
    if (status === "low") return "warning";
    return "primary";
  };

  if (authLoading || (!authLoading && !user)) {
    return <Loader size="large" />;
  }

  if (error) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div>
            <h1>Staff Dashboard</h1>
            <p className={styles.subtitle}>There was a problem loading your dashboard.</p>
          </div>
        </div>
        <div style={{ padding: "32px", textAlign: "center" }}>
          <p>{error}</p>
          <Button onClick={loadDashboard}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1>Staff Dashboard</h1>
          <p className={styles.subtitle}>
            Welcome back. {stats.openSupportTickets} open tickets, {stats.unreadMessages} unread messages.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => navigate("/staff/messages")}
          >
            <FiMessageSquare /> Messages ({stats.unreadMessages})
          </Button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.icon0}`}>
              <FiShoppingBag />
            </div>
            <span className={`${styles.statChange} ${styles.up}`}>
              <FiTrendingUp /> Orders Today
            </span>
          </div>
          <div className={styles.statValue}>{stats.ordersToday}</div>
          <div className={styles.statLabel}>Orders Today</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.icon1}`}>
              <FiShoppingBag />
            </div>
            <span className={`${styles.statChange} ${styles.up}`}>
              <FiTrendingUp /> Pending Orders
            </span>
          </div>
          <div className={styles.statValue}>{stats.pendingOrders}</div>
          <div className={styles.statLabel}>Pending Orders</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.icon2}`}>
              <FiHeadphones />
            </div>
            <span className={`${styles.statChange} ${stats.openSupportTickets > 0 ? styles.down : styles.up}`}>
              {stats.openSupportTickets > 0 ? <FiTrendingDown /> : <FiTrendingUp />} Support Tickets
            </span>
          </div>
          <div className={styles.statValue}>{stats.openSupportTickets}</div>
          <div className={styles.statLabel}>Open Support Tickets</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={`${styles.statIcon} ${styles.icon3}`}>
              <FiBox />
            </div>
            <span className={`${styles.statChange} ${stats.lowStockMovies > 0 ? styles.down : styles.up}`}>
              {stats.lowStockMovies > 0 ? <FiTrendingDown /> : <FiTrendingUp />} Inventory Alerts
            </span>
          </div>
          <div className={styles.statValue}>{stats.lowStockMovies}</div>
          <div className={styles.statLabel}>Low Stock Movies</div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <h3>Orders to Process</h3>
            <div className={styles.cardActions}>
              <div className={styles.searchBox}>
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className={styles.filterSelect}
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
              </select>
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
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={styles.emptyCell}>
                      No matching orders were found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className={styles.mono}>{order.id}</td>
                      <td>{order.customer_name}</td>
                      <td>{order.movie_title}</td>
                      <td className={styles.price}>{formatPrice(order.amount)}</td>
                      <td>
                        <Badge variant={statusBadgeVariant(order.status)}>
                          {getOrderStatusIcon(order.status)} {order.status}
                        </Badge>
                      </td>
                      <td>
                        <span
                          className={styles.priorityDot}
                          style={{ background: getPriorityColor(order.priority) }}
                        />
                        {order.priority}
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          <button
                            className={styles.actionBtn}
                            title="View"
                            onClick={() => handleViewOrder(order)}
                          >
                            <FiEye />
                          </button>
                          {order.status !== "delivered" && order.status !== "cancelled" && (
                            <button
                              className={styles.actionBtn}
                              title="Process"
                              onClick={() => handleProcessOrder(order)}
                              disabled={processingOrderId === order.id}
                            >
                              <FiCheck />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.sideCard}>
          <div className={styles.cardHeader}>
            <h3>Support Tickets</h3>
            <Link to="/staff/support" className={styles.viewAll}>
              View All
            </Link>
          </div>
          <div className={styles.ticketList}>
            {tickets.length === 0 ? (
              <div className={styles.emptyCell}>No support tickets available.</div>
            ) : (
              tickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className={styles.ticket}>
                  <div className={styles.ticketTop}>
                    <span className={styles.ticketId}>{ticket.id}</span>
                    <Badge variant={statusBadgeVariant(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <div className={styles.ticketSubject}>{ticket.subject}</div>
                  <div className={styles.ticketBottom}>
                    <span className={styles.ticketCustomer}>
                      <FiUser /> {ticket.customer_name}
                    </span>
                    <span className={styles.ticketTime}>
                      {ticket.updated_at ? formatDate(ticket.updated_at) : formatDate(ticket.created_at)}
                    </span>
                  </div>
                  <div className={styles.ticketBar}>
                    <div
                      className={styles.ticketProgress}
                      style={{
                        width:
                          ticket.status === "resolved"
                            ? "100%"
                            : ticket.status === "in-progress"
                            ? "60%"
                            : "20%",
                        background:
                          ticket.status === "resolved"
                            ? "var(--success)"
                            : "var(--warning)",
                      }}
                    />
                  </div>
                  {ticket.status !== "resolved" && (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleResolveTicket(ticket)}
                      disabled={ticketActionId === ticket.id}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.bottomCard}>
          <div className={styles.cardHeader}>
            <h3>
              <FiAlertTriangle /> Inventory Alerts
            </h3>
            <Link to="/staff/inventory" className={styles.viewAll}>
              Manage
            </Link>
          </div>
          <div className={styles.alertList}>
            {inventoryAlerts.length === 0 ? (
              <div className={styles.emptyCell}>No inventory alerts at this time.</div>
            ) : (
              inventoryAlerts.map((alert) => (
                <div key={alert.id} className={styles.alert}>
                  <div className={styles.alertInfo}>
                    <span className={styles.alertTitle}>{alert.title}</span>
                    <span className={styles.alertMeta}>
                      Stock: {alert.stock} / Threshold: {alert.threshold}
                    </span>
                  </div>
                  <Badge variant={getAlertVariant(alert.status)}>{alert.status}</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.bottomCard}>
          <div className={styles.cardHeader}>
            <h3>
              <FiMessageSquare /> Recent Messages
            </h3>
            <Link to="/staff/messages" className={styles.viewAll}>
              All
            </Link>
          </div>
          <div className={styles.messageList}>
            {messages.length === 0 ? (
              <div className={styles.emptyCell}>No messages yet.</div>
            ) : (
              messages.slice(0, 5).map((message) => (
                <button
                  key={message.id}
                  type="button"
                  className={`${styles.message} ${!message.is_read ? styles.unread : ""}`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <div className={styles.messageAvatar}>
                    {message.sender_name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")}
                  </div>
                  <div className={styles.messageContent}>
                    <div className={styles.messageTop}>
                      <span className={styles.messageFrom}>{message.sender_name}</span>
                      <span className={styles.messageTime}>
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    <p className={styles.messageText}>{message.body}</p>
                  </div>
                  {!message.is_read && <span className={styles.unreadDot} />}
                </button>
              ))
            )}
          </div>
          <div className={styles.messageInput}>
            <input
              type="text"
              placeholder={selectedMessage ? `Reply to ${selectedMessage.sender_name}` : "Quick reply..."}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <button onClick={handleSendReply} disabled={!replyText.trim() || loading}>
              <FiSend />
            </button>
          </div>
        </div>

        <div className={styles.bottomCard}>
          <div className={styles.cardHeader}>
            <h3>Quick Actions</h3>
          </div>
          <div className={styles.quickActions}>
            <button
              type="button"
              className={styles.quickBtn}
              onClick={() => navigate("/staff/orders")}
            >
              <FiShoppingBag /> Process Orders
            </button>
            <button
              type="button"
              className={styles.quickBtn}
              onClick={() => navigate("/staff/support")}
            >
              <FiHeadphones /> Reply to Tickets
            </button>
            <button
              type="button"
              className={styles.quickBtn}
              onClick={() => navigate("/staff/inventory")}
            >
              <FiBox /> Update Inventory
            </button>
            <button
              type="button"
              className={styles.quickBtn}
              onClick={() => navigate("/staff/orders")}
            >
              <FiTruck /> Update Shipping
            </button>
            <button
              type="button"
              className={styles.quickBtn}
              onClick={() => navigate("/staff/messages")}
            >
              <FiMessageSquare /> Send Broadcast
            </button>
            <button
              type="button"
              className={styles.quickBtn}
              onClick={() => showToast("Report generated and queued for export.")}
            >
              <FiFilter /> Generate Report
            </button>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              width: "min(940px, 100%)",
              background: "var(--surface)",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div>
                <h2>Order {selectedOrder.id}</h2>
                <p className={styles.subtitle}>Full order details and processing actions.</p>
              </div>
              <Button variant="secondary" size="small" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
            <div style={{ display: "grid", gap: "18px" }}>
              <div>
                <strong>Customer:</strong> {selectedOrder.customer_name}
              </div>
              <div>
                <strong>Movie:</strong> {selectedOrder.movie_title}
              </div>
              <div>
                <strong>Amount:</strong> {formatPrice(selectedOrder.amount)}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <Badge variant={statusBadgeVariant(selectedOrder.status)}>{selectedOrder.status}</Badge>
              </div>
              <div>
                <strong>Priority:</strong> {selectedOrder.priority}
              </div>
              <div>
                <strong>Date:</strong> {selectedOrder.created_at ? formatDate(selectedOrder.created_at) : "N/A"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;

