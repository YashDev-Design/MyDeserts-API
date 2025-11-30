import React, { useState } from "react";
import "../assets/css/auth.css";
import bg from "../assets/images/main_bg.jpg";
import api from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      // Save token + role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Redirect based on role
      if (res.data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/home";
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
        <h1 className="brand">🍰 BakeBuddy</h1>
        <p>Login to explore sweet treats.</p>
      </div>

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Welcome Back</h2>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <p>
            New here? <a href="/register">Create an account</a>
          </p>
        </form>

        <a
          href="/admin-login"
          className="admin-access"
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
          Admin Access
        </a>
      </div>
    </div>
  );
}

export default Login;
