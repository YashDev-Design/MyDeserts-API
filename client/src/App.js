import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import api from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import CustomerHome from "./pages/CustomerHome";
import Cart from "./pages/Cart";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import MyOrders from "./pages/MyOrders";

// ---------- Admin Dashboard UI ----------
function AdminApp() {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const [form, setForm] = React.useState({ name: "", type: "", calories: "" });
  const [editId, setEditId] = React.useState(null);

  const fetchData = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/products/${editId}`, form);
      setEditId(null);
    } else {
      await api.post("/products", form);
    }
    setForm({ name: "", type: "", calories: "" });
    fetchData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    fetchData();
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      type: p.type,
      calories: p.calories,
    });
    setEditId(p._id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/admin-login";
  };

  const menuButtonStyle = {
    padding: "10px 18px",
    borderRadius: "20px",
    border: "none",
    background: "#f3f3f3",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "0.2s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#faf7f2",
        fontFamily: "'Sora', sans-serif",
        overflowX: "hidden",
      }}
    >
      <header
        style={{
          width: "100%",
          padding: "15px 30px",
          background: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "0 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>🍰 BakeBuddy Admin</h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "nowrap",
              maxWidth: "100%",
              justifyContent: "flex-end",
              overflow: "visible",
            }}
          >
            <button style={menuButtonStyle}>Products</button>
            <button
              style={menuButtonStyle}
              onClick={() => navigate("/admin/orders")}
            >
              Orders
            </button>
            <button
              style={menuButtonStyle}
              onClick={() => navigate("/admin/users")}
            >
              Users
            </button>
            <button
              style={menuButtonStyle}
              onClick={() => navigate("/admin/analytics")}
            >
              Analytics
            </button>
            <button
              style={{ ...menuButtonStyle, background: "#ffe0e0" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: "900px",
          margin: "auto",
          padding: "40px 20px",
        }}
      >
        <section
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "25px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            border: "1px solid #f8d9e6",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            {editId ? "✏ Update Product" : "➕ Add New Product"}
          </h3>

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />

            <input
              placeholder="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={inputStyle}
            />

            <input
              placeholder="Calories"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
              style={inputStyle}
            />

            <button style={submitButtonStyle}>
              {editId ? "Save Changes" : "Add Product"}
            </button>
          </form>
        </section>

        <h3 style={{ marginTop: "40px" }}>📋 Menu Items</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          {products.map((p) => (
            <div key={p._id} style={productCardStyle}>
              <div>
                <strong style={{ fontSize: "18px" }}>{p.name}</strong>
                <br />
                <small style={{ color: "#666" }}>
                  {p.type} • {p.calories} cal
                </small>
              </div>

              <div>
                <button onClick={() => handleEdit(p)} style={editButtonStyle}>
                  ✏ Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  style={deleteButtonStyle}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const submitButtonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "8px",
  background: "linear-gradient(90deg,#ff9a9e,#fad0c4)",
  border: "none",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px",
};

const productCardStyle = {
  background: "white",
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid #ececec",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  minHeight: "120px",
};

const editButtonStyle = {
  padding: "8px 14px",
  borderRadius: "6px",
  background: "#FFCB3C",
  border: "none",
  cursor: "pointer",
  marginRight: "10px",
  fontWeight: "600",
};

const deleteButtonStyle = {
  padding: "8px 14px",
  borderRadius: "6px",
  background: "#FF5D5D",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};

// ---------- FRONTEND GUARD ----------
const RequireAdmin = ({ children }) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (role !== "admin" || !token) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default: send to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Customer Home */}
        <Route path="/home" element={<CustomerHome />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminApp />
            </RequireAdmin>
          }
        />

        {/* Admin Orders Page */}
        <Route
          path="/admin/orders"
          element={
            <RequireAdmin>
              <AdminOrders />
            </RequireAdmin>
          }
        />

        {/* Admin Users Page */}
        <Route
          path="/admin/users"
          element={
            <RequireAdmin>
              <AdminUsers />
            </RequireAdmin>
          }
        />

        {/* Admin Analytics Page */}
        <Route
          path="/admin/analytics"
          element={
            <RequireAdmin>
              <AdminAnalytics />
            </RequireAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
