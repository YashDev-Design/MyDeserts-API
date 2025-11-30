import React, { useEffect, useState } from "react";
import { fetchAdminAnalytics } from "../api";

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalCompletedOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAnalytics = async () => {
      try {
        const res = await fetchAdminAnalytics();
        if (!isMounted) return;
        setStats({
          totalCompletedOrders: res.data?.totalCompletedOrders || 0,
          totalRevenue: res.data?.totalRevenue || 0,
        });
        setError("");
      } catch (err) {
        console.error("Failed to load analytics:", err);
        if (isMounted) {
          setError("Failed to load analytics. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf7f2",
        fontFamily: "'Sora', sans-serif",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "24px 24px 28px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          border: "1px solid #f4d9e6",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "10px" }}>📊 Analytics</h2>
        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <button
            onClick={() => (window.location.href = "/admin")}
            style={{
              padding: "8px 16px",
              background: "#ff8ba7",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
        <p style={{ marginTop: 0, color: "#666", marginBottom: "20px" }}>
          Overview of <strong>completed BakeBuddy orders</strong>. These
          numbers update automatically based on orders marked as{" "}
          <strong>Completed</strong> in the Orders tab.
        </p>
        {loading && (
          <p style={{ marginTop: 0, color: "#999", marginBottom: "16px" }}>
            Loading analytics…
          </p>
        )}
        {error && (
          <p
            style={{
              marginTop: 0,
              marginBottom: "16px",
              color: "#c0392b",
              fontSize: "13px",
            }}
          >
            {error}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              background: "#fff7fb",
              border: "1px solid #f4d9e6",
            }}
          >
            <div style={{ fontSize: "12px", color: "#777" }}>
              Total Completed Orders
            </div>
            <div style={{ fontSize: "28px", fontWeight: "700" }}>
              {stats.totalCompletedOrders}
            </div>
            <div style={{ fontSize: "11px", color: "#aaa" }}>
              Count of orders marked as <strong>Completed</strong>.
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "14px",
              background: "#fdf6ff",
              border: "1px solid #ecd8ff",
            }}
          >
            <div style={{ fontSize: "12px", color: "#777" }}>Total Revenue</div>
            <div style={{ fontSize: "28px", fontWeight: "700" }}>
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <div style={{ fontSize: "11px", color: "#aaa" }}>
              Based on completed orders only (demo pricing).
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            padding: "14px",
            borderRadius: "12px",
            background:
              "linear-gradient(135deg, rgba(255,182,193,0.12), rgba(255,222,173,0.18))",
            border: "1px dashed #f3a4b3",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#555",
              lineHeight: 1.6,
            }}
          >
            💡 Tip: update order statuses in the <strong>Orders</strong> tab.
            Once an order is marked as <strong>Completed</strong>, it will be
            included in these analytics. This makes your demo feel like a real
            bakery dashboard with live KPIs.
          </p>
        </div>
      </div>
    </div>
  );
}