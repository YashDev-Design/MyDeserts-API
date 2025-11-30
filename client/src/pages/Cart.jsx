import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Cart() {
  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleQuantityChange = (index, delta) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    updateCart(updated);
  };

  const handleRemove = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    updateCart(updated);
  };

  const totalItems = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  const handlePlaceOrder = async () => {
    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setPlacing(true);
      await api.post("/orders", { items: cart });

      alert("Order placed successfully! 🎉");
      // clear cart
      updateCart([]);
      // go back to home
      navigate("/home");
    } catch (err) {
      console.error("Place order error:", err);
      alert(
        err.response?.data?.message ||
          "Could not place order. Please try again."
      );
    } finally {
      setPlacing(false);
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
          maxWidth: "800px",
          margin: "0 auto 20px auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>🛒 Your Cart</h2>
        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "8px 14px",
            borderRadius: "20px",
            border: "none",
            background: "#eee",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ⬅ Back to Menu
        </button>
      </header>

      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        {cart.length === 0 ? (
          <p>Your cart is empty. Add some treats from the menu 🍰</p>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {cart.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #f0e2d8",
                  }}
                >
                  <div>
                    <strong>{item.name}</strong>
                    <br />
                    <small style={{ color: "#666" }}>
                      {item.type} • {item.calories} cal
                    </small>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={() => handleQuantityChange(index, -1)}
                      style={qtyButtonStyle}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(index, +1)}
                      style={qtyButtonStyle}
                    >
                      +
                    </button>

                    <button
                      onClick={() => handleRemove(index)}
                      style={removeButtonStyle}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ margin: 0, fontWeight: 600 }}>
                Total Items: {totalItems}
              </p>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                style={{
                  padding: "10px 18px",
                  borderRadius: "20px",
                  border: "none",
                  background: placing ? "#ccc" : "#ff9a9e",
                  color: "white",
                  fontWeight: 600,
                  cursor: placing ? "default" : "pointer",
                }}
              >
                {placing ? "Placing..." : "Place Order"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const qtyButtonStyle = {
  padding: "4px 10px",
  borderRadius: "6px",
  border: "none",
  background: "#f0f0f0",
  cursor: "pointer",
  fontWeight: 600,
};

const removeButtonStyle = {
  padding: "4px 10px",
  borderRadius: "6px",
  border: "none",
  background: "#ff5d5d",
  color: "white",
  cursor: "pointer",
  fontWeight: 600,
};

export default Cart;
