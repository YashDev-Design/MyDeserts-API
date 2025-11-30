import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const preparingOrders = orders.filter((o) => o.status === "preparing").length;
  const readyOrders = orders.filter((o) => o.status === "ready").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders"); // GET /api/orders (admin only)
        setOrders(res.data || []);
      } catch (err) {
        console.error("Error fetching orders", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      const updatedOrder = res.data.order;
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updatedOrder : o))
      );
    } catch (err) {
      console.error("Update status error:", err);
      alert(
        err.response?.data?.message ||
          "Could not update order status. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "preparing":
        return "#fff3cd";
      case "ready":
        return "#d4edda";
      case "completed":
        return "#cce5ff";
      case "cancelled":
        return "#f8d7da";
      default:
        return "#ffe5ec"; // pending
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf7f2",
        padding: "30px 20px",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "white",
          borderRadius: "16px",
          padding: "20px 24px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
          border: "1px solid #f3d9e5",
        }}
      >
        {/* Top bar with title + back button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: 0 }}>📦 Recent Orders</h2>

          <button
            onClick={() => navigate("/admin")}
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              border: "none",
              background: "#f0f0f0",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        {/* Summary row cards */}
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Total Orders</div>
            <div style={styles.summaryValue}>{totalOrders}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Pending</div>
            <div style={styles.summaryValue}>{pendingOrders}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Preparing</div>
            <div style={styles.summaryValue}>{preparingOrders}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Ready</div>
            <div style={styles.summaryValue}>{readyOrders}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Completed</div>
            <div style={styles.summaryValue}>{completedOrders}</div>
          </div>
        </div>

        {loading && <p>Loading orders...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p>No orders found yet.</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "2px solid #f0e2d8",
                }}
              >
                <th style={{ padding: "8px" }}>Customer</th>
                <th style={{ padding: "8px" }}>Items</th>
                <th style={{ padding: "8px" }}>Total Items</th>
                <th style={{ padding: "8px" }}>Status</th>
                <th style={{ padding: "8px" }}>Created At</th>
                <th style={{ padding: "8px" }}>Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  style={{ borderBottom: "1px solid #f5e8dd" }}
                >
                  <td style={{ padding: "8px", verticalAlign: "top" }}>
                    <strong>
                      {order.user?.username || order.user?.email || "Unknown"}
                    </strong>
                    <br />
                    <small style={{ color: "#666" }}>{order.user?.email}</small>
                  </td>

                  <td style={{ padding: "8px", verticalAlign: "top" }}>
                    <ul style={{ paddingLeft: "18px", margin: 0 }}>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td style={{ padding: "8px", verticalAlign: "top" }}>
                    {order.totalItems}
                  </td>

                  <td style={{ padding: "8px", verticalAlign: "top" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "999px",
                        background: badgeColor(order.status),
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td style={{ padding: "8px", verticalAlign: "top" }}>
                    {formatDate(order.createdAt)}
                  </td>

                  <td style={{ padding: "8px", verticalAlign: "top" }}>
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                        fontSize: "13px",
                      }}
                    >
                      <option value="pending">pending</option>
                      <option value="preparing">preparing</option>
                      <option value="ready">ready</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  summaryRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  summaryCard: {
    flex: "1 1 120px",
    minWidth: "140px",
    padding: "10px 12px",
    borderRadius: "10px",
    background: "#fffbf7",
    border: "1px solid #f0e2d8",
  },
  summaryLabel: {
    fontSize: "12px",
    color: "#777",
    marginBottom: "4px",
  },
  summaryValue: {
    fontSize: "18px",
    fontWeight: 600,
  },
};

export default AdminOrders;
