import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function CustomerHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products", err);
        setError("Failed to load menu. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    try {
      const existing = JSON.parse(localStorage.getItem("cart") || "[]");

      const index = existing.findIndex((item) => item.product === product._id);

      if (index > -1) {
        existing[index].quantity += 1;
      } else {
        existing.push({
          product: product._id,
          name: product.name,
          type: product.type,
          calories: product.calories,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(existing));
      alert("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart", err);
      alert("Could not add to cart. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fffaf5",
        padding: "30px 20px",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <header
        style={{
          maxWidth: "1000px",
          margin: "0 auto 20px auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>🍰 BakeBuddy</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => navigate("/cart")}
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              border: "none",
              background: "#ffcb3c",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            View Cart
          </button>
          <button
            onClick={() => navigate("/my-orders")}
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              border: "none",
              background: "#8e44ad",
              cursor: "pointer",
              fontWeight: 600,
              color: "white",
            }}
          >
            My Orders
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("cart");
              navigate("/login");
            }}
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              border: "none",
              background: "#e74c3c",
              cursor: "pointer",
              fontWeight: 600,
              color: "white",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <h3>Today&apos;s Menu</h3>

        {loading && <p>Loading menu...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {products.map((p) => (
              <div
                key={p._id}
                style={{
                  background: "white",
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  border: "1px solid #f0e2d8",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "140px",
                }}
              >
                <div>
                  <strong style={{ fontSize: "18px" }}>{p.name}</strong>
                  <br />
                  <small style={{ color: "#666" }}>{p.type}</small>
                  <p style={{ marginTop: "8px", fontWeight: "600" }}>
                    {p.calories} cal
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(p)}
                  style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#ff9a9e",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ➕ Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerHome;