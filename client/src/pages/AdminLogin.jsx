import React, { useState } from "react";
import "../assets/css/auth.css";
import bg from "../assets/images/main_bg.jpg";
import api from "../api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/admin", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "admin");

      alert("Welcome Admin!");
      window.location.href = "/admin";
    } catch (err) {
      alert(err.response?.data?.message || "Invalid admin credentials");
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="auth-left">
        <h1 className="brand">🛠️ Admin Panel</h1>
        <p>Restricted access — Authorized staff only.</p>
      </div>

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleAdminLogin}>
          <h2>Admin Login</h2>

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <p style={{ marginTop: "10px", opacity: 0.6 }}>
            Not for customer use.
          </p>
        </form>
        <a
          href="/login"
          className="customer-access"
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            padding: "10px 16px",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(6px)",
            borderRadius: "8px",
            color: "white",
            fontSize: "13px",
            fontWeight: "600",
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.3)",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(0,0,0,0.7)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(0,0,0,0.5)";
          }}
        >
          Be a Customer
        </a>
      </div>
    </div>
  );
}

export default AdminLogin;
