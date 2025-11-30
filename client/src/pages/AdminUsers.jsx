import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUserById, updateUserRoleById } from "../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUsers();
      setUsers(res.data || []);
      setError("");
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setUpdatingId(id);
      await deleteUserById(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user. Check console for details.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "customer" : "admin";
    if (!window.confirm(`Change role from ${currentRole} → ${newRole}?`))
      return;

    try {
      setUpdatingId(id);
      const res = await updateUserRoleById(id, newRole);
      const updatedUser = res.data?.user;
      if (updatedUser) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: updatedUser.role } : u))
        );
      }
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update role. Check console for details.");
    } finally {
      setUpdatingId(null);
    }
  };

  const roleBadgeStyle = (role) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 600,
    background: role === "admin" ? "#ffe6f0" : "#e9f5ff",
    color: role === "admin" ? "#c2185b" : "#1565c0",
  });

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
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "24px 24px 28px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          border: "1px solid #f4d9e6",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <h2 style={{ margin: 0 }}>👥 Users</h2>
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
          Manage all <strong>registered BakeBuddy users</strong>. You can review
          their roles, promote customers to admins, or remove test accounts
          created during demos.
        </p>

        {loading && (
          <p style={{ color: "#999", fontSize: "14px" }}>Loading users…</p>
        )}
        {error && <p style={{ color: "#c0392b", fontSize: "13px" }}>{error}</p>}

        {!loading && users.length === 0 && !error && (
          <p style={{ color: "#777", fontSize: "13px" }}>
            No users found yet. Ask someone to register from the customer page.
          </p>
        )}

        {!loading && users.length > 0 && (
          <div
            style={{
              overflowX: "auto",
              marginTop: "10px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    background: "#fff7fb",
                    borderBottom: "1px solid #f2d7e6",
                  }}
                >
                  <th style={{ padding: "10px" }}>Name</th>
                  <th style={{ padding: "10px" }}>Email</th>
                  <th style={{ padding: "10px" }}>Role</th>
                  <th style={{ padding: "10px" }}>Joined</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    style={{
                      borderBottom: "1px solid #f4e4f0",
                    }}
                  >
                    <td style={{ padding: "10px" }}>{u.username}</td>
                    <td style={{ padding: "10px" }}>{u.email}</td>
                    <td style={{ padding: "10px" }}>
                      <span style={roleBadgeStyle(u.role)}>{u.role}</span>
                    </td>
                    <td style={{ padding: "10px", fontSize: "12px" }}>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <button
                        onClick={() => handleRoleChange(u._id, u.role)}
                        disabled={updatingId === u._id}
                        style={{
                          padding: "6px 10px",
                          marginRight: "8px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 600,
                          background:
                            u.role === "admin" ? "#ffe6f0" : "#e3f2fd",
                          color: u.role === "admin" ? "#c2185b" : "#1565c0",
                        }}
                      >
                        {u.role === "admin" ? "Demote" : "Promote"}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        disabled={updatingId === u._id}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 600,
                          background: "#ffe5e5",
                          color: "#c62828",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
