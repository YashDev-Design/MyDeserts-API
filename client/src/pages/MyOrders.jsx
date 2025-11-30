import React, { useEffect, useState } from "react";
import api from "../api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

    const getProgressPercent = (status) => {
    switch (status) {
      case "pending":
        return 25;
      case "preparing":
        return 50;
      case "ready":
        return 75;
      case "completed":
        return 100;
      default:
        return 0; // cancelled or unknown
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      try {
        const { data } = await api.get("/orders/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (isMounted) {
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // initial fetch
    fetchOrders();

    // poll every 5 seconds
    const intervalId = setInterval(fetchOrders, 5000);

    // cleanup on unmount
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div style={styles.page}>
      <div style={styles.cardWrapper}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>📦 My Orders</h2>
          <button
            onClick={() => (window.location.href = "/home")}
            style={styles.backBtn}
          >
            ← Back to Home
          </button>
        </div>

        {loading && <p style={styles.infoText}>Loading your orders...</p>}

        {!loading && orders.length === 0 && (
          <p style={styles.infoText}>You haven&apos;t placed any orders yet.</p>
        )}

        {!loading &&
          orders.length > 0 &&
          orders.map((order) => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <div style={styles.orderId}>Order #{order._id.slice(-6)}</div>
                  <div style={styles.orderDate}>
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <span style={styles.statusPill(order.status)}>
                  {order.status}
                </span>
              </div>

              <div style={styles.progressContainer}>
                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${getProgressPercent(order.status)}%`,
                    }}
                  />
                </div>
                <div style={styles.progressSteps}>
                  {["pending", "preparing", "ready", "completed"].map((step) => {
                    const isActive =
                      getProgressPercent(order.status) >= getProgressPercent(step);
                    return (
                      <span
                        key={step}
                        style={{
                          ...styles.progressStepLabel,
                          opacity: isActive ? 1 : 0.4,
                        }}
                      >
                        {step}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div style={styles.sectionTitle}>Items</div>
              <ul style={styles.itemList}>
                {order.items.map((item, idx) => (
                  <li key={idx} style={styles.itemRow}>
                    <span>{item.name}</span>
                    <span style={styles.itemQty}>× {item.quantity}</span>
                  </li>
                ))}
              </ul>

              <div style={styles.footerRow}>
                <span style={styles.totalLabel}>
                  Total items:{" "}
                  <strong>{order.totalItems ?? order.items.length}</strong>
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#faf7f2",
    padding: "30px 20px",
    fontFamily:
      "'Sora', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  cardWrapper: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "white",
    borderRadius: "16px",
    padding: "24px 24px 28px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    border: "1px solid #f3d9e5",
  },
  title: {
    margin: 0,
    marginBottom: "16px",
    fontSize: "22px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  backBtn: {
    padding: "6px 14px",
    background: "#f0e2d8",
    border: "1px solid #e2c7b8",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
  },
  infoText: {
    marginTop: "8px",
    fontSize: "14px",
    color: "#666",
  },
  orderCard: {
    borderRadius: "12px",
    border: "1px solid #f0e2d8",
    padding: "14px 16px",
    marginTop: "14px",
    background: "#fffbf7",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  orderId: {
    fontWeight: 600,
    marginBottom: "4px",
  },
  orderDate: {
    fontSize: "12px",
    color: "#777",
  },
  statusPill: (status) => {
    let bg = "#ffe5ec";
    let color = "#7a4444";

    if (status === "preparing") {
      bg = "#fff3cd";
      color = "#7c5a15";
    } else if (status === "ready") {
      bg = "#d4edda";
      color = "#21603c";
    } else if (status === "completed") {
      bg = "#cce5ff";
      color = "#205c99";
    } else if (status === "cancelled") {
      bg = "#f8d7da";
      color = "#842029";
    }

    return {
      padding: "4px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 600,
      textTransform: "capitalize",
      background: bg,
      color,
    };
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: 600,
    marginTop: "6px",
    marginBottom: "4px",
  },
  itemList: {
    listStyle: "none",
    paddingLeft: 0,
    margin: 0,
    marginBottom: "8px",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    padding: "2px 0",
  },
  itemQty: {
    color: "#555",
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#555",
  },
  totalLabel: {
    fontSize: "12px",
  },
  progressContainer: {
    marginTop: "6px",
    marginBottom: "8px",
  },
  progressTrack: {
    height: "6px",
    borderRadius: "999px",
    background: "#f0e2d8",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "#ff8ba7",
    transition: "width 0.3s ease",
  },
  progressSteps: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "4px",
  },
  progressStepLabel: {
    fontSize: "10px",
    textTransform: "capitalize",
    color: "#555",
  },
};
